#!/bin/bash
# Shared firewall logic for DevContainers.
# Called via init-firewall.sh wrappers that set configuration variables.
#
# Required variables (set by caller before sourcing):
#   FIREWALL_DOMAINS      - Space-separated list of allowed domains
#   FIREWALL_VERIFY_URL   - URL for positive connectivity verification
#   FIREWALL_VERIFY_NAME  - Human-readable name for verification output
#   FIREWALL_ALLOW_SSH    - "true" to allow outbound SSH (port 22)
#   FIREWALL_ALLOW_GITHUB - "true" to allow the GitHub web, API, and git IP ranges

set -euo pipefail
IFS=$'\n\t'

# Validate required variables
for var in FIREWALL_DOMAINS FIREWALL_VERIFY_URL FIREWALL_VERIFY_NAME FIREWALL_ALLOW_SSH FIREWALL_ALLOW_GITHUB; do
    if [ -z "${!var:-}" ]; then
        echo "ERROR: Required variable $var is not set"
        exit 1
    fi
done

# 1. Extract Docker DNS info BEFORE any flushing
DOCKER_DNS_RULES=$(iptables-save -t nat | grep "127\.0\.0\.11" || true)

# Reset default policies to ACCEPT before flushing for idempotent reruns.
# On rerun, previous DROP policies would block bootstrap curl otherwise.
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
ip6tables -P INPUT ACCEPT 2>/dev/null || true
ip6tables -P FORWARD ACCEPT 2>/dev/null || true
ip6tables -P OUTPUT ACCEPT 2>/dev/null || true

# Flush existing rules and delete existing ipsets
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
ip6tables -F 2>/dev/null || true
ip6tables -X 2>/dev/null || true
ipset destroy allowed-domains 2>/dev/null || true

# 2. Selectively restore ONLY internal Docker DNS resolution
if [ -n "$DOCKER_DNS_RULES" ]; then
    echo "Restoring Docker DNS rules..."
    iptables -t nat -N DOCKER_OUTPUT 2>/dev/null || true
    iptables -t nat -N DOCKER_POSTROUTING 2>/dev/null || true
    echo "$DOCKER_DNS_RULES" | grep '^-A ' | while read -r rule; do
        IFS=' ' read -ra args <<< "$rule"
        iptables -t nat "${args[@]}"
    done
else
    echo "No Docker DNS rules to restore"
fi

# Allow DNS and localhost before any restrictions
DNS_SERVER=$(awk '/^nameserver/ {print $2; exit}' /etc/resolv.conf)
if [ -z "$DNS_SERVER" ]; then
    echo "ERROR: Failed to detect DNS server"
    exit 1
fi
echo "Using DNS server: $DNS_SERVER"
iptables -A OUTPUT -p udp -d "$DNS_SERVER" --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp -d "$DNS_SERVER" --dport 53 -j ACCEPT

# Allow outbound SSH if configured
if [ "$FIREWALL_ALLOW_SSH" = "true" ]; then
    iptables -A OUTPUT -p tcp --dport 22 -j ACCEPT
fi

# Allow localhost
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Create ipset with CIDR support
ipset create allowed-domains hash:net

if [ "$FIREWALL_ALLOW_GITHUB" = "true" ]; then
    # Fetch GitHub meta information and aggregate + add their IP ranges
    echo "Fetching GitHub IP ranges..."
    gh_ranges=$(curl -s --connect-timeout 10 --max-time 30 https://api.github.com/meta)
    if [ -z "$gh_ranges" ]; then
        echo "ERROR: Failed to fetch GitHub IP ranges"
        exit 1
    fi

    if ! echo "$gh_ranges" | jq -e '.web and .api and .git' >/dev/null; then
        echo "ERROR: GitHub API response missing required fields"
        exit 1
    fi

    echo "Processing GitHub IPs..."
    while read -r cidr; do
        # Skip IPv6 ranges (IPv4 firewall only)
        if [[ "$cidr" == *:* ]]; then
            continue
        fi
        if [[ ! "$cidr" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/[0-9]{1,2}$ ]]; then
            echo "ERROR: Invalid CIDR range from GitHub meta: $cidr"
            exit 1
        fi
        echo "Adding GitHub range $cidr"
        ipset add allowed-domains "$cidr" -exist
    done < <(echo "$gh_ranges" | jq -r '(.web + .api + .git)[]' | aggregate -q)
fi

# Resolve and add allowed domains
IFS=' ' read -ra domains <<< "$FIREWALL_DOMAINS"
for domain in "${domains[@]}"; do
    echo "Resolving $domain..."
    ips=$(dig +noall +answer A "$domain" | awk '$4 == "A" {print $5}')
    if [ -z "$ips" ]; then
        echo "ERROR: Failed to resolve $domain"
        exit 1
    fi

    while read -r ip; do
        if [[ ! "$ip" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
            echo "ERROR: Invalid IP from DNS for $domain: $ip"
            exit 1
        fi
        echo "Adding $ip for $domain"
        ipset add allowed-domains "$ip" -exist
    done < <(echo "$ips")
done

# Get host IP from default route
HOST_IP=$(ip route | grep default | cut -d" " -f3)
if [ -z "$HOST_IP" ]; then
    echo "ERROR: Failed to detect host IP"
    exit 1
fi

echo "Host gateway detected as: $HOST_IP"

# Accept inbound TCP from the gateway only. The published ports in devcontainer.json decide which ports the host reaches.
# Other containers on the bridge stay unreachable.
iptables -A INPUT -s "$HOST_IP/32" -p tcp -j ACCEPT

# Set default policies to DROP
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# IPv6: allow loopback only (required for Chrome/ChromeDriver localhost communication)
ip6tables -A INPUT -i lo -j ACCEPT 2>/dev/null || true
ip6tables -A OUTPUT -o lo -j ACCEPT 2>/dev/null || true
ip6tables -P INPUT DROP 2>/dev/null || true
ip6tables -P FORWARD DROP 2>/dev/null || true
ip6tables -P OUTPUT DROP 2>/dev/null || true

# Allow only specific outbound traffic to allowed domains
iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT

# Explicitly REJECT all other outbound traffic for immediate feedback
iptables -A OUTPUT -j REJECT --reject-with icmp-admin-prohibited

echo "Firewall configuration complete"
echo "Verifying firewall rules..."
if curl --connect-timeout 5 https://example.com >/dev/null 2>&1; then
    echo "ERROR: Firewall verification failed - was able to reach https://example.com"
    exit 1
else
    echo "Firewall verification passed - unable to reach https://example.com as expected"
fi

if ! curl --connect-timeout 5 "$FIREWALL_VERIFY_URL" >/dev/null 2>&1; then
    echo "ERROR: Firewall verification failed - unable to reach $FIREWALL_VERIFY_NAME"
    exit 1
else
    echo "Firewall verification passed - able to reach $FIREWALL_VERIFY_NAME as expected"
fi

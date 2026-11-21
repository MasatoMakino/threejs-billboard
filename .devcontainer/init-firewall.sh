#!/bin/bash
# npm runner firewall configuration
FIREWALL_ALLOW_SSH=false
# package-lock.json resolves every package from the npm registry
FIREWALL_ALLOW_GITHUB=false

FIREWALL_DOMAINS="registry.npmjs.org"

FIREWALL_VERIFY_URL="https://registry.npmjs.org/"
FIREWALL_VERIFY_NAME="npm registry"
source /usr/local/bin/firewall-base.sh

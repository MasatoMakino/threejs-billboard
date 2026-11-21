FROM node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54

ENV DEBIAN_FRONTEND=noninteractive
# The Debian packages pair chromium-driver with chromium, so tests need no driver download.
ENV CHROME_BIN=/usr/bin/chromium \
    CHROMEDRIVER_BIN=/usr/bin/chromedriver

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        sudo \
        iptables ipset iproute2 dnsutils aggregate jq \
        chromium \
        chromium-driver \
    ; \
    rm -rf /var/lib/apt/lists/*

COPY firewall-base.sh /usr/local/bin/
COPY init-firewall.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/firewall-base.sh /usr/local/bin/init-firewall.sh && \
    echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall && \
    chmod 0440 /etc/sudoers.d/node-firewall

# Docker copies this ownership into the empty node_modules volume on the first mount.
ARG WORKSPACE_DIR
RUN test -n "$WORKSPACE_DIR" && \
    mkdir -p "$WORKSPACE_DIR/node_modules" && \
    chown node:node "$WORKSPACE_DIR/node_modules"

RUN node --version && npm --version && chromium --version && chromedriver --version

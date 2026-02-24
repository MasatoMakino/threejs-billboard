---
name: chrome-shm-sizing
description: Chrome shared memory sizing reference for DevContainer. Use when adjusting --shm-size, debugging Chrome crashes in containers, or reviewing browser test infrastructure.
allowed-tools: Read
---

# Chrome Shared Memory Sizing

Reference for `--shm-size` configuration in this project's DevContainer environments.

---

## Current Configuration

| Parameter | Value |
|-----------|-------|
| `--shm-size` | `2g` |
| Verified minimum | `1g` (all tests pass) |
| Safety margin | 2x |

### Configuration Locations

- `.devcontainer/devcontainer.json` - npm Runner container
- `.devcontainer/claude/devcontainer.json` - Claude Code Sandbox container

---

## Sizing Rationale

- **1GB**: Sufficient for the full test suite as of 2026-02-24 (commit `a524153`)
- **2GB**: Chosen to provide 2x margin for future test suite growth

---

## Background

Chrome uses `/dev/shm` (shared memory) for inter-process communication between browser and renderer processes. Docker containers default to 64MB for `/dev/shm`, which is insufficient for Chrome and causes:

- Tab crashes (`SIGBUS` errors)
- Renderer process termination
- Flaky test failures

---

## Review Triggers

Re-evaluate the sizing when:

- Browser tests become flaky with memory-related errors
- Test suite grows significantly (e.g., adding many screenshot tests)
- Chrome major version upgrades change memory requirements

---

**Baseline**: 2026-02-24 / `a524153`

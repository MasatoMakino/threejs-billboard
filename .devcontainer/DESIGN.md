# DevContainer design notes

The container runs third-party package code. The configuration keeps that code away from code execution on the host and from directories above the project. The project is public, so the configuration does not try to keep the source in the container.

## Read-only mounts

The container mounts `.git`, `.devcontainer`, `.github`, `.claude`, `.vscode`, `CLAUDE.md`, and `AGENTS.md` read-only. The host runs or loads these files (git hooks, git config, the container configuration, CI workflows, agent settings and instructions, editor tasks and settings). The workspace stays writable for `pnpm add` and for the `prettier --write` pre-commit hook.

When the repository has `.npmrc`, the container also mounts it read-only: the host `npm` reads it, and it can hold tokens. A repository without `.npmrc` has no such line, because a bind mount needs its source. A single-file bind mount keeps the inode that it mounted, so the container sees a host edit that replaces the file only after the container is recreated.

## pnpm settings

The image sets `pnpm_config_ignore_scripts` and `pnpm_config_ignore_pnpmfile`. Code that a dependency plants in the workspace (a root lifecycle script or `.pnpmfile.cjs`) does not run on the next install. `pnpm run` still runs the named script.

`postCreateCommand` starts the firewall before `pnpm install`, so the install never runs with the host services reachable.

## node_modules volume

`node_modules` lives in a named volume, so package code never lands on the host file system. The host IDE does not resolve the dependencies. pnpm puts its store at the root of the volume, next to the packages.

The Dockerfile creates the mount point owned by `node`. Docker copies that ownership into the empty volume on the first mount.

## Default seccomp profile

The container keeps the Docker default seccomp profile, which blocks unprivileged user namespaces. User namespaces open kernel attack surface that can lead to a container escape. Chromium needs user namespaces for its sandbox, so the tests run Chromium with `--no-sandbox`. Chromium only loads the project code and its dependencies, which Node already runs.

## Firewall

Outbound traffic goes only to DNS and the allowlisted domains. The host services on `127.0.0.1` (reachable through `host.docker.internal`) and the other containers on the Docker bridge stay unreachable. Inbound TCP is accepted only from the gateway. The published ports in `devcontainer.json` decide which container ports the host reaches.

## Worktrees

Each worktree gets its own container. Put a worktree in `.claude/worktrees/`, or outside the project, and run `devcontainer up --workspace-folder <worktree>`. A worktree elsewhere in the project is writable from the container of the main tree, and its `.git` file, `.claude`, and `CLAUDE.md` would reach the host. `.claude/worktrees/` is inside the read-only `.claude` mount.

The container name and the `node_modules` volume include `${devcontainerId}`, which the devcontainer CLI derives from the folder path. Worktrees with the same folder name in other projects get their own volumes. The git hooks find the container by its `devcontainer.local_folder` label.

To remove a worktree, remove its container and volume first:

```bash
C=$(docker ps -aq --filter label=devcontainer.local_folder=<worktree>)
V=$(docker inspect -f '{{range .Mounts}}{{if eq .Type "volume"}}{{.Name}} {{end}}{{end}}' "$C")
docker rm -f "$C"
docker volume rm $V
git worktree remove <worktree>
```

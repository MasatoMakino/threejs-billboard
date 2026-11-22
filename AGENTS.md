# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Development commands

Run every pnpm, npm, and npx command in the DevContainer, not on the host. The DevContainer (`.devcontainer/devcontainer.json`) provides Node 26 and the Chromium that the browser tests need.

Each worktree has its own DevContainer. In a new worktree, run `devcontainer up --workspace-folder .` once before the other commands.

Run a script of `package.json` as `devcontainer exec --workspace-folder . pnpm run <script>`. The `scripts` field lists the build, test, coverage, demo, and dev server commands.

```bash
# Start the DevContainer
devcontainer up --workspace-folder .

# Lint and format the code
devcontainer exec --workspace-folder . pnpm exec biome check --write
```

### Demo pages

- Demo source files in `demoSrc/` import the library from `../esm/index.js`, the built ESM output
- Reference images with `import` (`import map01Url from "./map01.png"`). Vite bundles only the assets that a demo imports
- Do not edit the files in `docs/`. Change the source files in `demoSrc/` instead

## Development rules and guidelines

### Git and GitHub workflow

- **Branch strategy**: GitHub Flow. Create feature branches from `main`, and merge them through pull requests
- **Branch naming**: `type/[issue-number-]purpose`
  - Types: `feature/`, `fix/`, `test/`, `maintain/`, `perf/`, `docs/`
  - Examples: `feature/issue-123-add-user-profile`, `fix/resolve-login-bug`
- **Main branch**: Do not commit or push to `main` directly
- **GitHub Pages**: GitHub Actions deploys the pages through the `github-pages` environment. Do not deploy manually
- **Git commands**: Use the `--no-pager` option before the subcommand (`git --no-pager log`)
- **Pull request text**: Do not escape newlines in `gh pr create` commands

### TypeScript coding standards

- **Imports**: Use named exports from module roots (`import { Container } from 'pixi.js'`)
- **Local imports**: Include the `.js` extension for ESM compatibility (`import { func } from './file.js'`)
- **Async initialization**: Use `init()` methods for async setup, not constructors
- **Type safety**: Avoid `as any` casts. Redesign the types instead
- **Documentation**: Write detailed JSDoc comments for all public APIs
- **Resource management**: Implement cleanup and disposal for every resource

### PixiJS v8 rules

- **Import style**: Use the `pixi.js` package, not the `@pixi/*` scoped packages
- **Application init**: Use `await app.init(options)` instead of constructor options
- **Graphics API**: Use `graphics.rect().fill()` instead of `beginFill()`
- **Particles**: Use `ParticleContainer` with the `Particle` class, not `Sprite`
- **Texture loading**: Use `Assets.load()` before `Texture.from()`

### Directory structure

- **Source**: `src/`, the TypeScript source files
- **Tests**: `__test__/`, the test files
- **Demos**: `demoSrc/`, the demo source files
- **Build output**: `esm/`, the compiled JavaScript and declarations
- **Generated**: `docs/`, the demo pages that `pnpm run demo` builds. Do not edit

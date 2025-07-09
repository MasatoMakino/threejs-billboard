# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Test
- `npm run build` - Build TypeScript and generate demo pages
- `npm run buildTS` - Compile TypeScript to ESM in ./esm directory
- `npm test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Run tests with coverage reporting

### Development Server
- `npm run start:dev` - Start development server with file watching
- `npm run server` - Start browser-sync server for demo pages
- `npm run demo` - Generate demo pages using gulptask-demo-page

### Demo Page Generation
The `npm run demo` command automatically scans `demoSrc/` directory for JavaScript files with `demo_` prefix and generates corresponding HTML files in `docs/demo/`. Key points:
- Each `demo_*.js` file in `demoSrc/` becomes a `demo_*.html` file in `docs/demo/`
- Generated HTML includes `<canvas id="webgl-canvas" width="640" height="480"></canvas>` by default
- Demo source files should import from `../esm/index.js` (the built ESM output)
- Never manually edit files in `docs/` directory - modify source files in `demoSrc/` instead

### Code Quality
- `biome check --write` - Lint and format code (configured in biome.json)
- Files are automatically formatted on commit via lint-staged

## Project Architecture

### Core Billboard Types
This library provides three main approaches to billboard rendering:

1. **Image-based Classes** (`BillBoard`, `BillBoardPlane`)
   - Use image files directly as texture source
   - Simple to use for static images
   - Located in `src/BillBoard.ts` and `src/BillBoardPlane.ts`

2. **SharedStage Classes** (`SharedStageBillboard`, `SharedStagePlaneMesh`)
   - Utilize single shared Canvas/Texture across multiple billboards
   - Excellent for reducing draw calls with fixed number of billboards
   - Core implementation in `src/SharedStageTexture.ts`
   - Billboard: `src/SharedStageBillboard.ts`
   - Plane mesh: `src/SharedStagePlaneMesh.ts`

3. **MultiView Classes** (`MultiViewPixiBillboard`, `MultiViewPixiPlaneMesh`)
   - Each instance has independent Canvas using PixiJS v8 multiView
   - Superior performance for partial updates and flexible billboard count
   - Manager: `src/PixiMultiViewManager.ts`
   - Billboard: `src/MultiViewPixiBillboard.ts`
   - Plane mesh: `src/MultiViewPixiPlaneMesh.ts`

### Key Utilities
- `ScaleCalculator` - Calculates appropriate scaling for dot-by-dot display
- `CameraChaser` - Makes plane meshes track camera rotation (Y-axis only)
- `BillBoardController` - Base controller for billboard behavior

### Dependencies
- **three.js**: Core 3D rendering (peer dependency >=0.126.0 <1.0.0)
- **pixi.js**: Canvas rendering for MultiView classes (peer dependency ^8.4.0)
- **TypeScript**: ES2015 target, ES2022 modules, strict mode enabled
- **Vitest**: Testing with browser environment via WebDriverIO

### Build Output
- Source: `src/` directory with TypeScript files
- Built: `esm/` directory with compiled JS and declaration files
- Demo: `docs/demo/` directory with generated HTML demos
- Tests: `__test__/` directory with .spec.ts files

### Testing
- Uses Vitest with browser testing via WebDriverIO
- Tests run in Chrome headless mode
- Coverage reports generated with Istanbul provider
- Screenshot testing available for visual regression
- Test files located in `__test__/` directory
- Screenshots auto-generated in `__test__/__screenshots__/` (do not edit manually)

## Development Rules and Guidelines

### Git and GitHub Workflow
- **Branch Strategy**: GitHub Flow - create feature branches from `main`, use pull requests for merging
- **Branch Naming**: `type/[issue-number-]purpose` format
  - Types: `feature/`, `fix/`, `test/`, `maintain/`, `perf/`, `docs/`
  - Examples: `feature/issue-123-add-user-profile`, `fix/resolve-login-bug`
- **Main Branch**: Direct commits/pushes to `main` are prohibited
- **gh-pages Branch**: Auto-managed by GitHub Actions for docs deployment - do not edit manually
- **Git Commands**: Always use `--no-pager` option (e.g., `git log --no-pager`)
- **Pull Request Text**: Do not escape newlines in `gh pr create` commands

### TypeScript Coding Standards
- **Imports**: Use named exports from module roots (`import { Container } from 'pixi.js'`)
- **Local Imports**: Include `.js` extension for ESM compatibility (`import { func } from './file.js'`)
- **Async Initialization**: Use `init()` methods for async setup, not constructors
- **Type Safety**: Avoid `as any` casts - redesign types instead
- **Documentation**: Write detailed TypeDoc comments for all public APIs
- **Resource Management**: Implement proper cleanup and disposal patterns

### PixiJS v8 Specific Rules
- **Import Style**: Use `pixi.js` package, not `@pixi/*` scoped packages
- **Application Init**: Use `await app.init(options)` instead of constructor options
- **Graphics API**: Use new syntax - `graphics.rect().fill()` instead of `beginFill()`
- **Particles**: Use `ParticleContainer` with `Particle` class, not `Sprite`
- **Texture Loading**: Use `Assets.load()` before `Texture.from()`

### Directory Structure Rules
- **Source**: `src/` - main TypeScript source files
- **Tests**: `__test__/` - test files and auto-generated screenshots
- **Demos**: `demoSrc/` - demo source files (import from `../esm/index.js`)
- **Build Output**: `esm/` - compiled JavaScript and declarations
- **Generated**: `docs/` - auto-generated demo pages and API docs (do not edit)
- **Memory**: `_memory/` - temporary workspace for AI agents
- **Rules**: `.clinerules/` - AI agent guidance files
---
name: pixijs-ticker-testing
description: PixiJS Ticker test patterns and pitfalls. Use when writing or debugging tests that involve PixiJS Ticker updates.
allowed-tools: Read
---

# PixiJS Ticker Test Guidelines

## Key Concept

`ticker.update()` argument is **absolute time**, not relative time.

- Calling multiple times with the same value ignores subsequent calls
- The ticker only fires when a larger value is passed
- When called without arguments, `ticker.update()` uses `performance.now()` as default
- Reference: https://pixijs.download/release/docs/ticker.Ticker.html#update

---

## Test Patterns

### Pre-test Reset

```typescript
beforeEach(async () => {
  ticker = new Ticker();
  ticker.autoStart = false;

  // ... manager initialization ...

  ticker.stop();
  ticker.update(0); // Reset to time 0
});
```

### Single and Multiple Updates

```typescript
// Single update with explicit time
ticker.update(1);

// Multiple updates: always increment absolute time
ticker.update(1);
ticker.update(2); // Must be larger than 1
ticker.update(3); // Must be larger than 2
```

### Loop Usage

```typescript
// Correct: incremental time
for (let i = 0; i < 60; i++) {
  manager.requestRender(billboard);
  ticker.update(i + 1); // 1, 2, 3, ...
}

// WRONG: same time - only fires on first iteration
for (let i = 0; i < 60; i++) {
  manager.requestRender(billboard);
  ticker.update(1); // Ignored after first call!
}
```

### Batch Processing

```typescript
if (i % 10 === 9) {
  ticker.update(Math.floor(i / 10) + 1); // Increment per batch
}

// Final render
ticker.update(100); // Sufficiently large value
```

---

## Why Explicit Time Values?

Using explicit time values (e.g., `ticker.update(1)`, `ticker.update(2)`) instead of `performance.now()` provides:

- **Predictable behavior**: Consistent across environments
- **Deterministic results**: Same input always produces same output
- **Debugging ease**: Easy to trace which update call caused an issue
- **Performance**: No dependency on system clock resolution

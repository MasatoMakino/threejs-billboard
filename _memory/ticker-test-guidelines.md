# Ticker Test Guidelines

## Key Points

### ticker.update() argument is absolute time
- The argument in `ticker.update(1)` represents **absolute time**, not relative time
- Calling multiple times with the same value will ignore subsequent calls
- The ticker only fires when a larger value is passed
- **Important**: When called without arguments, `ticker.update()` uses `performance.now()` as the default value
- Reference: https://pixijs.download/release/docs/ticker.Ticker.html#update

## Test Patterns

### 1. Pre-test reset
```typescript
beforeEach(async () => {
  ticker = new Ticker();
  ticker.autoStart = false;
  
  // ... manager initialization ...
  
  ticker.stop();
  ticker.update(0);  // Reset to time 0
});
```

### 2. Test-time updates
```typescript
// Single update with explicit time
ticker.update(1);

// Multiple updates (increment absolute time)
ticker.update(1);
ticker.update(2);  // Value larger than 1
ticker.update(3);  // Value larger than 2

// Using performance.now() (not recommended for tests due to unpredictability)
ticker.update();   // Uses performance.now() internally
```

### 3. Loop usage
```typescript
// Correct way: incremental time
for (let i = 0; i < 60; i++) {
  manager.requestRender(billboard);
  ticker.update(i + 1);  // 1, 2, 3, ...
}

// Wrong way: same time
for (let i = 0; i < 60; i++) {
  manager.requestRender(billboard);
  ticker.update(1);  // Only fires on first iteration
}
```

### 4. Batch processing usage
```typescript
if (i % 10 === 9) {
  ticker.update(Math.floor(i / 10) + 1);  // Increment per batch
}

// Final render
ticker.update(100);  // Sufficiently large value
```

## Why explicit time values in tests?

Using explicit time values in tests (like `ticker.update(1)`, `ticker.update(2)`) instead of relying on `performance.now()` provides:
- **Predictable behavior**: Tests run consistently across different environments
- **Deterministic results**: Same input always produces same output
- **Debugging ease**: Easy to trace which update call caused an issue
- **Performance**: No dependency on system clock resolution

## Fixed Examples

### Before (problematic)
```typescript
ticker.update(1);
// Some processing
ticker.update(1);  // This will be ignored!
```

### After (correct)
```typescript
ticker.update(1);
// Some processing  
ticker.update(2);  // This will fire correctly
```
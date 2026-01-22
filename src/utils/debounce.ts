export class DebounceManager {
  private debounceTimers = new Map<string, NodeJS.Timeout>();

  debounce(
    key: string,
    callback: () => void,
    delay: number
  ): void {
    const existing = this.debounceTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    const timeout = setTimeout(() => {
      this.debounceTimers.delete(key);
      callback();
    }, delay);

    this.debounceTimers.set(key, timeout);
  }

  clear(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }
}
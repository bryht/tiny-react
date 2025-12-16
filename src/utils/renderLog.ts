/**
 * Global render tracker for debugging component renders
 */

// Global render tracker with TypeScript types
const renderLog = {
  messages: [] as RenderLogMessage[],
  log(component: string, reason: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const msg = `[${timestamp}] ${component}: ${reason}`;
    this.messages.push({ timestamp, component, reason, message: msg });
    console.log(msg);
    if (this.messages.length > 20) {
      this.messages.shift();
    }
  },
  getLast(n: number): string[] {
    return this.messages.slice(-n).reverse().map((m) => m.message);
  },
};

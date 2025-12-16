/**
 * TinyReact Performance Demo - Main Application
 * Demonstrates: useState, useEffect, useCallback, useMemo, memo
 */

// Main App component
function App(): any {
  const [showPerf, setShowPerf] = TinyReact.useState(true);

  return h(
    "div",
    { style: "font-family: Arial; margin: 20px; max-width: 800px;" },
    h("h1", {}, "⚡ React Performance Optimizations"),
    h("p", {}, "👀 Watch the console below as you interact with components"),
    h("p", { style: "font-size: 12px; color: #666;" }, "✨ Built with TypeScript for better type safety!"),
    h(ConsoleDisplay, {}),
    h(
      "button",
      {
        onClick: () => setShowPerf(!showPerf),
        style: "margin: 20px 0; padding: 12px 24px; font-size: 16px; background: #673ab7; color: white; border: none; cursor: pointer; border-radius: 5px; font-weight: bold;",
      },
      showPerf ? "⬇️ Hide Examples" : "⬆️ Show Examples"
    ),
    showPerf
      ? h(
          "div",
          {},
          h(ExpensiveCalculator, {}),
          h(CallbackOptimization, {}),
          h(StateOptimization, {}),
          h(OptimizedList, {}),
        )
      : null
  );
}

// Render the app
const root = TinyReact.createRoot(document.getElementById("root")!);
root.render(h(App, {}));

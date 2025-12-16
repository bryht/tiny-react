/**
 * TinyReact Performance Demo - TypeScript Version
 * Demonstrates: useState, useEffect, useCallback, useMemo, memo
 * Using JSX-style h() syntax
 */

// Access global TinyReact from window
declare const TinyReact: typeof import('./tiny-react').TinyReact;
declare const h: typeof import('./tiny-react').h;
declare const Fragment: typeof import('./tiny-react').Fragment;

// Type definitions
interface RenderLogMessage {
  timestamp: string;
  component: string;
  reason: string;
  message: string;
}

interface Todo {
  id: number;
  text: string;
}

interface Item {
  id: number;
  name: string;
}

interface User {
  name: string;
  age: number;
}

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

// Expensive computation example
function ExpensiveCalculator(): any {
  const [count, setCount] = TinyReact.useState(0);
  const [factor, setFactor] = TinyReact.useState(1);

  const expensiveResult = TinyReact.useMemo(() => {
    renderLog.log("ExpensiveCalculator.useMemo", "computing expensive calculation...");
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += i;
    }
    const computed = result * count * factor;
    renderLog.log("ExpensiveCalculator.useMemo", `✅ computed: ${computed}`);
    return computed;
  }, [count]);

  return h(
    "div",
    { style: "border: 2px solid purple; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f3e5f5;" },
    h("h2", {}, "useMemo: Expensive Calculator"),
    h("p", {}, `Count: ${count}, Factor: ${factor}`),
    h("p", { style: "color: green; font-weight: bold; font-size: 18px;" }, `Result: ${expensiveResult}`),
    h("p", { style: "font-size: 12px; color: gray;" }, "👉 Change FACTOR (no recompute) vs COUNT (recomputes)"),
    h(
      "button",
      { onClick: () => setCount(count + 1), style: "margin-right: 10px; padding: 8px 15px; background: #9c27b0; color: white; border: none; cursor: pointer; border-radius: 3px;" },
      "Increment Count"
    ),
    h(
      "button",
      { onClick: () => setFactor(factor + 1), style: "padding: 8px 15px; background: #9c27b0; color: white; border: none; cursor: pointer; border-radius: 3px;" },
      "Increment Factor (No Recompute!)"
    )
  );
}

// Memoized button
const MemoButton = TinyReact.memo(
  ({ label, onClick, color }: { label: string; onClick: () => void; color: string }): any => {
    renderLog.log(`MemoButton[${label}]`, "✨ rendered");
    return h(
      "button",
      {
        onClick,
        style: `background: ${color}; color: white; padding: 10px 15px; margin: 5px; cursor: pointer; border: none; border-radius: 3px; font-weight: bold;`,
      },
      label
    );
  }
);

// Callback optimization demo
function CallbackOptimization(): any {
  const [clicks, setClicks] = TinyReact.useState(0);
  const [other, setOther] = TinyReact.useState(0);

  const handleIncrement = TinyReact.useCallback(
    () => {
      renderLog.log("CallbackOptimization.handleIncrement", "callback executed");
      setClicks(clicks + 1);
    },
    [clicks]
  );

  const handleOther = TinyReact.useCallback(
    () => {
      renderLog.log("CallbackOptimization.handleOther", "callback executed");
      setOther(other + 1);
    },
    [other]
  );

  return h(
    "div",
    { style: "border: 2px solid blue; padding: 15px; margin: 10px 0; border-radius: 5px; background: #e3f2fd;" },
    h("h2", {}, "useCallback: Memoized Callbacks"),
    h("p", {}, `Clicks: ${clicks}, Other: ${other}`),
    h("p", { style: "font-size: 12px; color: gray;" }, "👉 Buttons only re-render when their callbacks change"),
    h(
      "div",
      {},
      h(MemoButton, { label: "Increment Clicks", onClick: handleIncrement, color: "#2196f3" }),
      h(MemoButton, { label: "Increment Other", onClick: handleOther, color: "#2196f3" })
    )
  );
}

// State equality optimization
function StateOptimization(): any {
  const [user, setUser] = TinyReact.useState<User>({ name: "Alice", age: 25 });
  const [updates, setUpdates] = TinyReact.useState(0);

  TinyReact.useEffect(() => {
    renderLog.log("StateOptimization.useEffect", `name changed: ${user.name}`);
  }, [user.name]);

  const updateAge = () => {
    renderLog.log("StateOptimization.updateAge", `updating age to ${user.age + 1}`);
    setUser({ ...user, age: user.age + 1 });
    setUpdates(updates + 1);
  };

  const sameValue = () => {
    renderLog.log("StateOptimization.sameValue", "setting same user object - NO RE-RENDER expected!");
    setUser(user);
  };

  return h(
    "div",
    { style: "border: 2px solid orange; padding: 15px; margin: 10px 0; border-radius: 5px; background: #fff3e0;" },
    h("h2", {}, "State Equality: Smart Comparisons"),
    h("p", {}, `Name: ${user.name}, Age: ${user.age}`),
    h("p", {}, `Updates triggered: ${updates}`),
    h("p", { style: "font-size: 12px; color: gray;" }, '👉 Click "Same Value" - notice NO console log for re-render!'),
    h(
      "button",
      { onClick: updateAge, style: "margin-right: 10px; padding: 8px 15px; background: #ff9800; color: white; border: none; cursor: pointer; border-radius: 3px;" },
      "Update Age"
    ),
    h(
      "button",
      {
        onClick: sameValue,
        style: "padding: 8px 15px; background: #ffeb3b; color: black; border: none; cursor: pointer; border-radius: 3px; font-weight: bold;",
      },
      "Set Same Value ⚡"
    )
  );
}

// List item with memo
const ListItem = TinyReact.memo(
  ({ item, onRemove }: { item: Item; onRemove: (id: number) => void }): any => {
    renderLog.log(`ListItem[${item.name}]`, "✨ rendered");
    return h(
      "li",
      {
        style: "background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;",
      },
      h("strong", {}, item.name),
      h(
        "button",
        {
          onClick: () => {
            renderLog.log(`ListItem[${item.name}]`, "removed");
            onRemove(item.id);
          },
          style: "margin-left: 10px; background: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;",
        },
        "Remove"
      )
    );
  }
);

// Optimized list
function OptimizedList(): any {
  const [items, setItems] = TinyReact.useState<Item[]>([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ]);

  const handleRemove = TinyReact.useCallback(
    (id: number) => {
      renderLog.log("OptimizedList.handleRemove", `removing item ${id}`);
      setItems(items.filter((item: Item) => item.id !== id));
    },
    [items]
  );

  return h(
    "div",
    { style: "border: 2px solid red; padding: 15px; margin: 10px 0; border-radius: 5px; background: #ffebee;" },
    h("h2", {}, "TinyReact.memo: Optimized List"),
    h("p", { style: "font-size: 12px; color: gray;" }, "👉 Only the removed item re-renders (check console)"),
    h(
      "ul",
      { style: "list-style: none; padding: 0;" },
      ...items.map((item: Item) => h(ListItem, { key: item.id, item, onRemove: handleRemove }))
    )
  );
}

// Console display
function ConsoleDisplay(): any {
  const [logs, setLogs] = TinyReact.useState<string[]>([]);

  const refreshLogs = () => {
    setLogs([...renderLog.getLast(15)]);
  };

  return h(
    "div",
    { style: "border: 2px solid #333; padding: 15px; margin: 20px 0; background: #1e1e1e; color: #00ff00; font-family: monospace; font-size: 12px; border-radius: 5px;" },
    h(
      "div",
      { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" },
      h("h3", { style: "color: #00ff00; margin: 0;" }, "📋 Console Logs"),
      h(
        "button",
        {
          onClick: refreshLogs,
          style: "background: #00ff00; color: #1e1e1e; border: none; padding: 5px 15px; cursor: pointer; border-radius: 3px; font-weight: bold; font-size: 12px;",
        },
        "🔄 Refresh Logs"
      )
    ),
    h(
      "div",
      { style: "max-height: 180px; overflow-y: auto;" },
      logs.length > 0
        ? logs.map((log: string, i: number) => h("div", { key: i, style: "margin: 3px 0; line-height: 1.4;" }, log))
        : h("p", { style: "color: #666;" }, 'Click "Refresh Logs" to see console output...')
    ),
    h(
      "p",
      { style: "color: #888; font-size: 10px; margin: 10px 0 0 0;" },
      `Total messages: ${renderLog.messages.length} | Open browser console (F12) for live updates`
    )
  );
}

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

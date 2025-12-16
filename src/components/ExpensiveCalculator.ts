/**
 * ExpensiveCalculator - Demonstrates useMemo for expensive computations
 */

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

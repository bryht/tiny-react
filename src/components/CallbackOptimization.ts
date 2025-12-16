/**
 * CallbackOptimization - Demonstrates useCallback with memo
 */

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

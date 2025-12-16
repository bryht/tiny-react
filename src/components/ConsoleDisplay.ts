/**
 * ConsoleDisplay - Shows render logs for debugging
 */

function ConsoleDisplay(): any {
  const [logs, setLogs] = TinyReact.useState([] as string[]);

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

/**
 * OptimizedList - Demonstrates memo for preventing unnecessary list re-renders
 */

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

function OptimizedList(): any {
  const [items, setItems] = TinyReact.useState([
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

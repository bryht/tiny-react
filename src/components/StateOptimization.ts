/**
 * StateOptimization - Demonstrates shallow equality checks in useState
 */

function StateOptimization(): any {
  const [user, setUser] = TinyReact.useState({ name: "Alice", age: 25 });
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

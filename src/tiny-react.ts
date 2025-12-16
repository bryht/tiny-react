/**
 * TinyReact - A simplified React implementation in TypeScript
 * Core features: useState, useEffect, useCallback, useMemo, memo, createElement
 */

// Type definitions
type Component<P = any> = (props: P) => VNode | null;
type SetStateAction<S> = S | ((prev: S) => S);
type EffectCallback = () => (() => void) | void;
type DependencyList = ReadonlyArray<any> | undefined;

interface VNode {
  type: string | Component;
  key?: string | number;
  props: Record<string, any>;
  children: any[];
}

interface Root {
  render(element: VNode | null): void;
}

/**
 * TinyReact - Main library class
 */
class TinyReact {
  // Global state management
  private static componentStates = new Map<string, any>();
  private static componentEffects = new Map<string, any>();
  private static componentInstances = new Map<string, any>();
  private static currentComponent: Component | null = null;
  private static hookIndex = 0;
  private static rootContainer: Root | null = null;
  private static rootElement: VNode | null = null;

  /**
   * Shallow equality check - detect if objects/arrays actually changed
   */
  static shallowEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return obj1 === obj2;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => obj1[key] === obj2[key]);
  }

  /**
   * useState - State hook with shallow equality optimization
   * @param initialValue - Initial state value
   * @returns [state, setState]
   */
  static useState<S>(initialValue: S): [S, (value: SetStateAction<S>) => void] {
    const component = TinyReact.currentComponent;
    if (!component) throw new Error("useState must be called inside a component");

    const hookIdx = TinyReact.hookIndex++;
    const key = `${component.name}_${hookIdx}`;

    // Initialize state if it doesn't exist
    if (!TinyReact.componentStates.has(key)) {
      TinyReact.componentStates.set(key, initialValue);
    }

    const state = TinyReact.componentStates.get(key);

    const setState = (newValue: SetStateAction<S>) => {
      const oldValue = TinyReact.componentStates.get(key);
      const actualNewValue = typeof newValue === "function" ? (newValue as any)(oldValue) : newValue;

      const hasChanged =
        typeof actualNewValue === "object"
          ? !TinyReact.shallowEqual(oldValue, actualNewValue)
          : oldValue !== actualNewValue;

      if (hasChanged) {
        TinyReact.componentStates.set(key, actualNewValue);
        if (TinyReact.rootContainer && TinyReact.rootElement) {
          TinyReact.rootContainer.render(TinyReact.rootElement);
        }
      }
    };

    return [state, setState];
  }

  /**
   * useCallback - Memoize callback functions to prevent re-creation
   * @param callback - Function to memoize
   * @param dependencies - Dependency array
   * @returns Memoized callback
   */
  static useCallback<T extends (...args: any[]) => any>(callback: T, dependencies: DependencyList): T {
    const component = TinyReact.currentComponent;
    if (!component) throw new Error("useCallback must be called inside a component");

    const hookIdx = TinyReact.hookIndex++;
    const key = `${component.name}_callback_${hookIdx}`;

    const callbackData = TinyReact.componentStates.get(`${key}_data`) || {};
    const prevDeps = callbackData.deps;

    const depsChanged =
      !prevDeps ||
      !dependencies ||
      dependencies.length !== prevDeps.length ||
      dependencies.some((dep: any, i: number) => dep !== prevDeps[i]);

    if (depsChanged) {
      TinyReact.componentStates.set(`${key}_data`, {
        callback,
        deps: dependencies,
      });
      TinyReact.componentStates.set(key, callback);
    }

    return TinyReact.componentStates.get(key);
  }

  /**
   * useMemo - Memoize expensive computations
   * @param computeFn - Function that computes the value
   * @param dependencies - Dependency array
   * @returns Memoized value
   */
  static useMemo<T>(computeFn: () => T, dependencies: DependencyList): T {
    const component = TinyReact.currentComponent;
    if (!component) throw new Error("useMemo must be called inside a component");

    const hookIdx = TinyReact.hookIndex++;
    const key = `${component.name}_memo_${hookIdx}`;

    const memoData = TinyReact.componentStates.get(`${key}_data`) || {};
    const prevDeps = memoData.deps;

    const depsChanged =
      !prevDeps ||
      !dependencies ||
      dependencies.length !== prevDeps.length ||
      dependencies.some((dep: any, i: number) => dep !== prevDeps[i]);

    if (depsChanged) {
      const value = computeFn();
      TinyReact.componentStates.set(`${key}_data`, {
        value,
        deps: dependencies,
      });
      TinyReact.componentStates.set(key, value);
    }

    return TinyReact.componentStates.get(key);
  }

  /**
   * memo - Memoize components to prevent re-renders with same props
   * @param Component - Component to memoize
   * @returns Memoized component
   */
  static memo<P extends Record<string, any>>(Component: Component<P>): Component<P> {
    return (props: P) => {
      const key = `${Component.name}_memo_${JSON.stringify(props)}`;

      const cached = TinyReact.componentInstances.get(key);
      if (cached && TinyReact.shallowEqual(cached.props, props)) {
        return cached.result;
      }

      const result = Component(props);

      TinyReact.componentInstances.set(key, { props, result });
      return result;
    };
  }

  /**
   * useEffect - Effect hook for side effects
   * @param callback - Effect function that can return cleanup
   * @param dependencies - Dependency array
   */
  static useEffect(callback: EffectCallback, dependencies?: DependencyList): void {
    const component = TinyReact.currentComponent;
    if (!component) throw new Error("useEffect must be called inside a component");

    const hookIdx = TinyReact.hookIndex++;
    const key = `${component.name}_effect_${hookIdx}`;

    const effectData = TinyReact.componentEffects.get(key);
    const prevDeps = effectData ? effectData.deps : undefined;

    const depsChanged =
      !prevDeps ||
      !dependencies ||
      dependencies.length !== prevDeps.length ||
      dependencies.some((dep: any, i: number) => dep !== prevDeps[i]);

    if (depsChanged) {
      if (effectData && effectData.cleanup) {
        effectData.cleanup();
      }

      const cleanup = callback();
      TinyReact.componentEffects.set(key, {
        cleanup,
        deps: dependencies,
      });
    }
  }

  /**
   * createElement - Creates a virtual representation of a DOM element
   * @param type - HTML tag name or component function
   * @param props - Props object
   * @param children - Child elements or text
   * @returns Virtual element
   */
  static createElement(type: string | Component, props: Record<string, any> | null, ...children: any[]): VNode {
    return {
      type,
      key: props?.key,
      props: props || {},
      children: children.flat(),
    };
  }

  /**
   * createRoot - Creates a root to render React elements
   * @param container - DOM element to render into
   * @returns Root object with render method
   */
  static createRoot(container: HTMLElement): Root {
    return {
      render(element: VNode | null) {
        TinyReact.rootElement = element;
        TinyReact.rootContainer = this;

        container.innerHTML = "";
        if (element) {
          const domElement = TinyReact.render(element);
          if (domElement) {
            container.appendChild(domElement);
          }
        }
      },
    };
  }

  /**
   * render - Converts virtual element to actual DOM element
   */
  private static render(element: any): Node | null {
    if (!element) return null;

    // Handle text nodes
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(String(element));
    }

    // Handle component functions
    if (typeof element.type === "function") {
      TinyReact.currentComponent = element.type;
      TinyReact.hookIndex = 0;

      const component = element.type(element.props);
      return TinyReact.render(component);
    }

    // Handle HTML elements
    const domElement = document.createElement(element.type as string);

    // Add props (attributes)
    Object.keys(element.props).forEach((key) => {
      if (key === "key") return;

      if (key === "className") {
        domElement.className = element.props[key];
      } else if (key === "onClick") {
        domElement.addEventListener("click", element.props[key]);
      } else if (key.startsWith("on")) {
        const eventName = key.substring(2).toLowerCase();
        domElement.addEventListener(eventName, element.props[key]);
      } else if (key !== "style" || typeof element.props[key] !== "string") {
        domElement.setAttribute(key, element.props[key]);
      }
    });

    // Handle style strings
    if (element.props.style && typeof element.props.style === "string") {
      domElement.setAttribute("style", element.props.style);
    }

    // Add children
    element.children.forEach((child: any) => {
      const childDom = TinyReact.render(child);
      if (childDom) {
        domElement.appendChild(childDom);
      }
    });

    return domElement;
  }
}

/**
 * JSX-like helper function (hyperscript)
 * Usage: h('div', { className: 'container' }, h('p', {}, 'Hello'))
 * Props can be omitted: h(Component, {}) or just h(Component, null)
 */
const h = (type: string | Component, props?: Record<string, any> | null, ...children: any[]): VNode =>
  TinyReact.createElement(type, props || null, ...children);

/**
 * Fragment - render multiple children without a wrapper
 */
const Fragment = ({ children }: { children: any[] }) => children;

// Export for use
(window as any).TinyReact = TinyReact;
(window as any).h = h;
(window as any).Fragment = Fragment;

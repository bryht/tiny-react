/**
 * Shared type definitions
 */

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

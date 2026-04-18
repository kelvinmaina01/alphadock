import { createElement, type ReactNode } from "react";

export function Placeholder({ children }: { children?: ReactNode }) {
  return createElement(
    "span",
    { "data-alphadock-ui": "placeholder" },
    children,
  );
}

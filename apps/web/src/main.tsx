import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./styles.css";

const RouterProviderCompat = RouterProvider as unknown as (props: {
  router: typeof router;
}) => JSX.Element;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProviderCompat router={router} />
  </StrictMode>,
);

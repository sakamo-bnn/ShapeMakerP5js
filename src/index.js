import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  // 2回実行される(問題なし)
  <StrictMode>
    <App />
  </StrictMode>
);
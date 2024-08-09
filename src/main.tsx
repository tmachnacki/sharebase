import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/shared/theme-provider";

import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>,
  // </React.StrictMode>
);

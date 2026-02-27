import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Context from "./utils/Mycontext.jsx";
import UserContextProvider from "./utils/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <Context>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Context>
  </UserContextProvider>,
);

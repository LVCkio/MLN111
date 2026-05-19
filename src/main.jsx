import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@redux/store";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hiệu ứng trượt từ trên xuống + mờ dần
export const slideDown = cssTransition({
  enter: "toast-slide-down-enter",
  exit: "toast-slide-down-exit",
  duration: [320, 260],
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2200}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
        transition={slideDown}
      />
    </PersistGate>
  </Provider>
);

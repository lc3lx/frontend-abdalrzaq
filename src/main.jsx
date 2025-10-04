import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "animate.css"; // For hero animations
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";
import "./styles/design-system.css";

AOS.init({ duration: 1000, once: true }); // Initialize AOS globally

const container = document.getElementById("root");
const root = createRoot(container); // Create root
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

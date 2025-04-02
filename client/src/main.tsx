import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Importing material icons for use throughout the app
const materialIconsLink = document.createElement("link");
materialIconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
materialIconsLink.rel = "stylesheet";
document.head.appendChild(materialIconsLink);

// Setting page title
const titleElement = document.createElement("title");
titleElement.textContent = "WealthAdvisor AI | Financial Insights Platform";
document.head.appendChild(titleElement);

// Font imports for typography
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Add custom styles for financial values
const financialValueStyles = document.createElement("style");
financialValueStyles.textContent = `
  .font-mono {
    font-family: 'Roboto Mono', monospace;
  }
`;
document.head.appendChild(financialValueStyles);

createRoot(document.getElementById("root")!).render(<App />);

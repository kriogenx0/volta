import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

// Libs

// Load Volta styles
import "../styles.scss";

import VoltaDocs from "./views/VoltaDocs";

const root = createRoot(document.getElementById("app"));
// Examples of router-based components need a Router; in-memory so links in
// the examples never navigate the styleguide itself.
root.render(React.createElement(MemoryRouter, null, React.createElement(VoltaDocs)));

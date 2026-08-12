import React from "react";
import { createRoot } from "react-dom/client";

// Libs

// Load Volta styles
import "../styles.scss";

import VoltaDocs from "./views/VoltaDocs";

const root = createRoot(document.getElementById("app"));
root.render(React.createElement(VoltaDocs));

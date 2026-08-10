import React from "react";
import { createRoot } from "react-dom/client";

// Libs
import "../node_modules/@apple/sf-symbols-web/src/_sf-symbols.scss";

// Load Volta styles
import "../styles.scss";

import VoltaDocs from "./VoltaDocs";

const root = createRoot(document.getElementById("app"));
root.render(React.createElement(VoltaDocs));

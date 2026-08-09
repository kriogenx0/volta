import React from "react";
import { createRoot } from "react-dom/client";

// Libs
import "../node_modules/@apple/sf-symbols-web/src/_sf-symbols.scss";

// Load Soda styles how intended
import "../styles.scss";

import SodaDocs from "./SodaDocs";

const root = createRoot(document.getElementById("app"));
root.render(React.createElement(SodaDocs));

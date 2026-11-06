import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";

// Libs

// Load Volta styles
import "../styles.scss";
import { setGoogleMapsKey } from "../components";

import VoltaDocs from "./views/VoltaDocs";

// The Map examples talk to Google, so they stay on a "no key" message unless a
// developer opts in with VITE_GOOGLE_MAPS_API_KEY in .env.local (docs/features/map.md).
setGoogleMapsKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

const root = createRoot(document.getElementById("app"));
// Examples of router-based components need a Router; in-memory so links in
// the examples never navigate the styleguide itself.
root.render(React.createElement(MemoryRouter, null, React.createElement(VoltaDocs)));

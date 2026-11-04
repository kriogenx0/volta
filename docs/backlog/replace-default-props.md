---
priority: p3
---

# Replace defaultProps with default parameters

Replace `defaultProps` (62 files at last count) with default parameters, which React 19 requires for function components. Convert the 7 remaining class components to hooks while touching them, where low-risk (error boundaries stay classes).

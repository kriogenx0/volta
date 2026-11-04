---
priority: p3
depends_on: [add-missing-design-tokens]
---

# Snap spacing to the scale

Snap 5→4, 7→8, 10→8/12, 15→16, 20→24. The duplicate `$spacing` (10px and 15px) is defined in `styles/components/lists.scss`, `ListDefinitions`, `Redactor` and the four `_image-crop.scss` files; replace with `space-*` tokens.

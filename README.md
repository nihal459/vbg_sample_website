# VBG Intech — light homepage

React/Vite homepage with an orange-and-white theme.

## Run
Use Node.js 22.12+ or 24.
- npm ci
- npm run dev
- npm run build
- npm run preview

Deploy the contents of dist to a static web host. Open through an HTTP server, not file://.

## Interactions
- Hero: mouse-following orange spotlight and pointer-driven real GLB rotation.
- Engineering: scroll-driven full rotation of the supplied valve.
- Globe: drag to rotate; button separates named internal components and returns them to assembly.
- Mobile navigation, responsive layout, reduced-motion support.
- Drawings, product cards and mail enquiry links retained.

The main valve is one mesh, with no separable assembly parts. It is deliberately rotated as a whole. The globe contains named component meshes; its separation is illustrative, not a validated mechanical service sequence.

## Performance
3D code is loaded separately. Models load near their sections; offscreen canvases stop rendering. Device pixel ratio is capped at 1.5.
The globe uses 1024px WebP textures and Draco geometry compression. Geometry is not simplified, and named components are preserved. Draco decoder files are served locally.
Product photos and Google Fonts still require internet access.

## Model credits — CC BY 4.0
- Valve in Autodesk Inventor || Inventor Tutorial — cadpractice:
  https://sketchfab.com/3d-models/valve-in-autodesk-inventor-inventor-tutorial-ceeeb4137ebd40c28c79bb68bd3a1fe8
- Globe Valve — Heber Soto:
  https://sketchfab.com/3d-models/globe-valve-a7ae11b4b59d4360b9274783be4a3c58
- License: https://creativecommons.org/licenses/by/4.0/

Changes: web compression, texture resizing, materials on the first model, framing and motion. These are demonstration assets, not verified VBG product geometry. Attribution is included in the footer.

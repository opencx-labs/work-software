# Work

The public website for Work at [work.software](https://work.software): desktop,
company brain, and mobile, powered by the open-source Catamorphic framework.

Static HTML, CSS, and JavaScript. No build or runtime dependencies.

## Local preview

Run `python3 -m http.server 4174 --bind 127.0.0.1 --directory site` and open
http://127.0.0.1:4174.

## Publication

GitHub Pages serves `site/` through the deployment workflow. The custom domain
is `work.software`. Product downloads currently retain the Catamorphic app name;
the website does not rename binaries or promise unavailable platform releases.

## Desktop film

The homepage and desktop page use `site/assets/work-desktop-film.mp4`, a silent
24.5-second 1920x1080 H.264 recording of the actual desktop preview with prepared
demo content. The launch-board app works in the real guest runtime; no generated
agent response is depicted. Camera moves and captions are editorial layers.

The source capture used Catamorphic revision `28d07537`. Raw footage, capture
manifest, deterministic renderer, font license, and brief are retained in the
local `work-product-film` production folder alongside the repository. The reusable
workflow lives in Catamorphic's `.agents/skills/announcement-video/`.

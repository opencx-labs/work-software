# Work

The public website for Work at [work.software](https://work.software): desktop,
company brain, and mobile, powered by the open-source Catamorphic framework.

Static HTML, CSS, and JavaScript. No build or runtime dependencies.

## Local preview

Run `python3 -m http.server 4174 --bind 127.0.0.1 --directory site` and open
http://127.0.0.1:4174.

## Publication

GitHub Pages serves `site/` through the deployment workflow. The custom domain
is `work.software`. Pull requests validate pages, local links, ARIA references,
JavaScript, and media decoding. Merging to `main` runs the same checks, then
deploys the exact `site/` artifact to GitHub Pages. Manual deployment is also
limited to `main`; feature branches cannot publish.

Run `python3 scripts/check_site.py` and `node --check site/site.js` locally.
The media check requires FFmpeg: `ffmpeg -v error -xerror -i
site/assets/work-desktop-film.mp4 -f null -`.

Product downloads currently retain the Catamorphic app name;
the website does not rename binaries or promise unavailable platform releases.

## Desktop film

The homepage and desktop page share `site/assets/work-desktop-film.mp4`, a silent
1920x1080 H.264 recording of the actual desktop app at 30 fps (duration in the
production brief). It follows one scenario in the prepared project "Aster
launch": read a reference page in Work's browser, open a chat beside it and ask
for a Launch section in the sidebar plus the light theme, then ask for a small
app that shows the person's own chats by day. The app is opened from the
sidebar, Work asks once before it reads the chats, and the app is used.

Both agent turns are real (Claude Code, this machine's login); the app is built
by the agent from the project skills and declares `catamorphic.access.sessions`.
Typing, navigation and app use run at 1x; the agent's working time is
accelerated with a visible "Sped up" label. The five earlier conversations in
the project were seeded through the normal chat.

Raw frames, markers, the cut list (`edit.json`), renderer and production notes
are in `../work-product-film/activity-demo/`. The reusable skill is
`.agents/skills/announcement-video/` in the Catamorphic repo, with a
Work-specific story reference.

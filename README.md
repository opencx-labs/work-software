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
96.4-second 1920x1080 H.264 recording of the actual desktop app at 30 fps.
It follows one task: browse Work, create a floating chat through the palette,
send a question about launching a small product, expand with Cmd+Shift+M, send
an app-building follow-up, and use the resulting launch checklist. Typing is
human-paced. UI animations play at 1x; a labeled build interval is accelerated.

The safe prepared project is “A small launch”. The real locally authenticated
Codex harness, named “Work partner”, generated both answers and the app. No test
agent or synthetic responses are used. The app's progress changes from 0% to 20%
and survives reopening. Preview compilation succeeded; a separate direct Vite
build could not run because the local dependency registry was unavailable.

The browser visits the public Work website as it existed at capture time; that
page still contains its older title and film copy. Those are removed from this
website revision. Web-mode activation and direct URL navigation are shown as
separate actions: a Google CAPTCHA prevented recording a successful web search.

Source: Catamorphic `62a341dd` in the dedicated git-change-monitor worktree.
Raw frames, capture timestamps, cut list, renderer, and production notes are in
`../work-product-film/purposeful-demo/`. Earlier takes are preserved alongside it.
The updated reusable skill is in the `catamorphic-work-video` worktree under
`.agents/skills/announcement-video/`, with a Work-specific story reference.

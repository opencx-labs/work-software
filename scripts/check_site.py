"""Validate the static Pages artifact without network or package dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

SITE = Path(__file__).resolve().parents[1] / "site"
ORIGIN = "https://work.software"


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.references = []
        self.idrefs = []
        self.title = ""
        self.in_title = False
        self.canonical = None
        self.feed(path.read_text())
        self.close()
        assert self.title.strip(), f"{path}: missing title"

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"{self.path}: duplicate ID {attrs['id']}"
            self.ids.add(attrs["id"])
        for name in ("href", "src", "poster"):
            if attrs.get(name):
                self.references.append(attrs[name])
        for name in ("aria-controls", "aria-describedby", "aria-labelledby"):
            self.idrefs.extend(attrs.get(name, "").split())
        if tag == "title":
            self.in_title = True
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "video":
            # Native controls, or a silent autoplaying film that the page
            # pairs with its own pause control (the homepage hero).
            silent = "muted" in attrs and "autoplay" in attrs
            assert "controls" in attrs or silent, (
                f"{self.path}: video needs playback controls"
            )
            assert silent or "autoplay" not in attrs, (
                f"{self.path}: only a muted film may autoplay"
            )
            assert attrs.get("aria-label"), f"{self.path}: video needs an accessible name"

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def route(path):
    relative = path.relative_to(SITE).as_posix()
    return "/" + (relative.removesuffix("index.html") if path.name == "index.html" else relative)


def local_target(url):
    target = (SITE / unquote(urlsplit(url).path).lstrip("/")).resolve()
    assert target.is_relative_to(SITE), f"URL escapes site: {url}"
    return target / "index.html" if target.is_dir() else target


pages = {path: Page(path) for path in SITE.rglob("*.html")}
link_count = 0
for path, page in pages.items():
    base = ORIGIN + route(path)
    expected_canonical = None if path.name == "404.html" else base
    assert page.canonical == expected_canonical, f"{path}: incorrect canonical URL"
    for identifier in page.idrefs:
        assert identifier in page.ids, f"{path}: missing ARIA target {identifier}"
    for reference in page.references:
        url = urlsplit(urljoin(base, reference))
        if url.netloc != "work.software":
            continue
        target = local_target(url.geturl())
        assert target.is_file(), f"{path}: broken reference {reference}"
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f"{path}: broken anchor {reference}"
        link_count += 1

locations = {node.text for node in ET.parse(SITE / "sitemap.xml").iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
expected = {ORIGIN + route(path) for path in pages if path.name != "404.html"}
assert locations == expected, "Sitemap must list every public page, excluding the 404 page"
assert (SITE / "CNAME").read_text().strip() == "work.software", "Incorrect Pages domain"
assert "Sitemap: https://work.software/sitemap.xml" in (SITE / "robots.txt").read_text()
print(f"Validated {len(pages)} pages, {link_count} local references, ARIA targets, sitemap, and domain.")

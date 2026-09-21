"""Build site/llms-full.txt: the agent guide with its linked repository documents inlined.

An agent that fetches one URL should get answers, not pointers. Run this after
editing site/llms.txt or when the listed repository documents change (the
website deploy does not run it; commit the result).

    python3 scripts/build_llms_full.py            # fetches from GitHub main
    python3 scripts/build_llms_full.py <repo dir>  # reads a local checkout
"""
import sys
import urllib.request
from pathlib import Path

REPO = "https://raw.githubusercontent.com/opencx-labs/catamorphic/main/"
# Order matters: what an agent needs first comes first.
DOCUMENTS = [
    ("README.md", "The repository README: what Work and Catamorphic are, install, the three ways to use it"),
    ("apps/server/README.md", "The self-hosted server (a company brain)"),
    ("skills/setup-catamorphic-server/SKILL.md", "Setting up a server with an agent"),
    ("skills/setup-catamorphic-server/references/first-brain.md", "The first brain, step by step"),
    ("INTEGRATION.md", "Embedding the framework in your own product"),
]
SITE = Path(__file__).resolve().parent.parent / "site"


def read(path: str, local: Path | None) -> str:
    if local:
        return (local / path).read_text(encoding="utf-8")
    with urllib.request.urlopen(REPO + path, timeout=30) as response:
        return response.read().decode("utf-8")


def main() -> None:
    local = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
    guide = (SITE / "llms.txt").read_text(encoding="utf-8").rstrip("\n")
    parts = [guide, "", "---", "", "# Linked documents, inlined", "",
             "Each section below is a file from https://github.com/opencx-labs/catamorphic at the time this guide was built. The repository is the source of truth.", ""]
    for path, title in DOCUMENTS:
        body = read(path, local).rstrip("\n")
        parts += [f"## {title}", "", f"Source: https://github.com/opencx-labs/catamorphic/blob/main/{path}", "", body, ""]
    (SITE / "llms-full.txt").write_text("\n".join(parts) + "\n", encoding="utf-8")
    print(f"wrote site/llms-full.txt ({sum(len(p) for p in parts):,} chars, {len(DOCUMENTS)} documents)")


if __name__ == "__main__":
    main()

// The existing release feed is the source of truth for the Mac preview.
// The HTML keeps a verified download available if JavaScript or the feed fails.
const download = document.querySelector("#desktop-download");
const releaseStatus = document.querySelector("#release-status");

async function resolvePreview() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/opencx-labs/homebrew-tap/main/updates/alpha-mac.yml",
      { signal: controller.signal },
    );
    if (!response.ok) return;
    const feed = await response.text();
    const version = feed.match(/^version:\s*([\w.+-]+)\s*$/m)?.[1];
    const url = feed.match(
      /^\s*-?\s*url:\s*(https:\/\/github\.com\/opencx-labs\/catamorphic\/releases\/download\/[^\s]+-arm64\.dmg)\s*$/m,
    )?.[1];
    if (!url || !version || !download || !releaseStatus) return;
    download.href = url;
    releaseStatus.textContent = `Preview ${version} for Mac with Apple silicon.`;
  } catch {
    // Network failures leave the known-good, version-labelled download intact.
  } finally {
    clearTimeout(timeout);
  }
}

if (download && releaseStatus) resolvePreview();

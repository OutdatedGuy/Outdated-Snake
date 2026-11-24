const BASE_URL =
  "https://github.com/OutdatedGuy/Outdated-Snake-Desktop/releases/latest/download";
const linkEl = document.getElementById("download-link");
const labelEl = document.getElementById("download-platform");

const ua = navigator.userAgent || "";
const platform = navigator.platform || "";
let isMac = /Mac/i.test(platform) || /Macintosh/i.test(ua);
let isWin = /Win/i.test(platform) || /Windows/i.test(ua);
let isArm = /arm64|aarch64/i.test(ua);

if (navigator.userAgentData?.getHighEntropyValues) {
  try {
    const hints = await navigator.userAgentData.getHighEntropyValues([
      "platform",
      "architecture",
    ]);
    if (hints.platform === "macOS") isMac = true;
    if (hints.platform === "Windows") isWin = true;
    if (hints.architecture === "arm") isArm = true;
  } catch (_) { }
} else if (isMac && !isArm) {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const dbg = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "";
    if (/Apple M|Apple GPU/i.test(renderer)) isArm = true;
  } catch (_) { }
}

const arch = isArm ? "arm64" : "x64";
if (isMac) {
  linkEl.href = `${BASE_URL}/outdated-snake-macos-${arch}.pkg`;
  labelEl.textContent = `(macOS ${isArm ? "Apple Silicon" : "Intel"})`;
} else if (isWin) {
  linkEl.href = `${BASE_URL}/outdated-snake-windows-${arch}.exe`;
  labelEl.textContent = `(Windows ${arch === "arm64" ? "ARM" : "x64"})`;
}

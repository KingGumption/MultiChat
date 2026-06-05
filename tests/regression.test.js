const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function checkSyntax(file) {
  execFileSync(process.execPath, ["--check", file], {
    cwd: root,
    stdio: "pipe"
  });
}

function loadBrowserConfig(file, property) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(file), context, { filename: file });
  return context.window[property];
}

function getScriptVersion(html, scriptFile) {
  const pattern = new RegExp(`<script\\s+src="${scriptFile.replace(".", "\\.")}\\?v=([^"]+)"`);
  return read(html).match(pattern)?.[1] || "";
}

function assertHtmlLocalAssetsExist(file) {
  const html = read(file);
  const baseHref = html.match(/<base\s+href="([^"]+)"/)?.[1] || "";
  const baseDir = baseHref
    ? path.resolve(path.dirname(path.join(root, file)), baseHref)
    : path.dirname(path.join(root, file));
  const refs = [...html.matchAll(/\b(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)]
    .map(match => match[1])
    .filter(ref => !/^(?:https?:)?\/\//.test(ref))
    .filter(ref => ref !== "../");

  refs.forEach(ref => {
    const resolved = path.resolve(baseDir, ref);
    assert.ok(fs.existsSync(resolved), `${file} references missing asset ${ref}`);
  });
}

const script = read("script.js");
const settings = read("settings/settings.js");

[
  "config.js",
  "default-config.js",
  "script.js",
  "settings/settings.js",
  "widget-builder/app.js"
].forEach(checkSyntax);

const defaultConfig = loadBrowserConfig("default-config.js", "CHAT_DEFAULT_CONFIG");
const config = loadBrowserConfig("config.js", "CHAT_CONFIG");

assert.equal(defaultConfig.style.colors.tiktok.treasureBoxes, "#25f4ee");
assert.equal(config.style.colors.tiktok.treasureBoxes, "#25f4ee");
assert.equal(defaultConfig.behaviour.alerts.tiktok.treasureBoxes, true);
assert.equal(config.behaviour.alerts.tiktok.treasureBoxes, true);

[
  "index.html",
  "settings/index.html",
  "widget-builder/index.html"
].forEach(assertHtmlLocalAssetsExist);

assert.match(
  settings,
  /group === "tiktok" && \(type === "gifts" \|\| type === "treasureBoxes"\)/
);
assert.match(settings, /alertType:\s*`tiktok\.\$\{type\}`/);
assert.match(settings, /giftName:\s*type === "treasureBoxes" \? "a Treasure Box with 20 coins" : "Rose"/);

assert.match(script, /function getTikTokGiftStyleType\(item = \{\}\)/);
assert.match(script, /return typeStyles\.tiktok\?\.\[getTikTokGiftStyleType\(item\)\] \|\| null;/);
assert.match(script, /return defaults\.tiktok\?\.\[getTikTokGiftStyleType\(item\)\] \|\| null;/);
assert.match(script, /return colors\.tiktok\?\.\[getTikTokGiftStyleType\(item\)\] \|\| "";/);
assert.doesNotMatch(script, /if \(item\.kind === "tiktokGift"\) \{\s*return typeStyles\.tiktok\?\.gifts \|\| null;\s*\}/);
assert.doesNotMatch(script, /if \(item\.kind === "tiktokGift"\) \{\s*return defaults\.tiktok\?\.gifts \|\| null;\s*\}/);

assert.match(script, /const giftBgPrefix = hasGiftBgOverrides \|\| !hasAlertBgOverrides/);
assert.match(script, /const giftGlowPrefix = hasGiftGlowOverrides \|\| !hasAlertGlowOverrides/);
assert.match(script, /const giftBorderPrefix = hasGiftBorderOverrides \|\| !hasAlertBorderOverrides/);
assert.doesNotMatch(script, /icons\/icons\//);

const overlayScriptVersion = getScriptVersion("index.html", "script.js");
const settingsScriptVersion = getScriptVersion("settings/index.html", "script.js");
const settingsUiVersion = getScriptVersion("settings/index.html", "settings/settings.js");

assert.equal(overlayScriptVersion, settingsScriptVersion);
assert.equal(settingsScriptVersion, settingsUiVersion);
assert.ok(overlayScriptVersion.includes("tiktok-treasure-style"));

console.log("Regression tests passed");

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../dist/", import.meta.url);
const requiredFiles = ["index.html", "styles.css", "script.js", "favicon.svg"];

for (const file of requiredFiles) {
  const path = new URL(file, root);
  if (!existsSync(path)) throw new Error(`Missing required file: ${file}`);
}

const html = readFileSync(new URL("index.html", root), "utf8");
for (const id of ["top", "work", "process", "about", "contact"]) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing section: ${id}`);
}

const videoCount = (html.match(/data-project-video/g) || []).length;
if (videoCount !== 3) throw new Error(`Expected three project videos, found ${videoCount}`);
if (!html.includes("mailto:hello@stephaniewieland.com")) throw new Error("Missing temporary email link");
if (!html.includes("Short-Form Video Editor")) throw new Error("Missing professional title");

const css = readFileSync(new URL("styles.css", root), "utf8");
for (const requirement of ["--pink: #f08bd1", "prefers-reduced-motion", ":focus-visible", "@media (max-width: 760px)"]) {
  if (!css.includes(requirement)) throw new Error(`Missing CSS requirement: ${requirement}`);
}

for (const asset of ["loewe-short.mp4", "bored-short.mp4", "claude-cowork.mp4"]) {
  if (!existsSync(new URL(`assets/${asset}`, root))) throw new Error(`Missing media: ${asset}`);
}

console.log("site structure ok");

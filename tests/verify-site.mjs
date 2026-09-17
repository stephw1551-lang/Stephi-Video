import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
if (videoCount !== 9) throw new Error(`Expected nine project videos, found ${videoCount}`);
for (const category of ["Client edits", "Paid ads", "Self-made video essays"]) {
  if (!html.includes(category)) throw new Error(`Missing work category: ${category}`);
}
if (!html.includes('src="assets/stephanie-wieland.jpg"')) throw new Error("Missing Stephanie portrait");
if (!html.includes("mailto:hello@stephaniewieland.com")) throw new Error("Missing temporary email link");
if (!html.includes("Short-Form Video Editor")) throw new Error("Missing professional title");

const css = readFileSync(new URL("styles.css", root), "utf8");
for (const requirement of ["--pink: #f08bd1", "prefers-reduced-motion", ":focus-visible", "@media (max-width: 760px)"]) {
  if (!css.includes(requirement)) throw new Error(`Missing CSS requirement: ${requirement}`);
}

for (const asset of [
  "tss-objkts.mp4",
  "loewe-short.mp4",
  "bored-short.mp4",
  "classic-books-birthday.mp4",
  "classic-books-range.mp4",
  "dog-loves-you.mp4",
  "essay-one.mp4",
  "essay-two.mp4",
  "essay-three.mp4"
]) {
  const mediaUrl = new URL(`assets/${asset}`, root);
  if (!existsSync(mediaUrl)) throw new Error(`Missing media: ${asset}`);
  const codec = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name", "-of", "default=noprint_wrappers=1:nokey=1", mediaUrl.pathname], { encoding: "utf8" }).trim();
  if (codec !== "h264") throw new Error(`Expected H.264 web video for ${asset}, found ${codec}`);
}

console.log("site structure ok");

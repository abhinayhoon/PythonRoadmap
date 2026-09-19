import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const errors = [];

const days = [...html.matchAll(/class="day-block"\s+data-day="(\d+)"/g)].map((match) => Number(match[1]));
if (days.length !== 30) errors.push(`Expected 30 lessons, found ${days.length}.`);

const expected = Array.from({ length: 30 }, (_, index) => index + 1);
if (days.join(",") !== expected.join(",")) {
  errors.push("Lessons must be ordered exactly from day 1 through day 30.");
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const fragments = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const fragment of new Set(fragments)) {
  if (!ids.has(fragment)) errors.push(`Broken in-page link: #${fragment}`);
}

if (html.includes("YOUR_API_KEY_HERE")) {
  errors.push("The deprecated browser API-key placeholder must not be reintroduced.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${days.length} roadmap lessons and ${new Set(fragments).size} in-page links.`);

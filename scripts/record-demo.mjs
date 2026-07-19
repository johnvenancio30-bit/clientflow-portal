import { chromium } from "playwright";
import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.CLIENTFLOW_URL ?? "http://localhost:3010";
const outputDirectory = path.resolve("artifacts", "video");
const rawVideoPath = path.join(outputDirectory, "clientflow-actions.webm");
const posterPath = path.resolve("public", "clientflow-walkthrough-poster.png");

await mkdir(outputDirectory, { recursive: true });
await rm(rawVideoPath, { force: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outputDirectory, size: { width: 1280, height: 720 } },
});

const page = await context.newPage();

await page.addInitScript(() => {
  window.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `
      #demo-cursor { position: fixed; z-index: 999999; width: 22px; height: 22px; pointer-events: none; transform: translate(-3px, -3px); transition: width .14s ease, height .14s ease; }
      #demo-cursor::before { content: ''; position: absolute; inset: 0; background: #fff; clip-path: polygon(0 0, 0 90%, 24% 68%, 39% 100%, 52% 94%, 37% 62%, 72% 62%); filter: drop-shadow(0 2px 2px rgba(0,0,0,.85)); }
      #demo-cursor.clicking { width: 27px; height: 27px; }
      #demo-click-ring { position: fixed; z-index: 999998; width: 34px; height: 34px; border: 2px solid #f0d89e; border-radius: 50%; pointer-events: none; opacity: 0; transform: translate(-9px,-9px) scale(.5); }
      #demo-click-ring.show { animation: demo-ring .5s ease-out; }
      @keyframes demo-ring { 0% { opacity: .95; transform: translate(-9px,-9px) scale(.45); } 100% { opacity: 0; transform: translate(-9px,-9px) scale(1.55); } }
    `;
    document.head.appendChild(style);
    const cursor = document.createElement("div");
    cursor.id = "demo-cursor";
    const ring = document.createElement("div");
    ring.id = "demo-click-ring";
    document.body.append(cursor, ring);
    document.addEventListener("mousemove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
    });
    document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
    document.addEventListener("mouseup", () => {
      cursor.classList.remove("clicking");
      ring.classList.remove("show");
      void ring.offsetWidth;
      ring.classList.add("show");
    });
  });
});

const pause = (milliseconds) => page.waitForTimeout(milliseconds);

async function humanClick(locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Target is not visible");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 22 });
  await pause(500);
  await page.mouse.down();
  await pause(110);
  await page.mouse.up();
}

async function humanFill(locator, text) {
  await humanClick(locator);
  await locator.fill("");
  await locator.pressSequentially(text, { delay: 30 });
}

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.mouse.move(90, 160, { steps: 12 });
await pause(4200);

await humanClick(page.getByRole("link", { name: "Try the guided demo", exact: true }));
await page.waitForURL("**/demo");
await pause(4100);

await humanClick(page.getByRole("button", { name: "Next step", exact: true }));
await pause(2500);
await humanClick(page.getByRole("button", { name: "Mark Visual design approval complete", exact: true }));
await pause(3200);

await humanClick(page.getByRole("button", { name: "Next step", exact: true }));
await pause(2300);
await humanClick(page.getByRole("button", { name: "New request", exact: true }));
await pause(1300);
await humanFill(page.getByRole("textbox", { name: "Request title", exact: true }), "Add launch countdown");
await humanFill(page.getByRole("textbox", { name: "What needs to change?", exact: true }), "Please add a countdown banner above the hero before the August launch.");
await pause(900);
await humanClick(page.getByRole("button", { name: "Save and continue", exact: true }));
await pause(3800);

await humanClick(page.getByRole("button", { name: "Next step", exact: true }));
await pause(2600);
await humanClick(page.getByRole("button", { name: "Mark as paid", exact: true }));
await pause(3300);

await humanClick(page.getByRole("button", { name: "Next step", exact: true }));
await pause(4200);
await page.screenshot({ path: posterPath, fullPage: false });

await page.evaluate(() => {
  const outro = document.createElement("section");
  outro.setAttribute("aria-label", "Video ending");
  outro.style.cssText = "position:fixed;inset:0;z-index:999900;background:radial-gradient(circle at 78% 18%,rgba(213,173,98,.15),transparent 32%),#07101f;color:#f4f0e6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:70px;font-family:Arial,sans-serif";
  outro.innerHTML = `<div style="color:#d5ad62;font-size:15px;letter-spacing:4px;font-weight:700;margin-bottom:25px">CLIENTFLOW · FULL-STACK CASE STUDY</div><h2 style="max-width:900px;font-size:55px;line-height:1.08;letter-spacing:-2px;margin:0 0 18px">Built by John Venancio</h2><p style="font-size:24px;color:#bcc4d1;margin:0 0 38px">AI Automation Specialist &amp; Full-Stack Web Developer</p><div style="display:flex;gap:14px"><span style="background:#d5ad62;color:#101927;padding:16px 25px;border-radius:10px;font-weight:700">Try the demo</span><span style="border:1px solid rgba(255,255,255,.24);padding:16px 25px;border-radius:10px;font-weight:700">Contact me</span></div>`;
  document.body.appendChild(outro);
});
await page.mouse.move(545, 470, { steps: 22 });
await pause(6200);

const recordedVideo = page.video();
await context.close();
if (!recordedVideo) throw new Error("Video recording was not created");
await copyFile(await recordedVideo.path(), rawVideoPath);
await browser.close();

console.log(rawVideoPath);

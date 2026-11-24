import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Absolute path to the shared favicon, for consumers not using Vite. */
export const faviconPath = fileURLToPath(new URL("./favicon.svg", import.meta.url));

/** Absolute path to the shared 180px home-screen icon, for consumers not using Vite. */
export const appleTouchIconPath = fileURLToPath(new URL("./apple-touch-icon.png", import.meta.url));

const HREF_RE = /\bhref="[^"]*"/;

/* Vite's public/ directory cannot reach into node_modules, so the shared
   icons need a plugin: serve the package copies in dev, emit them at the site
   root on build. Consumers keep plain
   `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` and
   `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` tags.

   With `inline`, each file is folded into its link as a base64 data URI
   instead, for sites that want to ship as a single request. Base64 rather
   than percent-encoding because an SVG is full of characters a URL has
   opinions about, and at a few hundred bytes the size difference is noise. */
export function themeFavicon({
    fileName = "favicon.svg",
    appleTouchIcon = "apple-touch-icon.png",
    inline = false,
} = {}) {
    const icons = [
        { path: faviconPath, fileName, mime: "image/svg+xml", rel: "icon" },
        appleTouchIcon && {
            path: appleTouchIconPath, fileName: appleTouchIcon, mime: "image/png", rel: "apple-touch-icon",
        },
    ].filter(Boolean);
    const read = icon => readFileSync(icon.path);
    return {
        name: "@dk949/site-theme:favicon",
        configureServer(server) {
            if (inline) return;
            for (const icon of icons) {
                server.middlewares.use(`/${icon.fileName}`, (_req, res) => {
                    res.setHeader("Content-Type", icon.mime);
                    res.end(read(icon));
                });
            }
        },
        transformIndexHtml: !inline ? undefined : {
            /* After Vite's own asset pass, so whatever href it leaves behind
               is the one being replaced. */
            order: "post",
            handler(html) {
                for (const icon of icons) {
                    const linkRe = new RegExp(`<link\\b[^>]*\\brel="${icon.rel}"[^>]*>`, "gi");
                    const uri = `data:${icon.mime};base64,${read(icon).toString("base64")}`;
                    html = html.replace(linkRe, tag => tag.replace(HREF_RE, `href="${uri}"`));
                }
                return html;
            },
        },
        generateBundle: inline ? undefined : function generateBundle() {
            for (const icon of icons) {
                this.emitFile({ type: "asset", fileName: icon.fileName, source: read(icon) });
            }
        },
    };
}

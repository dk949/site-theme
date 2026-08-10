import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Absolute path to the shared favicon, for consumers not using Vite. */
export const faviconPath = fileURLToPath(new URL("./favicon.svg", import.meta.url));

const ICON_LINK_RE = /<link\b[^>]*\brel="icon"[^>]*>/gi;
const HREF_RE = /\bhref="[^"]*"/;

/* Vite's public/ directory cannot reach into node_modules, so the shared
   favicon needs a plugin: serve the package copy in dev, emit it at the site
   root on build. Consumers keep a plain
   `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`.

   With `inline`, the file is folded into that link as a base64 data URI
   instead, for sites that want to ship as a single request. Base64 rather
   than percent-encoding because an SVG is full of characters a URL has
   opinions about, and at a few hundred bytes the size difference is noise. */
export function themeFavicon({ fileName = "favicon.svg", inline = false } = {}) {
    const read = () => readFileSync(faviconPath);
    return {
        name: "@dk949/site-theme:favicon",
        configureServer(server) {
            if (inline) return;
            server.middlewares.use(`/${fileName}`, (_req, res) => {
                res.setHeader("Content-Type", "image/svg+xml");
                res.end(read());
            });
        },
        transformIndexHtml: !inline ? undefined : {
            /* After Vite's own asset pass, so whatever href it leaves behind
               is the one being replaced. */
            order: "post",
            handler(html) {
                const uri = `data:image/svg+xml;base64,${read().toString("base64")}`;
                return html.replace(ICON_LINK_RE, tag => tag.replace(HREF_RE, `href="${uri}"`));
            },
        },
        generateBundle: inline ? undefined : function generateBundle() {
            this.emitFile({ type: "asset", fileName, source: read() });
        },
    };
}

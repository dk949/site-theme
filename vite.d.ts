import type { Plugin } from "vite";

/** Absolute path to the shared favicon, for consumers not using Vite. */
export declare const faviconPath: string;

export interface ThemeFaviconOptions {
    /** Name the favicon is served and emitted under. Default `favicon.svg`. */
    fileName?: string;
    /**
     * Fold the favicon into the `rel="icon"` link as a base64 data URI instead
     * of shipping it as a file, so the page costs no extra request. Default
     * `false`.
     */
    inline?: boolean;
}

/** Serves the shared favicon in dev and emits it at the site root on build. */
export declare function themeFavicon(options?: ThemeFaviconOptions): Plugin;

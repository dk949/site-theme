import type { Plugin } from "vite";

/** Absolute path to the shared favicon, for consumers not using Vite. */
export declare const faviconPath: string;

/** Absolute path to the shared 180px home-screen icon, for consumers not using Vite. */
export declare const appleTouchIconPath: string;

export interface ThemeFaviconOptions {
    /** Name the favicon is served and emitted under. Default `favicon.svg`. */
    fileName?: string;
    /**
     * Name the 180px PNG home-screen icon is served and emitted under, or
     * `false` to leave it out. Default `apple-touch-icon.png`, the root path
     * iOS probes even when no `rel="apple-touch-icon"` link is present.
     */
    appleTouchIcon?: string | false;
    /**
     * Fold each icon into its `rel="icon"` / `rel="apple-touch-icon"` link as
     * a base64 data URI instead of shipping it as a file, so the page costs no
     * extra request. Default `false`.
     */
    inline?: boolean;
}

/** Serves the shared favicon and home-screen icon in dev and emits them at the site root on build. */
export declare function themeFavicon(options?: ThemeFaviconOptions): Plugin;

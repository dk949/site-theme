# site-theme

Silicon + Copper design tokens, shared by [david-katz.dev](https://david-katz.dev)
and its business card at [hi.david-katz.dev](https://hi.david-katz.dev).

Wafer-grey surfaces, a copper interconnect accent, a teal secondary. Light by
default, dark via `prefers-color-scheme`, no JS toggle. Tokens plus the shared
icons and the Vite plugin that installs them: no layout, no components, nothing
site-specific.

## Install

From npm:

```sh
npm install @dk949/site-theme
```

Or straight from git, pinned to a tag:

```sh
npm install github:dk949/site-theme#v1.3.0
```

## Use

Tailwind 4 resolves `@import` out of `node_modules`, so the `@theme` block
works exactly as it would inline:

```css
@import "tailwindcss";
@import "@dk949/site-theme/theme.css";
```

Utilities like `bg-bg`, `text-fg-dim`, `border-divider`, `text-accent`,
`font-mono` then resolve against whichever scheme is active.

## Tokens

| Token                              | Role                                          |
| ---------------------------------- | --------------------------------------------- |
| `--color-bg` / `-elev` / `-rail`   | page, raised surface, sidebar                 |
| `--color-fg` / `-dim`              | body text, secondary text                     |
| `--color-muted`                    | metadata and labels                           |
| `--color-border` / `--color-divider` | control outlines, hairline rules            |
| `--color-accent`                   | copper. Interactive: links, nav, hover, focus |
| `--color-accent-2`                 | teal. Informational: hints, pills             |
| `--color-ok`                       | green. Success states                         |
| `--font-sans`                      | Archivo Variable, display headings            |
| `--font-mono`                      | JetBrains Mono Variable, labels and data      |

All foreground/background pairs meet WCAG AA, most at 6:1 or better.

Loading the two font families is the consumer's job; the theme only names
them, and both fall back to a system stack.

## Favicon

`favicon.svg` is the DK monogram from [dk949/logo](https://github.com/dk949/logo)
(`exports/favicon/favicon.svg`), the same mark on both sites. It keeps that
export's 32px grid-fitted path untouched, so stems and bars land on whole
pixels, and only swaps its black/white fill for `--color-accent`: copper
`#96470a` in light, `#e08e4f` in dark, via the same `prefers-color-scheme`
split as the theme. The palette is baked in as literal hex rather than tokens,
because a favicon renders in its own document and never sees the host page's
custom properties. When the logo changes, re-copy the export and re-apply the
two fills.

## Home-screen icon

`apple-touch-icon.png` is the 180px PNG that iOS uses for home-screen
bookmarks and that iMessage and other link previews show beside a URL; they
ignore SVG favicons. It is the same mark, unhinted (180px has room for the
curves), with the logo repo's 20% home-screen padding, in copper `#96470a` on
the light `--color-bg` `#e8eaed`. The tile has to be opaque (iOS fills
transparency with black) and there is no dark-mode switch for it, so it takes
the default light scheme. iOS rounds the corners itself.

`apple-touch-icon.svg` is its source and is not published. To regenerate after
a logo or palette change, rebuild the SVG from the logo repo's `padded()` tile
with the two colours above, then:

```sh
inkscape apple-touch-icon.svg --export-type=png --export-filename=apple-touch-icon.png \
    --export-width=180 --export-height=180
```

## Vite plugin

Static-asset directories (Vite's `public/`, for one) cannot reach into
`node_modules`, so the package ships the plugin that bridges the gap: it serves
both icons in dev and emits them at the site root on build.

```ts
import { themeFavicon } from "@dk949/site-theme/vite";

export default defineConfig({
    plugins: [tailwindcss(), themeFavicon()],
});
```

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

then work unchanged, and no site keeps its own copy to drift. Pass
`themeFavicon({ fileName })` to serve the favicon under a different name, and
`appleTouchIcon` to rename the PNG or `false` to leave it out. The default name
matters: iOS probes `/apple-touch-icon.png` even without the link.

`themeFavicon({ inline: true })` folds each file into its link as a base64
data URI instead of emitting it, so a page that wants to ship as a single
request costs no extra round trip for its icons. The icons still come from
the package either way; only the delivery differs.

`vite` is an optional peer dependency: it is only needed for the type of the
returned plugin, so a consumer that just wants the tokens installs nothing
extra. Outside Vite, `faviconPath` and `appleTouchIconPath` from the same entry
point are the absolute paths to the files, ready to copy wherever a build wants it.

## Versioning

Semver, on the rendered result rather than the file:

- **patch** for a colour nudge that keeps every role and contrast ratio
- **minor** for a new token or a new asset
- **major** for removing or repurposing a token or an asset, or any change that
  moves a contrast pair or visibly shifts the palette

Consumers pin a tag, so nothing lands on a live site until its own build runs.

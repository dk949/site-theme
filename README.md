# site-theme

Silicon + Copper design tokens, shared by [david-katz.dev](https://david-katz.dev)
and its business card at [hi.david-katz.dev](https://hi.david-katz.dev).

Wafer-grey surfaces, a copper interconnect accent, a teal secondary. Light by
default, dark via `prefers-color-scheme`, no JS toggle. Tokens plus the shared
favicon and the Vite plugin that installs it: no layout, no components, nothing
site-specific.

## Install

From npm:

```sh
npm install @dk949/site-theme
```

Or straight from git, pinned to a tag:

```sh
npm install github:dk949/site-theme#v1.1.0
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

`favicon.svg` is a 32x32 rounded chip: `dk` in copper on the dark `--color-bg`,
the same mark on both sites. The palette is baked in as literal hex rather than
tokens, because a favicon renders in its own document and never sees the host
page's custom properties. It is deliberately dark-only; the chip reads on light
and dark browser chrome alike, so there is no `prefers-color-scheme` split.

Static-asset directories (Vite's `public/`, for one) cannot reach into
`node_modules`, so the package ships the plugin that bridges the gap: it serves
the favicon in dev and emits it at the site root on build.

```ts
import { themeFavicon } from "@dk949/site-theme/vite";

export default defineConfig({
    plugins: [tailwindcss(), themeFavicon()],
});
```

`<link rel="icon" href="/favicon.svg" type="image/svg+xml">` then works
unchanged, and no site keeps its own copy to drift. Pass
`themeFavicon({ fileName })` to serve it under a different name.

`themeFavicon({ inline: true })` folds the file into that link as a base64
data URI instead of emitting it, so a page that wants to ship as a single
request costs no extra round trip for its icon. The favicon still comes from
the package either way; only the delivery differs.

`vite` is an optional peer dependency: it is only needed for the type of the
returned plugin, so a consumer that just wants the tokens installs nothing
extra. Outside Vite, `faviconPath` from the same entry point is the absolute
path to the file, ready to copy wherever a build wants it.

## Versioning

Semver, on the rendered result rather than the file:

- **patch** for a colour nudge that keeps every role and contrast ratio
- **minor** for a new token or a new asset
- **major** for removing or repurposing a token or an asset, or any change that
  moves a contrast pair or visibly shifts the palette

Consumers pin a tag, so nothing lands on a live site until its own build runs.

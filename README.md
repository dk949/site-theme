# site-theme

Silicon + Copper design tokens, shared by [david-katz.dev](https://david-katz.dev)
and its business card at [hi.david-katz.dev](https://hi.david-katz.dev).

Wafer-grey surfaces, a copper interconnect accent, a teal secondary. Light by
default, dark via `prefers-color-scheme`, no JS toggle. One file, tokens only:
no layout, no components, nothing site-specific.

## Install

From npm:

```sh
npm install @dk949/site-theme
```

Or straight from git, pinned to a tag:

```sh
npm install github:dk949/site-theme#v1.0.0
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

## Versioning

Semver, on the rendered result rather than the file:

- **patch** for a colour nudge that keeps every role and contrast ratio
- **minor** for a new token
- **major** for removing or repurposing a token, or any change that moves a
  contrast pair or visibly shifts the palette

Consumers pin a tag, so nothing lands on a live site until its own build runs.

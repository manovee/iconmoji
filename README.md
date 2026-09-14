# iconmoji

[![npm version](https://img.shields.io/npm/v/@manovee/iconmoji.svg?style=flat&color=brightgreen)](https://www.npmjs.com/package/@manovee/iconmoji)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/manovee/iconmoji/actions/workflows/ci.yml/badge.svg)](https://github.com/manovee/iconmoji/actions/workflows/ci.yml)
[![Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-orange)](https://manovee.github.io/iconmoji/)

A lightweight, modern icon picker for React and Next.js apps. It ships with:

- A built-in `IconPicker` trigger + popover
- An `IconPickerPanel` you can mount inside shadcn/ui `Popover`, `Dialog`, or any custom surface
- Full Lucide icon support via `lucide-react` with category grouping
- Emoji categories with a denser 7-column grid by default
- Smart Lucide search through tokenized names and synonym expansion
- Optional controlled open state for the trigger + popover wrapper
- Optional icon subsets and search disabling for tighter integrations
- Zero extra runtime dependencies: only peers are `react` and `lucide-react`

## Install

Install `@manovee/iconmoji` alongside its peer dependencies:

```bash
# pnpm
pnpm add @manovee/iconmoji react lucide-react

# npm
npm install @manovee/iconmoji react lucide-react

# yarn
yarn add @manovee/iconmoji react lucide-react

# bun
bun add @manovee/iconmoji react lucide-react
```

For local development in this repo:

```bash
npm install
npm run build
```

## Local preview

A small preview page lives in `preview/` and renders the built package straight from `dist/`.

```bash
npm run dev
# or for a one-off build + server:
npm run preview
```

Then open `http://127.0.0.1:4173/preview/` (or `http://localhost:4173`).

Notes:

- The command rebuilds the package before starting the local server.
- The preview page loads `react`, `react-dom`, and `lucide-react` from `esm.sh`, so your browser needs internet access while previewing.

## Usage

Import the stylesheet once:

```tsx
import "@manovee/iconmoji/styles.css";
```

Then use the default picker:

```tsx
"use client";

import { useState } from "react";
import { IconPicker, type IconPickerValue } from "@manovee/iconmoji";

export function Example() {
  const [value, setValue] = useState<IconPickerValue>({
    type: "lucide",
    value: "FileText",
  });

  return <IconPicker value={value} onChange={setValue} />;
}
```

## Controlled open state

```tsx
"use client";

import { useState } from "react";
import { IconPicker, type IconPickerValue } from "@manovee/iconmoji";

export function ControlledOpenExample() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<IconPickerValue>({
    type: "lucide",
    value: "Sparkles",
  });

  return (
    <IconPicker
      value={value}
      onChange={setValue}
      open={open}
      onOpenChange={setOpen}
    />
  );
}
```

## Icons-only subset

If you only want a short icon shortlist, pass `tabs={["lucide"]}` together with `iconNames`.

```tsx
<IconPicker
  value={value}
  onChange={setValue}
  tabs={["lucide"]}
  iconNames={["Sparkles", "FileText", "Heart", "Globe", "Search"]}
  labels={{ lucideTab: "Icons", searchLucide: "Search icons..." }}
/>
```

## Next.js + shadcn/ui

If you already use shadcn `Popover`, mount the panel directly:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IconPickerPanel, type IconPickerValue } from "@manovee/iconmoji";
import "@manovee/iconmoji/styles.css";

export function ShadcnIconPicker() {
  const [value, setValue] = useState<IconPickerValue>({
    type: "lucide",
    value: "Sparkles",
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Choose icon</Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <IconPickerPanel value={value} onChange={setValue} />
      </PopoverContent>
    </Popover>
  );
}
```

## Theming

Override these CSS variables on a wrapper element or globally:

```css
.my-brand-picker {
  --icon-picker-bg: hsl(var(--background));
  --icon-picker-panel-bg: hsl(var(--popover));
  --icon-picker-border: hsl(var(--border));
  --icon-picker-text: hsl(var(--foreground));
  --icon-picker-muted: hsl(var(--muted-foreground));
  --icon-picker-hover: hsl(var(--accent));
  --icon-picker-selected: hsl(var(--accent) / 0.45);
}
```

## API

### `IconPicker`

Props:

- `value`: `{ type: "lucide" | "emoji"; value: string }`
- `onChange`: callback with the next value
- `open?`: controlled open state
- `defaultOpen?`: uncontrolled initial open state
- `onOpenChange?`: callback when the popover opens or closes
- `tabs?`: defaults to `["lucide", "emoji"]`
- `searchable?`: defaults to `true`
- `iconNames?`: restricts the Lucide tab to a specific icon subset
- `panelHeight?`: defaults to `360`
- `emojiColumns?`: defaults to `7`
- `labels?`: `{ triggerAriaLabel?, lucideTab?, emojiTab?, searchLucide?, searchEmoji?, noResults? }`
- `categoriesUrl?`: CDN endpoint for dynamic Lucide categories or `false` (defaults to `"https://lucide.dev/api/categories"`)
- `emojiDataUrl?`: CDN endpoint for dynamic Emojibase data or `false`
- `buttonClassName?`
- `panelClassName?`
- `closeOnSelect?`: defaults to `true`

### `IconPickerPanel`

Same selection and data props as `IconPicker` (`value`, `onChange`, `tabs`, `searchable`, `categoriesUrl`, `emojiDataUrl`, `labels`, etc.), plus `initialTab?` (`"lucide" | "emoji"`), without the built-in trigger/popover wrapper.

Additional notes:

- `tabs={["lucide"]}` hides the tab switcher automatically.
- `iconNames` only affects the Lucide tab and ignores invalid icon names.
- `labels.lucideTab` can be renamed to `Icons` if you prefer less Lucide-specific UI copy.

## Notes

- This package intentionally treats `react` and `lucide-react` as peers so host apps control their own versions.
- Rendering the complete Lucide catalog is inherently heavier than rendering a small hand-picked icon list. The package uses deferred filtering to keep search responsive.
- Since the package is scoped, `publishConfig.access = "public"` is set so `npm publish` does the right thing for open-source releases.

# iconpicker

A small icon picker package for React and Next.js apps. It ships with:

- A built-in `IconPicker` trigger + popover
- An `IconPickerPanel` you can mount inside shadcn/ui `Popover`, `Dialog`, or any custom surface
- Full Lucide icon support via `lucide-react`
- Emoji categories with a denser 7-column grid by default
- Better Lucide search through tokenized names and synonym expansion

The package does not depend on MUI, shadcn/ui, Tailwind, or Radix. Runtime peers are only `react` and `lucide-react`.

## Install

```bash
npm install react lucide-react
```

For local development in this repo:

```bash
npm install
npm run build
```

## Usage

Import the stylesheet once:

```tsx
import "@manoharv/iconpicker/styles.css";
```

Then use the default picker:

```tsx
"use client";

import { useState } from "react";
import { IconPicker, type IconPickerValue } from "@manoharv/iconpicker";

export function Example() {
  const [value, setValue] = useState<IconPickerValue>({
    type: "lucide",
    value: "FileText",
  });

  return <IconPicker value={value} onChange={setValue} />;
}
```

## Next.js + shadcn/ui

If you already use shadcn `Popover`, mount the panel directly:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IconPickerPanel, type IconPickerValue } from "@manoharv/iconpicker";
import "@manoharv/iconpicker/styles.css";

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
- `tabs?`: defaults to `["lucide", "emoji"]`
- `panelHeight?`: defaults to `360`
- `emojiColumns?`: defaults to `7`
- `buttonClassName?`
- `panelClassName?`
- `closeOnSelect?`: defaults to `true`

### `IconPickerPanel`

Same selection props as `IconPicker`, but without the built-in trigger/popover wrapper.

## Notes

- This package intentionally treats `react` and `lucide-react` as peers so host apps control their own versions.
- Rendering the complete Lucide catalog is inherently heavier than rendering a small hand-picked icon list. The package uses deferred filtering to keep search responsive.

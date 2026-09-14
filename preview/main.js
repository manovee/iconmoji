import React, { startTransition, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import htm from "https://esm.sh/htm@3.1.1";
import {
  Copy as CopyIcon,
  Eye,
  Code2,
  Sun,
  Moon,
  Github,
  Sparkles,
  Check,
  ArrowRight,
  Box,
  Zap,
  Palette,
  Smile
} from "lucide-react";
import {
  IconPicker,
  IconPickerPanel,
  getEmojiLabel,
  humanizeIconName
} from "../dist/index.js";

const html = htm.bind(React.createElement);
const THEME_STORAGE_KEY = "iconmoji-preview-theme";

const THEMES = {
  light: {
    "--page-background": "linear-gradient(180deg, #f7f1ea 0%, #fffbf5 100%)",
    "--page-text": "#11192d",
    "--page-muted": "#62708a",
    "--page-card": "rgba(255, 255, 255, 0.66)",
    "--page-card-strong": "rgba(255, 255, 255, 0.82)",
    "--page-line": "rgba(15, 23, 42, 0.08)",
    "--page-shadow": "0 28px 80px rgba(15, 23, 42, 0.08)",
    "--page-accent": "#c75b12",
    "--page-glow-1": "rgba(251, 146, 60, 0.18)",
    "--page-glow-2": "rgba(59, 130, 246, 0.12)",
    "--page-chip-bg": "rgba(255, 255, 255, 0.72)",
    "--page-chip-text": "#42506c",
    "--icon-picker-bg": "rgba(255, 255, 255, 0.88)",
    "--icon-picker-panel-bg": "rgba(255, 252, 247, 0.98)",
    "--icon-picker-border": "rgba(15, 23, 42, 0.1)",
    "--icon-picker-text": "#1f2937",
    "--icon-picker-muted": "#64748b",
    "--icon-picker-hover": "rgba(251, 146, 60, 0.12)",
    "--icon-picker-selected": "rgba(249, 115, 22, 0.18)",
    "--icon-picker-shadow": "0 28px 70px rgba(15, 23, 42, 0.18)",
    "--preview-icon-picker-bg": "rgba(255, 255, 255, 0.88)",
    "--preview-icon-picker-panel-bg": "rgba(255, 252, 247, 0.98)",
    "--preview-icon-picker-border": "rgba(15, 23, 42, 0.1)",
    "--preview-icon-picker-text": "#1f2937",
    "--preview-icon-picker-muted": "#64748b",
    "--preview-icon-picker-hover": "rgba(251, 146, 60, 0.12)",
    "--preview-icon-picker-selected": "rgba(249, 115, 22, 0.18)",
    "--preview-icon-picker-shadow": "0 28px 70px rgba(15, 23, 42, 0.18)",
    "--icon-picker-width": "100%",
    "--preview-surface": "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(251, 241, 228, 0.9))",
    "--preview-orb": "rgba(251, 146, 60, 0.16)",
    "--preview-code-bg": "rgba(250, 247, 242, 0.92)"
  },
  dark: {
    "--page-background": "linear-gradient(180deg, #09111f 0%, #0e1728 100%)",
    "--page-text": "#edf2ff",
    "--page-muted": "#9aa9c4",
    "--page-card": "rgba(8, 15, 29, 0.68)",
    "--page-card-strong": "rgba(12, 21, 38, 0.82)",
    "--page-line": "rgba(148, 163, 184, 0.16)",
    "--page-shadow": "0 34px 90px rgba(2, 6, 23, 0.42)",
    "--page-accent": "#8cc8ff",
    "--page-glow-1": "rgba(56, 189, 248, 0.18)",
    "--page-glow-2": "rgba(129, 140, 248, 0.14)",
    "--page-chip-bg": "rgba(255, 255, 255, 0.08)",
    "--page-chip-text": "#d7e3fa",
    "--icon-picker-bg": "rgba(15, 23, 42, 0.78)",
    "--icon-picker-panel-bg": "rgba(15, 23, 42, 0.96)",
    "--icon-picker-border": "rgba(148, 163, 184, 0.18)",
    "--icon-picker-text": "#e2e8f0",
    "--icon-picker-muted": "#94a3b8",
    "--icon-picker-hover": "rgba(56, 189, 248, 0.14)",
    "--icon-picker-selected": "rgba(14, 165, 233, 0.2)",
    "--icon-picker-shadow": "0 30px 80px rgba(2, 6, 23, 0.45)",
    "--preview-icon-picker-bg": "rgba(15, 23, 42, 0.78)",
    "--preview-icon-picker-panel-bg": "rgba(15, 23, 42, 0.96)",
    "--preview-icon-picker-border": "rgba(148, 163, 184, 0.18)",
    "--preview-icon-picker-text": "#e2e8f0",
    "--preview-icon-picker-muted": "#94a3b8",
    "--preview-icon-picker-hover": "rgba(56, 189, 248, 0.14)",
    "--preview-icon-picker-selected": "rgba(14, 165, 233, 0.2)",
    "--preview-icon-picker-shadow": "0 30px 80px rgba(2, 6, 23, 0.45)",
    "--icon-picker-width": "100%",
    "--preview-surface": "linear-gradient(180deg, rgba(17, 24, 39, 0.98), rgba(8, 15, 30, 0.96))",
    "--preview-orb": "rgba(56, 189, 248, 0.18)",
    "--preview-code-bg": "rgba(7, 12, 22, 0.92)"
  }
};

const PREVIEW_LABELS = {
  triggerAriaLabel: "Preview the panel-only icon picker",
  lucideTab: "Icons",
  emojiTab: "Emoji",
  searchLucide: "Search icons...",
  searchEmoji: "Search emoji mood or meaning...",
  noResults: (query) => query ? `Nothing matched "${query}".` : "No icons available."
};

const INSTALL_COMMANDS = {
  pnpm: "pnpm add @manovee/iconmoji react lucide-react",
  npm: "npm install @manovee/iconmoji react lucide-react",
  yarn: "yarn add @manovee/iconmoji react lucide-react",
  bun: "bun add @manovee/iconmoji react lucide-react"
};

const FEATURES = [
  {
    icon: Zap,
    title: "Zero Bloat (< 140 kB)",
    description: "Only react and lucide-react as peers. No heavy UI framework or runtime dependencies."
  },
  {
    icon: Sparkles,
    title: "1,500+ Lucide Icons",
    description: "Tokenized fuzzy search, category grouping, and synonym alias expansion for fast discovery."
  },
  {
    icon: Smile,
    title: "Full Emoji Catalog",
    description: "Clean 7-column emoji grid organized by categories with instant mood and keyword matching."
  },
  {
    icon: Palette,
    title: "100% CSS Theming",
    description: "Built with standard CSS variables. Naturally adopts your shadcn/ui, Tailwind, or custom dark theme."
  },
  {
    icon: Box,
    title: "Trigger or Headless Panel",
    description: "Use the ready-made popover trigger, or mount the panel straight into shadcn Dialogs and Drawers."
  },
  {
    icon: Code2,
    title: "Next.js & RSC Ready",
    description: 'Pre-configured with "use client" banner, TypeScript types, and dual ESM/CJS bundles.'
  }
];

function HeroSection() {
  const [copied, setCopied] = useState(false);
  const copyCommand = "pnpm add @manovee/iconmoji react lucide-react";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyCommand);
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return html`
    <header className="preview-hero">
      <div className="preview-hero__badge">
        <${Sparkles} size=${14} />
        <span>v0.1.0 live on npm • Zero dependencies • 1,500+ Icons</span>
      </div>

      <h1 className="preview-hero__title">
        The Icon & Emoji Picker<br />
        <span className="preview-hero__title-gradient">React & Next.js Deserved</span>
      </h1>

      <p className="preview-hero__lead">
        A fast, accessible, plug-and-play picker. Ships with 1,500+ Lucide icons, full Unicode emoji categories,
        synonym search, and clean CSS variables. Seamless with shadcn/ui, Tailwind, and Next.js App Router.
      </p>

      <div className="preview-hero__actions">
        <a href="#quickstart" className="preview-btn preview-btn--primary">
          Quick Start <${ArrowRight} size=${16} />
        </a>
        <a
          href="https://github.com/manovee/iconmoji"
          target="_blank"
          rel="noopener noreferrer"
          className="preview-btn preview-btn--secondary">
          <${Github} size=${16} /> Star on GitHub
        </a>
        <button type="button" className="preview-command-pill" onClick=${onCopy} title="Click to copy install command">
          <code>${copyCommand}</code>
          ${copied ? html`<${Check} size=${14} />` : html`<${CopyIcon} size=${14} />`}
        </button>
      </div>

      <div className="preview-features-grid">
        ${FEATURES.map(
          (f) => html`
            <div key=${f.title} className="preview-feature-card">
              <div className="preview-feature-icon">
                <${f.icon} size=${18} />
              </div>
              <h4>${f.title}</h4>
              <p>${f.description}</p>
            </div>
          `
        )}
      </div>
    </header>
  `;
}

function QuickStartSection() {
  const [manager, setManager] = useState("pnpm");
  const command = INSTALL_COMMANDS[manager];

  return html`
    <section id="quickstart" className="preview-quickstart">
      <div className="preview-doc-card__header">
        <div>
          <p className="preview-eyebrow">Get Started in 30 Seconds</p>
          <h3>Simple 3-Step Setup</h3>
        </div>

        <div className="preview-mini-tabs" role="tablist" aria-label="Package manager">
          ${Object.keys(INSTALL_COMMANDS).map(
            (item) => html`
              <button
                key=${item}
                type="button"
                className=${manager === item ? "is-active" : ""}
                onClick=${() => setManager(item)}>
                ${item}
              </button>
            `
          )}
        </div>
      </div>

      <div className="preview-steps-grid">
        <div className="preview-step-card">
          <div className="preview-step-number">1</div>
          <div className="preview-step-content">
            <h4>Install package</h4>
            <p>Add <code>@manovee/iconmoji</code> and peer dependencies</p>
            <div className="preview-inline-command preview-inline-command--compact">
              <code>${command}</code>
              <${CopyButton} text=${command} label="Copy command" />
            </div>
          </div>
        </div>

        <div className="preview-step-card">
          <div className="preview-step-number">2</div>
          <div className="preview-step-content">
            <h4>Import stylesheet</h4>
            <p>Include the CSS once in your layout or entry file</p>
            <div className="preview-inline-command preview-inline-command--compact">
              <code>import "@manovee/iconmoji/styles.css";</code>
              <${CopyButton} text='import "@manovee/iconmoji/styles.css";' label="Copy import" />
            </div>
          </div>
        </div>

        <div className="preview-step-card">
          <div className="preview-step-number">3</div>
          <div className="preview-step-content">
            <h4>Render picker</h4>
            <p>Pass state and handler, that's all!</p>
            <div className="preview-inline-command preview-inline-command--compact">
              <code>&lt;IconPicker value={value} onChange={setValue} /&gt;</code>
              <${CopyButton} text='<IconPicker value={value} onChange={setValue} />' label="Copy code" />
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

const BUILTIN_CODE = `"use client";

import { useState } from "react";
import { IconPicker, type IconPickerValue } from "@manovee/iconmoji";
import "@manovee/iconmoji/styles.css";

export function Example() {
  const [value, setValue] = useState<IconPickerValue>({
    type: "lucide",
    value: "Sparkles",
  });

  return (
    <IconPicker
      value={value}
      onChange={setValue}
      labels={{ lucideTab: "Icons" }}
    />
  );
}`;

const PANEL_CODE = `"use client";

import { useState } from "react";
import { IconPickerPanel, type IconPickerValue } from "@manovee/iconmoji";
import "@manovee/iconmoji/styles.css";

export function PanelExample() {
  const [value, setValue] = useState<IconPickerValue>({
    type: "emoji",
    value: "😀",
  });

  return (
    <IconPickerPanel
      value={value}
      onChange={setValue}
      labels={{ lucideTab: "Icons" }}
      initialTab="emoji"
      emojiColumns={8}
    />
  );
}`;

const PROPS = [
  ["value", "{ type: 'lucide' | 'emoji'; value: string }", "-", "Current selected value."],
  ["onChange", "(value) => void", "-", "Called when a new icon or emoji is selected."],
  ["open", "boolean", "-", "Controlled open state for the built-in picker."],
  ["defaultOpen", "boolean", "false", "Initial open state for uncontrolled usage."],
  ["onOpenChange", "(open: boolean) => void", "-", "Called when the popover opens or closes."],
  ["tabs", "('lucide' | 'emoji')[]", "['lucide', 'emoji']", "Choose which tabs are available."],
  ["searchable", "boolean", "true", "Hide or show the search input."],
  ["iconNames", "string[]", "all icons", "Restrict the icons tab to a specific subset."],
  ["panelHeight", "number", "360", "Scrollable panel height in pixels."],
  ["emojiColumns", "number", "7", "Number of emoji columns."],
  ["labels", "Partial<IconPickerLabels>", "-", "Override UI labels like Icons and search placeholders."],
  ["closeOnSelect", "boolean", "true", "Close the built-in popover after selection."],
  ["categoriesUrl", "string | false", "https://lucide.dev/api/categories", "Custom CDN endpoint for dynamic Lucide categories, or false to disable."],
  ["emojiDataUrl", "string | false", "https://cdn.jsdelivr.net/npm/emojibase-data...", "Custom CDN endpoint for dynamic emoji dataset (Emojibase), or false to disable."],
  ["buttonClassName", "string", "-", "Custom class for the built-in trigger button."],
  ["panelClassName", "string", "-", "Custom class for the rendered panel wrapper."]
];

function getInitialTheme() {
  try {
    const storedTheme = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {}

  return globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function describeSelection(value) {
  if (value.type === "emoji") {
    return `${value.value} ${getEmojiLabel(value.value) ?? "Emoji"}`;
  }

  return humanizeIconName(value.value);
}

function CopyButton({ text, label, copiedLabel = "Copied" }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return html`
    <button type="button" className="preview-icon-button" onClick=${onCopy} aria-label=${copied ? copiedLabel : label} title=${copied ? copiedLabel : label}>
      <${CopyIcon} size=${16} />
    </button>
  `;
}

function StageShell({ title, eyebrow, mode, setMode, code, children }) {
  return html`
    <article className="preview-stage">
      <div className="preview-stage__header">
        <div>
          <p className="preview-eyebrow">${eyebrow}</p>
          <h2>${title}</h2>
        </div>

        <div className="preview-stage__controls">
          <${CopyButton} text=${code} label="Copy code" copiedLabel="Copied" />
          <div className="preview-mini-tabs preview-mini-tabs--icon" role="tablist" aria-label="${title} mode">
            <button
              type="button"
              className=${mode === "preview" ? "is-active" : ""}
              onClick=${() => setMode("preview")}
              aria-label="Preview"
              title="Preview">
              <${Eye} size=${15} />
            </button>
            <button
              type="button"
              className=${mode === "code" ? "is-active" : ""}
              onClick=${() => setMode("code")}
              aria-label="Code"
              title="Code">
              <${Code2} size=${15} />
            </button>
          </div>
        </div>
      </div>

      ${mode === "preview"
        ? html`<div className="preview-stage__body">${children}</div>`
        : html`
            <div className="preview-code-block">
              <pre><code>${code}</code></pre>
            </div>
          `}
    </article>
  `;
}


function PropsTable() {
  return html`
    <section className="preview-props">
      <div className="preview-doc-card__header">
        <div>
          <p className="preview-eyebrow">Props</p>
          <h3>Public API</h3>
        </div>
      </div>

      <div className="preview-table-wrap">
        <table className="preview-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${PROPS.map(
              ([name, type, fallback, description]) => html`
                <tr key=${name}>
                  <td><code>${name}</code></td>
                  <td><code>${type}</code></td>
                  <td><code>${fallback}</code></td>
                  <td>${description}</td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [closeOnSelect, setCloseOnSelect] = useState(true);
  const [builtInMode, setBuiltInMode] = useState("preview");
  const [panelMode, setPanelMode] = useState("preview");
  const [pickerValue, setPickerValue] = useState({
    type: "lucide",
    value: "Sparkles"
  });
  const [panelValue, setPanelValue] = useState({
    type: "emoji",
    value: "😀"
  });

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    const themeBg = theme === "dark" ? "#09111f" : "#f7f1ea";
    document.documentElement.style.backgroundColor = themeBg;
    if (document.body) {
      document.body.style.backgroundColor = themeBg;
    }
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", themeBg);
    }
  }, [theme]);

  const pageStyle = {
    ...THEMES[theme],
    colorScheme: theme
  };

  const applyTheme = (nextTheme) => {
    startTransition(() => setTheme(nextTheme));
  };

  const applyPickerValue = (nextValue) => {
    startTransition(() => setPickerValue(nextValue));
  };

  const applyPanelValue = (nextValue) => {
    startTransition(() => setPanelValue(nextValue));
  };

  return html`
    <div className="preview-app" data-theme=${theme} style=${pageStyle}>
      <div className="preview-backdrop"></div>
      <main className="preview-layout">
        <header className="preview-topbar">
          <div className="preview-brand">
            <span className="preview-brand__mark"></span>
            <div className="preview-brand__copy">
              <strong>iconmoji</strong>
              <span className="preview-badge-pill">v0.1.0</span>
            </div>
          </div>

          <div className="preview-topbar__actions">
            <a
              href="https://github.com/manovee/iconmoji"
              target="_blank"
              rel="noopener noreferrer"
              className="preview-topbar-link"
              title="Star on GitHub">
              <${Github} size=${15} />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.npmjs.com/package/@manovee/iconmoji"
              target="_blank"
              rel="noopener noreferrer"
              className="preview-topbar-link"
              title="View package on npm">
              <${Box} size=${15} />
              <span>npm</span>
            </a>

            <label className="preview-toggle">
              <input
                type="checkbox"
                checked=${closeOnSelect}
                onChange=${(event) => setCloseOnSelect(event.target.checked)}
              />
              <span>Close after pick</span>
            </label>

            <div className="preview-segmented preview-segmented--icon" role="tablist" aria-label="Preview theme">
              <button type="button" className=${theme === "light" ? "is-active" : ""} onClick=${() => applyTheme("light")} aria-label="Light mode" title="Light mode">
                <${Sun} size=${15} />
              </button>
              <button type="button" className=${theme === "dark" ? "is-active" : ""} onClick=${() => applyTheme("dark")} aria-label="Dark mode" title="Dark mode">
                <${Moon} size=${15} />
              </button>
            </div>
          </div>
        </header>

        <${HeroSection} />

        <${QuickStartSection} />

        <section className="preview-doc-card" style=${{ marginBottom: "20px" }}>
          <div className="preview-doc-card__header">
            <div>
              <p className="preview-eyebrow">Live Playground</p>
              <h3>Try the components</h3>
            </div>
          </div>
        </section>

        <section className="preview-showcase">
          <${StageShell}
            title="Trigger + popover"
            eyebrow="Built-in picker"
            mode=${builtInMode}
            setMode=${setBuiltInMode}
            code=${BUILTIN_CODE}
            >
            <div className="preview-canvas preview-canvas--flat">
              <div className="preview-canvas__orb"></div>
              <div className="preview-canvas__content">
                <span className="preview-chip">${describeSelection(pickerValue)}</span>
                <div className="preview-picker-wrap">
                  <${IconPicker}
                    value=${pickerValue}
                    onChange=${applyPickerValue}
                    closeOnSelect=${closeOnSelect}
                    panelHeight=${280}
                    labels=${PREVIEW_LABELS}
                  />
                </div>
              </div>
            </div>
          </${StageShell}>

          <${StageShell}
            title="Drop into any shell"
            eyebrow="Panel API"
            mode=${panelMode}
            setMode=${setPanelMode}
            code=${PANEL_CODE}
            >
            <div className="preview-panel-shell preview-panel-shell--flat">
              <${IconPickerPanel}
                value=${panelValue}
                onChange=${applyPanelValue}
                initialTab="emoji"
                panelHeight=${420}
                emojiColumns=${8}
                labels=${PREVIEW_LABELS}
              />
            </div>
          </${StageShell}>
        </section>

        <section className="preview-doc-stack">
          <section className="preview-doc-card">
            <div className="preview-doc-card__header">
              <div>
                <p className="preview-eyebrow">Integration</p>
                <h3>Pro Tips</h3>
              </div>
            </div>
            <div className="preview-doc-list">
              <p>Import <code>@manovee/iconmoji/styles.css</code> once in your application root layout.</p>
              <p>Use <code>IconPickerPanel</code> inside shadcn/ui <code>Popover</code> or <code>Dialog</code> for custom triggers.</p>
              <p>Rename the tab label to <code>Icons</code> using <code>labels={{ lucideTab: "Icons" }}</code>.</p>
              <p>Pass <code>iconNames</code> to restrict icons to a curated subset for tighter product interfaces.</p>
            </div>
          </section>
        </section>

        <${PropsTable} />

        <footer className="preview-footer">
          <div>
            <p>
              Built with ❤️ by <strong>Manohar V</strong> in Tiruvannamalai. Distributed under the <strong>MIT License</strong>.
            </p>
            <div className="preview-footer__links">
              <a href="https://github.com/manovee/iconmoji" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span>•</span>
              <a href="https://www.npmjs.com/package/@manovee/iconmoji" target="_blank" rel="noopener noreferrer">npm</a>
              <span>•</span>
              <a href="https://github.com/manovee/iconmoji/issues" target="_blank" rel="noopener noreferrer">Report Issue</a>
              <span>•</span>
              <a href="https://github.com/manovee/iconmoji/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">License</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `;
}

createRoot(document.getElementById("app")).render(html`<${App} />`);

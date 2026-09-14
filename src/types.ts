import type { CSSProperties } from 'react';

export type IconType = 'lucide' | 'emoji';

export interface IconPickerValue {
  type: IconType;
  value: string;
}

export interface EmojiEntry {
  emoji: string;
  label: string;
  keywords: string[];
}

export interface EmojiCategory {
  label: string;
  keywords: string[];
  emojis: EmojiEntry[];
}

export interface IconPickerLabels {
  triggerAriaLabel: string;
  lucideTab: string;
  emojiTab: string;
  searchLucide: string;
  searchEmoji: string;
  noResults: (query: string) => string;
}

export const DEFAULT_LABELS: IconPickerLabels = {
  triggerAriaLabel: 'Choose an icon',
  lucideTab: 'Lucide',
  emojiTab: 'Emoji',
  searchLucide: 'Search icons...',
  searchEmoji: 'Search emoji...',
  noResults: (query) => `No icons found for "${query}"`
};

export interface LucideCategory {
  label: string;
  icons: string[];
}

export interface IconPickerPanelProps {
  value: IconPickerValue;
  onChange: (value: IconPickerValue) => void;
  tabs?: IconType[];
  initialTab?: IconType;
  searchable?: boolean;
  iconNames?: string[];
  panelHeight?: number;
  emojiColumns?: number;
  className?: string;
  id?: string;
  labels?: Partial<IconPickerLabels>;
  style?: CSSProperties;
  categoriesUrl?: string | false;
  emojiDataUrl?: string | false;
}

export interface IconPickerProps extends Omit<IconPickerPanelProps, 'id' | 'className'> {
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  closeOnSelect?: boolean;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}


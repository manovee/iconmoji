"use client";

import React, { useDeferredValue, useMemo, useState } from 'react';
import { Image as ImageIcon, Search as SearchIcon, Smile } from 'lucide-react';
import { filterEmojiCategories } from '../data/emojis';
import { filterLucideIcons, getLucideIcon, humanizeIconName } from '../data/lucideSearch';
import type { IconPickerLabels, IconPickerPanelProps, IconType } from '../types';
import { DEFAULT_LABELS } from '../types';
import { cx } from '../utils/cx';

const DEFAULT_TABS: IconType[] = ['lucide', 'emoji'];

function resolveTabs(tabs?: IconType[]): IconType[] {
  if (!tabs?.length) return DEFAULT_TABS;
  const filteredTabs = tabs.filter((tab, index) => DEFAULT_TABS.includes(tab) && tabs.indexOf(tab) === index);
  return filteredTabs.length > 0 ? filteredTabs : DEFAULT_TABS;
}

function mergeLabels(labels?: Partial<IconPickerLabels>): IconPickerLabels {
  return { ...DEFAULT_LABELS, ...labels };
}

function resolveInitialTab(valueType: IconType, availableTabs: IconType[], initialTab?: IconType): IconType {
  if (initialTab && availableTabs.includes(initialTab)) return initialTab;
  if (availableTabs.includes(valueType)) return valueType;
  return availableTabs[0] ?? 'lucide';
}

function EmptyResults({ message }: { message: string }) {
  return <div className="icon-picker__empty">{message}</div>;
}

export function IconPickerPanel({
  value,
  onChange,
  tabs,
  initialTab,
  panelHeight = 360,
  emojiColumns = 7,
  className,
  id,
  labels,
  style
}: IconPickerPanelProps) {
  const availableTabs = resolveTabs(tabs);
  const mergedLabels = mergeLabels(labels);
  const [activeTab, setActiveTab] = useState<IconType>(() => resolveInitialTab(value.type, availableTabs, initialTab));
  const [lucideQuery, setLucideQuery] = useState('');
  const [emojiQuery, setEmojiQuery] = useState('');
  const deferredLucideQuery = useDeferredValue(lucideQuery);
  const deferredEmojiQuery = useDeferredValue(emojiQuery);

  const filteredLucide = useMemo(() => filterLucideIcons(deferredLucideQuery), [deferredLucideQuery]);
  const filteredEmojis = useMemo(() => filterEmojiCategories(deferredEmojiQuery), [deferredEmojiQuery]);
  const activeQuery = activeTab === 'emoji' ? emojiQuery : lucideQuery;

  const panelStyle = {
    '--icon-picker-panel-height': `${panelHeight}px`,
    '--icon-picker-emoji-columns': String(emojiColumns),
    ...style
  } as React.CSSProperties;

  return (
    <div id={id} className={cx('icon-picker__panel', className)} style={panelStyle} role="dialog" aria-label={mergedLabels.triggerAriaLabel}>
      <div className="icon-picker__tabs" role="tablist" aria-label="Icon picker tabs">
        {availableTabs.includes('lucide') ? (
          <button
            type="button"
            className={cx('icon-picker__tab', activeTab === 'lucide' && 'is-active')}
            role="tab"
            aria-selected={activeTab === 'lucide'}
            onClick={() => {
              setActiveTab('lucide');
              setLucideQuery('');
              setEmojiQuery('');
            }}>
            <ImageIcon size={16} />
            <span>{mergedLabels.lucideTab}</span>
          </button>
        ) : null}
        {availableTabs.includes('emoji') ? (
          <button
            type="button"
            className={cx('icon-picker__tab', activeTab === 'emoji' && 'is-active')}
            role="tab"
            aria-selected={activeTab === 'emoji'}
            onClick={() => {
              setActiveTab('emoji');
              setLucideQuery('');
              setEmojiQuery('');
            }}>
            <Smile size={16} />
            <span>{mergedLabels.emojiTab}</span>
          </button>
        ) : null}
      </div>

      <div className="icon-picker__search">
        <SearchIcon size={16} className="icon-picker__search-icon" />
        <input
          type="search"
          value={activeTab === 'emoji' ? emojiQuery : lucideQuery}
          onChange={(event) => {
            if (activeTab === 'emoji') {
              setEmojiQuery(event.target.value);
            } else {
              setLucideQuery(event.target.value);
            }
          }}
          placeholder={activeTab === 'emoji' ? mergedLabels.searchEmoji : mergedLabels.searchLucide}
          className="icon-picker__search-input"
        />
      </div>

      <div className="icon-picker__body">
        {activeTab === 'lucide' ? (
          filteredLucide.length === 0 ? (
            <EmptyResults message={mergedLabels.noResults(activeQuery)} />
          ) : (
            <div className="icon-picker__grid" aria-label="Lucide icons">
              {filteredLucide.map((name) => {
                const Icon = getLucideIcon(name);
                const isSelected = value.type === 'lucide' && value.value === name;

                return (
                  <button
                    key={name}
                    type="button"
                    className={cx('icon-picker__item', isSelected && 'is-selected')}
                    aria-pressed={isSelected}
                    title={humanizeIconName(name)}
                    onClick={() => onChange({ type: 'lucide', value: name })}>
                    <Icon size={22} />
                  </button>
                );
              })}
            </div>
          )
        ) : filteredEmojis.length === 0 ? (
          <EmptyResults message={mergedLabels.noResults(activeQuery)} />
        ) : (
          <div className="icon-picker__emoji-sections">
            {filteredEmojis.map((category) => (
              <section key={category.label} className="icon-picker__section">
                <div className="icon-picker__section-title">{category.label}</div>
                <div className="icon-picker__grid icon-picker__grid--emoji" aria-label={category.label}>
                  {category.emojis.map((emoji) => {
                    const isSelected = value.type === 'emoji' && value.value === emoji.emoji;

                    return (
                      <button
                        key={`${category.label}-${emoji.emoji}`}
                        type="button"
                        className={cx('icon-picker__item', 'icon-picker__item--emoji', isSelected && 'is-selected')}
                        aria-pressed={isSelected}
                        title={emoji.label}
                        onClick={() => onChange({ type: 'emoji', value: emoji.emoji })}>
                        {emoji.emoji}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

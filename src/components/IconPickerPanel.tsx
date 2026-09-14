"use client";

import React, { useEffect, useDeferredValue, useMemo, useRef, useState } from 'react';
import { Search as SearchIcon, Smile, Sparkles, X } from 'lucide-react';
import { EMOJI_CATEGORIES, fetchEmojiData, filterEmojiCategories } from '../data/emojis';
import { BASE_LUCIDE_CATEGORIES, fetchLucideCategories, filterLucideCategories } from '../data/lucideCategories';
import { getLucideIcon, humanizeIconName } from '../data/lucideSearch';
import type { EmojiCategory, IconPickerLabels, IconPickerPanelProps, IconType, LucideCategory } from '../types';
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
  searchable = true,
  iconNames,
  panelHeight = 360,
  emojiColumns = 7,
  className,
  id,
  labels,
  style,
  categoriesUrl,
  emojiDataUrl
}: IconPickerPanelProps) {
  const availableTabs = resolveTabs(tabs);
  const mergedLabels = mergeLabels(labels);
  const [activeTab, setActiveTab] = useState<IconType>(() => resolveInitialTab(value.type, availableTabs, initialTab));
  const [lucideCategories, setLucideCategories] = useState<LucideCategory[]>(BASE_LUCIDE_CATEGORIES);
  const [emojiCategories, setEmojiCategories] = useState<EmojiCategory[]>(EMOJI_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    if (categoriesUrl !== false) {
      fetchLucideCategories(typeof categoriesUrl === 'string' ? categoriesUrl : undefined)
        .then((cats) => {
          if (isMounted && cats && cats.length > 0) {
            setLucideCategories(cats);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [categoriesUrl]);

  useEffect(() => {
    let isMounted = true;
    if (emojiDataUrl !== false) {
      fetchEmojiData(typeof emojiDataUrl === 'string' ? emojiDataUrl : undefined)
        .then((cats) => {
          if (isMounted && cats && cats.length > 0) {
            setEmojiCategories(cats);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [emojiDataUrl]);

  const filteredLucide = useMemo(
    () => filterLucideCategories(deferredSearchQuery, iconNames, lucideCategories),
    [deferredSearchQuery, iconNames, lucideCategories]
  );
  const filteredEmojis = useMemo(
    () => filterEmojiCategories(deferredSearchQuery, emojiCategories),
    [deferredSearchQuery, emojiCategories]
  );
  const showTabs = availableTabs.length > 1;

  const panelStyle = {
    '--icon-picker-panel-height': `${panelHeight}px`,
    '--icon-picker-emoji-columns': String(emojiColumns),
    ...style
  } as React.CSSProperties;

  return (
    <div id={id} className={cx('icon-picker__panel', className)} style={panelStyle} role="dialog" aria-label={mergedLabels.triggerAriaLabel}>
      {showTabs ? (
        <div className="icon-picker__tabs" role="tablist" aria-label="Icon picker tabs">
          {availableTabs.includes('lucide') ? (
            <button
              type="button"
              className={cx('icon-picker__tab', activeTab === 'lucide' && 'is-active')}
              role="tab"
              aria-selected={activeTab === 'lucide'}
              onClick={() => {
                setActiveTab('lucide');
              }}>
              <Sparkles size={15} />
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
              }}>
              <Smile size={15} />
              <span>{mergedLabels.emojiTab}</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {searchable ? (
        <div className="icon-picker__search">
          <SearchIcon size={15} className="icon-picker__search-icon" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && searchQuery) {
                event.stopPropagation();
                setSearchQuery('');
              }
            }}
            placeholder={activeTab === 'emoji' ? mergedLabels.searchEmoji : mergedLabels.searchLucide}
            className="icon-picker__search-input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {searchQuery ? (
            <button
              type="button"
              className="icon-picker__search-clear"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label={mergedLabels.clearSearch || 'Clear search'}
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="icon-picker__body">
        {activeTab === 'lucide' ? (
          filteredLucide.length === 0 ? (
            <EmptyResults message={mergedLabels.noResults(searchQuery)} />
          ) : (
            <div className="icon-picker__sections">
              {filteredLucide.map((category) => (
                <section key={category.label} className="icon-picker__section">
                  <div className="icon-picker__section-title">{category.label}</div>
                  <div className="icon-picker__grid" aria-label={category.label}>
                    {category.icons.map((name) => {
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
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )
        ) : filteredEmojis.length === 0 ? (
          <EmptyResults message={mergedLabels.noResults(searchQuery)} />
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

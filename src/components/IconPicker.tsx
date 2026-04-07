"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getEmojiLabel } from '../data/emojis';
import { getLucideIcon, humanizeIconName } from '../data/lucideSearch';
import { IconPickerPanel } from './IconPickerPanel';
import type { IconPickerProps, IconPickerValue } from '../types';
import { cx } from '../utils/cx';

function TriggerPreview({ value }: { value: IconPickerValue }) {
  if (value.type === 'emoji') {
    return <span className="icon-picker__trigger-emoji">{value.value || '😀'}</span>;
  }

  const Icon = getLucideIcon(value.value);
  return <Icon size={18} />;
}

function getTriggerLabel(value: IconPickerValue): string {
  if (value.type === 'emoji') {
    return getEmojiLabel(value.value) ?? 'Emoji';
  }

  return humanizeIconName(value.value || 'FileText');
}

export function IconPicker({
  value,
  onChange,
  className,
  buttonClassName,
  panelClassName,
  closeOnSelect = true,
  disabled = false,
  ...panelProps
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const triggerLabel = useMemo(() => getTriggerLabel(value), [value]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={cx('icon-picker', className)} ref={rootRef}>
      <button
        type="button"
        className={cx('icon-picker__trigger', buttonClassName)}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}>
        <span className="icon-picker__trigger-preview">
          <TriggerPreview value={value} />
        </span>
        <span className="icon-picker__trigger-text">{triggerLabel}</span>
        <ChevronDown size={16} className={cx('icon-picker__trigger-chevron', open && 'is-open')} />
      </button>

      {open ? (
        <div className="icon-picker__popover">
          <IconPickerPanel
            {...panelProps}
            id={panelId}
            value={value}
            className={panelClassName}
            onChange={(nextValue) => {
              onChange(nextValue);
              if (closeOnSelect) {
                setOpen(false);
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

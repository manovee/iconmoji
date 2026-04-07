import type { EmojiCategory, EmojiEntry } from '../types';
import { matchesAllTokens, normalizeSearch } from '../utils/search';

function entry(emoji: string, label: string, keywords: string[]): EmojiEntry {
  return { emoji, label, keywords };
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    label: 'Frequently Used',
    keywords: ['popular', 'common', 'favorites'],
    emojis: [
      entry('👍', 'Thumbs Up', ['approve', 'like', 'yes']),
      entry('😀', 'Grinning Face', ['happy', 'smile']),
      entry('😘', 'Face Blowing a Kiss', ['love', 'affection']),
      entry('😍', 'Smiling Face With Heart Eyes', ['love', 'crush']),
      entry('😆', 'Grinning Squinting Face', ['laugh', 'funny']),
      entry('🥰', 'Smiling Face With Hearts', ['love', 'cute']),
      entry('😂', 'Face With Tears of Joy', ['laugh', 'lol']),
      entry('😡', 'Pouting Face', ['angry', 'mad']),
      entry('😱', 'Face Screaming in Fear', ['shocked', 'surprised']),
      entry('😈', 'Smiling Face With Horns', ['devil', 'mischief'])
    ]
  },
  {
    label: 'Smileys & People',
    keywords: ['faces', 'reactions', 'people'],
    emojis: [
      entry('😃', 'Grinning Face With Big Eyes', ['happy', 'smile']),
      entry('😁', 'Beaming Face With Smiling Eyes', ['joy', 'smile']),
      entry('🥹', 'Face Holding Back Tears', ['moved', 'emotional']),
      entry('🤣', 'Rolling on the Floor Laughing', ['laugh', 'funny']),
      entry('🙂', 'Slightly Smiling Face', ['pleasant', 'soft']),
      entry('😉', 'Winking Face', ['flirt', 'playful']),
      entry('😊', 'Smiling Face With Smiling Eyes', ['warm', 'friendly']),
      entry('😇', 'Smiling Face With Halo', ['angel', 'innocent']),
      entry('🤩', 'Star-Struck', ['excited', 'amazed']),
      entry('😎', 'Smiling Face With Sunglasses', ['cool', 'confident']),
      entry('🤓', 'Nerd Face', ['smart', 'geek']),
      entry('🧐', 'Face With Monocle', ['curious', 'inspect']),
      entry('😴', 'Sleeping Face', ['sleep', 'tired']),
      entry('🥳', 'Partying Face', ['celebrate', 'birthday']),
      entry('🤯', 'Exploding Head', ['mind blown', 'surprised'])
    ]
  },
  {
    label: 'Gestures & Body',
    keywords: ['hands', 'body', 'signals'],
    emojis: [
      entry('👋', 'Waving Hand', ['hello', 'bye']),
      entry('✋', 'Raised Hand', ['stop', 'high five']),
      entry('🖖', 'Vulcan Salute', ['spock', 'live long']),
      entry('👌', 'OK Hand', ['ok', 'approve']),
      entry('🤞', 'Crossed Fingers', ['luck', 'hope']),
      entry('🤟', 'Love-You Gesture', ['ily', 'love']),
      entry('👉', 'Backhand Index Pointing Right', ['point', 'direction']),
      entry('👇', 'Backhand Index Pointing Down', ['below', 'direction']),
      entry('👆', 'Backhand Index Pointing Up', ['above', 'direction']),
      entry('👏', 'Clapping Hands', ['applause', 'praise']),
      entry('🙌', 'Raising Hands', ['celebrate', 'praise']),
      entry('🙏', 'Folded Hands', ['thanks', 'pray'])
    ]
  },
  {
    label: 'Objects & Symbols',
    keywords: ['tools', 'office', 'symbols'],
    emojis: [
      entry('📝', 'Memo', ['write', 'note']),
      entry('📄', 'Page Facing Up', ['document', 'file']),
      entry('📁', 'File Folder', ['folder', 'directory']),
      entry('📊', 'Bar Chart', ['analytics', 'stats']),
      entry('📌', 'Pushpin', ['pin', 'marker']),
      entry('🔗', 'Link', ['url', 'chain']),
      entry('✂️', 'Scissors', ['cut', 'edit']),
      entry('🔒', 'Locked', ['secure', 'private']),
      entry('🔓', 'Unlocked', ['open', 'access']),
      entry('🔑', 'Key', ['password', 'access']),
      entry('⚙️', 'Gear', ['settings', 'config']),
      entry('💡', 'Light Bulb', ['idea', 'insight']),
      entry('💰', 'Money Bag', ['cash', 'finance']),
      entry('💳', 'Credit Card', ['payment', 'billing']),
      entry('🔬', 'Microscope', ['science', 'research'])
    ]
  },
  {
    label: 'Nature & Animals',
    keywords: ['animals', 'weather', 'outdoors'],
    emojis: [
      entry('🐶', 'Dog Face', ['pet', 'puppy']),
      entry('🐱', 'Cat Face', ['pet', 'kitty']),
      entry('🦊', 'Fox', ['animal', 'wild']),
      entry('🐻', 'Bear', ['animal', 'forest']),
      entry('🐼', 'Panda', ['animal', 'cute']),
      entry('🦁', 'Lion', ['animal', 'wild']),
      entry('🌸', 'Cherry Blossom', ['flower', 'spring']),
      entry('🌹', 'Rose', ['flower', 'love']),
      entry('🌱', 'Seedling', ['growth', 'plant']),
      entry('🌳', 'Deciduous Tree', ['tree', 'forest']),
      entry('🌍', 'Globe Showing Europe-Africa', ['earth', 'world']),
      entry('🌙', 'Crescent Moon', ['night', 'moon']),
      entry('⭐', 'Star', ['night', 'favorite']),
      entry('🌈', 'Rainbow', ['color', 'weather']),
      entry('☀️', 'Sun', ['sunny', 'day'])
    ]
  },
  {
    label: 'Food & Drink',
    keywords: ['food', 'meals', 'drinks'],
    emojis: [
      entry('🍎', 'Red Apple', ['fruit', 'healthy']),
      entry('🍋', 'Lemon', ['fruit', 'citrus']),
      entry('🍌', 'Banana', ['fruit']),
      entry('🍉', 'Watermelon', ['fruit', 'summer']),
      entry('🍓', 'Strawberry', ['fruit', 'berry']),
      entry('🥑', 'Avocado', ['food', 'healthy']),
      entry('☕', 'Hot Beverage', ['coffee', 'tea']),
      entry('🍵', 'Teacup Without Handle', ['tea', 'drink']),
      entry('🧃', 'Beverage Box', ['juice', 'drink']),
      entry('🥤', 'Cup With Straw', ['soda', 'drink']),
      entry('🍺', 'Beer Mug', ['beer', 'drink']),
      entry('🎂', 'Birthday Cake', ['cake', 'party'])
    ]
  },
  {
    label: 'Travel & Places',
    keywords: ['travel', 'places', 'transport'],
    emojis: [
      entry('🚀', 'Rocket', ['launch', 'space']),
      entry('✈️', 'Airplane', ['flight', 'travel']),
      entry('🚗', 'Automobile', ['car', 'drive']),
      entry('🚌', 'Bus', ['transport', 'transit']),
      entry('🏠', 'House', ['home', 'building']),
      entry('🏢', 'Office Building', ['office', 'work']),
      entry('🏥', 'Hospital', ['medical', 'health']),
      entry('🏫', 'School', ['education', 'building']),
      entry('🏰', 'Castle', ['landmark', 'travel']),
      entry('🗽', 'Statue of Liberty', ['landmark', 'new york']),
      entry('🏔️', 'Snow-Capped Mountain', ['nature', 'hike']),
      entry('🌋', 'Volcano', ['nature', 'mountain'])
    ]
  },
  {
    label: 'Activities & Awards',
    keywords: ['games', 'sports', 'awards'],
    emojis: [
      entry('⚽', 'Soccer Ball', ['sport', 'football']),
      entry('🏀', 'Basketball', ['sport', 'game']),
      entry('🎮', 'Video Game', ['gaming', 'controller']),
      entry('🎯', 'Direct Hit', ['target', 'goal']),
      entry('🎲', 'Game Die', ['dice', 'board game']),
      entry('🧩', 'Puzzle Piece', ['puzzle', 'problem']),
      entry('🎨', 'Artist Palette', ['art', 'design']),
      entry('🎬', 'Clapper Board', ['movie', 'film']),
      entry('🎤', 'Microphone', ['sing', 'audio']),
      entry('🎧', 'Headphone', ['music', 'listen']),
      entry('🏆', 'Trophy', ['award', 'winner']),
      entry('🥇', 'Gold Medal', ['first place', 'award'])
    ]
  }
];

const emojiLabelIndex = new Map(
  EMOJI_CATEGORIES.flatMap((category) => category.emojis.map((item) => [item.emoji, item.label] as const))
);

export function getEmojiLabel(emoji: string): string | undefined {
  return emojiLabelIndex.get(emoji);
}

export function filterEmojiCategories(query: string): EmojiCategory[] {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return EMOJI_CATEGORIES;

  return EMOJI_CATEGORIES.map((category) => {
    const categoryHaystack = normalizeSearch(`${category.label} ${category.keywords.join(' ')}`);
    if (matchesAllTokens(categoryHaystack, normalizedQuery)) {
      return category;
    }

    return {
      ...category,
      emojis: category.emojis.filter((emoji) => {
        const haystack = normalizeSearch(`${emoji.label} ${emoji.keywords.join(' ')} ${category.label}`);
        return matchesAllTokens(haystack, normalizedQuery);
      })
    };
  }).filter((category) => category.emojis.length > 0);
}

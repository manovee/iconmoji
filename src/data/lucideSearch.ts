import { icons as lucideIcons } from 'lucide-react';
import { matchesAllTokens, normalizeSearch, titleCase, tokenizeSearch } from '../utils/search';

type LucideIconMap = typeof lucideIcons;
export type LucideIconName = keyof LucideIconMap & string;

const TOKEN_ALIASES: Record<string, string[]> = {
  activity: ['pulse', 'monitoring', 'health'],
  alert: ['warning', 'error', 'danger', 'notice'],
  arrow: ['direction', 'move', 'navigation'],
  bell: ['notification', 'alarm', 'ring'],
  bookmark: ['save', 'favorite'],
  bot: ['robot', 'assistant', 'ai'],
  calendar: ['date', 'schedule', 'event', 'planner'],
  camera: ['photo', 'picture', 'capture'],
  chart: ['graph', 'analytics', 'metrics'],
  check: ['done', 'success', 'confirm', 'tick'],
  cloud: ['hosting', 'remote', 'online'],
  code: ['development', 'programming', 'dev', 'brackets'],
  database: ['db', 'storage', 'sql', 'data'],
  download: ['save', 'export', 'fetch'],
  edit: ['write', 'change', 'update'],
  file: ['document', 'doc', 'page', 'paper'],
  folder: ['directory', 'storage'],
  globe: ['world', 'internet', 'web', 'earth'],
  heart: ['love', 'favorite', 'like'],
  help: ['question', 'support', 'faq'],
  home: ['house', 'dashboard', 'start'],
  image: ['photo', 'picture', 'media'],
  key: ['password', 'credential', 'token', 'access'],
  layout: ['dashboard', 'grid', 'template'],
  lock: ['secure', 'private', 'password', 'auth'],
  mail: ['email', 'inbox', 'message'],
  map: ['location', 'navigation', 'place', 'geo'],
  message: ['chat', 'comment', 'conversation', 'reply'],
  minus: ['remove', 'subtract'],
  moon: ['night', 'dark'],
  music: ['audio', 'song', 'sound', 'note'],
  pen: ['write', 'edit', 'draft'],
  phone: ['call', 'mobile', 'contact'],
  plus: ['add', 'create', 'new'],
  search: ['find', 'lookup', 'magnifier', 'magnifying', 'loupe'],
  server: ['backend', 'host', 'infrastructure'],
  settings: ['gear', 'cog', 'preferences', 'config'],
  shield: ['security', 'safe', 'guard', 'protection'],
  shopping: ['store', 'commerce', 'buy'],
  star: ['favorite', 'rating', 'bookmark'],
  sun: ['day', 'light'],
  tag: ['label', 'category', 'price'],
  terminal: ['cli', 'console', 'command', 'shell'],
  trash: ['delete', 'remove', 'bin'],
  unlock: ['open', 'unsecure'],
  upload: ['send', 'import', 'share'],
  user: ['person', 'account', 'profile', 'avatar'],
  users: ['people', 'team', 'group', 'members'],
  video: ['movie', 'film', 'record'],
  wallet: ['money', 'payment'],
  x: ['close', 'cancel', 'dismiss'],
  zap: ['lightning', 'quick', 'energy', 'fast']
};

const ICON_ALIASES: Partial<Record<LucideIconName, string[]>> = {
  FileText: ['notes', 'article', 'rich text'],
  FileCode: ['snippet', 'source file'],
  FolderOpen: ['expanded folder', 'open directory'],
  Globe: ['website', 'www'],
  LayoutGrid: ['tiles', 'cards', 'overview'],
  LayoutList: ['rows', 'list view'],
  MessageSquare: ['support chat', 'messaging'],
  Search: ['magnifying glass'],
  Settings: ['preferences pane'],
  ShieldCheck: ['verified', 'trusted'],
  ShoppingCart: ['basket', 'checkout'],
  UserRound: ['profile circle', 'avatar'],
  UsersRound: ['team circle', 'community']
};

export const LUCIDE_ICON_NAMES = Object.keys(lucideIcons)
  .sort((left, right) => left.localeCompare(right)) as LucideIconName[];

const LUCIDE_ICON_NAMES_SET = new Set<LucideIconName>(LUCIDE_ICON_NAMES);
const LUCIDE_SEARCH_INDEX = new Map(
  LUCIDE_ICON_NAMES.map((name) => [name, createSearchText(name)])
);

function createSearchText(name: LucideIconName): string {
  const tokens = tokenizeSearch(name);
  const expandedTerms = new Set<string>([normalizeSearch(name), ...tokens]);

  for (const token of tokens) {
    const aliases = TOKEN_ALIASES[token];
    if (!aliases) continue;
    for (const alias of aliases) {
      expandedTerms.add(normalizeSearch(alias));
    }
  }

  const iconAliases = ICON_ALIASES[name];
  if (iconAliases) {
    for (const alias of iconAliases) {
      expandedTerms.add(normalizeSearch(alias));
    }
  }

  return Array.from(expandedTerms).join(' ');
}

function resolveLucideIconNames(iconNames?: string[]): LucideIconName[] {
  if (!iconNames?.length) return LUCIDE_ICON_NAMES;

  const uniqueNames: LucideIconName[] = [];
  const seen = new Set<LucideIconName>();

  for (const name of iconNames) {
    const candidate = name as LucideIconName;
    if (!LUCIDE_ICON_NAMES_SET.has(candidate) || seen.has(candidate)) continue;
    seen.add(candidate);
    uniqueNames.push(candidate);
  }

  return uniqueNames.length > 0 ? uniqueNames : LUCIDE_ICON_NAMES;
}

export const DEFAULT_CURATED_ICONS: LucideIconName[] = [
  'Sparkles', 'BarChart3', 'PieChart', 'LineChart', 'TrendingUp', 'Building2',
  'Briefcase', 'Folder', 'Database', 'Globe', 'Users', 'Rocket',
  'Zap', 'ShieldCheck', 'Target', 'Layers', 'Boxes', 'Workflow',
  'FileText', 'Bookmark', 'Star', 'Tag', 'Activity', 'CheckSquare',
  'Code2', 'Terminal', 'Server', 'Cloud', 'Wallet', 'CreditCard',
  'ShoppingBag', 'Store', 'Megaphone', 'Compass', 'Headphones', 'Settings',
  'Key', 'Lock', 'Mail', 'MessageSquare', 'Cpu', 'Coins',
  'DollarSign', 'Calendar', 'Flame', 'Heart', 'Palette', 'Lightbulb',
  'Flag', 'Atom', 'Presentation', 'Calculator', 'Wrench', 'Shield'
] as LucideIconName[];

export function filterLucideIcons(query: string, iconNames?: string[]): LucideIconName[] {
  const availableIcons = resolveLucideIconNames(iconNames);
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) {
    return availableIcons;
  }

  return availableIcons.filter((name) => matchesAllTokens(LUCIDE_SEARCH_INDEX.get(name) ?? '', normalizedQuery));
}

export function getLucideIcon(name?: string) {
  if (!name) return lucideIcons.FileText;
  return lucideIcons[name as LucideIconName] ?? lucideIcons.FileText;
}

export function humanizeIconName(name: string): string {
  return titleCase(tokenizeSearch(name));
}

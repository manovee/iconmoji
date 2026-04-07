export function normalizeSearch(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeSearch(value: string): string[] {
  const normalized = normalizeSearch(value);
  return normalized ? normalized.split(' ') : [];
}

export function matchesAllTokens(haystack: string, query: string): boolean {
  const tokens = tokenizeSearch(query);
  return tokens.every((token) => haystack.includes(token));
}

export function titleCase(words: string[]): string {
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

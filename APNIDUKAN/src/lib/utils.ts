export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .flat()
    .filter((item): item is string => typeof item === 'string')
    .join(' ');
}

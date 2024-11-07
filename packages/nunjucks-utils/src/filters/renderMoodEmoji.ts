export const EMOJI_BY_MOOD: Record<number, string> = {
  1: "😢",
  2: "🙁",
  3: "🙂",
  4: "😄",
  5: "😍",
};
export function renderMoodEmoji(mood: number) {
  return EMOJI_BY_MOOD[mood] ?? "";
}

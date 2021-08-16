export default function updateableCount(updates) {
  return updates.filter((update) => !update.isPinned).length;
}

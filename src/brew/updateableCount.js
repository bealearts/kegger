
export default function updateableCount(updates) {
    return updates.brew.filter(update => !update.isPinned).length
        + updates.cask.filter(update => !update.isPinned).length;
}

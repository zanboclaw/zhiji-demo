export function flattenVisibleNodes(nodes, collapsedIds, depth = 0, parentId = null, acc = []) {
  nodes.forEach((node) => {
    acc.push({ ...node, depth, parentId })
    if (node.children?.length && !collapsedIds.has(node.id)) {
      flattenVisibleNodes(node.children, collapsedIds, depth + 1, node.id, acc)
    }
  })

  return acc
}

export function getSubtreeIds(node) {
  const ids = [node.id]
  node.children?.forEach((child) => {
    ids.push(...getSubtreeIds(child))
  })
  return ids
}

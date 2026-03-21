import { skillsData } from '../../data/mock'

export function getCategorySkillCount(categoryId) {
  return categoryId === 'all'
    ? skillsData.length
    : skillsData.filter((skill) => skill.category === categoryId).length
}

export function filterAndSortSkills({ selectedCategory, searchQuery, selectedSort }) {
  const categoryFiltered = skillsData.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })

  const sorted = [...categoryFiltered]
  if (selectedSort === 'rating') {
    sorted.sort((a, b) => b.rating - a.rating)
  } else if (selectedSort === 'latest') {
    sorted.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
  } else {
    sorted.sort((a, b) => b.downloads - a.downloads)
  }

  return sorted
}

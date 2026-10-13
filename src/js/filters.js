import { normalizeTopic } from './data.js'

const compact = value => String(value).replace(/\s+/g, '').toLocaleLowerCase()

export function filterPosts(posts, { query = '', topic = '' } = {}) {
  const keyword = compact(query.trim())
  const selected = normalizeTopic(topic)
  return posts.filter(post => {
    const matchesTopic = !selected || post.tags.some(tag => normalizeTopic(tag) === selected)
    const haystack = compact([post.title, post.content, post.author, ...post.tags].join(' '))
    return matchesTopic && (!keyword || haystack.includes(keyword))
  })
}

export function initFilters(onChange) {
  const search = document.querySelector('#post-search')
  const cards = [...document.querySelectorAll('.topic-card')]
  const button = document.querySelector('.filter-button')
  const dropdown = document.querySelector('.filter-dropdown')
  const menu = document.querySelector('#topic-filter-menu')
  const options = [...menu.querySelectorAll('[role="menuitemradio"]')]
  const label = button.querySelector('[data-filter-label]')
  const state = { query: '', topic: '' }

  const closeMenu = (restoreFocus = false) => {
    menu.hidden = true
    button.setAttribute('aria-expanded', 'false')
    if (restoreFocus) button.focus()
  }
  const focusOption = index => {
    const target = (index + options.length) % options.length
    options.forEach((option, i) => { option.tabIndex = i === target ? 0 : -1 })
    options[target].focus()
  }
  const openMenu = index => {
    menu.hidden = false
    button.setAttribute('aria-expanded', 'true')
    focusOption(index ?? options.findIndex(option => option.dataset.topic === state.topic))
  }
  const update = () => {
    for (const card of cards) card.setAttribute('aria-pressed', String(card.dataset.topic === state.topic))
    for (const option of options) {
      option.setAttribute('aria-checked', String(option.dataset.topic === state.topic))
      // 视觉勾选符不改变朗读名称；选中语义由 aria-checked 提供。
      option.setAttribute('aria-label', option.dataset.topic || '全部帖子')
    }
    label.textContent = state.topic || '全部帖子'
    button.title = `筛选话题，当前：${state.topic || '全部帖子'}`
    onChange({ ...state })
  }
  const selectTopic = (topic, restoreFocus = false) => {
    state.topic = normalizeTopic(topic)
    update()
    closeMenu(restoreFocus)
  }

  button.addEventListener('click', () => {
    if (menu.hidden) openMenu()
    else closeMenu(true)
  })
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(event.key === 'ArrowDown' ? 0 : options.length - 1)
    }
  })
  options.forEach(option => option.addEventListener('click', () => selectTopic(option.dataset.topic, true)))
  menu.addEventListener('keydown', event => {
    const index = options.indexOf(document.activeElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(index + (event.key === 'ArrowDown' ? 1 : -1))
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      focusOption(event.key === 'Home' ? 0 : options.length - 1)
    } else if (event.key === 'Tab') {
      event.preventDefault()
      closeMenu()
      if (event.shiftKey) button.focus()
      else search.focus()
    }
    // Enter/Space 保留原生 button 激活行为，不重复触发筛选。
  })
  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) closeMenu()
  })
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault()
      closeMenu(true)
    }
  })
  dropdown.addEventListener('focusout', event => {
    if (!dropdown.contains(event.relatedTarget)) closeMenu()
  })

  search.addEventListener('input', () => { state.query = search.value; update() })
  for (const card of cards) card.addEventListener('click', () => {
    selectTopic(card.dataset.topic)
    document.querySelector('#community').scrollIntoView({ block: 'start' })
  })
  document.querySelector('.view-all').addEventListener('click', () => {
    selectTopic('')
    document.querySelector('#community').scrollIntoView({ block: 'start' })
  })
  update()
  return {
    getState: () => ({ ...state }),
    reset: () => {
      state.query = ''; state.topic = ''; search.value = ''
      closeMenu()
      update()
    },
  }
}

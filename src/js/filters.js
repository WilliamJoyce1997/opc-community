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
  const allButton = document.querySelector('.filter-button')
  const state = { query: '', topic: '' }
  const update = () => {
    for (const card of cards) card.setAttribute('aria-pressed', String(card.dataset.topic === state.topic))
    allButton.setAttribute('aria-pressed', String(!state.topic))
    allButton.title = state.topic ? `当前话题：${state.topic}，点击恢复全部帖子` : '显示全部话题'
    onChange({ ...state })
  }
  search.addEventListener('input', () => { state.query = search.value; update() })
  for (const card of cards) card.addEventListener('click', () => {
    state.topic = normalizeTopic(card.dataset.topic)
    update()
    document.querySelector('#community').scrollIntoView({ block: 'start' })
  })
  const clearTopic = () => { state.topic = ''; update() }
  allButton.addEventListener('click', clearTopic)
  document.querySelector('.view-all').addEventListener('click', () => {
    clearTopic()
    document.querySelector('#community').scrollIntoView({ block: 'start' })
  })
  update()
  return {
    getState: () => ({ ...state }),
    reset: () => { state.query = ''; state.topic = ''; search.value = ''; update() },
  }
}

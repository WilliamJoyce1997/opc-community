import './css/style.css'
import './css/responsive.css'
import { INITIAL_POSTS, normalizeTopic } from './js/data.js'
import { loadState, saveState } from './js/storage.js'
import { renderPosts, initLikes } from './js/posts.js'
import { initFilters, filterPosts } from './js/filters.js'
import { initModal } from './js/modal.js'

const notification = document.querySelector('#notification')
let notificationTimer
function notify(message) {
  clearTimeout(notificationTimer)
  notification.textContent = message
  notification.hidden = false
  notificationTimer = setTimeout(() => { notification.hidden = true }, 6000)
}

const state = loadState(notify)
const likedIds = new Set(state.likedIds)
const container = document.querySelector('#posts-list')
const allPosts = () => [...state.posts, ...INITIAL_POSTS]
const persist = () => {
  state.likedIds = [...likedIds]
  return saveState(state, notify)
}
function render(filterState) {
  const posts = allPosts()
  const visible = filterPosts(posts, filterState)
  renderPosts(container, visible, likedIds)
  document.querySelector('#results-status').textContent = `${filterState.topic ? `话题：${filterState.topic} · ` : ''}显示 ${visible.length} / ${posts.length} 条帖子`
  for (const card of document.querySelectorAll('.topic-card')) {
    const count = posts.filter(post => post.tags.some(tag => normalizeTopic(tag) === card.dataset.topic)).length
    card.querySelector('.topic-copy > span').textContent = `${count} 条讨论`
    card.setAttribute('aria-label', `${card.dataset.topic}，${count} 条讨论`)
  }
}
const filters = initFilters(render)
initLikes(container, id => {
  const post = allPosts().find(item => item.id === id)
  if (!post) return null
  if (likedIds.has(id)) likedIds.delete(id)
  else likedIds.add(id)
  persist()
  return { likes: post.likes + Number(likedIds.has(id)), liked: likedIds.has(id) }
})
initModal(draft => {
  const post = {
    id: `user-${crypto.randomUUID()}`, author: '我', avatar: { label: '我', tone: 'indigo' },
    publishedAt: new Date().toISOString(), title: draft.title, content: draft.content,
    tags: draft.tags.map(normalizeTopic), likes: 0,
  }
  state.posts.unshift(post)
  const saved = persist()
  filters.reset()
  notify(saved ? '发布成功！新帖子已保存到本机。' : '发布成功！本地保存不可用，刷新后可能丢失。')
  document.querySelector('#community').scrollIntoView({ block: 'start' })
})

const menuButton = document.querySelector('.mobile-menu')
const menu = document.querySelector('#mobile-navigation')
function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false') }
menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden
  menuButton.setAttribute('aria-expanded', String(!menu.hidden))
})
menu.addEventListener('click', event => { if (event.target.closest('a, button')) closeMenu() })
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu() })
document.addEventListener('click', event => { if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu() })
matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu() })
for (const control of document.querySelectorAll('[data-notice]')) control.addEventListener('click', () => notify(control.dataset.notice))

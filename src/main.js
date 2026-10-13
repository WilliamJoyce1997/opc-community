import './css/style.css'
import './css/responsive.css'
import { INITIAL_POSTS, normalizeTopic } from './js/data.js'
import { STORAGE_KEY, loadState, saveState } from './js/storage.js'
import { renderPosts, initLikes } from './js/posts.js'
import { initFilters, filterPosts } from './js/filters.js'
import { initModal } from './js/modal.js'
import { initTheme } from './js/theme.js'

// randomUUID 仅在安全上下文可用；getRandomValues 也支持普通局域网 HTTP。
export function createPostId(cryptoApi = globalThis.crypto) {
  if (typeof cryptoApi?.randomUUID === 'function') {
    try { return `user-${cryptoApi.randomUUID()}` } catch { /* 不可用时继续安全随机回退。 */ }
  }
  if (typeof cryptoApi?.getRandomValues !== 'function') {
    throw new Error('当前浏览器不支持安全随机数，无法生成帖子 ID。')
  }
  const bytes = cryptoApi.getRandomValues(new Uint8Array(16))
  // UUID v4：版本与变体占 6 位，其余 122 位保留为安全随机位。
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  return `user-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const notification = document.querySelector('#notification')
let notificationTimer
function notify(message) {
  clearTimeout(notificationTimer)
  notification.textContent = message
  notification.hidden = false
  notificationTimer = setTimeout(() => { notification.hidden = true }, 6000)
}

initTheme(notify)

const state = loadState(notify)
const likedIds = new Set(state.likedIds)
const container = document.querySelector('#posts-list')
const allPosts = () => [...state.posts, ...INITIAL_POSTS]
let storageWritable = true
function refreshState() {
  // 保存失败后优先保留本页尚未落盘的操作，不用外部快照覆盖它们。
  if (!storageWritable) return
  const latest = loadState(notify, undefined, { version: 1, posts: state.posts, likedIds: [...likedIds] })
  state.posts = latest.posts
  likedIds.clear()
  for (const id of latest.likedIds) likedIds.add(id)
  state.likedIds = [...likedIds]
}
const persist = () => {
  state.likedIds = [...likedIds]
  storageWritable = saveState(state, notify)
  return storageWritable
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
  refreshState()
  const post = allPosts().find(item => item.id === id)
  if (!post) return null
  if (likedIds.has(id)) likedIds.delete(id)
  else likedIds.add(id)
  persist()
  return { likes: post.likes + Number(likedIds.has(id)), liked: likedIds.has(id) }
})
initModal(draft => {
  refreshState()
  const post = {
    id: createPostId(), author: '我', avatar: { label: '我', tone: 'indigo' },
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
function closeMenu(restoreFocus = false) {
  menu.hidden = true
  menuButton.setAttribute('aria-expanded', 'false')
  if (restoreFocus) menuButton.focus()
}
menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden
  menuButton.setAttribute('aria-expanded', String(!menu.hidden))
})
menu.addEventListener('click', event => { if (event.target.closest('a, button')) closeMenu() })
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) closeMenu(menu.contains(document.activeElement))
})
document.addEventListener('click', event => { if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu() })
matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu() })
for (const control of document.querySelectorAll('[data-notice]')) control.addEventListener('click', () => notify(control.dataset.notice))

// 同源标签的顺序操作读取最新状态；localStorage 不提供跨标签事务锁。
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return
  refreshState()
  const focusedLike = document.activeElement?.dataset.likeId
  render(filters.getState())
  if (focusedLike) {
    const button = [...container.querySelectorAll('[data-like-id]')].find(item => item.dataset.likeId === focusedLike)
    button?.focus()
  }
})
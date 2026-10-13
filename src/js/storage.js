import { INITIAL_POSTS, TOPICS, normalizeTopic } from './data.js'

export const STORAGE_KEY = 'opc-community:state:v1'
const emptyState = () => ({ version: 1, posts: [], likedIds: [] })
const textWithin = (value, limit) => typeof value === 'string' && value.trim().length > 0 && [...value].length <= limit

export function validateStoredPost(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  if (!textWithin(value.id, 100) || INITIAL_POSTS.some(post => post.id === value.id)) return null
  if (!textWithin(value.author, 40) || !textWithin(value.title, 60) || !textWithin(value.content, 1000)) return null
  if (typeof value.publishedAt !== 'string' || !Number.isFinite(Date.parse(value.publishedAt))) return null
  if (!Number.isSafeInteger(value.likes) || value.likes < 0 || value.likes > 1000000) return null
  if (!value.avatar || !textWithin(value.avatar.label, 2) || !['indigo', 'rose', 'teal'].includes(value.avatar.tone)) return null
  if (!Array.isArray(value.tags) || value.tags.length > 3 || value.tags.some(tag => typeof tag !== 'string')) return null
  const tags = [...new Set(value.tags.map(normalizeTopic))]
  if (tags.some(tag => !TOPICS.includes(tag))) return null
  return {
    id: value.id, author: value.author.trim(), avatar: { label: value.avatar.label, tone: value.avatar.tone },
    publishedAt: value.publishedAt, title: value.title.trim(), content: value.content.trim(), tags, likes: value.likes,
  }
}

export function loadState(onWarning = () => {}, storage, fallbackState = emptyState()) {
  try {
    // localStorage 的 getter 本身也可能抛异常，因此在 try 内访问。
    const raw = (storage ?? globalThis.localStorage).getItem(STORAGE_KEY)
    if (raw === null) return emptyState()
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.posts) || !Array.isArray(parsed.likedIds)) throw new Error('Invalid storage schema')
    const ids = new Set()
    const posts = parsed.posts.map(validateStoredPost).filter(post => {
      if (!post || ids.has(post.id)) return false
      ids.add(post.id)
      return true
    }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    const validIds = new Set([...INITIAL_POSTS, ...posts].map(post => post.id))
    const likedIds = [...new Set(parsed.likedIds.filter(id => typeof id === 'string' && validIds.has(id)))]
    if (posts.length !== parsed.posts.length || likedIds.length !== parsed.likedIds.length) onWarning('部分本地数据无效，已忽略；有效帖子仍保留。')
    return { version: 1, posts, likedIds }
  } catch {
    onWarning('本地数据无法读取，已使用安全回退数据；页面仍可使用。')
    return fallbackState
  }
}

export function saveState(state, onWarning = () => {}, storage) {
  try {
    ;(storage ?? globalThis.localStorage).setItem(STORAGE_KEY, JSON.stringify({ version: 1, posts: state.posts, likedIds: state.likedIds }))
    return true
  } catch {
    onWarning('本地保存不可用，当前操作仍然有效，但刷新后可能丢失。')
    return false
  }
}

// 主题使用独立键，保留帖子存储版本与结构。
export const THEME_STORAGE_KEY = 'opc-community:theme:v1'
export function loadTheme() {
  try {
    const value = globalThis.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch { return null }
}
export function saveTheme(theme, onWarning = () => {}) {
  try {
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme)
    return true
  } catch {
    onWarning('主题已切换，但本地保存不可用，刷新后可能恢复系统主题。')
    return false
  }
}

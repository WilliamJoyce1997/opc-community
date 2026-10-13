import { THEME_STORAGE_KEY, loadTheme, saveTheme } from './storage.js'

export function initTheme(onWarning = () => {}) {
  const button = document.querySelector('#theme-toggle')
  const system = window.matchMedia('(prefers-color-scheme: dark)')
  let preference = loadTheme()
  function apply(theme) {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    button.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到暗色模式')
  }
  const systemTheme = () => system.matches ? 'dark' : 'light'
  apply(preference ?? systemTheme())
  button.addEventListener('click', () => {
    preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    apply(preference)
    saveTheme(preference, onWarning)
  })
  system.addEventListener('change', () => { if (!preference) apply(systemTheme()) })
  window.addEventListener('storage', event => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
    preference = loadTheme()
    apply(preference ?? systemTheme())
  })
}

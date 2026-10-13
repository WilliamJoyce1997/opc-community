export function validateDraft({ title, content, tags }) {
  if (!title.trim()) return { field: 'title', message: '请输入标题，不能只有空格。' }
  if ([...title.trim()].length > 60) return { field: 'title', message: '标题最多 60 字。' }
  if (!content.trim()) return { field: 'content', message: '请输入正文，不能只有空格。' }
  if ([...content.trim()].length > 1000) return { field: 'content', message: '正文最多 1000 字。' }
  if (tags.length > 3) return { field: 'topics', message: '最多选择 3 个话题。' }
  return null
}

export function initModal(onPublish) {
  const dialog = document.querySelector('#publish-dialog')
  const form = document.querySelector('#publish-form')
  const title = form.elements.title
  const content = form.elements.content
  const topics = [...form.querySelectorAll('input[name="topics"]')]
  const error = document.querySelector('#publish-error')
  const hint = document.querySelector('#topic-selection-hint')
  const clearError = () => {
    error.textContent = ''
    title.removeAttribute('aria-invalid')
    content.removeAttribute('aria-invalid')
  }
  const update = () => {
    const count = topics.filter(input => input.checked).length
    for (const input of topics) input.disabled = count >= 3 && !input.checked
    hint.textContent = `已选 ${count}/3 个话题，可不选择话题。`
    document.querySelector('#title-count').textContent = `${[...title.value].length}/60`
    document.querySelector('#content-count').textContent = `${[...content.value].length}/1000`
  }
  for (const opener of document.querySelectorAll('[data-open-publish]')) opener.addEventListener('click', () => {
    if (!dialog.open) { clearError(); update(); dialog.showModal(); title.focus() }
  })
  for (const closer of dialog.querySelectorAll('[data-close-publish]')) closer.addEventListener('click', () => dialog.close())
  // 原生 cancel 事件允许 Esc 关闭，close 统一清理本次输入。
  dialog.addEventListener('close', () => { form.reset(); clearError(); update() })
  form.addEventListener('input', () => { clearError(); update() })
  form.addEventListener('change', update)
  form.addEventListener('submit', event => {
    event.preventDefault()
    const draft = { title: title.value, content: content.value, tags: topics.filter(input => input.checked).map(input => input.value) }
    const issue = validateDraft(draft)
    if (issue) {
      error.textContent = issue.message
      if (issue.field === 'title' || issue.field === 'content') {
        const input = issue.field === 'title' ? title : content
        input.setAttribute('aria-invalid', 'true')
        input.focus()
      }
      return
    }
    onPublish({ ...draft, title: draft.title.trim(), content: draft.content.trim() })
    dialog.close()
  })
  update()
}

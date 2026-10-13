const node = (tag, className, text) => {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function likeIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('icon')
  svg.setAttribute('aria-hidden', 'true')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('href', '#icon-like')
  svg.append(use)
  return svg
}

function updateLikeButton(button, likes, liked) {
  button.setAttribute('aria-pressed', String(liked))
  button.setAttribute('aria-label', `${liked ? '取消点赞' : '点赞'}，${likes} 个赞`)
  button.querySelector('.like-count').textContent = String(likes)
}

export function renderPosts(container, posts, likedIds) {
  const fragment = document.createDocumentFragment()
  for (const post of posts) {
    const article = node('article', 'post-card')
    article.dataset.postId = post.id
    const header = node('header', 'post-author')
    const avatar = node('span', `avatar avatar-${post.avatar.tone}`, post.avatar.label)
    avatar.setAttribute('aria-hidden', 'true')
    const meta = node('div', 'author-meta')
    const time = node('time', 'post-time', new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(post.publishedAt)))
    time.dateTime = post.publishedAt
    meta.append(node('span', 'author-name', post.author), time)
    header.append(avatar, meta)
    const content = node('div', 'post-content')
    const title = node('h3', '', post.title)
    const bottom = node('div', 'post-bottom')
    const tags = node('ul', 'post-tags')
    tags.setAttribute('aria-label', '帖子话题')
    for (const tag of post.tags) tags.append(node('li', '', `#${tag}`))
    const like = node('button', 'like-button')
    like.type = 'button'
    like.dataset.likeId = post.id
    like.append(likeIcon(), node('span', 'like-count'))
    const liked = likedIds.has(post.id)
    updateLikeButton(like, post.likes + Number(liked), liked)
    bottom.append(tags, like)
    content.append(title, node('p', '', post.content), bottom)
    article.append(header, content)
    fragment.append(article)
  }
  if (!posts.length) {
    const empty = node('div', 'empty-state')
    empty.append(node('h3', '', '没有找到匹配的帖子'), node('p', '', '试试其他关键词，或点击“全部帖子”清除话题筛选。'))
    fragment.append(empty)
  }
  container.replaceChildren(fragment)
}

export function initLikes(container, onToggle) {
  // 单次事件代理；同步更新 Set，再按基础值计算数量，快速点击也不会重复累加。
  container.addEventListener('click', event => {
    const button = event.target.closest('button[data-like-id]')
    if (!button || !container.contains(button)) return
    const next = onToggle(button.dataset.likeId)
    if (next) updateLikeButton(button, next.likes, next.liked)
  })
}

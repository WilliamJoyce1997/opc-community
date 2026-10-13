export const TOPICS = ['独立开发', 'AI 工具', '出海', '增长', '远程办公']

export function normalizeTopic(value) {
  const text = String(value ?? '').trim()
  const compact = text.replace(/\s+/g, '').toLowerCase()
  return TOPICS.find(topic => topic.replace(/\s+/g, '').toLowerCase() === compact) ?? text
}

// 固定 id；Mock 数据不写入本地存储，避免刷新时重复插入。
export const INITIAL_POSTS = [
  { id: 'mock-1', author: '阿梁', avatar: { label: '梁', tone: 'indigo' }, publishedAt: '2026-10-13T09:00:00+08:00', title: '从 0 到 1：我如何用 6 个月做出第一个能赚钱的独立产品', content: '分享一下我这半年做独立产品的完整过程：从最初的想法验证、产品设计、技术选型，到上线后的获客和收入情况。一个人也可以做出有真实收入的产品，关键是找到小而美的切入点，并快速迭代。', tags: ['独立开发', '产品设计', '经验分享'], likes: 38 },
  { id: 'mock-2', author: 'Mira', avatar: { label: 'M', tone: 'rose' }, publishedAt: '2026-10-13T08:42:00+08:00', title: '我常用的 8 个 AI 工具，让一人公司效率提升 10 倍', content: '过去一年我尝试了上百个 AI 工具，这 8 个是我真正长期使用的。覆盖写作、设计、开发、运营等场景，帮我把一个人的工作流程变得更轻量、更高效。', tags: ['AI 工具', '效率提升', '一人公司'], likes: 52 },
  { id: 'mock-3', author: '老 K', avatar: { label: 'K', tone: 'teal' }, publishedAt: '2026-10-12T18:20:00+08:00', title: '从国内到海外：一个人做产品的出海实践与思考', content: '过去一年，我的产品有 70% 用户来自海外市场。这里分享我在市场选择、本地化、获客渠道和支付接入上的实践经验，以及踩过的坑和得到的启发。', tags: ['出海', '独立开发', '市场增长'], likes: 19 },
  { id: 'mock-4', author: '小宇', avatar: { label: '宇', tone: 'indigo' }, publishedAt: '2026-10-12T14:00:00+08:00', title: '远程办公 3 年：我如何保持高效的工作与生活平衡', content: '作为一个全职独立开发者，我已经远程办公 3 年了。每天先确定最重要的一件事，再安排专注时段。远程工作不是工作方式的改变，更是一种生活方式的选择。', tags: ['远程办公', '效率提升', '生活方式'], likes: 27 },
  { id: 'mock-5', author: 'Nora', avatar: { label: 'N', tone: 'rose' }, publishedAt: '2026-10-11T10:30:00+08:00', title: '一人公司的运营思考：如何实现可持续的增长', content: '做一人公司不仅是做产品，也包括运营、营销和客户支持。这里记录我在寻找增长飞轮、建立用户关系，以及有限精力下保持稳定增长的一些思考。', tags: ['一人公司', '增长', '运营'], likes: 41 },
  { id: 'mock-6', author: 'Kevin', avatar: { label: 'K', tone: 'teal' }, publishedAt: '2026-10-10T11:00:00+08:00', title: '客户支持如何自动化？我用 AI 让客服效率提升了 5 倍', content: '随着用户量增长，客服问题也越来越多。我尝试用 AI 自动化工具搭建了一套客服流程，包括智能回复、工单分类和人工兜底，大大减少了重复工作。', tags: ['AI 工具', '客户支持', '自动化'], likes: 33 },
  { id: 'mock-7', author: '林溪', avatar: { label: '林', tone: 'indigo' }, publishedAt: '2026-10-09T16:15:00+08:00', title: '独立产品冷启动：前 100 位用户从哪里来', content: '没有广告预算时，我选择在开发者社区分享真实的制作过程，通过小范围访谈了解需求。持续记录和及时反馈，比一次大规模推广更适合我的增长节奏。', tags: ['独立开发', '增长', '用户访谈'], likes: 16 },
  { id: 'mock-8', author: '阿舟', avatar: { label: '舟', tone: 'teal' }, publishedAt: '2026-10-08T09:10:00+08:00', title: '远程协作与出海：我的轻量工作工具清单', content: '跨时区沟通需要清晰的文档和可追踪的任务。我用异步消息、共享日历和简单的项目看板完成远程办公，把更多时间留给产品和用户。', tags: ['远程办公', '出海', '工作工具'], likes: 24 },
]

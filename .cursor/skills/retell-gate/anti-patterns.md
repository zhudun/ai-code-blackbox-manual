# 复述门：常见假复述

这些输出看起来像 PR 说明，其实作者还是讲不出来。写的时候对照，中招就重写。

## 假行为变化

- 「优化了字体加载，提升中文可读性。」
- 「重构了状态管理，使代码更清晰。」
- 「完善了错误处理。」

真的：

- 「关掉 `next/font` 的 Latin 子集，改用 CSS 拉 Noto SC，Linux 无网时回落到本机 `Noto Sans CJK SC`。中文不再被画成缺字。」

## 假数据流

- 「用户请求进入系统，经过处理后返回结果。」

真的：

- 「`RootLayout` 不再挂 Google `next/font`。浏览器读 `globals.css` 的 `@import`，失败则用 `font-family` 栈里的 `Noto Sans CJK SC`。不改路由，不改页面数据。」

## 假失败模式

- 「可能有 bug。」
- 「需要更多测试。」
- 「极端情况需注意。」

真的：

- 「`fonts.googleapis.com` 被墙：页面仍应靠本机 CJK 字体出字，不能再只绑一个 Latin 字体文件。」
- 「旧页面缓存了上一版 CSS：硬刷新后才看得到字。」

## 假难懂

- 「这部分逻辑比较复杂，建议仔细阅读。」

真的：

- 「`usePersistentState` 用 `useSyncExternalStore` 读 `localStorage`，又用 `mounted` 避开 hydration mismatch。你要能讲清：SSR 用 initial，hydrate 后再读存储，同页写入靠内存 listener，不是靠 `storage` 事件。」

## 假带读

- 「这部分新增了提醒逻辑，整体比较清晰。」
- 「其余都是常规代码，不难懂。」
- 「这里做了校验然后返回。」（不贴代码、不说校验哪几个字段）

真的：

```ts
if (sentAt && sameDay(sentAt, now)) {
  return { sent: false };
}
```

- **这几行在干什么**：已经写过 `sentAt` 且是同一天，直接返回没发。
- **为什么这样写**：用早返回，而不是包一层 `else`，后面发信路径更短。
- **删掉会怎样**：同一张票同一天会再调 mailer，财务收到重复信。
- **和前后怎么接**：`sentAt` 来自刚读出的发票；返回后不会走到下面的 `mailer.send`。

## 假不确定

把不确定写成「已理解，细节可再确认」——这是自我欺骗。不确定就写符号名和卡在哪一行。

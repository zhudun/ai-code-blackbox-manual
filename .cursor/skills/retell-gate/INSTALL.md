# 复述门 Skill 怎么装

分三层说清楚，避免把「仓库里有文件」当成「已经上架、已经装好」。

## 1. 没有「上架到 skill 市场」这回事

作者没有把包发到 npm，也没有走 Cursor Marketplace / 独立 skill 商店的上传审核。

仓库里也**没有** `.claude-plugin/marketplace.json` 或 `.cursor-plugin/plugin.json`。就算以后补了这类清单，也只是「这个 Git 仓库自己的插件目录格式」，给本仓库或本机本地加载用，**不是**已经提交到某个官方市场。

[skills.sh](https://skills.sh) 如果以后出现 `zhudun/ai-code-blackbox-manual` 这类页面，那也只是发现页：有人执行 `npx skills add zhudun/ai-code-blackbox-manual` 时，CLI 按 GitHub 的 `owner/repo` 去拉代码，页面顺带能被索引到。文件不托管在 skills.sh 上。

所以：能从 GitHub 获取，但既没有上架公共市场，也没有「一点安装」的官方货架。

## 2. 真正能拿到的地方只有 GitHub

地址就是 [https://github.com/zhudun/ai-code-blackbox-manual](https://github.com/zhudun/ai-code-blackbox-manual)。

`npx skills add zhudun/ai-code-blackbox-manual` 和 `git clone` 拉的是**同一份东西**。Skill 本体在仓库里的这一层：

```text
.cursor/skills/retell-gate/
  SKILL.md
  template.md
  anti-patterns.md
  INSTALL.md
```

这个仓库同时还是一份 Next.js 手册。手册不是 Skill，不要把整个站点拷进 `~/.cursor/skills`。

## 3. 拿到仓库 ≠ 已经装成可用 Skill

克隆或打开本仓库，只是项目里带着一份 Skill 文件。要对**别的业务仓库**说「分析最新提交」，必须再完成下面其中一步，否则 Cursor / Claude Code 不会把它当成已安装的全局 Skill。

### 装到本机，任意项目可用（推荐）

```bash
git clone https://github.com/zhudun/ai-code-blackbox-manual.git
mkdir -p ~/.cursor/skills
cp -R ai-code-blackbox-manual/.cursor/skills/retell-gate ~/.cursor/skills/retell-gate
```

确认 `~/.cursor/skills/retell-gate/SKILL.md` 存在，中间不要多套一层文件夹。

Claude Code 对应目录是 `~/.claude/skills/retell-gate`，拷同一份即可。

用 CLI 也是拉 GitHub，不是装市场包：

```bash
npx skills add zhudun/ai-code-blackbox-manual --agent cursor
```

CLI 若把整个仓库当成 skill 根目录，改为手工只拷 `.cursor/skills/retell-gate`。

### 只在某一个业务仓库里用

```bash
mkdir -p /path/to/your-app/.cursor/skills
cp -R ai-code-blackbox-manual/.cursor/skills/retell-gate \
  /path/to/your-app/.cursor/skills/retell-gate
```

### 只在本手册仓库里用

用 Cursor 打开 `ai-code-blackbox-manual` 即可。项目级 Skill 会自动被发现。这只覆盖这个手册仓库自己的提交，不覆盖你的业务代码。

### 装完怎么验

1. 打开**你要复述的那个 git 仓库**（不是必须打开手册站）。
2. Agent 对话里打 `/retell-gate`，或直接说「分析最新提交」。
3. 跑完应出现 `docs/retell/日期-短号.md`。没有这个文件，就还没装好，或 Agent 没用这份 Skill。

没有执行上面的拷贝 / `npx skills add`，也没有把 `SKILL.md` 放进 `~/.cursor/skills`、`~/.claude/skills` 或业务项目的 `.cursor/skills`，对你本机来说，复述门 **并没有被安装**。

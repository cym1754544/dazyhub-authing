import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CloudSun,
  Bookmark,
  Camera,
  FileText,
  Check,
  FolderPlus,
  Folder,
  FolderOpen,
  FolderX,
  KeyRound,
  Lock,
  LockOpen,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Palette,
  Pencil,
  Plus,
  Save,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Send,
  ListTodo,
  CalendarHeart,
  Timer,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Type,
  User,
  X,
  MessageSquareWarning,
  Paperclip,
  MapPin,
  Droplets,
  Wind,
  ThermometerSun,
} from "lucide-react";
import {
  activateEmailPreset,
  clearToken,
  changePassword,
  clearFaviconCache,
  deleteFaviconCacheItem,
  deleteUser,
  deleteFaviconRule,
  deleteFeedback,
  deleteEmailPreset,
  fetchFaviconCacheItems,
  fetchMe,
  fetchFaviconRules,
  fetchSiteMeta,
  fetchUsers,
  fetchAllFeedbacks,
  fetchMyFeedbacks,
  getEmailConfig,
  getEmailPresets,
  getFaviconCacheStats,
  getToken,
  login,
  matchFaviconRule,
  register,
  replyFeedback,
  resetUserPassword,
  saveFaviconRule,
  sendCode,
  setToken,
  submitFeedback,
  uploadFeedbackAttachment,
  testEmailConfig,
  updateEmailConfig,
  updateProfile,
  updateSettings,
  updateUser,
  uploadAvatar,
} from "./api";
import "./styles.css";

const initialGroups = [
  { id: "ungrouped", name: "未分组", color: "#4f46e5", order: 0 },
  { id: "work", name: "常用入口", color: "#0f766e", order: 1 },
  { id: "dev", name: "AI 与开发", color: "#334155", order: 2 },
  { id: "home", name: "效率工具", color: "#047857", order: 3 },
  { id: "media", name: "影音娱乐", color: "#be123c", order: 4 },
  { id: "learn", name: "学习资料", color: "#a16207", order: 5 },
];

const starterSites = [
  { id: "work-baidu", group: "work", name: "百度", url: "baidu.com" },
  { id: "work-bilibili", group: "work", name: "Bilibili", url: "bilibili.com" },
  { id: "work-zhihu", group: "work", name: "知乎", url: "zhihu.com" },
  { id: "work-weibo", group: "work", name: "微博", url: "weibo.com" },
  { id: "work-xiaohongshu", group: "work", name: "小红书", url: "xiaohongshu.com" },
  { id: "work-taobao", group: "work", name: "淘宝", url: "taobao.com" },
  { id: "work-jd", group: "work", name: "京东", url: "jd.com" },
  { id: "work-douban", group: "work", name: "豆瓣", url: "douban.com" },
  { id: "work-amap", group: "work", name: "高德地图", url: "amap.com" },
  { id: "work-docsqq", group: "work", name: "腾讯文档", url: "docs.qq.com" },
  { id: "work-yuque", group: "work", name: "语雀", url: "yuque.com" },
  { id: "work-feishu", group: "work", name: "飞书", url: "feishu.cn" },
  { id: "dev-chatgpt", group: "dev", name: "ChatGPT", url: "chatgpt.com" },
  { id: "dev-github", group: "dev", name: "GitHub", url: "github.com" },
  { id: "dev-gitee", group: "dev", name: "Gitee", url: "gitee.com" },
  { id: "dev-vercel", group: "dev", name: "Vercel", url: "vercel.com" },
  { id: "dev-cloudflare", group: "dev", name: "Cloudflare", url: "cloudflare.com" },
  { id: "dev-docker", group: "dev", name: "Docker Hub", url: "hub.docker.com" },
  { id: "dev-npm", group: "dev", name: "npm", url: "npmjs.com" },
  { id: "dev-stackoverflow", group: "dev", name: "Stack Overflow", url: "stackoverflow.com" },
  { id: "dev-mdn", group: "dev", name: "MDN", url: "developer.mozilla.org" },
  { id: "dev-openai", group: "dev", name: "OpenAI", url: "openai.com" },
  { id: "dev-deepseek", group: "dev", name: "DeepSeek", url: "deepseek.com" },
  { id: "dev-tongyi", group: "dev", name: "通义千问", url: "tongyi.aliyun.com" },
  { id: "home-notion", group: "home", name: "Notion", url: "notion.so" },
  { id: "home-drive", group: "home", name: "Google Drive", url: "drive.google.com" },
  { id: "home-pan", group: "home", name: "百度网盘", url: "pan.baidu.com" },
  { id: "home-alipan", group: "home", name: "阿里云盘", url: "alipan.com" },
  { id: "home-shimo", group: "home", name: "石墨文档", url: "shimo.im" },
  { id: "home-canva", group: "home", name: "Canva", url: "canva.com" },
  { id: "home-figma", group: "home", name: "Figma", url: "figma.com" },
  { id: "home-processon", group: "home", name: "ProcessOn", url: "processon.com" },
  { id: "home-deepl", group: "home", name: "DeepL", url: "deepl.com" },
  { id: "home-translate", group: "home", name: "Google 翻译", url: "translate.google.com" },
  { id: "home-dida", group: "home", name: "滴答清单", url: "dida365.com" },
  { id: "home-iflyrec", group: "home", name: "讯飞听见", url: "iflyrec.com" },
  { id: "media-youtube", group: "media", name: "YouTube", url: "youtube.com" },
  { id: "media-netflix", group: "media", name: "Netflix", url: "netflix.com" },
  { id: "media-iqiyi", group: "media", name: "爱奇艺", url: "iqiyi.com" },
  { id: "media-qqvideo", group: "media", name: "腾讯视频", url: "v.qq.com" },
  { id: "media-youku", group: "media", name: "优酷", url: "youku.com" },
  { id: "media-netease", group: "media", name: "网易云音乐", url: "music.163.com" },
  { id: "media-qqmusic", group: "media", name: "QQ 音乐", url: "y.qq.com" },
  { id: "media-spotify", group: "media", name: "Spotify", url: "spotify.com" },
  { id: "media-doubanmovie", group: "media", name: "豆瓣电影", url: "movie.douban.com" },
  { id: "media-bangumi", group: "media", name: "Bangumi", url: "bgm.tv" },
  { id: "media-acfun", group: "media", name: "AcFun", url: "acfun.cn" },
  { id: "media-huya", group: "media", name: "虎牙直播", url: "huya.com" },
  { id: "learn-mooc", group: "learn", name: "中国大学 MOOC", url: "icourse163.org" },
  { id: "learn-coursera", group: "learn", name: "Coursera", url: "coursera.org" },
  { id: "learn-khan", group: "learn", name: "Khan Academy", url: "khanacademy.org" },
  { id: "learn-runoob", group: "learn", name: "菜鸟教程", url: "runoob.com" },
  { id: "learn-juejin", group: "learn", name: "掘金", url: "juejin.cn" },
  { id: "learn-sspai", group: "learn", name: "少数派", url: "sspai.com" },
  { id: "learn-ruanyifeng", group: "learn", name: "阮一峰博客", url: "ruanyifeng.com" },
  { id: "learn-leetcode", group: "learn", name: "LeetCode", url: "leetcode.cn" },
  { id: "learn-w3schools", group: "learn", name: "W3Schools", url: "w3schools.com" },
  { id: "learn-freecodecamp", group: "learn", name: "freeCodeCamp", url: "freecodecamp.org" },
  { id: "learn-wiki", group: "learn", name: "维基百科", url: "wikipedia.org" },
  { id: "learn-gitbook", group: "learn", name: "GitBook", url: "gitbook.com" },
];

const starterShortcuts = [
  { id: "quick-baidu", group: "ungrouped", name: "百度", url: "baidu.com" },
  { id: "quick-bilibili", group: "ungrouped", name: "Bilibili", url: "bilibili.com" },
  { id: "quick-github", group: "ungrouped", name: "GitHub", url: "github.com" },
  { id: "quick-chatgpt", group: "ungrouped", name: "ChatGPT", url: "chatgpt.com" },
  { id: "quick-youtube", group: "ungrouped", name: "YouTube", url: "youtube.com" },
  { id: "quick-zhihu", group: "ungrouped", name: "知乎", url: "zhihu.com" },
  { id: "quick-weibo", group: "ungrouped", name: "微博", url: "weibo.com" },
  { id: "quick-music", group: "ungrouped", name: "网易云音乐", url: "music.163.com" },
  { id: "quick-taobao", group: "ungrouped", name: "淘宝", url: "taobao.com" },
  { id: "quick-jd", group: "ungrouped", name: "京东", url: "jd.com" },
  { id: "quick-notion", group: "ungrouped", name: "Notion", url: "notion.so" },
  { id: "quick-juejin", group: "ungrouped", name: "掘金", url: "juejin.cn" },
];

const searchEngines = [
  {
    id: "google",
    name: "Google",
    iconUrl: "/api/favicon?domain=google.com",
    searchUrl: (value) => `https://www.google.com/search?q=${encodeURIComponent(value)}`,
  },
  {
    id: "bing",
    name: "Bing",
    iconUrl: "/api/favicon?domain=bing.com",
    searchUrl: (value) => `https://www.bing.com/search?q=${encodeURIComponent(value)}`,
  },
  {
    id: "baidu",
    name: "Baidu",
    iconUrl: "/api/favicon?domain=baidu.com",
    searchUrl: (value) => `https://www.baidu.com/s?wd=${encodeURIComponent(value)}`,
  },
];

const emailProviderPresets = [
  { id: "qq", name: "QQ 邮箱", host: "smtp.qq.com", port: 465, fromHint: "name@qq.com" },
  { id: "netease-163", name: "网易 163", host: "smtp.163.com", port: 465, fromHint: "name@163.com" },
  { id: "netease-126", name: "网易 126", host: "smtp.126.com", port: 465, fromHint: "name@126.com" },
  { id: "aliyun", name: "阿里邮箱", host: "smtp.qiye.aliyun.com", port: 465, fromHint: "name@your-domain.com" },
  { id: "tencent-exmail", name: "腾讯企业邮", host: "smtp.exmail.qq.com", port: 465, fromHint: "name@your-domain.com" },
  { id: "gmail", name: "Gmail", host: "smtp.gmail.com", port: 587, fromHint: "name@gmail.com" },
  { id: "outlook", name: "Outlook", host: "smtp.office365.com", port: 587, fromHint: "name@outlook.com" },
];

const authingGroups = [
  { id: "authing-main", name: "Authing 对接", color: "#2563eb", order: 0 },
  { id: "authing-docs", name: "协议与文档", color: "#0f766e", order: 1 },
];

const authingSites = [
  { id: "authing-console", group: "authing-main", name: "Authing 控制台", url: "console.authing.cn", order: 0 },
  { id: "authing-tenant", group: "authing-main", name: "DazyHub 用户池", url: "dazyhub.authing.cn", order: 1 },
  { id: "authing-login", group: "authing-main", name: "托管登录页", url: "dazyhub.authing.cn/login", order: 2 },
  { id: "authing-oidc-doc", group: "authing-docs", name: "OIDC 文档", url: "docs.authing.cn/v2/concepts/oidc/", order: 0 },
  { id: "authing-oauth-doc", group: "authing-docs", name: "OAuth 文档", url: "docs.authing.cn/v2/concepts/oauth/", order: 1 },
  { id: "authing-spring-doc", group: "authing-docs", name: "Spring Boot 快速开始", url: "docs.authing.cn/v2/quickstarts/webApp/javaSpringBoot.html", order: 2 },
];

const CARD_LOCKED_KEY = "dazyhub_cardsLocked";

function normalizeTheme(theme) {
  return ["light", "glass"].includes(theme) ? theme : "light";
}

function normalizedUrl(value) {
  return value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function favicon(url) {
  return `/api/favicon?domain=${encodeURIComponent(url)}`;
}

function faviconSources(url, customIconUrl = "") {
  if (customIconUrl) return [customIconUrl];
  const domain = encodeURIComponent(url);
  return [
    `/api/favicon?domain=${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${url}&size=128`,
  ];
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function mixedItemsForParent(sites, siteGroups, parentId) {
  return [
    ...siteGroups
      .filter((group) => group.parentId === parentId)
      .map((group) => ({ type: "folder", id: group.id, order: group.order ?? 0 })),
    ...sites
      .filter((site) => site.group === parentId)
      .map((site) => ({ type: "site", id: site.id, order: site.order ?? 0 })),
  ].sort((a, b) => a.order - b.order);
}

function applyMixedOrder(sites, siteGroups, parentId, orderedItems) {
  const siteOrders = new Map();
  const groupOrders = new Map();

  orderedItems.forEach((item, index) => {
    if (item.type === "site") siteOrders.set(item.id, index);
    if (item.type === "folder") groupOrders.set(item.id, index);
  });

  return {
    sites: sites.map((site) => (
      site.group === parentId && siteOrders.has(site.id)
        ? { ...site, order: siteOrders.get(site.id) }
        : site
    )),
    siteGroups: siteGroups.map((group) => (
      group.parentId === parentId && groupOrders.has(group.id)
        ? { ...group, order: groupOrders.get(group.id) }
        : group
    )),
  };
}

function reorderMixedItem(sites, siteGroups, draggedId, draggedType, targetId, targetType, placement = "before") {
  if (!targetId || draggedId === targetId) return { sites, siteGroups };

  const draggedParent = draggedType === "folder"
    ? siteGroups.find((group) => group.id === draggedId)?.parentId
    : sites.find((site) => site.id === draggedId)?.group;
  const targetParent = targetType === "folder"
    ? siteGroups.find((group) => group.id === targetId)?.parentId
    : sites.find((site) => site.id === targetId)?.group;

  if (draggedParent === undefined || targetParent === undefined) return { sites, siteGroups };

  let nextSites = draggedType === "site"
    ? sites.map((site) => site.id === draggedId ? { ...site, group: targetParent } : site)
    : sites;
  let nextGroups = draggedType === "folder"
    ? siteGroups.map((group) => group.id === draggedId ? { ...group, parentId: targetParent } : group)
    : siteGroups;

  const draggedItem = { type: draggedType, id: draggedId };
  const sameParent = draggedParent === targetParent;

  if (!sameParent) {
    const sourceItems = mixedItemsForParent(nextSites, nextGroups, draggedParent)
      .filter((item) => !(item.type === draggedType && item.id === draggedId));
    ({ sites: nextSites, siteGroups: nextGroups } = applyMixedOrder(nextSites, nextGroups, draggedParent, sourceItems));
  }

  const targetItems = mixedItemsForParent(nextSites, nextGroups, targetParent)
    .filter((item) => !(item.type === draggedType && item.id === draggedId));
  const targetIndex = targetItems.findIndex((item) => item.type === targetType && item.id === targetId);

  if (targetIndex === -1) return { sites, siteGroups };

  targetItems.splice(placement === "after" ? targetIndex + 1 : targetIndex, 0, draggedItem);
  return applyMixedOrder(nextSites, nextGroups, targetParent, targetItems);
}

function moveSiteToGroupEnd(sites, siteGroups, draggedId, targetGroup) {
  const dragged = sites.find((site) => site.id === draggedId);
  if (!dragged) return { sites, siteGroups };

  let nextSites = sites.map((site) => site.id === draggedId ? { ...site, group: targetGroup } : site);
  let nextGroups = siteGroups;

  if (dragged.group !== targetGroup) {
    const sourceItems = mixedItemsForParent(nextSites, nextGroups, dragged.group)
      .filter((item) => !(item.type === "site" && item.id === draggedId));
    ({ sites: nextSites, siteGroups: nextGroups } = applyMixedOrder(nextSites, nextGroups, dragged.group, sourceItems));
  }

  const targetItems = mixedItemsForParent(nextSites, nextGroups, targetGroup)
    .filter((item) => !(item.type === "site" && item.id === draggedId));
  targetItems.push({ type: "site", id: draggedId });
  return applyMixedOrder(nextSites, nextGroups, targetGroup, targetItems);
}

function parseSettingsJson(value, fallback) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function withOrder(arr) {
  return arr.map((item, i) => ({ ...item, order: item.order ?? i }));
}

function normalizeGroups(groups) {
  const source = Array.isArray(groups) && groups.length ? groups : initialGroups;
  const seen = new Set();

  return source
    .filter((group) => group?.id && !seen.has(group.id) && group.id !== "all")
    .map((group, i) => {
      seen.add(group.id);
      return {
        ...group,
        name: group.name || "未命名文件夹",
        color: group.color || "#4f46e5",
        parentId: group.parentId || null,
        collapsed: Boolean(group.collapsed),
        order: group.order ?? i,
      };
    });
}

function normalizeSites(sites) {
  return withOrder(Array.isArray(sites) && sites.length ? sites : [...starterShortcuts, ...starterSites]);
}

function collectGroupDescendants(groups, groupId) {
  const descendants = new Set();
  const visit = (id) => {
    groups
      .filter((group) => group.parentId === id)
      .forEach((child) => {
        if (descendants.has(child.id)) return;
        descendants.add(child.id);
        visit(child.id);
      });
  };

  visit(groupId);
  return descendants;
}

function buildFolderTree(groups) {
  const byParent = groups.reduce((map, group) => {
    const parentId = group.parentId || "root";
    if (!map.has(parentId)) map.set(parentId, []);
    map.get(parentId).push(group);
    return map;
  }, new Map());

  const build = (parentId = "root", depth = 0) => (byParent.get(parentId) || []).map((group) => ({
    ...group,
    depth,
    children: build(group.id, depth + 1),
  }));

  return build();
}

function flattenFolderTree(nodes) {
  return nodes.flatMap((node) => [
    node,
    ...(node.collapsed ? [] : flattenFolderTree(node.children || [])),
  ]);
}

const DRAG_REORDER_COOLDOWN_MS = 320;
const CONTEXT_MENU_WIDTH = 172;
const CONTEXT_MENU_HEIGHT = 112;
const GROUP_REORDER_COOLDOWN_MS = 800;

function menuPosition(clientX, clientY, width = CONTEXT_MENU_WIDTH, height = CONTEXT_MENU_HEIGHT) {
  const margin = 10;
  const maxX = window.innerWidth - width - margin;
  const maxY = window.innerHeight - height - margin;

  return {
    x: Math.max(margin, Math.min(clientX, maxX)),
    y: Math.max(margin, Math.min(clientY, maxY)),
  };
}

function hasDragType(event, type) {
  return Array.from(event.dataTransfer?.types || []).includes(type);
}

function stopLockedEvent(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
}

function TodoPage({ todos, setTodos, todoFilter, setTodoFilter, persistSettings, locked = false, onLockedAction }) {
  const [newTodo, setNewTodo] = useState("");

  const updateTodos = (next) => {
    setTodos(next);
    persistSettings({ todosJson: JSON.stringify(next) });
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (locked) {
      onLockedAction?.();
      return;
    }
    const text = newTodo.trim();
    if (!text) return;
    const todo = { id: crypto.randomUUID(), text, done: false, createdAt: new Date().toISOString() };
    updateTodos([todo, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    updateTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    updateTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    updateTodos(todos.filter((t) => !t.done));
  };

  const filtered = todos.filter((t) => {
    if (todoFilter === "active") return !t.done;
    if (todoFilter === "completed") return t.done;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className="todo-page">
      <div className="page-top-divider" aria-hidden="true" />
      <div className="tool-page-header todo-header">
        <div>
          <span className="tool-page-kicker">Focus</span>
          <h1>待办事项</h1>
          <p>把零碎想法收进清单，今天只盯住下一件事。</p>
        </div>
        <div className="tool-page-stats">
          <span><strong>{activeCount}</strong>未完成</span>
          <span><strong>{completedCount}</strong>已完成</span>
        </div>
      </div>
      <form className="todo-input-row" onSubmit={addTodo}>
        <input
          className="todo-input"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加新的待办事项..."
          autoFocus
          disabled={locked}
        />
        <button className="todo-add-btn" type="submit" disabled={locked}>
          <Plus size={18} />
          <span>添加</span>
        </button>
      </form>
      <div className="todo-filters">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={`todo-filter-btn ${todoFilter === f ? "is-active" : ""}`}
            onClick={() => setTodoFilter(f)}
          >
            {f === "all" ? "全部" : f === "active" ? "进行中" : "已完成"}
          </button>
        ))}
        {completedCount > 0 && (
          <button className="todo-clear-btn" type="button" onClick={clearCompleted} disabled={locked}>
            清除已完成
          </button>
        )}
      </div>
      <ul className="todo-list">
        {filtered.length === 0 && (
          <li className="todo-empty">
            {todoFilter === "all" ? "还没有待办事项" : todoFilter === "active" ? "所有事项已完成" : "还没有已完成的事项"}
          </li>
        )}
        {filtered.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.done ? "is-done" : ""}`}>
            <button className="todo-check" onClick={() => toggleTodo(todo.id)} type="button" disabled={locked}>
              {todo.done && <Check size={14} />}
            </button>
            <span className="todo-text">{todo.text}</span>
            <button className="todo-delete" onClick={() => deleteTodo(todo.id)} type="button" disabled={locked}>
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotesPage({ notes, setNotes, persistSettings, locked = false, onLockedAction }) {
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const updateNotes = (next) => {
    setNotes(next);
    persistSettings({ notesJson: JSON.stringify(next) });
  };

  const startCreate = () => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    setEditingNote("new");
    setTitle("");
    setContent("");
  };

  const startEdit = (note) => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    setEditingNote(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const saveNote = () => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) { setEditingNote(null); return; }
    const now = new Date().toISOString();
    if (editingNote === "new") {
      updateNotes([{ id: crypto.randomUUID(), title: t || "无标题", content: c, createdAt: now, updatedAt: now }, ...notes]);
    } else {
      updateNotes(notes.map((n) => n.id === editingNote ? { ...n, title: t || "无标题", content: c, updatedAt: now } : n));
    }
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const deleteNote = (id) => {
    if (locked) {
      onLockedAction?.();
      return;
    }
    updateNotes(notes.filter((n) => n.id !== id));
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="notes-page">
      <div className="page-top-divider" aria-hidden="true" />
      <div className="tool-page-header notes-header">
        <div>
          <span className="tool-page-kicker">Notes</span>
          <h1>我的笔记</h1>
          <p>快速记录灵感、链接、片段和当天的想法。</p>
        </div>
        <div className="tool-page-stats">
          <span><strong>{notes.length}</strong>总数</span>
        </div>
      </div>
      <div className="notes-toolbar">
        <button className="notes-add-btn" type="button" onClick={startCreate} disabled={locked}>
          <Plus size={18} />
          <span>新建笔记</span>
        </button>
      </div>
      {editingNote && (
        <div className="note-editor">
          <input
            className="note-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            autoFocus
          />
          <textarea
            className="note-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写点什么..."
            rows={6}
          />
          <div className="note-editor-actions">
            <button className="note-save-btn" type="button" onClick={saveNote} disabled={locked}>保存</button>
            <button className="note-cancel-btn" type="button" onClick={() => setEditingNote(null)}>取消</button>
          </div>
        </div>
      )}
      <div className="notes-grid">
        {notes.length === 0 && !editingNote && (
          <div className="notes-empty">
            <FileText size={48} />
            <p>还没有笔记，点击"新建笔记"开始记录</p>
          </div>
        )}
        {notes.map((note) => (
          <div key={note.id} className="note-card" onClick={() => startEdit(note)}>
            <div className="note-card-header">
              <strong className="note-card-title">{note.title}</strong>
              <button className="note-delete-btn" type="button" disabled={locked} onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}>
                <X size={14} />
              </button>
            </div>
            {note.content && <p className="note-card-content">{note.content}</p>}
            <span className="note-card-time">{formatDate(note.updatedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnniversaryPage({ anniversaries, setAnniversaries, persistSettings }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const updateAnniversaries = (next) => {
    setAnniversaries(next);
    persistSettings({ anniversariesJson: JSON.stringify(next) });
  };

  const addAnniversary = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !date) return;
    const item = { id: crypto.randomUUID(), name: trimmed, date, createdAt: new Date().toISOString() };
    updateAnniversaries([item, ...anniversaries]);
    setName("");
    setDate("");
  };

  const deleteAnniversary = (id) => {
    updateAnniversaries(anniversaries.filter((a) => a.id !== id));
  };

  const calcDays = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + "T00:00:00");
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const sorted = [...anniversaries].sort((a, b) => calcDays(a.date) - calcDays(b.date));

  return (
    <div className="anniversary-page">
      <div className="page-top-divider" aria-hidden="true" />
      <div className="tool-page-header anniversary-header">
        <div>
          <span className="tool-page-kicker">Moments</span>
          <h1>纪念日</h1>
          <p>记住重要日期，提前给生活留一点仪式感。</p>
        </div>
        <div className="tool-page-stats">
          <span><strong>{anniversaries.length}</strong>总数</span>
          <span><strong>{sorted.filter((item) => calcDays(item.date) >= 0).length}</strong>未来</span>
        </div>
      </div>
      <form className="anniversary-input-row" onSubmit={addAnniversary}>
        <input
          className="anniversary-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="纪念日名称"
        />
        <input
          className="anniversary-date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="anniversary-add-btn" type="submit">
          <Plus size={18} />
          <span>添加</span>
        </button>
      </form>
      <ul className="anniversary-list">
        {sorted.length === 0 && (
          <li className="anniversary-empty">还没有纪念日，添加一个吧</li>
        )}
        {sorted.map((item) => {
          const days = calcDays(item.date);
          const isPast = days < 0;
          const isToday = days === 0;
          return (
            <li key={item.id} className={`anniversary-item ${isToday ? "is-today" : ""}`}>
              <div className="anniversary-info">
                <strong className="anniversary-name">{item.name}</strong>
                <span className="anniversary-date">{item.date}</span>
              </div>
              <div className="anniversary-days">
                {isToday ? (
                  <span className="anniversary-today-badge">今天</span>
                ) : (
                  <span className={isPast ? "is-past" : "is-future"}>
                    {isPast ? `已过 ${Math.abs(days)} 天` : `还有 ${days} 天`}
                  </span>
                )}
              </div>
              <button className="anniversary-delete" onClick={() => deleteAnniversary(item.id)} type="button">
                <X size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CountdownPage({ countdowns, setCountdowns, persistSettings }) {
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const updateCountdowns = (next) => {
    setCountdowns(next);
    persistSettings({ countdownsJson: JSON.stringify(next) });
  };

  const addCountdown = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !targetDate) return;
    const item = { id: crypto.randomUUID(), name: trimmed, targetDate, createdAt: new Date().toISOString() };
    updateCountdowns([item, ...countdowns]);
    setName("");
    setTargetDate("");
  };

  const deleteCountdown = (id) => {
    updateCountdowns(countdowns.filter((c) => c.id !== id));
  };

  const calcRemaining = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + "T00:00:00");
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const sorted = [...countdowns].sort((a, b) => calcRemaining(a.targetDate) - calcRemaining(b.targetDate));

  return (
    <div className="countdown-page">
      <div className="page-top-divider" aria-hidden="true" />
      <div className="tool-page-header countdown-header">
        <div>
          <span className="tool-page-kicker">Countdown</span>
          <h1>倒数日</h1>
          <p>把期待和截止日期摆在眼前，越近越清楚。</p>
        </div>
        <div className="tool-page-stats">
          <span><strong>{countdowns.length}</strong>总数</span>
          <span><strong>{sorted.filter((item) => calcRemaining(item.targetDate) >= 0).length}</strong>进行中</span>
        </div>
      </div>
      <form className="countdown-input-row" onSubmit={addCountdown}>
        <input
          className="countdown-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="事件名称"
        />
        <input
          className="countdown-date-input"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <button className="countdown-add-btn" type="submit">
          <Plus size={18} />
          <span>添加</span>
        </button>
      </form>
      <div className="countdown-grid">
        {sorted.length === 0 && (
          <div className="countdown-empty">还没有倒数日，添加一个吧</div>
        )}
        {sorted.map((item) => {
          const days = calcRemaining(item.targetDate);
          const isPast = days < 0;
          const isToday = days === 0;
          return (
            <div key={item.id} className={`countdown-card ${isToday ? "is-today" : isPast ? "is-past" : ""}`}>
              <button className="countdown-delete" onClick={() => deleteCountdown(item.id)} type="button">
                <X size={14} />
              </button>
              <strong className="countdown-card-name">{item.name}</strong>
              <div className="countdown-card-number">
                {isToday ? "今天" : Math.abs(days)}
              </div>
              <span className="countdown-card-label">
                {isToday ? "" : isPast ? "天已过" : "天后"}
              </span>
              <span className="countdown-card-date">{item.targetDate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const WMO_CODES = {
  0: "晴", 1: "大部晴朗", 2: "多云", 3: "阴",
  45: "雾", 48: "雾凇",
  51: "小毛毛雨", 53: "毛毛雨", 55: "大毛毛雨",
  61: "小雨", 63: "中雨", 65: "大雨",
  71: "小雪", 73: "中雪", 75: "大雪",
  80: "阵雨", 81: "中阵雨", 82: "大阵雨",
  95: "雷暴", 96: "冰雹雷暴", 99: "大冰雹雷暴",
};

function getWeatherSceneType(code) {
  if (code === 0) return "sunny";
  if (code === 1) return "mostly-sunny";
  if (code === 2) return "cloudy";
  if (code === 3) return "overcast";
  if ([45, 48].includes(code)) return "foggy";
  if ([51, 53, 55].includes(code)) return "drizzle";
  if ([61, 63, 65].includes(code)) return "rainy";
  if ([80, 81, 82].includes(code)) return "showers";
  if ([71, 73, 75].includes(code)) return "snowy";
  if (code === 95) return "thunder";
  if ([96, 99].includes(code)) return "hail";
  return "cloudy";
}

function WeatherScene({ code, compact = false }) {
  const type = getWeatherSceneType(code);
  return (
    <span className={`weather-scene weather-scene-${type} ${compact ? "is-compact" : ""}`} aria-hidden="true">
      <span className="weather-sun" />
      <span className="weather-cloud weather-cloud-a" />
      <span className="weather-cloud weather-cloud-b" />
      <span className="weather-rain">
        <i />
        <i />
        <i />
      </span>
      <span className="weather-fog">
        <i />
        <i />
      </span>
      <span className="weather-lightning" />
      <span className="weather-snow">
        <i />
        <i />
        <i />
      </span>
      <span className="weather-hail">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

function WeatherCardBackdrop({ code }) {
  const type = getWeatherSceneType(code);
  return (
    <span className={`weather-card-backdrop weather-card-backdrop-${type}`} aria-hidden="true">
      <span className="backdrop-sun" />
      <span className="backdrop-cloud backdrop-cloud-a" />
      <span className="backdrop-cloud backdrop-cloud-b" />
      <span className="backdrop-fog"><i /><i /><i /></span>
      <span className="backdrop-lightning" />
      <span className="backdrop-rain">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="backdrop-snow">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="backdrop-hail">
        <i />
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

async function resolveWeatherLocationName(lat, lon) {
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=zh`);
  if (!response.ok) throw new Error("定位名称解析失败");
  const data = await response.json();
  return formatWeatherPlaceName(data.principalSubdivision, data.city || data.locality);
}

function normalizePlaceToken(value) {
  return (value || "").replace(/(省|市|特别行政区|自治区|回族自治区|维吾尔自治区|壮族自治区)$/u, "");
}

function formatWeatherPlaceName(province, city, fallback = "当前位置") {
  const provinceName = province?.trim();
  const cityName = city?.trim();
  const parts = [provinceName, cityName].filter(Boolean)
    .filter((item, index, arr) => (
      index === 0 || normalizePlaceToken(item) !== normalizePlaceToken(arr[index - 1])
    ));
  return parts.join(" · ") || fallback;
}

function normalizeWeatherCityResult(place) {
  const address = place.address || {};
  const isChina = address.country_code === "cn";
  const displayParts = (place.display_name || "").split(",").map((part) => part.trim()).filter(Boolean);
  const localName = address.city || address.town || address.county || address.district || address.suburb || place.name;
  const inferredProvince = isChina
    ? displayParts.find((part) => part !== "中国" && part !== localName && part !== place.name)
    : "";
  const provinceName = address.state || address.province || inferredProvince || "";
  const displayName = isChina
    ? formatWeatherPlaceName(provinceName, localName, place.name)
    : (place.display_name || place.name);
  const detail = isChina
    ? displayParts.filter((part) => part !== "中国" && !displayName.includes(part)).slice(0, 2).join(" · ")
    : [address.state, address.country].filter(Boolean).join(" · ");
  return {
    id: place.place_id,
    name: place.name,
    latitude: Number(place.lat),
    longitude: Number(place.lon),
    displayName,
    detail,
    rank: (isChina ? 1000 : 0) + (place.importance || 0) * 100 - (place.place_rank || 30),
  };
}

async function searchWeatherCities(query) {
  const keyword = query.trim();
  if (!keyword) return [];
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=10&accept-language=zh-CN&q=${encodeURIComponent(keyword)}`);
  if (!response.ok) throw new Error("城市搜索失败");
  const data = await response.json();
  const seen = new Set();
  return (data || [])
    .map(normalizeWeatherCityResult)
    .filter((item) => {
      const key = `${item.displayName}-${item.latitude.toFixed(4)}-${item.longitude.toFixed(4)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 8);
}

function WeatherPage({ currentUser, persistSettings }) {
  const [cities, setCities] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dazyhub_weatherCities"));
      return Array.isArray(saved) && saved.length > 0 ? saved : null;
    } catch { return null; }
  });
  const [weatherMap, setWeatherMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isWeatherAddOpen, setIsWeatherAddOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [citySearchResults, setCitySearchResults] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const citySearchTimer = useRef(null);
  const primaryCity = cities?.[0] || null;
  const savedCities = cities || [];
  const primaryWeather = primaryCity ? weatherMap[`${primaryCity.lat},${primaryCity.lon}`]?.current : null;
  const saveWeatherCities = (next) => {
    localStorage.setItem("dazyhub_weatherCities", JSON.stringify(next));
    persistSettings?.({ weatherCitiesJson: JSON.stringify(next) });
  };
  const resetWeatherAddForm = () => {
    setCitySearchQuery("");
    setCitySearchResults([]);
    setSearchError("");
  };

  useEffect(() => {
    setCities((existing) => {
      if (!existing?.some((city) => city.name?.startsWith("中国 · "))) return existing;
      const next = existing.map((city) => (
        city.name?.startsWith("中国 · ") ? { ...city, name: city.name.replace(/^中国 · /, "") } : city
      ));
      saveWeatherCities(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!currentUser?.weatherCitiesJson) return;
    try {
      const parsed = JSON.parse(currentUser.weatherCitiesJson);
      if (!Array.isArray(parsed)) return;
      setCities(parsed.length > 0 ? parsed : []);
      localStorage.setItem("dazyhub_weatherCities", JSON.stringify(parsed));
    } catch { /* 忽略 */ }
  }, [currentUser?.weatherCitiesJson]);

  const renderCityCard = (loc, idx) => {
    const key = `${loc.lat},${loc.lon}`;
    const weather = weatherMap[key];
    const current = weather?.current;
    const daily = weather?.daily;
    const weatherCode = current?.weather_code;
    const weatherText = current ? (WMO_CODES[weatherCode] || "未知") : "";
    return (
      <div key={key} className="weather-city-card weather-city-card-standard">
        <WeatherCardBackdrop code={weatherCode} />
        <div className="weather-current">
          <div className="weather-current-main">
            <div className="weather-current-info">
              <div className="weather-location"><MapPin size={14} />{loc.name}</div>
              <div className="weather-temp">{current ? Math.round(current.temperature_2m) : "--"}°</div>
              <div className="weather-desc">{weatherText || "等待天气数据"}</div>
            </div>
          </div>
          <div className="weather-current-details">
            <div><ThermometerSun size={15} /><span>体感</span><strong>{current ? `${Math.round(current.apparent_temperature)}°` : "--"}</strong></div>
            <div><Droplets size={15} /><span>湿度</span><strong>{current ? `${current.relative_humidity_2m}%` : "--"}</strong></div>
            <div><Wind size={15} /><span>风速</span><strong>{current ? `${Math.round(current.wind_speed_10m)} km/h` : "--"}</strong></div>
          </div>
          {savedCities.length > 1 && (
            <button type="button" className="weather-remove-btn" onClick={() => removeCity(idx)} aria-label={`删除 ${loc.name}`}>
              <X size={14} />
            </button>
          )}
        </div>
        {daily && (
          <div className="weather-forecast">
            {daily.time.slice(0, 4).map((date, i) => {
              const dayCode = daily.weather_code[i];
              const dayName = i === 0 ? "今天" : new Date(date + "T00:00:00").toLocaleDateString("zh-CN", { weekday: "short" });
              return (
                <div key={date} className="weather-forecast-day">
                  <span className="forecast-day-name">{dayName}</span>
                  <WeatherScene code={dayCode} compact />
                  <span className="forecast-temp">{Math.round(daily.temperature_2m_min[i])}° / {Math.round(daily.temperature_2m_max[i])}°</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (cities === null) {
      navigator.geolocation?.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          let name = "当前位置";
          try {
            name = await resolveWeatherLocationName(lat, lon);
          } catch {
            name = "当前位置";
          }
          const loc = [{ name, lat, lon, isCurrentLocation: true }];
          setCities(loc);
          saveWeatherCities(loc);
        },
        () => { setCities([]); }
      );
    }
  }, []);

  useEffect(() => {
    const currentIndex = (cities || []).findIndex((city) => city.isCurrentLocation || city.name === "当前位置");
    if (currentIndex < 0) return;
    const current = cities[currentIndex];
    if (current.locationNameResolved) return;

    let cancelled = false;
    resolveWeatherLocationName(current.lat, current.lon)
      .then((name) => {
        if (cancelled || !name || name === current.name) return;
        setCities((existing) => {
          const next = (existing || []).map((city, index) => (
            index === currentIndex ? { ...city, name, isCurrentLocation: true, locationNameResolved: true } : city
          ));
          saveWeatherCities(next);
          return next;
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [cities]);

  useEffect(() => {
    if (!cities || cities.length === 0) return;
    setLoading(true);
    Promise.all(
      cities.map((c) =>
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
          .then((r) => r.json())
          .then((data) => [`${c.lat},${c.lon}`, data])
      )
    ).then((entries) => {
      setWeatherMap(Object.fromEntries(entries));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [cities]);

  const handleCitySearchInput = (value) => {
    setCitySearchQuery(value);
    setSearchError("");
    clearTimeout(citySearchTimer.current);
    if (!value.trim()) {
      setCitySearchResults([]);
      return;
    }
    citySearchTimer.current = setTimeout(async () => {
      setCitySearchLoading(true);
      try {
        const results = await searchWeatherCities(value.trim());
        setCitySearchResults(results);
      } catch (err) {
        setSearchError(err.message || "搜索失败");
      } finally {
        setCitySearchLoading(false);
      }
    }, 400);
  };

  const addCity = (c) => {
    const loc = { name: c.displayName || c.name, lat: c.latitude, lon: c.longitude };
    const key = `${c.latitude},${c.longitude}`;
      const currentCities = cities || [];
    if (currentCities.some((x) => `${x.lat},${x.lon}` === key)) {
      resetWeatherAddForm();
      return;
    }
    const next = [...currentCities, loc];
    setCities(next);
    saveWeatherCities(next);
    resetWeatherAddForm();
    setIsWeatherAddOpen(false);
  };

  const removeCity = (idx) => {
    const next = (cities || []).filter((_, i) => i !== idx);
    setCities(next);
    saveWeatherCities(next);
  };

  return (
    <div className="weather-page">
      <div className="page-top-divider" aria-hidden="true" />
      <div className="tool-page-header weather-panel-header">
        <div>
          <span className="tool-page-kicker">实时天气</span>
          <h1>天气</h1>
          <p>添加常用城市，快速查看当前天气和未来趋势。</p>
        </div>
        <div className="tool-page-stats">
          <span><strong>{savedCities.length}</strong>城市</span>
          <button
            className="weather-add-toggle"
            type="button"
            aria-label="添加城市"
            onClick={() => setIsWeatherAddOpen(true)}
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      {isWeatherAddOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setIsWeatherAddOpen(false);
            resetWeatherAddForm();
          }
        }}>
          <div className="modal weather-add-modal" role="dialog" aria-modal="true" aria-labelledby="weather-add-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 id="weather-add-title">添加城市天气</h2>
              <button
                className="icon-button"
                type="button"
                aria-label="关闭"
                onClick={() => {
                  setIsWeatherAddOpen(false);
                  resetWeatherAddForm();
                }}
              >
                <X />
              </button>
            </div>
            <div className="weather-search-box">
              <div className="weather-search-input-wrap">
                <Search size={16} />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => handleCitySearchInput(e.target.value)}
                  placeholder="搜索全球城市，如 Tokyo、London、北京..."
                  autoFocus
                />
                {citySearchLoading && <span className="weather-search-spinner" />}
              </div>
              {searchError && <div className="weather-search-message">{searchError}</div>}
              {citySearchResults.length > 0 && (
                <ul className="weather-search-results">
                  {citySearchResults.map((r) => {
                    const address = r.address || {};
                    const region = [address.state, address.country].filter(Boolean).join(", ");
                    const alreadyAdded = (cities || []).some((x) => `${x.lat},${x.lon}` === `${r.latitude},${r.longitude}`);
                    return (
                      <li key={r.id || `${r.latitude}-${r.longitude}`}>
                        <button
                          type="button"
                          className={alreadyAdded ? "is-added" : ""}
                          disabled={alreadyAdded}
                          onClick={() => addCity(r)}
                        >
                          <span className="weather-search-result-name">{r.displayName || r.name}</span>
                          {region && <span className="weather-search-result-region">{region}</span>}
                          {alreadyAdded && <span className="weather-search-result-badge">已添加</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {citySearchQuery.trim() && !citySearchLoading && citySearchResults.length === 0 && !searchError && (
                <p className="weather-search-empty">没有找到匹配的城市</p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && cities?.length > 0 && Object.keys(weatherMap).length === 0 && <p className="weather-loading">加载中...</p>}

      {savedCities.length > 0 && (
        <div className="weather-city-grid">
          {savedCities.map((loc, idx) => renderCityCard(loc, idx))}
        </div>
      )}

      {!loading && (!cities || cities.length === 0) && <p className="weather-empty">搜索添加城市，或允许定位权限</p>}
    </div>
  );
}

function App() {
  const [sites, setSites] = useState(() => withOrder([...starterShortcuts, ...starterSites]));
  const [siteGroups, setSiteGroups] = useState(() => withOrder(initialGroups));
  const [allGroupCollapsed, setAllGroupCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragState, setDragState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [addSiteGroup, setAddSiteGroup] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [addingGroup, setAddingGroup] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [tagSize, setTagSize] = useState(() => localStorage.getItem("dazyhub_tagSize") || "short");
  const [searchEngineId, setSearchEngineId] = useState(() => localStorage.getItem("dazyhub_searchEngine") || "google");
  const [confirmDelete, setConfirmDelete] = useState(() => localStorage.getItem("dazyhub_confirmDelete") !== "false");
  const [linkTarget, setLinkTarget] = useState(() => localStorage.getItem("dazyhub_linkTarget") || "_self");
  const [theme, setTheme] = useState(() => normalizeTheme(localStorage.getItem("dazyhub_theme") || "light"));
  const [toast, setToast] = useState(null);
  const [isSearchEngineOpen, setIsSearchEngineOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("bookmarks");
  const [adminActiveTab, setAdminActiveTab] = useState("users");
  const [cardsLocked, setCardsLocked] = useState(() => localStorage.getItem(CARD_LOCKED_KEY) === "true");
  const [sidebarPages, setSidebarPages] = useState(() => {
    const saved = localStorage.getItem("dazyhub_sidebarPages");
    return saved ? JSON.parse(saved) : { bookmarks: true, todos: true, notes: true, anniversaries: true, countdowns: true, weather: true };
  });
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);
  const [countdowns, setCountdowns] = useState([]);
  const [todoFilter, setTodoFilter] = useState("all");

  const [confirmDialog, setConfirmDialog] = useState(null);
  const [contentContextMenu, setContentContextMenu] = useState(null);
  const [groupDragState, setGroupDragState] = useState(null);
  const [folderCardDropTarget, setFolderCardDropTarget] = useState(null);
  const [sidebarDropTarget, setSidebarDropTarget] = useState(null);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [closingFolderId, setClosingFolderId] = useState(null);
  const [folderOrigin, setFolderOrigin] = useState(null);
  const lastDragMoveRef = useRef({ targetId: null, placement: null, movedAt: 0 });
  const lastGroupReorderRef = useRef({ at: 0, targetId: null });
  const pendingDragScrollRef = useRef(null);
  const latestSiteGroupsRef = useRef(siteGroups);
  const latestSitesRef = useRef(sites);
  const activeSiteDragRef = useRef(null);
  const groupListRef = useRef(null);
  const mergeTimerRef = useRef(null);
  const [mergeTargetId, setMergeTargetId] = useState(null);
  const dragStateRef = useRef(null);
  const groupDragStateRef = useRef(null);
  const isNavigationPage = currentPage === "bookmarks" || currentPage === "authing";
  const cardLockActive = isNavigationPage && cardsLocked;

  const showLockedToast = () => {
    setToast("卡片已锁定，先解锁再编辑");
  };

  const toggleCardsLocked = () => {
    const nextLocked = !cardsLocked;
    setCardsLocked(nextLocked);
    localStorage.setItem(CARD_LOCKED_KEY, nextLocked ? "true" : "false");
    persistSettings({ cardsLocked: nextLocked });

    if (nextLocked) {
      setAddSiteGroup(null);
      setEditingSite(null);
      setEditingGroup(null);
      setAddingGroup(false);
      setContentContextMenu(null);
      setDragState(null);
      setGroupDragState(null);
      setFolderCardDropTarget(null);
      setSidebarDropTarget(null);
      clearMergeState();
    }

    setToast(nextLocked ? "卡片已锁定" : "卡片已解锁");
  };

  const rememberDragScrollPosition = () => {
    if (!activeSiteDragRef.current?.draggedId) return;
    pendingDragScrollRef.current = { x: window.scrollX, y: window.scrollY };
  };

  const animateGroupReorder = (callback) => {
    callback();
  };

  useEffect(() => {
    latestSiteGroupsRef.current = siteGroups;
  }, [siteGroups]);

  useEffect(() => {
    latestSitesRef.current = sites;
  }, [sites]);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    groupDragStateRef.current = groupDragState;
  }, [groupDragState]);

  const applyUserSettings = (user) => {
    if (user.tagSize) {
      setTagSize(user.tagSize);
      localStorage.setItem("dazyhub_tagSize", user.tagSize);
    }
    if (user.searchEngine) {
      setSearchEngineId(user.searchEngine);
      localStorage.setItem("dazyhub_searchEngine", user.searchEngine);
    }
    if (user.confirmDelete !== undefined && user.confirmDelete !== null) {
      setConfirmDelete(user.confirmDelete);
      localStorage.setItem("dazyhub_confirmDelete", user.confirmDelete ? "true" : "false");
    }
    if (user.linkTarget) {
      setLinkTarget(user.linkTarget);
      localStorage.setItem("dazyhub_linkTarget", user.linkTarget);
    }
    if (user.theme) {
      const nextTheme = normalizeTheme(user.theme);
      setTheme(nextTheme);
      localStorage.setItem("dazyhub_theme", nextTheme);
    }
    setSites(normalizeSites(parseSettingsJson(user.sitesJson, [...starterShortcuts, ...starterSites])));
    setSiteGroups(normalizeGroups(parseSettingsJson(user.siteGroupsJson, initialGroups)));
    if (user.todosJson) {
      try { setTodos(JSON.parse(user.todosJson)); } catch { /* 忽略 */ }
    }
    if (user.notesJson) {
      try { setNotes(JSON.parse(user.notesJson)); } catch { /* 忽略 */ }
    }
    if (user.anniversariesJson) {
      try { setAnniversaries(JSON.parse(user.anniversariesJson)); } catch { /* 忽略 */ }
    }
    if (user.countdownsJson) {
      try { setCountdowns(JSON.parse(user.countdownsJson)); } catch { /* 忽略 */ }
    }
    if (user.sidebarPagesJson) {
      try {
        const parsed = JSON.parse(user.sidebarPagesJson);
        setSidebarPages(parsed);
        localStorage.setItem("dazyhub_sidebarPages", JSON.stringify(parsed));
      } catch { /* 忽略 */ }
    }
    if (user.weatherCitiesJson) {
      localStorage.setItem("dazyhub_weatherCities", user.weatherCitiesJson);
    }
    if (user.cardsLocked !== undefined && user.cardsLocked !== null) {
      setCardsLocked(user.cardsLocked);
      localStorage.setItem(CARD_LOCKED_KEY, user.cardsLocked ? "true" : "false");
    }
  };

  const buildPageSettings = (overrides = {}) => ({
    sitesJson: JSON.stringify(overrides.sites || sites),
    siteGroupsJson: JSON.stringify(overrides.siteGroups || siteGroups),
    activeGroup: "all",
    todosJson: JSON.stringify(overrides.todos ?? todos),
    notesJson: JSON.stringify(overrides.notes ?? notes),
    anniversariesJson: JSON.stringify(overrides.anniversaries ?? anniversaries),
    countdownsJson: JSON.stringify(overrides.countdowns ?? countdowns),
  });

  const persistSettings = async (payload, options = {}) => {
    if (!currentUser) return;

    try {
      const updatedUser = await updateSettings(options.includePage ? { ...buildPageSettings(options.page || {}), ...payload } : payload);
      setCurrentUser(updatedUser);
      if (!options.skipApply) {
        applyUserSettings(updatedUser);
      }
    } catch (error) {
      // 保持 UI 响应；稍后刷新会恢复用户设置
    }
  };

  const migrateLocalSettings = (user) => {
    const payload = {};
    if (!user.weatherCitiesJson) {
      const savedWeatherCities = localStorage.getItem("dazyhub_weatherCities");
      if (savedWeatherCities) payload.weatherCitiesJson = savedWeatherCities;
    }
    const savedCardsLocked = localStorage.getItem(CARD_LOCKED_KEY);
    if (savedCardsLocked !== null) {
      const localCardsLocked = savedCardsLocked === "true";
      if (user.cardsLocked !== localCardsLocked) payload.cardsLocked = localCardsLocked;
    }
    if (Object.keys(payload).length === 0) return;
    updateSettings(payload)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        applyUserSettings(updatedUser);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => registration.update())
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!getToken()) return;

    fetchMe()
      .then((user) => {
        setCurrentUser(user);
        applyUserSettings(user);
        migrateLocalSettings(user);
      })
      .catch((error) => {
        if (error.status === 401) {
          clearToken();
        }
      });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dazyhub_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!dragState) return;

    const clearDragState = () => {
      lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
      setDragState(null);
      clearMergeState();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") clearDragState();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dragState]);

  useEffect(() => {
    if (!groupDragState) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        lastGroupReorderRef.current = { at: 0, targetId: null };
        setGroupDragState(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [groupDragState]);

  useEffect(() => {
    if (!contentContextMenu) return;
    const handleDown = (e) => {
      if (!e.target.closest(".context-menu")) setContentContextMenu(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setContentContextMenu(null);
    };
    const handleScroll = () => setContentContextMenu(null);
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [contentContextMenu]);

  useEffect(() => {
    if (currentPage === "admin" && currentUser?.role !== "admin") {
      setCurrentPage("bookmarks");
    }
  }, [currentPage, currentUser?.role]);

  useEffect(() => {
    const pendingScroll = pendingDragScrollRef.current;
    if (pendingScroll && activeSiteDragRef.current?.draggedId) {
      requestAnimationFrame(() => {
        window.scrollTo(pendingScroll.x, pendingScroll.y);
        if (pendingDragScrollRef.current === pendingScroll) pendingDragScrollRef.current = null;
      });
    } else {
      pendingDragScrollRef.current = null;
    }
  }, [sites]);

  const filteredSections = useMemo(() => {
    const sourceGroups = currentPage === "authing" ? authingGroups : siteGroups;
    const sourceSites = currentPage === "authing" ? authingSites : sites;

    return sourceGroups
      .map((group) => {
        const items = sourceSites.filter((site) => {
          return site.group === group.id;
        });

        return { ...group, items };
      })
      .filter((section) => section.items.length > 0 || sourceGroups.some((g) => g.parentId === section.id));
  }, [currentPage, siteGroups, sites]);

  const folderTree = useMemo(() => buildFolderTree(siteGroups), [siteGroups]);
  const visibleFolders = useMemo(() => flattenFolderTree(folderTree), [folderTree]);
  const foldersUnderAll = useMemo(() => visibleFolders.map((group) => ({
    ...group,
    displayDepth: group.depth + 1,
  })), [visibleFolders]);


  const selectedSearchEngine = searchEngines.find((engine) => engine.id === searchEngineId) || searchEngines[0];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextQuery = searchQuery.trim();

    if (!nextQuery) return;

    window.open(selectedSearchEngine.searchUrl(nextQuery), "_blank", "noreferrer");
  };

  const handleDragStart = (event, site) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      showLockedToast();
      return;
    }
    if (contentContextMenu) setContentContextMenu(null);
    activeSiteDragRef.current = { draggedId: site.id, hasMoved: false, didPersist: false };
    const dragPreview = event.currentTarget.cloneNode(true);
    const rect = event.currentTarget.getBoundingClientRect();
    dragPreview.classList.add("drag-preview");
    dragPreview.classList.remove("is-dragging", "is-swap-target", "is-merge-target", "is-drop-after");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    dragPreview.style.opacity = "1";
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, event.clientX - rect.left, event.clientY - rect.top);
    window.setTimeout(() => dragPreview.remove(), 0);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", site.id);
    event.dataTransfer.setData("application/x-dazyhub-site", site.id);
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setDragState({ draggedId: site.id, sourceGroup: site.group, overGroup: site.group, overId: site.id, placement: "before", hasMoved: false });
  };

  const handleDragOver = (event, targetGroup, targetId = null, placement = "before", mergeIntent = false) => {
    if (cardLockActive) return;
    if (hasDragType(event, "application/x-dazyhub-group")) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    setDragState((current) => {
      const draggedId = current?.draggedId;

      if (!draggedId) return current;

      const now = performance.now();
      const lastMove = lastDragMoveRef.current;
      const canReorder = now - lastMove.movedAt > DRAG_REORDER_COOLDOWN_MS;
      const sameHoverTarget = lastMove.targetId === targetId && lastMove.placement === placement;

      if (draggedId && targetId && draggedId !== targetId && !mergeIntent && !sameHoverTarget && canReorder) {
        rememberDragScrollPosition();
        setSites((currentSites) => {
          const { sites: nextSites, siteGroups: nextGroups } = reorderMixedItem(
            currentSites,
            latestSiteGroupsRef.current,
            draggedId,
            "site",
            targetId,
            "site",
            placement,
          );
          setSiteGroups(nextGroups);
          latestSiteGroupsRef.current = nextGroups;
          latestSitesRef.current = nextSites;
          return nextSites;
        });
        if (activeSiteDragRef.current?.draggedId === draggedId) {
          activeSiteDragRef.current.hasMoved = true;
        }
        lastDragMoveRef.current = { targetId, placement, movedAt: now };
      }

      return {
        draggedId,
        sourceGroup: current?.sourceGroup,
        overGroup: targetGroup,
        overId: targetId,
        placement,
        hasMoved: current?.hasMoved || Boolean(draggedId && targetId && draggedId !== targetId),
      };
    });

    // 合并计时器：悬停在不同卡片上时开始
    const currentDragState = dragStateRef.current;
    if (mergeIntent && targetId && currentDragState?.draggedId && targetId !== currentDragState.draggedId) {
      clearTimeout(mergeTimerRef.current?.timer);
      mergeTimerRef.current = null;
      setMergeTargetId(targetId);
    } else {
      clearTimeout(mergeTimerRef.current?.timer);
      mergeTimerRef.current = null;
      setMergeTargetId(null);
    }
  };

  const clearMergeState = () => {
    clearTimeout(mergeTimerRef.current?.timer);
    mergeTimerRef.current = null;
    setMergeTargetId(null);
  };

  const handleFolderDragStart = (event, folder) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      showLockedToast();
      return;
    }
    event.stopPropagation();
    const dragPreview = event.currentTarget.cloneNode(true);
    const rect = event.currentTarget.getBoundingClientRect();
    dragPreview.classList.add("drag-preview");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    dragPreview.style.opacity = "1";
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, event.clientX - rect.left, event.clientY - rect.top);
    window.setTimeout(() => dragPreview.remove(), 0);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-dazyhub-folder-item", folder.id);
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setGroupDragState({ draggedId: folder.id, overId: folder.id, hasMoved: false });
  };

  const handleFolderDragOver = (event, targetId, targetIsFolder, placement = "before") => {
    if (cardLockActive) return;
    if (!hasDragType(event, "application/x-dazyhub-folder-item")) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    const draggedId = groupDragState?.draggedId || event.dataTransfer.getData("application/x-dazyhub-folder-item");
    if (!draggedId || draggedId === targetId) return;

    const now = performance.now();
    const lastMove = lastDragMoveRef.current;
    const canReorder = now - lastMove.movedAt > DRAG_REORDER_COOLDOWN_MS;
    if (!canReorder && lastMove.targetId === targetId) return;

    rememberDragScrollPosition();
    animateGroupReorder(() => {
      const { sites: nextSites, siteGroups: nextGroups } = reorderMixedItem(
        latestSitesRef.current,
        latestSiteGroupsRef.current,
        draggedId,
        "folder",
        targetId,
        targetIsFolder ? "folder" : "site",
        placement,
      );
      setSites(nextSites);
      latestSitesRef.current = nextSites;
      setSiteGroups(nextGroups);
      latestSiteGroupsRef.current = nextGroups;
    });
    lastDragMoveRef.current = { targetId, placement, movedAt: now };
    setGroupDragState((current) => current ? { ...current, overId: targetId, hasMoved: true } : { draggedId, overId: targetId, hasMoved: true });
  };

  const handleFolderDropOnItem = (event, targetId) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (groupDragState?.hasMoved) {
      persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current, siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    }
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setGroupDragState(null);
  };

  const handleFolderDragEnd = () => {
    if (cardLockActive) {
      lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
      setGroupDragState(null);
      return;
    }
    if (groupDragState?.hasMoved) {
      persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current, siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    }
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setGroupDragState(null);
  };

  const sectionId = (groupId) => {
    const group = siteGroups.find((g) => g.id === groupId);
    return group?.parentId || group?.id || "all";
  };

  const handleDrop = (event, targetGroup, targetId = null) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      setDragState(null);
      clearMergeState();
      return;
    }
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain") || dragState?.draggedId;

    if (!draggedId) {
      lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
      setDragState(null);
      clearMergeState();
      return;
    }

    // 合并：拖放到长时间悬停的卡片上
    if (mergeTargetId && mergeTargetId === targetId) {
      const newGroupId = `group-${Date.now()}`;
      const parentGroup = siteGroups.find((g) => g.id === targetGroup);
      const targetSite = sites.find((s) => s.id === targetId);
      const newGroup = { id: newGroupId, name: "新文件夹", color: parentGroup?.color || "#4f46e5", parentId: targetGroup, collapsed: false, order: targetSite?.order ?? 0 };

      setSiteGroups((currentGroups) => {
        const nextGroups = [...currentGroups, newGroup];
        return nextGroups;
      });
      setSites((currentSites) => {
        const nextSites = currentSites.map((site) => {
          if (site.id === draggedId || site.id === mergeTargetId) {
            return { ...site, group: newGroupId, order: site.id === mergeTargetId ? 0 : 1 };
          }
          return site;
        });
        const nextGroups = [...latestSiteGroupsRef.current, newGroup];
        latestSitesRef.current = nextSites;
        latestSiteGroupsRef.current = nextGroups;
        persistSettings({}, { includePage: true, page: { sites: nextSites, siteGroups: nextGroups }, skipApply: true });
        return nextSites;
      });

      lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
      setDragState(null);
      clearMergeState();
      setToast("已合并为文件夹");
      return;
    }

    if (targetId && draggedId !== targetId) {
      if (activeSiteDragRef.current?.hasMoved) {
        if (!activeSiteDragRef.current?.didPersist) {
          persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current, siteGroups: latestSiteGroupsRef.current }, skipApply: true });
          if (activeSiteDragRef.current) activeSiteDragRef.current.didPersist = true;
        }
      } else {
      rememberDragScrollPosition();
      const placement = dragState?.overId === targetId ? dragState?.placement || "before" : "before";
      setSites((currentSites) => {
        const { sites: nextSites, siteGroups: nextGroups } = reorderMixedItem(
          currentSites,
          latestSiteGroupsRef.current,
          draggedId,
          "site",
          targetId,
          "site",
          placement,
        );
        if (nextSites === currentSites && nextGroups === latestSiteGroupsRef.current) return currentSites;
        setSiteGroups(nextGroups);
        latestSiteGroupsRef.current = nextGroups;
        latestSitesRef.current = nextSites;
        persistSettings({}, { includePage: true, page: { sites: nextSites, siteGroups: nextGroups }, skipApply: true });
        activeSiteDragRef.current = { draggedId, hasMoved: true, didPersist: true };
        return nextSites;
      });
      }
    } else if (!targetId) {
      rememberDragScrollPosition();
      setSites((currentSites) => {
        const { sites: nextSites, siteGroups: nextGroups } = moveSiteToGroupEnd(currentSites, latestSiteGroupsRef.current, draggedId, targetGroup);
        if (nextSites === currentSites && nextGroups === latestSiteGroupsRef.current) return currentSites;
        setSiteGroups(nextGroups);
        latestSiteGroupsRef.current = nextGroups;
        latestSitesRef.current = nextSites;
        persistSettings({}, { includePage: true, page: { sites: nextSites, siteGroups: nextGroups }, skipApply: true });
        activeSiteDragRef.current = { draggedId, hasMoved: true, didPersist: true };
        return nextSites;
      });
    }
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setDragState(null);
    clearMergeState();
    if (dragOutFolder) {
      closeFolder(true);
      setDragOutFolder(null);
    }
  };

  const handleDragEnd = () => {
    if (activeSiteDragRef.current?.hasMoved && !activeSiteDragRef.current.didPersist) {
      persistSettings({}, { includePage: true, page: { sites: latestSitesRef.current, siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    }
    activeSiteDragRef.current = null;
    lastDragMoveRef.current = { targetId: null, placement: null, movedAt: 0 };
    setDragState(null);
    clearMergeState();
    unwrapSingleSiteFolders();
    if (dragOutFolder) {
      closeFolder(true);
      setDragOutFolder(null);
    }
  };

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setCurrentUser(data.user);
    applyUserSettings(data.user);
    migrateLocalSettings(data.user);
    setAuthMode(null);
    setToast(authMode === "login" ? "登录成功" : "注册成功");
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    setCurrentPage("bookmarks");
    setIsSettingsOpen(false);
    setAuthMode(null);
    setContentContextMenu(null);
  };

  const handleTagSizeChange = (nextTagSize) => {
    setTagSize(nextTagSize);
    localStorage.setItem("dazyhub_tagSize", nextTagSize);
    persistSettings({ tagSize: nextTagSize });
  };

  const handleSearchEngineChange = (nextSearchEngineId) => {
    setSearchEngineId(nextSearchEngineId);
    localStorage.setItem("dazyhub_searchEngine", nextSearchEngineId);
    persistSettings({ searchEngine: nextSearchEngineId });
  };

  const handleConfirmDeleteChange = (nextConfirmDelete) => {
    setConfirmDelete(nextConfirmDelete);
    localStorage.setItem("dazyhub_confirmDelete", nextConfirmDelete ? "true" : "false");
    persistSettings({ confirmDelete: nextConfirmDelete });
  };

  const handleLinkTargetChange = (nextLinkTarget) => {
    setLinkTarget(nextLinkTarget);
    localStorage.setItem("dazyhub_linkTarget", nextLinkTarget);
    persistSettings({ linkTarget: nextLinkTarget });
  };

  const handleSidebarPagesChange = (next) => {
    setSidebarPages(next);
    localStorage.setItem("dazyhub_sidebarPages", JSON.stringify(next));
    persistSettings({ sidebarPagesJson: JSON.stringify(next) });
  };

  const handleThemeChange = (nextTheme) => {
    const normalizedTheme = normalizeTheme(nextTheme);
    setTheme(normalizedTheme);
    localStorage.setItem("dazyhub_theme", normalizedTheme);
    persistSettings({ theme: normalizedTheme });
  };

  const handleAddSite = (site) => {
    if (cardLockActive) {
      setAddSiteGroup(null);
      showLockedToast();
      return;
    }
    setSites((currentSites) => {
      const maxOrder = currentSites.reduce((max, s) => Math.max(max, s.order ?? 0), -1);
      const nextSite = {
        ...site,
        id: `site-${Date.now()}`,
        group: site.group || "ungrouped",
        order: maxOrder + 1,
      };
      const insertAfter = currentSites.reduce((lastIndex, currentSite, index) => (
        currentSite.group === nextSite.group ? index : lastIndex
      ), -1);
      const nextSites = [...currentSites];
      nextSites.splice(insertAfter + 1, 0, nextSite);
      persistSettings({}, { includePage: true, page: { sites: nextSites }, skipApply: true });
      return nextSites;
    });
    setAddSiteGroup(null);
    setToast("网站已添加");
  };

  const handleUpdateSite = (updatedSite) => {
    if (cardLockActive) {
      setEditingSite(null);
      showLockedToast();
      return;
    }
    setSites((currentSites) => {
      const nextSites = currentSites.map((site) => (
        site.id === updatedSite.id ? { ...site, ...updatedSite } : site
      ));
      persistSettings({}, { includePage: true, page: { sites: nextSites }, skipApply: true });
      return nextSites;
    });
    setEditingSite(null);
    setToast("网站已更新");
  };

  const handleDeleteSite = (siteId) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    setSites((currentSites) => {
      const nextSites = currentSites.filter((site) => site.id !== siteId);
      persistSettings({}, { includePage: true, page: { sites: nextSites }, skipApply: true });
      return nextSites;
    });
    setToast("网站已删除");
    setTimeout(() => unwrapSingleSiteFolders(), 0);
  };

  const requestDeleteSite = (siteId, siteName) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    if (confirmDelete) {
      setConfirmDialog({
        message: `确认删除网站「${siteName}」？`,
        onConfirm: () => handleDeleteSite(siteId),
      });
    } else {
      handleDeleteSite(siteId);
    }
  };

  const handleRenameGroup = ({ id, name, color }) => {
    if (cardLockActive) {
      setEditingGroup(null);
      showLockedToast();
      return;
    }
    setSiteGroups((currentGroups) => {
      const nextGroups = currentGroups.map((group) => (
        group.id === id ? { ...group, name, color: color || group.color } : group
      ));
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
    setEditingGroup(null);
    setToast("分组已更新");
  };

  const handleAddGroup = ({ name, color, parentId = null }) => {
    if (cardLockActive) {
      setAddingGroup(false);
      showLockedToast();
      return;
    }
    const newId = `group-${Date.now()}`;
    setSiteGroups((currentGroups) => {
      const maxOrder = currentGroups.reduce((max, g) => Math.max(max, g.order ?? 0), -1);
      const nextGroups = [...currentGroups, { id: newId, name, color, parentId, collapsed: false, order: maxOrder + 1 }];
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
    setAddingGroup(false);
    setToast("文件夹已添加");
  };

  const handleAddRootGroup = () => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    setAddingGroup({ parentId: null, parentName: "" });
  };

  const handleAddChildGroup = (group) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    setAddingGroup({ parentId: group.id, parentName: group.name });
    setSiteGroups((currentGroups) => {
      const nextGroups = currentGroups.map((currentGroup) => (
        currentGroup.id === group.id ? { ...currentGroup, collapsed: false } : currentGroup
      ));
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
  };

  const handleToggleGroup = (groupId) => {
    setSiteGroups((currentGroups) => {
      const nextGroups = currentGroups.map((group) => (
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      ));
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups }, skipApply: true });
      return nextGroups;
    });
  };

  const handleDeleteGroup = (groupId) => {
    if (cardLockActive) {
      setEditingGroup(null);
      showLockedToast();
      return;
    }
    const group = siteGroups.find((currentGroup) => currentGroup.id === groupId);
    if (!group) return;

    const removedIds = collectGroupDescendants(siteGroups, groupId);
    removedIds.add(groupId);
    const nextGroups = siteGroups.filter((currentGroup) => !removedIds.has(currentGroup.id));
    const nextSites = sites.map((site) => (
      removedIds.has(site.group) ? { ...site, group: "ungrouped" } : site
    ));
    setSiteGroups(nextGroups);
    setSites(nextSites);
    persistSettings({}, { includePage: true, page: { siteGroups: nextGroups, sites: nextSites }, skipApply: true });
    setEditingGroup(null);
    setToast("文件夹已删除，里面的网站已移到未分组");
  };

  const handleDissolveGroup = (groupId) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    const group = siteGroups.find((currentGroup) => currentGroup.id === groupId);
    if (!group) return;

    const removedIds = collectGroupDescendants(siteGroups, groupId);
    removedIds.add(groupId);
    const targetGroup = group.parentId || "ungrouped";
    const nextGroups = siteGroups.filter((currentGroup) => !removedIds.has(currentGroup.id));

    const folderOrder = group.order ?? 0;
    const dissolvedSites = sites
      .filter((s) => removedIds.has(s.group))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const displacedItems = [
      ...nextGroups.filter((g) => g.parentId === targetGroup),
      ...sites.filter((s) => s.group === targetGroup && !removedIds.has(s.group)),
    ].filter((item) => (item.order ?? 0) >= folderOrder);

    const dissolvedOrderMap = new Map(dissolvedSites.map((s, i) => [s.id, folderOrder + i]));
    const displacedOrderMap = new Map(displacedItems.map((item, i) => [item.id, folderOrder + dissolvedSites.length + i]));

    const nextSites = sites.map((site) => {
      if (removedIds.has(site.group)) return { ...site, group: targetGroup, order: dissolvedOrderMap.get(site.id) };
      if (displacedOrderMap.has(site.id)) return { ...site, order: displacedOrderMap.get(site.id) };
      return site;
    });
    const adjustedGroups = nextGroups.map((g) => (
      displacedOrderMap.has(g.id) ? { ...g, order: displacedOrderMap.get(g.id) } : g
    ));
    setSiteGroups(adjustedGroups);
    setSites(nextSites);
    persistSettings({}, { includePage: true, page: { siteGroups: adjustedGroups, sites: nextSites }, skipApply: true });
    setToast("文件夹已解散，里面的网站已移出");
  };

  const handleEditSite = (site) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    setEditingSite(site);
  };

  const handleEditGroup = (group) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    setEditingGroup(group);
  };

  const handleGroupDragStart = (event, group) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      showLockedToast();
      return;
    }
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-dazyhub-group", group.id);
    const dragPreview = event.currentTarget.cloneNode(true);
    const rect = event.currentTarget.getBoundingClientRect();
    dragPreview.classList.add("group-drag-preview");
    dragPreview.style.width = `${rect.width}px`;
    dragPreview.style.height = `${rect.height}px`;
    dragPreview.style.setProperty("--folder-depth", event.currentTarget.style.getPropertyValue("--folder-depth") || "0");
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, event.clientX - rect.left, event.clientY - rect.top);
    window.setTimeout(() => dragPreview.remove(), 0);
    lastGroupReorderRef.current = { at: 0, targetId: null };
    setGroupDragState({ draggedId: group.id, overId: group.id, hasMoved: false });
  };

  const handleGroupDragOver = (event, targetId) => {
    if (cardLockActive) return;
    if (!hasDragType(event, "application/x-dazyhub-group")) return;

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    const current = groupDragStateRef.current;
    const draggedId = current?.draggedId;
    if (!draggedId || draggedId === targetId) {
      setGroupDragState(current ? { ...current, overId: targetId } : null);
      return;
    }
    const now = performance.now();
    const lastMove = lastGroupReorderRef.current;
    const canReorder = lastMove.targetId !== targetId || now - lastMove.at > GROUP_REORDER_COOLDOWN_MS;

    if (!canReorder) {
      setGroupDragState(current ? { ...current, overId: targetId } : null);
      return;
    }

    animateGroupReorder(() => {
      setSiteGroups((currentGroups) => {
        const { siteGroups: nextGroups } = reorderMixedItem(
          latestSitesRef.current,
          currentGroups,
          draggedId,
          "folder",
          targetId,
          "folder",
          "before",
        );
        latestSiteGroupsRef.current = nextGroups;
        return nextGroups;
      });
    });
    lastGroupReorderRef.current = { at: now, targetId };
    setGroupDragState({ ...current, overId: targetId, hasMoved: true });
  };

  const handleGroupDrop = (event, targetId) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      setGroupDragState(null);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (groupDragStateRef.current?.hasMoved) {
      persistSettings({}, { includePage: true, page: { siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    }
    lastGroupReorderRef.current = { at: 0, targetId: null };
    setGroupDragState(null);
  };

  const handleGroupDragEnd = () => {
    if (cardLockActive) {
      lastGroupReorderRef.current = { at: 0, targetId: null };
      setGroupDragState(null);
      return;
    }
    if (groupDragStateRef.current?.hasMoved) {
      persistSettings({}, { includePage: true, page: { siteGroups: latestSiteGroupsRef.current }, skipApply: true });
    }
    lastGroupReorderRef.current = { at: 0, targetId: null };
    setGroupDragState(null);
  };

  const handleDropOnFolder = (draggedId, targetGroupId) => {
    if (cardLockActive) {
      setFolderCardDropTarget(null);
      setDragState(null);
      showLockedToast();
      return;
    }
    setSites((currentSites) => {
      const { sites: nextSites, siteGroups: nextGroups } = moveSiteToGroupEnd(currentSites, latestSiteGroupsRef.current, draggedId, targetGroupId);
      setSiteGroups(nextGroups);
      latestSiteGroupsRef.current = nextGroups;
      latestSitesRef.current = nextSites;
      persistSettings({}, { includePage: true, page: { sites: nextSites, siteGroups: nextGroups }, skipApply: true });
      return nextSites;
    });
    setFolderCardDropTarget(null);
    setDragState(null);
    setToast("已移入文件夹");
    unwrapSingleSiteFolders();
  };

  const unwrapSingleSiteFolders = () => {
    setSiteGroups((currentGroups) => {
      const currentSites = latestSitesRef.current;
      const siteCountByGroup = {};
      for (const site of currentSites) {
        siteCountByGroup[site.group] = (siteCountByGroup[site.group] || 0) + 1;
      }
      const toRemove = new Set();
      const siteMoveMap = {};
      for (const group of currentGroups) {
        if (siteCountByGroup[group.id] === 1) {
          toRemove.add(group.id);
          for (const site of currentSites) {
            if (site.group === group.id) {
              siteMoveMap[site.id] = group.parentId || "ungrouped";
            }
          }
        }
      }
      if (toRemove.size === 0) return currentGroups;
      const removedIds = new Set();
      for (const id of toRemove) {
        for (const desc of collectGroupDescendants(currentGroups, id)) removedIds.add(desc);
        removedIds.add(id);
      }
      const nextGroups = currentGroups.filter((g) => !removedIds.has(g.id));
      const nextSites = currentSites.map((s) =>
        siteMoveMap[s.id] ? { ...s, group: siteMoveMap[s.id] } : removedIds.has(s.group) ? { ...s, group: "ungrouped" } : s
      );
      setSites(nextSites);
      latestSitesRef.current = nextSites;
      latestSiteGroupsRef.current = nextGroups;
      persistSettings({}, { includePage: true, page: { siteGroups: nextGroups, sites: nextSites }, skipApply: true });
      return nextGroups;
    });
  };

  const handleDragOverFolder = (groupId) => {
    if (cardLockActive) return;
    setFolderCardDropTarget(groupId);
  };

  const handleDragLeaveFolder = () => {
    setFolderCardDropTarget(null);
  };

  const [dragOutFolder, setDragOutFolder] = useState(null);

  const handleDragOutFolder = (draggedId, folderId) => {
    if (cardLockActive) {
      showLockedToast();
      return;
    }
    const group = latestSiteGroupsRef.current.find((g) => g.id === folderId);
    const targetGroup = group?.parentId || "ungrouped";
    setSites((currentSites) => {
      const { sites: nextSites, siteGroups: nextGroups } = moveSiteToGroupEnd(currentSites, latestSiteGroupsRef.current, draggedId, targetGroup);
      setSiteGroups(nextGroups);
      latestSitesRef.current = nextSites;
      latestSiteGroupsRef.current = nextGroups;
      return nextSites;
    });
    setDragState((current) => current ? { ...current, sourceGroup: targetGroup, overGroup: targetGroup } : null);
    setDragOutFolder(folderId);
    setToast("已移出文件夹");
  };

  const closeFolder = (immediate = false) => {
    if (immediate) {
      setOpenFolderId(null);
      setClosingFolderId(null);
      setFolderOrigin(null);
    } else {
      setClosingFolderId(openFolderId);
    }
  };

  const handleCloseFolderComplete = () => {
    setOpenFolderId(null);
    setClosingFolderId(null);
    setFolderOrigin(null);
  };

  const handleSidebarGroupDragOver = (event, groupId) => {
    if (cardLockActive) return;
    if (hasDragType(event, "application/x-dazyhub-site")) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      setSidebarDropTarget(groupId);
      return;
    }
    if (hasDragType(event, "application/x-dazyhub-group")) {
      handleGroupDragOver(event, groupId);
    }
  };

  const handleSidebarGroupDrop = (event, groupId) => {
    if (cardLockActive) {
      stopLockedEvent(event);
      setSidebarDropTarget(null);
      setGroupDragState(null);
      return;
    }
    if (hasDragType(event, "application/x-dazyhub-site")) {
      event.preventDefault();
      event.stopPropagation();
      const draggedId = event.dataTransfer.getData("text/plain") || dragState?.draggedId;
      if (draggedId) handleDropOnFolder(draggedId, groupId);
      setSidebarDropTarget(null);
      return;
    }
    handleGroupDrop(event, groupId);
  };

  const handleSidebarDragLeave = () => {
    setSidebarDropTarget(null);
  };

  const isDraggingSite = Boolean(dragState?.draggedId);
  const isAdminMode = currentPage === "admin" && currentUser?.role === "admin";

  return (
    <div className={`app ${isDraggingSite ? "is-site-dragging" : ""} ${cardLockActive ? "is-card-locked" : ""}`} data-theme={theme}>
      {toast && (
        <div className="success-toast">
          <div className="toast-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 12 9 17 20 6" />
            </svg>
          </div>
          <span className="toast-label">{toast}</span>
        </div>
      )}
      <>
          <aside className="sidebar">
            <button
              className={`profile-rail ${currentUser ? "is-signed-in" : ""}`}
              type="button"
              onClick={() => {
                if (!currentUser) window.location.href = "http://localhost:8080/api/auth/login";
              }}
            >
              <span className="profile-rail-glow" aria-hidden="true" />
              <span className="brand-avatar">
                {currentUser ? <Avatar user={currentUser} size="brand" /> : <span className="brand-mark guest"><img src="/wenhao.jpeg" alt="" /></span>}
              </span>
              <span className="brand-name">
                <strong>{currentUser ? currentUser.displayName : "登录"}</strong>
                <span>{currentUser ? currentUser.signature || (currentUser.email || "").split("@")[0] : "点击登录 DazyHub"}</span>
              </span>
            </button>
            <span className="dock-divider" aria-hidden="true" />
            {!isAdminMode && sidebarPages.bookmarks && (
              <button
                className={`sidebar-bookmark-btn ${currentPage === "bookmarks" ? "is-active" : ""}`}
                type="button"
                title="我的网站"
                aria-label="我的网站"
                onClick={() => setCurrentPage("bookmarks")}
              >
                <Bookmark size={20} />
                <span>我的网站</span>
              </button>
            )}
            <button
              className={`sidebar-authing-btn ${currentPage === "authing" ? "is-active" : ""}`}
              type="button"
              title="Authing"
              aria-label="Authing"
              onClick={() => {
                setCurrentPage("authing");
                setIsSettingsOpen(false);
              }}
            >
              <ShieldCheck size={20} />
              <span>Authing</span>
            </button>
            {!isAdminMode && currentUser && sidebarPages.todos && (
              <button
                className={`sidebar-todo-btn ${currentPage === "todos" ? "is-active" : ""}`}
                type="button"
                title="待办事项"
                aria-label="待办事项"
                onClick={() => setCurrentPage("todos")}
              >
                <ListTodo size={20} />
                <span>待办事项</span>
              </button>
            )}
            {!isAdminMode && currentUser && sidebarPages.notes && (
              <button
                className={`sidebar-notes-btn ${currentPage === "notes" ? "is-active" : ""}`}
                type="button"
                title="我的笔记"
                aria-label="我的笔记"
                onClick={() => setCurrentPage("notes")}
              >
                <FileText size={20} />
                <span>笔记</span>
              </button>
            )}
            {!isAdminMode && currentUser && sidebarPages.anniversaries && (
              <button
                className={`sidebar-anniversary-btn ${currentPage === "anniversaries" ? "is-active" : ""}`}
                type="button"
                title="纪念日"
                aria-label="纪念日"
                onClick={() => setCurrentPage("anniversaries")}
              >
                <CalendarHeart size={20} />
                <span>纪念日</span>
              </button>
            )}
            {!isAdminMode && currentUser && sidebarPages.countdowns && (
              <button
                className={`sidebar-countdown-btn ${currentPage === "countdowns" ? "is-active" : ""}`}
                type="button"
                title="倒数日"
                aria-label="倒数日"
                onClick={() => setCurrentPage("countdowns")}
              >
                <Timer size={20} />
                <span>倒数日</span>
              </button>
            )}
            {!isAdminMode && currentUser && sidebarPages.weather && (
              <button
                className={`sidebar-weather-btn ${currentPage === "weather" ? "is-active" : ""}`}
                type="button"
                title="天气"
                aria-label="天气"
                onClick={() => setCurrentPage("weather")}
              >
                <CloudSun size={20} />
                <span>天气</span>
              </button>
            )}
            {!isAdminMode && currentUser?.role === "admin" && (
              <button
                className={`sidebar-admin-btn ${currentPage === "admin" ? "is-active" : ""}`}
                type="button"
                title="管理后台"
                aria-label="管理后台"
                onClick={() => {
                  setCurrentPage("admin");
                  setAdminActiveTab((tab) => tab || "users");
                  setIsSettingsOpen(false);
                }}
              >
                <Shield size={20} />
                <span>管理后台</span>
              </button>
            )}
            {isAdminMode && (
              <>
                <button
                  className={`sidebar-admin-btn ${adminActiveTab === "users" ? "is-active" : ""}`}
                  type="button"
                  title="用户管理"
                  aria-label="用户管理"
                  onClick={() => setAdminActiveTab("users")}
                >
                  <ShieldCheck size={20} />
                  <span>用户管理</span>
                </button>
                <button
                  className={`sidebar-admin-btn ${adminActiveTab === "email" ? "is-active" : ""}`}
                  type="button"
                  title="邮件配置"
                  aria-label="邮件配置"
                  onClick={() => setAdminActiveTab("email")}
                >
                  <Mail size={20} />
                  <span>邮件配置</span>
                </button>
                <button
                  className={`sidebar-admin-btn ${adminActiveTab === "favicon" ? "is-active" : ""}`}
                  type="button"
                  title="图标缓存"
                  aria-label="图标缓存"
                  onClick={() => setAdminActiveTab("favicon")}
                >
                  <Sparkles size={20} />
                  <span>图标缓存</span>
                </button>
                <button
                  className={`sidebar-admin-btn ${adminActiveTab === "feedback" ? "is-active" : ""}`}
                  type="button"
                  title="问题反馈"
                  aria-label="问题反馈"
                  onClick={() => setAdminActiveTab("feedback")}
                >
                  <MessageSquareWarning size={20} />
                  <span>问题反馈</span>
                </button>
              </>
            )}
            <div className="sidebar-footer">
              <button
                className="sidebar-add-btn"
                type="button"
                title="添加网站"
                aria-label="添加网站"
                onClick={() => {
                  if (cardLockActive) {
                    showLockedToast();
                    return;
                  }
                  setCurrentPage("bookmarks");
                  setAddSiteGroup("ungrouped");
                }}
              >
                <Plus size={22} />
              </button>
              {isAdminMode && (
                <button
                  className="sidebar-bookmark-btn"
                  type="button"
                  title="返回主页"
                  aria-label="返回主页"
                  onClick={() => setCurrentPage("bookmarks")}
                >
                  <Bookmark size={20} />
                  <span>返回主页</span>
                </button>
              )}
              {currentPage === "bookmarks" && (
                <button
                  className={`sidebar-lock-btn ${cardsLocked ? "is-active" : ""}`}
                  type="button"
                  title={cardsLocked ? "解锁卡片" : "锁定卡片"}
                  aria-label={cardsLocked ? "解锁卡片" : "锁定卡片"}
                  aria-pressed={cardsLocked}
                  onClick={toggleCardsLocked}
                >
                  {cardsLocked ? <Lock size={20} /> : <LockOpen size={20} />}
                  <span>{cardsLocked ? "解锁" : "锁定"}</span>
                </button>
              )}
              <button
                className={`sidebar-settings-btn ${isSettingsOpen ? "is-active" : ""}`}
                type="button"
                title="设置"
                aria-label="设置"
                onClick={() => {
                  setIsSettingsOpen((open) => !open);
                }}
              >
                <Settings size={20} />
                <span>设置</span>
              </button>
            </div>
          </aside>

          <main className="main">
            <div className="search-logo" aria-label="DazyHub">
              <img className="search-logo-mascot" src="/dazyhub-bear-clean.svg" alt="" aria-hidden="true" />
              <img className="search-logo-wordmark" src="/dazyhub-header-logo.png" alt="DazyHub" />
            </div>
            {currentPage === "todos" ? (
              <TodoPage
                todos={todos}
                setTodos={setTodos}
                todoFilter={todoFilter}
                setTodoFilter={setTodoFilter}
                persistSettings={persistSettings}
              />
            ) : currentPage === "notes" ? (
              <NotesPage
                notes={notes}
                setNotes={setNotes}
                persistSettings={persistSettings}
              />
            ) : currentPage === "anniversaries" ? (
              <AnniversaryPage
                anniversaries={anniversaries}
                setAnniversaries={setAnniversaries}
                persistSettings={persistSettings}
              />
            ) : currentPage === "countdowns" ? (
              <CountdownPage
                countdowns={countdowns}
                setCountdowns={setCountdowns}
                persistSettings={persistSettings}
              />
            ) : currentPage === "weather" ? (
              <WeatherPage currentUser={currentUser} persistSettings={persistSettings} />
            ) : currentPage === "admin" && currentUser?.role === "admin" ? (
              <AdminPage
                currentUser={currentUser}
                activeTab={adminActiveTab}
                onCurrentUserChange={setCurrentUser}
                onClose={() => setCurrentPage("bookmarks")}
                onSuccess={setToast}
              />
            ) : (
            <>
            <header className="topbar">
              <form className="search" onSubmit={handleSearchSubmit}>
            <div
              className="search-engine-picker"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsSearchEngineOpen(false);
                }
              }}
            >
              <button
                className={`search-engine-trigger ${isSearchEngineOpen ? "is-active" : ""}`}
                type="button"
                aria-label={`当前搜索引擎：${selectedSearchEngine.name}`}
                aria-expanded={isSearchEngineOpen}
                onClick={() => setIsSearchEngineOpen((open) => !open)}
              >
                <img src={selectedSearchEngine.iconUrl} alt="" aria-hidden="true" />
                <ChevronDown />
              </button>
              {isSearchEngineOpen && (
                <div className="search-engine-menu" role="listbox" aria-label="搜索引擎">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.id}
                      className={`search-engine-menu-item ${searchEngineId === engine.id ? "is-active" : ""}`}
                      type="button"
                      role="option"
                      aria-selected={searchEngineId === engine.id}
                      aria-label={engine.name}
                      title={engine.name}
                      onClick={() => {
                        handleSearchEngineChange(engine.id);
                        setIsSearchEngineOpen(false);
                      }}
                    >
                      <img src={engine.iconUrl} alt="" aria-hidden="true" />
                      <span>{engine.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="输入搜索内容"
            />
            <button className="search-submit" type="submit">
              <Search />
              <span>搜索</span>
            </button>
          </form>
          <div className="toolbar" aria-label="页面工具">
            {currentPage === "bookmarks" && (
              <button
                className={`icon-button ${cardsLocked ? "is-active" : ""}`}
                type="button"
                title={cardsLocked ? "解锁卡片" : "锁定卡片"}
                aria-label={cardsLocked ? "解锁卡片" : "锁定卡片"}
                aria-pressed={cardsLocked}
                onClick={toggleCardsLocked}
              >
                {cardsLocked ? <Lock size={18} /> : <LockOpen size={18} />}
              </button>
            )}
            <button
              className={`icon-button ${isSettingsOpen ? "is-active" : ""}`}
              type="button"
              title="设置"
              aria-label="设置"
              onClick={() => setIsSettingsOpen((open) => !open)}
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div
          className="content"
          onContextMenu={(event) => {
            if (event.target.closest(".shortcut-card, .site-card, .folder-card, .context-menu, .section-title-edit, input, select, textarea, .toolbar, .settings-popover, .modal-backdrop")) return;
            event.preventDefault();
            if (cardLockActive) {
              showLockedToast();
              return;
            }
            const sectionEl = event.target.closest("[data-section-id]");
            const groupId = sectionEl?.dataset?.sectionId || "ungrouped";
            setIsSettingsOpen(false);
            setContentContextMenu({ ...menuPosition(event.clientX, event.clientY), type: "content", groupId });
          }}
        >
          {filteredSections.map((section) => {
              const childFolders = siteGroups.filter((g) => g.parentId === section.id);
              return (
                <SiteSection
                  key={section.id}
                  section={section}
                  tagSize={tagSize}
                  linkTarget={linkTarget}
                  dragState={dragState}
                  groupDragState={groupDragState}
                  childFolders={childFolders}
                  allSites={sites}
                  siteGroupOrder={siteGroups.map((g) => g.id)}
                  folderCardDropTarget={folderCardDropTarget}
                  mergeTargetId={mergeTargetId}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  onGroupDragStart={handleGroupDragStart}
                  onGroupDragOver={handleGroupDragOver}
                  onGroupDrop={handleGroupDrop}
                  onGroupDragEnd={handleGroupDragEnd}
                  onRenameGroup={handleRenameGroup}
                  onEditSite={handleEditSite}
                  onDeleteSite={(site) => requestDeleteSite(site.id, site.name)}
                  onFolderClick={(groupId, rect) => { setFolderOrigin(rect); setOpenFolderId(groupId); }}
                  onFolderContextMenu={(event, groupId) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (cardLockActive) {
                      showLockedToast();
                      return;
                    }
                    setIsSettingsOpen(false);
                    setContentContextMenu({ ...menuPosition(event.clientX, event.clientY), type: "folder", groupId });
                  }}
                  onDragOverFolder={handleDragOverFolder}
                  onDropOnFolder={handleDropOnFolder}
                  onFolderDragStart={handleFolderDragStart}
                  onFolderDragOver={handleFolderDragOver}
                  onFolderDropOnItem={handleFolderDropOnItem}
                  onFolderDragEnd={handleFolderDragEnd}
                  onDragLeaveFolder={handleDragLeaveFolder}
                  locked={cardLockActive}
                  onLockedAction={showLockedToast}
                />
              );
            })}
        </div>
            </>
            )}
          </main>
        </>
      {authMode && (
        <AuthDialog
          mode={authMode}
          loading={authLoading}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
          onSubmit={async (payload) => {
            setAuthLoading(true);
            try {
              const data = authMode === "login" ? await login(payload) : await register(payload);
              handleAuthSuccess(data);
            } finally {
              setAuthLoading(false);
            }
          }}
        />
      )}
      {addSiteGroup && (
        <AddSiteDialog
          groups={siteGroups}
          initialGroup={addSiteGroup}
          onClose={() => setAddSiteGroup(null)}
          onSubmit={handleAddSite}
        />
      )}
      {editingSite && (
        <SiteEditorDialog
          groups={siteGroups}
          site={editingSite}
          mode="edit"
          onClose={() => setEditingSite(null)}
          onSubmit={handleUpdateSite}
        />
      )}
      {(openFolderId || closingFolderId) && (() => {
        const displayId = openFolderId || closingFolderId;
        const openGroup = siteGroups.find((g) => g.id === displayId);
        if (!openGroup) return null;
        return (
          <FolderPopup
            group={openGroup}
            sites={sites}
            tagSize={tagSize}
            linkTarget={linkTarget}
            origin={folderOrigin}
            onClose={() => closeFolder()}
            onCloseComplete={handleCloseFolderComplete}
            onEditSite={handleEditSite}
            onDeleteSite={(site) => requestDeleteSite(site.id, site.name)}
            onDissolve={() => { handleDissolveGroup(displayId); closeFolder(true); }}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onDragOut={handleDragOutFolder}
            dragState={dragState}
            isDragOut={dragOutFolder === displayId}
            isClosing={closingFolderId === displayId}
            locked={cardLockActive}
            onLockedAction={showLockedToast}
          />
        );
      })()}
      {editingGroup && (
        <GroupEditorDialog
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSubmit={handleRenameGroup}
        />
      )}
      {addingGroup && (
        <GroupEditorDialog
          group={{ id: null, name: "", color: "#4f46e5", parentId: addingGroup.parentId || null }}
          onClose={() => setAddingGroup(false)}
          onSubmit={handleAddGroup}
          isNew
          parentName={addingGroup.parentName}
        />
      )}
      {isSettingsOpen && (
        <SettingsDialog
          onClose={() => setIsSettingsOpen(false)}
          tagSize={tagSize}
          onTagSizeChange={handleTagSizeChange}
          searchEngines={searchEngines}
          searchEngineId={searchEngineId}
          onSearchEngineChange={handleSearchEngineChange}
          confirmDelete={confirmDelete}
          onConfirmDeleteChange={handleConfirmDeleteChange}
          linkTarget={linkTarget}
          onLinkTargetChange={handleLinkTargetChange}
          theme={theme}
          onThemeChange={handleThemeChange}
          sidebarPages={sidebarPages}
          onSidebarPagesChange={handleSidebarPagesChange}
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          onSuccess={setToast}
          onLogout={handleLogout}
        />
      )}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {contentContextMenu && (
        contentContextMenu.type === "folder" ? (
          <FolderContextMenu
            x={contentContextMenu.x}
            y={contentContextMenu.y}
            group={siteGroups.find((group) => group.id === contentContextMenu.groupId) || { id: contentContextMenu.groupId, name: contentContextMenu.groupId === "all" ? "全部" : "未分组" }}
            onAddSite={() => {
              setAddSiteGroup(contentContextMenu.groupId === "all" ? "ungrouped" : contentContextMenu.groupId);
              setContentContextMenu(null);
            }}
            onAddChild={() => {
              const group = siteGroups.find((currentGroup) => currentGroup.id === contentContextMenu.groupId);
              if (group) handleAddChildGroup(group);
              setContentContextMenu(null);
            }}
            onRename={() => {
              const group = siteGroups.find((currentGroup) => currentGroup.id === contentContextMenu.groupId);
              if (group) handleEditGroup(group);
              setContentContextMenu(null);
            }}
            onDelete={() => {
              handleDissolveGroup(contentContextMenu.groupId);
              setContentContextMenu(null);
            }}
          />
        ) : (
          <ContentContextMenu
            x={contentContextMenu.x}
            y={contentContextMenu.y}
            groupName={
              contentContextMenu.groupId === "ungrouped"
                ? siteGroups.find((g) => g.id === "ungrouped")?.name || "未分组"
                : siteGroups.find((group) => group.id === contentContextMenu.groupId)?.name || "当前分组"
            }
            onAddSite={() => {
              setAddSiteGroup(contentContextMenu.groupId);
              setContentContextMenu(null);
            }}
            onAddGroup={() => {
              setAddingGroup({ parentId: contentContextMenu.groupId === "ungrouped" ? null : contentContextMenu.groupId, parentName: contentContextMenu.groupId === "ungrouped" ? "" : siteGroups.find((group) => group.id === contentContextMenu.groupId)?.name || "" });
              setContentContextMenu(null);
            }}
          />
        )
      )}
    </div>
  );
}

function Avatar({ user, size = "normal" }) {
  if (user.avatarUrl) {
    return <img className={`avatar avatar-image ${size}`} src={user.avatarUrl} alt={`${user.displayName} 头像`} />;
  }

  return (
    <span className={`avatar fallback ${size}`} aria-hidden="true">
      {(user.displayName || (user.email || "").split("@")[0] || "D").slice(0, 1).toUpperCase()}
    </span>
  );
}

function SettingsDialog({
  onClose,
  tagSize,
  onTagSizeChange,
  searchEngines,
  searchEngineId,
  onSearchEngineChange,
  confirmDelete,
  onConfirmDeleteChange,
  linkTarget,
  onLinkTargetChange,
  theme,
  onThemeChange,
  sidebarPages,
  onSidebarPagesChange,
  currentUser,
  onUserChange,
  onSuccess,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState(currentUser ? "account" : "basic");
  const accountInitial = currentUser
    ? (currentUser.displayName || (currentUser.email || "").split("@")[0] || "D").slice(0, 1).toUpperCase()
    : "D";

  const tabs = [
    ...(currentUser ? [{ id: "account", label: "账户设置", icon: User }] : []),
    { id: "basic", label: "基本设置", icon: Settings },
    { id: "theme", label: "主题设置", icon: Palette },
    ...(currentUser ? [{ id: "sidebar", label: "侧边栏设置", icon: Menu }] : []),
    ...(currentUser ? [{ id: "password", label: "修改密码", icon: KeyRound }] : []),
    ...(currentUser ? [{ id: "feedback", label: "问题反馈", icon: MessageSquareWarning }] : []),
  ];

  const themes = [
    { id: "light", label: "浅色", icon: Sun },
    { id: "glass", label: "液态玻璃", icon: Sparkles },
  ];

  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="settings-popover" role="dialog" aria-modal="true" aria-label="设置" onMouseDown={(event) => event.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-header-title">
            <span className="settings-header-icon">
              <Settings size={18} />
            </span>
            <div>
              <strong>设置</strong>
            </div>
          </div>
          <button className="icon-button" type="button" aria-label="关闭设置" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="settings-body">
          <aside className="settings-sidebar">
            {currentUser && (
              <div className="settings-account-card">
                <Avatar user={currentUser} />
                <div>
                  <strong>{currentUser.displayName || accountInitial}</strong>
                  <span>{currentUser.email}</span>
                </div>
              </div>
            )}
            <div className="settings-tabs" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`settings-tab ${activeTab === tab.id ? "is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={15} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            {currentUser && (
              <button className="settings-logout" type="button" onClick={onLogout}>
                <LogOut size={15} />
                <span>登出</span>
              </button>
            )}
          </aside>

          <div className="settings-content">
            {activeTab === "basic" && (
              <div className="settings-panel" role="tabpanel">
                <div className="settings-section">
                  <div className="settings-section-heading">
                    <p className="settings-section-label">偏好</p>
                  </div>
                  <div className="setting-row">
                    <div className="setting-row-label">
                      <Type size={15} />
                      <div>
                        <span>卡片样式</span>
                        <small>紧凑模式或详细模式</small>
                      </div>
                    </div>
                    <SettingSelect
                      value={tagSize}
                      options={[
                        { value: "short", label: "紧凑" },
                        { value: "long", label: "详细" },
                      ]}
                      onChange={onTagSizeChange}
                      ariaLabel="卡片样式"
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-row-label">
                      <Search size={15} />
                      <div>
                        <span>搜索引擎</span>
                        <small>选择顶部搜索框默认使用的服务</small>
                      </div>
                    </div>
                    <div className="engine-options" role="radiogroup" aria-label="搜索引擎">
                      {searchEngines.map((engine) => (
                        <button
                          key={engine.id}
                          className={`engine-option ${searchEngineId === engine.id ? "is-active" : ""}`}
                          type="button"
                          role="radio"
                          aria-checked={searchEngineId === engine.id}
                          aria-label={engine.name}
                          title={engine.name}
                          onClick={() => onSearchEngineChange(engine.id)}
                        >
                          <img src={engine.iconUrl} alt="" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="setting-row">
                    <div className="setting-row-label">
                      <Shield size={15} />
                      <div>
                        <span>删除确认</span>
                        <small>删除站点或分组前弹出二次确认</small>
                      </div>
                    </div>
                    <button
                      className={`toggle-btn ${confirmDelete ? "is-active" : ""}`}
                      type="button"
                      role="switch"
                      aria-checked={confirmDelete}
                      onClick={() => onConfirmDeleteChange(!confirmDelete)}
                    >
                      <span className="toggle-track" />
                    </button>
                  </div>
                  <div className="setting-row">
                    <div className="setting-row-label">
                      <ExternalLink size={15} />
                      <div>
                        <span>打开方式</span>
                        <small>点击卡片时在新标签页或当前页打开</small>
                      </div>
                    </div>
                    <SettingSelect
                      value={linkTarget}
                      options={[
                        { value: "_self", label: "当前页" },
                        { value: "_blank", label: "新标签页" },
                      ]}
                      onChange={onLinkTargetChange}
                      ariaLabel="打开方式"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="settings-panel" role="tabpanel">
                <div className="settings-section">
                  <div className="settings-section-heading">
                    <p className="settings-section-label">外观</p>
                  </div>
                  <div className="theme-mode-grid">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        className={`theme-mode-card ${theme === t.id ? "is-active" : ""}`}
                        type="button"
                        onClick={() => onThemeChange(t.id)}
                      >
                        <div className={`theme-mode-preview ${t.id}`}>
                          <div className="tmp-sidebar" />
                          <div className="tmp-content">
                            <div className="tmp-bar" />
                            <div className="tmp-cards">
                              <div className="tmp-card" />
                              <div className="tmp-card" />
                            </div>
                          </div>
                        </div>
                        <div className="theme-mode-label">
                          <t.icon size={14} />
                          <span>{t.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === "sidebar" && (
              <div className="settings-panel" role="tabpanel">
                <div className="settings-section">
                  <div className="settings-section-heading">
                    <p className="settings-section-label">显示页面</p>
                    <span>选择侧边栏中显示哪些页面</span>
                  </div>
                  {[
                    { key: "bookmarks", label: "我的网站", icon: Bookmark },
                    { key: "todos", label: "待办事项", icon: ListTodo },
                    { key: "notes", label: "笔记", icon: FileText },
                    { key: "anniversaries", label: "纪念日", icon: CalendarHeart },
                    { key: "countdowns", label: "倒数日", icon: Timer },
                    { key: "weather", label: "天气", icon: CloudSun },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="setting-row">
                      <div className="setting-row-label">
                        <Icon size={15} />
                        <div>
                          <span>{label}</span>
                        </div>
                      </div>
                      <button
                        className={`toggle-btn ${sidebarPages[key] ? "is-active" : ""}`}
                        type="button"
                        role="switch"
                        aria-checked={sidebarPages[key]}
                        onClick={() => onSidebarPagesChange({ ...sidebarPages, [key]: !sidebarPages[key] })}
                      >
                        <span className="toggle-track" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "account" && currentUser && (
              <AccountPanel
                user={currentUser}
                onUserChange={onUserChange}
                onSuccess={onSuccess}
              />
            )}

            {activeTab === "password" && currentUser && (
              <PasswordPanel onSuccess={onSuccess} />
            )}

            {activeTab === "feedback" && currentUser && (
              <FeedbackPanel onSuccess={onSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountPanel({ user, onUserChange, onSuccess }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [signature, setSignature] = useState(user.signature || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cropFile, setCropFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    event.target.value = "";
  };

  const handleCropConfirm = async (blob) => {
    setCropFile(null);
    setError("");
    setLoading(true);
    try {
      const result = await uploadAvatar(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      onUserChange({ ...user, displayName, signature, avatarUrl: result.avatarUrl });
      onSuccess("头像已更新");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const updated = await updateProfile({ displayName, signature });
      onUserChange(updated);
      onSuccess("资料已保存");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-panel" role="tabpanel">
      <form className="settings-section" onSubmit={handleSave}>
        <div className="settings-section-heading">
          <p className="settings-section-label">个人资料</p>
        </div>
        <div className="account-avatar-row">
          <div className="avatar-clickable" onClick={handleAvatarClick} title="点击上传头像" style={{ borderRadius: "50%", overflow: "hidden", display: "inline-block", cursor: "pointer", position: "relative" }}>
            <Avatar user={{ ...user, displayName, signature }} size="account" />
            <span className="avatar-overlay"><Camera /></span>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} hidden />
        </div>
        <label className="field">
          <span>邮箱</span>
          <input value={user.email} disabled />
        </label>
        <label className="field">
          <span>昵称</span>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required maxLength={80} />
        </label>
        <label className="field">
          <span>个性签名</span>
          <input value={signature} onChange={(event) => setSignature(event.target.value)} maxLength={120} placeholder="显示在昵称下方" />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="pw-panel-submit" type="submit" disabled={loading}>
          {loading ? (
            <span className="pw-submit-loading">保存中...</span>
          ) : (
            <>
              <Save size={18} />
              <span>保存资料</span>
            </>
          )}
        </button>
      </form>

      {cropFile && <CropDialog file={cropFile} onClose={() => setCropFile(null)} onConfirm={handleCropConfirm} />}
    </div>
  );
}

function PasswordPanel({ onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = (() => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 6) s++;
    if (newPassword.length >= 10) s++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) s++;
    if (/\d/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return Math.min(s, 4);
  })();

  const strengthLabel = ["", "弱", "一般", "强", "非常强"][strength];
  const strengthColor = ["", "#dc2626", "#d97706", "#059669", "#047857"][strength];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("新密码长度至少6位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      onSuccess("密码已更新");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-panel" role="tabpanel">
      <form className="pw-panel-form" onSubmit={handleSubmit}>

        <div className="pw-panel-body">
          <div className="pw-panel-section">
            <p className="pw-panel-section-label">验证当前密码</p>
            <label className="pw-input-group">
              <Lock size={16} className="pw-input-icon" />
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                minLength={6}
                placeholder="输入当前密码"
                className="pw-panel-input"
              />
            </label>
          </div>

          <div className="pw-panel-divider">
            <span>设置新密码</span>
          </div>

          <div className="pw-panel-section">
            <label className="pw-input-group">
              <KeyRound size={16} className="pw-input-icon" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                maxLength={120}
                placeholder="新密码（至少6位）"
                className="pw-panel-input"
              />
            </label>
            {newPassword && (
              <div className="pw-strength">
                <div className="pw-strength-bar">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`pw-strength-segment ${i <= strength ? "active" : ""}`} style={i <= strength ? { background: strengthColor } : undefined} />
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="pw-panel-section">
            <label className="pw-input-group">
              <KeyRound size={16} className="pw-input-icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                maxLength={120}
                placeholder="确认新密码"
                className="pw-panel-input"
              />
            </label>
            {confirmPassword && newPassword === confirmPassword && (
              <span className="pw-match-ok"><Check size={14} /> 密码匹配</span>
            )}
            {confirmPassword && newPassword !== confirmPassword && (
              <span className="pw-match-err"><X size={14} /> 两次输入的密码不符</span>
            )}
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        <button className="pw-panel-submit" type="submit" disabled={loading}>
          {loading ? (
            <span className="pw-submit-loading">保存中...</span>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>确认修改</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function FeedbackPanel({ onSuccess }) {
  const [type, setType] = useState("bug");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchMyFeedbacks()
      .then(setMyFeedbacks)
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  const uploadFile = async (file) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("图片大小不能超过 5MB");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const result = await uploadFeedbackAttachment(file);
      setAttachments((prev) => [...prev, result.url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) uploadFile(file);
        return;
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("请输入反馈内容");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitFeedback({ type, content: content.trim(), attachments });
      setContent("");
      setAttachments([]);
      onSuccess("反馈已提交，感谢你的反馈！");
      fetchMyFeedbacks().then(setMyFeedbacks).catch(() => {});
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "bug", label: "问题", description: "异常、报错、不可用" },
    { value: "feature", label: "建议", description: "想要的新能力" },
    { value: "other", label: "其他", description: "体验、内容或想法" },
  ];

  return (
    <div className="settings-panel" role="tabpanel">
      <div className="settings-section">
        <div className="settings-section-heading">
          <p className="settings-section-label">问题反馈</p>
          <p className="settings-section-desc">遇到问题或有好的建议？请在这里告诉我们</p>
        </div>

        <form className="feedback-settings-form" onSubmit={handleSubmit}>
          <div className="feedback-type-picker settings-feedback-type-picker" role="radiogroup" aria-label="反馈类型">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={type === option.value}
                className={type === option.value ? "is-active" : ""}
                onClick={() => setType(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>

          <label className="field">
            <span>内容</span>
            <textarea
              rows={5}
              maxLength={1000}
              placeholder="例如：哪个页面、发生了什么、你期待它怎样工作。支持粘贴截图。"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
            />
          </label>

          {attachments.length > 0 && (
            <div className="feedback-attachments">
              {attachments.map((url, i) => (
                <div className="feedback-attachment-thumb" key={i} onClick={() => setPreviewUrl(url)} role="button" tabIndex={0}>
                  <img src={url} alt={`附件 ${i + 1}`} />
                  <button type="button" className="feedback-attachment-remove" onClick={(e) => { e.stopPropagation(); removeAttachment(i); }} aria-label="移除附件">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="feedback-settings-actions">
            <span className="feedback-char-count">{content.length}/1000</span>
            <button type="button" className="feedback-attachment-add settings-attachment-add" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Paperclip size={14} />
              <span>{uploading ? "上传中..." : "添加图片"}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={handleFileSelect} />
          </div>

          {error && <div className="form-error">{error}</div>}
          <button className="action-button wide" type="submit" disabled={submitting || uploading}>
            <Send />
            <span>{submitting ? "提交中..." : "提交反馈"}</span>
          </button>
        </form>
      </div>

      <div className="settings-section">
        <div className="settings-section-heading">
          <p className="settings-section-label">我的反馈</p>
        </div>
        {historyLoading ? (
          <p className="admin-loading">加载中...</p>
        ) : myFeedbacks.length === 0 ? (
          <p className="feedback-empty-hint">暂无反馈记录</p>
        ) : (
          <div className="feedback-history">
            {myFeedbacks.map((fb) => {
              const typeLabel = ({ bug: "问题", feature: "建议", other: "其他" })[fb.type] || fb.type;
              const statusLabel = ({ pending: "待处理", replied: "已回复", closed: "已关闭" })[fb.status] || fb.status;
              const atts = (() => { try { return fb.attachments ? JSON.parse(fb.attachments) : []; } catch { return []; } })();
              return (
                <div className="feedback-history-card" key={fb.id}>
                  <div className="feedback-history-header">
                    <span className="feedback-type-tag">{typeLabel}</span>
                    <span className={`feedback-status-badge status-${fb.status}`}>{statusLabel}</span>
                    <span className="feedback-history-time">{new Date(fb.createdAt).toLocaleString("zh-CN")}</span>
                  </div>
                  <p className="feedback-history-content">{fb.content}</p>
                  {atts.length > 0 && (
                    <div className="feedback-attachments feedback-history-attachments">
                      {atts.map((url, i) => (
                        <div className="feedback-attachment-thumb" key={i} onClick={() => setPreviewUrl(url)} role="button" tabIndex={0}>
                          <img src={url} alt={`附件 ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                  {fb.adminReply && (
                    <div className="feedback-reply">
                      <strong>管理员回复</strong>
                      <p>{fb.adminReply}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="image-preview-overlay" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="预览" />
          <button className="image-preview-close" type="button" aria-label="关闭预览" onClick={() => setPreviewUrl(null)}>
            <X size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

function SettingSelect({ value, options, onChange, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const chooseOption = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className={`setting-select ${isOpen ? "is-open" : ""}`} ref={wrapperRef}>
      <button
        className="setting-select-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown />
      </button>
      {isOpen && (
        <div className="setting-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`setting-select-option ${option.value === value ? "is-selected" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => chooseOption(option.value)}
            >
              <span className="setting-select-check">{option.value === value ? "✓" : ""}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentContextMenu({ x, y, groupName, onAddSite, onAddGroup }) {
  const stopMenuEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="context-menu content-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="内容操作"
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={stopMenuEvent}
    >
      <div className="context-menu-label">{groupName}</div>
      <button type="button" role="menuitem" onClick={onAddSite}>
        <Plus />
        <span>新增标签</span>
      </button>
      <button type="button" role="menuitem" onClick={onAddGroup}>
        <FolderPlus />
        <span>添加文件夹</span>
      </button>
    </div>
  );
}

function FolderContextMenu({ x, y, group, onAddSite, onAddChild, onRename, onDelete }) {
  const stopMenuEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const [showNewMenu, setShowNewMenu] = useState(false);
  const isAllGroup = group?.id === "all";

  return (
    <div
      className="context-menu folder-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="文件夹操作"
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={stopMenuEvent}
    >
      <div
        className="context-menu-item-with-submenu"
        onMouseEnter={() => setShowNewMenu(true)}
        onMouseLeave={() => setShowNewMenu(false)}
      >
        <button
          type="button"
          role="menuitem"
          className="has-submenu"
        >
          <Plus />
          <span>新建</span>
          <ChevronRight className="submenu-arrow" />
        </button>
        {showNewMenu && (
          <div className="context-menu submenu">
            <button type="button" role="menuitem" onClick={onAddSite}>
              <Plus />
              <span>标签</span>
            </button>
            <button type="button" role="menuitem" onClick={onAddChild}>
              <FolderPlus />
              <span>文件夹</span>
            </button>
          </div>
        )}
      </div>
      <button type="button" role="menuitem" onClick={onRename}>
        <Pencil />
        <span>编辑</span>
      </button>
      <button
        className={`danger ${isAllGroup ? "muted" : ""}`}
        type="button"
        role="menuitem"
        onClick={onDelete}
      >
        <FolderOpen />
        <span>解散</span>
      </button>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop confirm-backdrop" role="presentation">
      <div className="modal confirm-modal">
        <div className="confirm-content">
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          <button className="action-button" type="button" onClick={onCancel}>
            取消
          </button>
          <button className="action-button danger" type="button" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

function SiteIcon({ site }) {
  const sources = useMemo(() => faviconSources(site.url, site.iconUrl), [site.iconUrl, site.url]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
  }, [sources]);

  if (failed) {
    return (
      <span className="site-icon site-icon-fallback" aria-label={`${site.name} 图标`}>
        <FileText />
      </span>
    );
  }

  return (
    <img
      className="site-icon"
      src={sources[sourceIndex]}
      alt={`${site.name} 图标`}
      loading="lazy"
      decoding="async"
      onError={() => {
        setSourceIndex((index) => {
          if (index < sources.length - 1) return index + 1;
          setFailed(true);
          return index;
        });
      }}
    />
  );
}

function AuthDialog({ mode, loading, onModeChange, onClose, onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", displayName: "", code: "" });
  const [error, setError] = useState("");
  const [codeCooldown, setCodeCooldown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const isRegister = mode === "register";

  useEffect(() => {
    if (codeCooldown <= 0) return;
    const timer = setTimeout(() => setCodeCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [codeCooldown]);

  const handleSendCode = async () => {
    if (codeCooldown > 0 || sendingCode) return;
    setError("");
    setSendingCode(true);
    try {
      await sendCode(form.email.trim().toLowerCase());
      setCodeCooldown(60);
    } catch (e) {
      setError(e.message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (isRegister && !form.code) {
      setError("请输入验证码");
      return;
    }
    try {
      await onSubmit(form);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal auth-modal" onSubmit={handleSubmit} autoComplete="off">
        <input type="email" autoComplete="email" style={{display:"none"}} tabIndex={-1} readOnly />
        <input type="password" autoComplete="current-password" style={{display:"none"}} tabIndex={-1} readOnly />
        <div className="modal-header">
          <div>
            <p className="eyebrow">DazyHub Account</p>
            <h2>{isRegister ? "注册账号" : "登录账号"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div className="segmented">
          <button className={!isRegister ? "is-active" : ""} type="button" onClick={() => onModeChange("login")}>登录</button>
          <button className={isRegister ? "is-active" : ""} type="button" onClick={() => onModeChange("register")}>注册</button>
        </div>

        <label className="field">
          <span>邮箱</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            type="email"
            autoFocus
            required
            maxLength={128}
            placeholder="请输入邮箱"
          />
        </label>
        {isRegister && (
          <label className="field">
            <span>昵称</span>
            <input
              value={form.displayName}
              onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              maxLength={80}
              placeholder="请输入昵称"
            />
          </label>
        )}
        <label className="field">
          <span>密码</span>
          <input
            value={form.password}
            autoComplete={isRegister ? "new-password" : "current-password"}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            type="password"
            required
            minLength={6}
            maxLength={120}
            placeholder="请输入密码"
          />
        </label>
        {isRegister && (
          <>
            <label className="field">
              <span>确认密码</span>
              <input
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                maxLength={120}
                placeholder="请再次输入密码"
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <span className="field-hint">两次输入的密码不符</span>
              )}
            </label>
            <label className="field">
              <span>验证码</span>
              <div className="code-row">
                <input
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value })}
                  required
                  maxLength={6}
                  placeholder="请输入验证码"
                />
                <button
                  type="button"
                  className="send-code-button"
                  disabled={codeCooldown > 0 || sendingCode}
                  onClick={handleSendCode}
                >
                  {sendingCode ? "发送中..." : codeCooldown > 0 ? `${codeCooldown}s` : "发送验证码"}
                </button>
              </div>
            </label>
          </>
        )}

        {!isRegister && (
          <button type="button" className="forgot-password" onClick={() => setError("请联系管理员重置密码")}>
            忘记密码？
          </button>
        )}
        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit" disabled={loading}>
          <LogIn />
          <span>{loading ? "处理中..." : isRegister ? "注册并登录" : "登录"}</span>
        </button>
      </form>
    </div>
  );
}

function CropDialog({ file, onClose, onConfirm }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const baseRef = useRef({ w: 0, h: 0, scale: 1 });
  const viewportSize = 240;

  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const displayW = baseRef.current.w * zoom;
  const displayH = baseRef.current.h * zoom;
  const maxOffsetX = Math.max(0, displayW - viewportSize);
  const maxOffsetY = Math.max(0, displayH - viewportSize);

  const clampOffset = (ox, oy) => ({
    x: Math.max(-maxOffsetX, Math.min(0, ox)),
    y: Math.max(-maxOffsetY, Math.min(0, oy)),
  });

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    lastPosRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    const dx = event.clientX - lastPosRef.current.x;
    const dy = event.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: event.clientX, y: event.clientY };
    setOffset((prev) => clampOffset(prev.x + dx, prev.y + dy));
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleImageLoad = (event) => {
    const img = event.target;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const baseScale = Math.max(viewportSize / naturalW, viewportSize / naturalH);
    const dw = naturalW * baseScale;
    const dh = naturalH * baseScale;

    baseRef.current = { w: dw, h: dh, scale: baseScale };
    setZoom(1);
    setOffset({ x: (dw - viewportSize) / -2, y: (dh - viewportSize) / -2 });
    setImageLoaded(true);
  };

  const handleZoomChange = (nextZoom) => {
    const prevCenterX = Math.abs(offset.x) + viewportSize / 2;
    const prevCenterY = Math.abs(offset.y) + viewportSize / 2;
    const ratio = nextZoom / zoom;
    const newCenterX = prevCenterX * ratio;
    const newCenterY = prevCenterY * ratio;
    setZoom(nextZoom);
    setOffset(clampOffset(-(newCenterX - viewportSize / 2), -(newCenterY - viewportSize / 2)));
  };

  const handleConfirm = () => {
    setLoading(true);
    const canvas = document.createElement("canvas");
    canvas.width = viewportSize;
    canvas.height = viewportSize;
    const ctx = canvas.getContext("2d");

    const effectiveScale = baseRef.current.scale * zoom;

    ctx.beginPath();
    ctx.arc(viewportSize / 2, viewportSize / 2, viewportSize / 2, 0, Math.PI * 2);
    ctx.clip();

    const sx = Math.abs(offset.x) / effectiveScale;
    const sy = Math.abs(offset.y) / effectiveScale;
    const sw = viewportSize / effectiveScale;
    const sh = viewportSize / effectiveScale;

    ctx.drawImage(imageRef.current, sx, sy, sw, sh, 0, 0, viewportSize, viewportSize);

    canvas.toBlob(
      (blob) => {
        setLoading(false);
        if (blob) onConfirm(blob);
      },
      "image/jpeg",
      0.92,
    );
  };

  return (
    <div className="modal-backdrop crop-backdrop" role="presentation" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="crop-dialog">
        <div className="crop-header">
          <h3>裁剪头像</h3>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div
          className="crop-viewport"
          style={{ width: viewportSize, height: viewportSize }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <img
            ref={imageRef}
            className="crop-image"
            src={objectUrl}
            alt="裁剪预览"
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              width: displayW || "auto",
              height: displayH || "auto",
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              opacity: imageLoaded ? 1 : 0,
            }}
          />
          <div className="crop-mask" />
        </div>

        <div className="crop-zoom">
          <span>缩放</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          />
          <span>{zoom.toFixed(2)}x</span>
        </div>

        <p className="crop-hint">拖拽图片调整位置</p>

        <div className="crop-actions">
          <button className="action-button wide" type="button" onClick={onClose}>取消</button>
          <button className="action-button wide primary" type="button" disabled={loading || !imageLoaded} onClick={handleConfirm}>
            {loading ? "处理中..." : "确认"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddSiteDialog({ groups: siteGroups, initialGroup, onClose, onSubmit }) {
  return (
    <SiteEditorDialog
      groups={siteGroups}
      initialGroup={initialGroup}
      mode="add"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function SiteEditorDialog({ groups: siteGroups, initialGroup = "ungrouped", mode, site = null, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: site?.name || "",
    url: site?.url || "",
    group: site?.group || initialGroup,
    iconUrl: site?.iconUrl || "",
  });
  const [error, setError] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectedDomain, setDetectedDomain] = useState("");
  const detectSeq = useRef(0);
  const allGroups = flattenFolderTree(buildFolderTree(siteGroups));
  const detectedIcon = (detectedDomain || form.url) ? favicon(detectedDomain || form.url) : "";
  const previewIcon = form.iconUrl || detectedIcon;
  const isEdit = mode === "edit";

  const detectSite = async () => {
    const nextUrl = normalizedUrl(form.url);

    if (!nextUrl) {
      setError("请先输入网址");
      return;
    }

    try {
      const parsed = new URL(/^https?:\/\//i.test(form.url) ? form.url : `https://${nextUrl}`);
      void parsed;
    } catch {
      setError("网址格式看起来不太对");
      return;
    }

    const seq = ++detectSeq.current;
    setDetecting(true);
    setError("");

    try {
      const meta = await fetchSiteMeta(form.url);

      if (seq !== detectSeq.current) return;

      if (meta) {
        setForm((current) => ({
          ...current,
          name: current.name || meta.title || current.name,
          iconUrl: current.iconUrl || (meta.faviconUrl ? favicon(meta.faviconUrl) : current.iconUrl),
        }));
        if (meta.domain) {
          setDetectedDomain(meta.domain);
        }
      }
    } catch {
      // 回退：保留基于主机名的简单名称
    } finally {
      if (seq === detectSeq.current) {
        setDetecting(false);
      }
    }
  };

  const handleIconUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, iconUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUrl = normalizedUrl(form.url);

    if (!nextUrl) {
      setError("请输入网址");
      return;
    }

    onSubmit({
      id: site?.id,
      name: form.name.trim() || nextUrl.replace(/^www\./i, "").split(".")[0],
      url: nextUrl,
      group: form.group,
      iconUrl: form.iconUrl,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal add-site-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{isEdit ? "Edit Shortcut" : "New Shortcut"}</p>
            <h2>{isEdit ? "编辑网站" : "添加网站"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <div className="site-icon-editor">
          <div className="site-icon-preview">
            {previewIcon ? <img src={previewIcon} alt="网站图标预览" /> : <Plus />}
          </div>
          <div className="site-icon-controls">
            <span>网站图标</span>
            <label className="avatar-upload site-icon-upload">
              <Camera />
              <span>上传图标</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleIconUpload} />
            </label>
          </div>
        </div>

        <label className="field">
          <span>网址</span>
          <div className="input-with-action">
            <input
              value={form.url}
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              onBlur={detectSite}
              autoFocus
              required
              placeholder="example.com"
            />
            <button
              className={`icon-button ${detecting ? "is-loading" : ""}`}
              type="button"
              onClick={detectSite}
              disabled={detecting}
              title={detecting ? "识别中..." : "自动识别"}
              aria-label="自动识别"
            >
              {detecting ? <span className="btn-spinner" /> : <Sparkles />}
            </button>
          </div>
        </label>

        <label className="field">
          <span>网站名称</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            maxLength={80}
            placeholder="自动识别或手动输入"
          />
        </label>

        <label className="field">
          <span>分组</span>
          <SettingSelect
            value={form.group}
            ariaLabel="选择分组"
            options={allGroups.map((group) => ({
              value: group.id,
              label: `${"　".repeat(group.depth || 0)}${group.name}`,
            }))}
            onChange={(value) => setForm({ ...form, group: value })}
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit">
          {isEdit ? <Save /> : <Plus />}
          <span>{isEdit ? "保存网站" : "添加到首页"}</span>
        </button>
      </form>
    </div>
  );
}

function GroupEditorDialog({ group, onClose, onSubmit, isNew, parentName = "" }) {
  const presetColors = ["#4f46e5", "#0f766e", "#334155", "#047857", "#be123c", "#a16207"];
  const [name, setName] = useState(group.name);
  const [color, setColor] = useState(group.color || presetColors[Math.floor(Math.random() * presetColors.length)]);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      setError("请输入分组名称");
      return;
    }

    onSubmit({ id: group.id, name: nextName, color, parentId: group.parentId || null });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal group-modal" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Group</p>
            <h2>{isNew ? "添加文件夹" : "编辑文件夹"}</h2>
            {isNew && parentName && <span className="modal-subtitle">添加到 {parentName}</span>}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X />
          </button>
        </div>

        <label className="field">
          <span>分组名称</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            maxLength={24}
            required
            placeholder="请输入分组名称"
          />
        </label>

        {!isNew && (
          <>
            <label className="field">
              <span>分组颜色</span>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
                <span className="color-hex">{color}</span>
              </div>
            </label>

            <div className="color-preset-row" aria-label="常用颜色">
              {presetColors.map((preset) => (
                <button
                  key={preset}
                  className={`color-preset ${preset.toLowerCase() === color.toLowerCase() ? "is-active" : ""}`}
                  type="button"
                  aria-label={`选择颜色${preset}`}
                  style={{ background: preset }}
                  onClick={() => setColor(preset)}
                />
              ))}
            </div>
          </>
        )}

        {error && <div className="form-error">{error}</div>}

        <button className="action-button wide" type="submit">
          {isNew ? <Plus /> : <Save />}
          <span>{isNew ? "添加文件夹" : "保存文件夹"}</span>
        </button>
      </form>
    </div>
  );
}

function SiteSection({
  section,
  tagSize,
  linkTarget,
  dragState,
  groupDragState,
  childFolders,
  allSites,
  siteGroupOrder,
  folderCardDropTarget,
  mergeTargetId,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onGroupDragStart,
  onGroupDragOver,
  onGroupDrop,
  onGroupDragEnd,
  onRenameGroup,
  onEditSite,
  onDeleteSite,
  onFolderClick,
  onFolderContextMenu,
  onDragOverFolder,
  onDropOnFolder,
  onDragLeaveFolder,
  onFolderDragStart,
  onFolderDragOver,
  onFolderDropOnItem,
  onFolderDragEnd,
  locked = false,
  onLockedAction,
}) {
  const gridClass = tagSize === "short" ? "tag-grid tag-grid-short" : "tag-grid tag-grid-long";
  const [groupName, setGroupName] = useState(section.name);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);

  useEffect(() => {
    setGroupName(section.name);
    setIsEditingGroupName(false);
  }, [section.name]);

  const commitGroupName = () => {
    const nextName = groupName.trim();

    if (!nextName || nextName === section.name) {
      setGroupName(section.name);
      setIsEditingGroupName(false);
      return;
    }

    setGroupName(nextName);
    onRenameGroup({ id: section.id, name: nextName });
    setIsEditingGroupName(false);
  };

  return (
    <section
      className={`group-section ${dragState?.overGroup === section.id && !dragState.overId ? "is-drop-target" : ""} ${groupDragState?.draggedId === section.id ? "is-group-dragging" : ""} ${groupDragState?.overId === section.id ? "is-group-drop-target" : ""}`}
      data-section-id={section.id}
      data-group-section-id={section.id}
      onDragOver={(e) => {
        if (locked) return;
        if (hasDragType(e, "application/x-dazyhub-group")) {
          e.preventDefault();
          onGroupDragOver?.(e, section.id);
        } else {
          onDragOver?.(e, section.id);
        }
      }}
      onDrop={(e) => {
        if (locked) return;
        if (hasDragType(e, "application/x-dazyhub-group")) {
          e.preventDefault();
          onGroupDrop?.(e, section.id);
        } else {
          onDrop?.(e, section.id);
        }
      }}
      onDragEnd={() => onGroupDragEnd?.()}
    >
      <div className="section-heading">
        <div className="section-title-slot">
          {isEditingGroupName ? (
            <input
              className="section-title-edit"
              value={groupName}
              size={Math.max(6, groupName.length + 2)}
              aria-label={`编辑${section.name}分组名称`}
              maxLength={24}
              onChange={(event) => setGroupName(event.target.value)}
              onBlur={commitGroupName}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();
                  commitGroupName();
                }

                if (event.key === "Escape") {
                  event.stopPropagation();
                  setGroupName(section.name);
                  setIsEditingGroupName(false);
                }
              }}
              autoFocus
            />
          ) : (
            <button
              className="section-title-button"
              type="button"
              title={`编辑${section.name}分组名称`}
              aria-label={`编辑${section.name}分组名称`}
              onClick={() => {
                if (locked) {
                  onLockedAction?.();
                  return;
                }
                setIsEditingGroupName(true);
              }}
            >
              {section.name}
            </button>
          )}
        </div>
        <button
          className="section-drag-handle"
          type="button"
          draggable={!locked}
          disabled={locked}
          title="拖动排序"
          aria-label="拖动排序"
          onDragStart={(e) => { e.stopPropagation(); onGroupDragStart?.(e, section); }}
        >
          <Menu />
        </button>
      </div>
      <div className={gridClass}>
        {(() => {
          const mergedItems = [
            ...childFolders.map((f) => ({ type: "folder", data: f, order: f.order ?? 0 })),
            ...section.items.map((s) => ({ type: "site", data: s, order: s.order ?? 0 })),
          ].sort((a, b) => a.order - b.order);
          return mergedItems.map((item) =>
            item.type === "folder" ? (
              <FolderCard
                key={item.data.id}
                group={item.data}
                sites={allSites}
                tagSize={tagSize}
                isDropTarget={folderCardDropTarget === item.data.id}
                isDragging={groupDragState?.draggedId === item.data.id}
                onFolderClick={onFolderClick}
                onContextMenu={onFolderContextMenu}
                onDragOverFolder={onDragOverFolder}
                onDropOnFolder={onDropOnFolder}
                onDragLeaveFolder={onDragLeaveFolder}
                onDragStart={onFolderDragStart}
                onDragOver={(e, id, placement) => onFolderDragOver?.(e, id, true, placement)}
                onDrop={onFolderDropOnItem}
                onDragEnd={onFolderDragEnd}
                locked={locked}
                onLockedAction={onLockedAction}
              />
            ) : (
              <SiteCard
                key={item.data.id}
                site={item.data}
                tagSize={tagSize}
                linkTarget={linkTarget}
                isDragging={dragState?.draggedId === item.data.id}
                isSwapTarget={dragState?.overId === item.data.id && dragState?.draggedId !== item.data.id}
                isMergeTarget={mergeTargetId === item.data.id}
                dropPlacement={dragState?.overId === item.data.id ? dragState?.placement : null}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                onFolderDragOver={onFolderDragOver}
                onEdit={onEditSite}
                onDelete={onDeleteSite}
                locked={locked}
                onLockedAction={onLockedAction}
              />
            )
          );
        })()}
      </div>
    </section>
  );
}

function SiteCard({
  site,
  tagSize,
  linkTarget = "_blank",
  isDragging,
  isSwapTarget,
  isMergeTarget,
  dropPlacement,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onFolderDragOver,
  onEdit,
  onDelete,
  locked = false,
  onLockedAction,
}) {
  const isShort = tagSize === "short";
  const href = /^https?:\/\//.test(site.url) ? site.url : `https://${site.url}`;
  const [contextMenu, setContextMenu] = useState(null);
  const cardRef = useRef(null);

  const stopCardAction = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (locked) {
      onLockedAction?.();
      return;
    }
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleCardDragOver = (event) => {
    if (locked) return;
    event.stopPropagation();
    if (onFolderDragOver && hasDragType(event, "application/x-dazyhub-folder-item")) {
      const rect = event.currentTarget.getBoundingClientRect();
      const placement = tagSize === "short"
        ? (event.clientX > rect.left + rect.width / 2 ? "after" : "before")
        : (event.clientY > rect.top + rect.height / 2 ? "after" : "before");
      onFolderDragOver(event, site.id, false, placement);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const centerInsetX = rect.width * 0.24;
    const centerInsetY = rect.height * 0.24;
    const isMergeIntent = (
      event.clientX > rect.left + centerInsetX
      && event.clientX < rect.right - centerInsetX
      && event.clientY > rect.top + centerInsetY
      && event.clientY < rect.bottom - centerInsetY
    );
    const placement = tagSize === "short"
      ? (event.clientX > rect.left + rect.width / 2 ? "after" : "before")
      : (event.clientY > rect.top + rect.height / 2 ? "after" : "before");

    onDragOver(event, site.group, site.id, placement, isMergeIntent);
  };

  const handleCardDrop = (event) => {
    if (locked) {
      stopLockedEvent(event);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (hasDragType(event, "application/x-dazyhub-folder-item")) {
      return;
    }
    onDrop(event, site.group, site.id);
  };

  useEffect(() => {
    if (!contextMenu) return;
    const handleDown = (e) => {
      if (!e.target.closest(".context-menu")) closeContextMenu();
    };
    const handleScroll = () => closeContextMenu();
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [contextMenu]);

  return (
    <>
      <a
        ref={cardRef}
        className={`${isShort ? "shortcut-card" : "site-card"} ${isDragging ? "is-dragging" : ""} ${isSwapTarget ? "is-swap-target" : ""} ${isMergeTarget ? "is-merge-target" : ""} ${dropPlacement === "after" ? "is-drop-after" : ""}`}
        data-site-id={site.id}
        href={href}
        target={linkTarget}
        rel="noreferrer"
        draggable={!locked}
        onDragStart={(event) => onDragStart(event, site)}
        onDragOver={handleCardDragOver}
        onDragEnd={onDragEnd}
        onDrop={handleCardDrop}
        onContextMenu={handleContextMenu}
      >
        <SiteIcon site={site} />
        {isShort ? (
          <strong>{site.name}</strong>
        ) : (
          <strong className="site-name-long">{site.name}</strong>
        )}
        {isMergeTarget && (
          <span className="merge-drop-hint" aria-hidden="true">
            <FolderPlus />
            <span>松手合并</span>
          </span>
        )}
      </a>
      {contextMenu && (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onMouseDown={(e) => e.stopPropagation()}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(site); closeContextMenu(); }}>
            <Pencil /> 编辑
          </button>
          <button type="button" className="danger" onClick={(e) => { e.stopPropagation(); onDelete(site); closeContextMenu(); }}>
            <Trash2 /> 删除
          </button>
        </div>
      )}
    </>
  );
}

function FolderCard({ group, sites, tagSize, isDropTarget, isDragging, onFolderClick, onContextMenu, onDragOverFolder, onDropOnFolder, onDragLeaveFolder, onDragStart, onDragOver, onDrop, onDragEnd, locked = false, onLockedAction }) {
  const previewSites = sites.filter((s) => s.group === group.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 4);

  const handleCardDragOver = (event) => {
    if (locked) return;
    if (hasDragType(event, "application/x-dazyhub-folder-item")) {
      const rect = event.currentTarget.getBoundingClientRect();
      const placement = tagSize === "short"
        ? (event.clientX > rect.left + rect.width / 2 ? "after" : "before")
        : (event.clientY > rect.top + rect.height / 2 ? "after" : "before");
      onDragOver?.(event, group.id, placement);
      return;
    }
    if (hasDragType(event, "application/x-dazyhub-site")) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      onDragOverFolder?.(group.id);
    }
  };

  const handleCardDrop = (event) => {
    if (locked) {
      stopLockedEvent(event);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (hasDragType(event, "application/x-dazyhub-folder-item")) {
      onDrop?.(event, group.id);
      return;
    }
    if (hasDragType(event, "application/x-dazyhub-site")) {
      const draggedId = event.dataTransfer.getData("text/plain");
      if (draggedId) {
        onDropOnFolder?.(draggedId, group.id);
      }
    }
  };

  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onDragLeaveFolder?.();
    }
  };

  return (
    <div
      data-folder-id={group.id}
      className={`folder-card ${isDropTarget ? "is-drop-target" : ""} ${isDragging ? "is-dragging" : ""}`}
      style={{ "--folder-color": group.color }}
      draggable={!locked}
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onFolderClick?.(group.id, { x: r.left, y: r.top, w: r.width, h: r.height }); }}
      onContextMenu={(event) => {
        if (locked) {
          event.preventDefault();
          event.stopPropagation();
          onLockedAction?.();
          return;
        }
        onContextMenu?.(event, group.id);
      }}
      onDragStart={(e) => onDragStart?.(e, group)}
      onDragOver={handleCardDragOver}
      onDrop={handleCardDrop}
      onDragLeave={handleDragLeave}
      onDragEnd={onDragEnd}
    >
      <div className="folder-card-preview">
        {previewSites.length > 0 ? (
          <div className="folder-card-icons stacked">
            {previewSites.map((site, i) => (
              <div key={site.id} className="stacked-icon" style={{ "--stack-i": i, "--stack-total": previewSites.length }}>
                <SiteIcon site={site} />
              </div>
            ))}
          </div>
        ) : (
          <div className="folder-card-icons folder-card-icons-empty">
            <Folder style={{ color: group.color }} />
          </div>
        )}
      </div>
      <div className="folder-card-label">
        <span>{group.name}</span>
      </div>
      {isDropTarget && (
        <span className="folder-drop-hint" aria-hidden="true">
          <FolderOpen />
          <span>松手放入</span>
        </span>
      )}
    </div>
  );
}

function FolderPopup({ group, sites, tagSize, linkTarget, origin, onClose, onCloseComplete, onEditSite, onDeleteSite, onDissolve, onDragStart, onDragOver, onDragEnd, onDrop, onDragOut, dragState, isDragOut, isClosing, locked = false, onLockedAction }) {
  const items = sites.filter((s) => s.group === group.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const gridClass = tagSize === "short" ? "tag-grid tag-grid-short" : "tag-grid tag-grid-long";
  const navigateGroupId = group.id;
  const dragOutFiredRef = useRef(false);

  useEffect(() => {
    dragOutFiredRef.current = false;
  }, [dragState?.draggedId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropDragOver = (event) => {
    if (locked) return;
    if (!hasDragType(event, "application/x-dazyhub-site")) return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const draggedId = event.dataTransfer.getData("text/plain") || dragState?.draggedId;
    if (draggedId && onDragOut && !dragOutFiredRef.current) {
      dragOutFiredRef.current = true;
      onDragOut(draggedId, group.id);
    }
  };

  const handleBackdropDrop = (event) => {
    if (locked) {
      stopLockedEvent(event);
      return;
    }
    if (!hasDragType(event, "application/x-dazyhub-site")) return;
    event.preventDefault();
  };

  const handleBackdropDragEnd = (event) => {
    event.preventDefault();
    onDragEnd?.(event);
  };

  const handleAnimationEnd = (event) => {
    if (isClosing && event.animationName === "folder-popup-fade-out") {
      onCloseComplete?.();
    }
  };

  return (
    <div className={`modal-backdrop folder-popup-backdrop${isClosing ? " is-closing" : ""}`} role="presentation" style={isDragOut ? { opacity: 0, pointerEvents: "none" } : undefined} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} onDragOver={handleBackdropDragOver} onDrop={handleBackdropDrop} onDragEnd={handleBackdropDragEnd} onAnimationEnd={handleAnimationEnd}>
      <div className={`folder-popup${isClosing ? " is-closing" : ""}`} style={origin ? { "--fo-x": `${origin.x + origin.w / 2}px`, "--fo-y": `${origin.y + origin.h / 2}px` } : undefined} onMouseDown={(event) => event.stopPropagation()}>
        <div className="folder-popup-header">
          <div className="folder-popup-title">
            <Folder style={{ color: group.color }} />
            <h2>{group.name}</h2>
          </div>
          <div className="folder-popup-actions">
            <button
              className="icon-button"
              type="button"
              title="解散文件夹"
              aria-label="解散文件夹"
              onClick={() => { if (locked) { onLockedAction?.(); return; } onDissolve?.(); }}
            >
              <FolderX />
            </button>
            <button className="icon-button" type="button" aria-label="关闭" onClick={onClose}>
              <X />
            </button>
          </div>
        </div>
        <div className="folder-popup-content">
          {items.length > 0 ? (
            <div className={gridClass}>
              {items.map((site) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  tagSize={tagSize}
                  linkTarget={linkTarget}
                  isDragging={dragState?.draggedId === site.id}
                  isSwapTarget={dragState?.overId === site.id && dragState?.draggedId !== site.id}
                  isMergeTarget={false}
                  dropPlacement={dragState?.overId === site.id ? dragState?.placement : null}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDragEnd={onDragEnd}
                  onDrop={onDrop}
                  onEdit={onEditSite}
                  onDelete={onDeleteSite}
                  locked={locked}
                  onLockedAction={onLockedAction}
                />
              ))}
            </div>
          ) : (
            <div className="folder-popup-empty">
              <Folder style={{ color: group.color }} />
              <p>文件夹为空</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPage({ currentUser, activeTab = "users", onCurrentUserChange, onSuccess }) {
  /* ---- 邮件配置 ---- */
  const [emailConfig, setEmailConfig] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailTesting, setEmailTesting] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState(null);

  const [emailPresets, setEmailPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [activeProviderPreset, setActiveProviderPreset] = useState("");

  const fetchPresets = () => {
    getEmailPresets().then(setEmailPresets).catch(() => {});
  };

  const detectProviderPreset = (config) => {
    if (!config) return "";
    const match = emailProviderPresets.find((preset) => (
      preset.host === config.smtpHost && preset.port === config.smtpPort
    ));
    return match?.id || "";
  };

  const updateEmailConfigDraft = (patch) => {
    setEmailConfig((current) => ({ ...(current || {}), ...patch }));
    setEmailTestResult(null);
  };

  useEffect(() => {
    if (activeTab === "email") {
      setEmailLoading(true);
      getEmailConfig()
        .then((config) => {
          setEmailConfig(config);
          setActiveProviderPreset(detectProviderPreset(config));
        })
        .catch((e) => setEmailError(e.message))
        .finally(() => setEmailLoading(false));
      fetchPresets();
    }
  }, [activeTab]);

  const handleEmailSave = async (event) => {
    event.preventDefault();
    setEmailLoading(true);
    setEmailError("");
    try {
      const payload = { ...emailConfig, name: presetName.trim() || undefined };
      const updated = await updateEmailConfig(payload);
      setEmailConfig(updated);
      setActiveProviderPreset(detectProviderPreset(updated));
      onSuccess("邮件配置已保存");
      if (presetName.trim()) fetchPresets();
    } catch (e) {
      setEmailError(e.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleActivatePreset = async (id) => {
    const preset = emailPresets.find((p) => p.id === id);
    try {
      const config = await activateEmailPreset(id);
      setEmailConfig(config);
      setActiveProviderPreset(detectProviderPreset(config));
      if (preset) setPresetName(preset.name);
      fetchPresets();
      onSuccess("邮件预设已启用");
    } catch (e) {
      setEmailError(e.message);
    }
  };

  const handleDeletePreset = async (id) => {
    try {
      await deleteEmailPreset(id);
      setEmailPresets((prev) => prev.filter((p) => p.id !== id));
      if (emailPresets.find((p) => p.id === id)?.name === presetName) setPresetName("");
      onSuccess("邮件预设已删除");
    } catch (e) {
      setEmailError(e.message);
    }
  };

  const handleProviderPresetSelect = (preset) => {
    const currentUsername = emailConfig?.smtpUsername || "";
    updateEmailConfigDraft({
      smtpHost: preset.host,
      smtpPort: preset.port,
      mailFrom: emailConfig?.mailFrom || currentUsername,
    });
    setActiveProviderPreset(preset.id);
  };

  const handleEmailTest = async () => {
    setEmailTesting(true);
    setEmailError("");
    setEmailTestResult(null);
    try {
      const result = await testEmailConfig(emailConfig);
      setEmailTestResult({ ok: true, message: result?.message || "SMTP 连接成功" });
    } catch (e) {
      setEmailTestResult({ ok: false, message: e.message });
    } finally {
      setEmailTesting(false);
    }
  };

  /* ---- 用户管理 ---- */
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ displayName: "", email: "", role: "user" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const loadUsersRequestRef = useRef(0);

  /* ---- 图标缓存 ---- */
  const [faviconStats, setFaviconStats] = useState(null);
  const [faviconCacheItems, setFaviconCacheItems] = useState([]);
  const [faviconRules, setFaviconRules] = useState([]);
  const [faviconLoading, setFaviconLoading] = useState(false);
  const [faviconError, setFaviconError] = useState("");
  const [faviconRuleForm, setFaviconRuleForm] = useState({ name: "", matchType: "contains", pattern: "", iconFile: null, iconPreview: "" });
  const [isFaviconRuleDialogOpen, setIsFaviconRuleDialogOpen] = useState(false);
  const [faviconMatchInput, setFaviconMatchInput] = useState("");
  const [faviconMatchResult, setFaviconMatchResult] = useState(null);
  const [faviconCacheFilter, setFaviconCacheFilter] = useState({ keyword: "", hitType: "", contentType: "" });
  const [faviconRuleFilter, setFaviconRuleFilter] = useState({ keyword: "", matchType: "" });

  /* ---- 问题反馈管理 ---- */
  const [adminFeedbacks, setAdminFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyForm, setReplyForm] = useState({ reply: "", status: "replied" });
  const [feedbackPreviewUrl, setFeedbackPreviewUrl] = useState(null);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackActionLoading, setFeedbackActionLoading] = useState(false);

  const loadFaviconAdmin = (cacheFilter, ruleFilter) => {
    setFaviconLoading(true);
    setFaviconError("");
    Promise.all([
      getFaviconCacheStats(),
      fetchFaviconCacheItems(cacheFilter || faviconCacheFilter),
      fetchFaviconRules(ruleFilter || faviconRuleFilter)
    ])
      .then(([stats, cacheItems, rules]) => {
        setFaviconStats(stats);
        setFaviconCacheItems(cacheItems);
        setFaviconRules(rules);
      })
      .catch((e) => setFaviconError(e.message))
      .finally(() => setFaviconLoading(false));
  };

  const loadUsers = (search) => {
    const requestId = loadUsersRequestRef.current + 1;
    loadUsersRequestRef.current = requestId;
    setUserLoading(true);
    setUserError("");
    fetchUsers(search)
      .then((data) => {
        if (loadUsersRequestRef.current === requestId) setUsers(data);
      })
      .catch((e) => {
        if (loadUsersRequestRef.current === requestId) setUserError(e.message);
      })
      .finally(() => {
        if (loadUsersRequestRef.current === requestId) setUserLoading(false);
      });
  };

  const handleUserSearch = (value) => {
    setUserSearch(value);
    loadUsers(value);
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers(userSearch);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "favicon") loadFaviconAdmin();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "feedback") {
      setFeedbackLoading(true);
      fetchAllFeedbacks()
        .then(setAdminFeedbacks)
        .catch(() => {})
        .finally(() => setFeedbackLoading(false));
    }
  }, [activeTab]);

  const openEditDialog = (user) => {
    setEditingUser(user);
    setEditForm({ displayName: user.displayName, email: user.email, role: user.role });
    setEditError("");
    setResetMsg("");
  };

  const handleEditSave = async (event) => {
    event.preventDefault();
    if (editingUser.id === currentUser?.id && editForm.role !== "admin") {
      setEditError("不能把当前登录的管理员降为普通用户");
      return;
    }
    setEditSaving(true);
    setEditError("");
    try {
      const updated = await updateUser(editingUser.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      if (updated.id === currentUser?.id) {
        onCurrentUserChange(updated);
      }
      setEditingUser(null);
      onSuccess("用户已更新");
    } catch (e) {
      setEditError(e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser?.id) {
      setUserError("不能删除当前登录用户");
      return;
    }
    if (!window.confirm(`确认删除用户「${user.displayName}」(${user.email})？此操作不可撤销。`)) return;
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      onSuccess("用户已删除");
    } catch (e) {
      setUserError(e.message);
    }
  };

  const handleResetPassword = async (user) => {
    if (user.id === currentUser?.id) {
      setUserError("当前登录用户请在设置中修改密码");
      return;
    }
    if (!window.confirm(`确认重置用户「${user.displayName}」的密码？`)) return;
    try {
      const result = await resetUserPassword(user.id);
      setResetMsg(`新密码：${result.password}`);
      onSuccess("密码已重置");
      setTimeout(() => setResetMsg(""), 10000);
    } catch (e) {
      setUserError(e.message);
    }
  };

  const formatBytes = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const displayCacheUrl = (item) => {
    if (item.normalizedUrl) return item.normalizedUrl;
    return "历史缓存（缺少地址）";
  };

  const faviconCacheKeywordTimer = useRef(null);
  const handleFaviconCacheKeywordChange = (value) => {
    const next = { ...faviconCacheFilter, keyword: value };
    setFaviconCacheFilter(next);
    clearTimeout(faviconCacheKeywordTimer.current);
    faviconCacheKeywordTimer.current = setTimeout(() => {
      fetchFaviconCacheItems(next).then(setFaviconCacheItems).catch(() => {});
    }, 300);
  };
  const handleFaviconCacheFilterChange = (key, value) => {
    const next = { ...faviconCacheFilter, [key]: value };
    setFaviconCacheFilter(next);
    fetchFaviconCacheItems(next).then(setFaviconCacheItems).catch(() => {});
  };
  const resetFaviconCacheFilter = () => {
    const next = { keyword: "", hitType: "", contentType: "" };
    setFaviconCacheFilter(next);
    fetchFaviconCacheItems(next).then(setFaviconCacheItems).catch(() => {});
  };

  const faviconRuleKeywordTimer = useRef(null);
  const handleFaviconRuleKeywordChange = (value) => {
    const next = { ...faviconRuleFilter, keyword: value };
    setFaviconRuleFilter(next);
    clearTimeout(faviconRuleKeywordTimer.current);
    faviconRuleKeywordTimer.current = setTimeout(() => {
      fetchFaviconRules(next).then(setFaviconRules).catch(() => {});
    }, 300);
  };
  const handleFaviconRuleFilterChange = (key, value) => {
    const next = { ...faviconRuleFilter, [key]: value };
    setFaviconRuleFilter(next);
    fetchFaviconRules(next).then(setFaviconRules).catch(() => {});
  };
  const resetFaviconRuleFilter = () => {
    const next = { keyword: "", matchType: "" };
    setFaviconRuleFilter(next);
    fetchFaviconRules(next).then(setFaviconRules).catch(() => {});
  };

  const handleFaviconRuleIconUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFaviconRuleForm((current) => ({ ...current, iconFile: file, iconPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconRuleSave = async (event) => {
    event.preventDefault();
    setFaviconLoading(true);
    setFaviconError("");
    try {
      await saveFaviconRule(faviconRuleForm, faviconRuleForm.iconFile);
      setFaviconRuleForm({ name: "", matchType: "contains", pattern: "", iconFile: null, iconPreview: "" });
      setFaviconMatchInput("");
      setFaviconMatchResult(null);
      setIsFaviconRuleDialogOpen(false);
      await loadFaviconAdmin();
      onSuccess("图标规则已保存");
    } catch (e) {
      setFaviconError(e.message);
      setFaviconLoading(false);
    }
  };

  const handleFaviconRuleDelete = async (id) => {
    try {
      await deleteFaviconRule(id);
      await loadFaviconAdmin();
      onSuccess("图标规则已删除");
    } catch (e) {
      setFaviconError(e.message);
    }
  };

  const handleFaviconCacheClear = async () => {
    try {
      await clearFaviconCache();
      await loadFaviconAdmin();
      onSuccess("图标缓存已清理");
    } catch (e) {
      setFaviconError(e.message);
    }
  };

  const handleFaviconCacheItemDelete = async (key) => {
    try {
      await deleteFaviconCacheItem(key);
      await loadFaviconAdmin();
      onSuccess("缓存项已删除");
    } catch (e) {
      setFaviconError(e.message);
    }
  };

  const handleFaviconRuleMatch = async () => {
    if (!faviconMatchInput.trim()) return;
    try {
      const result = await matchFaviconRule(faviconMatchInput.trim());
      setFaviconMatchResult(result);
    } catch (e) {
      setFaviconError(e.message);
    }
  };

  const handleFeedbackReply = async () => {
    if (!replyTarget || feedbackActionLoading) return;
    setFeedbackActionLoading(true);
    setFeedbackError("");
    try {
      await replyFeedback(replyTarget.id, replyForm);
      setAdminFeedbacks((prev) => prev.map((fb) => fb.id === replyTarget.id ? { ...fb, adminReply: replyForm.reply, status: replyForm.status } : fb));
      setReplyTarget(null);
      onSuccess("已回复");
    } catch (e) {
      setFeedbackError(e.message);
    } finally {
      setFeedbackActionLoading(false);
    }
  };

  const handleFeedbackDelete = async (id) => {
    if (feedbackActionLoading) return;
    if (!window.confirm("确认删除此反馈？此操作不可撤销。")) return;
    setFeedbackActionLoading(true);
    setFeedbackError("");
    try {
      await deleteFeedback(id);
      setAdminFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
      onSuccess("反馈已删除");
    } catch (e) {
      setFeedbackError(e.message);
    } finally {
      setFeedbackActionLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <div className="page-top-divider" aria-hidden="true" />
        {activeTab === "email" && (
          <div className="admin-panel">
            {emailLoading && !emailConfig ? (
              <p className="admin-loading">加载中...</p>
            ) : (
              <form className="admin-form email-form" onSubmit={handleEmailSave}>
                <div className="email-config-shell">
                  <section className="email-config-section email-preset-section">
                    <div className="email-section-heading">
                      <Sparkles />
                      <div>
                        <strong>邮箱预设</strong>
                        <span>先选服务商模板，再填写账号和授权码；保存名称后会生成自定义预设。</span>
                      </div>
                    </div>
                    <div className="email-provider-grid">
                      {emailProviderPresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          className={activeProviderPreset === preset.id ? "is-active" : ""}
                          onClick={() => handleProviderPresetSelect(preset)}
                        >
                          <strong>{preset.name}</strong>
                          <span>{preset.host}:{preset.port}</span>
                        </button>
                      ))}
                    </div>
                    <div className="email-preset-library">
                      <div className="email-preset-library-head">
                        <span className="email-preset-library-label">已保存预设</span>
                        <label className="email-preset-name-field">
                          <span>保存为</span>
                          <input
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            placeholder="例如：QQ 发信、公司邮箱"
                          />
                        </label>
                      </div>
                      {emailPresets.length > 0 ? (
                        <div className="email-preset-bar">
                          {emailPresets.map((p) => (
                            <div key={p.id} className="email-preset-chip">
                              <span className={`preset-dot ${p.connectionOk === true ? "is-ok" : p.connectionOk === false ? "is-error" : ""}`} />
                              <button type="button" onClick={() => handleActivatePreset(p.id)} title={`${p.smtpHost}:${p.smtpPort}`}>{p.name}</button>
                              <button type="button" className="preset-chip-del" onClick={() => handleDeletePreset(p.id)} aria-label={`删除预设 ${p.name}`}>
                                <X size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="email-preset-empty">暂无自定义预设</span>
                      )}
                    </div>
                  </section>
                  <div className="email-config-grid">
                    <section className="email-config-section">
                      <div className="email-section-heading">
                        <Server />
                        <div>
                          <strong>SMTP 通道</strong>
                          <span>填写服务商提供的服务器地址和端口。</span>
                        </div>
                      </div>
                      <div className="email-field-grid">
                        <label className="field">
                          <span>SMTP 服务器</span>
                          <input
                            value={emailConfig?.smtpHost || ""}
                            onChange={(event) => {
                              updateEmailConfigDraft({ smtpHost: event.target.value });
                              setActiveProviderPreset("");
                            }}
                            required
                            placeholder="smtp.qq.com"
                          />
                        </label>
                        <label className="field">
                          <span>SMTP 端口</span>
                          <input
                            type="number"
                            min="1"
                            max="65535"
                            value={emailConfig?.smtpPort ?? 587}
                            onChange={(event) => {
                              updateEmailConfigDraft({ smtpPort: parseInt(event.target.value, 10) || 587 });
                              setActiveProviderPreset("");
                            }}
                            required
                            placeholder="587"
                          />
                        </label>
                      </div>
                      <div className="email-port-pills" aria-label="常用 SMTP 端口">
                        {[587, 465, 25].map((port) => (
                          <button
                            key={port}
                            type="button"
                            className={emailConfig?.smtpPort === port ? "is-active" : ""}
                            onClick={() => {
                              updateEmailConfigDraft({ smtpPort: port });
                              setActiveProviderPreset("");
                            }}
                          >
                            {port}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="email-config-section">
                      <div className="email-section-heading">
                        <KeyRound />
                        <div>
                          <strong>发信身份</strong>
                          <span>多数邮箱需要使用授权码，而不是登录密码。</span>
                        </div>
                      </div>
                      <div className="email-field-grid">
                        <label className="field">
                          <span>邮箱账号</span>
                          <input
                            value={emailConfig?.smtpUsername || ""}
                            onChange={(event) => updateEmailConfigDraft({
                              smtpUsername: event.target.value,
                              mailFrom: emailConfig?.mailFrom || event.target.value,
                            })}
                            required
                            placeholder="your-email@qq.com"
                          />
                        </label>
                        <label className="field">
                          <span>授权码</span>
                          <div className="password-input-wrap">
                            <input
                              type={showEmailPassword ? "text" : "password"}
                              value={emailConfig?.smtpPassword || ""}
                              onChange={(event) => updateEmailConfigDraft({ smtpPassword: event.target.value })}
                              placeholder="留空则不修改"
                            />
                            <button
                              type="button"
                              className="eye-toggle"
                              onClick={() => setShowEmailPassword(!showEmailPassword)}
                              tabIndex={-1}
                              aria-label={showEmailPassword ? "隐藏授权码" : "显示授权码"}
                            >
                              {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </label>
                      </div>
                    </section>

                    <section className="email-config-section email-config-section-wide">
                      <div className="email-section-heading">
                        <Send />
                        <div>
                          <strong>发件人</strong>
                          <span>建议与邮箱账号一致，避免服务商拦截。</span>
                        </div>
                      </div>
                      <label className="field">
                        <span>发件人地址</span>
                        <input
                          value={emailConfig?.mailFrom || ""}
                          onChange={(event) => updateEmailConfigDraft({ mailFrom: event.target.value })}
                          placeholder="noreply@your-domain.com"
                        />
                      </label>
                    </section>
                  </div>

                  <div className="email-config-footer">
                    <div className="email-config-footnote">
                      <ShieldCheck />
                      <span>授权码会以密码字段保存，页面不会主动明文展示。</span>
                    </div>
                    <div className="admin-form-actions">
                      {emailError && <span className="field-hint">{emailError}</span>}
                      {emailTestResult && (
                        <span className={`email-test-result ${emailTestResult.ok ? "is-ok" : "is-error"}`}>
                          {emailTestResult.ok ? <Check /> : <X />}
                          {emailTestResult.message}
                        </span>
                      )}
                      <button
                        className="action-button secondary email-test-button"
                        type="button"
                        onClick={handleEmailTest}
                        disabled={emailTesting || emailLoading || !emailConfig}
                      >
                        <Mail />
                        <span>{emailTesting ? "测试中..." : "测试连接"}</span>
                      </button>
                      <button className="action-button" type="submit" disabled={emailLoading}>
                        <Save />
                        <span>{emailLoading ? "保存中..." : "保存配置"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
        {activeTab === "users" && (
          <div className="admin-panel">
            <div className="admin-toolbar">
              <div className="search-input-wrap">
                <Search size={18} />
                <input
                  className="search-input"
                  type="search"
                  placeholder="搜索邮箱或昵称..."
                  value={userSearch}
                  onChange={(e) => handleUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => handleUserSearch("")}
                    aria-label="清空搜索"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {userError && <div className="form-error">{userError}</div>}
            {resetMsg && <div className="form-success">{resetMsg}</div>}

            {userLoading ? (
              <p className="admin-loading">加载中...</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>昵称</th>
                      <th>邮箱</th>
                      <th>角色</th>
                      <th>注册时间</th>
                      <th style={{ width: 160 }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="admin-empty">暂无用户</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className={u.id === currentUser?.id ? "is-current-user" : ""}>
                          <td>
                            <div className="admin-user-cell">
                              <Avatar user={u} size="admin" />
                              <span>
                                {u.displayName}
                                {u.id === currentUser?.id && <small>当前登录</small>}
                              </span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`admin-role-badge ${u.role}`}>{u.role === "admin" ? "管理员" : "用户"}</span>
                          </td>
                          <td className="admin-date">{new Date(u.createdAt).toLocaleDateString("zh-CN")}</td>
                          <td>
                            <div className="admin-row-actions">
                              <button className="admin-action-btn" type="button" title="编辑" onClick={() => openEditDialog(u)}>
                                <Pencil />
                              </button>
                              <button
                                className="admin-action-btn"
                                type="button"
                                title={u.id === currentUser?.id ? "当前用户请在设置中修改密码" : "重置密码"}
                                disabled={u.id === currentUser?.id}
                                onClick={() => handleResetPassword(u)}
                              >
                                <KeyRound />
                              </button>
                              <button
                                className="admin-action-btn danger"
                                type="button"
                                title={u.id === currentUser?.id ? "不能删除当前登录用户" : "删除"}
                                disabled={u.id === currentUser?.id}
                                onClick={() => handleDeleteUser(u)}
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {editingUser && (
              <div className="modal-backdrop" role="presentation">
                <form className="modal profile-modal" onSubmit={handleEditSave}>
                  <div className="modal-header">
                    <h2>编辑用户</h2>
                    <button className="icon-button" type="button" onClick={() => setEditingUser(null)} aria-label="关闭">
                      <X />
                    </button>
                  </div>
                  <label className="field">
                    <span>昵称</span>
                    <input value={editForm.displayName} onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })} required maxLength={80} />
                  </label>
                  <label className="field">
                    <span>邮箱</span>
                    <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required maxLength={128} />
                  </label>
                  <label className="field">
                    <span>角色</span>
                    <select
                      value={editForm.role}
                      disabled={editingUser.id === currentUser?.id}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    >
                      <option value="user">用户</option>
                      <option value="admin">管理员</option>
                    </select>
                    {editingUser.id === currentUser?.id && <small className="field-hint">当前登录管理员不能在这里修改自己的角色</small>}
                  </label>
                  {editError && <div className="form-error">{editError}</div>}
                  <button className="action-button wide" type="submit" disabled={editSaving}>
                    <Save />
                    <span>{editSaving ? "保存中..." : "保存"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        {activeTab === "favicon" && (
          <div className="admin-panel">
            {faviconError && <div className="form-error">{faviconError}</div>}

            <div className="favicon-cache-list">
              <div className="favicon-list-header">
                <div>
                  <h2>已缓存图标</h2>
                  <p className="admin-desc">自动抓取和规则命中的图标都会记录在这里。</p>
                </div>
                <div className="favicon-list-tools">
                  <span>{faviconStats?.count ?? 0} 项</span>
                  <span>{formatBytes(faviconStats?.bytes ?? 0)}</span>
                  <button className="admin-action-btn" type="button" title="清理缓存" onClick={handleFaviconCacheClear} disabled={faviconLoading}>
                    <Trash2 />
                  </button>
                  <button
                    className="admin-action-btn"
                    type="button"
                    title="新增图标规则"
                    aria-label="新增图标规则"
                    onClick={() => {
                      setFaviconRuleForm({ name: "", matchType: "contains", pattern: "", iconFile: null, iconPreview: "" });
                      setFaviconMatchInput("");
                      setFaviconMatchResult(null);
                      setIsFaviconRuleDialogOpen(true);
                    }}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
              <div className="favicon-filter-bar">
                <div className="search-input-wrap favicon-search-input">
                  <Search size={16} />
                  <input
                    className="search-input"
                    type="search"
                    placeholder="搜索网址、来源、规则..."
                    value={faviconCacheFilter.keyword}
                    onChange={(e) => handleFaviconCacheKeywordChange(e.target.value)}
                  />
                  {faviconCacheFilter.keyword && (
                    <button type="button" className="search-clear-btn" onClick={() => handleFaviconCacheKeywordChange("")} aria-label="清空搜索">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="favicon-filter-selects">
                  <SettingSelect
                    value={faviconCacheFilter.hitType}
                    ariaLabel="命中来源筛选"
                    options={[
                      { value: "", label: "全部来源" },
                      { value: "rule", label: "规则" },
                      { value: "auto", label: "自动抓取" },
                    ]}
                    onChange={(v) => handleFaviconCacheFilterChange("hitType", v)}
                  />
                  <SettingSelect
                    value={faviconCacheFilter.contentType}
                    ariaLabel="图标类型筛选"
                    options={[
                      { value: "", label: "全部类型" },
                      { value: "image/png", label: "PNG" },
                      { value: "image/svg", label: "SVG" },
                      { value: "image/x-icon", label: "ICO" },
                      { value: "image/jpeg", label: "JPEG" },
                      { value: "image/webp", label: "WebP" },
                    ]}
                    onChange={(v) => handleFaviconCacheFilterChange("contentType", v)}
                  />
                  <button
                    className="admin-action-btn favicon-filter-reset"
                    type="button"
                    title="重置筛选"
                    aria-label="重置筛选"
                    disabled={!faviconCacheFilter.keyword && !faviconCacheFilter.hitType && !faviconCacheFilter.contentType}
                    onClick={resetFaviconCacheFilter}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
              {faviconCacheItems.length === 0 ? (
                <div className="admin-empty">暂无缓存图标</div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table favicon-table">
                    <colgroup>
                      <col style={{ width: 64 }} />
                      <col style={{ width: "22%" }} />
                      <col style={{ width: "24%" }} />
                      <col style={{ width: 92 }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: 110 }} />
                      <col style={{ width: 82 }} />
                      <col style={{ width: 70 }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>图标</th>
                        <th>网站地址</th>
                        <th>图标来源</th>
                        <th>命中来源</th>
                        <th>命中规则</th>
                        <th>类型</th>
                        <th>大小</th>
                        <th style={{ width: 80 }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faviconCacheItems.map((item) => (
                        <tr key={item.key}>
                          <td><img className="favicon-table-icon" src={`/uploads/favicons/${item.filename}`} alt="" /></td>
                          <td>
                            <div className="favicon-rule-name">
                              <strong className="truncate-cell">{displayCacheUrl(item)}</strong>
                              <small>缓存 key: {item.key}</small>
                            </div>
                          </td>
                          <td className="truncate-cell">{item.sourceIconUrl || item.filename}</td>
                          <td>{item.hitType === "rule" ? "规则" : "自动抓取"}</td>
                          <td className="truncate-cell">
                            {item.ruleName ? `${item.ruleName} · ${item.ruleMatchType} · ${item.rulePattern}` : "-"}
                          </td>
                          <td>{item.contentType}</td>
                          <td>{formatBytes(item.bytes)}</td>
                          <td>
                            <button className="admin-action-btn danger" type="button" title="删除缓存" onClick={() => handleFaviconCacheItemDelete(item.key)}>
                              <Trash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="favicon-cache-list favicon-rules-list">
              <div className="favicon-list-header">
                <div>
                  <h2>图标规则管理</h2>
                  <p className="admin-desc">通过规则为特定域名或 IP 指定自定义图标。</p>
                </div>
                <div className="favicon-list-tools">
                  <span>{faviconRules.length} 条规则</span>
                </div>
              </div>
              <div className="favicon-filter-bar">
                <div className="search-input-wrap favicon-search-input">
                  <Search size={16} />
                  <input
                    className="search-input"
                    type="search"
                    placeholder="搜索规则名称或匹配模式..."
                    value={faviconRuleFilter.keyword}
                    onChange={(e) => handleFaviconRuleKeywordChange(e.target.value)}
                  />
                  {faviconRuleFilter.keyword && (
                    <button type="button" className="search-clear-btn" onClick={() => handleFaviconRuleKeywordChange("")} aria-label="清空搜索">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="favicon-filter-selects favicon-filter-selects-compact">
                  <SettingSelect
                    value={faviconRuleFilter.matchType}
                    ariaLabel="匹配方式筛选"
                    options={[
                      { value: "", label: "全部方式" },
                      { value: "contains", label: "包含" },
                      { value: "exact", label: "精确" },
                      { value: "wildcard", label: "通配符" },
                    ]}
                    onChange={(v) => handleFaviconRuleFilterChange("matchType", v)}
                  />
                  <button
                    className="admin-action-btn favicon-filter-reset"
                    type="button"
                    title="重置筛选"
                    aria-label="重置筛选"
                    disabled={!faviconRuleFilter.keyword && !faviconRuleFilter.matchType}
                    onClick={resetFaviconRuleFilter}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
              {faviconRules.length === 0 ? (
                <div className="admin-empty">暂无图标规则</div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table favicon-table">
                    <colgroup>
                      <col style={{ width: 64 }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: 100 }} />
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: 70 }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>图标</th>
                        <th>规则名称</th>
                        <th>匹配方式</th>
                        <th>匹配模式</th>
                        <th>更新时间</th>
                        <th style={{ width: 70 }}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faviconRules.map((rule) => (
                        <tr key={rule.id}>
                          <td>
                            {rule.iconPath
                              ? <img className="favicon-table-icon" src={`/uploads/favicons/rules/${rule.iconPath}`} alt="" />
                              : <div className="favicon-table-icon-placeholder"><Sparkles size={16} /></div>
                            }
                          </td>
                          <td>
                            <div className="favicon-rule-name">
                              <strong>{rule.name}</strong>
                              <small>ID: {rule.id}</small>
                            </div>
                          </td>
                          <td>{rule.matchType === "contains" ? "包含" : rule.matchType === "exact" ? "精确" : "通配符"}</td>
                          <td className="truncate-cell"><code>{rule.pattern}</code></td>
                          <td className="truncate-cell">{rule.updatedAt ? new Date(rule.updatedAt).toLocaleDateString("zh-CN") : "-"}</td>
                          <td>
                            <button className="admin-action-btn danger" type="button" title="删除规则" onClick={() => handleFaviconRuleDelete(rule.id)}>
                              <Trash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {isFaviconRuleDialogOpen && (
              <div className="modal-backdrop" role="presentation">
                <form className="modal favicon-rule-modal" onSubmit={handleFaviconRuleSave}>
                  <div className="modal-header">
                    <h2>新增图标规则</h2>
                    <button className="icon-button" type="button" onClick={() => setIsFaviconRuleDialogOpen(false)} aria-label="关闭">
                      <X />
                    </button>
                  </div>
                  <div className="favicon-rule-form">
                    <label className="field">
                      <span>规则名称</span>
                      <input
                        value={faviconRuleForm.name}
                        onChange={(event) => setFaviconRuleForm({ ...faviconRuleForm, name: event.target.value })}
                        placeholder="fnOS"
                        required
                      />
                    </label>
                    <label className="field">
                      <span>匹配方式</span>
                      <SettingSelect
                        value={faviconRuleForm.matchType}
                        ariaLabel="匹配方式"
                        options={[
                          { value: "contains", label: "包含" },
                          { value: "exact", label: "精确" },
                          { value: "wildcard", label: "通配符" },
                        ]}
                        onChange={(value) => setFaviconRuleForm({ ...faviconRuleForm, matchType: value })}
                      />
                    </label>
                    <label className="field">
                      <span>匹配规则</span>
                      <input
                        value={faviconRuleForm.pattern}
                        onChange={(event) => setFaviconRuleForm({ ...faviconRuleForm, pattern: event.target.value })}
                        placeholder="192.168.100.154:5667 或 *.example.com"
                        required
                      />
                    </label>
                    <label className="field favicon-rule-upload">
                      <span>规则图片</span>
                      <div>
                        <div className="site-icon-preview">
                          {faviconRuleForm.iconPreview ? <img src={faviconRuleForm.iconPreview} alt="规则图标预览" /> : <Sparkles />}
                        </div>
                        <label className="avatar-upload site-icon-upload">
                          <Camera />
                          <span>上传图片</span>
                          <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleFaviconRuleIconUpload} />
                        </label>
                      </div>
                    </label>
                  </div>

                  <div className="favicon-rule-tester">
                    <label className="field">
                      <span>测试匹配</span>
                      <div className="input-with-action">
                        <input
                          value={faviconMatchInput}
                          onChange={(event) => setFaviconMatchInput(event.target.value)}
                          placeholder="输入网址查看命中的具体规则"
                        />
                        <button className="icon-button" type="button" onClick={handleFaviconRuleMatch} aria-label="测试匹配">
                          <Search />
                        </button>
                      </div>
                    </label>
                    {faviconMatchResult && (
                      <div className="favicon-rule-match">
                        <span>{faviconMatchResult.rule ? "命中规则" : "未命中规则"}</span>
                        <strong>{faviconMatchResult.rule?.name || "默认自动抓取"}</strong>
                        {faviconMatchResult.normalizedUrl && <small>{faviconMatchResult.normalizedUrl}</small>}
                      </div>
                    )}
                  </div>

                  <button className="action-button wide" type="submit" disabled={faviconLoading || !faviconRuleForm.iconFile}>
                    <Save />
                    <span>保存图标规则</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        {activeTab === "feedback" && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>问题反馈管理</h2>
            </div>
            {feedbackError && <div className="form-error">{feedbackError}</div>}
            {feedbackLoading ? (
              <p className="admin-loading">加载中...</p>
            ) : adminFeedbacks.length === 0 ? (
              <div className="admin-empty">暂无反馈</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>用户</th>
                      <th>类型</th>
                      <th>内容</th>
                      <th>状态</th>
                      <th>提交时间</th>
                      <th style={{ width: 100 }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminFeedbacks.map((fb) => (
                      <tr key={fb.id}>
                        <td>
                          <div className="favicon-rule-name">
                            <strong>{fb.userDisplayName || "-"}</strong>
                            <small>{fb.userEmail}</small>
                          </div>
                        </td>
                        <td>{({ bug: "问题", feature: "建议", other: "其他" })[fb.type] || fb.type}</td>
                        <td className="truncate-cell">{fb.content}</td>
                        <td>
                          <span className={`feedback-status-badge status-${fb.status}`}>
                            {({ pending: "待处理", replied: "已回复", closed: "已关闭" })[fb.status] || fb.status}
                          </span>
                        </td>
                        <td className="truncate-cell">{fb.createdAt ? new Date(fb.createdAt).toLocaleString("zh-CN") : "-"}</td>
                        <td>
                          <button className="admin-action-btn" type="button" title="回复" disabled={feedbackActionLoading} onClick={() => { setReplyTarget(fb); setReplyForm({ reply: fb.adminReply || "", status: fb.status === "pending" ? "replied" : fb.status }); }}>
                            <Pencil />
                          </button>
                          <button className="admin-action-btn danger" type="button" title="删除" disabled={feedbackActionLoading} onClick={() => handleFeedbackDelete(fb.id)}>
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {replyTarget && (
              <div className="modal-backdrop" role="presentation">
                <form className="modal" onSubmit={(e) => { e.preventDefault(); handleFeedbackReply(); }}>
                  <div className="modal-header">
                    <h2>回复反馈</h2>
                    <button className="icon-button" type="button" onClick={() => setReplyTarget(null)} aria-label="关闭">
                      <X />
                    </button>
                  </div>
                  <div className="feedback-reply-info">
                    <p><strong>{replyTarget.userDisplayName}</strong> 的反馈：</p>
                    <p className="feedback-reply-content">{replyTarget.content}</p>
                    {replyTarget.attachments && (() => {
                      try {
                        const urls = JSON.parse(replyTarget.attachments);
                        return urls.length > 0 && (
                          <div className="feedback-attachments admin-feedback-attachments">
                            {urls.map((url, i) => (
                              <div className="feedback-attachment-thumb" key={i} onClick={() => setFeedbackPreviewUrl(url)} role="button" tabIndex={0}>
                                <img src={url} alt={`附件 ${i + 1}`} />
                              </div>
                            ))}
                          </div>
                        );
                      } catch { return null; }
                    })()}
                  </div>
                  <label className="field">
                    <span>回复内容</span>
                    <textarea
                      rows={4}
                      value={replyForm.reply}
                      onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                      placeholder="输入回复..."
                    />
                  </label>
                  <label className="field">
                    <span>状态</span>
                    <select value={replyForm.status} onChange={(e) => setReplyForm({ ...replyForm, status: e.target.value })}>
                      <option value="pending">待处理</option>
                      <option value="replied">已回复</option>
                      <option value="closed">已关闭</option>
                    </select>
                  </label>
                  <button className="action-button wide" type="submit" disabled={feedbackActionLoading}>{feedbackActionLoading ? "提交中..." : "提交回复"}</button>
                </form>
              </div>
            )}
            {feedbackPreviewUrl && (
              <div className="image-preview-overlay" onClick={() => setFeedbackPreviewUrl(null)}>
                <img src={feedbackPreviewUrl} alt="预览" />
                <button className="image-preview-close" type="button" aria-label="关闭预览" onClick={() => setFeedbackPreviewUrl(null)}>
                  <X size={24} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

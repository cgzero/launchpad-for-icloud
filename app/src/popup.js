/**
 * @file popup js file
 */

// 图片地址
const CALENDAR_ICON_URL = 'src/img/calendar_icon.png';
const CALENDAR_ICON_DARK_URL = 'src/img/calendar_icon_dark.png';
const CALENDAR_BG_URL = 'src/img/appbg_icon.png';
const CALENDAR_BG_DARK_URL = 'src/img/appbg_icon_dark.png';

// 根据用户语言获取 iCloud 域名
const ICLOUD_DOMAIN = (() => {
    const lang = chrome.i18n.getUILanguage?.() ?? 'en';
    return lang === 'zh-CN' ? 'icloud.com.cn' : 'icloud.com';
})();

// 应用路径映射（新版 iCloud URL 格式）
const APP_PATHS = new Map([
    ['mail', '/mail'],
    ['contacts', '/contacts'],
    ['calendar', '/calendar'],
    ['photos', '/photos'],
    ['iclouddrive', '/iclouddrive'],
    ['notes', '/notes'],
    ['reminders', '/reminders'],
    ['invites', '/invites'],
    ['pages', '/pages'],
    ['numbers', '/numbers'],
    ['keynote', '/keynote'],
    ['find', '/find'],
    ['settings', '/settings']
]);

// 需要国际化的文字节点
const TEXT_NODES = [
    'mail', 'contacts', 'calendar', 'photos', 'iclouddrive',
    'find', 'notes', 'reminders', 'invites', 'pages', 'numbers',
    'keynote', 'settings', 'home'
];

// ==================== 日历绘制参数 ====================
// 说明：
//   - calendar_icon.png 是 2x 精度雪碧图，所以源坐标（sx/sy/sw/sh）写成 "逻辑像素 * 2"。
//   - 目标坐标（dx/dy/dw/dh）基于 canvas 逻辑像素，canvas 实际分辨率为逻辑像素的 2 倍以实现高清。
//   - 如需微调位置/间距，修改下方常量即可。

// 画布逻辑尺寸（背景图会按此尺寸整图铺满）
const CANVAS_SIZE = 74;
// 高清缩放比
const CANVAS_SCALE = 2;

// 星期文字（从雪碧图切图）
const DAY_SPRITE = {
    sx: 230 * 2,   // 源图 x 偏移
    sw: 340 * 2,   // 源图裁剪宽
    sh: 30 * 2,    // 源图裁剪高
    dx: 10,        // 目标 x
    dy: 11,        // 目标 y
    dw: 160,       // 目标宽
    dh: 15         // 目标高
};

// 日期数字（从雪碧图切图）
const NUM_SPRITE = {
    sy: 0,         // 源图 y 偏移
    sw: 52 * 2,    // 源图裁剪宽（单个数字）
    sh: 80 * 2,    // 源图裁剪高
    dy: 25,        // 目标 y
    dw: 26,        // 目标宽
    dh: 40,        // 目标高
    singleDx: 25,          // 单位数时居中 x
    doubleStartDx: 12,     // 两位数时第一位的 x
    doubleStepDx: 25       // 两位数时每位间距
};

// 数字位置映射（雪碧图中每个数字的源 x，2x 精度）
const DIGIT_OFFSETS = {
    0: 495 * 2,
    1: 11 * 2,
    2: 60 * 2,
    3: 118 * 2,
    4: 170 * 2,
    5: 225 * 2,
    6: 280 * 2,
    7: 333 * 2,
    8: 385 * 2,
    9: 440 * 2
};

// 星期位置映射（雪碧图中每个星期条目的源 y，2x 精度）
const DAY_OFFSETS = {
    0: 120 * 2,  // Sunday
    1: 150 * 2,  // Monday
    2: 180 * 2,  // Tuesday
    3: 210 * 2,  // Wednesday
    4: 240 * 2,  // Thursday
    5: 270 * 2,  // Friday
    6: 300 * 2   // Saturday
};

/**
 * 日历绘制器类
 */
class CalendarDrawer {
    #canvas;
    #ctx;

    constructor(canvasId) {
        this.#canvas = document.getElementById(canvasId);
        this.#ctx = this.#canvas?.getContext('2d');
    }

    async init() {
        if (!this.#canvas || !this.#ctx) return;

        this.#canvas.width = CANVAS_SIZE * CANVAS_SCALE;
        this.#canvas.height = CANVAS_SIZE * CANVAS_SCALE;
        this.#ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

        await this.render();
    }

    async render() {
        if (!this.#canvas || !this.#ctx) return;
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const [bgImg, fgImg] = await Promise.all([
            this.#loadImage(isDark ? CALENDAR_BG_DARK_URL : CALENDAR_BG_URL),
            this.#loadImage(isDark ? CALENDAR_ICON_DARK_URL : CALENDAR_ICON_URL)
        ]);

        this.#ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        this.#ctx.beginPath();
        this.#drawCalendar(bgImg, fgImg);
    }

    #loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    #drawDay(img, sy) {
        const s = DAY_SPRITE;
        this.#ctx.drawImage(img, s.sx, sy, s.sw, s.sh, s.dx, s.dy, s.dw, s.dh);
    }

    #drawNum(img, sx, dx) {
        const n = NUM_SPRITE;
        this.#ctx.drawImage(img, sx, n.sy, n.sw, n.sh, dx, n.dy, n.dw, n.dh);
    }

    #drawDate(img, date) {
        const digits = date < 10 ? [date] : [Math.floor(date / 10), date % 10];
        const n = NUM_SPRITE;

        digits.forEach((digit, i) => {
            const x = date < 10 ? n.singleDx : n.doubleStartDx + i * n.doubleStepDx;
            this.#drawNum(img, DIGIT_OFFSETS[digit], x);
        });
    }

    #drawCalendar(bgImg, fgImg) {
        // 绘制日历背景（完整背景图，适配主题）
        this.#ctx.drawImage(bgImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const now = new Date();
        const day = now.getDay();
        const date = now.getDate();

        // 绘制星期（前景：从 calendar_icon.png 切图）
        this.#drawDay(fgImg, DAY_OFFSETS[day]);

        // 绘制日期数字（前景：从 calendar_icon.png 切图）
        this.#drawDate(fgImg, date);
    }
}

/**
 * 设置文本节点国际化
 */
const setTextNodes = () => {
    for (const node of TEXT_NODES) {
        const element = document.getElementById(`i18n-${node}`);
        if (element) {
            element.textContent = chrome.i18n.getMessage(node);
        }
    }
};

/**
 * 根据系统主题切换图标
 */
const setDarkModeIcons = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.querySelectorAll('.app-btn img').forEach(img => {
        const src = img.src;
        if (isDark) {
            if (!src.includes('_dark')) {
                img.src = src.replace('.png', '_dark.png');
            }
        } else {
            if (src.includes('_dark')) {
                img.src = src.replace('_dark.png', '.png');
            }
        }
    });
};

/**
 * 设置应用链接
 */
const setAppLinks = () => {
    document.querySelectorAll('a[data-app]').forEach(link => {
        const app = link.dataset.app;
        const path = APP_PATHS.get(app) ?? '';
        link.href = `https://www.${ICLOUD_DOMAIN}${path}`;
    });
};

/**
 * 初始化
 */
const init = () => {
    setAppLinks();

    const calendar = new CalendarDrawer('canvas');
    calendar.init();

    setTextNodes();
    setDarkModeIcons();

    // 监听主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setDarkModeIcons();
        calendar.render();
    });
};

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

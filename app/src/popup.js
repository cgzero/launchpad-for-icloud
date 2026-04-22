/**
 * @file popup js file
 */

// 图片地址
const CALENDAR_ICON_URL = chrome.i18n.getMessage('calendarIconUrl');

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
    ['pages', '/pages'],
    ['numbers', '/numbers'],
    ['keynote', '/keynote'],
    ['find', '/find'],
    ['settings', '/settings']
]);

// 需要国际化的文字节点
const TEXT_NODES = [
    'mail', 'contacts', 'calendar', 'photos', 'iclouddrive',
    'find', 'notes', 'reminders', 'pages', 'numbers',
    'keynote', 'settings', 'home'
];

// 数字位置映射（从雪碧图截取）
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

// 星期位置映射
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

    constructor(canvasId, imageSrc) {
        this.#canvas = document.getElementById(canvasId);
        this.#ctx = this.#canvas?.getContext('2d');
        this.imageSrc = imageSrc;
    }

    async init() {
        if (!this.#canvas || !this.#ctx) return;

        this.#canvas.width = 74 * 2;
        this.#canvas.height = 74 * 2;
        this.#ctx.scale(2, 2);

        const img = await this.#loadImage(this.imageSrc);
        this.#ctx.beginPath();
        this.#drawCalendar(img);
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
        this.#ctx.drawImage(img, 230 * 2, sy, 340 * 2, 30 * 2, 10, 10, 160, 15);
    }

    #drawNum(img, sx, dx) {
        this.#ctx.drawImage(img, sx, 0, 52 * 2, 80 * 2, dx, 25, 26, 40);
    }

    #drawDate(img, date) {
        const digits = date < 10 ? [date] : [Math.floor(date / 10), date % 10];

        digits.forEach((digit, i) => {
            const x = date < 10 ? 25 : 12 + i * 25;
            this.#drawNum(img, DIGIT_OFFSETS[digit], x);
        });
    }

    #drawCalendar(img) {
        // 绘制日历背景
        this.#ctx.drawImage(img, 0, 100 * 2, 142 * 2, 142 * 2, 0, 0, 74, 74);

        const now = new Date();
        const day = now.getDay();
        const date = now.getDate();

        // 绘制星期
        this.#drawDay(img, DAY_OFFSETS[day]);

        // 绘制日期数字
        this.#drawDate(img, date);
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

    const calendar = new CalendarDrawer('canvas', CALENDAR_ICON_URL);
    calendar.init();

    setTextNodes();
};

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

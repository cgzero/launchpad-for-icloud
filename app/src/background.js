/**
 * @file background service worker
 */

const HOME_MENU_ID = 'open-icloud-home';
const SETTINGS_MENU_ID = 'open-icloud-settings';

/**
 * 根据 UI 语言返回 iCloud 域名
 */
const getDomain = () => {
    const lang = chrome.i18n.getUILanguage?.() ?? 'en';
    return lang === 'zh-CN' ? 'icloud.com.cn' : 'icloud.com';
};

const getHomeUrl = () => `https://www.${getDomain()}`;
const getSettingsUrl = () => `https://www.${getDomain()}/settings`;

// 注册右键菜单（扩展安装/更新时）
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: HOME_MENU_ID,
            title: 'iCloud Home Page',
            contexts: ['action']
        });
        chrome.contextMenus.create({
            id: SETTINGS_MENU_ID,
            title: 'iCloud Settings',
            contexts: ['action']
        });
    });
});

// 菜单点击处理
chrome.contextMenus.onClicked.addListener(info => {
    if (info.menuItemId === HOME_MENU_ID) {
        chrome.tabs.create({ url: getHomeUrl() });
    } else if (info.menuItemId === SETTINGS_MENU_ID) {
        chrome.tabs.create({ url: getSettingsUrl() });
    }
});

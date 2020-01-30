import browser from './browser';
import stringProvider from './stringProvider';

const amazonRGX = /https:\/\/www\.amazon\.[^\/]*\//;

browser.runtime.onInstalled.addListener((evt)=>{
    browser.storage.local.set({isActive:false});

    switch (evt.reason) {
        case browser.runtime.OnInstalledReason.INSTALL:
        case browser.runtime.OnInstalledReason.UPDATE:
            var config ={};
            config[stringProvider.time] = Date.now();
            browser.storage.local.set(config);
            break;
    }
});
function tabUpdateListener(tabId, changeInfo, tab) {
    urlChanged(tab.url, tab.id);
}

function urlChanged(url, tabId) {
    if (url.match(amazonRGX)){
        browser.storage.local.get(stringProvider.isActive,(data)=>{
            browser.pageAction.setIcon({
                tabId, 
                path:getIconPath(data.isActive)
            });
            browser.pageAction.show(tabId);
        });
    }
}

const pageActionClicked = (tab) => {
    browser.storage.local.get(stringProvider.isActive,(data)=>{
        let isActive = !data.isActive;
        browser.storage.local.set({isActive});
        browser.pageAction.setIcon({
            tabId: tab.id, 
            path: getIconPath(isActive)
        });
    });
}

function getIconPath(isActive) {
    return (isActive ? 'images/icon32.png': 'images/grayIcon32.png');
}

browser.tabs.onUpdated.addListener(tabUpdateListener);
browser.pageAction.onClicked.addListener(pageActionClicked);

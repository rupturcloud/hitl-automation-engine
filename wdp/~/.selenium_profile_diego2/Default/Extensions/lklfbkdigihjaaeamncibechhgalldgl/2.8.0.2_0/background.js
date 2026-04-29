/////////////////////////////////////////////////////////////////////////////////
//
// File: background.js
// Description: Event page to access Chrome API for fetching top sites information
// Copyright (C) Microsoft. All rights reserved.
//
//////////////////////////////////////////////////////////////////////////////////
var newTabUrl = "chrome://newtab";

chrome.action.onClicked.addListener(
    function (tab) {
        chrome.tabs.create({ url: newTabUrl });
    }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "checkCompetitorPopup") {
        const key = "CompetitorPopup";
        chrome.storage.local.get([key], ({ [key]: value }) => {
            chrome.storage.local.set({ [key]: Date.now() });
            sendResponse(value || 0);
        });
    }
    return true;
});

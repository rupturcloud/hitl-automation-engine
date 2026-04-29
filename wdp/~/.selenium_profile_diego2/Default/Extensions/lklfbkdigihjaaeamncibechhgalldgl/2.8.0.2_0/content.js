//////////////////////////////////////////////////////////////////////////////////
//
// File: content.js
// Description: Content script to help MSN page communicate with background page for fetching top sites information.
// Copyright (C) Microsoft. All rights reserved.
//
//////////////////////////////////////////////////////////////////////////////////

/// Add listener for click events
window.addEventListener("click", handleClickEventForLinks, false);

function handleClickEventForLinks(ev) {
    /// <summary>
    /// Function to handle click events on links to open them outside the iframe
    /// </summary>
    /// <param name="ev">The event object</param>

    if (ev.target.tagName === "A") {
        var evtTgt = ev.target;
        if (evtTgt.getAttribute("target") === "_self") {
            evtTgt.setAttribute("target", "_top");
        }
    }
}

(async () => {
    // Only for MSN new tab page
    const url = new URL(location.href);
    if (url.searchParams.get("pc") !== "U526" || url.searchParams.get("ocid") !== "chromentpnews") return;
    // Redirection from chrome://newtab has no referrer value
    if (document.referrer) return;

    // Check if the competitor popup has been shown
    const timestamp = await chrome.runtime.sendMessage("checkCompetitorPopup")
    if (timestamp) return;

    // Open the competitor popup
    const popup = document.createElement("div");
    popup.style = `
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.6);
    `;
    popup.innerHTML = `
        <div class="msnnewtab-competitorpopup">
            <h1>
                <img src="https://assets.msn.com/staticsb/statics/latest/brand/new-msn-logo-color-black.svg" />
                <br />
                <span>Wait—don’t change it back!</span>
            </h1>
            <p>If you do, you’ll turn off <span>MSN New Tab</span> and lose access to the latest news, your most visited sites, web search and more</p>
            <p>Select <span>Keep it</span> to continue using MSN New Tab</p>
        </div>
        <style>
            .msnnewtab-competitorpopup {
                position: absolute;
                width: 416px;
                top: 166px;
                left: 50%;
                transform: translate(calc(-50% + 8px), 0);
                padding: 0 16px;
                font-size: 20px;
                color: #0d0d0d;
                background-color: #fcfcfc;
                border-radius: 10px;
                border: 1px solid #ddd;
                box-shadow: 0 0 2px rgba(0, 0, 0, .25), 2px 12px 30px rgba(0, 0, 0, .14);
                user-select: none;
            }
            .msnnewtab-competitorpopup h1 {
                font-size: 1.2em;
            }
            .msnnewtab-competitorpopup p span {
                font-weight: bold;
            }
            .msnnewtab-competitorpopup p:last-child span {
                color: #0d91e1;
            }
        </style>
    `;
    document.body.appendChild(popup);
    popup.onclick = () => popup.remove();
})();

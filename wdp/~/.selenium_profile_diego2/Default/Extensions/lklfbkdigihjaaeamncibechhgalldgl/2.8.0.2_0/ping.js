var PingDate = "PingDate";
var ExtnVer = "ExtnVersion";
var startIndex = navigator.userAgent.indexOf("(");
var endIndex = navigator.userAgent.indexOf(")");
var OS = navigator.userAgent.substring(startIndex + 1, endIndex).replace(/\s/g, '');
var browserLanguage = navigator.language;

var manifestData = chrome.runtime.getManifest();
var ExtensionName = manifestData.name.replace(/ /g, "").replace(/&/g, 'and');
var ExtensionVersion = manifestData.version;
var ExtensionId = chrome.runtime.id;
var BrowserVersion = navigator.userAgent.split(" ");
BrowserVersion = BrowserVersion[BrowserVersion.length - 2].replace("/", "");
var browserDefaultsUrl = "https://browserdefaults.microsoft.com/";
var msnNewTabUrl = "https://msnnewtab.microsoft.com/";
var FeedbackFwlink = "https://go.microsoft.com/fwlink/?linkid=2138838";

var Market = "";
try {
    Market = chrome.i18n.getMessage("ExtnMarket");
    console.log("Try block - Market : " + Market);
}
catch (exception) {
    Market = navigator.language.toLocaleLowerCase();
    console.log("Catch block - Market : " + Market);
}

var PING_ALARM = "LKL_PINGALARM";
var UPDATE_ALARM = "LKL_UPDATEALARM";

chrome.runtime.onInstalled.addListener(function (details) {
    var defaultPC = "U526";
    if (details.reason == 'install') {
        console.log("Install method");
        var promise = new Promise((resolve, reject) => {
            chrome.storage.local.set({ "Migration": "True" });
            chrome.storage.local.set({ ExtnVer: ExtensionVersion });
            resolve("organic");
        });
        promise
            .then(getBrowserDefaultDetails)
            .then((details) => {

                chrome.storage.local.get(['pc', 'channel', 'muid', 'MachineID'], (items) => {
                    SendPingDetails("1", items.pc, items.channel, items.muid, items.MachineID);
                });

                //To redirect analytic redirection page while installing the extension
                chrome.storage.local.get(["MachineID", "channel"], (items) => {
                    var redirectionURL = "https://go.microsoft.com/fwlink/?linkid=2128904&trackingid=" + ExtensionId + "&partnercode=" + defaultPC + "&browser=gc" + "&mkt=" + Market;

                    if (details.channel) {
                        redirectionURL += "&channel=" + details.channel;
                    }
                    if (items.MachineID) {
                        redirectionURL += "&machineid=" + items.MachineID;
                    }
                    chrome.tabs.create({ url: redirectionURL });
                });

                //call to create daily ping alarm for new users
                let getPingAlarmInstall = chrome.alarms.get(PING_ALARM);
                getPingAlarmInstall.then(dailyPingAlarm);
            });
    }
    else if (details.reason == 'update') {
        console.log("Update method");

        //call to create daily ping alarm for existing users
        let getPingAlarmUpdate = chrome.alarms.get(PING_ALARM);
        getPingAlarmUpdate.then(dailyPingAlarm);

        //call to create update ping alarm for existing users
        let getupdateAlarm = chrome.alarms.get(UPDATE_ALARM);
        getupdateAlarm.then(updatePingAlarm);

        chrome.storage.local.get(["ExtnVersion", "Migration", "ExtensionUpdatepageshown"], function (items) {
            if (!items.ExtnVersion || items.ExtnVersion != chrome.runtime.getManifest().version) {

                chrome.storage.local.set({ "ExtnVersion": ExtensionVersion });
                if (!items.Migration && !items.ExtensionUpdatepageshown) {
                    console.log("Display Migration HTML");
                    showhtmlpage();
                }
            }
        });
    }
});

function getBrowserDefaultDetails(channelID) {
    return new Promise((resolve) => {
        // Fetching Partner Code and Channel details from browserdefaults.microsoft.com
        var details = {
            MachineID: guid(),
            pc: "U526",
            channel: channelID,
        };
        chrome.storage.local.get(['channel'], (items) => {

            // Fetching PC cookie value from browserdefaults.microsoft.com, store it in chrome storage and clear the PC cookie in browserdefaults.microsoft.com
            chrome.cookies.get({ url: browserDefaultsUrl, name: 'pc' }, function (cookie) {
                if (cookie) {
                    details.pc = cookie.value;
                    chrome.cookies.remove({ url: browserDefaultsUrl, name: 'pc' });
                }
                chrome.storage.local.set(details, () => { resolve(details) });
            });

            // Fetching PC cookie values from msnnewtab.microsoft.com, store it in chrome storage  and clear the PC cookie in msnnewtab.microsoft.com
            chrome.cookies.get({ url: msnNewTabUrl, name: 'pc' }, function (cookie) {
                if (cookie) {
                    details.pc = cookie.value;
                    chrome.cookies.remove({ url: msnNewTabUrl, name: 'pc' });
                }
                chrome.storage.local.set(details, () => { resolve(details) });
            });

            if (!items.channel) {
                chrome.cookies.get({ url: browserDefaultsUrl, name: 'channel' }, function (cookie) {
                    // Fetching channel cookie value, store it in chrome storage  and clear the Channel cookie in browserdefaults.microsoft.com
                    if (cookie) {
                        details.channel = cookie.value;
                        chrome.cookies.remove({ url: browserDefaultsUrl, name: 'channel' });
                    }
                    chrome.storage.local.set(details, () => { resolve(details) });
                });
            }
        });
    });
}

function dailyPingAlarm(alarm) {
    if (!alarm) {
        console.log("New alarm created: LKL_PING_ALARM ");
        chrome.alarms.create(PING_ALARM, {
            delayInMinutes: 1,
            periodInMinutes: 1440
        });
    }
    else {
        console.log("Existing Alarm: " + alarm.name);
    }
}

function updatePingAlarm(alarm) {
    console.log(alarm);
    if (!alarm) {
        console.log("New alarm created: LKL_UPDATE_ALARM ");
        chrome.alarms.create(UPDATE_ALARM, {
            delayInMinutes: 1
        });
    }
    else {
        console.log("Existing Alarm: " + alarm.name);
    }
}

//Call for Update Ping
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === UPDATE_ALARM) {
        chrome.storage.local.get(["pc", "MachineID", "channel", "muid"], (items) => {
            console.log("Update ping");
            SendPingDetails("3", items.pc, items.channel, items.muid, items.MachineID);
        });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === PING_ALARM) {
        chrome.storage.local.get(["pc", "channel", "muid", "MachineID"], (items) => {
            //Call for daily Ping
            SendPingDetails("2", items.pc, items.channel, items.muid, items.MachineID);

            //To redirect feedback page while uninstalling the extension
            var uninstallUrl = FeedbackFwlink + "&extnID=" + ExtensionId + "&mkt=" + Market + "&mid=" + items.MachineID + "&br=gc";
            //var uninstallUrl = FeedbackFwlink + "&extnID=lklfbkdigihjaaeamncibechhgalldgl" + "&mkt="+ Market + "&mid="+ MachineID +"&br=gc";
            chrome.runtime.setUninstallURL(uninstallUrl);
        });
    }
});

function showhtmlpage() {
    chrome.tabs.create({ url: "/Welcomepage/index.html?xid=10&bmkt=" + Market });
    chrome.storage.local.set({ "ExtensionUpdatepageshown": "True" });
}

function guid() {
    /** Function to create an unique machine id */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    var MachineGUID = s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    MachineGUID = MachineGUID.toLocaleUpperCase();
    chrome.storage.local.set({ "MachineID": MachineGUID });
    return MachineGUID;
}

function SendPingDetails(status, pc, channel, muid, machineId) {
    /**
    * Function create and send a ping cosmos
    * @param {any} status
    */

    var _pc = !pc ? "UWDF" : pc;
    var MachineID = (machineId == undefined || machineId == "" || machineId == null) ? guid() : machineId;
    var pingURL = 'http://g.ceipmsn.com/8SE/44?';
    var tVData = 'TV=is' + _pc + '|pk' + ExtensionName + '|tm' + browserLanguage + '|bv' + BrowserVersion + '|ex' + ExtensionId + '|es' + status;
    if (channel)
        tVData = tVData + "|ch" + channel;
    if (muid)
        tVData = tVData + "|mu" + muid;
    pingURL = pingURL + 'MI=' + MachineID + '&LV=' + ExtensionVersion + '&OS=' + OS + '&TE=37&' + tVData;
    pingURL = pingURL.replace(/\|/g, "%7c");  // For HTML Encoding
    pingURL = pingURL.replace(/\,/g, "%2c");  // For HTML Encoding
    fetch(pingURL);
};
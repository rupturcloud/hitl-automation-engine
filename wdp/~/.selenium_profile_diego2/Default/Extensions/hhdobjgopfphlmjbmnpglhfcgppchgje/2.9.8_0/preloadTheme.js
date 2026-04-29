(() => {
"use strict";
var __webpack_modules__ = ({});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/rspack_version
(() => {
__webpack_require__.rv = () => ("1.7.5")
})();
// webpack/runtime/rspack_unique_id
(() => {
__webpack_require__.ruid = "bundler=rspack@1.7.5";
})();

;// CONCATENATED MODULE: ./src/common/constants.ts
const SETTINGS_IDS = (/* unused pure expression or super */ null && ({
    PROXY_ENABLED: 'proxy.enabled',
    RATE_SHOW: 'rate.show',
    PREMIUM_FEATURES_SHOW: 'premium.features.show',
    USER_SET_PROMO_SHOW: 'user.set.promo.show',
    EXCLUSIONS: 'exclusions.list',
    HANDLE_WEBRTC_ENABLED: 'webrtc.handle.enabled',
    SELECTED_DNS_SERVER: 'dns.handle.server',
    SELECTED_CUSTOM_DNS_SERVER: 'custom.dns.handle.server',
    CONTEXT_MENU_ENABLED: 'context.menu.enabled',
    SELECTED_LOCATION_KEY: 'endpoints.selected.location',
    LOCATION_SELECTED_BY_USER_KEY: 'endpoints.location.selected.by.user',
    POLICY_AGREEMENT: 'policy.agreement',
    HELP_US_IMPROVE: 'help.us.improve',
    APPEARANCE_THEME: 'appearance.theme',
    CUSTOM_DNS_SERVERS: 'custom.dns.servers',
    QUICK_CONNECT: 'quick.connect',
    DEBUG_MODE_ENABLED: 'debug.mode.enabled',
    SELECTED_LANGUAGE: 'language.selected'
}));
var constants_AppearanceTheme = /*#__PURE__*/ function(AppearanceTheme) {
    AppearanceTheme["System"] = "System";
    AppearanceTheme["Dark"] = "Dark";
    AppearanceTheme["Light"] = "Light";
    return AppearanceTheme;
}({});
const APPEARANCE_THEME_DEFAULT = "System";
const THEME_URL_PARAMETER = 'theme';
var constants_QuickConnectSetting = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(QuickConnectSetting) {
    QuickConnectSetting["LastUsedLocation"] = "lastUsedLocation";
    QuickConnectSetting["FastestLocation"] = "fastestLocation";
    return QuickConnectSetting;
}({})));
const QUICK_CONNECT_SETTING_DEFAULT = "lastUsedLocation";
var constants_MessageType = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(MessageType) {
    MessageType["ADD_EVENT_LISTENER"] = "add.event.listener";
    MessageType["NOTIFY_LISTENERS"] = "notify.listeners";
    MessageType["REMOVE_EVENT_LISTENER"] = "remove.event.listener";
    MessageType["ADD_LONG_LIVED_CONNECTION"] = "add.long.lived.connection";
    MessageType["GET_POPUP_DATA"] = "get.popup.data";
    MessageType["GET_LIMITED_OFFER_DATA"] = "get.limited.offer.data";
    MessageType["FORCE_UPDATE_LOCATIONS"] = "force.update.locations";
    MessageType["SAVED_LOCATIONS_SAVE_TAB"] = "saved.locations.save.tab";
    MessageType["SAVED_LOCATIONS_ADD"] = "saved.locations.add";
    MessageType["SAVED_LOCATIONS_REMOVE"] = "saved.locations.remove";
    MessageType["GET_OPTIONS_DATA"] = "get.options.data";
    MessageType["GET_CONSENT_DATA"] = "get.consent.data";
    MessageType["SET_CONSENT_DATA"] = "set.consent.data";
    MessageType["GET_VPN_FAILURE_PAGE"] = "get.vpn.failure.page";
    MessageType["OPEN_OPTIONS_PAGE"] = "open.options.page";
    MessageType["SET_SELECTED_LOCATION"] = "set.selected.location";
    MessageType["DEAUTHENTICATE_USER"] = "deauthenticate.user";
    MessageType["UPDATE_AUTH_CACHE"] = "update.auth.cache";
    MessageType["GET_CAN_CONTROL_PROXY"] = "get.can.control.proxy";
    MessageType["ENABLE_PROXY"] = "enable.proxy";
    MessageType["DISABLE_PROXY"] = "disable.proxy";
    MessageType["ADD_URL_TO_EXCLUSIONS"] = "add.to.exclusions";
    MessageType["REMOVE_EXCLUSION"] = "remove.exclusion";
    MessageType["DISABLE_VPN_BY_URL"] = "disable.vpn.by.url";
    MessageType["ENABLE_VPN_BY_URL"] = "enable.vpn.by.url";
    MessageType["DISABLE_OTHER_EXTENSIONS"] = "disable.other.extensions";
    MessageType["IS_AUTHENTICATED"] = "is.authenticated";
    MessageType["CLEAR_PERMISSIONS_ERROR"] = "clear.permissions.error";
    MessageType["CHECK_PERMISSIONS"] = "check.permissions";
    MessageType["GET_EXCLUSIONS_INVERTED"] = "get.exclusions.inverted";
    MessageType["GET_EXCLUSIONS_DATA"] = "get.exclusions.data";
    MessageType["SET_EXCLUSIONS_MODE"] = "set.exclusions.mode";
    MessageType["TOGGLE_EXCLUSION_STATE"] = "toggle.exclusion.state";
    MessageType["RESET_SERVICE_DATA"] = "reset.service.data";
    MessageType["CLEAR_EXCLUSIONS_LIST"] = "clear.exclusions.list";
    MessageType["TOGGLE_SERVICES"] = "toggle.services";
    MessageType["GET_SETTING_VALUE"] = "get.setting.value";
    MessageType["SET_SETTING_VALUE"] = "set.setting.value";
    MessageType["GET_USERNAME"] = "get.username";
    MessageType["UPDATE_MARKETING_CONSENT"] = "update.marketing.consent";
    MessageType["GET_SELECTED_LOCATION"] = "get.selected.location";
    MessageType["CHECK_IS_PREMIUM_TOKEN"] = "check.is.premium.token";
    MessageType["SET_NOTIFICATION_VIEWED"] = "set.notification.viewed";
    MessageType["OPEN_TAB"] = "open.tab.action";
    MessageType["REPORT_BUG"] = "post.report.bug";
    MessageType["OPEN_FORWARDER_URL_WITH_EMAIL"] = "open.forwarder.url.with.email";
    MessageType["ADD_REGULAR_EXCLUSIONS"] = "add.regular.exclusions";
    MessageType["ADD_SELECTIVE_EXCLUSIONS"] = "add.selective.exclusions";
    MessageType["SET_FLAG"] = "set.flag";
    MessageType["GET_GENERAL_EXCLUSIONS"] = "get.general.exclusions";
    MessageType["GET_SELECTIVE_EXCLUSIONS"] = "get.selective.exclusions";
    MessageType["OPEN_FREE_GBS_PAGE"] = "open.free.gbs.page";
    MessageType["GET_BONUSES_DATA"] = "get.bonuses.data";
    MessageType["RESTORE_EXCLUSIONS"] = "restore.exclusions";
    MessageType["ADD_EXCLUSIONS_MAP"] = "add.exclusions.map";
    MessageType["HIDE_RATE_MODAL_AFTER_RATE"] = "hide.rate.modal.after.rate";
    MessageType["HIDE_RATE_MODAL_AFTER_CANCEL"] = "hide.rate.modal.after.cancel";
    MessageType["HIDE_MOBILE_EDGE_PROMO_BANNER"] = "hide.mobile.edge.promo.banner";
    MessageType["HANDLE_CUSTOM_DNS_LINK"] = "handle.custom.dns.link";
    MessageType["ADD_CUSTOM_DNS_SERVER"] = "add.custom.dns.server";
    MessageType["EDIT_CUSTOM_DNS_SERVER"] = "edit.custom.dns.server";
    MessageType["REMOVE_CUSTOM_DNS_SERVER"] = "remove.custom.dns.server";
    MessageType["RESTORE_CUSTOM_DNS_SERVERS_DATA"] = "restore.custom.dns.servers.data";
    MessageType["SET_HINT_POPUP_VIEWED"] = "set.hint.popup.viewed";
    MessageType["MARK_REGION_NOTICE_AS_SHOWN"] = "mark.region.notice.as.shown";
    MessageType["GET_LOGS"] = "get.logs";
    MessageType["GET_APP_VERSION"] = "get.app.version";
    MessageType["UPDATE_LISTENERS"] = "update.listeners";
    /**
     * Re-fetches locations from the server, populating backend-provided pings.
     * Only locations without a backend ping are measured locally.
     */ MessageType["REFRESH_LOCATIONS"] = "refresh.locations";
    MessageType["TELEMETRY_EVENT_SEND_PAGE_VIEW"] = "telemetry.event.send.page.view";
    MessageType["TELEMETRY_EVENT_SEND_CUSTOM"] = "telemetry.event.send.custom";
    MessageType["TELEMETRY_EVENT_REMOVE_OPENED_PAGE"] = "telemetry.event.remove.opened.page";
    MessageType["STATISTICS_GET_BY_RANGE"] = "statistics.get.by.range";
    MessageType["STATISTICS_CLEAR"] = "statistics.clear";
    MessageType["STATISTICS_SET_IS_DISABLED"] = "statistics.set.is.disabled";
    MessageType["SEND_WEB_AUTH_ACTION"] = "send.web.auth.action";
    MessageType["GET_STARTUP_DATA"] = "get.startup.data";
    MessageType["SET_INTERFACE_LANGUAGE"] = "set.interface.language";
    MessageType["GET_INTERFACE_LANGUAGE"] = "get.interface.language";
    return MessageType;
}({})));
const FLAGS_FIELDS = (/* unused pure expression or super */ null && ({
    IS_NEW_USER: 'isNewUser',
    SHOW_NEWSLETTER: 'showNewsletter',
    SHOW_ONBOARDING: 'showOnboarding',
    SHOW_UPGRADE_SCREEN: 'showUpgradeScreen',
    SALE_SHOW: 'saleShow',
    SHOULD_SHOW_RATE_MODAL: 'shouldShowRateModal'
}));
/**
 * Absolute URL for the consent page.
 */ const CONSENT_PAGE_URL = '/consent.html';
var constants_SubscriptionType = /*#__PURE__*/ (/* unused pure expression or super */ null && (function(SubscriptionType) {
    SubscriptionType["Monthly"] = "MONTHLY";
    SubscriptionType["Yearly"] = "YEARLY";
    SubscriptionType["TwoYears"] = "TWO_YEARS";
    return SubscriptionType;
}({})));
const CUSTOM_DNS_ANCHOR_NAME = 'custom-dns';
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = (/* unused pure expression or super */ null && (ONE_SECOND_MS * 60));
const ONE_HOUR_MS = (/* unused pure expression or super */ null && (ONE_MINUTE_MS * 60));
const ONE_DAY_MS = (/* unused pure expression or super */ null && (ONE_HOUR_MS * 24));

;// CONCATENATED MODULE: ./src/common/preloadTheme.ts

/**
 * this script is injected at the top of the page to display
 * the desired color theme before the main bundle is loaded
 */ (()=>{
    const urlSearchParams = new URLSearchParams(window.location.search);
    const theme = urlSearchParams.get((/* inlined export .THEME_URL_PARAMETER */"theme"));
    if (!theme) {
        return;
    }
    // the color changes through the selector
    // so that it could be rewritten by css from the main bundle
    if (theme === constants_AppearanceTheme.Dark) {
        document.body.classList.add('body_dark');
    } else if (theme === constants_AppearanceTheme.Light) {
        document.body.classList.add('body_light');
    }
    // Remove theme parameter from the URL. Removing is needed to avoid chrome opening the new options page every
    // time
    urlSearchParams.delete((/* inlined export .THEME_URL_PARAMETER */"theme"));
    let newSearchString = urlSearchParams.toString();
    newSearchString = newSearchString ? `?${newSearchString}` : '';
    const newUrl = `${window.location.origin}${window.location.pathname}${newSearchString}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl); // Update the URL without reloading the page
})();

})()
;
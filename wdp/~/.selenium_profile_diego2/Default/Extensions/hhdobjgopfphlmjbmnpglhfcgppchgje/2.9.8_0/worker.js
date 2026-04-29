(() => {
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
/* eslint-disable no-console */ /**
 * Worker receives url from the offscreen document and fetches it.
 * For more details on this worker read ProxyAuthTrigger.
 * @param e Message event
 */ onmessage = (e)=>{
    // cant use logger since local storage is not available here
    console.log(`worker created by offscreen document received: ${e.data}`);
    fetch(e.data).then(()=>{
        console.log('url fetched successfully');
    }).catch((ex)=>{
        console.log(`during fetching: ${e.data}, error occurred: ${ex}`);
    });
};

})()
;
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: "https://ig-story-downloader.com/welcome?utm_source=extension&utm_medium=install"
        });
    }
});

if (chrome.runtime.setUninstallURL) {
    const uninstallUrl = `https://ig-story-downloader.com/feedback`;
    chrome.runtime.setUninstallURL(uninstallUrl);
}

(() => {
    var e = {
        178: e => {
                e.exports = {
                    t: "x-ig-www-claim",
                    i: "x-ig-app-id",
                    u: "x-asbd-id",
                    l: "fb_dtsg",
                    _: "x-csrftoken",
                    h: "x-instagram-ajax",
                    m: "x-requested-with",
                    p: "x-ig-app-id_upload",
                    g: 1,
                    $: 2,
                    v: "jpg",
                    q: "mp4",
                    P: "doc_id",
                    I: "baseUserFeedInfo",
                    S: "scrollUserFeedInfo",
                    U: "userFeed"
                }
            }
        },
        t = {};
    function n(r) {
        var o = t[r];
        if (undefined !== o) return o.exports;
        var i = t[r] = {
            exports: {}
        };
        return e[r](i, i.exports, n), i.exports
    }
    n.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return n.d(t, {
            a: t
        }), t
    }, n.d = (e, t) => {
        for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
            enumerable: true,
            get: t[r]
        })
    }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        const e = {
                k: "*://*.instagram.com/*",
                R: function(e, t) {
                    e < 0 || chrome.tabs.get(e, (function(e) {
                        t(e.url)
                    }))
                },
                C: function(e) {
                    const t = this;
                    chrome.tabs.query({
                        url: [t.k]
                    }, (function(n) {
                        let r = [];
                        n.forEach((function(n) {
                            r.push(n.id), t.H(r, e)
                        }))
                    }))
                },
                H: function(e, t) {
                    const n = this;
                    if (0 === e.length) return t(false);
                    let r = e.pop();
                    chrome.tabs.sendMessage(r, "isBulkDownloadNowInTab", (function(r) {
                        r && t(true), n.H(e, t)
                    }))
                }
            },
            t = {
                N: [],
                F: function(e) {
                    let t = e.match(/variables=([^&]+)/);
                    return t && t[1] || null
                },
                T: function(e) {
                    let t = e.match(/query_hash=([^&]+)/);
                    return t && t[1] || null
                },
                M: function() {
                    undefined === NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), undefined === HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach)
                },
                O: function(e) {
                    let t = new Date,
                        n = new Date(t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate())
                        .getTime();
                    return Math.floor((n - 864e5 * e) / 1e3)
                },
                D: function(e) {
                    let t = [];
                    return e.forEach((function(e) {
                        t = t.concat(e)
                    })), t
                },
                A() {
                    const e = Math.floor(5 * Math.random()) + 6;
                    let t = "";
                    for (let n = 0; n < e; n++) {
                        t += Math.floor(10 * Math.random())
                            .toString()
                    }
                    return t
                },
                B: function(e, t) {
                    let n = new XMLHttpRequest;
                    n.open("GET", e, true), n.responseType = "blob", n.onreadystatechange = function() {
                        4 === this.readyState && (200 === this.status ? t(this.response) : t())
                    }, n.send()
                },
                L: function() {
                    let e = location.pathname.match(/(?<=\/p\/|\/reel\/|\/reels\/videos\/|\/reels\/).*?(?=\/|$)/);
                    return e && e[0]
                },
                J: function(e) {
                    if (!e || !e.tagName) return null;
                    let n;
                    if ("a" === e.tagName.toLowerCase()) n = e.getAttribute("href");
                    else {
                        let t = e.querySelector('a[href*="/p/"], a[href*="/tv/"], a[href*="/reel/"]');
                        t && t.hasAttribute("href") && (n = t.getAttribute("href"))
                    }
                    if (n) {
                        let e = n.match(/\/(tv|p|reel)\/([^/]+)/);
                        return e && e[2]
                    }
                    return t.V() || t.j() ? t.L() : undefined
                },
                G: function() {
                    return "/" === location.pathname && "instagram.com" === location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[name="username"]')
                },
                X() {
                    let e = location.pathname.match("^/reels/audio/[0-9]+/?$");
                    return e && e[0]
                },
                V() {
                    let e = location.pathname.match("^/reel/[^/]+/?$");
                    return e && e[0]
                },
                Z: function() {
                    return /\/*.+\/saved\/all-posts\/$|\/saved\/*.+\/[0-9]+\/$/.test(location.pathname)
                },
                W: function() {
                    return !document.querySelector('[role="dialog"]') && (null !== document.querySelector('a[href*="/tagged/"]') || null !== document.querySelector('a[href*="/followers/"]') || null !== document.querySelector('a[href*="/following/"]'))
                },
                Y: function() {
                    let e = location.pathname.match("^/reels/.*/$");
                    return e && e[0]
                },
                K: function() {
                    return this.W() && location.href.includes("/tagged/")
                },
                ee: function() {
                    return this.W() && location.href.includes("/guides/")
                },
                te: function() {
                    return null !== document.querySelector('a[href^="/accounts/edit"]')
                },
                ne: function() {
                    return this.te() && location.href.includes("/saved/")
                },
                re: function() {
                    return /instagram\.com\/stories\/[^/]+\//.test(location.href)
                },
                oe: function() {
                    return "/explore/" === location.pathname
                },
                ie: function() {
                    return /instagram\.com\/explore\/locations\/[^/]+\//.test(location.href)
                },
                se: function() {
                    return /instagram\.com\/explore\/tags\/[^/]+\//.test(location.href)
                },
                j: function() {
                    return /instagram.com\/(p|tv|reel)\/[^/]+\//.test(location.href)
                },
                ue: function() {
                    return top !== self
                },
                ae: function() {
                    return location.pathname.includes("stories/highlights")
                },
                ce: function(e, t) {
                    if (!e) return null;
                    let n = e.match(/\/([^\/?]+)(?:$|\?)/);
                    return n = n && n[1], n ? (t && (n = t + "_" + n), n) : null
                },
                le: function(e) {
                    return !("string" != typeof e || -1 != e.indexOf("blob:") || !e.match(/\.(png|jpg|mp4|flv)/))
                },
                _e: function(e) {
                    t.fe("getQueryHashes", e)
                },
                de: function(e, t, n) {
                    if (!e || !e.url) return n();
                    var r = {
                        url: e.url
                    };
                    e.filename && (r.filename = e.filename), chrome.downloads.download(r, (function(t) {
                        t ? n(t) : chrome.downloads.download({
                            url: e.url
                        }, (function(e) {
                            n(e)
                        }))
                    }))
                },
                he: function(e, t) {
                    this.fe({
                        action: "downloadFile",
                        options: {
                            url: e.url,
                            filename: e.filename,
                            isStory: undefined !== e.isStory
                        }
                    }, (function(e) {
                        "function" == typeof t && t(e)
                    }))
                },
                me: function(e, t, n) {
                    e.sort((function(e, r) {
                        var o = parseInt(e[t]),
                            i = parseInt(r[t]);
                        return n ? o < i ? 1 : o > i ? -1 : 0 : o > i ? 1 : o < i ? -1 : 0
                    }))
                },
                pe: function(e) {
                    var t, n, r;
                    for (r = e.length - 1; r > 0; r--) t = Math.floor(Math.random() * (r + 1)), n = e[r], e[r] = e[t], e[t] = n;
                    return e
                },
                ge: function() {
                    if (location.href.indexOf("instagram.com/p/") > -1) return null;
                    var e = location.href.match(/instagram\.com\/([^\/]+)/);
                    return e && e[1].trim() || null
                },
                fe: function(e, t) {
                    undefined === t ? chrome.runtime.sendMessage(e) : chrome.runtime.sendMessage(e, t)
                },
                $e: function(e) {
                    var t = 0;
                    return e.querySelectorAll("ul li")
                        .forEach((function(e) {
                            e.querySelector("video") ? t++ : e.querySelectorAll("img")
                                .forEach((function(e) {
                                    e.width > 200 && e.height > 200 && t++
                                }))
                        })), t > 1
                },
                we: function(e) {
                    if (!e) return 0;
                    for (var t = e.querySelectorAll("div div div div"), n = 0, r = []; t[n];) {
                        var o = t[n];
                        if (n++, o.offsetHeight < 10 && o.offsetHeight === o.offsetWidth && o.parentElement.offsetWidth > 20 * o.parentElement.offsetHeight) {
                            var i = o.parentElement.children,
                                s = true;
                            if (i.forEach((function(e) {
                                    e.offsetHeight < 10 && e.offsetHeight === e.offsetWidth || (s = false)
                                })), i.length > 1 && s) {
                                r = i;
                                break
                            }
                        }
                    }
                    var u = 0,
                        a = 0;
                    return r.forEach((function(e, t) {
                        e.classList.length > a && (a = e.classList.length, u = t)
                    })), u
                },
                ve: function(e) {
                    var t = Math.floor(parseInt(e) / 60)
                        .toString(),
                        n = Math.floor(parseInt(e) % 60)
                        .toString();
                    return 1 === t.length && (t = "0" + t), 1 === n.length && (n = "0" + n), t + ":" + n
                },
                ye: function() {
                    let e = document.querySelector("section main header section h2,section main header section h1,section main header section h3");
                    if (e) {
                        let t = e.closest("section");
                        return t && (t.style.overflow = "visible"), t && t.querySelector("div>div") || t || null
                    }
                },
                be: function(e) {
                    return e.querySelector("video")
                },
                qe: function(e) {
                    var t = e.getAttribute("src");
                    if (t) return t;
                    var n = e.querySelector("source");
                    return n && (t = n.getAttribute("src")) ? t : null
                },
                Pe: function(e) {
                    if (e.querySelector('svg path[d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"]')) return true;
                    {
                        let t = e.querySelector("video,img"),
                            n = getComputedStyle(t);
                        return this.xe(parseInt(n.width) / parseInt(n.height))
                    }
                },
                xe: e => e >= .5 && e <= .6 || e === 9 / 16,
                Ie: function(e) {
                    if (!e) return null;
                    var t = e.getAttribute("srcset");
                    if (t) {
                        var n = {};
                        t.split(",")
                            .forEach((function(e) {
                                var t = e.split(" "),
                                    r = t[1].replace(/[^\d]/, "");
                                n[r] || (n[r] = t[0])
                            }));
                        var r = 0;
                        for (var o in n) + o > +r && (r = o);
                        var i = n[r]
                    }
                    return "string" == typeof i && i.match(new RegExp("\\.(jpg|png)")) || (i = e.getAttribute("src")), i
                },
                Se: function(e) {
                    let t = null,
                        n = e.querySelectorAll("img[src], img[srcset]");
                    if (1 === n.length) t = n[0];
                    else if (n.length > 1)
                        for (let e = 0; n[e]; e++) n[e].width < 200 || n[e].height < 200 || (n[e].getAttribute("src") || n[e].getAttribute("srcset")) && (t = t || n[e], n[e].width > t.width && n[e].height > t.height && (t = n[e]));
                    return t || null
                },
                Ue: function(e, t) {
                    chrome.runtime.sendMessage({
                        action: "requestUserId",
                        userName: e
                    }, (function(e) {
                        if (!e || e && e.err) return t(null);
                        t(e.userId)
                    }))
                },
                ke: function(e, t) {
                    chrome.runtime.sendMessage({
                        action: "requestUserPostCount",
                        userName: e
                    }, (function(e) {
                        if (!e || e && e.err) return t(null);
                        t(e.postCount)
                    }))
                },
                Re: function(e, t) {
                    let n = e.width || e.config_width || null,
                        r = t.width || t.config_width || null,
                        o = e.height || e.config_height || null,
                        i = t.height || t.config_height || null;
                    return n && r && n !== o && r !== i ? n !== r ? r > n ? 1 : -1 : i > o ? 1 : -1 : 0
                },
                Ce: function(e, t) {
                    t && !Array.isArray(t) && (t = [t]);
                    for (var n, r = [], o = {
                            "{": 0,
                            "[": 0
                        }, i = {
                            "}": "{",
                            "]": "["
                        }, s = /[{}\]\[":0-9.,-]/, u = /[\r\n\s\t]/, a = "", c = 0; n = e[c]; c++)
                        if ('"' !== n) s.test(n) ? (a += n, "{" === n || "[" === n ? (o["{"] || o["["] || (a = n), o[n]++) : "}" !== n && "]" !== n || (o[i[n]]--, o["{"] || o["["] || r.push(a))) : "t" === n && "true" === e.substr(c, 4) ? (a += "true", c += 3) : "f" === n && "false" === e.substr(c, 5) ? (a += "false", c += 4) : "n" === n && "null" === e.substr(c, 4) ? (a += "null", c += 3) : u.test(n) || (o["{"] = 0, o["["] = 0, a = "");
                        else {
                            for (var l = c; - 1 !== l && (l === c || "\\" === e[l - 1]);) l = e.indexOf('"', l + 1); - 1 === l && (l = e.length - 1), a += e.substr(c, l - c + 1), c = l
                        } var _, f = [];
                    for (c = 0; _ = r[c]; c++)
                        if ("{}" !== _ && "[]" !== _) try {
                            t ? t.every((function(e) {
                                return e.test(_)
                            })) && f.push(JSON.parse(_)) : f.push(JSON.parse(_))
                        } catch (e) {}
                    return f
                },
                He: function() {
                    return Array.from(document.querySelectorAll("section"))
                        .find((e => !e.closest("[hidden]")))
                },
                Ne: function() {
                    const e = this.He();
                    return Array.from(e.querySelectorAll("div"))
                        .find((e => {
                            let t = e.clientHeight || e.offsetHeight;
                            if (t > 0 && t < 6) return e.parentElement
                        }))
                },
                Fe: function() {
                    const e = this.Ne();
                    if (!e) return 0;
                    let t = e.querySelectorAll("div[style]");
                    return t && t.length ? (t = t[t.length - 1].parentElement || null, null == t ? 0 : e.children && Array.from(e.children)
                        .indexOf(t) || 0) : 0
                },
                Te(e) {
                    e.length > 28 && (e = e.substr(0, e.length - 28));
                    const t = "abcdefghijklmnopqrstuvwxyz",
                        n = t.toUpperCase() + t + "0123456789-_";
                    let r = BigInt(0);
                    for (let t of e) {
                        let e = n.indexOf(t);
                        r *= BigInt(64), r += BigInt(e)
                    }
                    return r.toString()
                }
            },
            r = t,
            o = {
                Ee: function(t) {
                    const n = this;
                    let o = t.url,
                        i = r.F(o),
                        s = r.T(o);
                    if (i && s) {
                        i = decodeURIComponent(i);
                        try {
                            i = JSON.parse(i)
                        } catch (e) {}
                        i.shortcode && i.child_comment_count ? n.Me("post", s) : i.id && i.first && i.after && e.R(t.tabId, (function(e) {
                            /\/channel\/|\/tagged\/|\/guides\//.test(e) ? e.includes("/channel/") && n.Me("channel", s) : n.Me("owner", s)
                        }))
                    }
                },
                Oe: function() {
                    chrome.storage.local.get("query_hashes", (function(e) {
                        e.query_hashes || chrome.storage.local.set({
                            query_hashes: {
                                owner: "8c2a529969ee035a5063f2fc8602a0fd",
                                post: "2efa04f61586458cef44441f474eee7c",
                                channel: "bc78b344a68ed16dd5d7f264681c4c76"
                            }
                        })
                    })), chrome.webRequest.onBeforeSendHeaders.addListener(this.Ee.bind(this), {
                        urls: ["*://*.instagram.com/graphql/query/?*"],
                        types: ["xmlhttprequest"]
                    }, ["requestHeaders"])
                },
                Me: function(e, t) {
                    chrome.storage.local.get("query_hashes", (function(n) {
                        n.query_hashes[e] = t, chrome.storage.local.set({
                            query_hashes: n.query_hashes
                        })
                    }))
                },
                _e: function() {
                    return chrome.storage.local.get("query_hashes")
                        .then((function(e) {
                            if (e.query_hashes) return e.query_hashes;
                            throw "No query_hashes"
                        }))
                }
            };
        var i = n(178),
            s = n.n(i);
        const u = {
                De: {
                    "x-instagram-ajax": "017fef72480c",
                    "x-asbd-id": "437806",
                    "x-requested-with": "XMLHttpRequest",
                    "x-ig-app-id": "936619743392459",
                    "x-ig-app-id_upload": "1217981644879628"
                },
                Ae: function(e) {
                    this.Be()
                        .then((function(t) {
                            chrome.storage.local.set({
                                headers: {
                                    ...t,
                                    ...e
                                }
                            })
                        }))
                        .catch((function() {
                            chrome.storage.local.set({
                                headers: e
                            })
                        }))
                },
                Be: function() {
                    return chrome.storage.local.get("headers")
                        .then((function(e) {
                            if (e.headers) return e.headers;
                            throw "No headers"
                        }))
                },
                Le: function(e) {
                    return this.Be()
                        .then((function(t) {
                            let n = [];
                            for (let r = 0; e[r]; r++) {
                                if (!t.hasOwnProperty(e[r])) throw `Not found requested header [${e[r]}]`;
                                n[e[r]] = t[e[r]]
                            }
                            return n
                        }))
                },
                Je(e) {
                    let t = e.requestBody || null;
                    if (!t) return;
                    let n = t.formData && t.formData.fb_dtsg || null;
                    n = n && n.length && n[0] || null, n && chrome.storage.local.set({
                        fb_dtsg: n
                    })
                },
                Qe: function(e) {
                    const t = [s()
                            .t, s()
                            .h, s()
                            .u, s()
                            .m, s()
                            .i
                        ],
                        n = {};
                    for (let r = 0; e.requestHeaders[r]; r++) {
                        let o = e.requestHeaders[r];
                        t.includes(o.name.toLowerCase()) && o.value.length && (n[o.name.toLowerCase()] = o.value), this.Ae(n)
                    }
                },
                Ve: function(e) {
                    const t = s()
                        .i,
                        n = {};
                    for (let r = 0; e.requestHeaders[r]; r++) {
                        let o = e.requestHeaders[r];
                        if (t === o.name.toLowerCase() && o.value.length) {
                            n[t] = o.value;
                            break
                        }
                        this.Ae(n)
                    }
                },
                Oe: function() {
                    const e = this;
                    e.Be()
                        .catch((function() {
                            e.Ae(e.De)
                        })), chrome.webRequest.onBeforeSendHeaders.addListener(e.Qe.bind(e), {
                            urls: ["*://*.instagram.com/*"],
                            types: ["xmlhttprequest"]
                        }, ["requestHeaders"]), chrome.webRequest.onBeforeRequest.addListener(e.Je.bind(e), {
                            urls: ["*://*.instagram.com/*"],
                            types: ["xmlhttprequest"]
                        }, ["requestBody"]), chrome.webRequest.onBeforeSendHeaders.addListener(e.Ve.bind(e), {
                            urls: ["*://*.instagram.com/rupload_igphoto/*", "*://*.instagram.com/rupload_igvideo/*", "*://*.instagram.com/api/v1/web/create/*"],
                            types: ["xmlhttprequest"]
                        }, ["requestHeaders"])
                }
            },
            a = {
                je: function() {
                    return chrome.cookies ? chrome.cookies.getAll({
                            url: "https://*.instagram.com"
                        })
                        .then((function(e) {
                            let t = {};
                            if (e.forEach((function(e) {
                                    t[e.name] = e.value
                                })), t.ds_user_id && t.sessionid) return t;
                            throw "Not authorized"
                        })) : Promise.resolve()
                },
                Ge: function() {
                    return this.je()
                        .then((function(e) {
                            return e && e.csrftoken || null
                        }))
                }
            },
            c = {
                Xe: {
                    userFeed: {
                        title: "PolarisProfilePostsQuery_instagramRelayOperation",
                        doc_id: {
                            baseUserFeedInfo: {
                                defaultValue: "9066276850131169",
                                regexPattern: /PolarisProfilePostsQuery_instagramRelayOperation".*?e\.exports\s*=\s*"(\d+)"/
                            },
                            scrollUserFeedInfo: {
                                defaultValue: "9310670392322965",
                                regexPattern: /PolarisProfilePostsTabContentQuery_connection_instagramRelayOperation",\[\],\(function\(a,b,c,d,e,f\){e\.exports="(\d+)"/
                            }
                        }
                    }
                },
                Ze() {
                    return this.ze([s()
                        .U
                    ])
                },
                ze(e) {
                    let t = this;
                    return new Promise((async function(n, r) {
                        if (!e || !e.length) return r({
                            error: "no_doc_tasks"
                        });
                        let o = Array.from(document.querySelectorAll('script[src*="static.cdninstagram.com/rsrc.php"]'))
                            .map((function(e) {
                                return e.src
                            })),
                            i = Array.from(performance.getEntries())
                            .filter((function(e) {
                                return e.name.includes(".js") && e.name.includes("static.cdninstagram.com/rsrc.php")
                            }))
                            .map((function(e) {
                                return e.name
                            })),
                            s = o;
                        if (i.forEach((function(e) {
                                s.includes(e) || s.push(e)
                            })), !s.length) return r({
                            error: "no_doc_id_scripts"
                        });
                        let u = [];
                        for (let n = 0; n < s.length; ++n) {
                            let r = await fetch(s[n], {})
                                .catch((function() {}));
                            if (!r) continue;
                            let o = await r.text()
                                .catch((function() {}));
                            if (o) {
                                for (let n of e) {
                                    if (u.includes(n)) continue;
                                    let e = o.indexOf(t.Xe[n].title);
                                    if (e > 0) {
                                        o = o.substring(e);
                                        for (let e in t.Xe[n].doc_id) {
                                            if (t.Xe[n].doc_id[e].regexPattern) {
                                                let r = o.match(t.Xe[n].doc_id[e].regexPattern),
                                                    i = r && r[1] || null;
                                                if (i) {
                                                    u.push(e), await t.We(e, i);
                                                    continue
                                                }
                                            }
                                            if ((t.Xe[n].doc_id[e].token && o.indexOf(t.Xe[n].doc_id[e].token) || -1) < 0) continue;
                                            const r = /params:\s*{\s*id:\s*"(\d+)"\s*,/.exec(o);
                                            let i = null;
                                            r && (i = r[1]), i && (u.push(e), await t.We(e, i))
                                        }
                                    }
                                }
                                if (u.length >= e.length) break
                            }
                        }
                        return u.length < e.length ? r({
                            error: "not_found_requested_keys",
                            found: u,
                            requested: e
                        }) : n()
                    }))
                },
                We: (e, t) => chrome.storage.local.get(s()
                        .P)
                    .then((function(n) {
                        let r = n.doc_id || {};
                        return r[e] = {
                            value: t,
                            updated_value_tm: Date.now()
                        }, chrome.storage.local.set({
                            doc_id: r
                        })
                    })),
                Ye(e) {
                    let t = this;
                    return new Promise((function(n) {
                        return t.Ke(e)
                            .then((function(e) {
                                return n(e)
                            }))
                            .catch((function(n) {
                                return t.ze([s()
                                        .U
                                    ])
                                    .then((function() {
                                        return t.Ke(e)
                                    }))
                            }))
                            .catch((function(r) {
                                let o = t.Xe[s()
                                    .U].doc_id[e] || null;
                                n(o.defaultValue || null)
                            }))
                    }))
                },
                Ke: e => new Promise((function(t, n) {
                    return chrome.storage.local.get(s()
                            .P)
                        .then((function(r) {
                            let o = r.doc_id && r.doc_id[e] || null;
                            return o = o && o.value, o && t(o) || n()
                        }))
                }))
            },
            l = {
                et: (e, t) => (t = t || {}, fetch(e, t)
                    .then((function(t) {
                        if (200 !== t.status && 202 !== t.status) throw `request error [${e}]`;
                        return t
                    }))),
                tt(e, t) {
                    return this.et(e, t)
                        .then((function(e) {
                            return e.json()
                        }))
                },
                nt: function(e, t) {
                    return this.et(e, t)
                        .then((function(e) {
                            return e.text()
                        }))
                },
                rt(e) {
                    const t = this,
                        n = [s()
                            .h, s()
                            .u, s()
                            .i, s()
                            .m
                        ];
                    let r;
                    return a.Ge()
                        .then((function(e) {
                            return r = e, u.Le(n)
                        }))
                        .then((function(n) {
                            return t.tt(e, {
                                headers: {
                                    ...n,
                                    "x-csrftoken": r
                                }
                            })
                        }))
                },
                ot(e, t) {
                    const n = this,
                        o = [s()
                            .u, s()
                            .i
                        ];
                    let i;
                    return r.fe(), a.Ge()
                        .then((async function(e) {
                            return e || (e = await n.it()), i = e, u.Le(o)
                        }))
                        .then((function(r) {
                            return n.tt(e, {
                                headers: {
                                    ...r,
                                    "x-csrftoken": i,
                                    "x-fb-friendly-name": "PolarisProfilePostsQuery",
                                    accept: "*/*",
                                    "content-type": "application/x-www-form-urlencoded"
                                },
                                credentials: "include",
                                method: "POST",
                                body: new URLSearchParams(t)
                                    .toString()
                            })
                        }))
                },
                st(e, t, n) {
                    const r = this,
                        o = [s()
                            .h, s()
                            .p, s()
                            .u, s()
                            .m
                        ];
                    let i;
                    return n = n || {}, a.Ge()
                        .then((async function(e) {
                            return e || (e = await r.it()), i = e, u.Le(o)
                        }))
                        .then((function(o) {
                            return o[s()
                                .i] = o[s()
                                .p], delete o[s()
                                .p], r.et(e, {
                                method: "POST",
                                body: t,
                                headers: {
                                    ...o,
                                    ...n,
                                    "x-csrftoken": i
                                }
                            })
                        }))
                },
                it: () => new Promise((function(e, t) {
                    chrome.runtime.sendMessage("getCsrftoken", (function(n) {
                        n ? e(n) : t()
                    }))
                })),
                ut: () => new Promise((function(e, t) {
                    chrome.runtime.sendMessage("getCookies", (function(n) {
                        n ? e(n) : t()
                    }))
                })),
                ct: function(e, t) {
                    const n = this;
                    if (!e) return t(null);
                    const r = `https://www.instagram.com/p/${e}/`,
                        o = [s()
                            .h, s()
                            .u, s()
                            .i, s()
                            .m
                        ];
                    let i;
                    return a.Ge()
                        .then((function(e) {
                            return i = e, u.Le(o)
                        }))
                        .then((function(e) {
                            return n.nt(r, {
                                headers: {
                                    ...e,
                                    "x-csrftoken": i,
                                    accept: "text/html"
                                }
                            })
                        }))
                        .then((function(e) {
                            t(e)
                        }))
                },
                lt: function(e, t) {
                    u.Be()
                        .then((n => {
                            let r = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + e,
                                o = {
                                    method: "GET",
                                    headers: n
                                };
                            o.headers["content-type"] = "application/x-www-form-urlencoded", this.tt(r, o)
                                .then((function(e) {
                                    let n = e && e.data && e.data.user && e.data.user.id || null;
                                    if (!n) throw `Not found userId [${JSON.stringify(e)}]`;
                                    t({
                                        userId: n
                                    })
                                }))
                                .catch((function() {
                                    t({
                                        error: 1
                                    })
                                }))
                        }))
                },
                _t: function(e, t) {
                    u.Be()
                        .then((n => {
                            let r = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + e,
                                o = {
                                    method: "GET",
                                    headers: n
                                };
                            o.headers["content-type"] = "application/x-www-form-urlencoded", this.tt(r, o)
                                .then((function(e) {
                                    let n = e && e.data && e.data.user && e.data.user.edge_owner_to_timeline_media && e.data.user.edge_owner_to_timeline_media.count || null;
                                    if (!n) throw `Not found postCount [${JSON.stringify(e)}]`;
                                    t({
                                        postCount: n
                                    })
                                }))
                                .catch((function() {
                                    t({
                                        error: 1
                                    })
                                }))
                        }))
                },
                ft: function(e, t) {
                    const n = "https://i.instagram.com/api/v1/feed/user/" + e + "/story/";
                    this.rt(n)
                        .then((function(e) {
                            t(e)
                        }))
                        .catch((function() {
                            t({
                                error: 1
                            })
                        }))
                },
                dt: function(e, t) {
                    const n = `https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(e)}`;
                    this.rt(n)
                        .then((function(e) {
                            t(e)
                        }))
                        .catch((function() {
                            t({
                                error: 1
                            })
                        }))
                },
                ht: function(e, t) {
                    const n = this;
                    o._e()
                        .then((function(t) {
                            const r = "https://www.instagram.com/graphql/query/?query_hash=" + t[e.request_type] + "&variables=" + encodeURIComponent(JSON.stringify(e.data));
                            return n.rt(r)
                        }))
                        .then((function(e) {
                            t(e)
                        }))
                        .catch((function(e) {
                            t({
                                error: 1
                            })
                        }))
                },
                gt: function(e, t) {
                    const n = this;
                    let r = e.after || null,
                        o = r ? s()
                        .S : s()
                        .I;
                    c.Ye(o)
                        .then((function(o) {
                            if (!o) return t(null);
                            chrome.storage.local.get("fb_dtsg", (function(i) {
                                let s = i && i.fb_dtsg || null,
                                    u = {
                                        data: {
                                            count: 12,
                                            include_reel_media_seen_timestamp: true,
                                            include_relationship_info: true,
                                            latest_besties_reel_media: true,
                                            latest_reel_media: true
                                        },
                                        username: e.userName,
                                        __relay_internal__pv__PolarisIsLoggedInrelayprovider: true,
                                        __relay_internal__pv__PolarisShareSheetV3relayprovider: false
                                    };
                                r && (u = {
                                    ...u,
                                    first: 12,
                                    last: null,
                                    after: r || "",
                                    before: null
                                }), u = JSON.stringify(u);
                                let a = {
                                    fb_dtsg: s,
                                    variables: u,
                                    doc_id: o,
                                    fb_api_caller_class: "RelayModern",
                                    fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                                    server_timestamps: true
                                };
                                n.ot("https://www.instagram.com/graphql/query", a)
                                    .then((function(e) {
                                        t(e)
                                    }))
                                    .catch((function(e) {
                                        t({
                                            error: 1
                                        })
                                    }))
                            }))
                        }))
                },
                $t: function(e, t) {
                    const n = `https://www.instagram.com/api/v1/media/${e.data.pk}/info/`;
                    return this.rt(n)
                        .then((function(e) {
                            t(e)
                        }))
                        .catch((function(e) {
                            t({
                                error: 1
                            })
                        }))
                },
                wt: function(e, t) {
                    let n = "https://www.instagram.com/" + e + "/";
                    this.et(n)
                        .then((function(e) {
                            return e.text()
                        }))
                        .then((function(e) {
                            let r = e.match(/\"profile_id\":\s?\"(\d+)/);
                            if (r = r && r[1], !r) throw `not received userId [${n}]`;
                            t(r)
                        }))
                        .catch((function() {
                            return t()
                        }))
                },
                vt: function(e, t) {
                    const n = `https://www.instagram.com/rupload_igphoto/${"reels"===e.destination?"fb_uploader":e.destination}_${e.upload_id}`,
                        r = new Uint8Array(e.data)
                        .buffer,
                        o = {
                            "x-entity-length": e.data.length,
                            "x-entity-name": `${e.destination}_${e.upload_id}`,
                            "x-entity-type": "image/jpeg",
                            offset: "0",
                            "x-instagram-rupload-params": JSON.stringify({
                                media_type: "reels" === e.destination ? "2" : "1",
                                upload_id: e.upload_id,
                                upload_media_height: e.media_height,
                                upload_media_width: e.media_width
                            })
                        };
                    this.st(n, r, o)
                        .then((function() {
                            t(true)
                        }))
                        .catch((function() {
                            t()
                        }))
                },
                yt: function(e, t) {
                    const n = `https://www.instagram.com/rupload_igvideo/${"reels"===e.destination?"fb_uploader":e.destination}_${e.upload_id}`,
                        r = new Uint8Array(e.data)
                        .buffer,
                        o = {
                            media_type: "2",
                            upload_id: e.upload_id,
                            upload_media_height: e.media_height,
                            upload_media_width: e.media_width,
                            video_format: "",
                            video_transform: null,
                            upload_media_duration_ms: e.duration,
                            "client-passthrough": "1",
                            is_sidecar: "0",
                            for_album: "story" === e.destination,
                            is_clips_video: "reels" === e.destination
                        };
                    "feed" === e.destination && (o.is_unified_video = "0");
                    const i = {
                        "x-entity-length": e.data.length,
                        "x-entity-name": `${e.destination}_${e.upload_id}`,
                        offset: "0",
                        "x-instagram-rupload-params": JSON.stringify(o)
                    };
                    this.st(n, r, i)
                        .then((function() {
                            t(true)
                        }))
                        .catch((function() {
                            t()
                        }))
                },
                bt: function(e, t) {
                    let n, r = "story" === e.destination,
                        o = {
                            upload_id: e.upload_id,
                            caption: e.caption
                        };
                    "reels" === e.destination ? (n = "api/v1/media/configure_to_clips/", o.clips_share_preview_to_feed = true === e.shareReelsToFeed ? "1" : "0") : n = "create/" + (r ? "configure_to_story/" : "configure/");
                    const i = this,
                        s = "https://www.instagram.com/" + n,
                        u = new URLSearchParams(o);
                    return r && undefined === e.previous_count ? this.qt((function(t) {
                        return e.previous_count = t, a()
                    })) : a();
                    function a() {
                        return i.st(s, u)
                            .then((function() {
                                if (r) return i.Pt(e, t);
                                t(true)
                            }))
                            .catch((function() {
                                t()
                            }))
                    }
                },
                Pt: function(e, t) {
                    const n = this;
                    return e.attempt = e.attempt || 0, n.qt((function(r) {
                        if (!(r > e.previous_count)) {
                            if (e.attempt > 3) throw "FAIL";
                            return e.attempt++, n.bt(e, t)
                                .then((function() {
                                    return new Promise((function(r) {
                                        setTimeout((function() {
                                            r(n.Pt(e, t))
                                        }), 300)
                                    }))
                                }))
                        }
                        t(true)
                    }))
                },
                qt: function(e) {
                    const t = this;
                    return a.je()
                        .then((async function(n) {
                            if (n || (n = await t.ut()), !n) return Promise.reject();
                            const r = "https://i.instagram.com/api/v1/feed/user/" + n.ds_user_id + "/story/";
                            return u.Le(["x-ig-www-claim", "x-ig-app-id"])
                                .then((function(o) {
                                    return t.tt(r, {
                                            method: "GET",
                                            headers: {
                                                ...o,
                                                "x-csrftoken": n.csrftoken
                                            },
                                            credentials: "include"
                                        })
                                        .then((function(t) {
                                            return e(t && t.reel && t.reel.items && t.reel.items.length || 0)
                                        }))
                                }))
                        }))
                }
            };
        (function() {
            chrome.runtime.onConnect.addListener((function(e) {})), chrome.action.onClicked.addListener((function() {
                chrome.tabs.create({
                    url: "https://www.instagram.com/"
                })
            })), chrome.runtime.onMessage.addListener((function(t, n, i) {
                if (t)
                    if ("string" == typeof t) switch (t) {
                        case "getCookies":
                            return a.je()
                                .then(i)
                                .catch((() => i)), true;
                        case "getAllHeaders":
                            return u.Be()
                                .then(i)
                                .catch((() => i)), true;
                        case "getQueryHashes":
                            return o._e()
                                .then(i)
                                .catch((() => i)), true;
                        case "checkBulkDownloadNow":
                            return e.C(i), true;
                        case "getCsrftoken":
                            return a.Ge()
                                .then(i)
                                .catch((() => i)), true;
                        case "is_bulk_advanced":
                            return chrome.storage.local.get("bulk_advanced", (function(e) {
                                i(e.bulk_advanced)
                            })), true;
                        default:
                            return
                    } else if ("object" == typeof t && "string" == typeof t.action) switch (t.action) {
                        case "downloadFile":
                            return r.de(t.options, n, i), true;
                        case "bulk_advanced":
                            chrome.storage.local.set({
                                bulk_advanced: t.value
                            });
                            break;
                        case "requestHighlights":
                            return l.dt(t.reel_ids, i), true;
                        case "requestHtmlByShortcode":
                            return l.ct(t.shortcode, i), true;
                        case "requestStories":
                            return l.ft(t.userId, i), true;
                        case "requestUserId":
                            return l.lt(t.userName, i), true;
                        case "requestUserPostCount":
                            return l._t(t.userName, i), true;
                        case "baseGraphqlQueryRequest":
                            return l.ht(t.opts, i), true;
                        case "baseMediaInfoRequest":
                            return l.$t(t.opts, i), true;
                        case "uploadPhotoRequest":
                            return l.vt(t.opts, i), true;
                        case "uploadVideoRequest":
                            return l.yt(t.opts, i), true;
                        case "uploadPostConfigureRequest":
                            return l.bt(t.opts, i), true;
                        case "getUserIdByUserName":
                            return l.wt(t.userName, i), true;
                        case "getUserStoriesCount":
                            return l.qt(i), true;
                        default:
                            return
                    }
            }))
        })(), o.Oe(), u.Oe()
    })()
})();
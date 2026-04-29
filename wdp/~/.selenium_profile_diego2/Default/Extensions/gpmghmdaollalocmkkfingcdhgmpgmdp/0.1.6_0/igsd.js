(() => {
    var t = {
            178: t => {
                t.exports = {
                    t: "x-ig-www-claim",
                    i: "x-ig-app-id",
                    u: "x-asbd-id",
                    l: "fb_dtsg",
                    h: "x-csrftoken",
                    _: "x-instagram-ajax",
                    v: "x-requested-with",
                    m: "x-ig-app-id_upload",
                    p: 1,
                    k: 2,
                    $: "jpg",
                    A: "mp4",
                    I: "doc_id",
                    C: "baseUserFeedInfo",
                    D: "scrollUserFeedInfo",
                    T: "userFeed"
                }
            },
            150: function(t) {
                var n = n || "undefined" != typeof navigator && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator) || function(t) {
                    if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
                        var n = t.document,
                            e = t.URL || t.webkitURL || t,
                            i = n.createElementNS("http://www.w3.org/1999/xhtml", "a"),
                            r = !t.externalHost && "download" in i,
                            o = t.webkitRequestFileSystem,
                            s = t.requestFileSystem || o || t.mozRequestFileSystem,
                            a = function(n) {
                                (t.setImmediate || t.setTimeout)((function() {
                                    throw n
                                }), 0)
                            },
                            u = "application/octet-stream",
                            c = 0,
                            l = [],
                            f = function() {
                                for (var t = l.length; t--;) {
                                    var n = l[t];
                                    "string" == typeof n ? e.revokeObjectURL(n) : n.remove()
                                }
                                l.length = 0
                            },
                            h = function(t, n, e) {
                                for (var i = (n = [].concat(n))
                                        .length; i--;) {
                                    var r = t["on" + n[i]];
                                    if ("function" == typeof r) try {
                                        r.call(t, e || t)
                                    } catch (t) {
                                        a(t)
                                    }
                                }
                            },
                            _ = function(e, a) {
                                var f, _, d, v = this,
                                    m = e.type,
                                    p = false,
                                    w = function() {
                                        var n = (t.URL || t.webkitURL || t)
                                            .createObjectURL(e);
                                        return l.push(n), n
                                    },
                                    b = function() {
                                        h(v, "writestart progress write writeend".split(" "))
                                    },
                                    k = function() {
                                        !p && f || (f = w()), _ ? _.location.href = f : window.open(f, "_blank"), v.readyState = v.DONE, b()
                                    },
                                    y = function(t) {
                                        return function() {
                                            if (v.readyState !== v.DONE) return t.apply(this, arguments)
                                        }
                                    },
                                    g = {
                                        create: true,
                                        exclusive: false
                                    };
                                if (v.readyState = v.INIT, a || (a = "download"), r) {
                                    f = w(), n = t.document, (i = n.createElementNS("http://www.w3.org/1999/xhtml", "a"))
                                        .href = f, i.download = a;
                                    var $ = n.createEvent("MouseEvents");
                                    return $.initMouseEvent("click", true, false, t, 0, 0, 0, 0, 0, false, false, false, false, 0, null), i.dispatchEvent($), v.readyState = v.DONE, void b()
                                }
                                t.chrome && m && m !== u && (d = e.slice || e.webkitSlice, e = d.call(e, 0, e.size, u), p = true), o && "download" !== a && (a += ".download"), (m === u || o) && (_ = t), s ? (c += e.size, s(t.TEMPORARY, c, y((function(t) {
                                    t.root.getDirectory("saved", g, y((function(t) {
                                        var n = function() {
                                            t.getFile(a, g, y((function(t) {
                                                t.createWriter(y((function(n) {
                                                    n.onwriteend = function(n) {
                                                            _.location.href = t.toURL(), l.push(t), v.readyState = v.DONE, h(v, "writeend", n)
                                                        }, n.onerror = function() {
                                                            var t = n.error;
                                                            t.code !== t.ABORT_ERR && k()
                                                        }, "writestart progress write abort".split(" ")
                                                        .forEach((function(t) {
                                                            n["on" + t] = v["on" + t]
                                                        })), n.write(e), v.abort = function() {
                                                            n.abort(), v.readyState = v.DONE
                                                        }, v.readyState = v.WRITING
                                                })), k)
                                            })), k)
                                        };
                                        t.getFile(a, {
                                            create: false
                                        }, y((function(t) {
                                            t.remove(), n()
                                        })), y((function(t) {
                                            t.code === t.NOT_FOUND_ERR ? n() : k()
                                        })))
                                    })), k)
                                })), k)) : k()
                            },
                            d = _.prototype,
                            v = function(t, n) {
                                return new _(t, n)
                            };
                        return d.abort = function() {
                            var t = this;
                            t.readyState = t.DONE, h(t, "abort")
                        }, d.readyState = d.INIT = 0, d.WRITING = 1, d.DONE = 2, d.error = d.onwritestart = d.onprogress = d.onwrite = d.onabort = d.onerror = d.onwriteend = null, t.addEventListener("unload", f, false), v.unload = function() {
                            f(), t.removeEventListener("unload", f, false)
                        }, v
                    }
                }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
                t.exports = n
            },
            716: (t, n, e) => {
                t.exports = function t(n, e, i) {
                    function r(s, a) {
                        if (!e[s]) {
                            if (!n[s]) {
                                if (o) return o(s, true);
                                var u = new Error("Cannot find module '" + s + "'");
                                throw u.code = "MODULE_NOT_FOUND", u
                            }
                            var c = e[s] = {
                                exports: {}
                            };
                            n[s][0].call(c.exports, (function(t) {
                                var e = n[s][1][t];
                                return r(e || t)
                            }), c, c.exports, t, n, e, i)
                        }
                        return e[s].exports
                    }
                    for (var o = undefined, s = 0; s < i.length; s++) r(i[s]);
                    return r
                }({
                    1: [function(t, n, e) {
                        var i = t("./utils"),
                            r = t("./support"),
                            o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                        e.encode = function(t) {
                            for (var n, e, r, s, a, u, c, l = [], f = 0, h = t.length, _ = h, d = "string" !== i.getTypeOf(t); f < t.length;) _ = h - f, d ? (n = t[f++], e = f < h ? t[f++] : 0, r = f < h ? t[f++] : 0) : (n = t.charCodeAt(f++), e = f < h ? t.charCodeAt(f++) : 0, r = f < h ? t.charCodeAt(f++) : 0), s = n >> 2, a = (3 & n) << 4 | e >> 4, u = _ > 1 ? (15 & e) << 2 | r >> 6 : 64, c = _ > 2 ? 63 & r : 64, l.push(o.charAt(s) + o.charAt(a) + o.charAt(u) + o.charAt(c));
                            return l.join("")
                        }, e.decode = function(t) {
                            var n, e, i, s, a, u, c = 0,
                                l = 0,
                                f = "data:";
                            if (t.substr(f.length) === f) throw new Error("Invalid base64 input, it looks like a data url.");
                            var h, _ = 3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""))
                                .length / 4;
                            if (t.charAt(t.length - 1) === o.charAt(64) && _--, t.charAt(t.length - 2) === o.charAt(64) && _--, _ % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
                            for (h = r.uint8array ? new Uint8Array(0 | _) : new Array(0 | _); c < t.length;) n = o.indexOf(t.charAt(c++)) << 2 | (s = o.indexOf(t.charAt(c++))) >> 4, e = (15 & s) << 4 | (a = o.indexOf(t.charAt(c++))) >> 2, i = (3 & a) << 6 | (u = o.indexOf(t.charAt(c++))), h[l++] = n, 64 !== a && (h[l++] = e), 64 !== u && (h[l++] = i);
                            return h
                        }
                    }, {
                        "./support": 30,
                        "./utils": 32
                    }],
                    2: [function(t, n, e) {
                        var i = t("./external"),
                            r = t("./stream/DataWorker"),
                            o = t("./stream/DataLengthProbe"),
                            s = t("./stream/Crc32Probe");
                        function a(t, n, e, i, r) {
                            this.compressedSize = t, this.uncompressedSize = n, this.crc32 = e, this.compression = i, this.compressedContent = r
                        }
                        o = t("./stream/DataLengthProbe"), a.prototype = {
                            getContentWorker: function() {
                                var t = new r(i.Promise.resolve(this.compressedContent))
                                    .pipe(this.compression.uncompressWorker())
                                    .pipe(new o("data_length")),
                                    n = this;
                                return t.on("end", (function() {
                                    if (this.streamInfo.data_length !== n.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch")
                                })), t
                            },
                            getCompressedWorker: function() {
                                return new r(i.Promise.resolve(this.compressedContent))
                                    .withStreamInfo("compressedSize", this.compressedSize)
                                    .withStreamInfo("uncompressedSize", this.uncompressedSize)
                                    .withStreamInfo("crc32", this.crc32)
                                    .withStreamInfo("compression", this.compression)
                            }
                        }, a.createWorkerFrom = function(t, n, e) {
                            return t.pipe(new s)
                                .pipe(new o("uncompressedSize"))
                                .pipe(n.compressWorker(e))
                                .pipe(new o("compressedSize"))
                                .withStreamInfo("compression", n)
                        }, n.exports = a
                    }, {
                        "./external": 6,
                        "./stream/Crc32Probe": 25,
                        "./stream/DataLengthProbe": 26,
                        "./stream/DataWorker": 27
                    }],
                    3: [function(t, n, e) {
                        var i = t("./stream/GenericWorker");
                        e.STORE = {
                            magic: "\0\0",
                            compressWorker: function(t) {
                                return new i("STORE compression")
                            },
                            uncompressWorker: function() {
                                return new i("STORE decompression")
                            }
                        }, e.DEFLATE = t("./flate")
                    }, {
                        "./flate": 7,
                        "./stream/GenericWorker": 28
                    }],
                    4: [function(t, n, e) {
                        var i = t("./utils");
                        function r() {
                            for (var t, n = [], e = 0; e < 256; e++) {
                                t = e;
                                for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                                n[e] = t
                            }
                            return n
                        }
                        var o = r();
                        function s(t, n, e, i) {
                            var r = o,
                                s = i + e;
                            t ^= -1;
                            for (var a = i; a < s; a++) t = t >>> 8 ^ r[255 & (t ^ n[a])];
                            return -1 ^ t
                        }
                        function a(t, n, e, i) {
                            var r = o,
                                s = i + e;
                            t ^= -1;
                            for (var a = i; a < s; a++) t = t >>> 8 ^ r[255 & (t ^ n.charCodeAt(a))];
                            return -1 ^ t
                        }
                        n.exports = function(t, n) {
                            return undefined !== t && t.length ? "string" !== i.getTypeOf(t) ? s(0 | n, t, t.length, 0) : a(0 | n, t, t.length, 0) : 0
                        }
                    }, {
                        "./utils": 32
                    }],
                    5: [function(t, n, e) {
                        e.base64 = false, e.binary = false, e.dir = false, e.createFolders = true, e.date = null, e.compression = null, e.compressionOptions = null, e.comment = null, e.unixPermissions = null, e.dosPermissions = null
                    }, {}],
                    6: [function(t, n, e) {
                        var i = null;
                        i = "undefined" != typeof Promise ? Promise : t("lie"), n.exports = {
                            Promise: i
                        }
                    }, {
                        lie: 58
                    }],
                    7: [function(t, n, e) {
                        var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
                            r = t("pako"),
                            o = t("./utils"),
                            s = t("./stream/GenericWorker"),
                            a = i ? "uint8array" : "array";
                        function u(t, n) {
                            s.call(this, "FlateWorker/" + t), this._pako = new r[t]({
                                raw: true,
                                level: n.level || -1
                            }), this.meta = {};
                            var e = this;
                            this._pako.onData = function(t) {
                                e.push({
                                    data: t,
                                    meta: e.meta
                                })
                            }
                        }
                        e.magic = "\b\0", o.inherits(u, s), u.prototype.processChunk = function(t) {
                            this.meta = t.meta, this._pako.push(o.transformTo(a, t.data), false)
                        }, u.prototype.flush = function() {
                            s.prototype.flush.call(this), this._pako.push([], true)
                        }, u.prototype.cleanUp = function() {
                            s.prototype.cleanUp.call(this), this._pako = null
                        }, e.compressWorker = function(t) {
                            return new u("Deflate", t)
                        }, e.uncompressWorker = function() {
                            return new u("Inflate", {})
                        }
                    }, {
                        "./stream/GenericWorker": 28,
                        "./utils": 32,
                        pako: 59
                    }],
                    8: [function(t, n, e) {
                        var i = t("../utils"),
                            r = t("../stream/GenericWorker"),
                            o = t("../utf8"),
                            s = t("../crc32"),
                            a = t("../signature"),
                            u = function(t, n) {
                                var e, i = "";
                                for (e = 0; e < n; e++) i += String.fromCharCode(255 & t), t >>>= 8;
                                return i
                            },
                            c = function(t, n) {
                                var e = t;
                                return t || (e = n ? 16893 : 33204), (65535 & e) << 16
                            },
                            l = function(t, n) {
                                return 63 & (t || 0)
                            },
                            f = function(t, n, e, r, f, h) {
                                var _, d, v = t.file,
                                    m = t.compression,
                                    p = h !== o.utf8encode,
                                    w = i.transformTo("string", h(v.name)),
                                    b = i.transformTo("string", o.utf8encode(v.name)),
                                    k = v.comment,
                                    y = i.transformTo("string", h(k)),
                                    g = i.transformTo("string", o.utf8encode(k)),
                                    $ = b.length !== v.name.length,
                                    E = g.length !== k.length,
                                    S = "",
                                    x = "",
                                    A = "",
                                    I = v.dir,
                                    P = v.date,
                                    U = {
                                        crc32: 0,
                                        compressedSize: 0,
                                        uncompressedSize: 0
                                    };
                                n && !e || (U.crc32 = t.crc32, U.compressedSize = t.compressedSize, U.uncompressedSize = t.uncompressedSize);
                                var R = 0;
                                n && (R |= 8), p || !$ && !E || (R |= 2048);
                                var C = 0,
                                    D = 0;
                                I && (C |= 16), "UNIX" === f ? (D = 798, C |= c(v.unixPermissions, I)) : (D = 20, C |= l(v.dosPermissions, I)), _ = P.getUTCHours(), _ <<= 6, _ |= P.getUTCMinutes(), _ <<= 5, _ |= P.getUTCSeconds() / 2, d = P.getUTCFullYear() - 1980, d <<= 4, d |= P.getUTCMonth() + 1, d <<= 5, d |= P.getUTCDate(), $ && (x = u(1, 1) + u(s(w), 4) + b, S += "up" + u(x.length, 2) + x), E && (A = u(1, 1) + u(s(y), 4) + g, S += "uc" + u(A.length, 2) + A);
                                var T = "";
                                return T += "\n\0", T += u(R, 2), T += m.magic, T += u(_, 2), T += u(d, 2), T += u(U.crc32, 4), T += u(U.compressedSize, 4), T += u(U.uncompressedSize, 4), T += u(w.length, 2), T += u(S.length, 2), {
                                    fileRecord: a.LOCAL_FILE_HEADER + T + w + S,
                                    dirRecord: a.CENTRAL_FILE_HEADER + u(D, 2) + T + u(y.length, 2) + "\0\0\0\0" + u(C, 4) + u(r, 4) + w + S + y
                                }
                            },
                            h = function(t, n, e, r, o) {
                                var s = i.transformTo("string", o(r));
                                return a.CENTRAL_DIRECTORY_END + "\0\0\0\0" + u(t, 2) + u(t, 2) + u(n, 4) + u(e, 4) + u(s.length, 2) + s
                            },
                            _ = function(t) {
                                return a.DATA_DESCRIPTOR + u(t.crc32, 4) + u(t.compressedSize, 4) + u(t.uncompressedSize, 4)
                            };
                        function d(t, n, e, i) {
                            r.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = n, this.zipPlatform = e, this.encodeFileName = i, this.streamFiles = t, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = []
                        }
                        i.inherits(d, r), d.prototype.push = function(t) {
                            var n = t.meta.percent || 0,
                                e = this.entriesCount,
                                i = this._sources.length;
                            this.accumulate ? this.contentBuffer.push(t) : (this.bytesWritten += t.data.length, r.prototype.push.call(this, {
                                data: t.data,
                                meta: {
                                    currentFile: this.currentFile,
                                    percent: e ? (n + 100 * (e - i - 1)) / e : 100
                                }
                            }))
                        }, d.prototype.openedSource = function(t) {
                            this.currentSourceOffset = this.bytesWritten, this.currentFile = t.file.name;
                            var n = this.streamFiles && !t.file.dir;
                            if (n) {
                                var e = f(t, n, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                                this.push({
                                    data: e.fileRecord,
                                    meta: {
                                        percent: 0
                                    }
                                })
                            } else this.accumulate = true
                        }, d.prototype.closedSource = function(t) {
                            this.accumulate = false;
                            var n = this.streamFiles && !t.file.dir,
                                e = f(t, n, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                            if (this.dirRecords.push(e.dirRecord), n) this.push({
                                data: _(t),
                                meta: {
                                    percent: 100
                                }
                            });
                            else
                                for (this.push({
                                        data: e.fileRecord,
                                        meta: {
                                            percent: 0
                                        }
                                    }); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
                            this.currentFile = null
                        }, d.prototype.flush = function() {
                            for (var t = this.bytesWritten, n = 0; n < this.dirRecords.length; n++) this.push({
                                data: this.dirRecords[n],
                                meta: {
                                    percent: 100
                                }
                            });
                            var e = this.bytesWritten - t,
                                i = h(this.dirRecords.length, e, t, this.zipComment, this.encodeFileName);
                            this.push({
                                data: i,
                                meta: {
                                    percent: 100
                                }
                            })
                        }, d.prototype.prepareNextSource = function() {
                            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume()
                        }, d.prototype.registerPrevious = function(t) {
                            this._sources.push(t);
                            var n = this;
                            return t.on("data", (function(t) {
                                n.processChunk(t)
                            })), t.on("end", (function() {
                                n.closedSource(n.previous.streamInfo), n._sources.length ? n.prepareNextSource() : n.end()
                            })), t.on("error", (function(t) {
                                n.error(t)
                            })), this
                        }, d.prototype.resume = function() {
                            return !!r.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? undefined : (this.end(), true))
                        }, d.prototype.error = function(t) {
                            var n = this._sources;
                            if (!r.prototype.error.call(this, t)) return false;
                            for (var e = 0; e < n.length; e++) try {
                                n[e].error(t)
                            } catch (t) {}
                            return true
                        }, d.prototype.lock = function() {
                            r.prototype.lock.call(this);
                            for (var t = this._sources, n = 0; n < t.length; n++) t[n].lock()
                        }, n.exports = d
                    }, {
                        "../crc32": 4,
                        "../signature": 23,
                        "../stream/GenericWorker": 28,
                        "../utf8": 31,
                        "../utils": 32
                    }],
                    9: [function(t, n, e) {
                        var i = t("../compressions"),
                            r = t("./ZipFileWorker"),
                            o = function(t, n) {
                                var e = t || n,
                                    r = i[e];
                                if (!r) throw new Error(e + " is not a valid compression method !");
                                return r
                            };
                        e.generateWorker = function(t, n, e) {
                            var i = new r(n.streamFiles, e, n.platform, n.encodeFileName),
                                s = 0;
                            try {
                                t.forEach((function(t, e) {
                                    s++;
                                    var r = o(e.options.compression, n.compression),
                                        a = e.options.compressionOptions || n.compressionOptions || {},
                                        u = e.dir,
                                        c = e.date;
                                    e._compressWorker(r, a)
                                        .withStreamInfo("file", {
                                            name: t,
                                            dir: u,
                                            date: c,
                                            comment: e.comment || "",
                                            unixPermissions: e.unixPermissions,
                                            dosPermissions: e.dosPermissions
                                        })
                                        .pipe(i)
                                })), i.entriesCount = s
                            } catch (t) {
                                i.error(t)
                            }
                            return i
                        }
                    }, {
                        "../compressions": 3,
                        "./ZipFileWorker": 8
                    }],
                    10: [function(t, n, e) {
                        function i() {
                            if (!(this instanceof i)) return new i;
                            if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please igsd_form_custom_checkbox_checked the upgrade guide.");
                            this.files = {}, this.comment = null, this.root = "", this.clone = function() {
                                var t = new i;
                                for (var n in this) "function" != typeof this[n] && (t[n] = this[n]);
                                return t
                            }
                        }
                        i.prototype = t("./object"), i.prototype.loadAsync = t("./load"), i.support = t("./support"), i.defaults = t("./defaults"), i.version = "3.1.2", i.loadAsync = function(t, n) {
                            return (new i)
                                .loadAsync(t, n)
                        }, i.external = t("./external"), n.exports = i
                    }, {
                        "./defaults": 5,
                        "./external": 6,
                        "./load": 11,
                        "./object": 15,
                        "./support": 30
                    }],
                    11: [function(t, n, e) {
                        var i = t("./utils"),
                            r = t("./external"),
                            o = t("./utf8"),
                            s = (i = t("./utils"), t("./zipEntries")),
                            a = t("./stream/Crc32Probe"),
                            u = t("./nodejsUtils");
                        function c(t) {
                            return new r.Promise((function(n, e) {
                                var i = t.decompressed.getContentWorker()
                                    .pipe(new a);
                                i.on("error", (function(t) {
                                        e(t)
                                    }))
                                    .on("end", (function() {
                                        i.streamInfo.crc32 !== t.decompressed.crc32 ? e(new Error("Corrupted zip : CRC32 mismatch")) : n()
                                    }))
                                    .resume()
                            }))
                        }
                        n.exports = function(t, n) {
                            var e = this;
                            return n = i.extend(n || {}, {
                                    base64: false,
                                    checkCRC32: false,
                                    optimizedBinaryString: false,
                                    createFolders: false,
                                    decodeFileName: o.utf8decode
                                }), u.isNode && u.isStream(t) ? r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", t, true, n.optimizedBinaryString, n.base64)
                                .then((function(t) {
                                    var e = new s(n);
                                    return e.load(t), e
                                }))
                                .then((function(t) {
                                    var e = [r.Promise.resolve(t)],
                                        i = t.files;
                                    if (n.checkCRC32)
                                        for (var o = 0; o < i.length; o++) e.push(c(i[o]));
                                    return r.Promise.all(e)
                                }))
                                .then((function(t) {
                                    for (var i = t.shift(), r = i.files, o = 0; o < r.length; o++) {
                                        var s = r[o];
                                        e.file(s.fileNameStr, s.decompressed, {
                                            binary: true,
                                            optimizedBinaryString: true,
                                            date: s.date,
                                            dir: s.dir,
                                            comment: s.fileCommentStr.length ? s.fileCommentStr : null,
                                            unixPermissions: s.unixPermissions,
                                            dosPermissions: s.dosPermissions,
                                            createFolders: n.createFolders
                                        })
                                    }
                                    return i.zipComment.length && (e.comment = i.zipComment), e
                                }))
                        }
                    }, {
                        "./external": 6,
                        "./nodejsUtils": 14,
                        "./stream/Crc32Probe": 25,
                        "./utf8": 31,
                        "./utils": 32,
                        "./zipEntries": 33
                    }],
                    12: [function(t, n, e) {
                        var i = t("../utils"),
                            r = t("../stream/GenericWorker");
                        function o(t, n) {
                            r.call(this, "Nodejs stream input adapter for " + t), this._upstreamEnded = false, this._bindStream(n)
                        }
                        i.inherits(o, r), o.prototype._bindStream = function(t) {
                            var n = this;
                            this._stream = t, t.pause(), t.on("data", (function(t) {
                                    n.push({
                                        data: t,
                                        meta: {
                                            percent: 0
                                        }
                                    })
                                }))
                                .on("error", (function(t) {
                                    n.isPaused ? this.generatedError = t : n.error(t)
                                }))
                                .on("end", (function() {
                                    n.isPaused ? n._upstreamEnded = true : n.end()
                                }))
                        }, o.prototype.pause = function() {
                            return !!r.prototype.pause.call(this) && (this._stream.pause(), true)
                        }, o.prototype.resume = function() {
                            return !!r.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true)
                        }, n.exports = o
                    }, {
                        "../stream/GenericWorker": 28,
                        "../utils": 32
                    }],
                    13: [function(t, n, e) {
                        var i = t("readable-stream")
                            .Readable;
                        function r(t, n, e) {
                            i.call(this, n), this._helper = t;
                            var r = this;
                            t.on("data", (function(t, n) {
                                    r.push(t) || r._helper.pause(), e && e(n)
                                }))
                                .on("error", (function(t) {
                                    r.emit("error", t)
                                }))
                                .on("end", (function() {
                                    r.push(null)
                                }))
                        }
                        t("util")
                            .inherits(r, i), r.prototype._read = function() {
                                this._helper.resume()
                            }, n.exports = r
                    }, {
                        "readable-stream": 16,
                        util: undefined
                    }],
                    14: [function(t, n, e) {
                        n.exports = {
                            isNode: "undefined" != typeof Buffer,
                            newBuffer: function(t, n) {
                                return new Buffer(t, n)
                            },
                            isBuffer: function(t) {
                                return Buffer.isBuffer(t)
                            },
                            isStream: function(t) {
                                return t && "function" == typeof t.on && "function" == typeof t.pause && "function" == typeof t.resume
                            }
                        }
                    }, {}],
                    15: [function(t, n, e) {
                        var i = t("./utf8"),
                            r = t("./utils"),
                            o = t("./stream/GenericWorker"),
                            s = t("./stream/StreamHelper"),
                            a = t("./defaults"),
                            u = t("./compressedObject"),
                            c = t("./zipObject"),
                            l = t("./generate"),
                            f = t("./nodejsUtils"),
                            h = t("./nodejs/NodejsStreamInputAdapter"),
                            _ = function(t, n, e) {
                                var i, s = r.getTypeOf(n),
                                    l = r.extend(e || {}, a);
                                l.date = l.date || new Date, null !== l.compression && (l.compression = l.compression.toUpperCase()), "string" == typeof l.unixPermissions && (l.unixPermissions = parseInt(l.unixPermissions, 8)), l.unixPermissions && 16384 & l.unixPermissions && (l.dir = true), l.dosPermissions && 16 & l.dosPermissions && (l.dir = true), l.dir && (t = v(t)), l.createFolders && (i = d(t)) && m.call(this, i, true);
                                var _ = "string" === s && false === l.binary && false === l.base64;
                                e && undefined !== e.binary || (l.binary = !_), (n instanceof u && 0 === n.uncompressedSize || l.dir || !n || 0 === n.length) && (l.base64 = false, l.binary = true, n = "", l.compression = "STORE", s = "string");
                                var p = null;
                                p = n instanceof u || n instanceof o ? n : f.isNode && f.isStream(n) ? new h(t, n) : r.prepareContent(t, n, l.binary, l.optimizedBinaryString, l.base64);
                                var w = new c(t, p, l);
                                this.files[t] = w
                            },
                            d = function(t) {
                                "/" === t.slice(-1) && (t = t.substring(0, t.length - 1));
                                var n = t.lastIndexOf("/");
                                return n > 0 ? t.substring(0, n) : ""
                            },
                            v = function(t) {
                                return "/" !== t.slice(-1) && (t += "/"), t
                            },
                            m = function(t, n) {
                                return n = undefined !== n ? n : a.createFolders, t = v(t), this.files[t] || _.call(this, t, null, {
                                    dir: true,
                                    createFolders: n
                                }), this.files[t]
                            };
                        function p(t) {
                            return "[object RegExp]" === Object.prototype.toString.call(t)
                        }
                        var w = {
                            load: function() {
                                throw new Error("This method has been removed in JSZip 3.0, please igsd_form_custom_checkbox_checked the upgrade guide.")
                            },
                            forEach: function(t) {
                                var n, e, i;
                                for (n in this.files) this.files.hasOwnProperty(n) && (i = this.files[n], (e = n.slice(this.root.length, n.length)) && n.slice(0, this.root.length) === this.root && t(e, i))
                            },
                            filter: function(t) {
                                var n = [];
                                return this.forEach((function(e, i) {
                                    t(e, i) && n.push(i)
                                })), n
                            },
                            file: function(t, n, e) {
                                if (1 === arguments.length) {
                                    if (p(t)) {
                                        var i = t;
                                        return this.filter((function(t, n) {
                                            return !n.dir && i.test(t)
                                        }))
                                    }
                                    var r = this.files[this.root + t];
                                    return r && !r.dir ? r : null
                                }
                                return t = this.root + t, _.call(this, t, n, e), this
                            },
                            folder: function(t) {
                                if (!t) return this;
                                if (p(t)) return this.filter((function(n, e) {
                                    return e.dir && t.test(n)
                                }));
                                var n = this.root + t,
                                    e = m.call(this, n),
                                    i = this.clone();
                                return i.root = e.name, i
                            },
                            remove: function(t) {
                                t = this.root + t;
                                var n = this.files[t];
                                if (n || ("/" !== t.slice(-1) && (t += "/"), n = this.files[t]), n && !n.dir) delete this.files[t];
                                else
                                    for (var e = this.filter((function(n, e) {
                                            return e.name.slice(0, t.length) === t
                                        })), i = 0; i < e.length; i++) delete this.files[e[i].name];
                                return this
                            },
                            generate: function(t) {
                                throw new Error("This method has been removed in JSZip 3.0, please igsd_form_custom_checkbox_checked the upgrade guide.")
                            },
                            generateInternalStream: function(t) {
                                var n, e = {};
                                try {
                                    if ((e = r.extend(t || {}, {
                                            streamFiles: false,
                                            compression: "STORE",
                                            compressionOptions: null,
                                            type: "",
                                            platform: "DOS",
                                            comment: null,
                                            mimeType: "application/zip",
                                            encodeFileName: i.utf8encode
                                        }))
                                        .type = e.type.toLowerCase(), e.compression = e.compression.toUpperCase(), "binarystring" === e.type && (e.type = "string"), !e.type) throw new Error("No output type specified.");
                                    r.checkSupport(e.type), "darwin" !== e.platform && "freebsd" !== e.platform && "linux" !== e.platform && "sunos" !== e.platform || (e.platform = "UNIX"), "win32" === e.platform && (e.platform = "DOS");
                                    var a = e.comment || this.comment || "";
                                    n = l.generateWorker(this, e, a)
                                } catch (t) {
                                    (n = new o("error"))
                                    .error(t)
                                }
                                return new s(n, e.type || "string", e.mimeType)
                            },
                            generateAsync: function(t, n) {
                                return this.generateInternalStream(t)
                                    .accumulate(n)
                            },
                            generateNodeStream: function(t, n) {
                                return (t = t || {})
                                    .type || (t.type = "nodebuffer"), this.generateInternalStream(t)
                                    .toNodejsStream(n)
                            }
                        };
                        n.exports = w
                    }, {
                        "./compressedObject": 2,
                        "./defaults": 5,
                        "./generate": 9,
                        "./nodejs/NodejsStreamInputAdapter": 12,
                        "./nodejsUtils": 14,
                        "./stream/GenericWorker": 28,
                        "./stream/StreamHelper": 29,
                        "./utf8": 31,
                        "./utils": 32,
                        "./zipObject": 35
                    }],
                    16: [function(t, n, e) {
                        n.exports = t("stream")
                    }, {
                        stream: undefined
                    }],
                    17: [function(t, n, e) {
                        var i = t("./DataReader");
                        function r(t) {
                            i.call(this, t);
                            for (var n = 0; n < this.data.length; n++) t[n] = 255 & t[n]
                        }
                        t("../utils")
                            .inherits(r, i), r.prototype.byteAt = function(t) {
                                return this.data[this.zero + t]
                            }, r.prototype.lastIndexOfSignature = function(t) {
                                for (var n = t.charCodeAt(0), e = t.charCodeAt(1), i = t.charCodeAt(2), r = t.charCodeAt(3), o = this.length - 4; o >= 0; --o)
                                    if (this.data[o] === n && this.data[o + 1] === e && this.data[o + 2] === i && this.data[o + 3] === r) return o - this.zero;
                                return -1
                            }, r.prototype.readAndCheckSignature = function(t) {
                                var n = t.charCodeAt(0),
                                    e = t.charCodeAt(1),
                                    i = t.charCodeAt(2),
                                    r = t.charCodeAt(3),
                                    o = this.readData(4);
                                return n === o[0] && e === o[1] && i === o[2] && r === o[3]
                            }, r.prototype.readData = function(t) {
                                if (this.checkOffset(t), 0 === t) return [];
                                var n = this.data.slice(this.zero + this.index, this.zero + this.index + t);
                                return this.index += t, n
                            }, n.exports = r
                    }, {
                        "../utils": 32,
                        "./DataReader": 18
                    }],
                    18: [function(t, n, e) {
                        var i = t("../utils");
                        function r(t) {
                            this.data = t, this.length = t.length, this.index = 0, this.zero = 0
                        }
                        r.prototype = {
                            checkOffset: function(t) {
                                this.checkIndex(this.index + t)
                            },
                            checkIndex: function(t) {
                                if (this.length < this.zero + t || t < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t + "). Corrupted zip ?")
                            },
                            setIndex: function(t) {
                                this.checkIndex(t), this.index = t
                            },
                            skip: function(t) {
                                this.setIndex(this.index + t)
                            },
                            byteAt: function(t) {},
                            readInt: function(t) {
                                var n, e = 0;
                                for (this.checkOffset(t), n = this.index + t - 1; n >= this.index; n--) e = (e << 8) + this.byteAt(n);
                                return this.index += t, e
                            },
                            readString: function(t) {
                                return i.transformTo("string", this.readData(t))
                            },
                            readData: function(t) {},
                            lastIndexOfSignature: function(t) {},
                            readAndCheckSignature: function(t) {},
                            readDate: function() {
                                var t = this.readInt(4);
                                return new Date(Date.UTC(1980 + (t >> 25 & 127), (t >> 21 & 15) - 1, t >> 16 & 31, t >> 11 & 31, t >> 5 & 63, (31 & t) << 1))
                            }
                        }, n.exports = r
                    }, {
                        "../utils": 32
                    }],
                    19: [function(t, n, e) {
                        var i = t("./Uint8ArrayReader");
                        function r(t) {
                            i.call(this, t)
                        }
                        t("../utils")
                            .inherits(r, i), r.prototype.readData = function(t) {
                                this.checkOffset(t);
                                var n = this.data.slice(this.zero + this.index, this.zero + this.index + t);
                                return this.index += t, n
                            }, n.exports = r
                    }, {
                        "../utils": 32,
                        "./Uint8ArrayReader": 21
                    }],
                    20: [function(t, n, e) {
                        var i = t("./DataReader");
                        function r(t) {
                            i.call(this, t)
                        }
                        t("../utils")
                            .inherits(r, i), r.prototype.byteAt = function(t) {
                                return this.data.charCodeAt(this.zero + t)
                            }, r.prototype.lastIndexOfSignature = function(t) {
                                return this.data.lastIndexOf(t) - this.zero
                            }, r.prototype.readAndCheckSignature = function(t) {
                                return t === this.readData(4)
                            }, r.prototype.readData = function(t) {
                                this.checkOffset(t);
                                var n = this.data.slice(this.zero + this.index, this.zero + this.index + t);
                                return this.index += t, n
                            }, n.exports = r
                    }, {
                        "../utils": 32,
                        "./DataReader": 18
                    }],
                    21: [function(t, n, e) {
                        var i = t("./ArrayReader");
                        function r(t) {
                            i.call(this, t)
                        }
                        t("../utils")
                            .inherits(r, i), r.prototype.readData = function(t) {
                                if (this.checkOffset(t), 0 === t) return new Uint8Array(0);
                                var n = this.data.subarray(this.zero + this.index, this.zero + this.index + t);
                                return this.index += t, n
                            }, n.exports = r
                    }, {
                        "../utils": 32,
                        "./ArrayReader": 17
                    }],
                    22: [function(t, n, e) {
                        var i = t("../utils"),
                            r = t("../support"),
                            o = t("./ArrayReader"),
                            s = t("./StringReader"),
                            a = t("./NodeBufferReader"),
                            u = t("./Uint8ArrayReader");
                        n.exports = function(t) {
                            var n = i.getTypeOf(t);
                            return i.checkSupport(n), "string" !== n || r.uint8array ? "nodebuffer" === n ? new a(t) : r.uint8array ? new u(i.transformTo("uint8array", t)) : new o(i.transformTo("array", t)) : new s(t)
                        }
                    }, {
                        "../support": 30,
                        "../utils": 32,
                        "./ArrayReader": 17,
                        "./NodeBufferReader": 19,
                        "./StringReader": 20,
                        "./Uint8ArrayReader": 21
                    }],
                    23: [function(t, n, e) {
                        e.LOCAL_FILE_HEADER = "PK", e.CENTRAL_FILE_HEADER = "PK", e.CENTRAL_DIRECTORY_END = "PK", e.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", e.ZIP64_CENTRAL_DIRECTORY_END = "PK", e.DATA_DESCRIPTOR = "PK\b"
                    }, {}],
                    24: [function(t, n, e) {
                        var i = t("./GenericWorker"),
                            r = t("../utils");
                        function o(t) {
                            i.call(this, "ConvertWorker to " + t), this.destType = t
                        }
                        r.inherits(o, i), o.prototype.processChunk = function(t) {
                            this.push({
                                data: r.transformTo(this.destType, t.data),
                                meta: t.meta
                            })
                        }, n.exports = o
                    }, {
                        "../utils": 32,
                        "./GenericWorker": 28
                    }],
                    25: [function(t, n, e) {
                        var i = t("./GenericWorker"),
                            r = t("../crc32");
                        function o() {
                            i.call(this, "Crc32Probe")
                        }
                        t("../utils")
                            .inherits(o, i), o.prototype.processChunk = function(t) {
                                this.streamInfo.crc32 = r(t.data, this.streamInfo.crc32 || 0), this.push(t)
                            }, n.exports = o
                    }, {
                        "../crc32": 4,
                        "../utils": 32,
                        "./GenericWorker": 28
                    }],
                    26: [function(t, n, e) {
                        var i = t("../utils"),
                            r = t("./GenericWorker");
                        function o(t) {
                            r.call(this, "DataLengthProbe for " + t), this.propName = t, this.withStreamInfo(t, 0)
                        }
                        i.inherits(o, r), o.prototype.processChunk = function(t) {
                            if (t) {
                                var n = this.streamInfo[this.propName] || 0;
                                this.streamInfo[this.propName] = n + t.data.length
                            }
                            r.prototype.processChunk.call(this, t)
                        }, n.exports = o
                    }, {
                        "../utils": 32,
                        "./GenericWorker": 28
                    }],
                    27: [function(t, n, e) {
                        var i = t("../utils"),
                            r = t("./GenericWorker"),
                            o = 16384;
                        function s(t) {
                            r.call(this, "DataWorker");
                            var n = this;
                            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, t.then((function(t) {
                                n.dataIsReady = true, n.data = t, n.max = t && t.length || 0, n.type = i.getTypeOf(t), n.isPaused || n._tickAndRepeat()
                            }), (function(t) {
                                n.error(t)
                            }))
                        }
                        i.inherits(s, r), s.prototype.cleanUp = function() {
                            r.prototype.cleanUp.call(this), this.data = null
                        }, s.prototype.resume = function() {
                            return !!r.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, i.delay(this._tickAndRepeat, [], this)), true)
                        }, s.prototype._tickAndRepeat = function() {
                            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = true))
                        }, s.prototype._tick = function() {
                            if (this.isPaused || this.isFinished) return false;
                            var t = o,
                                n = null,
                                e = Math.min(this.max, this.index + t);
                            if (this.index >= this.max) return this.end();
                            switch (this.type) {
                                case "string":
                                    n = this.data.substring(this.index, e);
                                    break;
                                case "uint8array":
                                    n = this.data.subarray(this.index, e);
                                    break;
                                case "array":
                                case "nodebuffer":
                                    n = this.data.slice(this.index, e)
                            }
                            return this.index = e, this.push({
                                data: n,
                                meta: {
                                    percent: this.max ? this.index / this.max * 100 : 0
                                }
                            })
                        }, n.exports = s
                    }, {
                        "../utils": 32,
                        "./GenericWorker": 28
                    }],
                    28: [function(t, n, e) {
                        function i(t) {
                            this.name = t || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = {
                                data: [],
                                end: [],
                                error: []
                            }, this.previous = null
                        }
                        i.prototype = {
                            push: function(t) {
                                this.emit("data", t)
                            },
                            end: function() {
                                if (this.isFinished) return false;
                                this.flush();
                                try {
                                    this.emit("end"), this.cleanUp(), this.isFinished = true
                                } catch (t) {
                                    this.emit("error", t)
                                }
                                return true
                            },
                            error: function(t) {
                                return !this.isFinished && (this.isPaused ? this.generatedError = t : (this.isFinished = true, this.emit("error", t), this.previous && this.previous.error(t), this.cleanUp()), true)
                            },
                            on: function(t, n) {
                                return this._listeners[t].push(n), this
                            },
                            cleanUp: function() {
                                this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = []
                            },
                            emit: function(t, n) {
                                if (this._listeners[t])
                                    for (var e = 0; e < this._listeners[t].length; e++) this._listeners[t][e].call(this, n)
                            },
                            pipe: function(t) {
                                return t.registerPrevious(this)
                            },
                            registerPrevious: function(t) {
                                if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                                this.streamInfo = t.streamInfo, this.mergeStreamInfo(), this.previous = t;
                                var n = this;
                                return t.on("data", (function(t) {
                                    n.processChunk(t)
                                })), t.on("end", (function() {
                                    n.end()
                                })), t.on("error", (function(t) {
                                    n.error(t)
                                })), this
                            },
                            pause: function() {
                                return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true)
                            },
                            resume: function() {
                                if (!this.isPaused || this.isFinished) return false;
                                this.isPaused = false;
                                var t = false;
                                return this.generatedError && (this.error(this.generatedError), t = true), this.previous && this.previous.resume(), !t
                            },
                            flush: function() {},
                            processChunk: function(t) {
                                this.push(t)
                            },
                            withStreamInfo: function(t, n) {
                                return this.extraStreamInfo[t] = n, this.mergeStreamInfo(), this
                            },
                            mergeStreamInfo: function() {
                                for (var t in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(t) && (this.streamInfo[t] = this.extraStreamInfo[t])
                            },
                            lock: function() {
                                if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                                this.isLocked = true, this.previous && this.previous.lock()
                            },
                            toString: function() {
                                var t = "Worker " + this.name;
                                return this.previous ? this.previous + " -> " + t : t
                            }
                        }, n.exports = i
                    }, {}],
                    29: [function(t, n, e) {
                        var i = t("../utils"),
                            r = t("./ConvertWorker"),
                            o = t("./GenericWorker"),
                            s = t("../base64"),
                            a = t("../support"),
                            u = t("../external"),
                            c = null;
                        if (a.nodestream) try {
                            c = t("../nodejs/NodejsStreamOutputAdapter")
                        } catch (t) {}
                        function l(t, n, e) {
                            switch (t) {
                                case "blob":
                                    return i.newBlob(i.transformTo("arraybuffer", n), e);
                                case "base64":
                                    return s.encode(n);
                                default:
                                    return i.transformTo(t, n)
                            }
                        }
                        function f(t, n, e) {
                            var i, r = 0,
                                o = null,
                                s = 0;
                            for (i = 0; i < n.length; i++) s += n[i].length;
                            switch (t) {
                                case "string":
                                    return n.join("");
                                case "array":
                                    return Array.prototype.concat.apply([], n);
                                case "uint8array":
                                    for (o = new Uint8Array(s), i = 0; i < n.length; i++) o.set(n[i], r), r += n[i].length;
                                    return o;
                                case "nodebuffer":
                                    return Buffer.concat(n);
                                default:
                                    throw new Error("concat : unsupported type '" + t + "'")
                            }
                        }
                        function h(t, n) {
                            return new u.Promise((function(e, i) {
                                var r = [],
                                    o = t._internalType,
                                    s = t._outputType,
                                    a = t._mimeType;
                                t.on("data", (function(t, e) {
                                        r.push(t), n && n(e)
                                    }))
                                    .on("error", (function(t) {
                                        r = [], i(t)
                                    }))
                                    .on("end", (function() {
                                        try {
                                            var t = l(s, f(o, r, n), a);
                                            e(t)
                                        } catch (t) {
                                            i(t)
                                        }
                                        r = []
                                    }))
                                    .resume()
                            }))
                        }
                        function _(t, n, e) {
                            var s = n;
                            switch (n) {
                                case "blob":
                                case "arraybuffer":
                                    s = "uint8array";
                                    break;
                                case "base64":
                                    s = "string"
                            }
                            try {
                                this._internalType = s, this._outputType = n, this._mimeType = e, i.checkSupport(s), this._worker = t.pipe(new r(s)), t.lock()
                            } catch (t) {
                                this._worker = new o("error"), this._worker.error(t)
                            }
                        }
                        _.prototype = {
                            accumulate: function(t) {
                                return h(this, t)
                            },
                            on: function(t, n) {
                                var e = this;
                                return "data" === t ? this._worker.on(t, (function(t) {
                                    n.call(e, t.data, t.meta)
                                })) : this._worker.on(t, (function() {
                                    i.delay(n, arguments, e)
                                })), this
                            },
                            resume: function() {
                                return i.delay(this._worker.resume, [], this._worker), this
                            },
                            pause: function() {
                                return this._worker.pause(), this
                            },
                            toNodejsStream: function(t) {
                                if (i.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
                                return new c(this, {
                                    objectMode: "nodebuffer" !== this._outputType
                                }, t)
                            }
                        }, n.exports = _
                    }, {
                        "../base64": 1,
                        "../external": 6,
                        "../nodejs/NodejsStreamOutputAdapter": 13,
                        "../support": 30,
                        "../utils": 32,
                        "./ConvertWorker": 24,
                        "./GenericWorker": 28
                    }],
                    30: [function(t, n, e) {
                        if (e.base64 = true, e.array = true, e.string = true, e.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, e.nodebuffer = "undefined" != typeof Buffer, e.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) e.blob = false;
                        else {
                            var i = new ArrayBuffer(0);
                            try {
                                e.blob = 0 === new Blob([i], {
                                        type: "application/zip"
                                    })
                                    .size
                            } catch (t) {
                                try {
                                    var r = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
                                    r.append(i), e.blob = 0 === r.getBlob("application/zip")
                                        .size
                                } catch (t) {
                                    e.blob = false
                                }
                            }
                        }
                        try {
                            e.nodestream = !!t("readable-stream")
                                .Readable
                        } catch (t) {
                            e.nodestream = false
                        }
                    }, {
                        "readable-stream": 16
                    }],
                    31: [function(t, n, e) {
                        for (var i = t("./utils"), r = t("./support"), o = t("./nodejsUtils"), s = t("./stream/GenericWorker"), a = new Array(256), u = 0; u < 256; u++) a[u] = u >= 252 ? 6 : u >= 248 ? 5 : u >= 240 ? 4 : u >= 224 ? 3 : u >= 192 ? 2 : 1;
                        a[254] = a[254] = 1;
                        var c = function(t) {
                                var n, e, i, o, s, a = t.length,
                                    u = 0;
                                for (o = 0; o < a; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (i = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (i - 56320), o++), u += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
                                for (n = r.uint8array ? new Uint8Array(u) : new Array(u), s = 0, o = 0; s < u; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (i = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (i - 56320), o++), e < 128 ? n[s++] = e : e < 2048 ? (n[s++] = 192 | e >>> 6, n[s++] = 128 | 63 & e) : e < 65536 ? (n[s++] = 224 | e >>> 12, n[s++] = 128 | e >>> 6 & 63, n[s++] = 128 | 63 & e) : (n[s++] = 240 | e >>> 18, n[s++] = 128 | e >>> 12 & 63, n[s++] = 128 | e >>> 6 & 63, n[s++] = 128 | 63 & e);
                                return n
                            },
                            l = function(t, n) {
                                var e;
                                for ((n = n || t.length) > t.length && (n = t.length), e = n - 1; e >= 0 && 128 == (192 & t[e]);) e--;
                                return e < 0 || 0 === e ? n : e + a[t[e]] > n ? e : n
                            },
                            f = function(t) {
                                var n, e, r, o, s = t.length,
                                    u = new Array(2 * s);
                                for (e = 0, n = 0; n < s;)
                                    if ((r = t[n++]) < 128) u[e++] = r;
                                    else if ((o = a[r]) > 4) u[e++] = 65533, n += o - 1;
                                else {
                                    for (r &= 2 === o ? 31 : 3 === o ? 15 : 7; o > 1 && n < s;) r = r << 6 | 63 & t[n++], o--;
                                    o > 1 ? u[e++] = 65533 : r < 65536 ? u[e++] = r : (r -= 65536, u[e++] = 55296 | r >> 10 & 1023, u[e++] = 56320 | 1023 & r)
                                }
                                return u.length !== e && (u.subarray ? u = u.subarray(0, e) : u.length = e), i.applyFromCharCode(u)
                            };
                        function h() {
                            s.call(this, "utf-8 decode"), this.leftOver = null
                        }
                        function _() {
                            s.call(this, "utf-8 encode")
                        }
                        e.utf8encode = function(t) {
                            return r.nodebuffer ? o.newBuffer(t, "utf-8") : c(t)
                        }, e.utf8decode = function(t) {
                            return r.nodebuffer ? i.transformTo("nodebuffer", t)
                                .toString("utf-8") : (t = i.transformTo(r.uint8array ? "uint8array" : "array", t), f(t))
                        }, i.inherits(h, s), h.prototype.processChunk = function(t) {
                            var n = i.transformTo(r.uint8array ? "uint8array" : "array", t.data);
                            if (this.leftOver && this.leftOver.length) {
                                if (r.uint8array) {
                                    var o = n;
                                    (n = new Uint8Array(o.length + this.leftOver.length))
                                    .set(this.leftOver, 0), n.set(o, this.leftOver.length)
                                } else n = this.leftOver.concat(n);
                                this.leftOver = null
                            }
                            var s = l(n),
                                a = n;
                            s !== n.length && (r.uint8array ? (a = n.subarray(0, s), this.leftOver = n.subarray(s, n.length)) : (a = n.slice(0, s), this.leftOver = n.slice(s, n.length))), this.push({
                                data: e.utf8decode(a),
                                meta: t.meta
                            })
                        }, h.prototype.flush = function() {
                            this.leftOver && this.leftOver.length && (this.push({
                                data: e.utf8decode(this.leftOver),
                                meta: {}
                            }), this.leftOver = null)
                        }, e.Utf8DecodeWorker = h, i.inherits(_, s), _.prototype.processChunk = function(t) {
                            this.push({
                                data: e.utf8encode(t.data),
                                meta: t.meta
                            })
                        }, e.Utf8EncodeWorker = _
                    }, {
                        "./nodejsUtils": 14,
                        "./stream/GenericWorker": 28,
                        "./support": 30,
                        "./utils": 32
                    }],
                    32: [function(t, n, e) {
                        var i = t("./support"),
                            r = t("./base64"),
                            o = t("./nodejsUtils"),
                            s = t("core-js/library/fn/set-immediate"),
                            a = t("./external");
                        function u(t) {
                            return l(t, i.uint8array ? new Uint8Array(t.length) : new Array(t.length))
                        }
                        function c(t) {
                            return t
                        }
                        function l(t, n) {
                            for (var e = 0; e < t.length; ++e) n[e] = 255 & t.charCodeAt(e);
                            return n
                        }
                        e.newBlob = function(t, n) {
                            e.checkSupport("blob");
                            try {
                                return new Blob([t], {
                                    type: n
                                })
                            } catch (e) {
                                try {
                                    var i = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder);
                                    return i.append(t), i.getBlob(n)
                                } catch (t) {
                                    throw new Error("Bug : can't construct the Blob.")
                                }
                            }
                        };
                        var f = {
                            stringifyByChunk: function(t, n, e) {
                                var i = [],
                                    r = 0,
                                    o = t.length;
                                if (o <= e) return String.fromCharCode.apply(null, t);
                                for (; r < o;) "array" === n || "nodebuffer" === n ? i.push(String.fromCharCode.apply(null, t.slice(r, Math.min(r + e, o)))) : i.push(String.fromCharCode.apply(null, t.subarray(r, Math.min(r + e, o)))), r += e;
                                return i.join("")
                            },
                            stringifyByChar: function(t) {
                                for (var n = "", e = 0; e < t.length; e++) n += String.fromCharCode(t[e]);
                                return n
                            },
                            applyCanBeUsed: {
                                uint8array: function() {
                                    try {
                                        return i.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1))
                                            .length
                                    } catch (t) {
                                        return false
                                    }
                                }(),
                                nodebuffer: function() {
                                    try {
                                        return i.nodebuffer && 1 === String.fromCharCode.apply(null, o.newBuffer(1))
                                            .length
                                    } catch (t) {
                                        return false
                                    }
                                }()
                            }
                        };
                        function h(t) {
                            var n = 65536,
                                i = e.getTypeOf(t),
                                r = true;
                            if ("uint8array" === i ? r = f.applyCanBeUsed.uint8array : "nodebuffer" === i && (r = f.applyCanBeUsed.nodebuffer), r)
                                for (; n > 1;) try {
                                    return f.stringifyByChunk(t, i, n)
                                } catch (t) {
                                    n = Math.floor(n / 2)
                                }
                            return f.stringifyByChar(t)
                        }
                        function _(t, n) {
                            for (var e = 0; e < t.length; e++) n[e] = t[e];
                            return n
                        }
                        e.applyFromCharCode = h;
                        var d = {};
                        d.string = {
                            string: c,
                            array: function(t) {
                                return l(t, new Array(t.length))
                            },
                            arraybuffer: function(t) {
                                return d.string.uint8array(t)
                                    .buffer
                            },
                            uint8array: function(t) {
                                return l(t, new Uint8Array(t.length))
                            },
                            nodebuffer: function(t) {
                                return l(t, o.newBuffer(t.length))
                            }
                        }, d.array = {
                            string: h,
                            array: c,
                            arraybuffer: function(t) {
                                return new Uint8Array(t)
                                    .buffer
                            },
                            uint8array: function(t) {
                                return new Uint8Array(t)
                            },
                            nodebuffer: function(t) {
                                return o.newBuffer(t)
                            }
                        }, d.arraybuffer = {
                            string: function(t) {
                                return h(new Uint8Array(t))
                            },
                            array: function(t) {
                                return _(new Uint8Array(t), new Array(t.byteLength))
                            },
                            arraybuffer: c,
                            uint8array: function(t) {
                                return new Uint8Array(t)
                            },
                            nodebuffer: function(t) {
                                return o.newBuffer(new Uint8Array(t))
                            }
                        }, d.uint8array = {
                            string: h,
                            array: function(t) {
                                return _(t, new Array(t.length))
                            },
                            arraybuffer: function(t) {
                                return t.buffer
                            },
                            uint8array: c,
                            nodebuffer: function(t) {
                                return o.newBuffer(t)
                            }
                        }, d.nodebuffer = {
                            string: h,
                            array: function(t) {
                                return _(t, new Array(t.length))
                            },
                            arraybuffer: function(t) {
                                return d.nodebuffer.uint8array(t)
                                    .buffer
                            },
                            uint8array: function(t) {
                                return _(t, new Uint8Array(t.length))
                            },
                            nodebuffer: c
                        }, e.transformTo = function(t, n) {
                            if (n || (n = ""), !t) return n;
                            e.checkSupport(t);
                            var i = e.getTypeOf(n);
                            return d[i][t](n)
                        }, e.getTypeOf = function(t) {
                            return "string" == typeof t ? "string" : "[object Array]" === Object.prototype.toString.call(t) ? "array" : i.nodebuffer && o.isBuffer(t) ? "nodebuffer" : i.uint8array && t instanceof Uint8Array ? "uint8array" : i.arraybuffer && t instanceof ArrayBuffer ? "arraybuffer" : undefined
                        }, e.checkSupport = function(t) {
                            if (!i[t.toLowerCase()]) throw new Error(t + " is not supported by this platform")
                        }, e.MAX_VALUE_16BITS = 65535, e.MAX_VALUE_32BITS = -1, e.pretty = function(t) {
                            var n, e, i = "";
                            for (e = 0; e < (t || "")
                                .length; e++) i += "\\x" + ((n = t.charCodeAt(e)) < 16 ? "0" : "") + n.toString(16)
                                .toUpperCase();
                            return i
                        }, e.delay = function(t, n, e) {
                            s((function() {
                                t.apply(e || null, n || [])
                            }))
                        }, e.inherits = function(t, n) {
                            var e = function() {};
                            e.prototype = n.prototype, t.prototype = new e
                        }, e.extend = function() {
                            var t, n, e = {};
                            for (t = 0; t < arguments.length; t++)
                                for (n in arguments[t]) arguments[t].hasOwnProperty(n) && undefined === e[n] && (e[n] = arguments[t][n]);
                            return e
                        }, e.prepareContent = function(t, n, o, s, c) {
                            return a.Promise.resolve(n)
                                .then((function(t) {
                                    return i.blob && t instanceof Blob && "undefined" != typeof FileReader ? new a.Promise((function(n, e) {
                                        var i = new FileReader;
                                        i.onload = function(t) {
                                            n(t.target.result)
                                        }, i.onerror = function(t) {
                                            e(t.target.error)
                                        }, i.readAsArrayBuffer(t)
                                    })) : t
                                }))
                                .then((function(n) {
                                    var i = e.getTypeOf(n);
                                    return i ? ("arraybuffer" === i ? n = e.transformTo("uint8array", n) : "string" === i && (c ? n = r.decode(n) : o && true !== s && (n = u(n))), n) : a.Promise.reject(new Error("The data of '" + t + "' is in an unsupported format !"))
                                }))
                        }
                    }, {
                        "./base64": 1,
                        "./external": 6,
                        "./nodejsUtils": 14,
                        "./support": 30,
                        "core-js/library/fn/set-immediate": 36
                    }],
                    33: [function(t, n, e) {
                        var i = t("./reader/readerFor"),
                            r = t("./utils"),
                            o = t("./signature"),
                            s = t("./zipEntry"),
                            a = (t("./utf8"), t("./support"));
                        function u(t) {
                            this.files = [], this.loadOptions = t
                        }
                        u.prototype = {
                            checkSignature: function(t) {
                                if (!this.reader.readAndCheckSignature(t)) {
                                    this.reader.index -= 4;
                                    var n = this.reader.readString(4);
                                    throw new Error("Corrupted zip or bug : unexpected signature (" + r.pretty(n) + ", expected " + r.pretty(t) + ")")
                                }
                            },
                            isSignature: function(t, n) {
                                var e = this.reader.index;
                                this.reader.setIndex(t);
                                var i = this.reader.readString(4) === n;
                                return this.reader.setIndex(e), i
                            },
                            readBlockEndOfCentral: function() {
                                this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
                                var t = this.reader.readData(this.zipCommentLength),
                                    n = a.uint8array ? "uint8array" : "array",
                                    e = r.transformTo(n, t);
                                this.zipComment = this.loadOptions.decodeFileName(e)
                            },
                            readBlockZip64EndOfCentral: function() {
                                this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
                                for (var t, n, e, i = this.zip64EndOfCentralSize - 44, r = 0; r < i;) t = this.reader.readInt(2), n = this.reader.readInt(4), e = this.reader.readData(n), this.zip64ExtensibleData[t] = {
                                    id: t,
                                    length: n,
                                    value: e
                                }
                            },
                            readBlockZip64EndOfCentralLocator: function() {
                                if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1) throw new Error("Multi-volumes zip are not supported")
                            },
                            readLocalFiles: function() {
                                var t, n;
                                for (t = 0; t < this.files.length; t++) n = this.files[t], this.reader.setIndex(n.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), n.readLocalPart(this.reader), n.handleUTF8(), n.processAttributes()
                            },
                            readCentralDir: function() {
                                var t;
                                for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER);)(t = new s({
                                        zip64: this.zip64
                                    }, this.loadOptions))
                                    .readCentralPart(this.reader), this.files.push(t);
                                if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length)
                            },
                            readEndOfCentral: function() {
                                var t = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
                                if (t < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip : can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html");
                                this.reader.setIndex(t);
                                var n = t;
                                if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === r.MAX_VALUE_16BITS || this.diskWithCentralDirStart === r.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === r.MAX_VALUE_16BITS || this.centralDirRecords === r.MAX_VALUE_16BITS || this.centralDirSize === r.MAX_VALUE_32BITS || this.centralDirOffset === r.MAX_VALUE_32BITS) {
                                    if (this.zip64 = true, (t = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
                                    if (this.reader.setIndex(t), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");
                                    this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral()
                                }
                                var e = this.centralDirOffset + this.centralDirSize;
                                this.zip64 && (e += 20, e += 12 + this.zip64EndOfCentralSize);
                                var i = n - e;
                                if (i > 0) this.isSignature(n, o.CENTRAL_FILE_HEADER) || (this.reader.zero = i);
                                else if (i < 0) throw new Error("Corrupted zip: missing " + Math.abs(i) + " bytes.")
                            },
                            prepareReader: function(t) {
                                this.reader = i(t)
                            },
                            load: function(t) {
                                this.prepareReader(t), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles()
                            }
                        }, n.exports = u
                    }, {
                        "./reader/readerFor": 22,
                        "./signature": 23,
                        "./support": 30,
                        "./utf8": 31,
                        "./utils": 32,
                        "./zipEntry": 34
                    }],
                    34: [function(t, n, e) {
                        var i = t("./reader/readerFor"),
                            r = t("./utils"),
                            o = t("./compressedObject"),
                            s = t("./crc32"),
                            a = t("./utf8"),
                            u = t("./compressions"),
                            c = t("./support"),
                            l = 0,
                            f = 3,
                            h = function(t) {
                                for (var n in u)
                                    if (u.hasOwnProperty(n) && u[n].magic === t) return u[n];
                                return null
                            };
                        function _(t, n) {
                            this.options = t, this.loadOptions = n
                        }
                        _.prototype = {
                            isEncrypted: function() {
                                return 1 == (1 & this.bitFlag)
                            },
                            useUTF8: function() {
                                return 2048 == (2048 & this.bitFlag)
                            },
                            readLocalPart: function(t) {
                                var n, e;
                                if (t.skip(22), this.fileNameLength = t.readInt(2), e = t.readInt(2), this.fileName = t.readData(this.fileNameLength), t.skip(e), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                                if (null === (n = h(this.compressionMethod))) throw new Error("Corrupted zip : compression " + r.pretty(this.compressionMethod) + " unknown (inner file : " + r.transformTo("string", this.fileName) + ")");
                                this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, n, t.readData(this.compressedSize))
                            },
                            readCentralPart: function(t) {
                                this.versionMadeBy = t.readInt(2), t.skip(2), this.bitFlag = t.readInt(2), this.compressionMethod = t.readString(2), this.date = t.readDate(), this.crc32 = t.readInt(4), this.compressedSize = t.readInt(4), this.uncompressedSize = t.readInt(4);
                                var n = t.readInt(2);
                                if (this.extraFieldsLength = t.readInt(2), this.fileCommentLength = t.readInt(2), this.diskNumberStart = t.readInt(2), this.internalFileAttributes = t.readInt(2), this.externalFileAttributes = t.readInt(4), this.localHeaderOffset = t.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
                                t.skip(n), this.readExtraFields(t), this.parseZIP64ExtraField(t), this.fileComment = t.readData(this.fileCommentLength)
                            },
                            processAttributes: function() {
                                this.unixPermissions = null, this.dosPermissions = null;
                                var t = this.versionMadeBy >> 8;
                                this.dir = !!(16 & this.externalFileAttributes), t === l && (this.dosPermissions = 63 & this.externalFileAttributes), t === f && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true)
                            },
                            parseZIP64ExtraField: function(t) {
                                if (this.extraFields[1]) {
                                    var n = i(this.extraFields[1].value);
                                    this.uncompressedSize === r.MAX_VALUE_32BITS && (this.uncompressedSize = n.readInt(8)), this.compressedSize === r.MAX_VALUE_32BITS && (this.compressedSize = n.readInt(8)), this.localHeaderOffset === r.MAX_VALUE_32BITS && (this.localHeaderOffset = n.readInt(8)), this.diskNumberStart === r.MAX_VALUE_32BITS && (this.diskNumberStart = n.readInt(4))
                                }
                            },
                            readExtraFields: function(t) {
                                var n, e, i, r = t.index + this.extraFieldsLength;
                                for (this.extraFields || (this.extraFields = {}); t.index < r;) n = t.readInt(2), e = t.readInt(2), i = t.readData(e), this.extraFields[n] = {
                                    id: n,
                                    length: e,
                                    value: i
                                }
                            },
                            handleUTF8: function() {
                                var t = c.uint8array ? "uint8array" : "array";
                                if (this.useUTF8()) this.fileNameStr = a.utf8decode(this.fileName), this.fileCommentStr = a.utf8decode(this.fileComment);
                                else {
                                    var n = this.findExtraFieldUnicodePath();
                                    if (null !== n) this.fileNameStr = n;
                                    else {
                                        var e = r.transformTo(t, this.fileName);
                                        this.fileNameStr = this.loadOptions.decodeFileName(e)
                                    }
                                    var i = this.findExtraFieldUnicodeComment();
                                    if (null !== i) this.fileCommentStr = i;
                                    else {
                                        var o = r.transformTo(t, this.fileComment);
                                        this.fileCommentStr = this.loadOptions.decodeFileName(o)
                                    }
                                }
                            },
                            findExtraFieldUnicodePath: function() {
                                var t = this.extraFields[28789];
                                if (t) {
                                    var n = i(t.value);
                                    return 1 !== n.readInt(1) || s(this.fileName) !== n.readInt(4) ? null : a.utf8decode(n.readData(t.length - 5))
                                }
                                return null
                            },
                            findExtraFieldUnicodeComment: function() {
                                var t = this.extraFields[25461];
                                if (t) {
                                    var n = i(t.value);
                                    return 1 !== n.readInt(1) || s(this.fileComment) !== n.readInt(4) ? null : a.utf8decode(n.readData(t.length - 5))
                                }
                                return null
                            }
                        }, n.exports = _
                    }, {
                        "./compressedObject": 2,
                        "./compressions": 3,
                        "./crc32": 4,
                        "./reader/readerFor": 22,
                        "./support": 30,
                        "./utf8": 31,
                        "./utils": 32
                    }],
                    35: [function(t, n, e) {
                        var i = t("./stream/StreamHelper"),
                            r = t("./stream/DataWorker"),
                            o = t("./utf8"),
                            s = t("./compressedObject"),
                            a = t("./stream/GenericWorker"),
                            u = function(t, n, e) {
                                this.name = t, this.dir = e.dir, this.date = e.date, this.comment = e.comment, this.unixPermissions = e.unixPermissions, this.dosPermissions = e.dosPermissions, this._data = n, this._dataBinary = e.binary, this.options = {
                                    compression: e.compression,
                                    compressionOptions: e.compressionOptions
                                }
                            };
                        u.prototype = {
                            internalStream: function(t) {
                                var n = t.toLowerCase(),
                                    e = "string" === n || "text" === n;
                                "binarystring" !== n && "text" !== n || (n = "string");
                                var r = this._decompressWorker(),
                                    s = !this._dataBinary;
                                return s && !e && (r = r.pipe(new o.Utf8EncodeWorker)), !s && e && (r = r.pipe(new o.Utf8DecodeWorker)), new i(r, n, "")
                            },
                            async: function(t, n) {
                                return this.internalStream(t)
                                    .accumulate(n)
                            },
                            nodeStream: function(t, n) {
                                return this.internalStream(t || "nodebuffer")
                                    .toNodejsStream(n)
                            },
                            _compressWorker: function(t, n) {
                                if (this._data instanceof s && this._data.compression.magic === t.magic) return this._data.getCompressedWorker();
                                var e = this._decompressWorker();
                                return this._dataBinary || (e = e.pipe(new o.Utf8EncodeWorker)), s.createWorkerFrom(e, t, n)
                            },
                            _decompressWorker: function() {
                                return this._data instanceof s ? this._data.getContentWorker() : this._data instanceof a ? this._data : new r(this._data)
                            }
                        };
                        for (var c = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
                                throw new Error("This method has been removed in JSZip 3.0, please igsd_form_custom_checkbox_checked the upgrade guide.")
                            }, f = 0; f < c.length; f++) u.prototype[c[f]] = l;
                        n.exports = u
                    }, {
                        "./compressedObject": 2,
                        "./stream/DataWorker": 27,
                        "./stream/GenericWorker": 28,
                        "./stream/StreamHelper": 29,
                        "./utf8": 31
                    }],
                    36: [function(t, n, e) {
                        t("../modules/web.immediate"), n.exports = t("../modules/_core")
                            .setImmediate
                    }, {
                        "../modules/_core": 40,
                        "../modules/web.immediate": 56
                    }],
                    37: [function(t, n, e) {
                        n.exports = function(t) {
                            if ("function" != typeof t) throw TypeError(t + " is not a function!");
                            return t
                        }
                    }, {}],
                    38: [function(t, n, e) {
                        var i = t("./_is-object");
                        n.exports = function(t) {
                            if (!i(t)) throw TypeError(t + " is not an object!");
                            return t
                        }
                    }, {
                        "./_is-object": 51
                    }],
                    39: [function(t, n, e) {
                        var i = {}.toString;
                        n.exports = function(t) {
                            return i.call(t)
                                .slice(8, -1)
                        }
                    }, {}],
                    40: [function(t, n, e) {
                        var i = n.exports = {
                            version: "2.3.0"
                        };
                        "number" == typeof __e && (__e = i)
                    }, {}],
                    41: [function(t, n, e) {
                        var i = t("./_a-function");
                        n.exports = function(t, n, e) {
                            if (i(t), undefined === n) return t;
                            switch (e) {
                                case 1:
                                    return function(e) {
                                        return t.call(n, e)
                                    };
                                case 2:
                                    return function(e, i) {
                                        return t.call(n, e, i)
                                    };
                                case 3:
                                    return function(e, i, r) {
                                        return t.call(n, e, i, r)
                                    }
                            }
                            return function() {
                                return t.apply(n, arguments)
                            }
                        }
                    }, {
                        "./_a-function": 37
                    }],
                    42: [function(t, n, e) {
                        n.exports = !t("./_fails")((function() {
                            return 7 != Object.defineProperty({}, "a", {
                                    _get: function() {
                                        return 7
                                    }
                                })
                                .a
                        }))
                    }, {
                        "./_fails": 45
                    }],
                    43: [function(t, n, e) {
                        var i = t("./_is-object"),
                            r = t("./_global")
                            .document,
                            o = i(r) && i(r.createElement);
                        n.exports = function(t) {
                            return o ? r.createElement(t) : {}
                        }
                    }, {
                        "./_global": 46,
                        "./_is-object": 51
                    }],
                    44: [function(t, n, e) {
                        var i = t("./_global"),
                            r = t("./_core"),
                            o = t("./_ctx"),
                            s = t("./_hide"),
                            a = "prototype",
                            u = function(t, n, e) {
                                var c, l, f, h = t & u.F,
                                    _ = t & u.G,
                                    d = t & u.S,
                                    v = t & u.P,
                                    m = t & u.B,
                                    p = t & u.W,
                                    w = _ ? r : r[n] || (r[n] = {}),
                                    b = w[a],
                                    k = _ ? i : d ? i[n] : (i[n] || {})[a];
                                for (c in _ && (e = n), e)(l = !h && k && undefined !== k[c]) && c in w || (f = l ? k[c] : e[c], w[c] = _ && "function" != typeof k[c] ? e[c] : m && l ? o(f, i) : p && k[c] == f ? function(t) {
                                    var n = function(n, e, i) {
                                        if (this instanceof t) {
                                            switch (arguments.length) {
                                                case 0:
                                                    return new t;
                                                case 1:
                                                    return new t(n);
                                                case 2:
                                                    return new t(n, e)
                                            }
                                            return new t(n, e, i)
                                        }
                                        return t.apply(this, arguments)
                                    };
                                    return n[a] = t[a], n
                                }(f) : v && "function" == typeof f ? o(Function.call, f) : f, v && ((w.virtual || (w.virtual = {}))[c] = f, t & u.R && b && !b[c] && s(b, c, f)))
                            };
                        u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, n.exports = u
                    }, {
                        "./_core": 40,
                        "./_ctx": 41,
                        "./_global": 46,
                        "./_hide": 47
                    }],
                    45: [function(t, n, e) {
                        n.exports = function(t) {
                            try {
                                return !!t()
                            } catch (t) {
                                return true
                            }
                        }
                    }, {}],
                    46: [function(t, n, e) {
                        var i = n.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
                        "number" == typeof __g && (__g = i)
                    }, {}],
                    47: [function(t, n, e) {
                        var i = t("./_object-dp"),
                            r = t("./_property-desc");
                        n.exports = t("./_descriptors") ? function(t, n, e) {
                            return i.f(t, n, r(1, e))
                        } : function(t, n, e) {
                            return t[n] = e, t
                        }
                    }, {
                        "./_descriptors": 42,
                        "./_object-dp": 52,
                        "./_property-desc": 53
                    }],
                    48: [function(t, n, e) {
                        n.exports = t("./_global")
                            .document && document.documentElement
                    }, {
                        "./_global": 46
                    }],
                    49: [function(t, n, e) {
                        n.exports = !t("./_descriptors") && !t("./_fails")((function() {
                            return 7 != Object.defineProperty(t("./_dom-create")("div"), "a", {
                                    _get: function() {
                                        return 7
                                    }
                                })
                                .a
                        }))
                    }, {
                        "./_descriptors": 42,
                        "./_dom-create": 43,
                        "./_fails": 45
                    }],
                    50: [function(t, n, e) {
                        n.exports = function(t, n, e) {
                            var i = undefined === e;
                            switch (n.length) {
                                case 0:
                                    return i ? t() : t.call(e);
                                case 1:
                                    return i ? t(n[0]) : t.call(e, n[0]);
                                case 2:
                                    return i ? t(n[0], n[1]) : t.call(e, n[0], n[1]);
                                case 3:
                                    return i ? t(n[0], n[1], n[2]) : t.call(e, n[0], n[1], n[2]);
                                case 4:
                                    return i ? t(n[0], n[1], n[2], n[3]) : t.call(e, n[0], n[1], n[2], n[3])
                            }
                            return t.apply(e, n)
                        }
                    }, {}],
                    51: [function(t, n, e) {
                        n.exports = function(t) {
                            return "object" == typeof t ? null !== t : "function" == typeof t
                        }
                    }, {}],
                    52: [function(t, n, e) {
                        var i = t("./_an-object"),
                            r = t("./_ie8-dom-define"),
                            o = t("./_to-primitive"),
                            s = Object.defineProperty;
                        e.f = t("./_descriptors") ? Object.defineProperty : function(t, n, e) {
                            if (i(t), n = o(n, true), i(e), r) try {
                                return s(t, n, e)
                            } catch (t) {}
                            if ("get" in e || "set" in e) throw TypeError("Accessors not supported!");
                            return "value" in e && (t[n] = e.value), t
                        }
                    }, {
                        "./_an-object": 38,
                        "./_descriptors": 42,
                        "./_ie8-dom-define": 49,
                        "./_to-primitive": 55
                    }],
                    53: [function(t, n, e) {
                        n.exports = function(t, n) {
                            return {
                                enumerable: !(1 & t),
                                configurable: !(2 & t),
                                writable: !(4 & t),
                                value: n
                            }
                        }
                    }, {}],
                    54: [function(t, n, e) {
                        var i, r, o, s = t("./_ctx"),
                            a = t("./_invoke"),
                            u = t("./_html"),
                            c = t("./_dom-create"),
                            l = t("./_global"),
                            f = l.process,
                            h = l.setImmediate,
                            _ = l.clearImmediate,
                            d = l.MessageChannel,
                            v = 0,
                            m = {},
                            p = "onreadystatechange",
                            w = function() {
                                var t = +this;
                                if (m.hasOwnProperty(t)) {
                                    var n = m[t];
                                    delete m[t], n()
                                }
                            },
                            b = function(t) {
                                w.call(t.data)
                            };
                        h && _ || (h = function(t) {
                            for (var n = [], e = 1; arguments.length > e;) n.push(arguments[e++]);
                            return m[++v] = function() {
                                a("function" == typeof t ? t : Function(t), n)
                            }, i(v), v
                        }, _ = function(t) {
                            delete m[t]
                        }, "process" == t("./_cof")(f) ? i = function(t) {
                            f.nextTick(s(w, t, 1))
                        } : d ? (o = (r = new d)
                            .port2, r.port1.onmessage = b, i = s(o.postMessage, o, 1)) : l.addEventListener && "function" == typeof postMessage && !l.importScripts ? (i = function(t) {
                            l.postMessage(t + "", "*")
                        }, l.addEventListener("message", b, false)) : i = p in c("script") ? function(t) {
                            u.appendChild(c("script"))[p] = function() {
                                u.removeChild(this), w.call(t)
                            }
                        } : function(t) {
                            setTimeout(s(w, t, 1), 0)
                        }), n.exports = {
                            set: h,
                            clear: _
                        }
                    }, {
                        "./_cof": 39,
                        "./_ctx": 41,
                        "./_dom-create": 43,
                        "./_global": 46,
                        "./_html": 48,
                        "./_invoke": 50
                    }],
                    55: [function(t, n, e) {
                        var i = t("./_is-object");
                        n.exports = function(t, n) {
                            if (!i(t)) return t;
                            var e, r;
                            if (n && "function" == typeof(e = t.toString) && !i(r = e.call(t))) return r;
                            if ("function" == typeof(e = t.valueOf) && !i(r = e.call(t))) return r;
                            if (!n && "function" == typeof(e = t.toString) && !i(r = e.call(t))) return r;
                            throw TypeError("Can't convert object to primitive value")
                        }
                    }, {
                        "./_is-object": 51
                    }],
                    56: [function(t, n, e) {
                        var i = t("./_export"),
                            r = t("./_task");
                        i(i.G + i.B, {
                            setImmediate: r.set,
                            clearImmediate: r.clear
                        })
                    }, {
                        "./_export": 44,
                        "./_task": 54
                    }],
                    57: [function(t, n, i) {
                        (function(t) {
                            var e, i, r = t.MutationObserver || t.WebKitMutationObserver;
                            if (r) {
                                var o = 0,
                                    s = new r(l),
                                    a = t.document.createTextNode("");
                                s.observe(a, {
                                    characterData: true
                                }), e = function() {
                                    a.data = o = ++o % 2
                                }
                            } else if (t.setImmediate || undefined === t.MessageChannel) e = "document" in t && "onreadystatechange" in t.document.createElement("script") ? function() {
                                var n = t.document.createElement("script");
                                n.onreadystatechange = function() {
                                    l(), n.onreadystatechange = null, n.parentNode.removeChild(n), n = null
                                }, t.document.documentElement.appendChild(n)
                            } : function() {
                                setTimeout(l, 0)
                            };
                            else {
                                var u = new t.MessageChannel;
                                u.port1.onmessage = l, e = function() {
                                    u.port2.postMessage(0)
                                }
                            }
                            var c = [];
                            function l() {
                                var t, n;
                                i = true;
                                for (var e = c.length; e;) {
                                    for (n = c, c = [], t = -1; ++t < e;) n[t]();
                                    e = c.length
                                }
                                i = false
                            }
                            function f(t) {
                                1 !== c.push(t) || i || e()
                            }
                            n.exports = f
                        })
                        .call(this, undefined !== e.g ? e.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                    }, {}],
                    58: [function(t, n, e) {
                        var i = t("immediate");
                        function r() {}
                        var o = {},
                            s = ["REJECTED"],
                            a = ["FULFILLED"],
                            u = ["PENDING"];
                        function c(t) {
                            if ("function" != typeof t) throw new TypeError("resolver must be a function");
                            this.state = u, this.queue = [], this.outcome = undefined, t !== r && _(this, t)
                        }
                        function l(t, n, e) {
                            this.promise = t, "function" == typeof n && (this.onFulfilled = n, this.callFulfilled = this.otherCallFulfilled), "function" == typeof e && (this.onRejected = e, this.callRejected = this.otherCallRejected)
                        }
                        function f(t, n, e) {
                            i((function() {
                                var i;
                                try {
                                    i = n(e)
                                } catch (n) {
                                    return o.reject(t, n)
                                }
                                i === t ? o.reject(t, new TypeError("Cannot resolve promise with itself")) : o.resolve(t, i)
                            }))
                        }
                        function h(t) {
                            var n = t && t.then;
                            if (t && "object" == typeof t && "function" == typeof n) return function() {
                                n.apply(t, arguments)
                            }
                        }
                        function _(t, n) {
                            var e = false;
                            function i(n) {
                                e || (e = true, o.reject(t, n))
                            }
                            function r(n) {
                                e || (e = true, o.resolve(t, n))
                            }
                            function s() {
                                n(r, i)
                            }
                            var a = d(s);
                            "error" === a.status && i(a.value)
                        }
                        function d(t, n) {
                            var e = {};
                            try {
                                e.value = t(n), e.status = "success"
                            } catch (t) {
                                e.status = "error", e.value = t
                            }
                            return e
                        }
                        function v(t) {
                            return t instanceof this ? t : o.resolve(new this(r), t)
                        }
                        function m(t) {
                            var n = new this(r);
                            return o.reject(n, t)
                        }
                        function p(t) {
                            var n = this;
                            if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array"));
                            var e = t.length,
                                i = false;
                            if (!e) return this.resolve([]);
                            for (var s = new Array(e), a = 0, u = -1, c = new this(r); ++u < e;) l(t[u], u);
                            return c;
                            function l(t, r) {
                                function u(t) {
                                    s[r] = t, ++a !== e || i || (i = true, o.resolve(c, s))
                                }
                                n.resolve(t)
                                    .then(u, (function(t) {
                                        i || (i = true, o.reject(c, t))
                                    }))
                            }
                        }
                        function w(t) {
                            var n = this;
                            if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array"));
                            var e = t.length,
                                i = false;
                            if (!e) return this.resolve([]);
                            for (var s = -1, a = new this(r); ++s < e;) u(t[s]);
                            return a;
                            function u(t) {
                                n.resolve(t)
                                    .then((function(t) {
                                        i || (i = true, o.resolve(a, t))
                                    }), (function(t) {
                                        i || (i = true, o.reject(a, t))
                                    }))
                            }
                        }
                        n.exports = c, c.prototype.catch = function(t) {
                            return this.then(null, t)
                        }, c.prototype.then = function(t, n) {
                            if ("function" != typeof t && this.state === a || "function" != typeof n && this.state === s) return this;
                            var e = new this.constructor(r);
                            return this.state !== u ? f(e, this.state === a ? t : n, this.outcome) : this.queue.push(new l(e, t, n)), e
                        }, l.prototype.callFulfilled = function(t) {
                            o.resolve(this.promise, t)
                        }, l.prototype.otherCallFulfilled = function(t) {
                            f(this.promise, this.onFulfilled, t)
                        }, l.prototype.callRejected = function(t) {
                            o.reject(this.promise, t)
                        }, l.prototype.otherCallRejected = function(t) {
                            f(this.promise, this.onRejected, t)
                        }, o.resolve = function(t, n) {
                            var e = d(h, n);
                            if ("error" === e.status) return o.reject(t, e.value);
                            var i = e.value;
                            if (i) _(t, i);
                            else {
                                t.state = a, t.outcome = n;
                                for (var r = -1, s = t.queue.length; ++r < s;) t.queue[r].callFulfilled(n)
                            }
                            return t
                        }, o.reject = function(t, n) {
                            t.state = s, t.outcome = n;
                            for (var e = -1, i = t.queue.length; ++e < i;) t.queue[e].callRejected(n);
                            return t
                        }, c.resolve = v, c.reject = m, c.all = p, c.race = w
                    }, {
                        immediate: 57
                    }],
                    59: [function(t, n, e) {
                        var i = {};
                        (0, t("./lib/utils/common")
                            .assign)(i, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), n.exports = i
                    }, {
                        "./lib/deflate": 60,
                        "./lib/inflate": 61,
                        "./lib/utils/common": 62,
                        "./lib/zlib/constants": 65
                    }],
                    60: [function(t, n, e) {
                        var i = t("./zlib/deflate"),
                            r = t("./utils/common"),
                            o = t("./utils/strings"),
                            s = t("./zlib/messages"),
                            a = t("./zlib/zstream"),
                            u = Object.prototype.toString,
                            c = 0,
                            l = 4,
                            f = 0,
                            h = 1,
                            _ = 2,
                            d = -1,
                            v = 0,
                            m = 8;
                        function p(t) {
                            if (!(this instanceof p)) return new p(t);
                            this.options = r.assign({
                                level: d,
                                method: m,
                                chunkSize: 16384,
                                windowBits: 15,
                                memLevel: 8,
                                strategy: v,
                                to: ""
                            }, t || {});
                            var n = this.options;
                            n.raw && n.windowBits > 0 ? n.windowBits = -n.windowBits : n.gzip && n.windowBits > 0 && n.windowBits < 16 && (n.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new a, this.strm.avail_out = 0;
                            var e = i.deflateInit2(this.strm, n.level, n.method, n.windowBits, n.memLevel, n.strategy);
                            if (e !== f) throw new Error(s[e]);
                            if (n.header && i.deflateSetHeader(this.strm, n.header), n.dictionary) {
                                var c;
                                if (c = "string" == typeof n.dictionary ? o.string2buf(n.dictionary) : "[object ArrayBuffer]" === u.call(n.dictionary) ? new Uint8Array(n.dictionary) : n.dictionary, (e = i.deflateSetDictionary(this.strm, c)) !== f) throw new Error(s[e]);
                                this._dict_set = true
                            }
                        }
                        function w(t, n) {
                            var e = new p(n);
                            if (e.push(t, true), e.err) throw e.msg;
                            return e.result
                        }
                        function b(t, n) {
                            return (n = n || {})
                                .raw = true, w(t, n)
                        }
                        function k(t, n) {
                            return (n = n || {})
                                .gzip = true, w(t, n)
                        }
                        p.prototype.push = function(t, n) {
                            var e, s, a = this.strm,
                                d = this.options.chunkSize;
                            if (this.ended) return false;
                            s = n === ~~n ? n : true === n ? l : c, "string" == typeof t ? a.input = o.string2buf(t) : "[object ArrayBuffer]" === u.call(t) ? a.input = new Uint8Array(t) : a.input = t, a.next_in = 0, a.avail_in = a.input.length;
                            do {
                                if (0 === a.avail_out && (a.output = new r.Buf8(d), a.next_out = 0, a.avail_out = d), (e = i.deflate(a, s)) !== h && e !== f) return this.onEnd(e), this.ended = true, false;
                                0 !== a.avail_out && (0 !== a.avail_in || s !== l && s !== _) || ("string" === this.options.to ? this.onData(o.buf2binstring(r.shrinkBuf(a.output, a.next_out))) : this.onData(r.shrinkBuf(a.output, a.next_out)))
                            } while ((a.avail_in > 0 || 0 === a.avail_out) && e !== h);
                            return s === l ? (e = i.deflateEnd(this.strm), this.onEnd(e), this.ended = true, e === f) : s !== _ || (this.onEnd(f), a.avail_out = 0, true)
                        }, p.prototype.onData = function(t) {
                            this.chunks.push(t)
                        }, p.prototype.onEnd = function(t) {
                            t === f && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
                        }, e.Deflate = p, e.deflate = w, e.deflateRaw = b, e.gzip = k
                    }, {
                        "./utils/common": 62,
                        "./utils/strings": 63,
                        "./zlib/deflate": 67,
                        "./zlib/messages": 72,
                        "./zlib/zstream": 74
                    }],
                    61: [function(t, n, e) {
                        var i = t("./zlib/inflate"),
                            r = t("./utils/common"),
                            o = t("./utils/strings"),
                            s = t("./zlib/constants"),
                            a = t("./zlib/messages"),
                            u = t("./zlib/zstream"),
                            c = t("./zlib/gzheader"),
                            l = Object.prototype.toString;
                        function f(t) {
                            if (!(this instanceof f)) return new f(t);
                            this.options = r.assign({
                                chunkSize: 16384,
                                windowBits: 0,
                                to: ""
                            }, t || {});
                            var n = this.options;
                            n.raw && n.windowBits >= 0 && n.windowBits < 16 && (n.windowBits = -n.windowBits, 0 === n.windowBits && (n.windowBits = -15)), !(n.windowBits >= 0 && n.windowBits < 16) || t && t.windowBits || (n.windowBits += 32), n.windowBits > 15 && n.windowBits < 48 && 0 == (15 & n.windowBits) && (n.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new u, this.strm.avail_out = 0;
                            var e = i.inflateInit2(this.strm, n.windowBits);
                            if (e !== s.Z_OK) throw new Error(a[e]);
                            this.header = new c, i.inflateGetHeader(this.strm, this.header)
                        }
                        function h(t, n) {
                            var e = new f(n);
                            if (e.push(t, true), e.err) throw e.msg;
                            return e.result
                        }
                        function _(t, n) {
                            return (n = n || {})
                                .raw = true, h(t, n)
                        }
                        f.prototype.push = function(t, n) {
                            var e, a, u, c, f, h, _ = this.strm,
                                d = this.options.chunkSize,
                                v = this.options.dictionary,
                                m = false;
                            if (this.ended) return false;
                            a = n === ~~n ? n : true === n ? s.Z_FINISH : s.Z_NO_FLUSH, "string" == typeof t ? _.input = o.binstring2buf(t) : "[object ArrayBuffer]" === l.call(t) ? _.input = new Uint8Array(t) : _.input = t, _.next_in = 0, _.avail_in = _.input.length;
                            do {
                                if (0 === _.avail_out && (_.output = new r.Buf8(d), _.next_out = 0, _.avail_out = d), (e = i.inflate(_, s.Z_NO_FLUSH)) === s.Z_NEED_DICT && v && (h = "string" == typeof v ? o.string2buf(v) : "[object ArrayBuffer]" === l.call(v) ? new Uint8Array(v) : v, e = i.inflateSetDictionary(this.strm, h)), e === s.Z_BUF_ERROR && true === m && (e = s.Z_OK, m = false), e !== s.Z_STREAM_END && e !== s.Z_OK) return this.onEnd(e), this.ended = true, false;
                                _.next_out && (0 !== _.avail_out && e !== s.Z_STREAM_END && (0 !== _.avail_in || a !== s.Z_FINISH && a !== s.Z_SYNC_FLUSH) || ("string" === this.options.to ? (u = o.utf8border(_.output, _.next_out), c = _.next_out - u, f = o.buf2string(_.output, u), _.next_out = c, _.avail_out = d - c, c && r.arraySet(_.output, _.output, u, c, 0), this.onData(f)) : this.onData(r.shrinkBuf(_.output, _.next_out)))), 0 === _.avail_in && 0 === _.avail_out && (m = true)
                            } while ((_.avail_in > 0 || 0 === _.avail_out) && e !== s.Z_STREAM_END);
                            return e === s.Z_STREAM_END && (a = s.Z_FINISH), a === s.Z_FINISH ? (e = i.inflateEnd(this.strm), this.onEnd(e), this.ended = true, e === s.Z_OK) : a !== s.Z_SYNC_FLUSH || (this.onEnd(s.Z_OK), _.avail_out = 0, true)
                        }, f.prototype.onData = function(t) {
                            this.chunks.push(t)
                        }, f.prototype.onEnd = function(t) {
                            t === s.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = r.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
                        }, e.Inflate = f, e.inflate = h, e.inflateRaw = _, e.ungzip = h
                    }, {
                        "./utils/common": 62,
                        "./utils/strings": 63,
                        "./zlib/constants": 65,
                        "./zlib/gzheader": 68,
                        "./zlib/inflate": 70,
                        "./zlib/messages": 72,
                        "./zlib/zstream": 74
                    }],
                    62: [function(t, n, e) {
                        var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
                        e.assign = function(t) {
                            for (var n = Array.prototype.slice.call(arguments, 1); n.length;) {
                                var e = n.shift();
                                if (e) {
                                    if ("object" != typeof e) throw new TypeError(e + "must be non-object");
                                    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
                                }
                            }
                            return t
                        }, e.shrinkBuf = function(t, n) {
                            return t.length === n ? t : t.subarray ? t.subarray(0, n) : (t.length = n, t)
                        };
                        var r = {
                                arraySet: function(t, n, e, i, r) {
                                    if (n.subarray && t.subarray) t.set(n.subarray(e, e + i), r);
                                    else
                                        for (var o = 0; o < i; o++) t[r + o] = n[e + o]
                                },
                                flattenChunks: function(t) {
                                    var n, e, i, r, o, s;
                                    for (i = 0, n = 0, e = t.length; n < e; n++) i += t[n].length;
                                    for (s = new Uint8Array(i), r = 0, n = 0, e = t.length; n < e; n++) o = t[n], s.set(o, r), r += o.length;
                                    return s
                                }
                            },
                            o = {
                                arraySet: function(t, n, e, i, r) {
                                    for (var o = 0; o < i; o++) t[r + o] = n[e + o]
                                },
                                flattenChunks: function(t) {
                                    return [].concat.apply([], t)
                                }
                            };
                        e.setTyped = function(t) {
                            t ? (e.Buf8 = Uint8Array, e.Buf16 = Uint16Array, e.Buf32 = Int32Array, e.assign(e, r)) : (e.Buf8 = Array, e.Buf16 = Array, e.Buf32 = Array, e.assign(e, o))
                        }, e.setTyped(i)
                    }, {}],
                    63: [function(t, n, e) {
                        var i = t("./common"),
                            r = true,
                            o = true;
                        try {
                            String.fromCharCode.apply(null, [0])
                        } catch (t) {
                            r = false
                        }
                        try {
                            String.fromCharCode.apply(null, new Uint8Array(1))
                        } catch (t) {
                            o = false
                        }
                        for (var s = new i.Buf8(256), a = 0; a < 256; a++) s[a] = a >= 252 ? 6 : a >= 248 ? 5 : a >= 240 ? 4 : a >= 224 ? 3 : a >= 192 ? 2 : 1;
                        function u(t, n) {
                            if (n < 65537 && (t.subarray && o || !t.subarray && r)) return String.fromCharCode.apply(null, i.shrinkBuf(t, n));
                            for (var e = "", s = 0; s < n; s++) e += String.fromCharCode(t[s]);
                            return e
                        }
                        s[254] = s[254] = 1, e.string2buf = function(t) {
                            var n, e, r, o, s, a = t.length,
                                u = 0;
                            for (o = 0; o < a; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (r = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (r - 56320), o++), u += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
                            for (n = new i.Buf8(u), s = 0, o = 0; s < u; o++) 55296 == (64512 & (e = t.charCodeAt(o))) && o + 1 < a && 56320 == (64512 & (r = t.charCodeAt(o + 1))) && (e = 65536 + (e - 55296 << 10) + (r - 56320), o++), e < 128 ? n[s++] = e : e < 2048 ? (n[s++] = 192 | e >>> 6, n[s++] = 128 | 63 & e) : e < 65536 ? (n[s++] = 224 | e >>> 12, n[s++] = 128 | e >>> 6 & 63, n[s++] = 128 | 63 & e) : (n[s++] = 240 | e >>> 18, n[s++] = 128 | e >>> 12 & 63, n[s++] = 128 | e >>> 6 & 63, n[s++] = 128 | 63 & e);
                            return n
                        }, e.buf2binstring = function(t) {
                            return u(t, t.length)
                        }, e.binstring2buf = function(t) {
                            for (var n = new i.Buf8(t.length), e = 0, r = n.length; e < r; e++) n[e] = t.charCodeAt(e);
                            return n
                        }, e.buf2string = function(t, n) {
                            var e, i, r, o, a = n || t.length,
                                c = new Array(2 * a);
                            for (i = 0, e = 0; e < a;)
                                if ((r = t[e++]) < 128) c[i++] = r;
                                else if ((o = s[r]) > 4) c[i++] = 65533, e += o - 1;
                            else {
                                for (r &= 2 === o ? 31 : 3 === o ? 15 : 7; o > 1 && e < a;) r = r << 6 | 63 & t[e++], o--;
                                o > 1 ? c[i++] = 65533 : r < 65536 ? c[i++] = r : (r -= 65536, c[i++] = 55296 | r >> 10 & 1023, c[i++] = 56320 | 1023 & r)
                            }
                            return u(c, i)
                        }, e.utf8border = function(t, n) {
                            var e;
                            for ((n = n || t.length) > t.length && (n = t.length), e = n - 1; e >= 0 && 128 == (192 & t[e]);) e--;
                            return e < 0 || 0 === e ? n : e + s[t[e]] > n ? e : n
                        }
                    }, {
                        "./common": 62
                    }],
                    64: [function(t, n, e) {
                        function i(t, n, e, i) {
                            for (var r = 65535 & t | 0, o = t >>> 16 & 65535 | 0, s = 0; 0 !== e;) {
                                e -= s = e > 2e3 ? 2e3 : e;
                                do {
                                    o = o + (r = r + n[i++] | 0) | 0
                                } while (--s);
                                r %= 65521, o %= 65521
                            }
                            return r | o << 16 | 0
                        }
                        n.exports = i
                    }, {}],
                    65: [function(t, n, e) {
                        n.exports = {
                            Z_NO_FLUSH: 0,
                            Z_PARTIAL_FLUSH: 1,
                            Z_SYNC_FLUSH: 2,
                            Z_FULL_FLUSH: 3,
                            Z_FINISH: 4,
                            Z_BLOCK: 5,
                            Z_TREES: 6,
                            Z_OK: 0,
                            Z_STREAM_END: 1,
                            Z_NEED_DICT: 2,
                            Z_ERRNO: -1,
                            Z_STREAM_ERROR: -2,
                            Z_DATA_ERROR: -3,
                            Z_BUF_ERROR: -5,
                            Z_NO_COMPRESSION: 0,
                            Z_BEST_SPEED: 1,
                            Z_BEST_COMPRESSION: 9,
                            Z_DEFAULT_COMPRESSION: -1,
                            Z_FILTERED: 1,
                            Z_HUFFMAN_ONLY: 2,
                            Z_RLE: 3,
                            Z_FIXED: 4,
                            Z_DEFAULT_STRATEGY: 0,
                            Z_BINARY: 0,
                            Z_TEXT: 1,
                            Z_UNKNOWN: 2,
                            Z_DEFLATED: 8
                        }
                    }, {}],
                    66: [function(t, n, e) {
                        function i() {
                            for (var t, n = [], e = 0; e < 256; e++) {
                                t = e;
                                for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                                n[e] = t
                            }
                            return n
                        }
                        var r = i();
                        function o(t, n, e, i) {
                            var o = r,
                                s = i + e;
                            t ^= -1;
                            for (var a = i; a < s; a++) t = t >>> 8 ^ o[255 & (t ^ n[a])];
                            return -1 ^ t
                        }
                        n.exports = o
                    }, {}],
                    67: [function(t, n, e) {
                        var i, r = t("../utils/common"),
                            o = t("./trees"),
                            s = t("./adler32"),
                            a = t("./crc32"),
                            u = t("./messages"),
                            c = 0,
                            l = 1,
                            f = 3,
                            h = 4,
                            _ = 5,
                            d = 0,
                            v = 1,
                            m = -2,
                            p = -3,
                            w = -5,
                            b = -1,
                            k = 1,
                            y = 2,
                            g = 3,
                            $ = 4,
                            E = 0,
                            S = 2,
                            x = 8,
                            A = 9,
                            I = 15,
                            P = 8,
                            U = 286,
                            R = 30,
                            C = 19,
                            D = 2 * U + 1,
                            T = 15,
                            N = 3,
                            B = 258,
                            j = B + N + 1,
                            F = 32,
                            O = 42,
                            z = 69,
                            q = 73,
                            M = 91,
                            L = 103,
                            G = 113,
                            W = 666,
                            Z = 1,
                            H = 2,
                            J = 3,
                            V = 4,
                            Q = 3;
                        function X(t, n) {
                            return t.msg = u[n], n
                        }
                        function K(t) {
                            return (t << 1) - (t > 4 ? 9 : 0)
                        }
                        function Y(t) {
                            for (var n = t.length; --n >= 0;) t[n] = 0
                        }
                        function tt(t) {
                            var n = t.state,
                                e = n.pending;
                            e > t.avail_out && (e = t.avail_out), 0 !== e && (r.arraySet(t.output, n.pending_buf, n.pending_out, e, t.next_out), t.next_out += e, n.pending_out += e, t.total_out += e, t.avail_out -= e, n.pending -= e, 0 === n.pending && (n.pending_out = 0))
                        }
                        function nt(t, n) {
                            o._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, n), t.block_start = t.strstart, tt(t.strm)
                        }
                        function et(t, n) {
                            t.pending_buf[t.pending++] = n
                        }
                        function it(t, n) {
                            t.pending_buf[t.pending++] = n >>> 8 & 255, t.pending_buf[t.pending++] = 255 & n
                        }
                        function rt(t, n, e, i) {
                            var o = t.avail_in;
                            return o > i && (o = i), 0 === o ? 0 : (t.avail_in -= o, r.arraySet(n, t.input, t.next_in, o, e), 1 === t.state.wrap ? t.adler = s(t.adler, n, o, e) : 2 === t.state.wrap && (t.adler = a(t.adler, n, o, e)), t.next_in += o, t.total_in += o, o)
                        }
                        function ot(t, n) {
                            var e, i, r = t.max_chain_length,
                                o = t.strstart,
                                s = t.prev_length,
                                a = t.nice_match,
                                u = t.strstart > t.w_size - j ? t.strstart - (t.w_size - j) : 0,
                                c = t.window,
                                l = t.w_mask,
                                f = t.prev,
                                h = t.strstart + B,
                                _ = c[o + s - 1],
                                d = c[o + s];
                            t.prev_length >= t.good_match && (r >>= 2), a > t.lookahead && (a = t.lookahead);
                            do {
                                if (c[(e = n) + s] === d && c[e + s - 1] === _ && c[e] === c[o] && c[++e] === c[o + 1]) {
                                    o += 2, e++;
                                    do {} while (c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && c[++o] === c[++e] && o < h);
                                    if (i = B - (h - o), o = h - B, i > s) {
                                        if (t.match_start = n, s = i, i >= a) break;
                                        _ = c[o + s - 1], d = c[o + s]
                                    }
                                }
                            } while ((n = f[n & l]) > u && 0 != --r);
                            return s <= t.lookahead ? s : t.lookahead
                        }
                        function st(t) {
                            var n, e, i, o, s, a = t.w_size;
                            do {
                                if (o = t.window_size - t.lookahead - t.strstart, t.strstart >= a + (a - j)) {
                                    r.arraySet(t.window, t.window, a, a, 0), t.match_start -= a, t.strstart -= a, t.block_start -= a, n = e = t.hash_size;
                                    do {
                                        i = t.head[--n], t.head[n] = i >= a ? i - a : 0
                                    } while (--e);
                                    n = e = a;
                                    do {
                                        i = t.prev[--n], t.prev[n] = i >= a ? i - a : 0
                                    } while (--e);
                                    o += a
                                }
                                if (0 === t.strm.avail_in) break;
                                if (e = rt(t.strm, t.window, t.strstart + t.lookahead, o), t.lookahead += e, t.lookahead + t.insert >= N)
                                    for (s = t.strstart - t.insert, t.ins_h = t.window[s], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[s + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[s + N - 1]) & t.hash_mask, t.prev[s & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = s, s++, t.insert--, !(t.lookahead + t.insert < N)););
                            } while (t.lookahead < j && 0 !== t.strm.avail_in)
                        }
                        function at(t, n) {
                            var e = 65535;
                            for (e > t.pending_buf_size - 5 && (e = t.pending_buf_size - 5);;) {
                                if (t.lookahead <= 1) {
                                    if (st(t), 0 === t.lookahead && n === c) return Z;
                                    if (0 === t.lookahead) break
                                }
                                t.strstart += t.lookahead, t.lookahead = 0;
                                var i = t.block_start + e;
                                if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i, t.strstart = i, nt(t, false), 0 === t.strm.avail_out)) return Z;
                                if (t.strstart - t.block_start >= t.w_size - j && (nt(t, false), 0 === t.strm.avail_out)) return Z
                            }
                            return t.insert = 0, n === h ? (nt(t, true), 0 === t.strm.avail_out ? J : V) : (t.strstart > t.block_start && (nt(t, false), t.strm.avail_out), Z)
                        }
                        function ut(t, n) {
                            for (var e, i;;) {
                                if (t.lookahead < j) {
                                    if (st(t), t.lookahead < j && n === c) return Z;
                                    if (0 === t.lookahead) break
                                }
                                if (e = 0, t.lookahead >= N && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + N - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== e && t.strstart - e <= t.w_size - j && (t.match_length = ot(t, e)), t.match_length >= N)
                                    if (i = o._tr_tally(t, t.strstart - t.match_start, t.match_length - N), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= N) {
                                        t.match_length--;
                                        do {
                                            t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + N - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart
                                        } while (0 != --t.match_length);
                                        t.strstart++
                                    } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
                                else i = o._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
                                if (i && (nt(t, false), 0 === t.strm.avail_out)) return Z
                            }
                            return t.insert = t.strstart < N - 1 ? t.strstart : N - 1, n === h ? (nt(t, true), 0 === t.strm.avail_out ? J : V) : t.last_lit && (nt(t, false), 0 === t.strm.avail_out) ? Z : H
                        }
                        function ct(t, n) {
                            for (var e, i, r;;) {
                                if (t.lookahead < j) {
                                    if (st(t), t.lookahead < j && n === c) return Z;
                                    if (0 === t.lookahead) break
                                }
                                if (e = 0, t.lookahead >= N && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + N - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = N - 1, 0 !== e && t.prev_length < t.max_lazy_match && t.strstart - e <= t.w_size - j && (t.match_length = ot(t, e), t.match_length <= 5 && (t.strategy === k || t.match_length === N && t.strstart - t.match_start > 4096) && (t.match_length = N - 1)), t.prev_length >= N && t.match_length <= t.prev_length) {
                                    r = t.strstart + t.lookahead - N, i = o._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - N), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
                                    do {
                                        ++t.strstart <= r && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + N - 1]) & t.hash_mask, e = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart)
                                    } while (0 != --t.prev_length);
                                    if (t.match_available = 0, t.match_length = N - 1, t.strstart++, i && (nt(t, false), 0 === t.strm.avail_out)) return Z
                                } else if (t.match_available) {
                                    if ((i = o._tr_tally(t, 0, t.window[t.strstart - 1])) && nt(t, false), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return Z
                                } else t.match_available = 1, t.strstart++, t.lookahead--
                            }
                            return t.match_available && (i = o._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < N - 1 ? t.strstart : N - 1, n === h ? (nt(t, true), 0 === t.strm.avail_out ? J : V) : t.last_lit && (nt(t, false), 0 === t.strm.avail_out) ? Z : H
                        }
                        function lt(t, n) {
                            for (var e, i, r, s, a = t.window;;) {
                                if (t.lookahead <= B) {
                                    if (st(t), t.lookahead <= B && n === c) return Z;
                                    if (0 === t.lookahead) break
                                }
                                if (t.match_length = 0, t.lookahead >= N && t.strstart > 0 && (i = a[r = t.strstart - 1]) === a[++r] && i === a[++r] && i === a[++r]) {
                                    s = t.strstart + B;
                                    do {} while (i === a[++r] && i === a[++r] && i === a[++r] && i === a[++r] && i === a[++r] && i === a[++r] && i === a[++r] && i === a[++r] && r < s);
                                    t.match_length = B - (s - r), t.match_length > t.lookahead && (t.match_length = t.lookahead)
                                }
                                if (t.match_length >= N ? (e = o._tr_tally(t, 1, t.match_length - N), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (e = o._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), e && (nt(t, false), 0 === t.strm.avail_out)) return Z
                            }
                            return t.insert = 0, n === h ? (nt(t, true), 0 === t.strm.avail_out ? J : V) : t.last_lit && (nt(t, false), 0 === t.strm.avail_out) ? Z : H
                        }
                        function ft(t, n) {
                            for (var e;;) {
                                if (0 === t.lookahead && (st(t), 0 === t.lookahead)) {
                                    if (n === c) return Z;
                                    break
                                }
                                if (t.match_length = 0, e = o._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, e && (nt(t, false), 0 === t.strm.avail_out)) return Z
                            }
                            return t.insert = 0, n === h ? (nt(t, true), 0 === t.strm.avail_out ? J : V) : t.last_lit && (nt(t, false), 0 === t.strm.avail_out) ? Z : H
                        }
                        function ht(t, n, e, i, r) {
                            this.good_length = t, this.max_lazy = n, this.nice_length = e, this.max_chain = i, this.func = r
                        }
                        function _t(t) {
                            t.window_size = 2 * t.w_size, Y(t.head), t.max_lazy_match = i[t.level].max_lazy, t.good_match = i[t.level].good_length, t.nice_match = i[t.level].nice_length, t.max_chain_length = i[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = N - 1, t.match_available = 0, t.ins_h = 0
                        }
                        function dt() {
                            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new r.Buf16(2 * D), this.dyn_dtree = new r.Buf16(2 * (2 * R + 1)), this.bl_tree = new r.Buf16(2 * (2 * C + 1)), Y(this.dyn_ltree), Y(this.dyn_dtree), Y(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new r.Buf16(T + 1), this.heap = new r.Buf16(2 * U + 1), Y(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new r.Buf16(2 * U + 1), Y(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
                        }
                        function vt(t) {
                            var n;
                            return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = S, (n = t.state)
                                .pending = 0, n.pending_out = 0, n.wrap < 0 && (n.wrap = -n.wrap), n.status = n.wrap ? O : G, t.adler = 2 === n.wrap ? 0 : 1, n.last_flush = c, o._tr_init(n), d) : X(t, m)
                        }
                        function mt(t) {
                            var n = vt(t);
                            return n === d && _t(t.state), n
                        }
                        function pt(t, n) {
                            return t && t.state ? 2 !== t.state.wrap ? m : (t.state.gzhead = n, d) : m
                        }
                        function wt(t, n, e, i, o, s) {
                            if (!t) return m;
                            var a = 1;
                            if (n === b && (n = 6), i < 0 ? (a = 0, i = -i) : i > 15 && (a = 2, i -= 16), o < 1 || o > A || e !== x || i < 8 || i > 15 || n < 0 || n > 9 || s < 0 || s > $) return X(t, m);
                            8 === i && (i = 9);
                            var u = new dt;
                            return t.state = u, u.strm = t, u.wrap = a, u.gzhead = null, u.w_bits = i, u.w_size = 1 << u.w_bits, u.w_mask = u.w_size - 1, u.hash_bits = o + 7, u.hash_size = 1 << u.hash_bits, u.hash_mask = u.hash_size - 1, u.hash_shift = ~~((u.hash_bits + N - 1) / N), u.window = new r.Buf8(2 * u.w_size), u.head = new r.Buf16(u.hash_size), u.prev = new r.Buf16(u.w_size), u.lit_bufsize = 1 << o + 6, u.pending_buf_size = 4 * u.lit_bufsize, u.pending_buf = new r.Buf8(u.pending_buf_size), u.d_buf = 1 * u.lit_bufsize, u.l_buf = 3 * u.lit_bufsize, u.level = n, u.strategy = s, u.method = e, mt(t)
                        }
                        function bt(t, n) {
                            return wt(t, n, x, I, P, E)
                        }
                        function kt(t, n) {
                            var e, r, s, u;
                            if (!t || !t.state || n > _ || n < 0) return t ? X(t, m) : m;
                            if (r = t.state, !t.output || !t.input && 0 !== t.avail_in || r.status === W && n !== h) return X(t, 0 === t.avail_out ? w : m);
                            if (r.strm = t, e = r.last_flush, r.last_flush = n, r.status === O)
                                if (2 === r.wrap) t.adler = 0, et(r, 31), et(r, 139), et(r, 8), r.gzhead ? (et(r, (r.gzhead.text ? 1 : 0) + (r.gzhead.hcrc ? 2 : 0) + (r.gzhead.extra ? 4 : 0) + (r.gzhead.name ? 8 : 0) + (r.gzhead.comment ? 16 : 0)), et(r, 255 & r.gzhead.time), et(r, r.gzhead.time >> 8 & 255), et(r, r.gzhead.time >> 16 & 255), et(r, r.gzhead.time >> 24 & 255), et(r, 9 === r.level ? 2 : r.strategy >= y || r.level < 2 ? 4 : 0), et(r, 255 & r.gzhead.os), r.gzhead.extra && r.gzhead.extra.length && (et(r, 255 & r.gzhead.extra.length), et(r, r.gzhead.extra.length >> 8 & 255)), r.gzhead.hcrc && (t.adler = a(t.adler, r.pending_buf, r.pending, 0)), r.gzindex = 0, r.status = z) : (et(r, 0), et(r, 0), et(r, 0), et(r, 0), et(r, 0), et(r, 9 === r.level ? 2 : r.strategy >= y || r.level < 2 ? 4 : 0), et(r, Q), r.status = G);
                                else {
                                    var p = x + (r.w_bits - 8 << 4) << 8;
                                    p |= (r.strategy >= y || r.level < 2 ? 0 : r.level < 6 ? 1 : 6 === r.level ? 2 : 3) << 6, 0 !== r.strstart && (p |= F), p += 31 - p % 31, r.status = G, it(r, p), 0 !== r.strstart && (it(r, t.adler >>> 16), it(r, 65535 & t.adler)), t.adler = 1
                                } if (r.status === z)
                                if (r.gzhead.extra) {
                                    for (s = r.pending; r.gzindex < (65535 & r.gzhead.extra.length) && (r.pending !== r.pending_buf_size || (r.gzhead.hcrc && r.pending > s && (t.adler = a(t.adler, r.pending_buf, r.pending - s, s)), tt(t), s = r.pending, r.pending !== r.pending_buf_size));) et(r, 255 & r.gzhead.extra[r.gzindex]), r.gzindex++;
                                    r.gzhead.hcrc && r.pending > s && (t.adler = a(t.adler, r.pending_buf, r.pending - s, s)), r.gzindex === r.gzhead.extra.length && (r.gzindex = 0, r.status = q)
                                } else r.status = q;
                            if (r.status === q)
                                if (r.gzhead.name) {
                                    s = r.pending;
                                    do {
                                        if (r.pending === r.pending_buf_size && (r.gzhead.hcrc && r.pending > s && (t.adler = a(t.adler, r.pending_buf, r.pending - s, s)), tt(t), s = r.pending, r.pending === r.pending_buf_size)) {
                                            u = 1;
                                            break
                                        }
                                        u = r.gzindex < r.gzhead.name.length ? 255 & r.gzhead.name.charCodeAt(r.gzindex++) : 0, et(r, u)
                                    } while (0 !== u);
                                    r.gzhead.hcrc && r.pending > s && (t.adler = a(t.adler, r.pending_buf, r.pending - s, s)), 0 === u && (r.gzindex = 0, r.status = M)
                                } else r.status = M;
                            if (r.status === M)
                                if (r.gzhead.comment) {
                                    s = r.pending;
                                    do {
                                        if (r.pending === r.pending_buf_size && (r.gzhead.hcrc && r.pending > s && (t.adler = a(t.adler, r.pending_buf, r.pending - s, s)), tt(t), s = r.pending, r.pending === r.pending_buf_size)) {
                                            u = 1;
                                            break
                                        }
                                        u = r.gzindex < r.gzhead.comment.length ? 255 & r.gzhead.comment.charCodeAt(r.gzindex++) : 0, et(r, u)
                                    } while (0 !== u);
                                    r.gzhead.hcrc && r.pending > s && (t.adler = a(t.adler, r.pending_buf, r.pending - s, s)), 0 === u && (r.status = L)
                                } else r.status = L;
                            if (r.status === L && (r.gzhead.hcrc ? (r.pending + 2 > r.pending_buf_size && tt(t), r.pending + 2 <= r.pending_buf_size && (et(r, 255 & t.adler), et(r, t.adler >> 8 & 255), t.adler = 0, r.status = G)) : r.status = G), 0 !== r.pending) {
                                if (tt(t), 0 === t.avail_out) return r.last_flush = -1, d
                            } else if (0 === t.avail_in && K(n) <= K(e) && n !== h) return X(t, w);
                            if (r.status === W && 0 !== t.avail_in) return X(t, w);
                            if (0 !== t.avail_in || 0 !== r.lookahead || n !== c && r.status !== W) {
                                var b = r.strategy === y ? ft(r, n) : r.strategy === g ? lt(r, n) : i[r.level].func(r, n);
                                if (b !== J && b !== V || (r.status = W), b === Z || b === J) return 0 === t.avail_out && (r.last_flush = -1), d;
                                if (b === H && (n === l ? o._tr_align(r) : n !== _ && (o._tr_stored_block(r, 0, 0, false), n === f && (Y(r.head), 0 === r.lookahead && (r.strstart = 0, r.block_start = 0, r.insert = 0))), tt(t), 0 === t.avail_out)) return r.last_flush = -1, d
                            }
                            return n !== h ? d : r.wrap <= 0 ? v : (2 === r.wrap ? (et(r, 255 & t.adler), et(r, t.adler >> 8 & 255), et(r, t.adler >> 16 & 255), et(r, t.adler >> 24 & 255), et(r, 255 & t.total_in), et(r, t.total_in >> 8 & 255), et(r, t.total_in >> 16 & 255), et(r, t.total_in >> 24 & 255)) : (it(r, t.adler >>> 16), it(r, 65535 & t.adler)), tt(t), r.wrap > 0 && (r.wrap = -r.wrap), 0 !== r.pending ? d : v)
                        }
                        function yt(t) {
                            var n;
                            return t && t.state ? (n = t.state.status) !== O && n !== z && n !== q && n !== M && n !== L && n !== G && n !== W ? X(t, m) : (t.state = null, n === G ? X(t, p) : d) : m
                        }
                        function gt(t, n) {
                            var e, i, o, a, u, c, l, f, h = n.length;
                            if (!t || !t.state) return m;
                            if (2 === (a = (e = t.state)
                                    .wrap) || 1 === a && e.status !== O || e.lookahead) return m;
                            for (1 === a && (t.adler = s(t.adler, n, h, 0)), e.wrap = 0, h >= e.w_size && (0 === a && (Y(e.head), e.strstart = 0, e.block_start = 0, e.insert = 0), f = new r.Buf8(e.w_size), r.arraySet(f, n, h - e.w_size, e.w_size, 0), n = f, h = e.w_size), u = t.avail_in, c = t.next_in, l = t.input, t.avail_in = h, t.next_in = 0, t.input = n, st(e); e.lookahead >= N;) {
                                i = e.strstart, o = e.lookahead - (N - 1);
                                do {
                                    e.ins_h = (e.ins_h << e.hash_shift ^ e.window[i + N - 1]) & e.hash_mask, e.prev[i & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = i, i++
                                } while (--o);
                                e.strstart = i, e.lookahead = N - 1, st(e)
                            }
                            return e.strstart += e.lookahead, e.block_start = e.strstart, e.insert = e.lookahead, e.lookahead = 0, e.match_length = e.prev_length = N - 1, e.match_available = 0, t.next_in = c, t.input = l, t.avail_in = u, e.wrap = a, d
                        }
                        i = [new ht(0, 0, 0, 0, at), new ht(4, 4, 8, 4, ut), new ht(4, 5, 16, 8, ut), new ht(4, 6, 32, 32, ut), new ht(4, 4, 16, 16, ct), new ht(8, 16, 32, 32, ct), new ht(8, 16, 128, 128, ct), new ht(8, 32, 128, 256, ct), new ht(32, 128, 258, 1024, ct), new ht(32, 258, 258, 4096, ct)], e.deflateInit = bt, e.deflateInit2 = wt, e.deflateReset = mt, e.deflateResetKeep = vt, e.deflateSetHeader = pt, e.deflate = kt, e.deflateEnd = yt, e.deflateSetDictionary = gt, e.deflateInfo = "pako deflate (from Nodeca project)"
                    }, {
                        "../utils/common": 62,
                        "./adler32": 64,
                        "./crc32": 66,
                        "./messages": 72,
                        "./trees": 73
                    }],
                    68: [function(t, n, e) {
                        function i() {
                            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false
                        }
                        n.exports = i
                    }, {}],
                    69: [function(t, n, e) {
                        var i = 30,
                            r = 12;
                        n.exports = function(t, n) {
                            var e, o, s, a, u, c, l, f, h, _, d, v, m, p, w, b, k, y, g, $, E, S, x, A, I;
                            e = t.state, o = t.next_in, A = t.input, s = o + (t.avail_in - 5), a = t.next_out, I = t.output, u = a - (n - t.avail_out), c = a + (t.avail_out - 257), l = e.dmax, f = e.wsize, h = e.whave, _ = e.wnext, d = e.window, v = e.hold, m = e.bits, p = e.lencode, w = e.distcode, b = (1 << e.lenbits) - 1, k = (1 << e.distbits) - 1;
                            t: do {
                                m < 15 && (v += A[o++] << m, m += 8, v += A[o++] << m, m += 8), y = p[v & b];
                                n: for (;;) {
                                    if (v >>>= g = y >>> 24, m -= g, 0 == (g = y >>> 16 & 255)) I[a++] = 65535 & y;
                                    else {
                                        if (!(16 & g)) {
                                            if (0 == (64 & g)) {
                                                y = p[(65535 & y) + (v & (1 << g) - 1)];
                                                continue n
                                            }
                                            if (32 & g) {
                                                e.mode = r;
                                                break t
                                            }
                                            t.msg = "invalid literal/length code", e.mode = i;
                                            break t
                                        }
                                        $ = 65535 & y, (g &= 15) && (m < g && (v += A[o++] << m, m += 8), $ += v & (1 << g) - 1, v >>>= g, m -= g), m < 15 && (v += A[o++] << m, m += 8, v += A[o++] << m, m += 8), y = w[v & k];
                                        e: for (;;) {
                                            if (v >>>= g = y >>> 24, m -= g, !(16 & (g = y >>> 16 & 255))) {
                                                if (0 == (64 & g)) {
                                                    y = w[(65535 & y) + (v & (1 << g) - 1)];
                                                    continue e
                                                }
                                                t.msg = "invalid distance code", e.mode = i;
                                                break t
                                            }
                                            if (E = 65535 & y, m < (g &= 15) && (v += A[o++] << m, (m += 8) < g && (v += A[o++] << m, m += 8)), (E += v & (1 << g) - 1) > l) {
                                                t.msg = "invalid distance too far back", e.mode = i;
                                                break t
                                            }
                                            if (v >>>= g, m -= g, E > (g = a - u)) {
                                                if ((g = E - g) > h && e.sane) {
                                                    t.msg = "invalid distance too far back", e.mode = i;
                                                    break t
                                                }
                                                if (S = 0, x = d, 0 === _) {
                                                    if (S += f - g, g < $) {
                                                        $ -= g;
                                                        do {
                                                            I[a++] = d[S++]
                                                        } while (--g);
                                                        S = a - E, x = I
                                                    }
                                                } else if (_ < g) {
                                                    if (S += f + _ - g, (g -= _) < $) {
                                                        $ -= g;
                                                        do {
                                                            I[a++] = d[S++]
                                                        } while (--g);
                                                        if (S = 0, _ < $) {
                                                            $ -= g = _;
                                                            do {
                                                                I[a++] = d[S++]
                                                            } while (--g);
                                                            S = a - E, x = I
                                                        }
                                                    }
                                                } else if (S += _ - g, g < $) {
                                                    $ -= g;
                                                    do {
                                                        I[a++] = d[S++]
                                                    } while (--g);
                                                    S = a - E, x = I
                                                }
                                                for (; $ > 2;) I[a++] = x[S++], I[a++] = x[S++], I[a++] = x[S++], $ -= 3;
                                                $ && (I[a++] = x[S++], $ > 1 && (I[a++] = x[S++]))
                                            } else {
                                                S = a - E;
                                                do {
                                                    I[a++] = I[S++], I[a++] = I[S++], I[a++] = I[S++], $ -= 3
                                                } while ($ > 2);
                                                $ && (I[a++] = I[S++], $ > 1 && (I[a++] = I[S++]))
                                            }
                                            break
                                        }
                                    }
                                    break
                                }
                            } while (o < s && a < c);
                            o -= $ = m >> 3, v &= (1 << (m -= $ << 3)) - 1, t.next_in = o, t.next_out = a, t.avail_in = o < s ? s - o + 5 : 5 - (o - s), t.avail_out = a < c ? c - a + 257 : 257 - (a - c), e.hold = v, e.bits = m
                        }
                    }, {}],
                    70: [function(t, n, e) {
                        var i = t("../utils/common"),
                            r = t("./adler32"),
                            o = t("./crc32"),
                            s = t("./inffast"),
                            a = t("./inftrees"),
                            u = 0,
                            c = 1,
                            l = 2,
                            f = 4,
                            h = 5,
                            _ = 6,
                            d = 0,
                            v = 1,
                            m = 2,
                            p = -2,
                            w = -3,
                            b = -4,
                            k = -5,
                            y = 8,
                            g = 1,
                            $ = 2,
                            E = 3,
                            S = 4,
                            x = 5,
                            A = 6,
                            I = 7,
                            P = 8,
                            U = 9,
                            R = 10,
                            C = 11,
                            D = 12,
                            T = 13,
                            N = 14,
                            B = 15,
                            j = 16,
                            F = 17,
                            O = 18,
                            z = 19,
                            q = 20,
                            M = 21,
                            L = 22,
                            G = 23,
                            W = 24,
                            Z = 25,
                            H = 26,
                            J = 27,
                            V = 28,
                            Q = 29,
                            X = 30,
                            K = 31,
                            Y = 852,
                            tt = 592,
                            nt = 15;
                        function et(t) {
                            return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24)
                        }
                        function it() {
                            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.igsd_form_custom_checkbox_checked = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
                        }
                        function rt(t) {
                            var n;
                            return t && t.state ? (n = t.state, t.total_in = t.total_out = n.total = 0, t.msg = "", n.wrap && (t.adler = 1 & n.wrap), n.mode = g, n.last = 0, n.havedict = 0, n.dmax = 32768, n.head = null, n.hold = 0, n.bits = 0, n.lencode = n.lendyn = new i.Buf32(Y), n.distcode = n.distdyn = new i.Buf32(tt), n.sane = 1, n.back = -1, d) : p
                        }
                        function ot(t) {
                            var n;
                            return t && t.state ? ((n = t.state)
                                .wsize = 0, n.whave = 0, n.wnext = 0, rt(t)) : p
                        }
                        function st(t, n) {
                            var e, i;
                            return t && t.state ? (i = t.state, n < 0 ? (e = 0, n = -n) : (e = 1 + (n >> 4), n < 48 && (n &= 15)), n && (n < 8 || n > 15) ? p : (null !== i.window && i.wbits !== n && (i.window = null), i.wrap = e, i.wbits = n, ot(t))) : p
                        }
                        function at(t, n) {
                            var e, i;
                            return t ? (i = new it, t.state = i, i.window = null, (e = st(t, n)) !== d && (t.state = null), e) : p
                        }
                        function ut(t) {
                            return at(t, nt)
                        }
                        var ct, lt, ft = true;
                        function ht(t) {
                            if (ft) {
                                var n;
                                for (ct = new i.Buf32(512), lt = new i.Buf32(32), n = 0; n < 144;) t.lens[n++] = 8;
                                for (; n < 256;) t.lens[n++] = 9;
                                for (; n < 280;) t.lens[n++] = 7;
                                for (; n < 288;) t.lens[n++] = 8;
                                for (a(c, t.lens, 0, 288, ct, 0, t.work, {
                                        bits: 9
                                    }), n = 0; n < 32;) t.lens[n++] = 5;
                                a(l, t.lens, 0, 32, lt, 0, t.work, {
                                    bits: 5
                                }), ft = false
                            }
                            t.lencode = ct, t.lenbits = 9, t.distcode = lt, t.distbits = 5
                        }
                        function _t(t, n, e, r) {
                            var o, s = t.state;
                            return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new i.Buf8(s.wsize)), r >= s.wsize ? (i.arraySet(s.window, n, e - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : ((o = s.wsize - s.wnext) > r && (o = r), i.arraySet(s.window, n, e - r, o, s.wnext), (r -= o) ? (i.arraySet(s.window, n, e - r, r, 0), s.wnext = r, s.whave = s.wsize) : (s.wnext += o, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += o))), 0
                        }
                        function dt(t, n) {
                            var e, Y, tt, nt, it, rt, ot, st, at, ut, ct, lt, ft, dt, vt, mt, pt, wt, bt, kt, yt, gt, $t, Et, St = 0,
                                xt = new i.Buf8(4),
                                At = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                            if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return p;
                            (e = t.state)
                            .mode === D && (e.mode = T), it = t.next_out, tt = t.output, ot = t.avail_out, nt = t.next_in, Y = t.input, rt = t.avail_in, st = e.hold, at = e.bits, ut = rt, ct = ot, gt = d;
                            t: for (;;) switch (e.mode) {
                                case g:
                                    if (0 === e.wrap) {
                                        e.mode = T;
                                        break
                                    }
                                    for (; at < 16;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    if (2 & e.wrap && 35615 === st) {
                                        e.igsd_form_custom_checkbox_checked = 0, xt[0] = 255 & st, xt[1] = st >>> 8 & 255, e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, xt, 2, 0), st = 0, at = 0, e.mode = $;
                                        break
                                    }
                                    if (e.flags = 0, e.head && (e.head.done = false), !(1 & e.wrap) || (((255 & st) << 8) + (st >> 8)) % 31) {
                                        t.msg = "incorrect header igsd_form_custom_checkbox_checked", e.mode = X;
                                        break
                                    }
                                    if ((15 & st) !== y) {
                                        t.msg = "unknown compression method", e.mode = X;
                                        break
                                    }
                                    if (at -= 4, yt = 8 + (15 & (st >>>= 4)), 0 === e.wbits) e.wbits = yt;
                                    else if (yt > e.wbits) {
                                        t.msg = "invalid window size", e.mode = X;
                                        break
                                    }
                                    e.dmax = 1 << yt, t.adler = e.igsd_form_custom_checkbox_checked = 1, e.mode = 512 & st ? R : D, st = 0, at = 0;
                                    break;
                                case $:
                                    for (; at < 16;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    if (e.flags = st, (255 & e.flags) !== y) {
                                        t.msg = "unknown compression method", e.mode = X;
                                        break
                                    }
                                    if (57344 & e.flags) {
                                        t.msg = "unknown header flags set", e.mode = X;
                                        break
                                    }
                                    e.head && (e.head.text = st >> 8 & 1), 512 & e.flags && (xt[0] = 255 & st, xt[1] = st >>> 8 & 255, e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, xt, 2, 0)), st = 0, at = 0, e.mode = E;
                                case E:
                                    for (; at < 32;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    e.head && (e.head.time = st), 512 & e.flags && (xt[0] = 255 & st, xt[1] = st >>> 8 & 255, xt[2] = st >>> 16 & 255, xt[3] = st >>> 24 & 255, e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, xt, 4, 0)), st = 0, at = 0, e.mode = S;
                                case S:
                                    for (; at < 16;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    e.head && (e.head.xflags = 255 & st, e.head.os = st >> 8), 512 & e.flags && (xt[0] = 255 & st, xt[1] = st >>> 8 & 255, e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, xt, 2, 0)), st = 0, at = 0, e.mode = x;
                                case x:
                                    if (1024 & e.flags) {
                                        for (; at < 16;) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        e.length = st, e.head && (e.head.extra_len = st), 512 & e.flags && (xt[0] = 255 & st, xt[1] = st >>> 8 & 255, e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, xt, 2, 0)), st = 0, at = 0
                                    } else e.head && (e.head.extra = null);
                                    e.mode = A;
                                case A:
                                    if (1024 & e.flags && ((lt = e.length) > rt && (lt = rt), lt && (e.head && (yt = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Array(e.head.extra_len)), i.arraySet(e.head.extra, Y, nt, lt, yt)), 512 & e.flags && (e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, Y, lt, nt)), rt -= lt, nt += lt, e.length -= lt), e.length)) break t;
                                    e.length = 0, e.mode = I;
                                case I:
                                    if (2048 & e.flags) {
                                        if (0 === rt) break t;
                                        lt = 0;
                                        do {
                                            yt = Y[nt + lt++], e.head && yt && e.length < 65536 && (e.head.name += String.fromCharCode(yt))
                                        } while (yt && lt < rt);
                                        if (512 & e.flags && (e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, Y, lt, nt)), rt -= lt, nt += lt, yt) break t
                                    } else e.head && (e.head.name = null);
                                    e.length = 0, e.mode = P;
                                case P:
                                    if (4096 & e.flags) {
                                        if (0 === rt) break t;
                                        lt = 0;
                                        do {
                                            yt = Y[nt + lt++], e.head && yt && e.length < 65536 && (e.head.comment += String.fromCharCode(yt))
                                        } while (yt && lt < rt);
                                        if (512 & e.flags && (e.igsd_form_custom_checkbox_checked = o(e.igsd_form_custom_checkbox_checked, Y, lt, nt)), rt -= lt, nt += lt, yt) break t
                                    } else e.head && (e.head.comment = null);
                                    e.mode = U;
                                case U:
                                    if (512 & e.flags) {
                                        for (; at < 16;) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        if (st !== (65535 & e.igsd_form_custom_checkbox_checked)) {
                                            t.msg = "header crc mismatch", e.mode = X;
                                            break
                                        }
                                        st = 0, at = 0
                                    }
                                    e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = true), t.adler = e.igsd_form_custom_checkbox_checked = 0, e.mode = D;
                                    break;
                                case R:
                                    for (; at < 32;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    t.adler = e.igsd_form_custom_checkbox_checked = et(st), st = 0, at = 0, e.mode = C;
                                case C:
                                    if (0 === e.havedict) return t.next_out = it, t.avail_out = ot, t.next_in = nt, t.avail_in = rt, e.hold = st, e.bits = at, m;
                                    t.adler = e.igsd_form_custom_checkbox_checked = 1, e.mode = D;
                                case D:
                                    if (n === h || n === _) break t;
                                case T:
                                    if (e.last) {
                                        st >>>= 7 & at, at -= 7 & at, e.mode = J;
                                        break
                                    }
                                    for (; at < 3;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    switch (e.last = 1 & st, at -= 1, 3 & (st >>>= 1)) {
                                        case 0:
                                            e.mode = N;
                                            break;
                                        case 1:
                                            if (ht(e), e.mode = q, n === _) {
                                                st >>>= 2, at -= 2;
                                                break t
                                            }
                                            break;
                                        case 2:
                                            e.mode = F;
                                            break;
                                        case 3:
                                            t.msg = "invalid block type", e.mode = X
                                    }
                                    st >>>= 2, at -= 2;
                                    break;
                                case N:
                                    for (st >>>= 7 & at, at -= 7 & at; at < 32;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    if ((65535 & st) != (st >>> 16 ^ 65535)) {
                                        t.msg = "invalid stored block lengths", e.mode = X;
                                        break
                                    }
                                    if (e.length = 65535 & st, st = 0, at = 0, e.mode = B, n === _) break t;
                                case B:
                                    e.mode = j;
                                case j:
                                    if (lt = e.length) {
                                        if (lt > rt && (lt = rt), lt > ot && (lt = ot), 0 === lt) break t;
                                        i.arraySet(tt, Y, nt, lt, it), rt -= lt, nt += lt, ot -= lt, it += lt, e.length -= lt;
                                        break
                                    }
                                    e.mode = D;
                                    break;
                                case F:
                                    for (; at < 14;) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    if (e.nlen = 257 + (31 & st), st >>>= 5, at -= 5, e.ndist = 1 + (31 & st), st >>>= 5, at -= 5, e.ncode = 4 + (15 & st), st >>>= 4, at -= 4, e.nlen > 286 || e.ndist > 30) {
                                        t.msg = "too many length or distance symbols", e.mode = X;
                                        break
                                    }
                                    e.have = 0, e.mode = O;
                                case O:
                                    for (; e.have < e.ncode;) {
                                        for (; at < 3;) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        e.lens[At[e.have++]] = 7 & st, st >>>= 3, at -= 3
                                    }
                                    for (; e.have < 19;) e.lens[At[e.have++]] = 0;
                                    if (e.lencode = e.lendyn, e.lenbits = 7, $t = {
                                            bits: e.lenbits
                                        }, gt = a(u, e.lens, 0, 19, e.lencode, 0, e.work, $t), e.lenbits = $t.bits, gt) {
                                        t.msg = "invalid code lengths set", e.mode = X;
                                        break
                                    }
                                    e.have = 0, e.mode = z;
                                case z:
                                    for (; e.have < e.nlen + e.ndist;) {
                                        for (; mt = (St = e.lencode[st & (1 << e.lenbits) - 1]) >>> 16 & 255, pt = 65535 & St, !((vt = St >>> 24) <= at);) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        if (pt < 16) st >>>= vt, at -= vt, e.lens[e.have++] = pt;
                                        else {
                                            if (16 === pt) {
                                                for (Et = vt + 2; at < Et;) {
                                                    if (0 === rt) break t;
                                                    rt--, st += Y[nt++] << at, at += 8
                                                }
                                                if (st >>>= vt, at -= vt, 0 === e.have) {
                                                    t.msg = "invalid bit length repeat", e.mode = X;
                                                    break
                                                }
                                                yt = e.lens[e.have - 1], lt = 3 + (3 & st), st >>>= 2, at -= 2
                                            } else if (17 === pt) {
                                                for (Et = vt + 3; at < Et;) {
                                                    if (0 === rt) break t;
                                                    rt--, st += Y[nt++] << at, at += 8
                                                }
                                                at -= vt, yt = 0, lt = 3 + (7 & (st >>>= vt)), st >>>= 3, at -= 3
                                            } else {
                                                for (Et = vt + 7; at < Et;) {
                                                    if (0 === rt) break t;
                                                    rt--, st += Y[nt++] << at, at += 8
                                                }
                                                at -= vt, yt = 0, lt = 11 + (127 & (st >>>= vt)), st >>>= 7, at -= 7
                                            }
                                            if (e.have + lt > e.nlen + e.ndist) {
                                                t.msg = "invalid bit length repeat", e.mode = X;
                                                break
                                            }
                                            for (; lt--;) e.lens[e.have++] = yt
                                        }
                                    }
                                    if (e.mode === X) break;
                                    if (0 === e.lens[256]) {
                                        t.msg = "invalid code -- missing end-of-block", e.mode = X;
                                        break
                                    }
                                    if (e.lenbits = 9, $t = {
                                            bits: e.lenbits
                                        }, gt = a(c, e.lens, 0, e.nlen, e.lencode, 0, e.work, $t), e.lenbits = $t.bits, gt) {
                                        t.msg = "invalid literal/lengths set", e.mode = X;
                                        break
                                    }
                                    if (e.distbits = 6, e.distcode = e.distdyn, $t = {
                                            bits: e.distbits
                                        }, gt = a(l, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, $t), e.distbits = $t.bits, gt) {
                                        t.msg = "invalid distances set", e.mode = X;
                                        break
                                    }
                                    if (e.mode = q, n === _) break t;
                                case q:
                                    e.mode = M;
                                case M:
                                    if (rt >= 6 && ot >= 258) {
                                        t.next_out = it, t.avail_out = ot, t.next_in = nt, t.avail_in = rt, e.hold = st, e.bits = at, s(t, ct), it = t.next_out, tt = t.output, ot = t.avail_out, nt = t.next_in, Y = t.input, rt = t.avail_in, st = e.hold, at = e.bits, e.mode === D && (e.back = -1);
                                        break
                                    }
                                    for (e.back = 0; mt = (St = e.lencode[st & (1 << e.lenbits) - 1]) >>> 16 & 255, pt = 65535 & St, !((vt = St >>> 24) <= at);) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    if (mt && 0 == (240 & mt)) {
                                        for (wt = vt, bt = mt, kt = pt; mt = (St = e.lencode[kt + ((st & (1 << wt + bt) - 1) >> wt)]) >>> 16 & 255, pt = 65535 & St, !(wt + (vt = St >>> 24) <= at);) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        st >>>= wt, at -= wt, e.back += wt
                                    }
                                    if (st >>>= vt, at -= vt, e.back += vt, e.length = pt, 0 === mt) {
                                        e.mode = H;
                                        break
                                    }
                                    if (32 & mt) {
                                        e.back = -1, e.mode = D;
                                        break
                                    }
                                    if (64 & mt) {
                                        t.msg = "invalid literal/length code", e.mode = X;
                                        break
                                    }
                                    e.extra = 15 & mt, e.mode = L;
                                case L:
                                    if (e.extra) {
                                        for (Et = e.extra; at < Et;) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        e.length += st & (1 << e.extra) - 1, st >>>= e.extra, at -= e.extra, e.back += e.extra
                                    }
                                    e.was = e.length, e.mode = G;
                                case G:
                                    for (; mt = (St = e.distcode[st & (1 << e.distbits) - 1]) >>> 16 & 255, pt = 65535 & St, !((vt = St >>> 24) <= at);) {
                                        if (0 === rt) break t;
                                        rt--, st += Y[nt++] << at, at += 8
                                    }
                                    if (0 == (240 & mt)) {
                                        for (wt = vt, bt = mt, kt = pt; mt = (St = e.distcode[kt + ((st & (1 << wt + bt) - 1) >> wt)]) >>> 16 & 255, pt = 65535 & St, !(wt + (vt = St >>> 24) <= at);) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        st >>>= wt, at -= wt, e.back += wt
                                    }
                                    if (st >>>= vt, at -= vt, e.back += vt, 64 & mt) {
                                        t.msg = "invalid distance code", e.mode = X;
                                        break
                                    }
                                    e.offset = pt, e.extra = 15 & mt, e.mode = W;
                                case W:
                                    if (e.extra) {
                                        for (Et = e.extra; at < Et;) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        e.offset += st & (1 << e.extra) - 1, st >>>= e.extra, at -= e.extra, e.back += e.extra
                                    }
                                    if (e.offset > e.dmax) {
                                        t.msg = "invalid distance too far back", e.mode = X;
                                        break
                                    }
                                    e.mode = Z;
                                case Z:
                                    if (0 === ot) break t;
                                    if (lt = ct - ot, e.offset > lt) {
                                        if ((lt = e.offset - lt) > e.whave && e.sane) {
                                            t.msg = "invalid distance too far back", e.mode = X;
                                            break
                                        }
                                        lt > e.wnext ? (lt -= e.wnext, ft = e.wsize - lt) : ft = e.wnext - lt, lt > e.length && (lt = e.length), dt = e.window
                                    } else dt = tt, ft = it - e.offset, lt = e.length;
                                    lt > ot && (lt = ot), ot -= lt, e.length -= lt;
                                    do {
                                        tt[it++] = dt[ft++]
                                    } while (--lt);
                                    0 === e.length && (e.mode = M);
                                    break;
                                case H:
                                    if (0 === ot) break t;
                                    tt[it++] = e.length, ot--, e.mode = M;
                                    break;
                                case J:
                                    if (e.wrap) {
                                        for (; at < 32;) {
                                            if (0 === rt) break t;
                                            rt--, st |= Y[nt++] << at, at += 8
                                        }
                                        if (ct -= ot, t.total_out += ct, e.total += ct, ct && (t.adler = e.igsd_form_custom_checkbox_checked = e.flags ? o(e.igsd_form_custom_checkbox_checked, tt, ct, it - ct) : r(e.igsd_form_custom_checkbox_checked, tt, ct, it - ct)), ct = ot, (e.flags ? st : et(st)) !== e.igsd_form_custom_checkbox_checked) {
                                            t.msg = "incorrect data igsd_form_custom_checkbox_checked", e.mode = X;
                                            break
                                        }
                                        st = 0, at = 0
                                    }
                                    e.mode = V;
                                case V:
                                    if (e.wrap && e.flags) {
                                        for (; at < 32;) {
                                            if (0 === rt) break t;
                                            rt--, st += Y[nt++] << at, at += 8
                                        }
                                        if (st !== (4294967295 & e.total)) {
                                            t.msg = "incorrect length igsd_form_custom_checkbox_checked", e.mode = X;
                                            break
                                        }
                                        st = 0, at = 0
                                    }
                                    e.mode = Q;
                                case Q:
                                    gt = v;
                                    break t;
                                case X:
                                    gt = w;
                                    break t;
                                case K:
                                    return b;
                                default:
                                    return p
                            }
                            return t.next_out = it, t.avail_out = ot, t.next_in = nt, t.avail_in = rt, e.hold = st, e.bits = at, (e.wsize || ct !== t.avail_out && e.mode < X && (e.mode < J || n !== f)) && _t(t, t.output, t.next_out, ct - t.avail_out) ? (e.mode = K, b) : (ut -= t.avail_in, ct -= t.avail_out, t.total_in += ut, t.total_out += ct, e.total += ct, e.wrap && ct && (t.adler = e.igsd_form_custom_checkbox_checked = e.flags ? o(e.igsd_form_custom_checkbox_checked, tt, ct, t.next_out - ct) : r(e.igsd_form_custom_checkbox_checked, tt, ct, t.next_out - ct)), t.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === D ? 128 : 0) + (e.mode === q || e.mode === B ? 256 : 0), (0 === ut && 0 === ct || n === f) && gt === d && (gt = k), gt)
                        }
                        function vt(t) {
                            if (!t || !t.state) return p;
                            var n = t.state;
                            return n.window && (n.window = null), t.state = null, d
                        }
                        function mt(t, n) {
                            var e;
                            return t && t.state ? 0 == (2 & (e = t.state)
                                .wrap) ? p : (e.head = n, n.done = false, d) : p
                        }
                        function pt(t, n) {
                            var e, i = n.length;
                            return t && t.state ? 0 !== (e = t.state)
                                .wrap && e.mode !== C ? p : e.mode === C && r(1, n, i, 0) !== e.igsd_form_custom_checkbox_checked ? w : _t(t, n, i, i) ? (e.mode = K, b) : (e.havedict = 1, d) : p
                        }
                        e.inflateReset = ot, e.inflateReset2 = st, e.inflateResetKeep = rt, e.inflateInit = ut, e.inflateInit2 = at, e.inflate = dt, e.inflateEnd = vt, e.inflateGetHeader = mt, e.inflateSetDictionary = pt, e.inflateInfo = "pako inflate (from Nodeca project)"
                    }, {
                        "../utils/common": 62,
                        "./adler32": 64,
                        "./crc32": 66,
                        "./inffast": 69,
                        "./inftrees": 71
                    }],
                    71: [function(t, n, e) {
                        var i = t("../utils/common"),
                            r = 15,
                            o = 852,
                            s = 592,
                            a = 0,
                            u = 1,
                            c = 2,
                            l = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                            f = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                            h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                            _ = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
                        n.exports = function(t, n, e, d, v, m, p, w) {
                            var b, k, y, g, $, E, S, x, A, I = w.bits,
                                P = 0,
                                U = 0,
                                R = 0,
                                C = 0,
                                D = 0,
                                T = 0,
                                N = 0,
                                B = 0,
                                j = 0,
                                F = 0,
                                O = null,
                                z = 0,
                                q = new i.Buf16(r + 1),
                                M = new i.Buf16(r + 1),
                                L = null,
                                G = 0;
                            for (P = 0; P <= r; P++) q[P] = 0;
                            for (U = 0; U < d; U++) q[n[e + U]]++;
                            for (D = I, C = r; C >= 1 && 0 === q[C]; C--);
                            if (D > C && (D = C), 0 === C) return v[m++] = 20971520, v[m++] = 20971520, w.bits = 1, 0;
                            for (R = 1; R < C && 0 === q[R]; R++);
                            for (D < R && (D = R), B = 1, P = 1; P <= r; P++)
                                if (B <<= 1, (B -= q[P]) < 0) return -1;
                            if (B > 0 && (t === a || 1 !== C)) return -1;
                            for (M[1] = 0, P = 1; P < r; P++) M[P + 1] = M[P] + q[P];
                            for (U = 0; U < d; U++) 0 !== n[e + U] && (p[M[n[e + U]]++] = U);
                            if (t === a ? (O = L = p, E = 19) : t === u ? (O = l, z -= 257, L = f, G -= 257, E = 256) : (O = h, L = _, E = -1), F = 0, U = 0, P = R, $ = m, T = D, N = 0, y = -1, g = (j = 1 << D) - 1, t === u && j > o || t === c && j > s) return 1;
                            for (;;) {
                                S = P - N, p[U] < E ? (x = 0, A = p[U]) : p[U] > E ? (x = L[G + p[U]], A = O[z + p[U]]) : (x = 96, A = 0), b = 1 << P - N, R = k = 1 << T;
                                do {
                                    v[$ + (F >> N) + (k -= b)] = S << 24 | x << 16 | A | 0
                                } while (0 !== k);
                                for (b = 1 << P - 1; F & b;) b >>= 1;
                                if (0 !== b ? (F &= b - 1, F += b) : F = 0, U++, 0 == --q[P]) {
                                    if (P === C) break;
                                    P = n[e + p[U]]
                                }
                                if (P > D && (F & g) !== y) {
                                    for (0 === N && (N = D), $ += R, B = 1 << (T = P - N); T + N < C && !((B -= q[T + N]) <= 0);) T++, B <<= 1;
                                    if (j += 1 << T, t === u && j > o || t === c && j > s) return 1;
                                    v[y = F & g] = D << 24 | T << 16 | $ - m | 0
                                }
                            }
                            return 0 !== F && (v[$ + F] = P - N << 24 | 64 << 16 | 0), w.bits = D, 0
                        }
                    }, {
                        "../utils/common": 62
                    }],
                    72: [function(t, n, e) {
                        n.exports = {
                            2: "need dictionary",
                            1: "stream end",
                            0: "",
                            "-1": "file error",
                            "-2": "stream error",
                            "-3": "data error",
                            "-4": "insufficient memory",
                            "-5": "buffer error",
                            "-6": "incompatible version"
                        }
                    }, {}],
                    73: [function(t, n, e) {
                        var i = t("../utils/common"),
                            r = 4,
                            o = 0,
                            s = 1,
                            a = 2;
                        function u(t) {
                            for (var n = t.length; --n >= 0;) t[n] = 0
                        }
                        var c = 0,
                            l = 1,
                            f = 2,
                            h = 3,
                            _ = 258,
                            d = 29,
                            v = 256,
                            m = v + 1 + d,
                            p = 30,
                            w = 19,
                            b = 2 * m + 1,
                            k = 15,
                            y = 16,
                            g = 7,
                            $ = 256,
                            E = 16,
                            S = 17,
                            x = 18,
                            A = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
                            I = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
                            P = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                            U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
                            R = 512,
                            C = new Array(2 * (m + 2));
                        u(C);
                        var D = new Array(2 * p);
                        u(D);
                        var T = new Array(R);
                        u(T);
                        var N = new Array(_ - h + 1);
                        u(N);
                        var B = new Array(d);
                        u(B);
                        var j, F, O, z = new Array(p);
                        function q(t, n, e, i, r) {
                            this.static_tree = t, this.extra_bits = n, this.extra_base = e, this.elems = i, this.max_length = r, this.has_stree = t && t.length
                        }
                        function M(t, n) {
                            this.dyn_tree = t, this.max_code = 0, this.stat_desc = n
                        }
                        function L(t) {
                            return t < 256 ? T[t] : T[256 + (t >>> 7)]
                        }
                        function G(t, n) {
                            t.pending_buf[t.pending++] = 255 & n, t.pending_buf[t.pending++] = n >>> 8 & 255
                        }
                        function W(t, n, e) {
                            t.bi_valid > y - e ? (t.bi_buf |= n << t.bi_valid & 65535, G(t, t.bi_buf), t.bi_buf = n >> y - t.bi_valid, t.bi_valid += e - y) : (t.bi_buf |= n << t.bi_valid & 65535, t.bi_valid += e)
                        }
                        function Z(t, n, e) {
                            W(t, e[2 * n], e[2 * n + 1])
                        }
                        function H(t, n) {
                            var e = 0;
                            do {
                                e |= 1 & t, t >>>= 1, e <<= 1
                            } while (--n > 0);
                            return e >>> 1
                        }
                        function J(t) {
                            16 === t.bi_valid ? (G(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8)
                        }
                        function V(t, n) {
                            var e, i, r, o, s, a, u = n.dyn_tree,
                                c = n.max_code,
                                l = n.stat_desc.static_tree,
                                f = n.stat_desc.has_stree,
                                h = n.stat_desc.extra_bits,
                                _ = n.stat_desc.extra_base,
                                d = n.stat_desc.max_length,
                                v = 0;
                            for (o = 0; o <= k; o++) t.bl_count[o] = 0;
                            for (u[2 * t.heap[t.heap_max] + 1] = 0, e = t.heap_max + 1; e < b; e++)(o = u[2 * u[2 * (i = t.heap[e]) + 1] + 1] + 1) > d && (o = d, v++), u[2 * i + 1] = o, i > c || (t.bl_count[o]++, s = 0, i >= _ && (s = h[i - _]), a = u[2 * i], t.opt_len += a * (o + s), f && (t.static_len += a * (l[2 * i + 1] + s)));
                            if (0 !== v) {
                                do {
                                    for (o = d - 1; 0 === t.bl_count[o];) o--;
                                    t.bl_count[o]--, t.bl_count[o + 1] += 2, t.bl_count[d]--, v -= 2
                                } while (v > 0);
                                for (o = d; 0 !== o; o--)
                                    for (i = t.bl_count[o]; 0 !== i;)(r = t.heap[--e]) > c || (u[2 * r + 1] !== o && (t.opt_len += (o - u[2 * r + 1]) * u[2 * r], u[2 * r + 1] = o), i--)
                            }
                        }
                        function Q(t, n, e) {
                            var i, r, o = new Array(k + 1),
                                s = 0;
                            for (i = 1; i <= k; i++) o[i] = s = s + e[i - 1] << 1;
                            for (r = 0; r <= n; r++) {
                                var a = t[2 * r + 1];
                                0 !== a && (t[2 * r] = H(o[a]++, a))
                            }
                        }
                        function X() {
                            var t, n, e, i, r, o = new Array(k + 1);
                            for (e = 0, i = 0; i < d - 1; i++)
                                for (B[i] = e, t = 0; t < 1 << A[i]; t++) N[e++] = i;
                            for (N[e - 1] = i, r = 0, i = 0; i < 16; i++)
                                for (z[i] = r, t = 0; t < 1 << I[i]; t++) T[r++] = i;
                            for (r >>= 7; i < p; i++)
                                for (z[i] = r << 7, t = 0; t < 1 << I[i] - 7; t++) T[256 + r++] = i;
                            for (n = 0; n <= k; n++) o[n] = 0;
                            for (t = 0; t <= 143;) C[2 * t + 1] = 8, t++, o[8]++;
                            for (; t <= 255;) C[2 * t + 1] = 9, t++, o[9]++;
                            for (; t <= 279;) C[2 * t + 1] = 7, t++, o[7]++;
                            for (; t <= 287;) C[2 * t + 1] = 8, t++, o[8]++;
                            for (Q(C, m + 1, o), t = 0; t < p; t++) D[2 * t + 1] = 5, D[2 * t] = H(t, 5);
                            j = new q(C, A, v + 1, m, k), F = new q(D, I, 0, p, k), O = new q(new Array(0), P, 0, w, g)
                        }
                        function K(t) {
                            var n;
                            for (n = 0; n < m; n++) t.dyn_ltree[2 * n] = 0;
                            for (n = 0; n < p; n++) t.dyn_dtree[2 * n] = 0;
                            for (n = 0; n < w; n++) t.bl_tree[2 * n] = 0;
                            t.dyn_ltree[2 * $] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0
                        }
                        function Y(t) {
                            t.bi_valid > 8 ? G(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0
                        }
                        function tt(t, n, e, r) {
                            Y(t), r && (G(t, e), G(t, ~e)), i.arraySet(t.pending_buf, t.window, n, e, t.pending), t.pending += e
                        }
                        function nt(t, n, e, i) {
                            var r = 2 * n,
                                o = 2 * e;
                            return t[r] < t[o] || t[r] === t[o] && i[n] <= i[e]
                        }
                        function et(t, n, e) {
                            for (var i = t.heap[e], r = e << 1; r <= t.heap_len && (r < t.heap_len && nt(n, t.heap[r + 1], t.heap[r], t.depth) && r++, !nt(n, i, t.heap[r], t.depth));) t.heap[e] = t.heap[r], e = r, r <<= 1;
                            t.heap[e] = i
                        }
                        function it(t, n, e) {
                            var i, r, o, s, a = 0;
                            if (0 !== t.last_lit)
                                do {
                                    i = t.pending_buf[t.d_buf + 2 * a] << 8 | t.pending_buf[t.d_buf + 2 * a + 1], r = t.pending_buf[t.l_buf + a], a++, 0 === i ? Z(t, r, n) : (Z(t, (o = N[r]) + v + 1, n), 0 !== (s = A[o]) && W(t, r -= B[o], s), Z(t, o = L(--i), e), 0 !== (s = I[o]) && W(t, i -= z[o], s))
                                } while (a < t.last_lit);
                            Z(t, $, n)
                        }
                        function rt(t, n) {
                            var e, i, r, o = n.dyn_tree,
                                s = n.stat_desc.static_tree,
                                a = n.stat_desc.has_stree,
                                u = n.stat_desc.elems,
                                c = -1;
                            for (t.heap_len = 0, t.heap_max = b, e = 0; e < u; e++) 0 !== o[2 * e] ? (t.heap[++t.heap_len] = c = e, t.depth[e] = 0) : o[2 * e + 1] = 0;
                            for (; t.heap_len < 2;) o[2 * (r = t.heap[++t.heap_len] = c < 2 ? ++c : 0)] = 1, t.depth[r] = 0, t.opt_len--, a && (t.static_len -= s[2 * r + 1]);
                            for (n.max_code = c, e = t.heap_len >> 1; e >= 1; e--) et(t, o, e);
                            r = u;
                            do {
                                e = t.heap[1], t.heap[1] = t.heap[t.heap_len--], et(t, o, 1), i = t.heap[1], t.heap[--t.heap_max] = e, t.heap[--t.heap_max] = i, o[2 * r] = o[2 * e] + o[2 * i], t.depth[r] = (t.depth[e] >= t.depth[i] ? t.depth[e] : t.depth[i]) + 1, o[2 * e + 1] = o[2 * i + 1] = r, t.heap[1] = r++, et(t, o, 1)
                            } while (t.heap_len >= 2);
                            t.heap[--t.heap_max] = t.heap[1], V(t, n), Q(o, c, t.bl_count)
                        }
                        function ot(t, n, e) {
                            var i, r, o = -1,
                                s = n[1],
                                a = 0,
                                u = 7,
                                c = 4;
                            for (0 === s && (u = 138, c = 3), n[2 * (e + 1) + 1] = 65535, i = 0; i <= e; i++) r = s, s = n[2 * (i + 1) + 1], ++a < u && r === s || (a < c ? t.bl_tree[2 * r] += a : 0 !== r ? (r !== o && t.bl_tree[2 * r]++, t.bl_tree[2 * E]++) : a <= 10 ? t.bl_tree[2 * S]++ : t.bl_tree[2 * x]++, a = 0, o = r, 0 === s ? (u = 138, c = 3) : r === s ? (u = 6, c = 3) : (u = 7, c = 4))
                        }
                        function st(t, n, e) {
                            var i, r, o = -1,
                                s = n[1],
                                a = 0,
                                u = 7,
                                c = 4;
                            for (0 === s && (u = 138, c = 3), i = 0; i <= e; i++)
                                if (r = s, s = n[2 * (i + 1) + 1], !(++a < u && r === s)) {
                                    if (a < c)
                                        do {
                                            Z(t, r, t.bl_tree)
                                        } while (0 != --a);
                                    else 0 !== r ? (r !== o && (Z(t, r, t.bl_tree), a--), Z(t, E, t.bl_tree), W(t, a - 3, 2)) : a <= 10 ? (Z(t, S, t.bl_tree), W(t, a - 3, 3)) : (Z(t, x, t.bl_tree), W(t, a - 11, 7));
                                    a = 0, o = r, 0 === s ? (u = 138, c = 3) : r === s ? (u = 6, c = 3) : (u = 7, c = 4)
                                }
                        }
                        function at(t) {
                            var n;
                            for (ot(t, t.dyn_ltree, t.l_desc.max_code), ot(t, t.dyn_dtree, t.d_desc.max_code), rt(t, t.bl_desc), n = w - 1; n >= 3 && 0 === t.bl_tree[2 * U[n] + 1]; n--);
                            return t.opt_len += 3 * (n + 1) + 5 + 5 + 4, n
                        }
                        function ut(t, n, e, i) {
                            var r;
                            for (W(t, n - 257, 5), W(t, e - 1, 5), W(t, i - 4, 4), r = 0; r < i; r++) W(t, t.bl_tree[2 * U[r] + 1], 3);
                            st(t, t.dyn_ltree, n - 1), st(t, t.dyn_dtree, e - 1)
                        }
                        function ct(t) {
                            var n, e = 4093624447;
                            for (n = 0; n <= 31; n++, e >>>= 1)
                                if (1 & e && 0 !== t.dyn_ltree[2 * n]) return o;
                            if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return s;
                            for (n = 32; n < v; n++)
                                if (0 !== t.dyn_ltree[2 * n]) return s;
                            return o
                        }
                        u(z);
                        var lt = false;
                        function ft(t) {
                            lt || (X(), lt = true), t.l_desc = new M(t.dyn_ltree, j), t.d_desc = new M(t.dyn_dtree, F), t.bl_desc = new M(t.bl_tree, O), t.bi_buf = 0, t.bi_valid = 0, K(t)
                        }
                        function ht(t, n, e, i) {
                            W(t, (c << 1) + (i ? 1 : 0), 3), tt(t, n, e, true)
                        }
                        function _t(t) {
                            W(t, l << 1, 3), Z(t, $, C), J(t)
                        }
                        function dt(t, n, e, i) {
                            var o, s, u = 0;
                            t.level > 0 ? (t.strm.data_type === a && (t.strm.data_type = ct(t)), rt(t, t.l_desc), rt(t, t.d_desc), u = at(t), o = t.opt_len + 3 + 7 >>> 3, (s = t.static_len + 3 + 7 >>> 3) <= o && (o = s)) : o = s = e + 5, e + 4 <= o && -1 !== n ? ht(t, n, e, i) : t.strategy === r || s === o ? (W(t, (l << 1) + (i ? 1 : 0), 3), it(t, C, D)) : (W(t, (f << 1) + (i ? 1 : 0), 3), ut(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, u + 1), it(t, t.dyn_ltree, t.dyn_dtree)), K(t), i && Y(t)
                        }
                        function vt(t, n, e) {
                            return t.pending_buf[t.d_buf + 2 * t.last_lit] = n >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & n, t.pending_buf[t.l_buf + t.last_lit] = 255 & e, t.last_lit++, 0 === n ? t.dyn_ltree[2 * e]++ : (t.matches++, n--, t.dyn_ltree[2 * (N[e] + v + 1)]++, t.dyn_dtree[2 * L(n)]++), t.last_lit === t.lit_bufsize - 1
                        }
                        e._tr_init = ft, e._tr_stored_block = ht, e._tr_flush_block = dt, e._tr_tally = vt, e._tr_align = _t
                    }, {
                        "../utils/common": 62
                    }],
                    74: [function(t, n, e) {
                        function i() {
                            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
                        }
                        n.exports = i
                    }, {}]
                }, {}, [10])(10)
            }
        },
        n = {};
    function e(i) {
        var r = n[i];
        if (undefined !== r) return r.exports;
        var o = n[i] = {
            exports: {}
        };
        return t[i].call(o.exports, o, o.exports, e), o.exports
    }
    e.n = t => {
        var n = t && t.__esModule ? () => t.default : () => t;
        return e.d(n, {
            a: n
        }), n
    }, e.d = (t, n) => {
        for (var i in n) e.o(n, i) && !e.o(t, i) && Object.defineProperty(t, i, {
            enumerable: true,
            get: n[i]
        })
    }, e.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window) return window
        }
    }(), e.o = (t, n) => Object.prototype.hasOwnProperty.call(t, n), (() => {
        var t = e(150),
            n = e.n(t);
        const i = {
                N: [],
                j: function(t) {
                    let n = t.match(/variables=([^&]+)/);
                    return n && n[1] || null
                },
                O: function(t) {
                    let n = t.match(/query_hash=([^&]+)/);
                    return n && n[1] || null
                },
                q: function() {
                    undefined === NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach), undefined === HTMLCollection.prototype.forEach && (HTMLCollection.prototype.forEach = Array.prototype.forEach)
                },
                M: function(t) {
                    let n = new Date,
                        e = new Date(n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate())
                        .getTime();
                    return Math.floor((e - 864e5 * t) / 1e3)
                },
                L: function(t) {
                    let n = [];
                    return t.forEach((function(t) {
                        n = n.concat(t)
                    })), n
                },
                Z() {
                    const t = Math.floor(5 * Math.random()) + 6;
                    let n = "";
                    for (let e = 0; e < t; e++) {
                        n += Math.floor(10 * Math.random())
                            .toString()
                    }
                    return n
                },
                H: function(t, n) {
                    let e = new XMLHttpRequest;
                    e.open("GET", t, true), e.responseType = "blob", e.onreadystatechange = function() {
                        4 === this.readyState && (200 === this.status ? n(this.response) : n())
                    }, e.send()
                },
                J: function() {
                    let t = location.pathname.match(/(?<=\/p\/|\/reel\/|\/reels\/videos\/|\/reels\/).*?(?=\/|$)/);
                    return t && t[0]
                },
                V: function(t) {
                    if (!t || !t.tagName) return null;
                    let n;
                    if ("a" === t.tagName.toLowerCase()) n = t.getAttribute("href");
                    else {
                        let e = t.querySelector('a[href*="/p/"], a[href*="/tv/"], a[href*="/reel/"]');
                        e && e.hasAttribute("href") && (n = e.getAttribute("href"))
                    }
                    if (n) {
                        let t = n.match(/\/(tv|p|reel)\/([^/]+)/);
                        return t && t[2]
                    }
                    return i.X() || i.K() ? i.J() : undefined
                },
                Y: function() {
                    return "/" === location.pathname && "instagram.com" === location.host.replace(/^w{3}\./, "") && null == document.querySelector('input[name="username"]')
                },
                tt() {
                    let t = location.pathname.match("^/reels/audio/[0-9]+/?$");
                    return t && t[0]
                },
                X() {
                    let t = location.pathname.match("^/reel/[^/]+/?$");
                    return t && t[0]
                },
                nt: function() {
                    return /\/*.+\/saved\/all-posts\/$|\/saved\/*.+\/[0-9]+\/$/.test(location.pathname)
                },
                et: function() {
                    return !document.querySelector('[role="dialog"]') && (null !== document.querySelector('a[href*="/tagged/"]') || null !== document.querySelector('a[href*="/followers/"]') || null !== document.querySelector('a[href*="/following/"]'))
                },
                it: function() {
                    let t = location.pathname.match("^/reels/.*/$");
                    return t && t[0]
                },
                rt: function() {
                    return this.et() && location.href.includes("/tagged/")
                },
                ot: function() {
                    return this.et() && location.href.includes("/guides/")
                },
                st: function() {
                    return null !== document.querySelector('a[href^="/accounts/edit"]')
                },
                ut: function() {
                    return this.st() && location.href.includes("/saved/")
                },
                ct: function() {
                    return /instagram\.com\/stories\/[^/]+\//.test(location.href)
                },
                lt: function() {
                    return "/explore/" === location.pathname
                },
                ft: function() {
                    return /instagram\.com\/explore\/locations\/[^/]+\//.test(location.href)
                },
                ht: function() {
                    return /instagram\.com\/explore\/tags\/[^/]+\//.test(location.href)
                },
                K: function() {
                    return /instagram.com\/(p|tv|reel)\/[^/]+\//.test(location.href)
                },
                _t: function() {
                    return top !== self
                },
                dt: function() {
                    return location.pathname.includes("stories/highlights")
                },
                vt: function(t, n) {
                    if (!t) return null;
                    let e = t.match(/\/([^\/?]+)(?:$|\?)/);
                    return e = e && e[1], e ? (n && (e = n + "_" + e), e) : null
                },
                wt: function(t) {
                    return !("string" != typeof t || -1 != t.indexOf("blob:") || !t.match(/\.(png|jpg|mp4|flv)/))
                },
                bt: function(t) {
                    i.kt("getQueryHashes", t)
                },
                yt: function(t, n, e) {
                    if (!t || !t.url) return e();
                    var i = {
                        url: t.url
                    };
                    t.filename && (i.filename = t.filename), chrome.downloads.download(i, (function(n) {
                        n ? e(n) : chrome.downloads.download({
                            url: t.url
                        }, (function(t) {
                            e(t)
                        }))
                    }))
                },
                gt: function(t, n) {
                    this.kt({
                        action: "downloadFile",
                        options: {
                            url: t.url,
                            filename: t.filename,
                            isStory: undefined !== t.isStory
                        }
                    }, (function(t) {
                        "function" == typeof n && n(t)
                    }))
                },
                $t: function(t, n, e) {
                    t.sort((function(t, i) {
                        var r = parseInt(t[n]),
                            o = parseInt(i[n]);
                        return e ? r < o ? 1 : r > o ? -1 : 0 : r > o ? 1 : r < o ? -1 : 0
                    }))
                },
                Et: function(t) {
                    var n, e, i;
                    for (i = t.length - 1; i > 0; i--) n = Math.floor(Math.random() * (i + 1)), e = t[i], t[i] = t[n], t[n] = e;
                    return t
                },
                St: function() {
                    if (location.href.indexOf("instagram.com/p/") > -1) return null;
                    var t = location.href.match(/instagram\.com\/([^\/]+)/);
                    return t && t[1].trim() || null
                },
                kt: function(t, n) {
                    undefined === n ? chrome.runtime.sendMessage(t) : chrome.runtime.sendMessage(t, n)
                },
                xt: function(t) {
                    var n = 0;
                    return t.querySelectorAll("ul li")
                        .forEach((function(t) {
                            t.querySelector("video") ? n++ : t.querySelectorAll("img")
                                .forEach((function(t) {
                                    t.width > 200 && t.height > 200 && n++
                                }))
                        })), n > 1
                },
                At: function(t) {
                    if (!t) return 0;
                    for (var n = t.querySelectorAll("div div div div"), e = 0, i = []; n[e];) {
                        var r = n[e];
                        if (e++, r.offsetHeight < 10 && r.offsetHeight === r.offsetWidth && r.parentElement.offsetWidth > 20 * r.parentElement.offsetHeight) {
                            var o = r.parentElement.children,
                                s = true;
                            if (o.forEach((function(t) {
                                    t.offsetHeight < 10 && t.offsetHeight === t.offsetWidth || (s = false)
                                })), o.length > 1 && s) {
                                i = o;
                                break
                            }
                        }
                    }
                    var a = 0,
                        u = 0;
                    return i.forEach((function(t, n) {
                        t.classList.length > u && (u = t.classList.length, a = n)
                    })), a
                },
                It: function(t) {
                    var n = Math.floor(parseInt(t) / 60)
                        .toString(),
                        e = Math.floor(parseInt(t) % 60)
                        .toString();
                    return 1 === n.length && (n = "0" + n), 1 === e.length && (e = "0" + e), n + ":" + e
                },
                Pt: function() {
                    let t = document.querySelector("section main header section h2,section main header section h1,section main header section h3");
                    if (t) {
                        let n = t.closest("section");
                        return n && (n.style.overflow = "visible"), n && n.querySelector("div>div") || n || null
                    }
                },
                Ut: function(t) {
                    return t.querySelector("video")
                },
                Rt: function(t) {
                    var n = t.getAttribute("src");
                    if (n) return n;
                    var e = t.querySelector("source");
                    return e && (n = e.getAttribute("src")) ? n : null
                },
                Ct: function(t) {
                    if (t.querySelector('svg path[d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"]')) return true;
                    {
                        let n = t.querySelector("video,img"),
                            e = getComputedStyle(n);
                        return this.Dt(parseInt(e.width) / parseInt(e.height))
                    }
                },
                Dt: t => t >= .5 && t <= .6 || t === 9 / 16,
                Tt: function(t) {
                    if (!t) return null;
                    var n = t.getAttribute("srcset");
                    if (n) {
                        var e = {};
                        n.split(",")
                            .forEach((function(t) {
                                var n = t.split(" "),
                                    i = n[1].replace(/[^\d]/, "");
                                e[i] || (e[i] = n[0])
                            }));
                        var i = 0;
                        for (var r in e) + r > +i && (i = r);
                        var o = e[i]
                    }
                    return "string" == typeof o && o.match(new RegExp("\\.(jpg|png)")) || (o = t.getAttribute("src")), o
                },
                Nt: function(t) {
                    let n = null,
                        e = t.querySelectorAll("img[src], img[srcset]");
                    if (1 === e.length) n = e[0];
                    else if (e.length > 1)
                        for (let t = 0; e[t]; t++) e[t].width < 200 || e[t].height < 200 || (e[t].getAttribute("src") || e[t].getAttribute("srcset")) && (n = n || e[t], e[t].width > n.width && e[t].height > n.height && (n = e[t]));
                    return n || null
                },
                Bt: function(t, n) {
                    chrome.runtime.sendMessage({
                        action: "requestUserId",
                        userName: t
                    }, (function(t) {
                        if (!t || t && t.err) return n(null);
                        n(t.userId)
                    }))
                },
                jt: function(t, n) {
                    chrome.runtime.sendMessage({
                        action: "requestUserPostCount",
                        userName: t
                    }, (function(t) {
                        if (!t || t && t.err) return n(null);
                        n(t.postCount)
                    }))
                },
                Ft: function(t, n) {
                    let e = t.width || t.config_width || null,
                        i = n.width || n.config_width || null,
                        r = t.height || t.config_height || null,
                        o = n.height || n.config_height || null;
                    return e && i && e !== r && i !== o ? e !== i ? i > e ? 1 : -1 : o > r ? 1 : -1 : 0
                },
                Ot: function(t, n) {
                    n && !Array.isArray(n) && (n = [n]);
                    for (var e, i = [], r = {
                            "{": 0,
                            "[": 0
                        }, o = {
                            "}": "{",
                            "]": "["
                        }, s = /[{}\]\[":0-9.,-]/, a = /[\r\n\s\t]/, u = "", c = 0; e = t[c]; c++)
                        if ('"' !== e) s.test(e) ? (u += e, "{" === e || "[" === e ? (r["{"] || r["["] || (u = e), r[e]++) : "}" !== e && "]" !== e || (r[o[e]]--, r["{"] || r["["] || i.push(u))) : "t" === e && "true" === t.substr(c, 4) ? (u += "true", c += 3) : "f" === e && "false" === t.substr(c, 5) ? (u += "false", c += 4) : "n" === e && "null" === t.substr(c, 4) ? (u += "null", c += 3) : a.test(e) || (r["{"] = 0, r["["] = 0, u = "");
                        else {
                            for (var l = c; - 1 !== l && (l === c || "\\" === t[l - 1]);) l = t.indexOf('"', l + 1); - 1 === l && (l = t.length - 1), u += t.substr(c, l - c + 1), c = l
                        } var f, h = [];
                    for (c = 0; f = i[c]; c++)
                        if ("{}" !== f && "[]" !== f) try {
                            n ? n.every((function(t) {
                                return t.test(f)
                            })) && h.push(JSON.parse(f)) : h.push(JSON.parse(f))
                        } catch (t) {}
                    return h
                },
                zt: function() {
                    return Array.from(document.querySelectorAll("section"))
                        .find((t => !t.closest("[hidden]")))
                },
                qt: function() {
                    const t = this.zt();
                    return Array.from(t.querySelectorAll("div"))
                        .find((t => {
                            let n = t.clientHeight || t.offsetHeight;
                            if (n > 0 && n < 6) return t.parentElement
                        }))
                },
                Mt: function() {
                    const t = this.qt();
                    if (!t) return 0;
                    let n = t.querySelectorAll("div[style]");
                    return n && n.length ? (n = n[n.length - 1].parentElement || null, null == n ? 0 : t.children && Array.from(t.children)
                        .indexOf(n) || 0) : 0
                },
                Lt(t) {
                    t.length > 28 && (t = t.substr(0, t.length - 28));
                    const n = "abcdefghijklmnopqrstuvwxyz",
                        e = n.toUpperCase() + n + "0123456789-_";
                    let i = BigInt(0);
                    for (let n of t) {
                        let t = e.indexOf(n);
                        i *= BigInt(64), i += BigInt(t)
                    }
                    return i.toString()
                }
            },
            r = i;
        var o = e(178),
            s = e.n(o);
        const a = {
                Gt: {
                    "x-instagram-ajax": "017fef72480c",
                    "x-asbd-id": "437806",
                    "x-requested-with": "XMLHttpRequest",
                    "x-ig-app-id": "936619743392459",
                    "x-ig-app-id_upload": "1217981644879628"
                },
                Wt: function(t) {
                    this.Zt()
                        .then((function(n) {
                            chrome.storage.local.set({
                                headers: {
                                    ...n,
                                    ...t
                                }
                            })
                        }))
                        .catch((function() {
                            chrome.storage.local.set({
                                headers: t
                            })
                        }))
                },
                Zt: function() {
                    return chrome.storage.local.get("headers")
                        .then((function(t) {
                            if (t.headers) return t.headers;
                            throw "No headers"
                        }))
                },
                Ht: function(t) {
                    return this.Zt()
                        .then((function(n) {
                            let e = [];
                            for (let i = 0; t[i]; i++) {
                                if (!n.hasOwnProperty(t[i])) throw `Not found requested header [${t[i]}]`;
                                e[t[i]] = n[t[i]]
                            }
                            return e
                        }))
                },
                Jt(t) {
                    let n = t.requestBody || null;
                    if (!n) return;
                    let e = n.formData && n.formData.fb_dtsg || null;
                    e = e && e.length && e[0] || null, e && chrome.storage.local.set({
                        fb_dtsg: e
                    })
                },
                Vt: function(t) {
                    const n = [s()
                            .t, s()
                            ._, s()
                            .u, s()
                            .v, s()
                            .i
                        ],
                        e = {};
                    for (let i = 0; t.requestHeaders[i]; i++) {
                        let r = t.requestHeaders[i];
                        n.includes(r.name.toLowerCase()) && r.value.length && (e[r.name.toLowerCase()] = r.value), this.Wt(e)
                    }
                },
                Qt: function(t) {
                    const n = s()
                        .i,
                        e = {};
                    for (let i = 0; t.requestHeaders[i]; i++) {
                        let r = t.requestHeaders[i];
                        if (n === r.name.toLowerCase() && r.value.length) {
                            e[n] = r.value;
                            break
                        }
                        this.Wt(e)
                    }
                },
                Xt: function() {
                    const t = this;
                    t.Zt()
                        .catch((function() {
                            t.Wt(t.Gt)
                        })), chrome.webRequest.onBeforeSendHeaders.addListener(t.Vt.bind(t), {
                            urls: ["*://*.instagram.com/*"],
                            types: ["xmlhttprequest"]
                        }, ["requestHeaders"]), chrome.webRequest.onBeforeRequest.addListener(t.Jt.bind(t), {
                            urls: ["*://*.instagram.com/*"],
                            types: ["xmlhttprequest"]
                        }, ["requestBody"]), chrome.webRequest.onBeforeSendHeaders.addListener(t.Qt.bind(t), {
                            urls: ["*://*.instagram.com/rupload_igphoto/*", "*://*.instagram.com/rupload_igvideo/*", "*://*.instagram.com/api/v1/web/create/*"],
                            types: ["xmlhttprequest"]
                        }, ["requestHeaders"])
                }
            },
            u = {
                Kt: function() {
                    return chrome.cookies ? chrome.cookies.getAll({
                            url: "https://*.instagram.com"
                        })
                        .then((function(t) {
                            let n = {};
                            if (t.forEach((function(t) {
                                    n[t.name] = t.value
                                })), n.ds_user_id && n.sessionid) return n;
                            throw "Not authorized"
                        })) : Promise.resolve()
                },
                Yt: function() {
                    return this.Kt()
                        .then((function(t) {
                            return t && t.csrftoken || null
                        }))
                }
            },
            c = function() {
                return chrome.storage.local.get("query_hashes")
                    .then((function(t) {
                        if (t.query_hashes) return t.query_hashes;
                        throw "No query_hashes"
                    }))
            },
            l = {
                tn: {
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
                nn() {
                    return this.en([s()
                        .T
                    ])
                },
                en(t) {
                    let n = this;
                    return new Promise((async function(e, i) {
                        if (!t || !t.length) return i({
                            error: "no_doc_tasks"
                        });
                        let r = Array.from(document.querySelectorAll('script[src*="static.cdninstagram.com/rsrc.php"]'))
                            .map((function(t) {
                                return t.src
                            })),
                            o = Array.from(performance.getEntries())
                            .filter((function(t) {
                                return t.name.includes(".js") && t.name.includes("static.cdninstagram.com/rsrc.php")
                            }))
                            .map((function(t) {
                                return t.name
                            })),
                            s = r;
                        if (o.forEach((function(t) {
                                s.includes(t) || s.push(t)
                            })), !s.length) return i({
                            error: "no_doc_id_scripts"
                        });
                        let a = [];
                        for (let e = 0; e < s.length; ++e) {
                            let i = await fetch(s[e], {})
                                .catch((function() {}));
                            if (!i) continue;
                            let r = await i.text()
                                .catch((function() {}));
                            if (r) {
                                for (let e of t) {
                                    if (a.includes(e)) continue;
                                    let t = r.indexOf(n.tn[e].title);
                                    if (t > 0) {
                                        r = r.substring(t);
                                        for (let t in n.tn[e].doc_id) {
                                            if (n.tn[e].doc_id[t].regexPattern) {
                                                let i = r.match(n.tn[e].doc_id[t].regexPattern),
                                                    o = i && i[1] || null;
                                                if (o) {
                                                    a.push(t), await n.rn(t, o);
                                                    continue
                                                }
                                            }
                                            if ((n.tn[e].doc_id[t].token && r.indexOf(n.tn[e].doc_id[t].token) || -1) < 0) continue;
                                            const i = /params:\s*{\s*id:\s*"(\d+)"\s*,/.exec(r);
                                            let o = null;
                                            i && (o = i[1]), o && (a.push(t), await n.rn(t, o))
                                        }
                                    }
                                }
                                if (a.length >= t.length) break
                            }
                        }
                        return a.length < t.length ? i({
                            error: "not_found_requested_keys",
                            found: a,
                            requested: t
                        }) : e()
                    }))
                },
                rn: (t, n) => chrome.storage.local.get(s()
                        .I)
                    .then((function(e) {
                        let i = e.doc_id || {};
                        return i[t] = {
                            value: n,
                            updated_value_tm: Date.now()
                        }, chrome.storage.local.set({
                            doc_id: i
                        })
                    })),
                sn(t) {
                    let n = this;
                    return new Promise((function(e) {
                        return n.an(t)
                            .then((function(t) {
                                return e(t)
                            }))
                            .catch((function(e) {
                                return n.en([s()
                                        .T
                                    ])
                                    .then((function() {
                                        return n.an(t)
                                    }))
                            }))
                            .catch((function(i) {
                                let r = n.tn[s()
                                    .T].doc_id[t] || null;
                                e(r.defaultValue || null)
                            }))
                    }))
                },
                an: t => new Promise((function(n, e) {
                    return chrome.storage.local.get(s()
                            .I)
                        .then((function(i) {
                            let r = i.doc_id && i.doc_id[t] || null;
                            return r = r && r.value, r && n(r) || e()
                        }))
                }))
            },
            f = {
                un: (t, n) => (n = n || {}, fetch(t, n)
                    .then((function(n) {
                        if (200 !== n.status && 202 !== n.status) throw `request error [${t}]`;
                        return n
                    }))),
                cn(t, n) {
                    return this.un(t, n)
                        .then((function(t) {
                            return t.json()
                        }))
                },
                ln: function(t, n) {
                    return this.un(t, n)
                        .then((function(t) {
                            return t.text()
                        }))
                },
                fn(t) {
                    const n = this,
                        e = [s()
                            ._, s()
                            .u, s()
                            .i, s()
                            .v
                        ];
                    let i;
                    return u.Yt()
                        .then((function(t) {
                            return i = t, a.Ht(e)
                        }))
                        .then((function(e) {
                            return n.cn(t, {
                                headers: {
                                    ...e,
                                    "x-csrftoken": i
                                }
                            })
                        }))
                },
                hn(t, n) {
                    const e = this,
                        i = [s()
                            .u, s()
                            .i
                        ];
                    let o;
                    return r.kt(), u.Yt()
                        .then((async function(t) {
                            return t || (t = await e._n()), o = t, a.Ht(i)
                        }))
                        .then((function(i) {
                            return e.cn(t, {
                                headers: {
                                    ...i,
                                    "x-csrftoken": o,
                                    "x-fb-friendly-name": "PolarisProfilePostsQuery",
                                    accept: "*/*",
                                    "content-type": "application/x-www-form-urlencoded"
                                },
                                credentials: "include",
                                method: "POST",
                                body: new URLSearchParams(n)
                                    .toString()
                            })
                        }))
                },
                dn(t, n, e) {
                    const i = this,
                        r = [s()
                            ._, s()
                            .m, s()
                            .u, s()
                            .v
                        ];
                    let o;
                    return e = e || {}, u.Yt()
                        .then((async function(t) {
                            return t || (t = await i._n()), o = t, a.Ht(r)
                        }))
                        .then((function(r) {
                            return r[s()
                                .i] = r[s()
                                .m], delete r[s()
                                .m], i.un(t, {
                                method: "POST",
                                body: n,
                                headers: {
                                    ...r,
                                    ...e,
                                    "x-csrftoken": o
                                }
                            })
                        }))
                },
                _n: () => new Promise((function(t, n) {
                    chrome.runtime.sendMessage("getCsrftoken", (function(e) {
                        e ? t(e) : n()
                    }))
                })),
                vn: () => new Promise((function(t, n) {
                    chrome.runtime.sendMessage("getCookies", (function(e) {
                        e ? t(e) : n()
                    }))
                })),
                mn: function(t, n) {
                    const e = this;
                    if (!t) return n(null);
                    const i = `https://www.instagram.com/p/${t}/`,
                        r = [s()
                            ._, s()
                            .u, s()
                            .i, s()
                            .v
                        ];
                    let o;
                    return u.Yt()
                        .then((function(t) {
                            return o = t, a.Ht(r)
                        }))
                        .then((function(t) {
                            return e.ln(i, {
                                headers: {
                                    ...t,
                                    "x-csrftoken": o,
                                    accept: "text/html"
                                }
                            })
                        }))
                        .then((function(t) {
                            n(t)
                        }))
                },
                pn: function(t, n) {
                    a.Zt()
                        .then((e => {
                            let i = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + t,
                                r = {
                                    method: "GET",
                                    headers: e
                                };
                            r.headers["content-type"] = "application/x-www-form-urlencoded", this.cn(i, r)
                                .then((function(t) {
                                    let e = t && t.data && t.data.user && t.data.user.id || null;
                                    if (!e) throw `Not found userId [${JSON.stringify(t)}]`;
                                    n({
                                        userId: e
                                    })
                                }))
                                .catch((function() {
                                    n({
                                        error: 1
                                    })
                                }))
                        }))
                },
                wn: function(t, n) {
                    a.Zt()
                        .then((e => {
                            let i = "https://i.instagram.com/api/v1/users/web_profile_info/?username=" + t,
                                r = {
                                    method: "GET",
                                    headers: e
                                };
                            r.headers["content-type"] = "application/x-www-form-urlencoded", this.cn(i, r)
                                .then((function(t) {
                                    let e = t && t.data && t.data.user && t.data.user.edge_owner_to_timeline_media && t.data.user.edge_owner_to_timeline_media.count || null;
                                    if (!e) throw `Not found postCount [${JSON.stringify(t)}]`;
                                    n({
                                        postCount: e
                                    })
                                }))
                                .catch((function() {
                                    n({
                                        error: 1
                                    })
                                }))
                        }))
                },
                bn: function(t, n) {
                    const e = "https://i.instagram.com/api/v1/feed/user/" + t + "/story/";
                    this.fn(e)
                        .then((function(t) {
                            n(t)
                        }))
                        .catch((function() {
                            n({
                                error: 1
                            })
                        }))
                },
                kn: function(t, n) {
                    const e = `https://i.instagram.com/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(t)}`;
                    this.fn(e)
                        .then((function(t) {
                            n(t)
                        }))
                        .catch((function() {
                            n({
                                error: 1
                            })
                        }))
                },
                yn: function(t, n) {
                    const e = this;
                    c()
                        .then((function(n) {
                            const i = "https://www.instagram.com/graphql/query/?query_hash=" + n[t.request_type] + "&variables=" + encodeURIComponent(JSON.stringify(t.data));
                            return e.fn(i)
                        }))
                        .then((function(t) {
                            n(t)
                        }))
                        .catch((function(t) {
                            n({
                                error: 1
                            })
                        }))
                },
                gn: function(t, n) {
                    const e = this;
                    let i = t.after || null,
                        r = i ? s()
                        .D : s()
                        .C;
                    l.sn(r)
                        .then((function(r) {
                            if (!r) return n(null);
                            chrome.storage.local.get("fb_dtsg", (function(o) {
                                let s = o && o.fb_dtsg || null,
                                    a = {
                                        data: {
                                            count: 12,
                                            include_reel_media_seen_timestamp: true,
                                            include_relationship_info: true,
                                            latest_besties_reel_media: true,
                                            latest_reel_media: true
                                        },
                                        username: t.userName,
                                        __relay_internal__pv__PolarisIsLoggedInrelayprovider: true,
                                        __relay_internal__pv__PolarisShareSheetV3relayprovider: false
                                    };
                                i && (a = {
                                    ...a,
                                    first: 12,
                                    last: null,
                                    after: i || "",
                                    before: null
                                }), a = JSON.stringify(a);
                                let u = {
                                    fb_dtsg: s,
                                    variables: a,
                                    doc_id: r,
                                    fb_api_caller_class: "RelayModern",
                                    fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                                    server_timestamps: true
                                };
                                e.hn("https://www.instagram.com/graphql/query", u)
                                    .then((function(t) {
                                        n(t)
                                    }))
                                    .catch((function(t) {
                                        n({
                                            error: 1
                                        })
                                    }))
                            }))
                        }))
                },
                $n: function(t, n) {
                    const e = `https://www.instagram.com/api/v1/media/${t.data.pk}/info/`;
                    return this.fn(e)
                        .then((function(t) {
                            n(t)
                        }))
                        .catch((function(t) {
                            n({
                                error: 1
                            })
                        }))
                },
                En: function(t, n) {
                    let e = "https://www.instagram.com/" + t + "/";
                    this.un(e)
                        .then((function(t) {
                            return t.text()
                        }))
                        .then((function(t) {
                            let i = t.match(/\"profile_id\":\s?\"(\d+)/);
                            if (i = i && i[1], !i) throw `not received userId [${e}]`;
                            n(i)
                        }))
                        .catch((function() {
                            return n()
                        }))
                },
                Sn: function(t, n) {
                    const e = `https://www.instagram.com/rupload_igphoto/${"reels"===t.destination?"fb_uploader":t.destination}_${t.upload_id}`,
                        i = new Uint8Array(t.data)
                        .buffer,
                        r = {
                            "x-entity-length": t.data.length,
                            "x-entity-name": `${t.destination}_${t.upload_id}`,
                            "x-entity-type": "image/jpeg",
                            offset: "0",
                            "x-instagram-rupload-params": JSON.stringify({
                                media_type: "reels" === t.destination ? "2" : "1",
                                upload_id: t.upload_id,
                                upload_media_height: t.media_height,
                                upload_media_width: t.media_width
                            })
                        };
                    this.dn(e, i, r)
                        .then((function() {
                            n(true)
                        }))
                        .catch((function() {
                            n()
                        }))
                },
                xn: function(t, n) {
                    const e = `https://www.instagram.com/rupload_igvideo/${"reels"===t.destination?"fb_uploader":t.destination}_${t.upload_id}`,
                        i = new Uint8Array(t.data)
                        .buffer,
                        r = {
                            media_type: "2",
                            upload_id: t.upload_id,
                            upload_media_height: t.media_height,
                            upload_media_width: t.media_width,
                            video_format: "",
                            video_transform: null,
                            upload_media_duration_ms: t.duration,
                            "client-passthrough": "1",
                            is_sidecar: "0",
                            for_album: "story" === t.destination,
                            is_clips_video: "reels" === t.destination
                        };
                    "feed" === t.destination && (r.is_unified_video = "0");
                    const o = {
                        "x-entity-length": t.data.length,
                        "x-entity-name": `${t.destination}_${t.upload_id}`,
                        offset: "0",
                        "x-instagram-rupload-params": JSON.stringify(r)
                    };
                    this.dn(e, i, o)
                        .then((function() {
                            n(true)
                        }))
                        .catch((function() {
                            n()
                        }))
                },
                An: function(t, n) {
                    let e, i = "story" === t.destination,
                        r = {
                            upload_id: t.upload_id,
                            caption: t.caption
                        };
                    "reels" === t.destination ? (e = "api/v1/media/configure_to_clips/", r.clips_share_preview_to_feed = true === t.shareReelsToFeed ? "1" : "0") : e = "create/" + (i ? "configure_to_story/" : "configure/");
                    const o = this,
                        s = "https://www.instagram.com/" + e,
                        a = new URLSearchParams(r);
                    return i && undefined === t.previous_count ? this.In((function(n) {
                        return t.previous_count = n, u()
                    })) : u();
                    function u() {
                        return o.dn(s, a)
                            .then((function() {
                                if (i) return o.Pn(t, n);
                                n(true)
                            }))
                            .catch((function() {
                                n()
                            }))
                    }
                },
                Pn: function(t, n) {
                    const e = this;
                    return t.attempt = t.attempt || 0, e.In((function(i) {
                        if (!(i > t.previous_count)) {
                            if (t.attempt > 3) throw "FAIL";
                            return t.attempt++, e.An(t, n)
                                .then((function() {
                                    return new Promise((function(i) {
                                        setTimeout((function() {
                                            i(e.Pn(t, n))
                                        }), 300)
                                    }))
                                }))
                        }
                        n(true)
                    }))
                },
                In: function(t) {
                    const n = this;
                    return u.Kt()
                        .then((async function(e) {
                            if (e || (e = await n.vn()), !e) return Promise.reject();
                            const i = "https://i.instagram.com/api/v1/feed/user/" + e.ds_user_id + "/story/";
                            return a.Ht(["x-ig-www-claim", "x-ig-app-id"])
                                .then((function(r) {
                                    return n.cn(i, {
                                            method: "GET",
                                            headers: {
                                                ...r,
                                                "x-csrftoken": e.csrftoken
                                            },
                                            credentials: "include"
                                        })
                                        .then((function(n) {
                                            return t(n && n.reel && n.reel.items && n.reel.items.length || 0)
                                        }))
                                }))
                        }))
                }
            },
            h = {
                Un: function(t, n) {
                    chrome.runtime.sendMessage({
                        action: "baseGraphqlQueryRequest",
                        opts: {
                            request_type: "post",
                            data: {
                                child_comment_count: 3,
                                fetch_comment_count: 40,
                                has_threaded_comments: true,
                                parent_comment_count: 24,
                                shortcode: t
                            }
                        }
                    }, n)
                },
                Rn: function(t, n) {
                    let e = r.Lt(t);
                    chrome.runtime.sendMessage({
                        action: "baseMediaInfoRequest",
                        opts: {
                            request_type: "get",
                            data: {
                                pk: e
                            }
                        }
                    }, n)
                },
                Cn: function(t, n) {
                    let e = {
                        request_type: "owner",
                        data: {
                            id: t.user_id,
                            first: 12
                        }
                    };
                    t.after && (e.data.after = t.after), chrome.runtime.sendMessage({
                        action: "baseGraphqlQueryRequest",
                        opts: e
                    }, n)
                },
                Dn: function(t, n) {
                    let e = {
                        userName: t.userName,
                        count: 12
                    };
                    t.after && (e.after = t.after), f.gn(e, n)
                },
                Tn: function(t, n, e) {
                    let i, o, s, a, u = null,
                        c = 0,
                        l = 0;
                    return t.is_video ? (u = t.product_type || null, i = t.video_url, s = "video", a = t.display_url) : (t.display_resources.forEach((function(t) {
                        (t.config_width > c || t.config_height > l) && (c = t.config_width, l = t.config_height, i = t.src)
                    })), s = "photo", a = i), o = r.vt(i, n, e), {
                        url: i,
                        isReels: u,
                        filename: o,
                        type: s,
                        prev: a,
                        dimensions: t.dimensions
                    }
                },
                Nn: function(t, n, e) {
                    let i, o, s, a, u = null;
                    if (t.video_versions) {
                        u = t.product_type || null;
                        let n = t.video_versions.sort(r.Ft);
                        i = n[0].src || n[0].url;
                        let e = t.image_versions2.candidates.sort(r.Ft);
                        a = e[0].src || e[0].url, s = "video"
                    } else {
                        let n = t.image_versions2.candidates.sort(r.Ft);
                        i = n[0].src || n[0].url || null, s = "photo", a = i
                    }
                    return o = r.vt(i, n, e), {
                        url: i,
                        isReels: u,
                        filename: o,
                        type: s,
                        prev: a,
                        dimensions: t.dimensions
                    }
                },
                Bn: function(t, n) {
                    let e, i, o, a, u = null;
                    if (t.media_type === s()
                        .k) {
                        u = t.product_type || null, r.$t(t.video_versions, "width", true);
                        let n = t.video_versions;
                        e = n && n[0] && n[0].url || null, o = "video";
                        let i = null;
                        t.image_versions2 && t.image_versions2.additional_candidates || null ? i = t.image_versions2.additional_candidates.igtv_first_frame || t.image_versions2.additional_candidates.first_frame || null : (i = t.image_versions2.candidates || null, i && r.$t(i, "width", true), i = i && i[0] || null), a = i && i.url || null
                    } else t.image_versions2 && t.image_versions2.candidates && r.$t(t.image_versions2.candidates, "width", true), e = t.image_versions2.candidates && t.image_versions2.candidates[0] && t.image_versions2.candidates[0].url || null, o = "photo", a = e;
                    return i = r.vt(e, n), {
                        url: e,
                        isReels: u,
                        filename: i,
                        type: o,
                        prev: a,
                        dimensions: t.dimensions
                    }
                },
                jn: function(t, n) {
                    const e = this;
                    e.Rn(t.shortcode, (function(i) {
                        if (!i || i.error) return n({
                            error: true
                        });
                        try {
                            let o = i.items && i.items[0] || null;
                            if (!o) throw new Error;
                            let s = o.owner && o.owner.username || null;
                            if (t.is_carousel) var r = o.carousel_media && o.carousel_media[t.carousel_position || 0];
                            else r = o;
                            n(e.Bn(r, s))
                        } catch (t) {
                            return n({
                                error: true
                            })
                        }
                    }))
                },
                Sn: function(t, n) {
                    chrome.runtime.sendMessage({
                        action: "uploadPhotoRequest",
                        opts: t
                    }, n)
                },
                An: function(t, n) {
                    chrome.runtime.sendMessage({
                        action: "uploadPostConfigureRequest",
                        opts: t
                    }, n)
                },
                En: function(t, n) {
                    chrome.runtime.sendMessage({
                        action: "getUserIdByUserName",
                        userName: t
                    }, n)
                }
            };
        function _() {
            var t, n, e = document.querySelector(".igsd_modal");
            function i(t) {
                e.remove(), document.body.classList.remove("igsd-scroll-hidden"), "function" == typeof t && t()
            }
            function r(t) {
                t.stopPropagation(), t.target === e && i()
            }
            function o() {
                e.style.display = "block", document.body.classList.add("igsd-scroll-hidden"), setTimeout((function() {
                    document.querySelector(".igsd_modal_content")
                        .style.opacity = "1"
                }), 100)
            }
            e || ((e = document.createElement("div"))
                .className = "igsd_modal", e.innerHTML = '<div class="igsd_modal_content"></div>', document.querySelector("body")
                .appendChild(e)), this.close = function() {
                i()
            }, this.showCollectingMediaList = function(n, s) {
                e.querySelector("#bulk_preparing") || (document.removeEventListener("click", r), e.innerHTML = `\n\t\t\t\t<div id="bulk_preparing" class="igsd_modal_content">\n\t\t\t\t\t<div class="igsd_modal_header">${chrome.i18n.getMessage("preparing_links")}...</div>\n\t\t\t\t\t<div class="igsd_modal_progress"><div class="igsd_modal_progressbar"></div>\n\t\t\t\t</div>\n\t\t\t\t<div class="igsd_modal_btn_wrap igsd_one_btn_inside">\n\t\t\t\t\t<button class="igsd_btn_cancel">${chrome.i18n.getMessage("btn_cancel")}</button>\n\t\t\t\t</div>`, t = e.querySelector(".igsd_modal_progressbar"), e.querySelector(".igsd_btn_cancel")
                    .addEventListener("click", (function() {
                        i(s && s.cancelCallback)
                    })), o());
                let a = n.progress || 0;
                if (a && t) {
                    const n = 100;
                    a > n && (a = n), a > parseInt(t.style.width || 0) && (t.style.width = a + "%")
                }
            }, this.showBulkDownloadingProcess = function(s, a) {
                e.querySelector("#bulk_downloading") || (document.removeEventListener("click", r), e.innerHTML = `\n\t\t\t\t<div id="bulk_downloading" class="igsd_modal_content">\n\t\t\t\t\t<div class="igsd_modal_header">\n\t\t\t\t\t\t${chrome.i18n.getMessage("downloading")}...\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="igsd_count_header igsd_margin0">\n\t\t\t\t\t\t<span class="igsd_big_font_part"></span>\n\t\t\t\t\t\t<span class="igsd_small_font_part">&nbsp;/&nbsp;${s.total}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="igsd_modal_progress">\n\t\t\t\t\t\t<div class="igsd_modal_progressbar"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="igsd_modal_btn_wrap igsd_align_right">\n\t\t\t\t\t\t<button class="igsd_btn_enough">${chrome.i18n.getMessage("btn_enough")}</button>\n\t\t\t\t\t\t<button class="igsd_btn_cancel cancel_download small_btn_cancel">${chrome.i18n.getMessage("btn_cancel")}</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>`, n = e.querySelector(".igsd_big_font_part"), t = e.querySelector(".igsd_modal_progressbar"), e.querySelector(".igsd_btn_cancel")
                    .addEventListener("click", (function() {
                        i(a && a.cancelCallback)
                    })), e.querySelector(".igsd_btn_enough")
                    .addEventListener("click", (function() {
                        i(a && a.enoughCallback)
                    })), o());
                let u = s.progress || 0;
                n.innerText = s.done || 0, u > 100 && (u = 100), t.style.width = u + "%"
            }, this.showZippingProcess = function(i) {
                if (e.querySelector("#bulk_zipping") || (document.removeEventListener("click", r), e.innerHTML = `\n\t\t\t<div id="bulk_zipping" class="igsd_modal_content">\n\t\t\t\t<div class="igsd_modal_header">${chrome.i18n.getMessage("zipping_files")}...</div>\n\t\t\t\t<div class="igsd_count_header"></div>\n\t\t\t\t<div class="igsd_modal_progress">\n\t\t\t\t\t<div class="igsd_modal_progressbar"></div>\n\t\t\t\t</div>\n\t\t\t</div>`, t = e.querySelector(".igsd_modal_progressbar"), n = e.querySelector(".igsd_big_font_part"), o()), !n || !t) return;
                let s = i.progress || 0;
                n.innerText = s + "%", t.style.width = s + "%"
            }, this.showEmptyBox = function(t, n) {
                e.innerHTML = `\n\t\t<div class="igsd_modal_content">\n\t\t\t<span class="igsd_modal_close"></span>\n\t\t\t<div>${t}</div>\n\t\t</div>`, document.addEventListener("click", r), e.querySelector(".igsd_modal_close")
                    .addEventListener("click", (function() {
                        i(n && n.cancelCallback)
                    })), o()
            }, this.showMessage = function(t) {
                this.showEmptyBox(`<div class="igsd_modal_message_container">${t}</div>`)
            }, this.showLoader = function(t) {
                e.innerHTML = `\n\t\t<div class="igsd_modal_content">\n\t\t\t<div class="igsd_modal_loader" style="width:${t&&t.width||300}px;height:${t&&t.height||300}px;">\n\t\t\t\t<span class="igsd_icon"></span>\n\t\t\t</div>\n\t\t</div>`, o()
            }
        }
        var d = e(716),
            v = e.n(d);
        
            p = {
                On: false,
                zn: function(t, n) {
                    let e, i, r, o, s, a = this,
                        u = t.data,
                        c = t.asyncCount || 48,
                        l = false,
                        f = [],
                        h = function() {
                            l || (l = true, "function" == typeof s.reject && (n = s.reject)(f))
                        },
                        _ = function() {
                            r || (r = setInterval((function() {
                                0 !== o && (clearInterval(r), r = undefined, 1 === o ? "function" == typeof s.resolve && (u = f, setTimeout((function() {
                                    try {
                                        s.resolve(u)
                                    } catch (t) {
                                        f = t, h()
                                    }
                                }), 0)) : h())
                            }), 10))
                        };
                    return function() {
                        i = 0, e = u.length;
                        let t = 0,
                            r = function(t) {
                                o = 2, f = t
                            };
                        o = 0, _();
                        let s = setInterval((function() {
                            if (a.On) return;
                            if (!u.length || 0 != o) return void clearInterval(s);
                            let l = c - t;
                            l < 1 || u.splice(0, l)
                                .forEach((function(s, a) {
                                    setTimeout((function() {
                                        try {
                                            t++, n(s, function(n) {
                                                return function(r) {
                                                    Array.isArray(f) && 2 != o && (t--, i++, f[n] = r, i === e && (o = 1))
                                                }
                                            }(a), r)
                                        } catch (t) {
                                            f = t, o = 2
                                        }
                                    }), 0)
                                }))
                        }), 500)
                    }(), {
                        thenOne: function(t, n) {
                            return s = {
                                resolve: t,
                                reject: n
                            }, _(), a
                        }
                    }
                },
                qn: function(t, e) {
                    let i = this,
                        r = t.files,
                        o = t.filename_prefix || "ig_sd",
                        s = new(v()),
                        a = new _,
                        u = false,
                        c = r.length,
                        l = 0,
                        f = 0,
                        h = 0;
                    if (!r.length) return e({
                        err: "true",
                        reason: "no files to dw"
                    });
                    function d() {
                        return new Promise((function(t, r) {
                            var l;
                            u || i.Mn && (u = true, i.Mn = false, c > 200 && a.showZippingProcess({
                                    progress: 0
                                }), l = function(n) {
                                    if (n.step) c > 200 && n.percent && Math.random() > .98 && a.showZippingProcess({
                                        progress: parseInt(n.percent)
                                    });
                                    else if (n.done) {
                                        if (i.On) return t();
                                        a.close(), "function" == typeof e && (e({
                                            success: 1
                                        }), t())
                                    } else n.fail && a.showMessage(chrome.i18n.getMessage("error_bulk"))
                                }, s.generateAsync({
                                    type: "blob"
                                }, (function(t) {
                                    l({
                                        e: "step",
                                        percent: t.percent
                                    })
                                }))
                                .then((function(t) {
                                    let e = (new Date)
                                        .toJSON()
                                        .replace(/([^\w\-].+)/, ""),
                                        i = `${o}_${e}.zip`;
                                    n()(t, i), w.Ln(), l({
                                        done: true
                                    })
                                }), (function() {
                                    l({
                                        fail: true
                                    })
                                })))
                        }))
                    }
                    function p(t, n, e) {
                        if (!i.Mn) return n({
                            cancelled: 1
                        });
                        let r = new XMLHttpRequest;
                        r.open("GET", t, true), "responseType" in r && (r.responseType = "arraybuffer"), r.onreadystatechange = function() {
                            4 === this.readyState && (200 === this.status ? (h += parseInt(r.getResponseHeader("content-length")), n({
                                fileData: r.response || r.responseText
                            })) : e ? n({
                                error: 1
                            }) : setTimeout((function() {
                                p(t, n, true)
                            }), 2e3))
                        }, r.send()
                    }
                    i.Mn = true, a.showBulkDownloadingProcess({
                            total: c
                        }, {
                            enoughCallback: d,
                            cancelCallback: function() {
                                u = true, w.Ln()
                            }
                        }), i.zn({
                            data: r,
                            asyncCount: 12
                        }, (function(t, n, e) {
                            if (i.Gn) return e();
                            i.Mn && p(t.url, (async function(r) {
                                if (l++, l > 10 && (0 === f || f / l < .7)) return e();
                                r.fileData && (f++, a.showBulkDownloadingProcess({
                                    done: l,
                                    progress: parseFloat(l / c * 100)
                                }), s.file(t.filename, r.fileData, {
                                    binary: true
                                }), !i.On && h >= performance.memory.jsHeapSizeLimit - .55 * performance.memory.jsHeapSizeLimit - h && (i.On = true, h = 0, await d(), s = new(v()), u = false, i.Mn = true, i.On = false)), n(t.filename)
                            }))
                        }))
                        .thenOne(d, (function() {
                            w.Wn = false, m.Fn(), i.Gn || (a.showMessage(chrome.i18n.getMessage("error_bulk")), "function" == typeof e && e({
                                error: 1
                            }))
                        }))
                }
            },
            w = {
                Zn: false,
                Mn: false,
                Gn: false,
                Hn: null,
                Jn: null,
                Vn: null,
                Qn: null,
                Xn: null,
                Kn: [],
                Yn: 0,
                te: 0,
                Wn: false,
                ne: {
                    ee: function(t) {
                        chrome.storage.local.set({
                            advanced_params: t
                        })
                    },
                    ie: function(t) {
                        let n = this;
                        chrome.storage.local.get("advanced_params", (function(e) {
                            e.advanced_params ? t(e.advanced_params) : n.ee({
                                for_days: true,
                                for_days_count: 30,
                                media_type: "all",
                                most_liked: false,
                                most_liked_percent: 50,
                                most_viewed: false,
                                most_viewed_percent: 50
                            }, t)
                        }))
                    }
                },
                Ln: function() {
                    this.Mn = false, this.Wn = false
                },
                re: function() {
                    let t = document.querySelector(".igsd_igsd_first_bulk_btn_wrap");
                    if (t) return void(t.style.display = "block");
                    let n = r.Pt();
                    if (!n) return;
                    if (this.Hn = r.St(), !this.Hn) {
                        let t = document.querySelector("main header section h2");
                        this.Hn = t && t.innerText
                    }
                    if (!this.Hn) return;
                    this.Jn = null, this.Vn = null, this.Xn = null, this.Kn = [], this.te = 0;
                    let e = document.createElement("div");
                    e.innerHTML = `\n\t\t\t\t<div class="igsd_igsd_first_bulk_btn_wrap">\n\t\t\t\t\t<div class="igsd_first_bulk_btn"></div>\n\t\t\t\t\t<div class="igsd_first_bulk_hint">${chrome.i18n.getMessage("bulk_download")}</div>\n\t\t\t\t</div>`, n.append(e.firstElementChild), n.querySelector(".igsd_first_bulk_btn")
                        .addEventListener("click", this.oe.bind(this))
                },
                se: function() {
                    let t = document.querySelector(".igsd_igsd_first_bulk_btn_wrap");
                    t && (t.style.display = "none")
                },
                oe: function() {
                    let t = this,
                        n = new _;
                    n.showLoader({
                        width: 300,
                        height: 300
                    }), r.kt("checkBulkDownloadNow", (function(e) {
                        if (e) return n.showMessage(chrome.i18n.getMessage("synchronous_bulk_download_denied"));
                        null === t.Jn || isNaN(t.Jn) ? r.jt(t.Hn, (function(e) {
                            t.ae(t.Hn, (function(i) {
                                i && !i.error && i.success ? (t.Jn = e, t.Xn = i.after, t.Vn = i.user_id, t.ue({
                                    count: e
                                })) : (t.Ln(), n.showMessage(chrome.i18n.getMessage("sww_error")))
                            }))
                        })) : t.ue({
                            count: t.Jn
                        })
                    }))
                },
                ue: function(t) {
                    let n = this;
                    if (0 === t.count) return (new _)
                        .showMessage(chrome.i18n.getMessage("no_media_found"));
                    r.kt("is_bulk_advanced", (function(e) {
                        n.Zn = e, e ? n.ce(t) : n.le(t)
                    }))
                },
                ce: function(t) {
                    let n = this;
                    n.ne.ie((function(e) {
                        var i = `\n\t\t\t\t<div class="igsd_count_header">\n\t\t\t\t\t<span class="igsd_big_font_part">${t.count}</span>\n\t\t\t\t\t<span class="igsd_small_font_part">&nbsp;${chrome.i18n.getMessage("files_found_on_page")}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="igsd_modal_header">${chrome.i18n.getMessage("bulk_advanced")}</div>\n\t\t\t\t<form class="igsd_bulk_form">\n\t\t\t\t\t<div class="igsd_form_block">\n\t\t\t\t\t\t<label class="igsd_bulk_advanced_input_label">\n\t\t\t\t\t\t\t<input type="checkbox" name="for_days">\n\t\t\t\t\t\t\t<span class="igsd_form_custom_checkbox"><span class="igsd_form_custom_checkbox_checked"></span></span>\n\t\t\t\t\t\t\t<span>${chrome.i18n.getMessage("for_days")}</span>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<div class="igsd_form_number_input_wrap">\n\t\t\t\t\t\t\t<input type="number" name="for_days_count" max="999" min="1" value="30" disabled>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class="igsd_form_block igsd_form_type_tabs">\n\t\t\t\t\t\t<label class="igsd_form_type_tab">${chrome.i18n.getMessage("all")}<input name="igsd_form_type_tab" type="radio" value="all"></label>\n\t\t\t\t\t\t<label class="igsd_form_type_tab">${chrome.i18n.getMessage("photo")}<input name="igsd_form_type_tab" type="radio" value="photo"></label>\n\t\t\t\t\t\t<label class="igsd_form_type_tab">${chrome.i18n.getMessage("video")}<input name="igsd_form_type_tab" type="radio" value="video"></label>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class="igsd_form_block">\n\t\t\t\t\t\t<label class="igsd_bulk_advanced_input_label">\n\t\t\t\t\t\t\t<div class="igsd_form_switch">\n\t\t\t\t\t\t\t\t<input type="checkbox" name="most_liked">\n\t\t\t\t\t\t\t\t<div class="igsd_form_switch_slider"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<span>${chrome.i18n.getMessage("most_liked")}</span>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t<div class="igsd_form_number_input_wrap">\n\t\t\t\t\t\t<input class="percent_count" name="most_liked_percent" type="number" max="100" min="1" value="50" disabled>\n\t\t\t\t\t\t<span class="igsd_form_number_input_note">%</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t\t<div class="igsd_form_block">\n\t\t\t\t\t\t<label class="igsd_bulk_advanced_input_label">\n\t\t\t\t\t\t\t<div class="igsd_form_switch">\n\t\t\t\t\t\t\t\t<input type="checkbox" name="most_viewed">\n\t\t\t\t\t\t\t\t<div class="igsd_form_switch_slider"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<span>${chrome.i18n.getMessage("most_viewed")}</span>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<div class="igsd_form_number_input_wrap">\n\t\t\t\t\t\t\t<input class="percent_count" name="most_viewed_percent" type="number" max="100" min="1" value="50" disabled>\n\t\t\t\t\t\t\t<span class="igsd_form_number_input_note">%</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="igsd_modal_btn_wrap">\n\t\t\t\t\t\t<button class="igsd_popup_dl_btn">${chrome.i18n.getMessage("download")}</button>\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t\t<div class="igsd_form_advanced_switch"><span>${chrome.i18n.getMessage("hide_advanced")}</span></div>`;
                        (new _)
                        .showEmptyBox(i), document.querySelector(".igsd_form_advanced_switch span")
                            .addEventListener("click", (function() {
                                n.Zn = false, r.kt({
                                    action: "bulk_advanced",
                                    value: false
                                }), n.le(t)
                            }));
                        let o = document.querySelector(".igsd_bulk_form"),
                            s = o.querySelectorAll('[name="igsd_form_type_tab"]'),
                            a = o.querySelector('[name="for_days"]'),
                            u = o.querySelector('[name="for_days_count"]'),
                            c = o.querySelector('[name="most_liked"]'),
                            l = o.querySelector('[name="most_viewed"]'),
                            f = o.querySelector('[name="most_liked_percent"]'),
                            h = o.querySelector('[name="most_viewed_percent"]');
                        function d(t) {
                            if ("video" === t) {
                                l.removeAttribute("disabled"), l.closest(".igsd_form_block")
                                    .style.opacity = "1";
                                let t = l.querySelector(".igsd_bulk_advanced_input_label");
                                t && (t.style.cursor = "pointer")
                            } else {
                                l.setAttribute("disabled", "true"), l.closest(".igsd_form_block")
                                    .style.opacity = "0";
                                let t = l.querySelector(".igsd_bulk_advanced_input_label");
                                t && (t.style.cursor = "default")
                            }
                        }
                        document.querySelector(".igsd_popup_dl_btn")
    .addEventListener("click", (function(t) {
        t.stopPropagation(), t.preventDefault(), n.ne.ee(e), n.fe()
        })), o.addEventListener("change", (function(t) {
                                switch (t.target.name) {
                                    case "for_days":
                                        e.for_days = t.target.checked, t.target.checked ? (u.removeAttribute("disabled"), u.focus(), u.select()) : u.setAttribute("disabled", "true");
                                        break;
                                    case "for_days_count":
                                        e.for_days_count = parseInt(t.target.value);
                                        break;
                                    case "most_liked":
                                        e.most_liked = t.target.checked, t.target.checked ? (f.removeAttribute("disabled"), f.focus(), f.select(), l.checked = false, h.setAttribute("disabled", "true"), e.most_viewed = false) : f.setAttribute("disabled", "true");
                                        break;
                                    case "most_liked_percent":
                                        e.most_liked_percent = parseInt(t.target.value);
                                        break;
                                    case "most_viewed":
                                        e.most_viewed = t.target.checked, t.target.checked ? (h.removeAttribute("disabled"), h.focus(), h.select(), c.checked = false, f.setAttribute("disabled", "true"), e.most_liked = false) : h.setAttribute("disabled", "true");
                                        break;
                                    case "most_viewed_percent":
                                        e.most_viewed_percent = parseInt(t.target.value)
                                }
                            })), s.forEach((function(t) {
                                t.addEventListener("click", (function(t) {
                                    e.media_type = t.target.value, document.querySelectorAll(".igsd_form_type_tab")
                                        .forEach((function(t) {
                                            t && t.classList.contains("igsd_selected") && t.classList.remove("igsd_selected")
                                        })), t.target.closest(".igsd_form_type_tab")
                                        .classList.add("igsd_selected"), d(t.target.value)
                                }))
                            })), o.querySelector('[name="for_days_count"]')
                            .addEventListener("keydown", (function(t) {
                                let n = t.target;
                                setTimeout((function() {
                                    let t = parseInt(n.value);
                                    isNaN(t) || t < 1 ? n.value = 1 : t > 999 && (n.value = 999)
                                }), 200)
                            })), o.querySelector(".percent_count")
                            .addEventListener("keydown", (function(t) {
                                let n = t.target;
                                setTimeout((function() {
                                    let t = parseInt(n.value);
                                    isNaN(t) || t < 1 ? n.value = 1 : t > 100 && (n.value = 100)
                                }), 200)
                            })), e.for_days && (a.checked = true, u.removeAttribute("disabled")), e.most_liked && (c.checked = true, f.removeAttribute("disabled")), e.most_viewed && (l.checked = true, h.removeAttribute("disabled")), d(e.media_type), u.value = e.for_days_count, f.value = e.most_liked_percent, h.vale = e.most_viewed_percent;
                        let v = document.querySelector(`[name="igsd_form_type_tab"][value="${e.media_type}"]`);
                        v && (v.checked = true, v.closest(".igsd_form_type_tab")
                            .classList.add("igsd_selected"))
                    }))
                },
                le: function(t) {
                    let n = this,
                        e = t.count,
                        i = e > 1e3 ? 1e3 : e,
                        o = (parseInt(e) - 1)
                        .toString(),
                        s = `\n\t\t\t<div class="igsd_count_header">\n\t\t\t\t<span class="igsd_big_font_part">${e}</span>\n\t\t\t\t<span class="igsd_small_font_part">&nbsp;${chrome.i18n.getMessage("files_found_on_page")}</span>\n\t\t\t</div>\n\t\t\t<form class="igsd_bulk_form">\n\t\t\t\t<div class="igsd_form_block">\n\t\t\t\t\t<div class="igsd_form_number_input_wrap igsd_form_number_input_wrap_column">\n\t\t\t\t\t\t<span>${chrome.i18n.getMessage("from")}</span> \n\t\t\t\t\t\t<input id="igsd_dl_all_start" type="number" min="1" max="${o}" value="1">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="igsd_form_number_input_wrap igsd_form_number_input_wrap_column">\n\t\t\t\t\t\t<span>${chrome.i18n.getMessage("to")}</span>\n\t\t\t\t\t\t<input id="igsd_dl_all_end" type="number" min="2" value="${i}" max="${e}">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="igsd_modal_btn_wrap">\n\t\t\t\t\t<button class="igsd_popup_dl_btn">${chrome.i18n.getMessage("download")}</button>\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t\t<div class="igsd_form_advanced_switch"><span>${chrome.i18n.getMessage("bulk_advanced")}</span></div>`;
                    (new _)
                    .showEmptyBox(s), document.querySelector(".igsd_form_advanced_switch span")
                        .addEventListener("click", (function() {
                            n.Zn = true, r.kt({
                                action: "bulk_advanced",
                                value: true
                            }), n.ce(t)
                        })), document.querySelector(".igsd_popup_dl_btn")
                        .addEventListener("click", (function(t) {
                            t.stopPropagation(), t.preventDefault(), n.fe()
                        }));
                    let a = document.querySelector("#igsd_dl_all_end"),
                        u = document.querySelector("#igsd_dl_all_start");
                    a.addEventListener("keydown", (function(t) {
                        let n = t.target,
                            e = n.getAttribute("max");
                        setTimeout((function() {
                            let t = parseInt(n.value);
                            isNaN(t) || t < u.value ? n.value = u.value : t > e && (n.value = e)
                        }), 1e3)
                    })), u.addEventListener("keydown", (function(t) {
                        let n = t.target;
                        setTimeout((function() {
                            let t = parseInt(n.value);
                            isNaN(t) || t < 1 ? n.value = 1 : t > a.value && (n.value = a.value)
                        }), 1e3)
                    })), a.addEventListener("focus", (function(t) {
                        t.target.select()
                    })), u.addEventListener("focus", (function(t) {
                        t.target.select()
                    }))
                },
                fe: function() {
                    let t = this;
                    t.Mn || (t.Mn = true, t.Gn = false, t.Wn = true, this.he((function(n) {
                        t._e(n, (function(e) {
                            if (e.error) return t.Ln(), (new _)
                                .showMessage(chrome.i18n.getMessage("sww_error"));
                            let i = t.de(n);
                            if (i && "not_match" === i.error && t.Zn) return t.Ln(), (new _)
                                .showMessage(chrome.i18n.getMessage("bulk_advanced_params_not_match"));
                            p.qn({
                                files: i,
                                filename_prefix: t.Hn
                            }, (n => {
                                t.Ln(), n.err && (new _)
                                    .showMessage(chrome.i18n.getMessage("sww_error"))
                            }))
                        }))
                    })))
                },
                ae: function(t, n) {
                    let e = this;
                    h.En(t, (function(i) {
                        if (!i) return n({
                            error: 1
                        });
                        e.Qn = t, h.Dn({
                            userName: e.Qn
                        }, (function(t) {
                            try {
                                return e.ve(t.data), n({
                                    success: 1,
                                    count: t.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges.count,
                                    after: t.data.xdt_api__v1__feed__user_timeline_graphql_connection.page_info.end_cursor,
                                    has_next_page: t.data.xdt_api__v1__feed__user_timeline_graphql_connection.page_info.has_next_page,
                                    user_id: i
                                })
                            } catch (t) {
                                return e.Ln(), n({
                                    error: 1
                                })
                            }
                        }))
                    }))
                },
                ve: function(t) {
                    let n = t && t.xdt_api__v1__feed__user_timeline_graphql_connection || null;
                    if (n || (n = t && t.user && t.user.edge_owner_to_timeline_media || null), !n) return;
                    let e = this;
                    e.me = n.page_info.has_next_page, e.Xn = n.page_info.end_cursor, n.edges.forEach((function(t) {
                        let n = [],
                            i = {},
                            r = t.node.location && t.node.location.slug;
                        t.node.carousel_media ? t.node.carousel_media.forEach((function(o) {
                            i = h.Nn(o, e.Hn, r), i.taken_at_timestamp = t.node.taken_at_timestamp || t.node.taken_at, i.likes_count = t.node.edge_media_preview_like && t.node.edge_media_preview_like.count || null, i.video_view_count = t.node.video_view_count || null, n.push(i)
                        })) : (i = h.Nn(t.node, e.Hn, r), i.taken_at_timestamp = t.node.taken_at_timestamp || t.node.taken_at, i.likes_count = t.node.edge_media_preview_like && t.node.edge_media_preview_like.count || null, i.video_view_count = t.node.video_view_count || null, n.push(i)), e.Kn.push(n)
                    }));
                    let i = n.edges.pop();
                    e.te = i.node.taken_at_timestamp || i.node.taken_at
                },
                de: function(t) {
                    if (!this.Zn) return r.L(this.Kn.slice(t.start - 1, t.end));
                    let n = [],
                        e = [];
                    if (t.advanced_options.for_days && this.Kn.forEach((function(e) {
                            e.forEach((function(e) {
                                e.taken_at_timestamp >= r.M(t.advanced_options.for_days_count) && n.push(e)
                            }))
                        })), n.length || (n = r.L(this.Kn.slice(t.start - 1, t.end))), "all" !== t.advanced_options.media_type) {
                        if (n.forEach((function(n) {
                                t.advanced_options.media_type === n.type && e.push(n)
                            })), !e || !e.length) return {
                            error: "not_match"
                        }
                    } else e = n;
                    let i = null;
                    return "video" === t.advanced_options.media_type && t.advanced_options.most_viewed ? (r.$t(e, "video_view_count", true), i = Math.ceil(e.length * t.advanced_options.most_viewed_percent / 100)) : t.advanced_options.most_liked && (r.$t(e, "likes_count", true), i = Math.ceil(e.length * t.advanced_options.most_liked_percent / 100)), i && (e = e.splice(0, i)), e
                },
                _e: function(t, n) {
                    let e = this,
                        i = new _;
                    function o() {
                        return Math.floor(3e3 * Math.random())
                    }
                    i.showCollectingMediaList({}, {
                            cancelCallback: function() {
                                e.Ln()
                            }
                        }),
                        function s(a) {
                            if (!e.me || !e.Xn) return n({
                                success: 1
                            });
                            if (!e.Zn && e.Yn <= e.Kn.length) return n({
                                success: 1
                            });
                            if (e.Zn && (t.advanced_options.for_days && r.M(t.advanced_options.for_days_count) >= e.te || e.Kn.length > 5e3)) return n({
                                success: 1
                            });
                            if (!e.Mn) return;
                            a = a || 1, h.Dn({
                                userName: e.Qn,
                                user_id: e.Vn,
                                after: e.Xn
                            }, (function(r) {
                                if (!r || r.error || !r.data) return a > 3 ? (e.Ln(), n({
                                    error: 1,
                                    reason: "request_error"
                                })) : (a++, setTimeout(s.bind(e, a, n), o()));
                                try {
                                    e.ve(r.data)
                                } catch (t) {
                                    return e.Ln(), n({
                                        error: 1,
                                        reason: "media_list_adding_error"
                                    })
                                }
                                let u;
                                if (e.Zn)
                                    if (t.advanced_options.for_days) {
                                        u = (Date.now() / 1e3 - e.te) / 86400 / t.advanced_options.for_days_count * 100
                                    } else {
                                        let t = e.Jn < 5e3 ? e.Jn : 5e3;
                                        u = e.Kn.length / t * 100
                                    }
                                else u = e.Kn.length / e.Yn * 100;
                                i.showCollectingMediaList({
                                    progress: u
                                }), setTimeout(s.bind(e, false, n), o())
                            }))
                        }()
                },
                he: function(t) {
                    if (this.Zn) this.ne.ie((function(n) {
                        t({
                            advanced_options: n
                        })
                    }));
                    else {
                        let n = document.querySelector("#igsd_dl_all_start")
                            .value,
                            e = document.querySelector("#igsd_dl_all_end")
                            .value;
                        isNaN(n) && (n = 1), isNaN(e) && (e = 1), this.Yn = e, t({
                            start: n,
                            end: e
                        })
                    }
                }
            },
            b = {
                pe: function(t, n) {
                    let e = this;
                    h.En(t, (function(i) {
                        if (!i) return n();
                        chrome.runtime.sendMessage({
                            action: "requestStories",
                            reel_ids: i
                        }, (function(r) {
                            if (!(r && r.reels && r.reels[i] && r.reels[i].items)) return n();
                            n(e.we(r.reels[i].items), t)
                        }))
                    }))
                },
                we: function(t, n) {
                    let e = [];
                    return t.forEach((function(t) {
                        let i = null,
                            r = 0;
                        undefined !== t.video_versions ? t.video_versions.forEach((function(t) {
                            t.width > r && (r = t.width, i = t.url)
                        })) : t.image_versions2.candidates.forEach((function(t) {
                            t.width > r && (r = t.width, i = t.url)
                        }));
                        let o = i.match(new RegExp("\\/([^/?]+)(?:$|\\?)"));
                        if (o = o && o[1], o) {
                            let e = t.user.username || n && n.username || "";
                            e.length && (o = `${e}_${o}`)
                        }
                        e.push({
                            url: i,
                            filename: o || null
                        })
                    })), e
                },
                be: function() {
                    const t = document.querySelector('svg path[d*="M15 1c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3zm18 0c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3z"]') || null;
                    let n = t && t.closest("button") || null;
                    n || (n = t && t.closest('div[role*="button"]') || null), n && n.click()
                },
                ke: function(t) {
                    if (!location.pathname.match(/stories\/(locations|tags)\//) && !t.querySelector(".igsd_stories_actions_wrap")) {
                        let n = document.createElement("div");
                        n.innerHTML = `\n\t\t\t\t<div class="igsd_stories_actions_wrap">\n\t\t\t\t\t<a class="igsd_stories_actions_btn igsd_ns_dl_btn">\n\t\t\t\t\t\t<span class="igsd_icon"></span>\n\t\t\t\t\t\t<span class="igsd_text">${chrome.i18n.getMessage("download")}</span>\n\t\t\t\t\t</a>\n\t\t\t\t\t<a class="igsd_stories_actions_btn igsd_ns_dl_all_btn">\n\t\t\t\t\t\t<span class="igsd_icon"></span>\n\t\t\t\t\t\t<span class="igsd_text">${chrome.i18n.getMessage("download_all")}</span>\n\t\t\t\t\t\t<span class="igsd_stories_count"></span>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t`, t.append(n)
                    }
                },
                ye: function(t) {
                    if (!t.pk) return;
                    let n = {};
                    if (n.id = t.pk, undefined !== t.video_versions) {
                        let e = t.video_versions.sort(r.Ft);
                        n.url = e[0].src || e[0].url;
                        let i = t.image_versions2.candidates.sort(r.Ft);
                        n.prev = i[0].src || i[0].url, n.type = "video"
                    } else {
                        let e = t.image_versions2.candidates.sort(r.Ft);
                        n.url = e[0].src || e[0].url, n.type = "image"
                    }
                    let e = n.url.match(new RegExp("\\/([^/?]+)(?:$|\\?)"));
                    if (e = e && e[1], e) {
                        let i = t.user.username || "";
                        i.length && (n.filename = `${i}_${e}`)
                    }
                    return n
                },
                ge: function(t) {
                    return new Promise((n => {
                        chrome.runtime.sendMessage({
                            action: "requestHighlights",
                            reel_ids: t
                        }, (function(t) {
                            if (!(t && t.reels_media && t.reels_media.length && t.reels_media[0].items && t.reels_media[0].items.length)) return n(null);
                            let e = [],
                                i = t.reels_media[0].user.username || r.Z();
                            i += "_" + t.reels_media[0].title || 0;
                            let o = t.reels_media[0].user.pk || null;
                            for (let n of t.reels_media[0].items) {
                                if (!n.media_type) continue;
                                let t, a;
                                if (n.media_type === s()
                                    .k) {
                                    let e = n.video_versions.sort(r.Ft);
                                    t = e[0].src || e[0].url, a = s()
                                        .A
                                }
                                if (n.media_type === s()
                                    .p) {
                                    let e = n.image_versions2.candidates.sort(r.Ft);
                                    t = e[0].src || e[0].url, a = s()
                                        .$
                                }
                                e.push({
                                    userName: i,
                                    fileExt: a,
                                    url: t,
                                    id: n.id || r.Z(),
                                    userPk: o
                                })
                            }
                            n(e)
                        }))
                    }))
                },
                $e: function(t, n) {
                    let e = this,
                        i = r.N[t];
                    function o(i) {
                        chrome.runtime.sendMessage({
                            action: "requestStories",
                            userId: i
                        }, (function(i) {
                            if (!i || !i.reel) return n(null);
                            let r = i.reel;
                            if (r.err || !r.items || !r.items.length) return n(null);
                            let o = [];
                            for (let t of r.items) t.user && o.push(e.ye(t));
                            n(o, t)
                        }))
                    }
                    i ? o(i) : r.Bt(t, (function(n) {
                        n ? (r.N[t] = n, i = n, o(i)) : w.Wn = false
                    }))
                },
                Ee(t) {
                    let n = Array.from(t.querySelectorAll("div"))
                        .find((t => {
                            let n = t.clientHeight || t.offsetHeight;
                            if (n > 0 && n < 6) return t.parentElement
                        }));
                    return n && n.children && n.children.length || 1
                },
                Se: function() {
                    let t = r.zt();
                    if (!t) return;
                    let n = document.querySelector(".igsd_ns_dl_all_btn");
                    if (!n) return;
                    let e = this.Ee(t);
                    e > 1 ? (n.querySelector(".igsd_stories_count")
                        .innerText = `(${e})`, n.style.setProperty("display", "flex", "important")) : n.style.setProperty("display", "none", "important")
                }
            },
            k = {
                xe: {
                    upload_id: null,
                    media: null,
                    media_type: null,
                    destination: null
                },
                Ae: function(t, n) {
                    let e = this;
                    e.xe = t, t.shareReelsToFeed && (e.Ie = t.shareReelsToFeed), r.kt("getCookies", (function(t) {
                        if (!t) return (new _)
                            .showMessage(chrome.i18n.getMessage("not_authorized_upload_attempt"));
                        e.xe.upload_id = Date.now(), 2 === e.xe.media_type ? e.Pe({
                                blob: e.xe.media.file
                            })
                            .then((function(t) {
                                if (!t) throw new Error;
                                return e.Ue({
                                    blob: e.xe.media.prev
                                })
                            }))
                            .then((function(t) {
                                if (!t) throw new Error;
                                return e.Re()
                            }))
                            .then((function(t) {
                                if (!t) throw new Error;
                                n(true)
                            }))
                            .catch((function(t) {
                                n(false)
                            })) : e.Ue({
                                blob: e.xe.media.file
                            })
                            .then((function(t) {
                                if (!t) throw new Error;
                                return e.Re()
                            }))
                            .then((function(t) {
                                if (!t) throw new Error;
                                n(true)
                            }))
                            .catch((function(t) {
                                n(false)
                            }))
                    }))
                },
                Ue: function(t) {
                    let n = this;
                    return new Promise((function(e, i) {
                        let r = new FileReader;
                        r.readAsArrayBuffer(t.blob), r.onload = function(t) {
                            h.Sn({
                                upload_id: n.xe.upload_id,
                                destination: n.xe.destination,
                                media_height: n.xe.media.height,
                                media_width: n.xe.media.width,
                                data: Array.from(new Uint8Array(r.result))
                            }, (function(t) {
                                t ? e(t) : i()
                            }))
                        }
                    }))
                },
                Pe: function(t) {
                    let n = this;
                    return new Promise((function(e, i) {
                        let r = new FileReader;
                        r.readAsArrayBuffer(t.blob), r.onload = function(t) {
                            f.xn({
                                upload_id: n.xe.upload_id,
                                destination: n.xe.destination,
                                media_height: n.xe.media.height,
                                media_width: n.xe.media.width,
                                duration: n.xe.media.duration,
                                data: Array.from(new Uint8Array(r.result))
                            }, (function(t) {
                                t ? e(t) : i()
                            }))
                        }
                    }))
                },
                Re: function() {
                    let t = this;
                    return new Promise((function(n, e) {
                        return h.An({
                            upload_id: t.xe.upload_id,
                            caption: t.xe.media.caption || "",
                            destination: t.xe.destination,
                            shareReelsToFeed: t.Ie || null
                        }, (function(t) {
                            t ? n(t) : e()
                        }))
                    }))
                }
            };
            g = function(t, e) {
                if (!t || !t.url) return e({
                    err: true
                });
                var i = new XMLHttpRequest;
                i.open("GET", t.url, true), i.responseType = "arraybuffer", i.onreadystatechange = function() {
                    if (4 === this.readyState)
                        if (200 === this.status) try {
                            var i = this.response || this.responseText,
                                r = new Blob([i], {
                                    type: "application/octet-stream"
                                });
                            let o = t.filename || t.fileName || null;
                            n()(r, o), "function" == typeof e && e({
                                ok: true
                            })
                        } catch (n) {
                            Insta_Utils.gt(t, e)
                        } else if ("function" == typeof e) return e({
                            err: true
                        })
                }, i.send()
            };
        var $ = {
            Fe: "igsd_dl_btn",
            _onClickDownloadStoryButton: function(t) {
                if (w.bulkProcessCanceled = false, $._loaderAtDlButton._on(t.target), b.be(), r.dt()) {
                    let n = location.pathname.match(new RegExp("stories\\/highlights\\/([^/]+)"));
                    if (n = n && n[1], n) {
                        let e = "highlight:" + n;
                        return b.ge(e)
                            .then((function(n) {
                                if (!n) return;
                                $._loaderAtDlButton._off(t.target), b.be();
                                let e = r.Mt();
                                if (!n[e]) return;
                                let i = {
                                    url: n[e].url,
                                    filename: `${n[e].userName}_${n[e].id}.${n[e].fileExt}`
                                };
                                $._mediaInfoCallback(i, t.target)
                            }))
                    }
                }
                let n = location.pathname.match(/stories\/([^\/]+)/);
                n = n && n[1], n ? b.$e(n, (function(n) {
                    if (!n || !n.length) return;
                    $._loaderAtDlButton._off(t.target), b.be();
                    let e = n[r.Mt()];
                    $._mediaInfoCallback(e, t.target)
                })) : $._loaderAtDlButton._off(t.target)
            },
            _onClickBulkDownloadStoryButton: function(t) {
                r.kt("checkBulkDownloadNow", (function(n) {
                    if (n) return (new _)
                        .showMessage(chrome.i18n.getMessage("synchronous_bulk_download_denied"));
                    function e(n, e) {
                        n && n.length ? ($._loaderAtDlButton._off(t.target), b.be(), p.qn({
                            files: n,
                            filename_prefix: e
                        }, (function() {
                            w.Wn = false
                        }))) : w.Wn = false
                    }
                    if (w.Wn = true, w.bulkProcessCanceled = false, $._loaderAtDlButton._on(t.target), b.be(), r.dt()) {
                        let t = location.pathname.match(new RegExp("stories\\/highlights\\/([^/]+)"));
                        if (t = t && t[1], t) {
                            let n = "highlight:" + t;
                            return void chrome.runtime.sendMessage({
                                action: "requestHighlights",
                                reel_ids: n
                            }, (function(t) {
                                if (t && t.error || !t.reels || !t.reels[n] || !t.reels[n].items) return void(w.Wn = false);
                                let i = t.reels[n].user && t.reels[n].user.username;
                                e(b.we(t.reels[n].items, t.reels[n].user), i)
                            }))
                        }
                    }
                    let i = location.pathname.match(/stories\/([^\/]+)/);
                    i = i && i[1], i ? b.$e(i, e) : w.Wn = false
                }))
            },
            _onClickDownloadSingleButton: function(t) {
                let n = t.target;
                n = "div" === n.nodeName.toLowerCase() ? n : n.parentElement, "div" === n.nodeName.toLowerCase() && ($._loaderAtDlButton._on(n), $._getSinglePostDirectLink(n, (function(t) {
                    t.hasAlt = true, $._mediaInfoCallback.call($, t, n)
                })))
            },
            _mediaInfoCallback: function(t, n) {
                let e = this;
                t && t.error && !t.hasAlt && (t = e._getMediaInfoFromDomElement(n)), g(t, (function(i) {
                    return i.err && t.hasAlt ? e._altDownloadByShortcode(t, n) : (e._loaderAtDlButton._off(n), i.err ? e._showDownloadError(n) : void m.Fn())
                }))
            },
            _findJsonWithPostData: function(t, n) {
                let e;
                for (e in t) {
                    if (!t.hasOwnProperty(e)) continue;
                    if (!t[e] || "object" != typeof t[e]) continue;
                    if (t[e].items && t[e] && t[e].items && 1 === t[e].items.length && t[e].items[0].code === n) return {
                        items: t[e].items
                    };
                    let i = this._findJsonWithPostData(t[e], n);
                    if (i) return i
                }
                return null
            },
            _altDownloadByShortcode: function(t, n) {
                let e = this;
                chrome.runtime.sendMessage({
                    action: "requestHtmlByShortcode",
                    shortcode: t.shortcode
                }, (i => {
                    t.hasAlt = false;
                    const o = r.Ot(i, new RegExp(t.shortcode));
                    for (let i of o) {
                        i = e._findJsonWithPostData(i, t.shortcode);
                        let o = i && i.items && i.items[0] || null;
                        if (o && (o.video_versions = o.video_versions && o.video_versions.sort(r.Ft) || null, o && o.video_versions.length && (t.url = o.video_versions[0].url || null, t.url))) return e._mediaInfoCallback(t, n)
                    }
                }))
            },
            _showDownloadError: function(t) {
                if (!t) return;
                let n = t.parentNode,
                    e = document.createElement("div");
                e.innerHTML = '<div class="error_dl_msg_desktop">' + chrome.i18n.getMessage("error_dl_msg") + "</div>", n.append(e.firstElementChild), setTimeout((function() {
                    let t = document.querySelector(".error_dl_msg_desktop");
                    t && t.remove()
                }), 2e3)
            },
            _loaderAtDlButton: {
                _on: function(t) {
                    let n = t.querySelector(".igsd_icon") || t.parentNode.querySelector(".igsd_icon");
                    n && n.classList.add("igsd_loader")
                },
                _off: function(t) {
                    let n = t.querySelector(".igsd_loader") || t.parentNode.querySelector(".igsd_loader");
                    n && n.classList.contains("igsd_loader") && n.classList.remove("igsd_loader")
                }
            },
            _getUserName: function(t, n) {
                let e;
                if (n || r.Y()) {
                    let n = t.closest("article") || t.closest('div[role*="button"]');
                    if (n) {
                        let t = n.querySelector("header > div + div a");
                        e = t && t.getAttribute("href"), e = e && e.replace(/\//g, "")
                    }
                } else {
                    if (!r.ut() || !t) return document.querySelector("._aacl ._aacs ._aact ._aacx ._aada")
                        .innerText;
                    {
                        let n = t.getAttribute("alt");
                        n && (n = n.substr(0, 50), e = n)
                    }
                }
                return e
            },
            _getSinglePostDirectLink: function(t, n) {
                let e = t.closest("article") || t.closest('div[role*="button"]'),
                    i = {
                        shortcode: t.dataset.shortcode,
                        is_carousel: t.dataset.carousel,
                        carousel_position: t.dataset.carousel ? r.At(e) : undefined
                    };
                "reels" === i.shortcode && (i.shortcode = r.J()), h.jn(i, (function(t) {
                    return t.shortcode = i.shortcode, t.isCarousel = i.is_carousel, n(t)
                }))
            },
            _getMediaInfoFromDomElement: function(t) {
                let n, e, i, o = $._getUserName(t, true),
                    s = r.Ut(t.parentNode);
                return s ? (n = r.Rt(s), i = n.videoWidth, e = n.videoHeight) : (s = r.Nt(t.parentNode), s && (n = r.Tt(s), i = n.naturalWidth, e = n.naturalHeight)), r.wt(n) ? {
                    url: n,
                    filename: r.vt(n, o),
                    dimensions: {
                        width: i,
                        height: e
                    }
                } : null
            },
            _addDlBtnEl: function(t, n) {
                let e = document.createElement("div");
                e.innerHTML = `\n\t\t\t<div class="${this.Fe}" data-shortcode="${t.shortcode}">\n\t\t\t\t<span class="igsd_dl_pregress_loader"></span>\n\t\t\t\t<span class="igsd_icon"></span>\n\t\t\t\t<span class="igsd_text">${chrome.i18n.getMessage("download")}</span>\n\t\t\t</div>`, t.isCarousel && e.firstElementChild.setAttribute("data-carousel", "1"), n.append(e.firstElementChild)
            },
            _addElementsToPost: function(t, n, e = null) {
                if (t.getElementsByClassName($.Fe)
                    .length) return;
                let i, o = e,
                    s = false;
                if (1 === n ? (i = t, t = (t = Array.from(t.querySelectorAll("img, video"))
                        .filter((function(t) {
                            return "img" !== t.nodeName.toLowerCase() || t.width > 200 && t.height > 200
                        })))[0].parentElement.parentElement.parentElement.parentElement) : 2 === n || 5 === n || 6 === n ? i = t : 3 === n ? i = t.querySelector(".EmbeddedMedia") : 4 === n ? (i = t, t = t.querySelector('div[role*="presentation"]')
                        .parentElement || t, s = true) : 7 === n && (o = "reels"), !i && 7 !== n) return;
                if (!o) try {
                    o = r.V(i)
                } catch (t) {}
                if (!o) return;
                let a = {
                    shortcode: o,
                    page_type: n,
                    isCarousel: s
                };
                6 === n && (t.style.position = "relative"), this._addDlBtnEl(a, t), t.dataset.ig_sd_marked = "1"
            },
            _observerDocumentStart: function() {
                function t() {
                    var t;
                    (t = ["article img:not([data-ig_sd_marked])", "article video:not([data-ig_sd_marked])", 'div[role*="button"] video:not([data-ig_sd_marked])', 'div[role*="button"] img:not([data-ig_sd_marked])'], document.querySelectorAll(t.join(",")))
                    .forEach((function(t) {
                        if ("IMG" === t.tagName && (t.width < 300 || t.height < 300)) return;
                        t.dataset.ig_sd_marked = "1", t.parentElement.dataset.ig_sd_marked = "1";
                        let n = t.closest("article");
                        n || (n = t.closest('div[role*="presentation"]'), n = n && n.closest("div[role=button]") || t.closest('div[role*="button"]') || null);
                        let e = r.J();
                        t.innerWidth < 400 && t.innerHeight < 400 && t.closest("a[href]") ? $._addElementsToPost(t.closest("a[href]")
                            .parentNode, 2, e) : n && r.xt(n) ? $._addElementsToPost(n, 4, e) : n && $._addElementsToPost(n, 1, e)
                    }))
                }
                function n() {
                    r.et() && !(r.rt() || r.ut() || r.ot()) && document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')
                        .length > 1 ? w.re() : w.se(), r.ct() ? function() {
                            let t = r.zt();
                            t && (!t.dataset.ig_sd_marked && r.qt() && (t.dataset.ig_sd_marked = "1", b.ke(t)), b.Se())
                        }() : (t(), document.querySelectorAll('a[href*="/p/"]')
                            .forEach((function(t) {
                                if (t.parentElement.dataset.ig_sd_marked) return;
                                let n = t.querySelector("img");
                                if (!n || !(n.width > 250 && n.height > 250)) return;
                                let e = r.Ct(t.parentNode) ? 5 : 2;
                                $._addElementsToPost(t.parentNode, e)
                            })), document.querySelectorAll('a[href*="/reel/"]:not([ig_sd_marked])')
                            .forEach((function(t) {
                                t.parentElement.ig_sd_marked || $._addElementsToPost(t.parentNode, 5)
                            })), document.querySelectorAll("video")
                            .forEach((function(t) {
                                if (t.parentElement.dataset.ig_sd_marked) return;
                                let n;
                                n = r.it() ? 7 : r.Ct(t.parentNode) ? 5 : 2, $._addElementsToPost(t.parentNode, n)
                            })))
                }
                r._t() ? document.querySelectorAll(".Embed > .Header + div")
                    .forEach((function(t) {
                        if (t.dataset.ig_sd_marked) return false;
                        $._addElementsToPost(t, 3)
                    })) : (n(), setInterval((function() {
                        n()
                    }), 1e3))
            },
            _messagesListenerInit: function() {
                chrome.runtime.onMessage.addListener((function(t, n, e) {
                    if (!t) return false;
                    "handshake" === t ? e(true) : "isBulkDownloadNowInTab" === t ? e(w.Wn) : "setDownloadingStatus" === t.action ? w.Wn = t.options.status : t.action
                }))
            },
            _userListenerInit: function() {
                let t = Date.now(),
                    n = function(n) {
                        n.preventDefault(), n.stopPropagation();
                        let e = Date.now();
                        return t + 500 > e || (t = e, false)
                    };
                document.body.addEventListener("click", (function(t) {
                    if (t.target.classList.contains(`${$.Fe}`) || t.target.parentElement && t.target.parentElement.classList.contains($.Fe)) {
                        if (n(t)) return;
                        $._onClickDownloadSingleButton.call(this, t)
                    }
                    if (!$.isiFrame)
                        if (t.target.classList.contains("igsd_ns_dl_btn") || t.target.parentElement.classList.contains("igsd_ns_dl_btn")) {
                            if (n(t)) return;
                            $._onClickDownloadStoryButton.call(this, t)
                        } else if (t.target.classList.contains("igsd_ns_dl_all_btn") || t.target.parentElement.classList.contains("igsd_ns_dl_all_btn")) {
                        if (n(t)) return;
                        $._onClickBulkDownloadStoryButton.call(this, t)
                    } else if (t.target.classList.contains("igsd_video_range") || t.target.parentElement.classList.contains("igsd_video_range")) {
                        let t = this.closest("[data-ig_sd_marked]")
                            .querySelector("video");
                        t.pause(), t.currentTime = this.value / 10, t.play()
                    } else if (t.target.classList.contains("igsd_video_play_pause") || t.target.parentElement.classList.contains("igsd_video_play_pause")) {
                        if (n(t)) return;
                        let e = this.closest("[data-ig_sd_marked]")
                            .querySelector("video");
                        this.classList.contains("igsd_paused") ? (this.dataset.playing = "1", e.play()) : this.parentElement.classList.contains("igsd_paused") ? (this.parentElement.dataset.playing = "1", e.play()) : (this.dataset.playing = "0", e.pause())
                    }
                }))
            },
            _connectBg: function() {
                let t = this,
                    n = chrome.runtime.connect(),
                    e = false,
                    i = setTimeout((function() {
                        n && (e = true, n.disconnect()), t._connectBg()
                    }), 295e3);
                n.onDisconnect.addListener((function() {
                    e || (clearTimeout(i), t._connectBg())
                }))
            },
            run: function() {
                r.q(), this._connectBg(), this._observerDocumentStart(), this._messagesListenerInit(), this._userListenerInit(), l.nn()
            }
        };
        $.run()
    })()
})();
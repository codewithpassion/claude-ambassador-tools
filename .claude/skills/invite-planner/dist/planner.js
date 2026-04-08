#!/usr/bin/env node
import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/cli-table3/src/debug.js
var require_debug = __commonJS((exports, module) => {
  var messages = [];
  var level = 0;
  var debug = (msg, min) => {
    if (level >= min) {
      messages.push(msg);
    }
  };
  debug.WARN = 1;
  debug.INFO = 2;
  debug.DEBUG = 3;
  debug.reset = () => {
    messages = [];
  };
  debug.setDebugLevel = (v) => {
    level = v;
  };
  debug.warn = (msg) => debug(msg, debug.WARN);
  debug.info = (msg) => debug(msg, debug.INFO);
  debug.debug = (msg) => debug(msg, debug.DEBUG);
  debug.debugMessages = () => messages;
  module.exports = debug;
});

// node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS((exports, module) => {
  module.exports = ({ onlyFirst = false } = {}) => {
    const pattern = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
    ].join("|");
    return new RegExp(pattern, onlyFirst ? undefined : "g");
  };
});

// node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS((exports, module) => {
  var ansiRegex = require_ansi_regex();
  module.exports = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
});

// node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point = __commonJS((exports, module) => {
  var isFullwidthCodePoint = (codePoint) => {
    if (Number.isNaN(codePoint)) {
      return false;
    }
    if (codePoint >= 4352 && (codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || 11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || 12880 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65131 || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 262141)) {
      return true;
    }
    return false;
  };
  module.exports = isFullwidthCodePoint;
  module.exports.default = isFullwidthCodePoint;
});

// node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS((exports, module) => {
  module.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});

// node_modules/string-width/index.js
var require_string_width = __commonJS((exports, module) => {
  var stripAnsi = require_strip_ansi();
  var isFullwidthCodePoint = require_is_fullwidth_code_point();
  var emojiRegex = require_emoji_regex();
  var stringWidth = (string) => {
    if (typeof string !== "string" || string.length === 0) {
      return 0;
    }
    string = stripAnsi(string);
    if (string.length === 0) {
      return 0;
    }
    string = string.replace(emojiRegex(), "  ");
    let width = 0;
    for (let i = 0;i < string.length; i++) {
      const code = string.codePointAt(i);
      if (code <= 31 || code >= 127 && code <= 159) {
        continue;
      }
      if (code >= 768 && code <= 879) {
        continue;
      }
      if (code > 65535) {
        i++;
      }
      width += isFullwidthCodePoint(code) ? 2 : 1;
    }
    return width;
  };
  module.exports = stringWidth;
  module.exports.default = stringWidth;
});

// node_modules/cli-table3/src/utils.js
var require_utils = __commonJS((exports, module) => {
  var stringWidth = require_string_width();
  function codeRegex(capture) {
    return capture ? /\u001b\[((?:\d*;){0,5}\d*)m/g : /\u001b\[(?:\d*;){0,5}\d*m/g;
  }
  function strlen(str) {
    let code = codeRegex();
    let stripped = ("" + str).replace(code, "");
    let split = stripped.split(`
`);
    return split.reduce(function(memo, s) {
      return stringWidth(s) > memo ? stringWidth(s) : memo;
    }, 0);
  }
  function repeat(str, times) {
    return Array(times + 1).join(str);
  }
  function pad(str, len, pad2, dir) {
    let length = strlen(str);
    if (len + 1 >= length) {
      let padlen = len - length;
      switch (dir) {
        case "right": {
          str = repeat(pad2, padlen) + str;
          break;
        }
        case "center": {
          let right = Math.ceil(padlen / 2);
          let left = padlen - right;
          str = repeat(pad2, left) + str + repeat(pad2, right);
          break;
        }
        default: {
          str = str + repeat(pad2, padlen);
          break;
        }
      }
    }
    return str;
  }
  var codeCache = {};
  function addToCodeCache(name, on, off) {
    on = "\x1B[" + on + "m";
    off = "\x1B[" + off + "m";
    codeCache[on] = { set: name, to: true };
    codeCache[off] = { set: name, to: false };
    codeCache[name] = { on, off };
  }
  addToCodeCache("bold", 1, 22);
  addToCodeCache("italics", 3, 23);
  addToCodeCache("underline", 4, 24);
  addToCodeCache("inverse", 7, 27);
  addToCodeCache("strikethrough", 9, 29);
  function updateState(state, controlChars) {
    let controlCode = controlChars[1] ? parseInt(controlChars[1].split(";")[0]) : 0;
    if (controlCode >= 30 && controlCode <= 39 || controlCode >= 90 && controlCode <= 97) {
      state.lastForegroundAdded = controlChars[0];
      return;
    }
    if (controlCode >= 40 && controlCode <= 49 || controlCode >= 100 && controlCode <= 107) {
      state.lastBackgroundAdded = controlChars[0];
      return;
    }
    if (controlCode === 0) {
      for (let i in state) {
        if (Object.prototype.hasOwnProperty.call(state, i)) {
          delete state[i];
        }
      }
      return;
    }
    let info = codeCache[controlChars[0]];
    if (info) {
      state[info.set] = info.to;
    }
  }
  function readState(line) {
    let code = codeRegex(true);
    let controlChars = code.exec(line);
    let state = {};
    while (controlChars !== null) {
      updateState(state, controlChars);
      controlChars = code.exec(line);
    }
    return state;
  }
  function unwindState(state, ret) {
    let lastBackgroundAdded = state.lastBackgroundAdded;
    let lastForegroundAdded = state.lastForegroundAdded;
    delete state.lastBackgroundAdded;
    delete state.lastForegroundAdded;
    Object.keys(state).forEach(function(key) {
      if (state[key]) {
        ret += codeCache[key].off;
      }
    });
    if (lastBackgroundAdded && lastBackgroundAdded != "\x1B[49m") {
      ret += "\x1B[49m";
    }
    if (lastForegroundAdded && lastForegroundAdded != "\x1B[39m") {
      ret += "\x1B[39m";
    }
    return ret;
  }
  function rewindState(state, ret) {
    let lastBackgroundAdded = state.lastBackgroundAdded;
    let lastForegroundAdded = state.lastForegroundAdded;
    delete state.lastBackgroundAdded;
    delete state.lastForegroundAdded;
    Object.keys(state).forEach(function(key) {
      if (state[key]) {
        ret = codeCache[key].on + ret;
      }
    });
    if (lastBackgroundAdded && lastBackgroundAdded != "\x1B[49m") {
      ret = lastBackgroundAdded + ret;
    }
    if (lastForegroundAdded && lastForegroundAdded != "\x1B[39m") {
      ret = lastForegroundAdded + ret;
    }
    return ret;
  }
  function truncateWidth(str, desiredLength) {
    if (str.length === strlen(str)) {
      return str.substr(0, desiredLength);
    }
    while (strlen(str) > desiredLength) {
      str = str.slice(0, -1);
    }
    return str;
  }
  function truncateWidthWithAnsi(str, desiredLength) {
    let code = codeRegex(true);
    let split = str.split(codeRegex());
    let splitIndex = 0;
    let retLen = 0;
    let ret = "";
    let myArray;
    let state = {};
    while (retLen < desiredLength) {
      myArray = code.exec(str);
      let toAdd = split[splitIndex];
      splitIndex++;
      if (retLen + strlen(toAdd) > desiredLength) {
        toAdd = truncateWidth(toAdd, desiredLength - retLen);
      }
      ret += toAdd;
      retLen += strlen(toAdd);
      if (retLen < desiredLength) {
        if (!myArray) {
          break;
        }
        ret += myArray[0];
        updateState(state, myArray);
      }
    }
    return unwindState(state, ret);
  }
  function truncate(str, desiredLength, truncateChar) {
    truncateChar = truncateChar || "…";
    let lengthOfStr = strlen(str);
    if (lengthOfStr <= desiredLength) {
      return str;
    }
    desiredLength -= strlen(truncateChar);
    let ret = truncateWidthWithAnsi(str, desiredLength);
    ret += truncateChar;
    const hrefTag = "\x1B]8;;\x07";
    if (str.includes(hrefTag) && !ret.includes(hrefTag)) {
      ret += hrefTag;
    }
    return ret;
  }
  function defaultOptions() {
    return {
      chars: {
        top: "─",
        "top-mid": "┬",
        "top-left": "┌",
        "top-right": "┐",
        bottom: "─",
        "bottom-mid": "┴",
        "bottom-left": "└",
        "bottom-right": "┘",
        left: "│",
        "left-mid": "├",
        mid: "─",
        "mid-mid": "┼",
        right: "│",
        "right-mid": "┤",
        middle: "│"
      },
      truncate: "…",
      colWidths: [],
      rowHeights: [],
      colAligns: [],
      rowAligns: [],
      style: {
        "padding-left": 1,
        "padding-right": 1,
        head: ["red"],
        border: ["grey"],
        compact: false
      },
      head: []
    };
  }
  function mergeOptions(options, defaults) {
    options = options || {};
    defaults = defaults || defaultOptions();
    let ret = Object.assign({}, defaults, options);
    ret.chars = Object.assign({}, defaults.chars, options.chars);
    ret.style = Object.assign({}, defaults.style, options.style);
    return ret;
  }
  function wordWrap(maxLength, input) {
    let lines = [];
    let split = input.split(/(\s+)/g);
    let line = [];
    let lineLength = 0;
    let whitespace;
    for (let i = 0;i < split.length; i += 2) {
      let word = split[i];
      let newLength = lineLength + strlen(word);
      if (lineLength > 0 && whitespace) {
        newLength += whitespace.length;
      }
      if (newLength > maxLength) {
        if (lineLength !== 0) {
          lines.push(line.join(""));
        }
        line = [word];
        lineLength = strlen(word);
      } else {
        line.push(whitespace || "", word);
        lineLength = newLength;
      }
      whitespace = split[i + 1];
    }
    if (lineLength) {
      lines.push(line.join(""));
    }
    return lines;
  }
  function textWrap(maxLength, input) {
    let lines = [];
    let line = "";
    function pushLine(str, ws) {
      if (line.length && ws)
        line += ws;
      line += str;
      while (line.length > maxLength) {
        lines.push(line.slice(0, maxLength));
        line = line.slice(maxLength);
      }
    }
    let split = input.split(/(\s+)/g);
    for (let i = 0;i < split.length; i += 2) {
      pushLine(split[i], i && split[i - 1]);
    }
    if (line.length)
      lines.push(line);
    return lines;
  }
  function multiLineWordWrap(maxLength, input, wrapOnWordBoundary = true) {
    let output = [];
    input = input.split(`
`);
    const handler = wrapOnWordBoundary ? wordWrap : textWrap;
    for (let i = 0;i < input.length; i++) {
      output.push.apply(output, handler(maxLength, input[i]));
    }
    return output;
  }
  function colorizeLines(input) {
    let state = {};
    let output = [];
    for (let i = 0;i < input.length; i++) {
      let line = rewindState(state, input[i]);
      state = readState(line);
      let temp = Object.assign({}, state);
      output.push(unwindState(temp, line));
    }
    return output;
  }
  function hyperlink(url, text) {
    const OSC = "\x1B]";
    const BEL = "\x07";
    const SEP = ";";
    return [OSC, "8", SEP, SEP, url || text, BEL, text, OSC, "8", SEP, SEP, BEL].join("");
  }
  module.exports = {
    strlen,
    repeat,
    pad,
    truncate,
    mergeOptions,
    wordWrap: multiLineWordWrap,
    colorizeLines,
    hyperlink
  };
});

// node_modules/@colors/colors/lib/styles.js
var require_styles = __commonJS((exports, module) => {
  var styles3 = {};
  module["exports"] = styles3;
  var codes = {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
    grey: [90, 39],
    brightRed: [91, 39],
    brightGreen: [92, 39],
    brightYellow: [93, 39],
    brightBlue: [94, 39],
    brightMagenta: [95, 39],
    brightCyan: [96, 39],
    brightWhite: [97, 39],
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgBrightRed: [101, 49],
    bgBrightGreen: [102, 49],
    bgBrightYellow: [103, 49],
    bgBrightBlue: [104, 49],
    bgBrightMagenta: [105, 49],
    bgBrightCyan: [106, 49],
    bgBrightWhite: [107, 49],
    blackBG: [40, 49],
    redBG: [41, 49],
    greenBG: [42, 49],
    yellowBG: [43, 49],
    blueBG: [44, 49],
    magentaBG: [45, 49],
    cyanBG: [46, 49],
    whiteBG: [47, 49]
  };
  Object.keys(codes).forEach(function(key) {
    var val = codes[key];
    var style = styles3[key] = [];
    style.open = "\x1B[" + val[0] + "m";
    style.close = "\x1B[" + val[1] + "m";
  });
});

// node_modules/@colors/colors/lib/system/has-flag.js
var require_has_flag = __commonJS((exports, module) => {
  module.exports = function(flag, argv) {
    argv = argv || process.argv;
    var terminatorPos = argv.indexOf("--");
    var prefix = /^-{1,2}/.test(flag) ? "" : "--";
    var pos = argv.indexOf(prefix + flag);
    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
  };
});

// node_modules/@colors/colors/lib/system/supports-colors.js
var require_supports_colors = __commonJS((exports, module) => {
  var os2 = __require("os");
  var hasFlag2 = require_has_flag();
  var env2 = process.env;
  var forceColor = undefined;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false")) {
    forceColor = false;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = true;
  }
  if ("FORCE_COLOR" in env2) {
    forceColor = env2.FORCE_COLOR.length === 0 || parseInt(env2.FORCE_COLOR, 10) !== 0;
  }
  function translateLevel2(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor2(stream) {
    if (forceColor === false) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (stream && !stream.isTTY && forceColor !== true) {
      return 0;
    }
    var min = forceColor ? 1 : 0;
    if (process.platform === "win32") {
      var osRelease = os2.release().split(".");
      if (Number(process.versions.node.split(".")[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env2) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(function(sign) {
        return sign in env2;
      }) || env2.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env2) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
    }
    if ("TERM_PROGRAM" in env2) {
      var version = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env2.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Hyper":
          return 3;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env2.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env2) {
      return 1;
    }
    if (env2.TERM === "dumb") {
      return min;
    }
    return min;
  }
  function getSupportLevel(stream) {
    var level = supportsColor2(stream);
    return translateLevel2(level);
  }
  module.exports = {
    supportsColor: getSupportLevel,
    stdout: getSupportLevel(process.stdout),
    stderr: getSupportLevel(process.stderr)
  };
});

// node_modules/@colors/colors/lib/custom/trap.js
var require_trap = __commonJS((exports, module) => {
  module["exports"] = function runTheTrap(text, options) {
    var result = "";
    text = text || "Run the trap, drop the bass";
    text = text.split("");
    var trap = {
      a: ["@", "Ą", "Ⱥ", "Ʌ", "Δ", "Λ", "Д"],
      b: ["ß", "Ɓ", "Ƀ", "ɮ", "β", "฿"],
      c: ["©", "Ȼ", "Ͼ"],
      d: ["Ð", "Ɗ", "Ԁ", "ԁ", "Ԃ", "ԃ"],
      e: [
        "Ë",
        "ĕ",
        "Ǝ",
        "ɘ",
        "Σ",
        "ξ",
        "Ҽ",
        "੬"
      ],
      f: ["Ӻ"],
      g: ["ɢ"],
      h: ["Ħ", "ƕ", "Ң", "Һ", "Ӈ", "Ԋ"],
      i: ["༏"],
      j: ["Ĵ"],
      k: ["ĸ", "Ҡ", "Ӄ", "Ԟ"],
      l: ["Ĺ"],
      m: ["ʍ", "Ӎ", "ӎ", "Ԡ", "ԡ", "൩"],
      n: ["Ñ", "ŋ", "Ɲ", "Ͷ", "Π", "Ҋ"],
      o: [
        "Ø",
        "õ",
        "ø",
        "Ǿ",
        "ʘ",
        "Ѻ",
        "ם",
        "۝",
        "๏"
      ],
      p: ["Ƿ", "Ҏ"],
      q: ["্"],
      r: ["®", "Ʀ", "Ȑ", "Ɍ", "ʀ", "Я"],
      s: ["§", "Ϟ", "ϟ", "Ϩ"],
      t: ["Ł", "Ŧ", "ͳ"],
      u: ["Ʊ", "Ս"],
      v: ["ט"],
      w: ["Ш", "Ѡ", "Ѽ", "൰"],
      x: ["Ҳ", "Ӿ", "Ӽ", "ӽ"],
      y: ["¥", "Ұ", "Ӌ"],
      z: ["Ƶ", "ɀ"]
    };
    text.forEach(function(c) {
      c = c.toLowerCase();
      var chars = trap[c] || [" "];
      var rand = Math.floor(Math.random() * chars.length);
      if (typeof trap[c] !== "undefined") {
        result += trap[c][rand];
      } else {
        result += c;
      }
    });
    return result;
  };
});

// node_modules/@colors/colors/lib/custom/zalgo.js
var require_zalgo = __commonJS((exports, module) => {
  module["exports"] = function zalgo(text, options) {
    text = text || "   he is here   ";
    var soul = {
      up: [
        "̍",
        "̎",
        "̄",
        "̅",
        "̿",
        "̑",
        "̆",
        "̐",
        "͒",
        "͗",
        "͑",
        "̇",
        "̈",
        "̊",
        "͂",
        "̓",
        "̈",
        "͊",
        "͋",
        "͌",
        "̃",
        "̂",
        "̌",
        "͐",
        "̀",
        "́",
        "̋",
        "̏",
        "̒",
        "̓",
        "̔",
        "̽",
        "̉",
        "ͣ",
        "ͤ",
        "ͥ",
        "ͦ",
        "ͧ",
        "ͨ",
        "ͩ",
        "ͪ",
        "ͫ",
        "ͬ",
        "ͭ",
        "ͮ",
        "ͯ",
        "̾",
        "͛",
        "͆",
        "̚"
      ],
      down: [
        "̖",
        "̗",
        "̘",
        "̙",
        "̜",
        "̝",
        "̞",
        "̟",
        "̠",
        "̤",
        "̥",
        "̦",
        "̩",
        "̪",
        "̫",
        "̬",
        "̭",
        "̮",
        "̯",
        "̰",
        "̱",
        "̲",
        "̳",
        "̹",
        "̺",
        "̻",
        "̼",
        "ͅ",
        "͇",
        "͈",
        "͉",
        "͍",
        "͎",
        "͓",
        "͔",
        "͕",
        "͖",
        "͙",
        "͚",
        "̣"
      ],
      mid: [
        "̕",
        "̛",
        "̀",
        "́",
        "͘",
        "̡",
        "̢",
        "̧",
        "̨",
        "̴",
        "̵",
        "̶",
        "͜",
        "͝",
        "͞",
        "͟",
        "͠",
        "͢",
        "̸",
        "̷",
        "͡",
        " ҉"
      ]
    };
    var all = [].concat(soul.up, soul.down, soul.mid);
    function randomNumber(range) {
      var r = Math.floor(Math.random() * range);
      return r;
    }
    function isChar(character) {
      var bool = false;
      all.filter(function(i) {
        bool = i === character;
      });
      return bool;
    }
    function heComes(text2, options2) {
      var result = "";
      var counts;
      var l;
      options2 = options2 || {};
      options2["up"] = typeof options2["up"] !== "undefined" ? options2["up"] : true;
      options2["mid"] = typeof options2["mid"] !== "undefined" ? options2["mid"] : true;
      options2["down"] = typeof options2["down"] !== "undefined" ? options2["down"] : true;
      options2["size"] = typeof options2["size"] !== "undefined" ? options2["size"] : "maxi";
      text2 = text2.split("");
      for (l in text2) {
        if (isChar(l)) {
          continue;
        }
        result = result + text2[l];
        counts = { up: 0, down: 0, mid: 0 };
        switch (options2.size) {
          case "mini":
            counts.up = randomNumber(8);
            counts.mid = randomNumber(2);
            counts.down = randomNumber(8);
            break;
          case "maxi":
            counts.up = randomNumber(16) + 3;
            counts.mid = randomNumber(4) + 1;
            counts.down = randomNumber(64) + 3;
            break;
          default:
            counts.up = randomNumber(8) + 1;
            counts.mid = randomNumber(6) / 2;
            counts.down = randomNumber(8) + 1;
            break;
        }
        var arr = ["up", "mid", "down"];
        for (var d in arr) {
          var index = arr[d];
          for (var i = 0;i <= counts[index]; i++) {
            if (options2[index]) {
              result = result + soul[index][randomNumber(soul[index].length)];
            }
          }
        }
      }
      return result;
    }
    return heComes(text, options);
  };
});

// node_modules/@colors/colors/lib/maps/america.js
var require_america = __commonJS((exports, module) => {
  module["exports"] = function(colors) {
    return function(letter, i, exploded) {
      if (letter === " ")
        return letter;
      switch (i % 3) {
        case 0:
          return colors.red(letter);
        case 1:
          return colors.white(letter);
        case 2:
          return colors.blue(letter);
      }
    };
  };
});

// node_modules/@colors/colors/lib/maps/zebra.js
var require_zebra = __commonJS((exports, module) => {
  module["exports"] = function(colors) {
    return function(letter, i, exploded) {
      return i % 2 === 0 ? letter : colors.inverse(letter);
    };
  };
});

// node_modules/@colors/colors/lib/maps/rainbow.js
var require_rainbow = __commonJS((exports, module) => {
  module["exports"] = function(colors) {
    var rainbowColors = ["red", "yellow", "green", "blue", "magenta"];
    return function(letter, i, exploded) {
      if (letter === " ") {
        return letter;
      } else {
        return colors[rainbowColors[i++ % rainbowColors.length]](letter);
      }
    };
  };
});

// node_modules/@colors/colors/lib/maps/random.js
var require_random = __commonJS((exports, module) => {
  module["exports"] = function(colors) {
    var available = [
      "underline",
      "inverse",
      "grey",
      "yellow",
      "red",
      "green",
      "blue",
      "white",
      "cyan",
      "magenta",
      "brightYellow",
      "brightRed",
      "brightGreen",
      "brightBlue",
      "brightWhite",
      "brightCyan",
      "brightMagenta"
    ];
    return function(letter, i, exploded) {
      return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 2))]](letter);
    };
  };
});

// node_modules/@colors/colors/lib/colors.js
var require_colors = __commonJS((exports, module) => {
  var colors = {};
  module["exports"] = colors;
  colors.themes = {};
  var util = __require("util");
  var ansiStyles2 = colors.styles = require_styles();
  var defineProps = Object.defineProperties;
  var newLineRegex = new RegExp(/[\r\n]+/g);
  colors.supportsColor = require_supports_colors().supportsColor;
  if (typeof colors.enabled === "undefined") {
    colors.enabled = colors.supportsColor() !== false;
  }
  colors.enable = function() {
    colors.enabled = true;
  };
  colors.disable = function() {
    colors.enabled = false;
  };
  colors.stripColors = colors.strip = function(str) {
    return ("" + str).replace(/\x1B\[\d+m/g, "");
  };
  var stylize = colors.stylize = function stylize2(str, style) {
    if (!colors.enabled) {
      return str + "";
    }
    var styleMap = ansiStyles2[style];
    if (!styleMap && style in colors) {
      return colors[style](str);
    }
    return styleMap.open + str + styleMap.close;
  };
  var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  var escapeStringRegexp = function(str) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string");
    }
    return str.replace(matchOperatorsRe, "\\$&");
  };
  function build(_styles) {
    var builder = function builder2() {
      return applyStyle2.apply(builder2, arguments);
    };
    builder._styles = _styles;
    builder.__proto__ = proto2;
    return builder;
  }
  var styles3 = function() {
    var ret = {};
    ansiStyles2.grey = ansiStyles2.gray;
    Object.keys(ansiStyles2).forEach(function(key) {
      ansiStyles2[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles2[key].close), "g");
      ret[key] = {
        get: function() {
          return build(this._styles.concat(key));
        }
      };
    });
    return ret;
  }();
  var proto2 = defineProps(function colors2() {}, styles3);
  function applyStyle2() {
    var args = Array.prototype.slice.call(arguments);
    var str = args.map(function(arg) {
      if (arg != null && arg.constructor === String) {
        return arg;
      } else {
        return util.inspect(arg);
      }
    }).join(" ");
    if (!colors.enabled || !str) {
      return str;
    }
    var newLinesPresent = str.indexOf(`
`) != -1;
    var nestedStyles = this._styles;
    var i = nestedStyles.length;
    while (i--) {
      var code = ansiStyles2[nestedStyles[i]];
      str = code.open + str.replace(code.closeRe, code.open) + code.close;
      if (newLinesPresent) {
        str = str.replace(newLineRegex, function(match) {
          return code.close + match + code.open;
        });
      }
    }
    return str;
  }
  colors.setTheme = function(theme) {
    if (typeof theme === "string") {
      console.log("colors.setTheme now only accepts an object, not a string.  " + "If you are trying to set a theme from a file, it is now your (the " + "caller's) responsibility to require the file.  The old syntax " + "looked like colors.setTheme(__dirname + " + "'/../themes/generic-logging.js'); The new syntax looks like " + "colors.setTheme(require(__dirname + " + "'/../themes/generic-logging.js'));");
      return;
    }
    for (var style in theme) {
      (function(style2) {
        colors[style2] = function(str) {
          if (typeof theme[style2] === "object") {
            var out = str;
            for (var i in theme[style2]) {
              out = colors[theme[style2][i]](out);
            }
            return out;
          }
          return colors[theme[style2]](str);
        };
      })(style);
    }
  };
  function init() {
    var ret = {};
    Object.keys(styles3).forEach(function(name) {
      ret[name] = {
        get: function() {
          return build([name]);
        }
      };
    });
    return ret;
  }
  var sequencer = function sequencer2(map2, str) {
    var exploded = str.split("");
    exploded = exploded.map(map2);
    return exploded.join("");
  };
  colors.trap = require_trap();
  colors.zalgo = require_zalgo();
  colors.maps = {};
  colors.maps.america = require_america()(colors);
  colors.maps.zebra = require_zebra()(colors);
  colors.maps.rainbow = require_rainbow()(colors);
  colors.maps.random = require_random()(colors);
  for (map in colors.maps) {
    (function(map2) {
      colors[map2] = function(str) {
        return sequencer(colors.maps[map2], str);
      };
    })(map);
  }
  var map;
  defineProps(colors, init());
});

// node_modules/@colors/colors/safe.js
var require_safe = __commonJS((exports, module) => {
  var colors = require_colors();
  module["exports"] = colors;
});

// node_modules/cli-table3/src/cell.js
var require_cell = __commonJS((exports, module) => {
  var { info, debug } = require_debug();
  var utils = require_utils();

  class Cell {
    constructor(options) {
      this.setOptions(options);
      this.x = null;
      this.y = null;
    }
    setOptions(options) {
      if (["boolean", "number", "bigint", "string"].indexOf(typeof options) !== -1) {
        options = { content: "" + options };
      }
      options = options || {};
      this.options = options;
      let content = options.content;
      if (["boolean", "number", "bigint", "string"].indexOf(typeof content) !== -1) {
        this.content = String(content);
      } else if (!content) {
        this.content = this.options.href || "";
      } else {
        throw new Error("Content needs to be a primitive, got: " + typeof content);
      }
      this.colSpan = options.colSpan || 1;
      this.rowSpan = options.rowSpan || 1;
      if (this.options.href) {
        Object.defineProperty(this, "href", {
          get() {
            return this.options.href;
          }
        });
      }
    }
    mergeTableOptions(tableOptions, cells) {
      this.cells = cells;
      let optionsChars = this.options.chars || {};
      let tableChars = tableOptions.chars;
      let chars = this.chars = {};
      CHAR_NAMES.forEach(function(name) {
        setOption(optionsChars, tableChars, name, chars);
      });
      this.truncate = this.options.truncate || tableOptions.truncate;
      let style = this.options.style = this.options.style || {};
      let tableStyle = tableOptions.style;
      setOption(style, tableStyle, "padding-left", this);
      setOption(style, tableStyle, "padding-right", this);
      this.head = style.head || tableStyle.head;
      this.border = style.border || tableStyle.border;
      this.fixedWidth = tableOptions.colWidths[this.x];
      this.lines = this.computeLines(tableOptions);
      this.desiredWidth = utils.strlen(this.content) + this.paddingLeft + this.paddingRight;
      this.desiredHeight = this.lines.length;
    }
    computeLines(tableOptions) {
      const tableWordWrap = tableOptions.wordWrap || tableOptions.textWrap;
      const { wordWrap = tableWordWrap } = this.options;
      if (this.fixedWidth && wordWrap) {
        this.fixedWidth -= this.paddingLeft + this.paddingRight;
        if (this.colSpan) {
          let i = 1;
          while (i < this.colSpan) {
            this.fixedWidth += tableOptions.colWidths[this.x + i];
            i++;
          }
        }
        const { wrapOnWordBoundary: tableWrapOnWordBoundary = true } = tableOptions;
        const { wrapOnWordBoundary = tableWrapOnWordBoundary } = this.options;
        return this.wrapLines(utils.wordWrap(this.fixedWidth, this.content, wrapOnWordBoundary));
      }
      return this.wrapLines(this.content.split(`
`));
    }
    wrapLines(computedLines) {
      const lines = utils.colorizeLines(computedLines);
      if (this.href) {
        return lines.map((line) => utils.hyperlink(this.href, line));
      }
      return lines;
    }
    init(tableOptions) {
      let x = this.x;
      let y = this.y;
      this.widths = tableOptions.colWidths.slice(x, x + this.colSpan);
      this.heights = tableOptions.rowHeights.slice(y, y + this.rowSpan);
      this.width = this.widths.reduce(sumPlusOne, -1);
      this.height = this.heights.reduce(sumPlusOne, -1);
      this.hAlign = this.options.hAlign || tableOptions.colAligns[x];
      this.vAlign = this.options.vAlign || tableOptions.rowAligns[y];
      this.drawRight = x + this.colSpan == tableOptions.colWidths.length;
    }
    draw(lineNum, spanningCell) {
      if (lineNum == "top")
        return this.drawTop(this.drawRight);
      if (lineNum == "bottom")
        return this.drawBottom(this.drawRight);
      let content = utils.truncate(this.content, 10, this.truncate);
      if (!lineNum) {
        info(`${this.y}-${this.x}: ${this.rowSpan - lineNum}x${this.colSpan} Cell ${content}`);
      } else {}
      let padLen = Math.max(this.height - this.lines.length, 0);
      let padTop;
      switch (this.vAlign) {
        case "center":
          padTop = Math.ceil(padLen / 2);
          break;
        case "bottom":
          padTop = padLen;
          break;
        default:
          padTop = 0;
      }
      if (lineNum < padTop || lineNum >= padTop + this.lines.length) {
        return this.drawEmpty(this.drawRight, spanningCell);
      }
      let forceTruncation = this.lines.length > this.height && lineNum + 1 >= this.height;
      return this.drawLine(lineNum - padTop, this.drawRight, forceTruncation, spanningCell);
    }
    drawTop(drawRight) {
      let content = [];
      if (this.cells) {
        this.widths.forEach(function(width, index) {
          content.push(this._topLeftChar(index));
          content.push(utils.repeat(this.chars[this.y == 0 ? "top" : "mid"], width));
        }, this);
      } else {
        content.push(this._topLeftChar(0));
        content.push(utils.repeat(this.chars[this.y == 0 ? "top" : "mid"], this.width));
      }
      if (drawRight) {
        content.push(this.chars[this.y == 0 ? "topRight" : "rightMid"]);
      }
      return this.wrapWithStyleColors("border", content.join(""));
    }
    _topLeftChar(offset) {
      let x = this.x + offset;
      let leftChar;
      if (this.y == 0) {
        leftChar = x == 0 ? "topLeft" : offset == 0 ? "topMid" : "top";
      } else {
        if (x == 0) {
          leftChar = "leftMid";
        } else {
          leftChar = offset == 0 ? "midMid" : "bottomMid";
          if (this.cells) {
            let spanAbove = this.cells[this.y - 1][x] instanceof Cell.ColSpanCell;
            if (spanAbove) {
              leftChar = offset == 0 ? "topMid" : "mid";
            }
            if (offset == 0) {
              let i = 1;
              while (this.cells[this.y][x - i] instanceof Cell.ColSpanCell) {
                i++;
              }
              if (this.cells[this.y][x - i] instanceof Cell.RowSpanCell) {
                leftChar = "leftMid";
              }
            }
          }
        }
      }
      return this.chars[leftChar];
    }
    wrapWithStyleColors(styleProperty, content) {
      if (this[styleProperty] && this[styleProperty].length) {
        try {
          let colors = require_safe();
          for (let i = this[styleProperty].length - 1;i >= 0; i--) {
            colors = colors[this[styleProperty][i]];
          }
          return colors(content);
        } catch (e) {
          return content;
        }
      } else {
        return content;
      }
    }
    drawLine(lineNum, drawRight, forceTruncationSymbol, spanningCell) {
      let left = this.chars[this.x == 0 ? "left" : "middle"];
      if (this.x && spanningCell && this.cells) {
        let cellLeft = this.cells[this.y + spanningCell][this.x - 1];
        while (cellLeft instanceof ColSpanCell) {
          cellLeft = this.cells[cellLeft.y][cellLeft.x - 1];
        }
        if (!(cellLeft instanceof RowSpanCell)) {
          left = this.chars["rightMid"];
        }
      }
      let leftPadding = utils.repeat(" ", this.paddingLeft);
      let right = drawRight ? this.chars["right"] : "";
      let rightPadding = utils.repeat(" ", this.paddingRight);
      let line = this.lines[lineNum];
      let len = this.width - (this.paddingLeft + this.paddingRight);
      if (forceTruncationSymbol)
        line += this.truncate || "…";
      let content = utils.truncate(line, len, this.truncate);
      content = utils.pad(content, len, " ", this.hAlign);
      content = leftPadding + content + rightPadding;
      return this.stylizeLine(left, content, right);
    }
    stylizeLine(left, content, right) {
      left = this.wrapWithStyleColors("border", left);
      right = this.wrapWithStyleColors("border", right);
      if (this.y === 0) {
        content = this.wrapWithStyleColors("head", content);
      }
      return left + content + right;
    }
    drawBottom(drawRight) {
      let left = this.chars[this.x == 0 ? "bottomLeft" : "bottomMid"];
      let content = utils.repeat(this.chars.bottom, this.width);
      let right = drawRight ? this.chars["bottomRight"] : "";
      return this.wrapWithStyleColors("border", left + content + right);
    }
    drawEmpty(drawRight, spanningCell) {
      let left = this.chars[this.x == 0 ? "left" : "middle"];
      if (this.x && spanningCell && this.cells) {
        let cellLeft = this.cells[this.y + spanningCell][this.x - 1];
        while (cellLeft instanceof ColSpanCell) {
          cellLeft = this.cells[cellLeft.y][cellLeft.x - 1];
        }
        if (!(cellLeft instanceof RowSpanCell)) {
          left = this.chars["rightMid"];
        }
      }
      let right = drawRight ? this.chars["right"] : "";
      let content = utils.repeat(" ", this.width);
      return this.stylizeLine(left, content, right);
    }
  }

  class ColSpanCell {
    constructor() {}
    draw(lineNum) {
      if (typeof lineNum === "number") {
        debug(`${this.y}-${this.x}: 1x1 ColSpanCell`);
      }
      return "";
    }
    init() {}
    mergeTableOptions() {}
  }

  class RowSpanCell {
    constructor(originalCell) {
      this.originalCell = originalCell;
    }
    init(tableOptions) {
      let y = this.y;
      let originalY = this.originalCell.y;
      this.cellOffset = y - originalY;
      this.offset = findDimension(tableOptions.rowHeights, originalY, this.cellOffset);
    }
    draw(lineNum) {
      if (lineNum == "top") {
        return this.originalCell.draw(this.offset, this.cellOffset);
      }
      if (lineNum == "bottom") {
        return this.originalCell.draw("bottom");
      }
      debug(`${this.y}-${this.x}: 1x${this.colSpan} RowSpanCell for ${this.originalCell.content}`);
      return this.originalCell.draw(this.offset + 1 + lineNum);
    }
    mergeTableOptions() {}
  }
  function firstDefined(...args) {
    return args.filter((v) => v !== undefined && v !== null).shift();
  }
  function setOption(objA, objB, nameB, targetObj) {
    let nameA = nameB.split("-");
    if (nameA.length > 1) {
      nameA[1] = nameA[1].charAt(0).toUpperCase() + nameA[1].substr(1);
      nameA = nameA.join("");
      targetObj[nameA] = firstDefined(objA[nameA], objA[nameB], objB[nameA], objB[nameB]);
    } else {
      targetObj[nameB] = firstDefined(objA[nameB], objB[nameB]);
    }
  }
  function findDimension(dimensionTable, startingIndex, span) {
    let ret = dimensionTable[startingIndex];
    for (let i = 1;i < span; i++) {
      ret += 1 + dimensionTable[startingIndex + i];
    }
    return ret;
  }
  function sumPlusOne(a, b) {
    return a + b + 1;
  }
  var CHAR_NAMES = [
    "top",
    "top-mid",
    "top-left",
    "top-right",
    "bottom",
    "bottom-mid",
    "bottom-left",
    "bottom-right",
    "left",
    "left-mid",
    "mid",
    "mid-mid",
    "right",
    "right-mid",
    "middle"
  ];
  module.exports = Cell;
  module.exports.ColSpanCell = ColSpanCell;
  module.exports.RowSpanCell = RowSpanCell;
});

// node_modules/cli-table3/src/layout-manager.js
var require_layout_manager = __commonJS((exports, module) => {
  var { warn, debug } = require_debug();
  var Cell = require_cell();
  var { ColSpanCell, RowSpanCell } = Cell;
  (function() {
    function next(alloc, col) {
      if (alloc[col] > 0) {
        return next(alloc, col + 1);
      }
      return col;
    }
    function layoutTable(table) {
      let alloc = {};
      table.forEach(function(row, rowIndex) {
        let col = 0;
        row.forEach(function(cell) {
          cell.y = rowIndex;
          cell.x = rowIndex ? next(alloc, col) : col;
          const rowSpan = cell.rowSpan || 1;
          const colSpan = cell.colSpan || 1;
          if (rowSpan > 1) {
            for (let cs = 0;cs < colSpan; cs++) {
              alloc[cell.x + cs] = rowSpan;
            }
          }
          col = cell.x + colSpan;
        });
        Object.keys(alloc).forEach((idx) => {
          alloc[idx]--;
          if (alloc[idx] < 1)
            delete alloc[idx];
        });
      });
    }
    function maxWidth(table) {
      let mw = 0;
      table.forEach(function(row) {
        row.forEach(function(cell) {
          mw = Math.max(mw, cell.x + (cell.colSpan || 1));
        });
      });
      return mw;
    }
    function maxHeight(table) {
      return table.length;
    }
    function cellsConflict(cell1, cell2) {
      let yMin1 = cell1.y;
      let yMax1 = cell1.y - 1 + (cell1.rowSpan || 1);
      let yMin2 = cell2.y;
      let yMax2 = cell2.y - 1 + (cell2.rowSpan || 1);
      let yConflict = !(yMin1 > yMax2 || yMin2 > yMax1);
      let xMin1 = cell1.x;
      let xMax1 = cell1.x - 1 + (cell1.colSpan || 1);
      let xMin2 = cell2.x;
      let xMax2 = cell2.x - 1 + (cell2.colSpan || 1);
      let xConflict = !(xMin1 > xMax2 || xMin2 > xMax1);
      return yConflict && xConflict;
    }
    function conflictExists(rows, x, y) {
      let i_max = Math.min(rows.length - 1, y);
      let cell = { x, y };
      for (let i = 0;i <= i_max; i++) {
        let row = rows[i];
        for (let j = 0;j < row.length; j++) {
          if (cellsConflict(cell, row[j])) {
            return true;
          }
        }
      }
      return false;
    }
    function allBlank(rows, y, xMin, xMax) {
      for (let x = xMin;x < xMax; x++) {
        if (conflictExists(rows, x, y)) {
          return false;
        }
      }
      return true;
    }
    function addRowSpanCells(table) {
      table.forEach(function(row, rowIndex) {
        row.forEach(function(cell) {
          for (let i = 1;i < cell.rowSpan; i++) {
            let rowSpanCell = new RowSpanCell(cell);
            rowSpanCell.x = cell.x;
            rowSpanCell.y = cell.y + i;
            rowSpanCell.colSpan = cell.colSpan;
            insertCell(rowSpanCell, table[rowIndex + i]);
          }
        });
      });
    }
    function addColSpanCells(cellRows) {
      for (let rowIndex = cellRows.length - 1;rowIndex >= 0; rowIndex--) {
        let cellColumns = cellRows[rowIndex];
        for (let columnIndex = 0;columnIndex < cellColumns.length; columnIndex++) {
          let cell = cellColumns[columnIndex];
          for (let k = 1;k < cell.colSpan; k++) {
            let colSpanCell = new ColSpanCell;
            colSpanCell.x = cell.x + k;
            colSpanCell.y = cell.y;
            cellColumns.splice(columnIndex + 1, 0, colSpanCell);
          }
        }
      }
    }
    function insertCell(cell, row) {
      let x = 0;
      while (x < row.length && row[x].x < cell.x) {
        x++;
      }
      row.splice(x, 0, cell);
    }
    function fillInTable(table) {
      let h_max = maxHeight(table);
      let w_max = maxWidth(table);
      debug(`Max rows: ${h_max}; Max cols: ${w_max}`);
      for (let y = 0;y < h_max; y++) {
        for (let x = 0;x < w_max; x++) {
          if (!conflictExists(table, x, y)) {
            let opts = { x, y, colSpan: 1, rowSpan: 1 };
            x++;
            while (x < w_max && !conflictExists(table, x, y)) {
              opts.colSpan++;
              x++;
            }
            let y2 = y + 1;
            while (y2 < h_max && allBlank(table, y2, opts.x, opts.x + opts.colSpan)) {
              opts.rowSpan++;
              y2++;
            }
            let cell = new Cell(opts);
            cell.x = opts.x;
            cell.y = opts.y;
            warn(`Missing cell at ${cell.y}-${cell.x}.`);
            insertCell(cell, table[y]);
          }
        }
      }
    }
    function generateCells(rows) {
      return rows.map(function(row) {
        if (!Array.isArray(row)) {
          let key = Object.keys(row)[0];
          row = row[key];
          if (Array.isArray(row)) {
            row = row.slice();
            row.unshift(key);
          } else {
            row = [key, row];
          }
        }
        return row.map(function(cell) {
          return new Cell(cell);
        });
      });
    }
    function makeTableLayout(rows) {
      let cellRows = generateCells(rows);
      layoutTable(cellRows);
      fillInTable(cellRows);
      addRowSpanCells(cellRows);
      addColSpanCells(cellRows);
      return cellRows;
    }
    module.exports = {
      makeTableLayout,
      layoutTable,
      addRowSpanCells,
      maxWidth,
      fillInTable,
      computeWidths: makeComputeWidths("colSpan", "desiredWidth", "x", 1),
      computeHeights: makeComputeWidths("rowSpan", "desiredHeight", "y", 1)
    };
  })();
  function makeComputeWidths(colSpan, desiredWidth, x, forcedMin) {
    return function(vals, table) {
      let result = [];
      let spanners = [];
      let auto = {};
      table.forEach(function(row) {
        row.forEach(function(cell) {
          if ((cell[colSpan] || 1) > 1) {
            spanners.push(cell);
          } else {
            result[cell[x]] = Math.max(result[cell[x]] || 0, cell[desiredWidth] || 0, forcedMin);
          }
        });
      });
      vals.forEach(function(val, index) {
        if (typeof val === "number") {
          result[index] = val;
        }
      });
      for (let k = spanners.length - 1;k >= 0; k--) {
        let cell = spanners[k];
        let span = cell[colSpan];
        let col = cell[x];
        let existingWidth = result[col];
        let editableCols = typeof vals[col] === "number" ? 0 : 1;
        if (typeof existingWidth === "number") {
          for (let i = 1;i < span; i++) {
            existingWidth += 1 + result[col + i];
            if (typeof vals[col + i] !== "number") {
              editableCols++;
            }
          }
        } else {
          existingWidth = desiredWidth === "desiredWidth" ? cell.desiredWidth - 1 : 1;
          if (!auto[col] || auto[col] < existingWidth) {
            auto[col] = existingWidth;
          }
        }
        if (cell[desiredWidth] > existingWidth) {
          let i = 0;
          while (editableCols > 0 && cell[desiredWidth] > existingWidth) {
            if (typeof vals[col + i] !== "number") {
              let dif = Math.round((cell[desiredWidth] - existingWidth) / editableCols);
              existingWidth += dif;
              result[col + i] += dif;
              editableCols--;
            }
            i++;
          }
        }
      }
      Object.assign(vals, result, auto);
      for (let j = 0;j < vals.length; j++) {
        vals[j] = Math.max(forcedMin, vals[j] || 0);
      }
    };
  }
});

// node_modules/cli-table3/src/table.js
var require_table = __commonJS((exports, module) => {
  var debug = require_debug();
  var utils = require_utils();
  var tableLayout = require_layout_manager();

  class Table extends Array {
    constructor(opts) {
      super();
      const options = utils.mergeOptions(opts);
      Object.defineProperty(this, "options", {
        value: options,
        enumerable: options.debug
      });
      if (options.debug) {
        switch (typeof options.debug) {
          case "boolean":
            debug.setDebugLevel(debug.WARN);
            break;
          case "number":
            debug.setDebugLevel(options.debug);
            break;
          case "string":
            debug.setDebugLevel(parseInt(options.debug, 10));
            break;
          default:
            debug.setDebugLevel(debug.WARN);
            debug.warn(`Debug option is expected to be boolean, number, or string. Received a ${typeof options.debug}`);
        }
        Object.defineProperty(this, "messages", {
          get() {
            return debug.debugMessages();
          }
        });
      }
    }
    toString() {
      let array = this;
      let headersPresent = this.options.head && this.options.head.length;
      if (headersPresent) {
        array = [this.options.head];
        if (this.length) {
          array.push.apply(array, this);
        }
      } else {
        this.options.style.head = [];
      }
      let cells = tableLayout.makeTableLayout(array);
      cells.forEach(function(row) {
        row.forEach(function(cell) {
          cell.mergeTableOptions(this.options, cells);
        }, this);
      }, this);
      tableLayout.computeWidths(this.options.colWidths, cells);
      tableLayout.computeHeights(this.options.rowHeights, cells);
      cells.forEach(function(row) {
        row.forEach(function(cell) {
          cell.init(this.options);
        }, this);
      }, this);
      let result = [];
      for (let rowIndex = 0;rowIndex < cells.length; rowIndex++) {
        let row = cells[rowIndex];
        let heightOfRow = this.options.rowHeights[rowIndex];
        if (rowIndex === 0 || !this.options.style.compact || rowIndex == 1 && headersPresent) {
          doDraw(row, "top", result);
        }
        for (let lineNum = 0;lineNum < heightOfRow; lineNum++) {
          doDraw(row, lineNum, result);
        }
        if (rowIndex + 1 == cells.length) {
          doDraw(row, "bottom", result);
        }
      }
      return result.join(`
`);
    }
    get width() {
      let str = this.toString().split(`
`);
      return str[0].length;
    }
  }
  Table.reset = () => debug.reset();
  function doDraw(row, lineNum, result) {
    let line = [];
    row.forEach(function(cell) {
      line.push(cell.draw(lineNum));
    });
    let str = line.join("");
    if (str.length)
      result.push(str);
  }
  module.exports = Table;
});

// src/planner.ts
import { readFileSync, existsSync } from "node:fs";

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = new Map;
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
import process2 from "node:process";
import os from "node:os";
import tty from "node:tty";
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => (key in env))) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? `\r
` : `
`) + postfix;
    endIndex = index + 1;
    index = string.indexOf(`
`, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === undefined ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk = (...strings) => strings.join(" ");
  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);
  return chalk;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === undefined) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === undefined) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== undefined) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf(`
`);
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/lib/luma-csv.ts
var ROLE_COLUMNS = [
  "What is your role? (If Student, write Student)",
  "Where do you work or study? What is your title?"
];
var ROLE_CATEGORIES = [
  "Students",
  "Founders / C-Suite / Directors",
  "Software Engineers / Devs",
  "Management / Operations",
  "Consultants / Freelancers",
  "Product / Design",
  "Data / Analytics / Research",
  "Other / Non-Tech"
];
var ROLE_COLOURS = [
  "#7C6FCD",
  "#C0496D",
  "#888780",
  "#1B9870",
  "#E09820",
  "#3578C8",
  "#C85025",
  "#4E8A1C"
];
function categoriseRole(rawRole) {
  const r = rawRole.toLowerCase();
  if (/student|associate\/student/.test(r))
    return "Students";
  if (/founder|ceo|cto|coo|cfo|c-suite|director|owner|co-founder/.test(r))
    return "Founders / C-Suite / Directors";
  if (/engineer|developer|\bdev\b|sre|software|fullstack|backend|frontend/.test(r))
    return "Software Engineers / Devs";
  if (/manager|management|operations|\bops\b/.test(r))
    return "Management / Operations";
  if (/consultant|freelance/.test(r))
    return "Consultants / Freelancers";
  if (/product|design|\bux\b|\bui\b/.test(r))
    return "Product / Design";
  if (/data|analyst|analytics|research|scientist/.test(r))
    return "Data / Analytics / Research";
  return "Other / Non-Tech";
}
function parseLumaCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0;i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
function parseLumaCSV(text) {
  const lines = text.trim().split(`
`);
  const headers = parseLumaCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLumaCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] || "").trim()]));
  });
}
// src/lib/shared.ts
function getRoleFromRow(row) {
  for (const col of ROLE_COLUMNS) {
    const val = (row[col] || "").trim();
    if (val)
      return val;
  }
  return "";
}
function matchesAudienceFilter(c, filter) {
  switch (filter) {
    case "everyone":
    case "industry-specific":
      return true;
    case "developers":
      return c.roleCategory === "Software Engineers / Devs" || /engineer|developer|dev|sre|software/i.test(c.role);
    case "founders":
      return c.roleCategory === "Founders / C-Suite / Directors";
    case "product-managers":
      return c.roleCategory === "Product / Design";
    case "marketers-gtm":
      return /market|growth|gtm|sales|business dev/i.test(c.role);
    case "operators":
      return c.roleCategory === "Management / Operations";
  }
}
function buildCandidates(pastFiles, currentFile) {
  const historyMap = new Map;
  for (const file of pastFiles) {
    for (const row of file.rows) {
      const email = (row["email"] || "").toLowerCase().trim();
      if (!email)
        continue;
      const appearances = historyMap.get(email) || [];
      appearances.push({
        fileName: file.name,
        status: (row["approval_status"] || "").toLowerCase(),
        checkedIn: !!(row["checked_in_at"] || "").trim()
      });
      historyMap.set(email, appearances);
    }
  }
  const waitlisted = currentFile.rows.filter((r) => {
    const status = (r["approval_status"] || "").toLowerCase();
    return status === "waitlist" || status === "declined" || status === "pending_approval";
  });
  const candidates = [];
  const buckets = {
    new: [],
    "not-recently-selected": [],
    "previously-invited": []
  };
  let nextId = 0;
  for (const row of waitlisted) {
    const email = (row["email"] || "").toLowerCase().trim();
    if (!email)
      continue;
    const role = getRoleFromRow(row);
    const history = historyMap.get(email) || [];
    const wasApproved = history.some((h) => h.status === "approved" || h.status === "attended" || h.checkedIn);
    let bucket;
    if (history.length === 0)
      bucket = "new";
    else if (!wasApproved)
      bucket = "not-recently-selected";
    else
      bucket = "previously-invited";
    const candidate = {
      id: `candidate-${nextId++}`,
      name: (row["name"] || "").trim(),
      role,
      roleCategory: categoriseRole(role),
      company: (row["Where do you work or study? What is your title?"] || "").trim(),
      interests: (row["What Claude Code features or capabilities are you most interested in discussing at this meetup?"] || "").trim(),
      experienceLevel: (row["What is your experience level with Claude Code?"] || "").trim(),
      history
    };
    candidates.push(candidate);
    buckets[bucket].push(candidate);
  }
  return { candidates, buckets };
}

// src/lib/display.ts
var import_cli_table3 = __toESM(require_table(), 1);
function sectionHeader(title) {
  const line = "─".repeat(Math.max(0, (process.stdout.columns || 80) - title.length - 4));
  return source_default.hex("#5A5855")(`── ${source_default.bold.hex("#9A9890")(title)} ${line}`);
}
function renderSummaryStats(stats) {
  const table = new import_cli_table3.default({
    head: [
      source_default.hex("#5A5855")("Total"),
      source_default.hex("#5A5855")("New"),
      source_default.hex("#5A5855")("Never Selected"),
      source_default.hex("#5A5855")("Prev. Invited"),
      source_default.hex("#5A5855")("Top Role")
    ],
    style: { head: [], border: ["gray"] }
  });
  table.push([
    source_default.bold.hex("#E8E6DF")(String(stats.total)),
    source_default.hex("#4ADE80")(String(stats.newCount)),
    source_default.hex("#FACC15")(String(stats.neverSelected)),
    source_default.hex("#7C6FCD")(String(stats.previouslyInvited)),
    source_default.hex("#9A9890")(stats.topRole)
  ]);
  return table.toString();
}
function roleColour(candidate) {
  const idx = ROLE_CATEGORIES.indexOf(candidate.roleCategory);
  return ROLE_COLOURS[idx >= 0 ? idx : ROLE_COLOURS.length - 1];
}
function historyLabel(candidate) {
  if (!candidate.history.length)
    return source_default.hex("#4ADE80")("New");
  const wasInvited = candidate.history.some((h) => h.status === "approved" || h.status === "attended" || h.checkedIn);
  if (wasInvited)
    return source_default.hex("#7C6FCD")(`Invited (${candidate.history.length})`);
  return source_default.hex("#FACC15")(`${candidate.history.length}x, never selected`);
}
function renderCandidateTable(title, candidates) {
  if (candidates.length === 0) {
    return `${sectionHeader(`${title} (0)`)}
  ${source_default.hex("#6A6860")("No candidates in this category")}
`;
  }
  const lines = [];
  lines.push(sectionHeader(`${title} (${candidates.length})`));
  const table = new import_cli_table3.default({
    head: [
      source_default.hex("#5A5855")("Name"),
      source_default.hex("#5A5855")("Role"),
      source_default.hex("#5A5855")("Company"),
      source_default.hex("#5A5855")("Experience"),
      source_default.hex("#5A5855")("History")
    ],
    style: { head: [], border: ["gray"] },
    colWidths: [22, 28, 20, 18, 20],
    wordWrap: true
  });
  for (const c of candidates) {
    const colour = roleColour(c);
    table.push([
      source_default.hex("#E8E6DF")(c.name),
      source_default.hex(colour)("● ") + source_default.hex("#C8C6BE")(c.role.slice(0, 24)),
      source_default.hex("#9A9890")(c.company.slice(0, 18)),
      source_default.hex("#6A6860")(c.experienceLevel.slice(0, 16)),
      historyLabel(c)
    ]);
  }
  lines.push(table.toString());
  return lines.join(`
`);
}

// src/planner.ts
var AUDIENCE_FILTERS = [
  "everyone",
  "developers",
  "founders",
  "product-managers",
  "marketers-gtm",
  "operators",
  "industry-specific"
];
var args = process.argv.slice(2);
var pastPaths = [];
var currentPath = "";
var audienceFilter = "everyone";
for (let i = 0;i < args.length; i++) {
  const arg = args[i];
  if (arg === "--help" || arg === "-h") {
    console.log(`Usage: bun run planner.ts --past <csv...> --current <csv> [--filter <audience>]`);
    console.log(`Filters: ${AUDIENCE_FILTERS.join(", ")}`);
    process.exit(0);
  } else if (arg === "--past") {
    while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      pastPaths.push(args[++i]);
    }
  } else if (arg === "--current") {
    currentPath = args[++i] || "";
  } else if (arg === "--filter") {
    const val = args[++i] || "";
    if (!AUDIENCE_FILTERS.includes(val)) {
      console.error(source_default.hex("#F87171")(`Error: Invalid filter "${val}". Valid: ${AUDIENCE_FILTERS.join(", ")}`));
      process.exit(1);
    }
    audienceFilter = val;
  }
}
if (pastPaths.length === 0 || !currentPath) {
  console.error(source_default.hex("#F87171")("Error: Both --past and --current are required."));
  process.exit(1);
}
function loadCSV(path) {
  if (!existsSync(path)) {
    console.error(source_default.hex("#F87171")(`Error: File not found: ${path}`));
    process.exit(1);
  }
  const text = readFileSync(path, "utf-8");
  const rows = parseLumaCSV(text);
  const name = path.split("/").pop() || path;
  return { name, rows };
}
try {
  const pastFiles = pastPaths.map(loadCSV);
  const currentFile = loadCSV(currentPath);
  console.log("");
  console.log(source_default.bold.hex("#E8E6DF")("  Attendance Planner"));
  console.log(source_default.hex("#6A6860")(`  Past events: ${pastFiles.map((f) => f.name).join(", ")} | Current: ${currentFile.name}`));
  console.log("");
  const { candidates, buckets } = buildCandidates(pastFiles, currentFile);
  if (candidates.length === 0) {
    console.log(source_default.hex("#FACC15")("  No waitlisted/declined/pending candidates found in current event."));
    console.log(source_default.hex("#6A6860")("  Only candidates with status: waitlist, declined, or pending_approval are analyzed."));
    process.exit(0);
  }
  const filter = (list) => list.filter((c) => matchesAudienceFilter(c, audienceFilter));
  const filteredNew = filter(buckets["new"]);
  const filteredNotSelected = filter(buckets["not-recently-selected"]);
  const filteredPrevInvited = filter(buckets["previously-invited"]);
  const allFiltered = [...filteredNew, ...filteredNotSelected, ...filteredPrevInvited];
  const roleCounts = new Map;
  for (const c of candidates) {
    roleCounts.set(c.roleCategory, (roleCounts.get(c.roleCategory) || 0) + 1);
  }
  let topRole = "";
  let maxRoleCount = 0;
  for (const [role, count] of roleCounts) {
    if (count > maxRoleCount) {
      topRole = role;
      maxRoleCount = count;
    }
  }
  console.log(sectionHeader("SUMMARY"));
  console.log("");
  console.log(renderSummaryStats({
    total: candidates.length,
    newCount: buckets["new"].length,
    neverSelected: buckets["not-recently-selected"].length,
    previouslyInvited: buckets["previously-invited"].length,
    topRole
  }));
  console.log("");
  if (audienceFilter !== "everyone") {
    console.log(source_default.hex("#7C6FCD")(`  Filter: ${audienceFilter} — showing ${allFiltered.length} of ${candidates.length}`));
    console.log("");
  }
  console.log(renderCandidateTable("New — Never Invited", filteredNew));
  console.log("");
  console.log(renderCandidateTable("Applied — Never Selected", filteredNotSelected));
  console.log("");
  console.log(renderCandidateTable("Previously Invited", filteredPrevInvited));
  console.log("");
} catch (err) {
  console.error(source_default.hex("#F87171")(`Error: ${err instanceof Error ? err.message : "Failed to process CSV files."}`));
  process.exit(1);
}

function saveGraph(){
    var canvas = document.getElementById("canvas");
    canvas.toBlob(function(blob) {
        saveAs(blob, "Grapher.png");
    });
}

/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this

function bom (blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false }
  else if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
var isMacOSWebView = /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
  // probably in some web worker
  (typeof window !== 'object' || window !== _global)
    ? function saveAs () { /* noop */ }

  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
  : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
  ? function saveAs (blob, name, opts) {
    var URL = _global.URL || _global.webkitURL
    var a = document.createElement('a')
    name = name || blob.name || 'download'

    a.download = name
    a.rel = 'noopener' // tabnabbing

    // TODO: detect chrome extensions & packaged apps
    // a.target = '_blank'

    if (typeof blob === 'string') {
      // Support regular links
      a.href = blob
      if (a.origin !== location.origin) {
        corsEnabled(a.href)
          ? download(blob, name, opts)
          : click(a, a.target = '_blank')
      } else {
        click(a)
      }
    } else {
      // Support blobs
      a.href = URL.createObjectURL(blob)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
      setTimeout(function () { click(a) }, 0)
    }
  }

  // Use msSaveOrOpenBlob as a second approach
  : 'msSaveOrOpenBlob' in navigator
  ? function saveAs (blob, name, opts) {
    name = name || blob.name || 'download'

    if (typeof blob === 'string') {
      if (corsEnabled(blob)) {
        download(blob, name, opts)
      } else {
        var a = document.createElement('a')
        a.href = blob
        a.target = '_blank'
        setTimeout(function () { click(a) })
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name)
    }
  }

  // Fallback to using FileReader and a popup
  : function saveAs (blob, name, opts, popup) {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    popup = popup || open('', '_blank')
    if (popup) {
      popup.document.title =
      popup.document.body.innerText = 'downloading...'
    }

    if (typeof blob === 'string') return download(blob, name, opts)

    var force = blob.type === 'application/octet-stream'
    var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
    var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

    if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader()
      reader.onloadend = function () {
        var url = reader.result
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
        if (popup) popup.location.href = url
        else location = url
        popup = null // reverse-tabnabbing #460
      }
      reader.readAsDataURL(blob)
    } else {
      var URL = _global.URL || _global.webkitURL
      var url = URL.createObjectURL(blob)
      if (popup) popup.location = url
      else location.href = url
      popup = null // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
    }
  }
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}

/* canvas-toBlob.js
 * A canvas.toBlob() implementation.
 * 2016-05-26
 * 
 * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
 * License: MIT
 *   See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

(function(view) {
    "use strict";
    var
          Uint8Array = view.Uint8Array
        , HTMLCanvasElement = view.HTMLCanvasElement
        , canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype
        , is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i
        , to_data_url = "toDataURL"
        , base64_ranks
        , decode_base64 = function(base64) {
            var
                  len = base64.length
                , buffer = new Uint8Array(len / 4 * 3 | 0)
                , i = 0
                , outptr = 0
                , last = [0, 0]
                , state = 0
                , save = 0
                , rank
                , code
                , undef
            ;
            while (len--) {
                code = base64.charCodeAt(i++);
                rank = base64_ranks[code-43];
                if (rank !== 255 && rank !== undef) {
                    last[1] = last[0];
                    last[0] = code;
                    save = (save << 6) | rank;
                    state++;
                    if (state === 4) {
                        buffer[outptr++] = save >>> 16;
                        if (last[1] !== 61 /* padding character */) {
                            buffer[outptr++] = save >>> 8;
                        }
                        if (last[0] !== 61 /* padding character */) {
                            buffer[outptr++] = save;
                        }
                        state = 0;
                    }
                }
            }
            // 2/3 chance there's going to be some null bytes at the end, but that
            // doesn't really matter with most image formats.
            // If it somehow matters for you, truncate the buffer up outptr.
            return buffer;
        }
    ;
    if (Uint8Array) {
        base64_ranks = new Uint8Array([
              62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1
            , -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9
            , 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
            , -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
            , 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
        ]);
    }
    if (HTMLCanvasElement && (!canvas_proto.toBlob || !canvas_proto.toBlobHD)) {
        if (!canvas_proto.toBlob)
        canvas_proto.toBlob = function(callback, type /*, ...args*/) {
              if (!type) {
                type = "image/png";
            } if (this.mozGetAsFile) {
                callback(this.mozGetAsFile("canvas", type));
                return;
            } if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
                callback(this.msToBlob());
                return;
            }
    
            var
                  args = Array.prototype.slice.call(arguments, 1)
                , dataURI = this[to_data_url].apply(this, args)
                , header_end = dataURI.indexOf(",")
                , data = dataURI.substring(header_end + 1)
                , is_base64 = is_base64_regex.test(dataURI.substring(0, header_end))
                , blob
            ;
            if (Blob.fake) {
                // no reason to decode a data: URI that's just going to become a data URI again
                blob = new Blob
                if (is_base64) {
                    blob.encoding = "base64";
                } else {
                    blob.encoding = "URI";
                }
                blob.data = data;
                blob.size = data.length;
            } else if (Uint8Array) {
                if (is_base64) {
                    blob = new Blob([decode_base64(data)], {type: type});
                } else {
                    blob = new Blob([decodeURIComponent(data)], {type: type});
                }
            }
            callback(blob);
        };
    
        if (!canvas_proto.toBlobHD && canvas_proto.toDataURLHD) {
            canvas_proto.toBlobHD = function() {
                to_data_url = "toDataURLHD";
                var blob = this.toBlob();
                to_data_url = "toDataURL";
                return blob;
            }
        } else {
            canvas_proto.toBlobHD = canvas_proto.toBlob;
        }
    }
    }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
    

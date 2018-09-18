try {
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        document.execCommand("BackgroundImageCache", false, true);
    }
} catch (err) {}
Type.registerNamespace("Telerik.Web.UI");
var commonScripts = {
    cloneJsObject: function(c, d) {
        if (!d) {
            d = {};
        }
        for (var a in c) {
            var b = c[a];
            d[a] = (b instanceof Array) ? Array.clone(b) : b;
        }
        return d;
    },
    isCloned: function() {
        return this._isCloned;
    },
    cloneControl: function(f, d, a) {
        if (!f) {
            return null;
        }
        if (!d) {
            d = Object.getType(f);
        }
        var e = f.__clonedProperties__;
        if (null == e) {
            e = f.__clonedProperties__ = $telerik._getPropertiesParameter(f, d);
        }
        if (!a) {
            a = f.get_element().cloneNode(true);
            a.removeAttribute("control");
            a.removeAttribute("id");
        }
        var c = $create(d, e, null, null, a);
        if (f._observerContext) {
            c._observerContext = f._observerContext;
        }
        var b = $telerik.cloneJsObject(f.get_events());
        c._events = b;
        c._events._list = $telerik.cloneJsObject(c._events._list);
        c._isCloned = true;
        c.isCloned = $telerik.isCloned;
        return c;
    },
    _getPropertiesParameter: function(h, d) {
        var c = {};
        var f = d.prototype;
        for (var b in f) {
            var a = h[b];
            if (typeof(a) == "function" && b.indexOf("get_") == 0) {
                var e = b.substring(4);
                if (null == h["set_" + e]) {
                    continue;
                }
                var g = a.call(h);
                if (null == g) {
                    continue;
                }
                c[e] = g;
            }
        }
        delete c.clientStateFieldID;
        delete c.id;
        return c;
    },
    getOuterSize: function(a) {
        var c = $telerik.getSize(a);
        var b = $telerik.getMarginBox(a);
        return {
            width: c.width + b.left + b.right,
            height: c.height + b.top + b.bottom
        };
    },
    getOuterBounds: function(a) {
        var c = $telerik.getBounds(a);
        var b = $telerik.getMarginBox(a);
        return {
            x: c.x - b.left,
            y: c.y - b.top,
            width: c.width + b.left + b.right,
            height: c.height + b.top + b.bottom
        };
    },
    getInvisibleParent: function(a) {
        while (a && a != document) {
            if ("none" == $telerik.getCurrentStyle(a, "display", "")) {
                return a;
            }
            a = a.parentNode;
        }
        return null;
    },
    isScrolledIntoView: function(d) {
        var a = d.ownerDocument;
        var g = (a.defaultView) ? a.defaultView : a.parentWindow;
        var c = $telerik.$(g).scrollTop(),
            b = c + $telerik.$(g).height(),
            f = $telerik.$(d).offset().top,
            e = f + $telerik.$(d).height();
        return ((f + ((e - f) / 4)) >= c && ((f + ((e - f) / 4)) <= b));
    },
    scrollIntoView: function(b) {
        if (!b || !b.parentNode) {
            return;
        }
        var g = null,
            c = b.offsetParent,
            h = b.offsetTop,
            f = 0;
        var e = b.parentNode;
        while (e != null) {
            var d = $telerik.getCurrentStyle(e, "overflowY");
            if (d == "scroll" || d == "auto") {
                g = e;
                break;
            }
            if (e == c) {
                h += e.offsetTop;
                c = e.offsetParent;
            }
            if (e.tagName == "BODY") {
                var a = e.ownerDocument;
                if (!$telerik.isIE && a.defaultView && a.defaultView.frameElement) {
                    f = a.defaultView.frameElement.offsetHeight;
                }
                g = e;
                break;
            }
            e = e.parentNode;
        }
        if (!g) {
            return;
        }
        if (!f) {
            f = g.offsetHeight;
        }
        if ((g.scrollTop + f) < (h + b.offsetHeight)) {
            g.scrollTop = (h + b.offsetHeight) - f;
        } else {
            if (h < (g.scrollTop)) {
                g.scrollTop = h;
            }
        }
    },
    getScrollableParent: function(a) {
        var c = a.parentNode,
            d = null,
            b;
        while (c != null) {
            b = $telerik.getCurrentStyle(c, "overflowY");
            if (b == "scroll" || b == "auto") {
                d = c;
                break;
            }
            c = c.parentNode;
        }
        return d;
    },
    getScrollableParents: function(a) {
        var c = a.parentNode,
            d = [],
            b;
        while (c != null && c.nodeType === 1) {
            b = $telerik.getCurrentStyle(c, "overflowY");
            if (b == "scroll" || b == "auto") {
                d.push(c);
            }
            c = c.parentNode;
        }
        return d;
    },
    fixScrollableParentBehavior_OldIE: function(a) {
        if (!($telerik.isIE6 || $telerik.isIE7) || (!a || a.nodeType !== 1)) {
            return;
        }
        var c = $telerik.getScrollableParent(a),
            b = $telerik.getComputedStyle(c, "position");
        if (b == "static") {
            c.style.position = "relative";
        }
    },
    isRightToLeft: function(b) {
        while (b && b.nodeType !== 9) {
            var a = $telerik.getCurrentStyle(b, "direction");
            if (b.dir == "rtl" || a == "rtl") {
                return true;
            }
            if (b.dir == "ltr" || a == "ltr") {
                return false;
            }
            b = b.parentNode;
        }
        return false;
    },
    getCorrectScrollLeft: function(a) {
        if ($telerik.isRightToLeft(a)) {
            return -(a.scrollWidth - a.offsetWidth - Math.abs(a.scrollLeft));
        } else {
            return a.scrollLeft;
        }
    },
    _borderStyleNames: ["borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle"],
    _borderWidthNames: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
    _paddingWidthNames: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    _marginWidthNames: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
    radControls: [],
    registerControl: function(a) {
        if (!Array.contains(this.radControls, a)) {
            Array.add(this.radControls, a);
        }
    },
    unregisterControl: function(a) {
        Array.remove(this.radControls, a);
    },
    repaintChildren: function(d) {
        var e = d.get_element ? d.get_element() : d;
        for (var b = 0, c = this.radControls.length; b < c; b++) {
            var a = this.radControls[b];
            if (a.repaint && this.isDescendant(e, a.get_element())) {
                a.repaint();
            }
        }
    },
    _borderThickness: function() {
        $telerik._borderThicknesses = {};
        var b = document.createElement("div");
        var d = document.createElement("div");
        b.style.visibility = "hidden";
        b.style.position = "absolute";
        b.style.top = "-9999px";
        b.style.fontSize = "1px";
        d.style.height = "0px";
        d.style.overflow = "hidden";
        document.body.appendChild(b).appendChild(d);
        var a = b.offsetHeight;
        d.style.borderTop = "solid black";
        b.style.borderLeft = "1px solid red";
        d.style.borderTopWidth = "thin";
        $telerik._borderThicknesses.thin = b.offsetHeight - a;
        d.style.borderTopWidth = "medium";
        $telerik._borderThicknesses.medium = b.offsetHeight - a;
        d.style.borderTopWidth = "thick";
        $telerik._borderThicknesses.thick = b.offsetHeight - a;
        var c = $telerik.getComputedStyle(b, "border-left-color", null);
        var e = $telerik.getComputedStyle(d, "border-top-color", null);
        if (c && e && c == e) {
            document.documentElement.className += " _Telerik_a11y";
        }
        if (typeof(b.removeChild) !== "undefined") {
            b.removeChild(d);
        }
        document.body.removeChild(b);
        if (!$telerik.isSafari && !$telerik.isIE10Mode) {
            d.outerHTML = null;
        }
        if (!$telerik.isSafari && !$telerik.isIE10Mode) {
            b.outerHTML = null;
        }
        b = null;
        d = null;
    },
    getCurrentStyle: function(d, a, c) {
        var b = null;
        if (d) {
            if (d.currentStyle) {
                b = d.currentStyle[a];
            } else {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var e = document.defaultView.getComputedStyle(d, null);
                    if (e) {
                        b = e[a];
                    }
                }
            }
            if (!b && d.style) {
                if (d.style.getPropertyValue) {
                    b = d.style.getPropertyValue(a);
                } else {
                    if (d.style.getAttribute) {
                        b = d.style.getAttribute(a);
                    }
                }
            }
        }
        if ((!b || b == "" || typeof(b) === "undefined")) {
            if (typeof(c) != "undefined") {
                b = c;
            } else {
                b = null;
            }
        }
        return b;
    },
    getComputedStyle: function(d, a, c) {
        var b = null;
        if (d) {
            if (d.currentStyle) {
                b = d.currentStyle[a];
            } else {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var e = document.defaultView.getComputedStyle(d, null);
                    if (e) {
                        if (e.getPropertyValue) {
                            b = e.getPropertyValue(a);
                        } else {
                            b = e[a];
                        }
                    }
                }
            }
            if (!b && d.style) {
                if (d.style.getPropertyValue) {
                    b = d.style.getPropertyValue(a);
                } else {
                    if (d.style.getAttribute) {
                        b = d.style.getAttribute(a);
                    }
                }
            }
        }
        if ((!b || b == "" || typeof(b) === "undefined")) {
            if (typeof(c) != "undefined") {
                b = c;
            } else {
                b = null;
            }
        }
        return b;
    },
    getLocation: function(j) {
        var f = j && j.ownerDocument ? j.ownerDocument : document;
        if (j === f.documentElement) {
            return new Sys.UI.Point(0, 0);
        }
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
            if (j.window === j || j.nodeType === 9 || !j.getClientRects || !j.getBoundingClientRect || j.parentElement == null) {
                return new Sys.UI.Point(0, 0);
            }
            var M = j.getClientRects();
            if (!M || !M.length) {
                return new Sys.UI.Point(0, 0);
            }
            var m = M[0];
            var e = 0;
            var h = 0;
            var s = false;
            try {
                s = f.parentWindow.frameElement;
            } catch (l) {
                s = true;
            }
            if (s) {
                var d = j.getBoundingClientRect();
                if (!d) {
                    return new Sys.UI.Point(0, 0);
                }
                var v = m.left;
                var w = m.top;
                for (var q = 1; q < M.length; q++) {
                    var K = M[q];
                    if (K.left < v) {
                        v = K.left;
                    }
                    if (K.top < w) {
                        w = K.top;
                    }
                }
                e = v - d.left;
                h = w - d.top;
            }
            var N = 0;
            if (Sys.Browser.version < 8 || $telerik.quirksMode) {
                var p = 1;
                if (s && s.getAttribute) {
                    var a = s.getAttribute("frameborder");
                    if (a != null) {
                        p = parseInt(a, 10);
                        if (isNaN(p)) {
                            p = a.toLowerCase() == "no" ? 0 : 1;
                        }
                    }
                }
                N = 2 * p;
            }
            var g = f.documentElement;
            var I = m.left - N - e + $telerik.getCorrectScrollLeft(g);
            var J = m.top - N - h + g.scrollTop;
            var H = new Sys.UI.Point(Math.round(I), Math.round(J));
            if ($telerik.quirksMode) {
                H.x += $telerik.getCorrectScrollLeft(f.body);
                H.y += f.body.scrollTop;
            }
            return H;
        }
        var H = $telerik.originalGetLocation(j);
        if ($telerik.isOpera) {
            var B = null;
            var k = $telerik.getCurrentStyle(j, "display");
            if (k != "inline") {
                B = j.parentNode;
            } else {
                B = j.offsetParent;
            }
            while (B) {
                var F = B.tagName.toUpperCase();
                if (F == "BODY" || F == "HTML") {
                    break;
                }
                if (F == "TABLE" && B.parentNode && B.parentNode.style.display == "inline-block") {
                    var y = B.offsetLeft;
                    var x = B.style.display;
                    B.style.display = "inline-block";
                    if (B.offsetLeft > y) {
                        H.x += B.offsetLeft - y;
                    }
                    B.style.display = x;
                }
                H.x -= $telerik.getCorrectScrollLeft(B);
                H.y -= B.scrollTop;
                if (k != "inline") {
                    B = B.parentNode;
                } else {
                    B = B.offsetParent;
                }
            }
        }
        var A = Math.max(f.documentElement.scrollTop, f.body.scrollTop);
        var z = Math.max(f.documentElement.scrollLeft, f.body.scrollLeft);
        if ($telerik.isSafari) {
            if (A > 0 || z > 0) {
                var o = f.documentElement.getElementsByTagName("form");
                if (o && o.length > 0) {
                    var n = $telerik.originalGetLocation(o[0]);
                    if (n.y && n.y < 0) {
                        H.y += A;
                    }
                    if (n.x && n.x < 0) {
                        H.x += z;
                    }
                } else {
                    var L = j.parentNode,
                        u = false,
                        t = false;
                    while (L && L.tagName) {
                        var C = $telerik.originalGetLocation(L);
                        if (C.y < 0) {
                            u = true;
                        }
                        if (C.x < 0) {
                            t = true;
                        }
                        L = L.parentNode;
                    }
                    if (u) {
                        H.y += A;
                    }
                    if (t) {
                        H.x += z;
                    }
                }
            }
            var B = j.parentNode;
            var G = null;
            var E = null;
            while (B && B.tagName.toUpperCase() != "BODY" && B.tagName.toUpperCase() != "HTML") {
                if (B.tagName.toUpperCase() == "TD") {
                    G = B;
                } else {
                    if (B.tagName.toUpperCase() == "TABLE") {
                        E = B;
                    } else {
                        var D = $telerik.getCurrentStyle(B, "position");
                        if (D == "absolute" || D == "relative") {
                            var c = $telerik.getCurrentStyle(B, "borderTopWidth", 0);
                            var b = $telerik.getCurrentStyle(B, "borderLeftWidth", 0);
                            H.x += parseInt(c);
                            H.y += parseInt(b);
                        }
                    }
                }
                if (G && E) {
                    H.x += parseInt($telerik.getCurrentStyle(E, "borderTopWidth"), 0);
                    H.y += parseInt($telerik.getCurrentStyle(E, "borderLeftWidth", 0));
                    if ($telerik.getCurrentStyle(E, "borderCollapse") != "collapse") {
                        H.x += parseInt($telerik.getCurrentStyle(G, "borderTopWidth", 0));
                        H.y += parseInt($telerik.getCurrentStyle(G, "borderLeftWidth", 0));
                    }
                    G = null;
                    E = null;
                } else {
                    if (E) {
                        if ($telerik.getCurrentStyle(E, "borderCollapse") != "collapse") {
                            H.x += parseInt($telerik.getCurrentStyle(E, "borderTopWidth", 0));
                            H.y += parseInt($telerik.getCurrentStyle(E, "borderLeftWidth", 0));
                        }
                        E = null;
                    }
                }
                B = B.parentNode;
            }
        }
        return H;
    },
    setLocation: function(a, b) {
        Sys.UI.DomElement.setLocation(a, b.x, b.y);
    },
    findControl: function(f, d) {
        var b = f.getElementsByTagName("*");
        for (var c = 0, e = b.length; c < e; c++) {
            var a = b[c].id;
            if (a && a.endsWith(d)) {
                return $find(a);
            }
        }
        return null;
    },
    findElement: function(f, d) {
        var b = f.getElementsByTagName("*");
        for (var c = 0, e = b.length; c < e; c++) {
            var a = b[c].id;
            if (a && a.endsWith(d)) {
                return $get(a);
            }
        }
        return null;
    },
    getContentSize: function(b) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        var d = $telerik.getSize(b);
        var a = $telerik.getBorderBox(b);
        var c = $telerik.getPaddingBox(b);
        return {
            width: d.width - a.horizontal - c.horizontal,
            height: d.height - a.vertical - c.vertical
        };
    },
    getSize: function(a) {
        if (!a) {
            throw Error.argumentNull("element");
        }
        return {
            width: a.offsetWidth,
            height: a.offsetHeight
        };
    },
    setContentSize: function(b, d) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        if (!d) {
            throw Error.argumentNull("size");
        }
        if ($telerik.getCurrentStyle(b, "MozBoxSizing") == "border-box" || $telerik.getCurrentStyle(b, "BoxSizing") == "border-box") {
            var a = $telerik.getBorderBox(b);
            var c = $telerik.getPaddingBox(b);
            d = {
                width: d.width + a.horizontal + c.horizontal,
                height: d.height + a.vertical + c.vertical
            };
        }
        b.style.width = d.width.toString() + "px";
        b.style.height = d.height.toString() + "px";
    },
    setSize: function(c, e) {
        if (!c) {
            throw Error.argumentNull("element");
        }
        if (!e) {
            throw Error.argumentNull("size");
        }
        var a = $telerik.getBorderBox(c);
        var d = $telerik.getPaddingBox(c);
        var b = {
            width: e.width - a.horizontal - d.horizontal,
            height: e.height - a.vertical - d.vertical
        };
        $telerik.setContentSize(c, b);
    },
    getBounds: function(a) {
        var b = $telerik.getLocation(a);
        return new Sys.UI.Bounds(b.x, b.y, a.offsetWidth || 0, a.offsetHeight || 0);
    },
    setBounds: function(b, a) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        if (!a) {
            throw Error.argumentNull("bounds");
        }
        $telerik.setSize(b, a);
        $telerik.setLocation(b, a);
    },
    getClientBounds: function() {
        var b;
        var a;
        switch (Sys.Browser.agent) {
            case Sys.Browser.InternetExplorer:
                b = document.documentElement.clientWidth;
                a = document.documentElement.clientHeight;
                if (b == 0 && a == 0) {
                    b = document.body.clientWidth;
                    a = document.body.clientHeight;
                }
                break;
            case Sys.Browser.Safari:
                b = window.innerWidth;
                a = window.innerHeight;
                break;
            case Sys.Browser.Opera:
                if (Sys.Browser.version >= 9.5) {
                    b = Math.min(window.innerWidth, document.documentElement.clientWidth);
                    a = Math.min(window.innerHeight, document.documentElement.clientHeight);
                } else {
                    b = Math.min(window.innerWidth, document.body.clientWidth);
                    a = Math.min(window.innerHeight, document.body.clientHeight);
                }
                break;
            default:
                b = Math.min(window.innerWidth, document.documentElement.clientWidth);
                a = Math.min(window.innerHeight, document.documentElement.clientHeight);
                break;
        }
        return new Sys.UI.Bounds(0, 0, b, a);
    },
    getMarginBox: function(b) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        var a = {
            top: $telerik.getMargin(b, Telerik.Web.BoxSide.Top),
            right: $telerik.getMargin(b, Telerik.Web.BoxSide.Right),
            bottom: $telerik.getMargin(b, Telerik.Web.BoxSide.Bottom),
            left: $telerik.getMargin(b, Telerik.Web.BoxSide.Left)
        };
        a.horizontal = a.left + a.right;
        a.vertical = a.top + a.bottom;
        return a;
    },
    getPaddingBox: function(b) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        var a = {
            top: $telerik.getPadding(b, Telerik.Web.BoxSide.Top),
            right: $telerik.getPadding(b, Telerik.Web.BoxSide.Right),
            bottom: $telerik.getPadding(b, Telerik.Web.BoxSide.Bottom),
            left: $telerik.getPadding(b, Telerik.Web.BoxSide.Left)
        };
        a.horizontal = a.left + a.right;
        a.vertical = a.top + a.bottom;
        return a;
    },
    getBorderBox: function(b) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        var a = {
            top: $telerik.getBorderWidth(b, Telerik.Web.BoxSide.Top),
            right: $telerik.getBorderWidth(b, Telerik.Web.BoxSide.Right),
            bottom: $telerik.getBorderWidth(b, Telerik.Web.BoxSide.Bottom),
            left: $telerik.getBorderWidth(b, Telerik.Web.BoxSide.Left)
        };
        a.horizontal = a.left + a.right;
        a.vertical = a.top + a.bottom;
        return a;
    },
    isBorderVisible: function(b, a) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        if (a < Telerik.Web.BoxSide.Top || a > Telerik.Web.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, a, "Telerik.Web.BoxSide"));
        }
        var c = $telerik._borderStyleNames[a];
        var d = $telerik.getCurrentStyle(b, c);
        return d != "none";
    },
    getMargin: function(b, a) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        if (a < Telerik.Web.BoxSide.Top || a > Telerik.Web.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, a, "Telerik.Web.BoxSide"));
        }
        var d = $telerik._marginWidthNames[a];
        var e = $telerik.getCurrentStyle(b, d);
        try {
            return $telerik.parsePadding(e);
        } catch (c) {
            return 0;
        }
    },
    getBorderWidth: function(b, a) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        if (a < Telerik.Web.BoxSide.Top || a > Telerik.Web.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, a, "Telerik.Web.BoxSide"));
        }
        if (!$telerik.isBorderVisible(b, a)) {
            return 0;
        }
        var c = $telerik._borderWidthNames[a];
        var d = $telerik.getCurrentStyle(b, c);
        return $telerik.parseBorderWidth(d);
    },
    getPadding: function(b, a) {
        if (!b) {
            throw Error.argumentNull("element");
        }
        if (a < Telerik.Web.BoxSide.Top || a > Telerik.Web.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, a, "Telerik.Web.BoxSide"));
        }
        var c = $telerik._paddingWidthNames[a];
        var d = $telerik.getCurrentStyle(b, c);
        return $telerik.parsePadding(d);
    },
    parseBorderWidth: function(a) {
        if (a) {
            switch (a) {
                case "thin":
                case "medium":
                case "thick":
                    return $telerik._borderThicknesses[a];
                case "inherit":
                    return 0;
            }
            var b = $telerik.parseUnit(a);
            return b.size;
        }
        return 0;
    },
    parsePadding: function(a) {
        if (a) {
            if (a == "auto" || a == "inherit") {
                return 0;
            }
            var b = $telerik.parseUnit(a);
            return b.size;
        }
        return 0;
    },
    parseUnit: function(g) {
        if (!g) {
            throw Error.argumentNull("value");
        }
        g = g.trim().toLowerCase();
        var c = g.length;
        var d = -1;
        for (var b = 0; b < c; b++) {
            var a = g.substr(b, 1);
            if ((a < "0" || a > "9") && a != "-" && a != "." && a != ",") {
                break;
            }
            d = b;
        }
        if (d == -1) {
            throw Error.create("No digits");
        }
        var f;
        var e;
        if (d < (c - 1)) {
            f = g.substring(d + 1).trim();
        } else {
            f = "px";
        }
        e = parseFloat(g.substr(0, d + 1));
        if (f == "px") {
            e = Math.floor(e);
        }
        return {
            size: e,
            type: f
        };
    },
    containsPoint: function(a, b, c) {
        return b >= a.x && b <= (a.x + a.width) && c >= a.y && c <= (a.y + a.height);
    },
    isDescendant: function(a, b) {
        try {
            for (var d = b.parentNode; d != null; d = d.parentNode) {
                if (d == a) {
                    return true;
                }
            }
        } catch (c) {}
        return false;
    },
    isDescendantOrSelf: function(a, b) {
        if (a === b) {
            return true;
        }
        return $telerik.isDescendant(a, b);
    },
    addCssClasses: function(b, a) {
        for (var c = 0; c < a.length; c++) {
            Sys.UI.DomElement.addCssClass(b, a[c]);
        }
    },
    removeCssClasses: function(b, a) {
        for (var c = 0; c < a.length; c++) {
            Sys.UI.DomElement.removeCssClass(b, a[c]);
        }
    },
    getScrollOffset: function(b, e) {
        var c = 0;
        var f = 0;
        var d = b;
        var a = b && b.ownerDocument ? b.ownerDocument : document;
        while (d != null && d.scrollLeft != null) {
            c += $telerik.getCorrectScrollLeft(d);
            f += d.scrollTop;
            if (!e || (d == a.body && (d.scrollLeft != 0 || d.scrollTop != 0))) {
                break;
            }
            d = d.parentNode;
        }
        return {
            x: c,
            y: f
        };
    },
    getElementByClassName: function(d, c, g) {
        if (d.getElementsByClassName) {
            return d.getElementsByClassName(c)[0];
        }
        var b = null;
        if (g) {
            b = d.getElementsByTagName(g);
        } else {
            b = d.getElementsByTagName("*");
        }
        for (var e = 0, f = b.length; e < f; e++) {
            var a = b[e];
            if (Sys.UI.DomElement.containsCssClass(a, c)) {
                return a;
            }
        }
        return null;
    },
    getElementsByClassName: function(b, a, c) {
        if (document.getElementsByClassName) {
            getElementsByClassName = function(d, m, g) {
                g = g || document;
                var f = g.getElementsByClassName(d),
                    k = (m) ? new RegExp("\\b" + m + "\\b", "i") : null,
                    l = [],
                    e;
                for (var h = 0, j = f.length; h < j; h += 1) {
                    e = f[h];
                    if (!k || k.test(e.nodeName)) {
                        l.push(e);
                    }
                }
                return l;
            };
        } else {
            if (document.evaluate) {
                getElementsByClassName = function(g, q, k) {
                    q = q || "*";
                    k = k || document;
                    var d = g.split(" "),
                        f = "",
                        r = "http://www.w3.org/1999/xhtml",
                        n = (document.documentElement.namespaceURI === r) ? r : null,
                        p = [],
                        i, o;
                    for (var l = 0, m = d.length; l < m; l += 1) {
                        f += "[contains(concat(' ', @class, ' '), ' " + d[l] + " ')]";
                    }
                    try {
                        i = document.evaluate(".//" + q + f, k, n, 0, null);
                    } catch (h) {
                        i = document.evaluate(".//" + q + f, k, null, 0, null);
                    }
                    while ((o = i.iterateNext())) {
                        p.push(o);
                    }
                    return p;
                };
            } else {
                getElementsByClassName = function(f, u, i) {
                    u = u || "*";
                    i = i || document;
                    var d = f.split(" "),
                        e = [],
                        h = (u === "*" && i.all) ? i.all : i.getElementsByTagName(u),
                        g, t = [],
                        r;
                    for (var j = 0, n = d.length; j < n; j += 1) {
                        e.push(new RegExp("(^|\\s)" + d[j] + "(\\s|$)"));
                    }
                    for (var o = 0, p = h.length; o < p; o += 1) {
                        g = h[o];
                        r = false;
                        for (var q = 0, s = e.length; q < s; q += 1) {
                            r = e[q].test(g.className);
                            if (!r) {
                                break;
                            }
                        }
                        if (r) {
                            t.push(g);
                        }
                    }
                    return t;
                };
            }
        }
        return getElementsByClassName(a, c, b);
    },
    _getWindow: function(b) {
        var a = b.ownerDocument || b.document || b;
        return a.defaultView || a.parentWindow;
    },
    useAttachEvent: function(a) {
        return (a.attachEvent && !$telerik.isOpera);
    },
    useDetachEvent: function(a) {
        return (a.detachEvent && !$telerik.isOpera);
    },
    addHandler: function(e, g, h, a) {
        if (!e._events) {
            e._events = {};
        }
        var f = e._events[g];
        if (!f) {
            e._events[g] = f = [];
        }
        var b;
        if ($telerik.useAttachEvent(e)) {
            b = function() {
                var d = {};
                try {
                    d = $telerik._getWindow(e).event;
                } catch (i) {}
                return h.call(e, new Sys.UI.DomEvent(d));
            };
            e.attachEvent("on" + g, b);
        } else {
            if (e.addEventListener) {
                b = function(d) {
                    return h.call(e, new Sys.UI.DomEvent(d));
                };
                e.addEventListener(g, b, false);
            }
        }
        f[f.length] = {
            handler: h,
            browserHandler: b,
            autoRemove: a
        };
        if (a) {
            var c = e.dispose;
            if (c !== $telerik._disposeHandlers) {
                e.dispose = $telerik._disposeHandlers;
                if (typeof(c) !== "undefined") {
                    e._chainDispose = c;
                }
            }
        }
    },
    addHandlers: function(b, c, e, a) {
        for (var f in c) {
            var d = c[f];
            if (e) {
                d = Function.createDelegate(e, d);
            }
            $telerik.addHandler(b, f, d, a || false);
        }
    },
    clearHandlers: function(a) {
        $telerik._clearHandlers(a, false);
    },
    _clearHandlers: function(c, a) {
        if (c._events) {
            var b = c._events;
            for (var g in b) {
                var e = b[g];
                for (var f = e.length - 1; f >= 0; f--) {
                    var d = e[f];
                    if (!a || d.autoRemove) {
                        $telerik.removeHandler(c, g, d.handler);
                    }
                }
            }
            c._events = null;
        }
    },
    _disposeHandlers: function() {
        $telerik._clearHandlers(this, true);
        var a = this._chainDispose,
            b = typeof(a);
        if (b !== "undefined") {
            this.dispose = a;
            this._chainDispose = null;
            if (b === "function") {
                this.dispose();
            }
        }
    },
    removeHandler: function(a, b, c) {
        $telerik._removeHandler(a, b, c);
    },
    _removeHandler: function(c, d, e) {
        var a = null;
        var b = c._events[d] || [];
        for (var f = 0, g = b.length; f < g; f++) {
            if (b[f].handler === e) {
                a = b[f].browserHandler;
                break;
            }
        }
        if ($telerik.useDetachEvent(c)) {
            c.detachEvent("on" + d, a);
        } else {
            if (c.removeEventListener) {
                c.removeEventListener(d, a, false);
            }
        }
        b.splice(f, 1);
    },
    _emptySrc: function() {
        return "about:blank";
    },
    addExternalHandler: function(a, b, c) {
        if (!a) {
            return;
        }
        if ($telerik.useAttachEvent(a)) {
            a.attachEvent("on" + b, c);
        } else {
            if (a.addEventListener) {
                a.addEventListener(b, c, false);
            }
        }
    },
    removeExternalHandler: function(a, b, c) {
        if (!a) {
            return;
        }
        if ($telerik.useDetachEvent(a)) {
            a.detachEvent("on" + b, c);
        } else {
            if (a.addEventListener) {
                a.removeEventListener(b, c, false);
            }
        }
    },
    addMobileHandler: function(g, b, c, d, f, e) {
        if (!b || !g) {
            return;
        }
        var a = Function.createDelegate(g, $telerik.isTouchDevice ? (f || d) : d);
        if ($telerik.isTouchDevice) {
            if ($telerik.$) {
                $telerik.$(b).bind($telerik.getMobileEventCounterpart(c), a);
            } else {
                $telerik.addExternalHandler(b, $telerik.getMobileEventCounterpart(c), a);
            }
        } else {
            if (e) {
                $telerik.addExternalHandler(b, c, a);
            } else {
                $addHandler(b, c, a);
            }
        }
        return a;
    },
    removeMobileHandler: function(a, b, c, e, d) {
        if (!a) {
            return;
        }
        if ($telerik.isTouchDevice) {
            if ($telerik.$) {
                $telerik.$(a).unbind($telerik.getMobileEventCounterpart(b), (e || c));
            } else {
                $telerik.removeExternalHandler(a, $telerik.getMobileEventCounterpart(b), (e || c));
            }
        } else {
            if (d) {
                $telerik.removeExternalHandler(a, b, c);
            } else {
                $removeHandler(a, b, c);
            }
        }
    },
    getMobileEventCounterpart: function(a) {
        switch (a) {
            case "mousedown":
                return $telerik.isMobileIE10 ? "MSPointerDown" : "touchstart";
            case "mouseup":
                return $telerik.isMobileIE10 ? "MSPointerUp" : "touchend";
            case "mousemove":
                return $telerik.isMobileIE10 ? "MSPointerMove" : "touchmove";
        }
        return a;
    },
    getTouchEventLocation: function(b) {
        var d = arguments[1],
            f = d ? [d + "X"] : "pageX",
            g = d ? [d + "Y"] : "pageY",
            c = {
                x: b[f],
                y: b[g]
            },
            a = b.changedTouches || (b.originalEvent ? b.originalEvent.changedTouches : b.rawEvent ? b.rawEvent.changedTouches : false);
        if ($telerik.isTouchDevice && a && a.length < 2) {
            c.x = a[0][f];
            c.y = a[0][g];
        }
        if ($telerik.isMobileIE10 && b.originalEvent) {
            c.x = b.originalEvent[f];
            c.y = b.originalEvent[g];
        }
        return c;
    },
    getTouchTarget: function(a) {
        if ($telerik.isTouchDevice) {
            var b = "originalEvent" in a ? a.originalEvent.changedTouches : "rawEvent" in a ? a.rawEvent.changedTouches : a.changedTouches;
            if ($telerik.isAndroid && $telerik.isChrome) {
                return b ? document.elementFromPoint(b[0].screenX, b[0].screenY) : a.target;
            } else {
                return b ? document.elementFromPoint(b[0].clientX, b[0].clientY) : a.target;
            }
        } else {
            return a.target;
        }
    },
    cancelRawEvent: function(a) {
        if (!a) {
            return false;
        }
        if (a.preventDefault) {
            a.preventDefault();
        }
        if (a.stopPropagation) {
            a.stopPropagation();
        }
        a.cancelBubble = true;
        a.returnValue = false;
        return false;
    },
    getOuterHtml: function(a) {
        if (a.outerHTML) {
            return a.outerHTML;
        } else {
            var b = a.cloneNode(true);
            var c = a.ownerDocument.createElement("div");
            c.appendChild(b);
            return c.innerHTML;
        }
    },
    setVisible: function(a, b) {
        if (!a) {
            return;
        }
        if (b != $telerik.getVisible(a)) {
            if (b) {
                if (a.style.removeAttribute) {
                    a.style.removeAttribute("display");
                } else {
                    a.style.removeProperty("display");
                }
            } else {
                a.style.display = "none";
            }
            a.style.visibility = b ? "visible" : "hidden";
        }
    },
    getVisible: function(a) {
        if (!a) {
            return false;
        }
        return (("none" != $telerik.getCurrentStyle(a, "display")) && ("hidden" != $telerik.getCurrentStyle(a, "visibility")));
    },
    getViewPortSize: function() {
        var c = 0;
        var b = 0;
        var a = document.body;
        if (!$telerik.quirksMode && !$telerik.isSafari) {
            a = document.documentElement;
        }
        if (window.innerWidth) {
            c = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
            b = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
            if (c > window.innerWidth) {
                c = document.documentElement.clientWidth;
            }
            if (b > window.innerHeight) {
                b = document.documentElement.clientHeight;
            }
        } else {
            c = a.clientWidth;
            b = a.clientHeight;
        }
        c += a.scrollLeft;
        b += a.scrollTop;
        if ($telerik.isMobileSafari) {
            c += window.pageXOffset;
            b += window.pageYOffset;
        }
        return {
            width: c - 6,
            height: b - 6
        };
    },
    elementOverflowsTop: function(b, a) {
        var c = a || $telerik.getLocation(b);
        return c.y < 0;
    },
    elementOverflowsLeft: function(b, a) {
        var c = a || $telerik.getLocation(b);
        return c.x < 0;
    },
    elementOverflowsBottom: function(e, c, b) {
        var d = b || $telerik.getLocation(c);
        var a = d.y + c.offsetHeight;
        return a > e.height;
    },
    elementOverflowsRight: function(e, b, a) {
        var c = a || $telerik.getLocation(b);
        var d = c.x + b.offsetWidth;
        return d > e.width;
    },
    getDocumentRelativeCursorPosition: function(c) {
        var b = document.documentElement;
        var a = document.body;
        var d = c.clientX + ($telerik.getCorrectScrollLeft(b) + $telerik.getCorrectScrollLeft(a));
        var f = c.clientY + (b.scrollTop + a.scrollTop);
        if ($telerik.isIE && Sys.Browser.version < 8) {
            d -= 2;
            f -= 2;
        }
        return {
            left: d,
            top: f
        };
    },
    evalScriptCode: function(b) {
        if ($telerik.isSafari) {
            b = b.replace(/^\s*<!--((.|\n)*)-->\s*$/mi, "$1");
        }
        var a = document.createElement("script");
        a.setAttribute("type", "text/javascript");
        a.text = b;
        var c = document.getElementsByTagName("head")[0];
        c.appendChild(a);
        a.parentNode.removeChild(a);
    },
    isScriptRegistered: function(k, a) {
        if (!k) {
            return 0;
        }
        if (!a) {
            a = document;
        }
        if ($telerik._uniqueScripts == null) {
            $telerik._uniqueScripts = {};
        }
        var h = document.getElementsByTagName("script");
        var f = 0;
        var c = k.indexOf("?d=");
        var d = k.indexOf("&");
        var j = c > 0 && d > c ? k.substring(c + 3, d) : k;
        if ($telerik._uniqueScripts[j] != null) {
            return 2;
        }
        for (var b = 0, e = h.length; b < e; b++) {
            var g = h[b];
            if (g.src) {
                if (g.getAttribute("src", 2).indexOf(j) != -1) {
                    $telerik._uniqueScripts[j] = true;
                    if (!$telerik.isDescendant(a, g)) {
                        f++;
                    }
                }
            }
        }
        return f;
    },
    evalScripts: function(b, a) {
        $telerik.registerSkins(b);
        var g = b.getElementsByTagName("script");
        var j = 0,
            h = 0;
        var e = function(n, o) {
            if (n - h > 0 && ($telerik.isIE || $telerik.isSafari)) {
                window.setTimeout(function() {
                    e(n, o);
                }, 5);
            } else {
                var i = document.createElement("script");
                i.setAttribute("type", "text/javascript");
                document.getElementsByTagName("head")[0].appendChild(i);
                i.loadFinished = false;
                i.onload = function() {
                    if (!this.loadFinished) {
                        this.loadFinished = true;
                        h++;
                    }
                };
                i.onreadystatechange = function() {
                    if ("loaded" === this.readyState && !this.loadFinished) {
                        this.loadFinished = true;
                        h++;
                    }
                };
                i.setAttribute("src", o);
            }
        };
        var k = [];
        for (var c = 0, d = g.length; c < d; c++) {
            var f = g[c];
            if (f.src) {
                var m = f.getAttribute("src", 2);
                if (!$telerik.isScriptRegistered(m, b)) {
                    e(j++, m);
                }
            } else {
                Array.add(k, f.innerHTML);
            }
        }
        var l = function() {
            if (j - h > 0) {
                window.setTimeout(l, 20);
            } else {
                for (var i = 0; i < k.length; i++) {
                    $telerik.evalScriptCode(k[i]);
                }
                if (a) {
                    a();
                }
            }
        };
        l();
    },
    registerSkins: function(c) {
        if (!c) {
            c = document.body;
        }
        var h = c.getElementsByTagName("link");
        if (h && h.length > 0) {
            var a = document.getElementsByTagName("head")[0];
            if (a) {
                for (var d = 0, g = h.length; d < g; d++) {
                    var k = h[d];
                    if (k.className == "Telerik_stylesheet") {
                        var l = a.getElementsByTagName("link");
                        if (k.href.indexOf("ie7CacheFix") >= 0) {
                            try {
                                k.href = k.href.replace("&ie7CacheFix", "");
                                k.href = k.href.replace("?ie7CacheFix", "");
                            } catch (b) {}
                        }
                        if (l && l.length > 0) {
                            var f = l.length - 1;
                            while (f >= 0 && l[f--].href != k.href) {}
                            if (f >= 0) {
                                continue;
                            }
                        }
                        if ($telerik.isIE && !$telerik.isIE9Mode) {
                            k.parentNode.removeChild(k);
                            k = k.cloneNode(true);
                        }
                        a.appendChild(k);
                        if (g > h.length) {
                            g = h.length;
                            d--;
                        }
                    }
                }
            }
        }
    },
    getFirstChildByTagName: function(b, d, c) {
        if (!b || !b.childNodes) {
            return null;
        }
        var a = b.childNodes[c] || b.firstChild;
        while (a) {
            if (a.nodeType == 1 && a.tagName.toLowerCase() == d) {
                return a;
            }
            a = a.nextSibling;
        }
        return null;
    },
    getChildByClassName: function(c, a, d) {
        var b = c.childNodes[d] || c.firstChild;
        while (b) {
            if (b.nodeType == 1 && b.className.indexOf(a) > -1) {
                return b;
            }
            b = b.nextSibling;
        }
        return null;
    },
    getChildrenByTagName: function(d, g) {
        var c = new Array();
        var b = d.childNodes;
        if ($telerik.isIE) {
            b = d.children;
        }
        for (var e = 0, f = b.length; e < f; e++) {
            var a = b[e];
            if (a.nodeType == 1 && a.tagName.toLowerCase() == g) {
                Array.add(c, a);
            }
        }
        return c;
    },
    getChildrenByClassName: function(e, d) {
        var c = new Array();
        var b = e.childNodes;
        if ($telerik.isIE) {
            b = e.children;
        }
        for (var f = 0, g = b.length; f < g; f++) {
            var a = b[f];
            if (a.nodeType == 1 && a.className.indexOf(d) > -1) {
                Array.add(c, a);
            }
        }
        return c;
    },
    mergeElementAttributes: function(d, e, b) {
        if (!d || !e) {
            return;
        }
        if (d.mergeAttributes) {
            e.mergeAttributes(d, b);
        } else {
            for (var a = 0; a < d.attributes.length; a++) {
                var c = d.attributes[a].nodeValue;
                e.setAttribute(d.attributes[a].nodeName, c);
            }
            if ("" == e.getAttribute("style")) {
                e.removeAttribute("style");
            }
        }
    },
    isMouseOverElement: function(c, b) {
        var d = $telerik.getBounds(c);
        var a = $telerik.getDocumentRelativeCursorPosition(b);
        return $telerik.containsPoint(d, a.left, a.top);
    },
    isMouseOverElementEx: function(b, a) {
        var d = null;
        try {
            d = $telerik.getOuterBounds(b);
        } catch (a) {
            return false;
        }
        if (a && a.target) {
            var f = a.target.tagName;
            if (f == "SELECT" || f == "OPTION") {
                return true;
            }
            if (a.clientX < 0 || a.clientY < 0) {
                return true;
            }
        }
        var c = $telerik.getDocumentRelativeCursorPosition(a);
        d.x += 2;
        d.y += 2;
        d.width -= 4;
        d.height -= 4;
        return $telerik.containsPoint(d, c.left, c.top);
    },
    getPreviousHtmlNode: function(a) {
        if (!a || !a.previousSibling) {
            return null;
        }
        while (a.previousSibling) {
            if (a.previousSibling.nodeType == 1) {
                return a.previousSibling;
            }
            a = a.previousSibling;
        }
    },
    getNextHtmlNode: function(a) {
        if (!a || !a.nextSibling) {
            return null;
        }
        while (a.nextSibling) {
            if (a.nextSibling.nodeType == 1) {
                return a.nextSibling;
            }
            a = a.nextSibling;
        }
    },
    disposeElement: function(a) {
        if (typeof(Sys.WebForms) == "undefined") {
            return;
        }
        var b = Sys.WebForms.PageRequestManager.getInstance();
        if (b && b._destroyTree) {
            b._destroyTree(a);
        } else {
            if (Sys.Application.disposeElement) {
                Sys.Application.disposeElement(a, true);
            }
        }
    },
    htmlEncode: function(d) {
        var a = /&/g,
            c = /</g,
            b = />/g;
        return ("" + d).replace(a, "&amp;").replace(c, "&lt;").replace(b, "&gt;");
    },
    htmlDecode: function(d) {
        var a = /&amp;/g,
            c = /&lt;/g,
            b = /&gt;/g;
        return ("" + d).replace(b, ">").replace(c, "<").replace(a, "&");
    }
};
if (window.$telerik == undefined) {
    window.$telerik = commonScripts;
} else {
    if ($telerik.$ != undefined && $telerik.$.extend) {
        $telerik.$.extend(window.$telerik, commonScripts);
    }
}
window.TelerikCommonScripts = Telerik.Web.CommonScripts = window.$telerik;
if (typeof(Sys.Browser.WebKit) == "undefined") {
    Sys.Browser.WebKit = {};
}
if (typeof(Sys.Browser.Chrome) == "undefined") {
    Sys.Browser.Chrome = {};
}
if (navigator.userAgent.indexOf("Chrome") > -1) {
    Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
    Sys.Browser.agent = Sys.Browser.Chrome;
    Sys.Browser.name = "Chrome";
} else {
    if (navigator.userAgent.indexOf("WebKit/") > -1) {
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        if (Sys.Browser.version < 500) {
            Sys.Browser.agent = Sys.Browser.Safari;
            Sys.Browser.name = "Safari";
        } else {
            Sys.Browser.agent = Sys.Browser.WebKit;
            Sys.Browser.name = "WebKit";
        }
    }
}
$telerik.isMobileSafari = (navigator.userAgent.search(/like\sMac\sOS\sX.*Mobile\/\S+/) != -1);
$telerik.isChrome = Sys.Browser.agent == Sys.Browser.Chrome;
$telerik.isSafari6 = Sys.Browser.agent == Sys.Browser.WebKit && Sys.Browser.version >= 536;
$telerik.isSafari5 = Sys.Browser.agent == Sys.Browser.WebKit && Sys.Browser.version >= 534 && Sys.Browser.version < 536;
$telerik.isSafari4 = Sys.Browser.agent == Sys.Browser.WebKit && Sys.Browser.version >= 526 && Sys.Browser.version < 534;
$telerik.isSafari3 = Sys.Browser.agent == Sys.Browser.WebKit && Sys.Browser.version < 526 && Sys.Browser.version > 500;
$telerik.isSafari2 = Sys.Browser.agent == Sys.Browser.Safari;
$telerik.isSafari = $telerik.isSafari2 || $telerik.isSafari3 || $telerik.isSafari4 || $telerik.isSafari5 || $telerik.isSafari6 || $telerik.isChrome;
$telerik.isAndroid = (navigator.userAgent.search(/Android/i) != -1);
$telerik.isBlackBerry4 = (navigator.userAgent.search(/BlackBerry\d+\/4[\d\.]+/i) != -1);
$telerik.isBlackBerry5 = (navigator.userAgent.search(/BlackBerry\d+\/5[\d\.]+/i) != -1);
$telerik.isBlackBerry6 = (navigator.userAgent.search(/BlackBerry.*Safari\/\S+/i) != -1);
$telerik.isBlackBerry = $telerik.isBlackBerry4 || $telerik.isBlackBerry5 || $telerik.isBlackBerry6;
$telerik.isIE = Sys.Browser.agent == Sys.Browser.InternetExplorer;
$telerik.isIE6 = $telerik.isIE && Sys.Browser.version < 7;
$telerik.isIE7 = $telerik.isIE && (Sys.Browser.version == 7 || (document.documentMode && document.documentMode == 7));
$telerik.isIE8 = $telerik.isIE && (document.documentMode && document.documentMode == 8);
$telerik.isIE9 = $telerik.isIE && (document.documentMode && document.documentMode == 9);
$telerik.isIE9Mode = $telerik.isIE && (document.documentMode && document.documentMode >= 9);
$telerik.isIE10 = $telerik.isIE && (document.documentMode && document.documentMode == 10);
$telerik.isIE10Mode = $telerik.isIE && (document.documentMode && document.documentMode >= 10);
$telerik.isOpera = Sys.Browser.agent == Sys.Browser.Opera;
$telerik.isFirefox = Sys.Browser.agent == Sys.Browser.Firefox;
$telerik.isFirefox2 = $telerik.isFirefox && Sys.Browser.version < 3;
$telerik.isFirefox3 = $telerik.isFirefox && Sys.Browser.version >= 3;
$telerik.quirksMode = $telerik.isIE && document.compatMode != "CSS1Compat";
$telerik.standardsMode = !$telerik.quirksMode;
$telerik.OperaEngine = 0;
$telerik.OperaVersionString = window.opera ? window.opera.version() : 0;
$telerik.OperaVersion = $telerik.OperaVersionString ? (parseInt($telerik.OperaVersionString * 10) / 10) : 0;
if ($telerik.isOpera) {
    $telerik._prestoVersion = navigator.userAgent.match(/Presto\/(\d+\.(\d+)?)/);
    if ($telerik._prestoVersion) {
        $telerik.OperaEngine = parseInt($telerik._prestoVersion[1]) + (parseInt($telerik._prestoVersion[2]) / 100);
    }
}
$telerik.isOpera9 = $telerik.isOpera && $telerik.OperaVerNumber < 10;
$telerik.isOpera10 = $telerik.isOpera && $telerik.OperaVersion >= 10 && $telerik.OperaVersion < 10.5;
$telerik.isOpera105 = $telerik.isOpera && $telerik.OperaVersion >= 10.5;
$telerik.isOpera11 = $telerik.isOpera && $telerik.OperaVersion > 11;
$telerik.isMobileOpera = $telerik.isOpera && (navigator.userAgent.search(/opera (?:mobi|tablet)/i) != -1);
$telerik.isMobileIE10 = $telerik.isIE10 && (navigator.userAgent.search(/\bARM\b;|\bTouch\b/i) != -1);
$telerik.isTouchDevice = $telerik.isMobileSafari || $telerik.isAndroid || $telerik.isBlackBerry6 || $telerik.isMobileOpera;
if ($telerik.isIE9Mode) {
    document.documentElement.className += " _Telerik_IE9";
}
if ($telerik.isOpera11) {
    document.documentElement.className += " _Telerik_Opera11";
} else {
    if ($telerik.isOpera105) {
        document.documentElement.className += " _Telerik_Opera105";
    }
}
if (document.documentElement.getBoundingClientRect) {
    $telerik.originalGetLocation = function(g) {
        var d = Function._validateParams(arguments, [{
            name: "element",
            domElement: true
        }]);
        if (d) {
            throw d;
        }
        if (g.self || g.nodeType === 9 || (g === document.documentElement) || (g.parentNode === g.ownerDocument.documentElement)) {
            return new Sys.UI.Point(0, 0);
        }
        var b = g.getBoundingClientRect();
        if (!b) {
            return new Sys.UI.Point(0, 0);
        }
        var c = g.ownerDocument.documentElement,
            k = Math.round(b.left) + c.scrollLeft,
            l = Math.round(b.top) + c.scrollTop;
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            try {
                var i = g.ownerDocument.parentWindow.frameElement || null;
                if (i) {
                    var j = (i.frameBorder === "0" || i.frameBorder === "no") ? 2 : 0;
                    k += j;
                    l += j;
                }
            } catch (h) {}
            if (Sys.Browser.version === 7 && !document.documentMode) {
                var a = document.body,
                    m = a.getBoundingClientRect(),
                    n = (m.right - m.left) / a.clientWidth;
                n = Math.round(n * 100);
                n = (n - n % 5) / 100;
                if (!isNaN(n) && (n !== 1)) {
                    k = Math.round(k / n);
                    l = Math.round(l / n);
                }
            }
            if ((document.documentMode || 0) < 8) {
                k -= c.clientLeft;
                l -= c.clientTop;
            }
        }
        return new Sys.UI.Point(k, l);
    };
} else {
    if ($telerik.isSafari) {
        $telerik.originalGetLocation = function(c) {
            var b = Function._validateParams(arguments, [{
                name: "element",
                domElement: true
            }]);
            if (b) {
                throw b;
            }
            if ((c.window && (c.window === c)) || c.nodeType === 9) {
                return new Sys.UI.Point(0, 0);
            }
            var f = 0,
                g = 0,
                h, j = null,
                k = null,
                a;
            for (h = c; h; j = h, k = a, h = h.offsetParent) {
                a = Sys.UI.DomElement._getCurrentStyle(h);
                var l = h.tagName ? h.tagName.toUpperCase() : null;
                if ((h.offsetLeft || h.offsetTop) && ((l !== "BODY") || (!k || k.position !== "absolute"))) {
                    f += h.offsetLeft;
                    g += h.offsetTop;
                }
                if (j && Sys.Browser.version >= 3) {
                    f += parseInt(a.borderLeftWidth);
                    g += parseInt(a.borderTopWidth);
                }
            }
            a = Sys.UI.DomElement._getCurrentStyle(c);
            var d = a ? a.position : null;
            if (!d || (d !== "absolute")) {
                for (h = c.parentNode; h; h = h.parentNode) {
                    l = h.tagName ? h.tagName.toUpperCase() : null;
                    if ((l !== "BODY") && (l !== "HTML") && (h.scrollLeft || h.scrollTop)) {
                        f -= (h.scrollLeft || 0);
                        g -= (h.scrollTop || 0);
                    }
                    a = Sys.UI.DomElement._getCurrentStyle(h);
                    var i = a ? a.position : null;
                    if (i && (i === "absolute")) {
                        break;
                    }
                }
            }
            return new Sys.UI.Point(f, g);
        };
    } else {
        $telerik.originalGetLocation = function(c) {
            var b = Function._validateParams(arguments, [{
                name: "element",
                domElement: true
            }]);
            if (b) {
                throw b;
            }
            if ((c.window && (c.window === c)) || c.nodeType === 9) {
                return new Sys.UI.Point(0, 0);
            }
            var f = 0,
                g = 0,
                h, i = null,
                j = null,
                a = null;
            for (h = c; h; i = h, j = a, h = h.offsetParent) {
                var k = h.tagName ? h.tagName.toUpperCase() : null;
                a = Sys.UI.DomElement._getCurrentStyle(h);
                if ((h.offsetLeft || h.offsetTop) && !((k === "BODY") && (!j || j.position !== "absolute"))) {
                    f += h.offsetLeft;
                    g += h.offsetTop;
                }
                if (i !== null && a) {
                    if ((k !== "TABLE") && (k !== "TD") && (k !== "HTML")) {
                        f += parseInt(a.borderLeftWidth) || 0;
                        g += parseInt(a.borderTopWidth) || 0;
                    }
                    if (k === "TABLE" && (a.position === "relative" || a.position === "absolute")) {
                        f += parseInt(a.marginLeft) || 0;
                        g += parseInt(a.marginTop) || 0;
                    }
                }
            }
            a = Sys.UI.DomElement._getCurrentStyle(c);
            var d = a ? a.position : null;
            if (!d || (d !== "absolute")) {
                for (h = c.parentNode; h; h = h.parentNode) {
                    k = h.tagName ? h.tagName.toUpperCase() : null;
                    if ((k !== "BODY") && (k !== "HTML") && (h.scrollLeft || h.scrollTop)) {
                        f -= (h.scrollLeft || 0);
                        g -= (h.scrollTop || 0);
                        a = Sys.UI.DomElement._getCurrentStyle(h);
                        if (a) {
                            f += parseInt(a.borderLeftWidth) || 0;
                            g += parseInt(a.borderTopWidth) || 0;
                        }
                    }
                }
            }
            return new Sys.UI.Point(f, g);
        };
    }
}
Sys.Application.add_init(function() {
    try {
        $telerik._borderThickness();
    } catch (a) {}
});
Telerik.Web.UI.Orientation = function() {
    throw Error.invalidOperation();
};
Telerik.Web.UI.Orientation.prototype = {
    Horizontal: 0,
    Vertical: 1
};
Telerik.Web.UI.Orientation.registerEnum("Telerik.Web.UI.Orientation", false);
Telerik.Web.UI.RenderMode = function() {
    throw Error.invalidOperation();
};
Telerik.Web.UI.RenderMode.prototype = {
    Classic: 0,
    Lite: 1,
    Native: 2
};
Telerik.Web.UI.RenderMode.registerEnum("Telerik.Web.UI.RenderMode", false);
Telerik.Web.UI.RadWebControl = function(a) {
    Telerik.Web.UI.RadWebControl.initializeBase(this, [a]);
    this._clientStateFieldID = null;
    this._renderMode = Telerik.Web.UI.RenderMode.Classic;
    this._shouldUpdateClientState = true;
    this._invisibleParents = [];
};
Telerik.Web.UI.RadWebControl.prototype = {
    initialize: function() {
        Telerik.Web.UI.RadWebControl.callBaseMethod(this, "initialize");
        $telerik.registerControl(this);
        if (!this.get_clientStateFieldID()) {
            return;
        }
        var a = $get(this.get_clientStateFieldID());
        if (!a) {
            return;
        }
        a.setAttribute("autocomplete", "off");
    },
    dispose: function() {
        $telerik.unregisterControl(this);
        var c = this.get_element();
        this._clearParentShowHandlers();
        Telerik.Web.UI.RadWebControl.callBaseMethod(this, "dispose");
        if (c) {
            c.control = null;
            var a = true;
            if (c._events) {
                for (var b in c._events) {
                    if (c._events[b].length > 0) {
                        a = false;
                        break;
                    }
                }
                if (a) {
                    c._events = null;
                }
            }
        }
    },
    raiseEvent: function(b, a) {
        var c = this.get_events().getHandler(b);
        if (c) {
            if (!a) {
                a = Sys.EventArgs.Empty;
            }
            c(this, a);
        }
    },
    updateClientState: function() {
        if (this._shouldUpdateClientState) {
            this.set_clientState(this.saveClientState());
        }
    },
    saveClientState: function() {
        return null;
    },
    get_clientStateFieldID: function() {
        return this._clientStateFieldID;
    },
    set_clientStateFieldID: function(a) {
        if (this._clientStateFieldID != a) {
            this._clientStateFieldID = a;
            this.raisePropertyChanged("ClientStateFieldID");
        }
    },
    get_clientState: function() {
        if (this._clientStateFieldID) {
            var a = document.getElementById(this._clientStateFieldID);
            if (a) {
                return a.value;
            }
        }
        return null;
    },
    set_clientState: function(b) {
        if (this._clientStateFieldID) {
            var a = document.getElementById(this._clientStateFieldID);
            if (a) {
                a.value = b;
            }
        }
    },
    repaint: function() {},
    canRepaint: function() {
        return this.get_element().offsetWidth > 0;
    },
    add_parentShown: function(a) {
        var b = $telerik.getInvisibleParent(a);
        if (!b) {
            return;
        }
        if (!Array.contains(this._invisibleParents, b)) {
            Array.add(this._invisibleParents, b);
            this._handleHiddenParent(true, b);
        }
    },
    remove_parentShown: function(a) {
        Array.remove(this._invisibleParents, a);
        this._handleHiddenParent(false, a);
    },
    _handleHiddenParent: function(e, d) {
        if (!d) {
            return;
        }
        if (!this._parentShowDelegate) {
            this._parentShowDelegate = Function.createDelegate(this, this._parentShowHandler);
        }
        var a = this._parentShowDelegate;
        var b = "DOMAttrModified";
        if ($telerik.isIE) {
            b = "propertychange";
        }
        var c = e ? $telerik.addExternalHandler : $telerik.removeExternalHandler;
        c(d, b, a);
    },
    _parentShowHandler: function(b) {
        if ($telerik.isIE) {
            if (b.rawEvent) {
                var b = b.rawEvent;
            }
            if (!b || !b.srcElement || !b.propertyName) {
                return;
            }
            var d = b.srcElement;
            if (b.propertyName == "style.display" || b.propertyName == "className") {
                var a = $telerik.getCurrentStyle(d, "display");
                if (a != "none") {
                    b.target = d;
                    this._runWhenParentShows(b);
                }
            }
        } else {
            if (b.attrName == "style" || b.attrName == "class") {
                var c = b.target;
                if ((b.currentTarget == b.target) && ("none" != $telerik.getCurrentStyle(c, "display"))) {
                    window.setTimeout(Function.createDelegate(this, function() {
                        this._runWhenParentShows(b);
                    }), 0);
                }
            }
        }
    },
    _runWhenParentShows: function(a) {
        var b = a.target;
        this.remove_parentShown(b);
        this.repaint();
    },
    _clearParentShowHandlers: function() {
        var a = this._invisibleParents;
        for (var b = 0; b < a.length; b++) {
            this.remove_parentShown(a[b]);
        }
        this._invisibleParents = [];
        this._parentShowDelegate = null;
    },
    _getChildElement: function(a) {
        return $get(this.get_id() + "_" + a);
    },
    _findChildControl: function(a) {
        return $find(this.get_id() + "_" + a);
    }
};
Telerik.Web.UI.RadWebControl.registerClass("Telerik.Web.UI.RadWebControl", Sys.UI.Control);
Telerik.Web.Timer = function() {
    Telerik.Web.Timer.initializeBase(this);
    this._interval = 1000;
    this._enabled = false;
    this._timer = null;
    this._timerCallbackDelegate = Function.createDelegate(this, this._timerCallback);
};
Telerik.Web.Timer.prototype = {
    get_interval: function() {
        return this._interval;
    },
    set_interval: function(a) {
        if (this._interval !== a) {
            this._interval = a;
            this.raisePropertyChanged("interval");
            if (!this.get_isUpdating() && (this._timer !== null)) {
                this._stopTimer();
                this._startTimer();
            }
        }
    },
    get_enabled: function() {
        return this._enabled;
    },
    set_enabled: function(a) {
        if (a !== this.get_enabled()) {
            this._enabled = a;
            this.raisePropertyChanged("enabled");
            if (!this.get_isUpdating()) {
                if (a) {
                    this._startTimer();
                } else {
                    this._stopTimer();
                }
            }
        }
    },
    add_tick: function(a) {
        this.get_events().addHandler("tick", a);
    },
    remove_tick: function(a) {
        this.get_events().removeHandler("tick", a);
    },
    dispose: function() {
        this.set_enabled(false);
        this._stopTimer();
        Telerik.Web.Timer.callBaseMethod(this, "dispose");
    },
    updated: function() {
        Telerik.Web.Timer.callBaseMethod(this, "updated");
        if (this._enabled) {
            this._stopTimer();
            this._startTimer();
        }
    },
    _timerCallback: function() {
        var a = this.get_events().getHandler("tick");
        if (a) {
            a(this, Sys.EventArgs.Empty);
        }
    },
    _startTimer: function() {
        this._timer = window.setInterval(this._timerCallbackDelegate, this._interval);
    },
    _stopTimer: function() {
        window.clearInterval(this._timer);
        this._timer = null;
    }
};
Telerik.Web.Timer.registerClass("Telerik.Web.Timer", Sys.Component);
Telerik.Web.BoxSide = function() {};
Telerik.Web.BoxSide.prototype = {
    Top: 0,
    Right: 1,
    Bottom: 2,
    Left: 3
};
Telerik.Web.BoxSide.registerEnum("Telerik.Web.BoxSide", false);
Telerik.Web.UI.WebServiceLoaderEventArgs = function(a) {
    Telerik.Web.UI.WebServiceLoaderEventArgs.initializeBase(this);
    this._context = a;
};
Telerik.Web.UI.WebServiceLoaderEventArgs.prototype = {
    get_context: function() {
        return this._context;
    }
};
Telerik.Web.UI.WebServiceLoaderEventArgs.registerClass("Telerik.Web.UI.WebServiceLoaderEventArgs", Sys.EventArgs);
Telerik.Web.UI.WebServiceLoaderSuccessEventArgs = function(b, a) {
    Telerik.Web.UI.WebServiceLoaderSuccessEventArgs.initializeBase(this, [a]);
    this._data = b;
};
Telerik.Web.UI.WebServiceLoaderSuccessEventArgs.prototype = {
    get_data: function() {
        return this._data;
    }
};
Telerik.Web.UI.WebServiceLoaderSuccessEventArgs.registerClass("Telerik.Web.UI.WebServiceLoaderSuccessEventArgs", Telerik.Web.UI.WebServiceLoaderEventArgs);
Telerik.Web.UI.WebServiceLoaderErrorEventArgs = function(b, a) {
    Telerik.Web.UI.WebServiceLoaderErrorEventArgs.initializeBase(this, [a]);
    this._message = b;
};
Telerik.Web.UI.WebServiceLoaderErrorEventArgs.prototype = {
    get_message: function() {
        return this._message;
    }
};
Telerik.Web.UI.WebServiceLoaderErrorEventArgs.registerClass("Telerik.Web.UI.WebServiceLoaderErrorEventArgs", Telerik.Web.UI.WebServiceLoaderEventArgs);
Telerik.Web.UI.WebServiceLoader = function(a) {
    this._webServiceSettings = a;
    this._events = null;
    this._onWebServiceSuccessDelegate = Function.createDelegate(this, this._onWebServiceSuccess);
    this._onWebServiceErrorDelegate = Function.createDelegate(this, this._onWebServiceError);
    this._currentRequest = null;
};
Telerik.Web.UI.WebServiceLoader.prototype = {
    get_webServiceSettings: function() {
        return this._webServiceSettings;
    },
    get_events: function() {
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },
    loadData: function(b, a) {
        var c = this.get_webServiceSettings();
        this.invokeMethod(c.get_method(), b, a);
    },
    invokeMethod: function(d, b, a) {
        var f = this.get_webServiceSettings();
        if (f.get_isEmpty()) {
            alert("Please, specify valid web service and method.");
            return;
        }
        this._raiseEvent("loadingStarted", new Telerik.Web.UI.WebServiceLoaderEventArgs(a));
        var e = f.get_path();
        var c = f.get_useHttpGet();
        this._currentRequest = Sys.Net.WebServiceProxy.invoke(e, d, c, b, this._onWebServiceSuccessDelegate, this._onWebServiceErrorDelegate, a);
    },
    add_loadingStarted: function(a) {
        this.get_events().addHandler("loadingStarted", a);
    },
    add_loadingError: function(a) {
        this.get_events().addHandler("loadingError", a);
    },
    add_loadingSuccess: function(a) {
        this.get_events().addHandler("loadingSuccess", a);
    },
    _serializeDictionaryAsKeyValuePairs: function(a) {
        var c = [];
        for (var b in a) {
            c[c.length] = {
                Key: b,
                Value: a[b]
            };
        }
        return c;
    },
    _onWebServiceSuccess: function(b, a) {
        var c = new Telerik.Web.UI.WebServiceLoaderSuccessEventArgs(b, a);
        this._raiseEvent("loadingSuccess", c);
    },
    _onWebServiceError: function(b, a) {
        var c = new Telerik.Web.UI.WebServiceLoaderErrorEventArgs(b.get_message(), a);
        this._raiseEvent("loadingError", c);
    },
    _raiseEvent: function(b, a) {
        var c = this.get_events().getHandler(b);
        if (c) {
            if (!a) {
                a = Sys.EventArgs.Empty;
            }
            c(this, a);
        }
    }
};
Telerik.Web.UI.WebServiceLoader.registerClass("Telerik.Web.UI.WebServiceLoader");
Telerik.Web.UI.WebServiceSettings = function(a) {
    this._path = null;
    this._method = null;
    this._useHttpGet = false;
    this._odata = false;
    if (!a) {
        a = {};
    }
    if (typeof(a.path) != "undefined") {
        this._path = a.path;
    }
    if (typeof(a.method) != "undefined") {
        this._method = a.method;
    }
    if (typeof(a.useHttpGet) != "undefined") {
        this._useHttpGet = a.useHttpGet;
    }
};
Telerik.Web.UI.WebServiceSettings.prototype = {
    get_isWcf: function() {
        return /\.svc$/.test(this._path) && !this.get_isOData();
    },
    get_isOData: function() {
        return this._odata;
    },
    get_path: function() {
        return this._path;
    },
    set_path: function(a) {
        this._path = a;
    },
    get_method: function() {
        return this._method;
    },
    set_method: function(a) {
        this._method = a;
    },
    get_useHttpGet: function() {
        return this._useHttpGet;
    },
    set_useHttpGet: function(a) {
        this._useHttpGet = a;
    },
    get_isEmpty: function() {
        var b = this.get_path();
        var a = this.get_method();
        return (!(b && a));
    }
};
Telerik.Web.UI.WebServiceSettings.registerClass("Telerik.Web.UI.WebServiceSettings");
Telerik.Web.UI.CallbackLoader = function(a) {
    this._callbackSettings = a;
};
Telerik.Web.UI.CallbackLoader.prototype = {
    invokeCallbackMethod: function() {
        WebForm_DoCallback(this._callbackSettings._id, this._callbackSettings._arguments, this._callbackSettings._onCallbackSuccess, this._callbackSettings._context, this._callbackSettings._onCallbackError, this._callbackSettings._isAsync);
    }
};
Telerik.Web.UI.CallbackLoader.registerClass("Telerik.Web.UI.CallbackLoader");
Telerik.Web.UI.CallbackSettings = function(a) {
    this._id = a.id;
    this._arguments = a.arguments;
    this._onCallbackSuccess = a.onCallbackSuccess;
    this._context = a.context;
    this._onCallbackError = a.onCallbackError;
    this._isAsync = a.isAsync;
};
Telerik.Web.UI.CallbackSettings.registerClass("Telerik.Web.UI.CallbackSettings");
Telerik.Web.UI.ActionsManager = function(a) {
    Telerik.Web.UI.ActionsManager.initializeBase(this);
    this._actions = [];
    this._currentActionIndex = -1;
};
Telerik.Web.UI.ActionsManager.prototype = {
    get_actions: function() {
        return this._actions;
    },
    shiftPointerLeft: function() {
        this._currentActionIndex--;
    },
    shiftPointerRight: function() {
        this._currentActionIndex++;
    },
    get_currentAction: function() {
        return this.get_actions()[this._currentActionIndex];
    },
    get_nextAction: function() {
        return this.get_actions()[this._currentActionIndex + 1];
    },
    addAction: function(a) {
        if (a) {
            var b = new Telerik.Web.UI.ActionsManagerEventArgs(a);
            this.raiseEvent("executeAction", b);
            this._clearActionsToRedo();
            Array.add(this._actions, a);
            this._currentActionIndex = this._actions.length - 1;
            return true;
        }
        return false;
    },
    undo: function(d) {
        if (d == null) {
            d = 1;
        }
        if (d > this._actions.length) {
            d = this._actions.length;
        }
        var c = 0;
        var a = null;
        while (0 < d-- && 0 <= this._currentActionIndex && this._currentActionIndex < this._actions.length) {
            a = this._actions[this._currentActionIndex--];
            if (a) {
                var b = new Telerik.Web.UI.ActionsManagerEventArgs(a);
                this.raiseEvent("undoAction", b);
                c++;
            }
        }
    },
    redo: function(e) {
        if (e == null) {
            e = 1;
        }
        if (e > this._actions.length) {
            e = this._actions.length;
        }
        var d = 0;
        var a = null;
        var b = this._currentActionIndex + 1;
        while (0 < e-- && 0 <= b && b < this._actions.length) {
            a = this._actions[b];
            if (a) {
                var c = new Telerik.Web.UI.ActionsManagerEventArgs(a);
                this.raiseEvent("redoAction", c);
                this._currentActionIndex = b;
                d++;
            }
            b++;
        }
    },
    removeActionAt: function(a) {
        this._actions.splice(a, 1);
        if (this._currentActionIndex >= a) {
            this._currentActionIndex--;
        }
    },
    canUndo: function() {
        return (-1 < this._currentActionIndex);
    },
    canRedo: function() {
        return (this._currentActionIndex < this._actions.length - 1);
    },
    getActionsToUndo: function() {
        if (this.canUndo()) {
            return (this._actions.slice(0, this._currentActionIndex + 1)).reverse();
        }
        return [];
    },
    getActionsToRedo: function() {
        if (this.canRedo()) {
            return this._actions.slice(this._currentActionIndex + 1);
        }
        return [];
    },
    _clearActionsToRedo: function() {
        if (this.canRedo()) {
            var a = this._currentActionIndex + 2;
            if (a < this._actions.length) {
                this._actions.splice(a, this._actions.length - a);
            }
        }
    },
    add_undoAction: function(a) {
        this.get_events().addHandler("undoAction", a);
    },
    remove_undoAction: function(a) {
        this.get_events().removeHandler("undoAction", a);
    },
    add_redoAction: function(a) {
        this.get_events().addHandler("redoAction", a);
    },
    remove_redoAction: function(a) {
        this.get_events().removeHandler("redoAction", a);
    },
    add_executeAction: function(a) {
        this.get_events().addHandler("executeAction", a);
    },
    remove_executeAction: function(a) {
        this.get_events().removeHandler("executeAction", a);
    },
    raiseEvent: function(b, a) {
        var c = this.get_events().getHandler(b);
        if (c) {
            c(this, a);
        }
    }
};
Telerik.Web.UI.ActionsManager.registerClass("Telerik.Web.UI.ActionsManager", Sys.Component);
Telerik.Web.UI.ActionsManagerEventArgs = function(a) {
    Telerik.Web.UI.ActionsManagerEventArgs.initializeBase(this);
    this._action = a;
};
Telerik.Web.UI.ActionsManagerEventArgs.prototype = {
    get_action: function() {
        return this._action;
    }
};
Telerik.Web.UI.ActionsManagerEventArgs.registerClass("Telerik.Web.UI.ActionsManagerEventArgs", Sys.CancelEventArgs);
Telerik.Web.StringBuilder = function(a) {
    this._buffer = a || [];
};
Telerik.Web.StringBuilder.prototype = {
    append: function(b) {
        for (var a = 0; a < arguments.length; a++) {
            this._buffer[this._buffer.length] = arguments[a];
        }
        return this;
    },
    toString: function() {
        return this._buffer.join("");
    },
    get_buffer: function() {
        return this._buffer;
    }
};
(function() {
    function g() {
        if ($telerik.$) {
            return $telerik.$.extend.apply($telerik.$, arguments);
        }
        var n = arguments[0] && typeof(arguments[0]) === "object" ? arguments[0] : {};
        for (var k = 1; k < arguments.length; k++) {
            var m = arguments[k];
            if (m != null) {
                for (var l in m) {
                    var j = m[l];
                    if (typeof(j) !== "undefined") {
                        n[l] = j;
                    }
                }
            }
        }
        return n;
    }

    function b(j, l) {
        if (l) {
            return "'" + j.split("'").join("\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + "'";
        } else {
            var i = j.charAt(0),
                k = j.substring(1);
            if (i === "=") {
                return "+(" + k + ")+";
            } else {
                if (i === ":") {
                    return "+e(" + k + ")+";
                } else {
                    return ";" + j + ";o+=";
                }
            }
        }
    }
    var a = /^\w+/,
        d = /\${([^}]*)}/g,
        e = /\\}/g,
        c = /__CURLY__/g,
        f = /\\#/g,
        h = /__SHARP__/g;
    Telerik.Web.UI.Template = {
        paramName: "data",
        useWithBlock: true,
        render: function(m, i) {
            var k, l, j = "";
            for (k = 0, l = i.length; k < l; k++) {
                j += m(i[k]);
            }
            return j;
        },
        compile: function(r, m) {
            var q = g({}, this, m),
                n = q.paramName,
                i = n.match(a)[0],
                s = q.useWithBlock,
                k = "var o,e=$telerik.htmlEncode;",
                p, o, l;
            if (typeof(r) === "function") {
                if (r.length === 2) {
                    return function(t) {
                        return r($telerik.$ || jQuery, {
                            data: t
                        }).join("");
                    };
                }
                return r;
            }
            k += s ? "with(" + n + "){" : "";
            k += "o=";
            p = r.replace(e, "__CURLY__").replace(d, "#=e($1)#").replace(c, "}").replace(f, "__SHARP__").split("#");
            for (l = 0; l < p.length; l++) {
                k += b(p[l], l % 2 === 0);
            }
            k += s ? ";}" : ";";
            k += "return o;";
            k = k.replace(h, "#");
            try {
                return new Function(i, k);
            } catch (j) {
                throw new Error(String.format("Invalid template:'{0}' Generated code:'{1}'", r, k));
            }
        }
    };
})();
(function() {
    if (Sys && Sys.WebForms && Sys.WebForms.PageRequestManager) {
        Sys.WebForms.PageRequestManager.prototype._onFormElementClick = function(a) {
            if ($telerik.isIE10) {
                this._activeDefaultButtonClicked = (a.target === this._activeDefaultButton);
                this._onFormElementActive(a.target, parseInt(a.offsetX), parseInt(a.offsetY));
            } else {
                this._activeDefaultButtonClicked = (a.target === this._activeDefaultButton);
                this._onFormElementActive(a.target, a.offsetX, a.offsetY);
            }
        };
    }
}());
Type.registerNamespace("Telerik.Web");
Type.registerNamespace("Telerik.Web.UI");
Telerik.Web.UI.ModalExtender = function(a) {
    this._windowResizeDelegate = null;
    this._windowScrollDelegate = null;
    this._xCoordinate = -1;
    this._yCoordinate = -1;
    this._backgroundElement = null;
    this._foregroundElement = a;
    this._saveTabIndexes = new Array();
    this._saveDesableSelect = new Array();
    this._tagWithTabIndex = new Array("A", "AREA", "BUTTON", "INPUT", "OBJECT", "SELECT", "TEXTAREA", "IFRAME");
};
Telerik.Web.UI.ModalExtender.prototype = {
    dispose: function() {
        this.hide();
        this._backgroundElement = null;
        this._foregroundElement = null;
    },
    show: function() {
        var a = this._getModalOverlay();
        if ($telerik.getVisible(a)) {
            return;
        }
        this._attachWindowHandlers(true);
        var b = this._foregroundElement;
        b.parentNode.appendChild(a);
        var c = $telerik.getCurrentStyle(b, "zIndex");
        if (!isNaN(parseInt(c))) {
            a.style.zIndex = c - 1;
        }
        a.style.display = "";
        this._disableTab();
        this._updatePageLayout();
        this._updatePageLayout();
    },
    _storeBrowserPosition: function() {
        var a = document.body;
        var b = document.documentElement;
        this._browserTop = a.scrollTop > b.scrollTop ? a.scrollTop : b.scrollTop;
        this._browserLeft = a.scrollLeft > b.scrollLeft ? a.scrollTop : b.scrollLeft;
    },
    _restoreBrowserPosition: function(b, e) {
        try {
            if (null == b) {
                b = this._browserLeft;
            }
            if (null == e) {
                e = this._browserTop;
            }
            var c = document.body;
            var d = document.documentElement;
            c.scrollTop = e;
            c.scrollLeft = b;
            d.scrollTop = e;
            d.scrollLeft = b;
        } catch (a) {}
    },
    hide: function() {
        this._restoreTab();
        this._attachWindowHandlers(false);
        var a = this._backgroundElement;
        if (a) {
            if (a.parentNode) {
                a.parentNode.removeChild(a);
            }
            this._backgroundElement = null;
        }
    },
    _enableScroll: function(a) {
        if (a) {
            document.body.style.overflow = null != this._overflow ? this._overflow : "";
            document.documentElement.style.overflow = null != this._documentOverflow ? this._documentOverflow : "";
            document.body.style.marginRight = "";
        } else {
            this._overflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            this._documentOverflow = document.documentElement.style.overflow;
            document.documentElement.style.overflow = "hidden";
            document.body.style.marginRight = "18px";
        }
    },
    _getModalOverlay: function() {
        if (!this._backgroundElement) {
            var a = document.createElement("div");
            a.style.display = "none";
            a.style.position = "absolute";
            if ($telerik.isRightToLeft(this._foregroundElement)) {
                a.style.right = "0px";
            } else {
                a.style.left = "0px";
            }
            a.style.top = "0px";
            a.style.zIndex = 10000;
            a.style.backgroundColor = "#aaaaaa";
            a.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=50)";
            a.style.opacity = ".5";
            a.style.MozOpacity = ".5";
            a.setAttribute("unselectable", "on");
            a.className = "TelerikModalOverlay";
            this._backgroundElement = a;
        }
        return this._backgroundElement;
    },
    _attachWindowHandlers: function(a) {
        var b = window;
        if (true == a) {
            this._windowResizeDelegate = Function.createDelegate(this, this._updatePageLayout);
            $addHandler(b, "resize", this._windowResizeDelegate);
            this._windowScrollDelegate = Function.createDelegate(this, this._updatePageLayout);
            $addHandler(b, "scroll", this._windowScrollDelegate);
        } else {
            if (this._windowResizeDelegate) {
                $removeHandler(b, "resize", this._windowResizeDelegate);
            }
            this._windowResizeDelegate = null;
            if (this._windowScrollDelegate) {
                $removeHandler(b, "scroll", this._windowScrollDelegate);
            }
            this._windowScrollDelegate = null;
        }
    },
    _updatePageLayout: function() {
        var e = (document.documentElement.scrollLeft ? $telerik.getCorrectScrollLeft(document.documentElement) : $telerik.getCorrectScrollLeft(document.body));
        var f = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        var a = $telerik.getClientBounds();
        var c = a.width;
        var b = a.height;
        var d = this._getModalOverlay();
        d.style.width = Math.max(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), c) + "px";
        d.style.height = Math.max(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), b) + "px";
    },
    _disableTab: function() {
        var a = 0;
        var e;
        var f = new Array();
        Array.clear(this._saveTabIndexes);
        for (var b = 0; b < this._tagWithTabIndex.length; b++) {
            e = this._foregroundElement.getElementsByTagName(this._tagWithTabIndex[b]);
            for (var c = 0; c < e.length; c++) {
                var d = e[c];
                f[a] = {
                    tag: d,
                    index: d.tabIndex
                };
                a++;
            }
        }
        a = 0;
        for (var b = 0; b < this._tagWithTabIndex.length; b++) {
            e = document.getElementsByTagName(this._tagWithTabIndex[b]);
            for (var c = 0; c < e.length; c++) {
                var d = e[c];
                this._saveTabIndexes[a] = {
                    tag: d,
                    index: d.tabIndex
                };
                e[c].tabIndex = "-1";
                a++;
            }
        }
        for (var a = 0; a < f.length; a++) {
            f[a].tag.tabIndex = f[a].index;
        }
        a = 0;
        if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
            var g = new Array();
            for (var b = 0; b < this._tagWithTabIndex.length; b++) {
                e = this._foregroundElement.getElementsByTagName("SELECT");
                for (var c = 0; c < e.length; c++) {
                    g[a] = e[c];
                    a++;
                }
            }
            a = 0;
            Array.clear(this._saveDesableSelect);
            e = document.getElementsByTagName("SELECT");
            for (var c = 0; c < e.length; c++) {
                if (Array.indexOf(g, e[c]) == -1) {
                    this._saveDesableSelect[a] = {
                        tag: e[c],
                        visib: $telerik.getCurrentStyle(e[c], "visibility")
                    };
                    e[c].style.visibility = "hidden";
                    a++;
                }
            }
        }
    },
    _restoreTab: function() {
        for (var a = 0; a < this._saveTabIndexes.length; a++) {
            this._saveTabIndexes[a].tag.tabIndex = this._saveTabIndexes[a].index;
        }
        if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
            for (var b = 0; b < this._saveDesableSelect.length; b++) {
                this._saveDesableSelect[b].tag.style.visibility = this._saveDesableSelect[b].visib;
            }
        }
    }
};
Telerik.Web.UI.ModalExtender.registerClass("Telerik.Web.UI.ModalExtender", null);
Type.registerNamespace("Telerik.Web");
Telerik.Web.PositioningMode = function() {
    throw Error.invalidOperation();
};
Telerik.Web.PositioningMode.prototype = {
    Absolute: 0,
    Center: 1,
    BottomLeft: 2,
    BottomRight: 3,
    TopLeft: 4,
    TopRight: 5
};
Telerik.Web.PositioningMode.registerEnum("Telerik.Web.PositioningMode");
Telerik.Web.PopupBehavior = function(a) {
    Telerik.Web.PopupBehavior.initializeBase(this, [a]);
    this._x = 0;
    this._y = 0;
    this._positioningMode = Telerik.Web.PositioningMode.Absolute;
    this._parentElement = null;
    this._parentElementID = null;
    this._moveHandler = null;
    this._firstPopup = true;
    this._originalParent = null;
    this._overlay = false;
    this._keepInScreenBounds = true;
    this._manageVisibility = true;
};
Telerik.Web.PopupBehavior._ie6pinnedList = {};
Telerik.Web.PopupBehavior.prototype = {
    getPageOffset: function() {
        var a = {
            x: ($telerik.getCorrectScrollLeft(document.documentElement) || $telerik.getCorrectScrollLeft(document.body)),
            y: (document.documentElement.scrollTop || document.body.scrollTop)
        };
        return a;
    },
    pin: function(g) {
        var b = this.get_elementToShow();
        var e = this.getPageOffset();
        if ($telerik.isIE6) {
            var c = this.get_id();
            if (g) {
                if (Telerik.Web.PopupBehavior._ie6pinnedList[c]) {
                    return;
                }
                var a = $telerik.getBounds(b);
                Telerik.Web.PopupBehavior._ie6pinnedList[c] = window.setInterval(Function.createDelegate(this, function() {
                    var h = this.getPageOffset();
                    var j = a.x - e.x + h.x;
                    var k = a.y - e.y + h.y;
                    if (this.get_x() == j && this.get_y() == k) {
                        return;
                    }
                    var i = this.get_parentElement();
                    this.set_parentElement(document.documentElement);
                    this.set_x(j);
                    this.set_y(k);
                    this.show();
                    this.set_parentElement(i);
                }), 130);
            } else {
                var f = Telerik.Web.PopupBehavior._ie6pinnedList[c];
                if (f) {
                    window.clearInterval(f);
                }
                delete Telerik.Web.PopupBehavior._ie6pinnedList[c];
            }
        } else {
            var d = g ? "fixed" : "absolute";
            if (b.style.position == d) {
                return;
            }
            var a = $telerik.getBounds(b);
            if (g && (e.x || e.y)) {
                this._x = a.x - e.x;
                this._y = a.y - e.y;
                $telerik.setLocation(b, {
                    x: this._x,
                    y: this._y
                });
            }
            b.style.position = d;
        }
    },
    center: function() {
        var b = this.get_elementToShow();
        if (this._manageVisibility) {
            $telerik.setVisible(b, true);
        }
        var d = $telerik.getClientBounds();
        var c = $telerik.getBounds(b);
        var e = parseInt((d.width - c.width) / 2);
        var f = parseInt((d.height - c.height) / 2);
        var a = this.get_parentElement();
        this.set_parentElement(document.documentElement);
        this.set_x(e);
        this.set_y(f);
        this.show();
        this.set_parentElement(a);
    },
    get_parentElement: function() {
        if (!this._parentElement && this._parentElementID) {
            this.set_parentElement($get(this._parentElementID));
            Sys.Debug.assert(this._parentElement != null, String.format('Couldn\'t find parent element "{0}"', this._parentElementID));
        }
        return this._parentElement;
    },
    set_parentElement: function(a) {
        this._parentElement = a;
    },
    get_parentElementID: function() {
        if (this._parentElement) {
            return this._parentElement.id;
        }
        return this._parentElementID;
    },
    set_parentElementID: function(a) {
        this._parentElementID = a;
        if (this.get_isInitialized()) {
            this.set_parentElement($get(a));
        }
    },
    get_positioningMode: function() {
        return this._positioningMode;
    },
    set_positioningMode: function(a) {
        this._positioningMode = a;
    },
    get_x: function() {
        return this._x;
    },
    set_x: function(a) {
        if (a != this._x) {
            this._x = a;
            if ($telerik.getVisible(this.get_elementToShow()) && this._manageVisibility) {
                this.show();
            }
        }
    },
    get_y: function() {
        return this._y;
    },
    set_y: function(a) {
        if (a != this._y) {
            this._y = a;
            if ($telerik.getVisible(this.get_elementToShow()) && this._manageVisibility) {
                this.show();
            }
        }
    },
    get_overlay: function() {
        return this._overlay;
    },
    set_overlay: function(c) {
        this._overlay = c;
        this._attachWindowHandlers(false);
        if (this._overlay) {
            this._attachWindowHandlers(true);
        } else {
            if (!((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7))) {
                var b = this.get_elementToShow();
                var a = b._hideWindowedElementsIFrame;
                if (a) {
                    a.style.display = "none";
                }
            }
        }
    },
    get_manageVisibility: function() {
        return this._manageVisibility;
    },
    set_manageVisibility: function(a) {
        this._manageVisibility = a;
    },
    get_keepInScreenBounds: function() {
        return this._keepInScreenBounds;
    },
    set_keepInScreenBounds: function(a) {
        this._keepInScreenBounds = a;
    },
    get_elementToShow: function() {
        return this._elementToShow ? this._elementToShow : this.get_element();
    },
    set_elementToShow: function(a) {
        if (this._elementToShow) {
            this._detachElementToShow();
        }
        this._elementToShow = a;
    },
    _detachElementToShow: function() {
        var a = this.get_elementToShow();
        if (this._moveHandler) {
            $telerik.removeExternalHandler(a, "move", this._moveHandler);
            this._moveHandler = null;
        }
        var c = a._hideWindowedElementsIFrame;
        if (c) {
            var d = c.parentNode;
            var b = c.nextSibling;
            if (d) {
                d.removeChild(c);
                if (b) {
                    d.insertBefore(document.createElement("span"), b);
                } else {
                    d.appendChild(document.createElement("span"));
                }
            }
        }
    },
    hide: function() {
        var b = this.get_elementToShow();
        if (this._manageVisibility) {
            $telerik.setVisible(b, false);
        }
        if (b.originalWidth) {
            b.style.width = b.originalWidth + "px";
            b.originalWidth = null;
        }
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer || this._overlay) {
            var a = b._hideWindowedElementsIFrame;
            if (a) {
                a.style.display = "none";
            }
        }
    },
    show: function() {
        var c = this.get_elementToShow();
        c.style.position = "absolute";
        var b = document.documentElement;
        if ($telerik.isFirefox) {
            var i = $telerik.getCurrentStyle(b, "overflow");
            if ("hidden" == i) {
                c.style.left = b.scrollLeft + "px";
                c.style.top = b.scrollLeft + "px";
            }
        }
        var e = this._manageVisibility;
        if (e) {
            $telerik.setVisible(c, true);
        }
        var g = c.offsetParent || b;
        if (e) {
            $telerik.setVisible(c, false);
        }
        var a;
        var j;
        if (this._parentElement) {
            j = $telerik.getBounds(this._parentElement);
            var h = this._getOffsetParentLocation(g);
            a = {
                x: j.x - h.x,
                y: j.y - h.y
            };
        } else {
            j = $telerik.getBounds(g);
            a = {
                x: 0,
                y: 0
            };
        }
        if (e) {
            $telerik.setVisible(c, true);
        }
        var l = Math.max(c.offsetWidth - (c.clientLeft ? c.clientLeft * 2 : 0), 0);
        var d = Math.max(c.offsetHeight - (c.clientTop ? c.clientTop * 2 : 0), 0);
        var k;
        switch (this._positioningMode) {
            case Telerik.Web.PositioningMode.Center:
                k = {
                    x: Math.round(j.width / 2 - l / 2),
                    y: Math.round(j.height / 2 - d / 2)
                };
                break;
            case Telerik.Web.PositioningMode.BottomLeft:
                k = {
                    x: 0,
                    y: j.height
                };
                break;
            case Telerik.Web.PositioningMode.BottomRight:
                k = {
                    x: j.width - l,
                    y: j.height
                };
                break;
            case Telerik.Web.PositioningMode.TopLeft:
                k = {
                    x: 0,
                    y: -c.offsetHeight
                };
                break;
            case Telerik.Web.PositioningMode.TopRight:
                k = {
                    x: j.width - l,
                    y: -c.offsetHeight
                };
                break;
            default:
                k = {
                    x: 0,
                    y: 0
                };
        }
        if (this._x > 480 && this._x < 490) {
            k.x += 410 + a.x;
        } else {
            k.x += this._x + a.x;
        }
        k.y += this._y + a.y;
        $telerik.setLocation(c, k);
        if (this._firstPopup) {
            c.style.width = l + "px";
        }
        this._firstPopup = false;
        var f = this._fixPositionInBounds();
        this._createOverlay(f);
    },
    _getViewportBounds: function() {
        var b = $telerik.getClientBounds();
        var c = document.documentElement;
        var a = document.body;
        b.scrollLeft = $telerik.isMobileSafari ? window.pageXOffset : ($telerik.getCorrectScrollLeft(c) || $telerik.getCorrectScrollLeft(a));
        b.scrollTop = $telerik.isMobileSafari ? window.pageYOffset : (c.scrollTop || a.scrollTop);
        return b;
    },
    _getOffsetParentLocation: function(a) {
        if (a && a.tagName.toUpperCase() != "BODY" && a.tagName.toUpperCase() != "HTML") {
            var c = $telerik.getLocation(a);
            var b = $telerik.getBorderBox(a);
            c.x += b.top;
            c.y += b.left;
            c.x -= $telerik.getCorrectScrollLeft(a);
            c.y -= a.scrollTop;
            return c;
        }
        return {
            x: 0,
            y: 0
        };
    },
    _fixPositionInBounds: function() {
        var c = this.get_elementToShow();
        var j = $telerik.getBounds(c);
        if (!this._keepInScreenBounds) {
            return j;
        }
        var b = this._getViewportBounds();
        var m = false;
        var e = (b.width > j.width);
        var d = (b.height > j.height);
        var l = b.scrollTop;
        var a = b.height + l;
        var g = b.scrollLeft;
        var k = b.width + g;
        if (($telerik.isIE8 || $telerik.isOpera || $telerik.isSafari) && $telerik.isRightToLeft(document.body)) {
            var i = c.style.display;
            if ($telerik.isOpera) {
                c.style.display = "none";
            }
            var f = document.documentElement.scrollWidth;
            k = f ? f : document.body.scrollWidth;
            if ($telerik.isOpera) {
                c.style.display = i;
            }
        }
        if (j.x < g || !e) {
            j.x = g;
            m = true;
        }
        if (j.y < l || !d) {
            j.y = l;
            m = true;
        }
        if (e && (j.x + j.width > k)) {
            j.x = k - j.width;
            m = true;
        }
        if (d && (a < j.y + j.height)) {
            j.y = a - j.height;
            m = true;
        }
        if (m) {
            var h = this._getOffsetParentLocation(c.offsetParent);
            j.y -= h.y;
            j.x -= h.x;
            $telerik.setLocation(c, j);
        }
        return j;
    },
    _createOverlay: function(d) {
        if (!$telerik.isIE6 && !this._overlay) {
            return;
        }
        var c = this.get_elementToShow();
        var b = c._hideWindowedElementsIFrame;
        if (!b) {
            b = document.createElement("iframe");
            b.src = "javascript:'<html></html>';";
            b.style.position = "absolute";
            b.style.display = "none";
            b.scrolling = "no";
            b.frameBorder = "0";
            b.tabIndex = "-1";
            b.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
            c.parentNode.insertBefore(b, c);
            c._hideWindowedElementsIFrame = b;
            this._moveHandler = Function.createDelegate(this, this._onMove);
            $telerik.addExternalHandler(c, "move", this._moveHandler);
        }
        $telerik.setBounds(b, d);
        if ($telerik.isFirefox) {
            var a = this._getViewportBounds();
            b.style.top = parseInt(d.y) - a.scrollTop + "px";
            b.style.left = parseInt(d.x) - a.scrollLeft + "px";
            b.style.position = "fixed";
            if ($telerik.isFirefox3) {
                b.style.backgroundColor = "#fff";
            }
        }
        if ($telerik.quirksMode) {
            return;
        }
        b.style.display = c.style.display;
        var e = $telerik.getCurrentStyle(c, "zIndex");
        if (e) {
            b.style.zIndex = e;
        }
    },
    _setCoordinates: function(b, c) {
        var a = false;
        if (b != this._x) {
            this._x = b;
            a = true;
        }
        if (c != this._y) {
            this._y = c;
            a = true;
        }
        if ($telerik.getVisible(this.get_elementToShow()) && a && this._manageVisibility) {
            this.show();
        }
    },
    initialize: function() {
        Telerik.Web.PopupBehavior.callBaseMethod(this, "initialize");
        this.hide();
    },
    dispose: function() {
        var a = this.get_elementToShow();
        if (a) {
            this._attachWindowHandlers(false);
            if ($telerik.getVisible(a) && this._manageVisibility) {
                this.hide();
            }
            if (this._originalParent) {
                a.parentNode.removeChild(a);
                this._originalParent.appendChild(a);
                this._originalParent = null;
            }
            this._detachElementToShow();
        }
        this._parentElement = null;
        Telerik.Web.PopupBehavior.callBaseMethod(this, "dispose");
        if (a && a._behaviors && a._behaviors.length == 0) {
            a._behaviors = null;
        }
        a = null;
    },
    _onMove: function() {
        var b = this.get_elementToShow();
        var c = b._hideWindowedElementsIFrame;
        if (c) {
            if (Sys.Browser.agent === Sys.Browser.Firefox) {
                var a = this._getViewportBounds();
                c.style.top = parseInt(b.style.top) - a.scrollTop + "px";
                c.style.left = parseInt(b.style.left) - a.scrollLeft + "px";
                c.style.position = "fixed";
            } else {
                c.style.top = b.style.top;
                c.style.left = b.style.left;
            }
        }
    },
    _handleElementResize: function() {
        var a = this.get_elementToShow();
        var c = a._hideWindowedElementsIFrame;
        if (c) {
            var b = $telerik.getBounds(a);
            $telerik.setBounds(c, b);
        }
    },
    _attachWindowHandlers: function(a) {
        if (!Sys.Browser.agent === Sys.Browser.Firefox) {
            return;
        }
        var b = window;
        if (true == a) {
            this._windowResizeDelegate = Function.createDelegate(this, this._onMove);
            $telerik.addExternalHandler(b, "resize", this._windowResizeDelegate);
            this._windowScrollDelegate = Function.createDelegate(this, this._onMove);
            $telerik.addExternalHandler(b, "scroll", this._windowScrollDelegate);
        } else {
            if (this._windowResizeDelegate) {
                $telerik.removeExternalHandler(b, "resize", this._windowResizeDelegate);
            }
            this._windowResizeDelegate = null;
            if (this._windowScrollDelegate) {
                $telerik.removeExternalHandler(b, "scroll", this._windowScrollDelegate);
            }
            this._windowScrollDelegate = null;
        }
    }
};
Telerik.Web.PopupBehavior.registerClass("Telerik.Web.PopupBehavior", Sys.UI.Behavior);
Type.registerNamespace("Telerik.Web");
Type.registerNamespace("Telerik.Web.UI");
Type.registerNamespace("Telerik.Web.UI.Helpers");
(function(a, b) {
    a.ResizeExtender = function(f, e, i, j, d, g, c, h) {
        this._document = d ? d : document;
        this._documentMouseMoveDelegate = null;
        this._documentMouseUpDelegate = null;
        this._jsOwner = null;
        this._element = null;
        this._tableElement = null;
        this._saveDelegates = {};
        this._moveCursorType = "move";
        this._moveToMouseLocation = false;
        this._hideIframes = true;
        this._iframeToSkip = null;
        this._enabled = true;
        this._startX = 0;
        this._startY = 0;
        this._cancelResize = true;
        this._startCursorLocation = null;
        this._autoScrollEnabled = true;
        this._ieTouchActionManager = new a.Helpers.IETouchActionManager(e);
        this.initialize(f, e, i, j, g, c, h);
    };
    a.ResizeExtender.containsBounds = function(e, c) {
        if (!e || !c) {
            return false;
        }
        var d = $telerik.containsPoint(e, c.x, c.y);
        if (d) {
            var f = c.x + c.width;
            var g = c.y + c.height;
            d = $telerik.containsPoint(e, f, g);
        }
        return d;
    };
    a.ResizeExtender.prototype = {
        initialize: function(d, g, h, i, e, c, f) {
            if (!g) {
                return;
            }
            if (this._element) {
                alert("Element " + g.getAttribute("id") + " cannot be made resizable, as the resizeExtender already has the element " + this._element.getAttribute("id") + " associated with it. You must create a new extender resizer object");
                return;
            }
            this._jsOwner = d;
            this._element = g;
            this._tableElement = i;
            this._handles = h;
            this._ieTouchActionManager.allowUserTouch();
            if (e) {
                this._moveCursorType = e;
            }
            if (c != null) {
                this._autoScrollEnabled = c;
            }
            if (f != null) {
                this._moveToMouseLocation = f;
            }
            this._configureHandleElements(true);
        },
        dispose: function() {
            this._ieTouchActionManager.dispose();
            this._attachDocumentHandlers(false);
            this._configureHandleElements(false);
            this._startCursorLocation = null;
            this._iframeToSkip = null;
            this._jsOwner = null;
            this._element = null;
            this._handles = null;
            this._saveDelegates = null;
            this._constraints = null;
        },
        enable: function(c) {
            this._enabled = c;
        },
        set_hideIframes: function(c) {
            this._hideIframes = c;
        },
        get_hideIframes: function() {
            return this._hideIframes;
        },
        set_iframeToSkip: function(c) {
            this._iframeToSkip = c;
        },
        get_iframeToSkip: function() {
            return this._iframeToSkip;
        },
        get_constraints: function() {
            return this._constraints;
        },
        set_constraints: function(c) {
            this._constraints = c;
        },
        get_useCssTransform: function() {
            return this._useCssTransform;
        },
        set_useCssTransform: function(c) {
            this._useCssTransform = c;
        },
        _raiseDragEvent: function(e, d, g) {
            var f = this._jsOwner;
            if (f && f["on" + e]) {
                var c = d;
                if (!c) {
                    c = {};
                }
                c.element = this._element;
                c.ownerEvent = g;
                return f["on" + e](c);
            }
            return true;
        },
        _raiseEvent: function(d, c) {
            var e = this._jsOwner;
            if (e && e["on" + d]) {
                if (!c) {
                    c = new Sys.EventArgs();
                } else {
                    if (d == "Resize") {
                        c = this._resizeDir;
                    } else {
                        if (d == "Resizing") {
                            c = this._getProposedBounds(c);
                        }
                    }
                }
                return e["on" + d](c);
            }
            return true;
        },
        _getProposedBounds: function(c) {
            var d = $telerik.getBounds(this._element);
            return {
                x: c.x || d.x,
                y: c.y || d.y,
                width: c.width || d.width,
                height: c.height || d.height
            };
        },
        getPositionedParent: function() {
            var c = this._element.parentNode;
            while (c && c != document) {
                if ("static" != $telerik.getCurrentStyle(c, "position", "static")) {
                    return c;
                }
                c = c.parentNode;
            }
            return null;
        },
        _storeStartCoords: function(f) {
            if (!this._enabled) {
                return;
            }
            this._cancelResize = false;
            var o = $telerik.isTouchDevice;
            var p = $telerik.getTouchEventLocation(f);
            this._startX = o ? p.x : f.clientX;
            this._startY = o ? p.y : f.clientY;
            var h = this._element;
            var g = $telerik.getBounds(h);
            var i = (h.id != null && a.RadDock && a.RadDock.isInstanceOfType($find(h.id)));
            if ($telerik.isIE && i != true) {
                var m = this.getPositionedParent();
                if (m) {
                    g.x += m.scrollLeft;
                    g.y += m.scrollTop;
                }
            }
            this._originalBounds = g;
            var n = f.target ? f.target : f.srcElement;
            if (n && n.type == 3) {
                n = n.parentNode;
            }
            this._resizeType = $telerik.getCurrentStyle(n, "cursor");
            if (!this._resizeType && f.currentTarget) {
                this._resizeType = $telerik.getCurrentStyle(f.currentTarget, "cursor");
            }
            this._resizeDir = {
                north: this._resizeType.match(/n.?-/) ? 1 : 0,
                east: this._resizeType.match(/e-/) ? 1 : 0,
                south: this._resizeType.match(/s.?-/) ? 1 : 0,
                west: this._resizeType.match(/w-/) ? 1 : 0,
                move: new RegExp(this._moveCursorType).test(this._resizeType) ? 1 : 0
            };
            this._leftHandleMouseDelta = 0;
            if (this._resizeDir.west) {
                this._leftHandleMouseDelta = Math.abs(g.x - this._startX);
            }
            var d = this._resizeDir.move ? this._raiseDragEvent("DragStart", null, f) : this._raiseEvent("ResizeStart");
            this._cancelResize = (d == false);
            var l = $telerik.getCurrentStyle(h.parentNode, "position");
            var j = ("relative" == l) || ("absolute" == l);
            this._offsetLocation = j ? $telerik.getLocation(h.parentNode) : {
                x: 0,
                y: 0
            };
            if (this._moveToMouseLocation) {
                var k = o ? {
                    left: this._startX,
                    top: this._startY
                } : $telerik.getDocumentRelativeCursorPosition({
                    clientX: this._startX,
                    clientY: this._startY
                });
                if (j) {
                    var c = $telerik.getBorderBox(h.parentNode);
                    k.left -= c.left;
                    k.top -= c.top;
                }
                this._startCursorLocation = {
                    x: k.left - Math.floor(g.width / 2),
                    y: k.top - Math.floor(g.height / 2)
                };
            }
            if (!this._cancelResize) {
                this._clearSelection();
                this._setIframesVisible(false);
                this._attachDocumentHandlers(false);
                this._attachDocumentHandlers(true);
            }
        },
        _resize: function(g) {
            if (!this._enabled || this._cancelResize) {
                return false;
            }
            var c = this._originalBounds;
            var m = new Sys.UI.Bounds(0, 0, 0, 0);
            var i = $telerik.isTouchDevice ? $telerik.getTouchEventLocation(g) : {
                x: g.clientX,
                y: g.clientY
            };
            var q = i.x - this._startX;
            var r = i.y - this._startY;
            var f = this._resizeDir;
            var j = f.move;
            if (j) {
                var k = this._startCursorLocation;
                if (k) {
                    c.x = k.x;
                    c.y = k.y;
                    this._originalBounds = c;
                    this._startCursorLocation = null;
                }
                m.x = c.x + q;
                m.y = c.y + r;
                var l = this._getMoveConstraints(c);
                if (l) {
                    m.x = this._constrainPosition(m.x, l.x, l.width);
                    m.y = this._constrainPosition(m.y, l.y, l.height);
                }
            } else {
                if (f.east) {
                    m.x = c.x;
                    m.width = c.width + q;
                } else {
                    if (f.west) {
                        m.x = i.x - this._leftHandleMouseDelta;
                        m.width = c.width - q;
                    }
                }
                if (f.south) {
                    m.y = c.y;
                    m.height = c.height + r;
                } else {
                    if (f.north) {
                        m.y = c.y + r;
                        m.height = c.height - r;
                    }
                }
                var p = this._getSizeConstraints(c);
                if (p) {
                    m.x = this._constrainPosition(m.x, p.x, Math.min(m.x + m.width, p.width - m.width));
                    m.y = this._constrainPosition(m.y, p.y, Math.min(m.y + m.height, p.height - m.height));
                    m.width = this._constrainDimension(m.width, p.width - m.x);
                    m.height = this._constrainDimension(m.height, p.height - m.y);
                }
            }
            var n = this._offsetLocation;
            if (n) {
                m.x -= n.x;
                m.y -= n.y;
            }
            var o = j ? this._raiseDragEvent("Drag", m, g) : this._raiseEvent("Resizing", m);
            if (false == o) {
                return true;
            }
            var h = this._element;
            if (this._useCssTransform && j) {
                this._lastTouchDelta = {
                    x: m.x - c.x + n.x,
                    y: m.y - c.y + n.y
                };
                var d = {
                    x: m.x ? this._lastTouchDelta.x : 0,
                    y: m.y ? this._lastTouchDelta.y : 0
                };
                this._setTranslate(h, d.x, d.y);
            } else {
                if (j || m.x > 0) {
                    h.style.left = m.x + "px";
                }
                if (j || m.y > 0) {
                    h.style.top = m.y + "px";
                }
            }
            if (m.width > 0) {
                h.style.width = m.width + "px";
            }
            if (m.height > 0) {
                h.style.height = m.height + "px";
            }
            if (!j) {
                this._updateInnerTableSize();
            }
            return true;
        },
        _setTranslate: function(c, e, f) {
            var d = c.style;
            d.webkitTransform = d.mozTransform = d.OTransform = "translate(" + e + "px," + f + "px)";
        },
        _updateInnerTableSize: function() {
            var c = this._resizeDir;
            if (c.south || c.north) {
                var d = this._element.style.height;
                var e = this._tableElement;
                if (e) {
                    e.style.height = d;
                    this._fixIeHeight(e, d);
                }
            }
        },
        _getMoveConstraints: function(c) {
            var d = this._getSizeConstraints();
            if (d) {
                d.width -= c.width;
                d.height -= c.height;
            }
            return d;
        },
        _getSizeConstraints: function(c) {
            var d = this._constraints;
            if (!d) {
                return null;
            }
            var e = d.x + this._offsetLocation.x;
            var f = d.y + this._offsetLocation.y;
            return new Sys.UI.Bounds(e, f, e + d.width, f + d.height);
        },
        _constrainPosition: function(e, d, c) {
            return Math.max(d, Math.min(c, e));
        },
        _constrainDimension: function(d, c) {
            return this._constrainPosition(d, 0, c);
        },
        _fixIeHeight: function(f, d) {
            if ("CSS1Compat" == document.compatMode) {
                var c = (f.offsetHeight - parseInt(d));
                if (c > 0) {
                    var e = (parseInt(f.style.height) - c);
                    if (e > 0) {
                        f.style.height = e + "px";
                    }
                }
            }
        },
        _setIframesVisible: function(c) {
            if (!this.get_hideIframes()) {
                return;
            }
            var g = this._document.getElementsByTagName("iframe");
            var h = this.get_iframeToSkip();
            for (var f = 0, j = g.length; f < j; f++) {
                var e = g[f];
                if (h && (h === e || h == e)) {
                    h = null;
                } else {
                    e.style.visibility = c ? "" : "hidden";
                    if ($telerik.isIE) {
                        try {
                            e.contentWindow.document.body.style.visibility = c ? "" : "hidden";
                        } catch (d) {}
                    }
                }
            }
        },
        _configureHandleElements: function(c) {
            var e = this._handles;
            var f = ["nw", "n", "ne", "w", "e", "sw", "s", "se", this._moveCursorType];
            for (var g = 0, k = f.length; g < k; g++) {
                var l = f[g];
                var d = e[l];
                if (d) {
                    if (Object.prototype.toString.call(d) === "[object Array]") {
                        for (var h = 0; h < d.length; h++) {
                            this._configureHandle("id" + g + "_" + h, c, d[h], l);
                        }
                    } else {
                        this._configureHandle("id" + g, c, d, l);
                    }
                }
            }
        },
        _configureHandle: function(i, c, f, h) {
            var e = this._saveDelegates;
            var d = e[i] ? e[i].delegate : null;
            if (c) {
                if (!d) {
                    var g = $telerik.addMobileHandler(this, f, "mousedown", this._onHandleMouseDown, null, true);
                    f.style.cursor = (h == this._moveCursorType) ? h : h + "-resize";
                    e[i] = {
                        element: f,
                        delegate: g
                    };
                }
            } else {
                if (d) {
                    $telerik.removeMobileHandler(f, "mousedown", d, null, true);
                    f.style.cursor = "";
                    delete e[i];
                }
            }
        },
        _attachDocumentHandlers: function(c) {
            var f = this._document;
            if (c) {
                this._documentMouseMoveDelegate = $telerik.addMobileHandler(this, f, "mousemove", this._onDocumentMouseMove, null, true);
                this._documentMouseUpDelegate = $telerik.addMobileHandler(this, f, "mouseup", this._onDocumentMouseUp, null, true);
            } else {
                var e = this._documentMouseMoveDelegate;
                if (e) {
                    $telerik.removeMobileHandler(f, "mousemove", e, null, true);
                }
                var d = this._documentMouseUpDelegate;
                if (d) {
                    $telerik.removeMobileHandler(f, "mouseup", d, null, true);
                }
                this._documentMouseMoveDelegate = null;
                this._documentMouseUpDelegate = null;
            }
        },
        _onHandleMouseDown: function(c) {
            if ($telerik.isTouchDevice && c.originalEvent.touches.length > 1) {
                return true;
            }
            this._storeStartCoords(c);
            if (!$telerik.isTouchDevice) {
                return $telerik.cancelRawEvent(c);
            }
        },
        _onDocumentMouseMove: function(c) {
            var d = this._resize(c);
            if (this._autoScrollEnabled) {
                this._autoScroll(c);
            }
            if (d) {
                return $telerik.cancelRawEvent(c);
            }
        },
        _onDocumentMouseUp: function(c) {
            var f = !this._cancelResize;
            this._cancelResize = true;
            this._startCursorLocation = null;
            var d = this._resizeDir && this._resizeDir.move;
            if (this._useCssTransform && d) {
                this._moveBoxBy(this._lastTouchDelta);
            }
            if (f) {
                this._clearSelection();
                this._setIframesVisible(true);
                if (d) {
                    this._raiseDragEvent("DragEnd", null, c);
                } else {
                    this._raiseEvent("ResizeEnd");
                }
                this._attachDocumentHandlers(false);
                if (this._scroller) {
                    this._scroller.set_enabled(false);
                }
            }
        },
        _moveBoxBy: function(d, c) {
            var c = c || this._element;
            var f = this._originalBounds;
            var e = this._offsetLocation;
            boxStartPos = f;
            this._resetBoxTransform(c);
            c.style.left = boxStartPos.x + d.x - e.x + "px";
            c.style.top = boxStartPos.y + d.y - e.y + "px";
        },
        _resetBoxTransform: function(c) {
            var d = c.style;
            d.webkitTransform = d.mozTransform = d.OTransform = d.msTranslate = "translate(0,0)";
        },
        _clearSelection: function() {
            if (this._document.selection && this._document.selection.empty) {
                try {
                    this._document.selection.empty();
                } catch (c) {}
            }
        },
        _initializeAutoScroll: function() {
            if (this._autoScrollInitialized) {
                return;
            }
            this._scrollEdgeConst = 40;
            this._scrollByConst = 10;
            this._scroller = null;
            this._scrollDeltaX = 0;
            this._scrollDeltaY = 0;
            this._scrollerTickHandler = Function.createDelegate(this, this._onScrollerTick);
            this._scroller = new Telerik.Web.Timer();
            this._scroller.set_interval(10);
            this._scroller.add_tick(this._scrollerTickHandler);
            this._autoScrollInitialized = true;
        },
        _autoScroll: function(d) {
            this._initializeAutoScroll();
            var c = $telerik.getClientBounds();
            if (c.width > 0) {
                this._scrollDeltaX = this._scrollDeltaY = 0;
                if (d.clientX < c.x + this._scrollEdgeConst) {
                    this._scrollDeltaX = -this._scrollByConst;
                } else {
                    if (d.clientX > c.width - this._scrollEdgeConst) {
                        this._scrollDeltaX = this._scrollByConst;
                    }
                }
                if (d.clientY < c.y + this._scrollEdgeConst) {
                    this._scrollDeltaY = -this._scrollByConst;
                } else {
                    if (d.clientY > c.height - this._scrollEdgeConst) {
                        this._scrollDeltaY = this._scrollByConst;
                    }
                }
                var e = this._scroller;
                if (this._scrollDeltaX != 0 || this._scrollDeltaY != 0) {
                    this._originalStartX = this._startX;
                    this._originalStartY = this._startY;
                    e.set_enabled(true);
                } else {
                    if (e.get_enabled()) {
                        this._startX = this._originalStartX;
                        this._startY = this._originalStartY;
                    }
                    e.set_enabled(false);
                }
            }
        },
        _onScrollerTick: function() {
            var i = document.documentElement.scrollLeft || document.body.scrollLeft;
            var j = document.documentElement.scrollTop || document.body.scrollTop;
            window.scrollBy(this._scrollDeltaX, this._scrollDeltaY);
            var g = document.documentElement.scrollLeft || document.body.scrollLeft;
            var h = document.documentElement.scrollTop || document.body.scrollTop;
            var c = g - i;
            var d = h - j;
            var e = this._element;
            var k = {
                x: parseInt(e.style.left) + c,
                y: parseInt(e.style.top) + d
            };
            this._startX -= c;
            this._startY -= d;
            try {
                $telerik.setLocation(e, k);
            } catch (f) {}
        }
    };
    a.ResizeExtender.registerClass("Telerik.Web.UI.ResizeExtender", null, Sys.IDisposable);
    Telerik.Web.UI.Helpers.IETouchActionManager = function(c) {
        this.element = c;
    };
    Telerik.Web.UI.Helpers.IETouchActionManager.prototype = {
        allowUserTouch: function() {
            if (!this.isPointerEnabled()) {
                return;
            }
            var c = this.getStyle();
            this.cachedTouchAction = c.msTouchAction;
            c.msTouchAction = "none";
        },
        restore: function() {
            if (!this.isPointerEnabled()) {
                return;
            }
            this.getStyle().msTouchAction = this.cachedTouchAction;
        },
        getStyle: function() {
            return this.element ? this.element.style : {};
        },
        isPointerEnabled: function() {
            try {
                return window.navigator.msPointerEnabled;
            } catch (c) {
                return false;
            }
        },
        dispose: function() {
            this.restore();
            this.element = null;
        }
    };
})(Telerik.Web.UI);
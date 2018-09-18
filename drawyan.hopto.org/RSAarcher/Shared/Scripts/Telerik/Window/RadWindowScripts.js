Type.registerNamespace("Telerik.Web.UI");
(function() {
    $telerik.toWindow = function(c) {
        return c;
    };
    $telerik.findWindow = $find;
    var a = $telerik.$;
    var b = Telerik.Web.UI;
    b.RadWindowControllerClass = function() {
        this._activeWindow = null;
        this._historyStack = [];
    };
    b.RadWindowControllerClass.prototype = {
        getInstance: function() {
            return this;
        },
        hideCurrentWindowIfNonModal: function() {
            if (this._activeWindow != null && this._activeWindow.isModal && !this._activeWindow.isModal()) {
                this._activeWindow.close();
            }
            this._activeWindow = null;
        },
        inactivateCurrentWindow: function() {
            if (this._activeWindow != null) {
                this._activeWindow.setActive(false);
            }
            this._activeWindow = null;
        },
        set_activeWindow: function(c) {
            if (c == this._activeWindow) {
                return;
            }
            this.inactivateCurrentWindow();
            this._activeWindow = c;
            Array.remove(this._historyStack, c);
            Array.add(this._historyStack, c);
        },
        notifyWindowClosed: function(c) {
            if (this._activeWindow == c) {
                this._activeWindow = null;
            }
            Array.remove(this._historyStack, c);
            this._activatePreviousWindow();
        },
        _activatePreviousWindow: function() {
            var c = this._historyStack;
            var d = c.length - 1;
            for (; d >= 0; d--) {
                var e = c[d];
                if (!e) {
                    return;
                }
                if (e.isCreated() && !e.isClosed() && !e.isMinimized()) {
                    e.setActive(true);
                    break;
                } else {
                    Array.removeAt(c, d);
                }
            }
        },
        get_activeWindow: function() {
            return this._activeWindow;
        }
    };
    b.RadWindowControllerClass.registerClass("Telerik.Web.UI.RadWindowControllerClass", null);
    if (!b.RadWindowController) {
        b.RadWindowController = new b.RadWindowControllerClass();
    }
    Type.registerNamespace("Telerik.Web.UI");
    Type.registerNamespace("Telerik.Web.UI.RadWindowUtils");
    b.RadWindowUtils.Localization = {
        Close: "Close",
        Minimize: "Minimize",
        Maximize: "Maximize",
        Reload: "Reload",
        PinOn: "Pin on",
        PinOff: "Pin off",
        Restore: "Restore",
        OK: "OK",
        Cancel: "Cancel",
        Yes: "Yes",
        No: "No"
    };
    a.registerEnum(b, "WindowBehaviors", {
        None: 0,
        Resize: 1,
        Minimize: 2,
        Close: 4,
        Pin: 8,
        Maximize: 16,
        Move: 32,
        Reload: 64,
        Default: (1 + 2 + 4 + 8 + 16 + 32 + 64)
    });
    a.registerEnum(b, "WindowAutoSizeBehaviors", {
        Width: 1,
        WidthProportional: 2,
        Height: 4,
        HeightProportional: 8,
        Default: (2 + 8)
    });
    a.registerEnum(b, "WindowAnimation", {
        None: 0,
        Resize: 1,
        Fade: 2,
        Slide: 4,
        FlyIn: 8
    });
    a.registerEnum(b, "WindowMinimizeMode", {
        SameLocation: 1,
        MinimizeZone: 2,
        Default: 1
    });
    b.RadWindow = function(c) {
        b.RadWindow.initializeBase(this, [c]);
        this._openerElement = null;
        this._offsetElement = null;
        this._popupElement = null;
        this._tableElement = null;
        this._contentElement = null;
        this._contentCell = null;
        this._titleElement = null;
        this._titleCell = null;
        this._titlebarElement = null;
        this._statusCell = null;
        this._statusMessageElement = null;
        this._iframe = null;
        this._dockMode = false;
        this._isPredefined = false;
        this._buttonsElement = null;
        this._buttonsArray = [];
        this._iconUrl = null;
        this._shortCutManager = null;
        this.isIE = ($telerik.isIE);
        this._openerElementID = null;
        this._offsetElementID = null;
        this._behaviors = b.WindowBehaviors.Default;
        this._left = null;
        this._top = null;
        this._title = "";
        this._width = "300px";
        this._minWidth = null;
        this._minHeight = null;
        this._defaultMinWidth = null;
        this._defaultMinHeight = null;
        this._handlesWidth = null;
        this._resizeOverlayElement = null;
        this._height = "300px";
        this._opacity = 100;
        this._visibleTitlebar = true;
        this._visibleStatusbar = true;
        this._modal = false;
        this._overlay = false;
        this._keepInScreenBounds = false;
        this._windowAnimation = null;
        this._onMouseDownDelegate = null;
        this._onClickDelegate = null;
        this._onTitlebarDblclickDelegate = null;
        this._onTitlebarClickDelegate = null;
        this._onWindowResizeDelegate = null;
        this._onIframeLoadDelegate = null;
        this._onChildPageUnloadDelegate = null;
        this._onChildPageClickDelegate = null;
        this._onKeyDownDelegate = null;
        this._onModalShowHandler = null;
        this._onModalCloseHandler = null;
        this._loaded = false;
        this._isCloned = false;
        this._restoreRect = null;
        this._popupBehavior = null;
        this._popupVisible = false;
        this._dropDownTouchScroll = null;
        this._browserWindow = window;
        this._stylezindex = null;
        this._renderMode = b.RenderMode.Classic;
        this._isiOS5Safari = navigator.userAgent.match(/OS 5_\d like Mac OS X/i);
        this._iframeWrapper = null;
        this.GetWindowManager = this.get_windowManager;
        this.BrowserWindow = window;
        this.GetContentFrame = this.get_contentFrame;
        this.GetLeftPosition = function() {
            this.getWindowBounds().x;
        };
        this.GetTopPosition = function() {
            this.getWindowBounds().y;
        };
        this.GetTitlebar = function() {
            return this.ui ? this.ui.titlebar : null;
        };
        this.GetStatusbar = function() {
            return this._statusCell;
        };
        this.SetOpenerElementId = this.set_openerElementID;
        this.SetStatus = this.set_status;
        this.GetStatus = this.get_status;
        this.SetModal = this.set_modal;
        this.SetWidth = this.set_width;
        this.SetHeight = this.set_height;
        this.GetWidth = this.get_width;
        this.GetHeight = this.get_height;
        this.SetOffsetElementId = this.set_offsetElementID;
        this.SetTitle = this.set_title;
        this.MoveTo = this.moveTo;
        this.Center = this.center;
        this.SetVisible = this.setVisible;
        this.SetSize = this.setSize;
        this.Show = this.show;
        this.Hide = this.hide;
        this.GetUrl = this.get_navigateUrl;
        this.SetUrl = this.setUrl;
        this.Reload = this.reload;
        this.SetActive = this.setActive;
        this.Minimize = this.minimize;
        this.Restore = this.restore;
        this.Maximize = this.maximize;
        this.Close = this.close;
        this.TogglePin = this.togglePin;
        this.IsMaximized = this.isMaximized;
        this.IsMinimized = this.isMinimized;
        this.IsModal = this.isModal;
        this.IsClosed = this.isClosed;
        this.IsPinned = this.isPinned;
        this.IsVisible = this.isVisible;
        this.IsActive = this.isActive;
        this.IsBehaviorEnabled = this.isBehaviorEnabled;
    };
    b.RadWindow.prototype = {
        _getLocalization: function() {
            return b.RadWindowUtils.Localization;
        },
        _getLocalizationString: function(e) {
            var d = this.get_localization();
            if (typeof(d) == "string") {
                d = Sys.Serialization.JavaScriptSerializer.deserialize(d);
                this.set_localization(d);
            }
            var c = this._getLocalization();
            if (!d) {
                return c[e];
            }
            return d[e];
        },
        _registerGlobalBodyEventHandlers: function(d) {
            var c = this.get_shortcuts();
            if (!c) {
                return;
            }
            if (!this._shortCutManager) {
                this._shortCutManager = new b.WindowShortCutManager(c);
            }
            if (d) {
                this._onKeyDownDelegate = Function.createDelegate(this, this._onKeyDown);
                $addHandler(document.documentElement, "keydown", this._onKeyDownDelegate);
            } else {
                if (this._onKeyDownDelegate) {
                    $removeHandler(document.documentElement, "keydown", this._onKeyDownDelegate);
                    this._onKeyDownDelegate = null;
                }
            }
        },
        _registerIframeLoadHandler: function(c) {
            if (!this._iframe) {
                return;
            }
            if (c) {
                this._onIframeLoadDelegate = Function.createDelegate(this, this._onIframeLoad);
                $addHandler(this._iframe, "load", this._onIframeLoadDelegate);
            } else {
                if (this._onIframeLoadDelegate) {
                    $removeHandler(this._iframe, "load", this._onIframeLoadDelegate);
                    this._onIframeLoadDelegate = null;
                    $clearHandlers(this._iframe);
                }
            }
        },
        _registerWindowResizeHandler: function(c) {
            if (c) {
                this._onWindowResizeDelegate = Function.createDelegate(this, this._maintainMaximizedSize);
                $addHandler(window, "resize", this._onWindowResizeDelegate);
            } else {
                if (this._onWindowResizeDelegate) {
                    $removeHandler(window, "resize", this._onWindowResizeDelegate);
                    this._onWindowResizeDelegate = null;
                }
            }
        },
        _registerOpenerElementHandler: function(d, c) {
            if (!d) {
                return;
            }
            if (Sys.UI.DomElement.containsCssClass(d, "RadButton")) {
                d.setAttribute("rwOpener", true);
            } else {
                d.removeAttribute("rwOpener");
            }
            if (true == c) {
                this._onClickDelegate = Function.createDelegate(this, this._onClick);
                $addHandler(d, "click", this._onClickDelegate);
            } else {
                $removeHandler(d, "click", this._onClickDelegate);
                this._onClickDelegate = null;
            }
        },
        _registerTitlebarHandlers: function(c) {
            var d = this.ui ? this.ui.titleCell || this.ui.titlebar : null;
            if (c) {
                this._onTitlebarDblclickDelegate = Function.createDelegate(this, function() {
                    if (this.isMinimized()) {
                        this.restore();
                    } else {
                        if (this.isBehaviorEnabled(b.WindowBehaviors.Maximize)) {
                            if (this.isMaximized()) {
                                this.restore();
                            } else {
                                this.maximize();
                            }
                        }
                    }
                });
                this._onTitlebarClickDelegate = Function.createDelegate(this, function() {
                    this.setActive(true);
                });
                $addHandler(d, "dblclick", this._onTitlebarDblclickDelegate);
                $addHandler(d, "click", this._onTitlebarClickDelegate);
            } else {
                if (d) {
                    if (this._onTitlebarDblclickDelegate) {
                        $removeHandler(d, "dblclick", this._onTitlebarDblclickDelegate);
                        this._onTitlebarDblclickDelegate = null;
                    }
                    if (this._onTitlebarClickDelegate) {
                        $removeHandler(d, "click", this._onTitlebarClickDelegate);
                        this._onTitlebarClickDelegate = null;
                    }
                    $clearHandlers(d);
                }
            }
        },
        _makeModal: function(c) {
            if (this._onModalShowHandler) {
                this.remove_show(this._onModalShowHandler);
                this._onModalShowHandler = null;
            }
            if (this._onModalCloseHandler) {
                this.remove_close(this._onModalCloseHandler);
                this._onModalCloseHandler = null;
            }
            if (this._modalExtender) {
                this._modalExtender.dispose();
                this._modalExtender = null;
            }
            if (!c) {
                return;
            }
            if (typeof(b.RadWindowManager) != "undefined" && b.RadWindowManager.isInstanceOfType(this)) {
                return;
            }
            this._onModalShowHandler = function(e) {
                if (!e._modalExtender) {
                    e._modalExtender = new b.ModalExtender(e._popupElement);
                }
                e._modalExtender.show();
                var d = document.activeElement;
                if (d && d.tagName.toLowerCase() != "body") {
                    var f = (!$telerik.isDescendant(this._contentElement, d) && this._dockMode);
                    if (!(e._isPredefined) || f) {
                        e._focusedPageElement = d;
                        d.blur();
                    }
                }
                if (e.get_centerIfModal()) {
                    e.center();
                }
            };
            this.add_show(this._onModalShowHandler);
            this._onModalCloseHandler = function(d) {
                window.setTimeout(function() {
                    if (d._modalExtender) {
                        d._modalExtender.hide();
                    }
                    var f = d._focusedPageElement;
                    if (f) {
                        try {
                            f.focus();
                        } catch (e) {}
                        d._focusedPageElement = null;
                    }
                }, 10);
            };
            this.add_close(this._onModalCloseHandler);
        },
        _enableMoveResize: function(d) {
            if (!this.view) {
                return;
            }
            var c = {
                resize: this.isBehaviorEnabled(b.WindowBehaviors.Resize),
                move: this.isBehaviorEnabled(b.WindowBehaviors.Move)
            };
            if (d) {
                this.view.enableMoveResize(c);
            } else {
                this.view.disableMoveResize(c);
            }
        },
        _setResizeOverlayVisible: function(c) {
            if (this._dockMode) {
                return;
            }
            var e = this._resizeOverlayElement;
            if (!e) {
                var f = this._getHandlesWidth();
                var d = this._visibleTitlebar ? this._getTitlebarHeight() : f;
                e = document.createElement("div");
                e.style.position = "absolute";
                e.style.zIndex = "1";
                e.style.top = d + "px";
                e.style.left = Math.round(f / 2) + "px";
                e.style.backgroundColor = "White";
                e.style.filter = "alpha(opacity=0)";
                e.style.opacity = 0;
                this._contentCell.appendChild(e);
                this._resizeOverlayElement = e;
            }
            this._setResizeOverlaySize();
            e.style.display = c ? "" : "none";
        },
        _setResizeOverlaySize: function() {
            var d = this._resizeOverlayElement;
            if (d) {
                var c = this._contentCell;
                d.style.width = c.offsetWidth + "px";
                d.style.height = c.offsetHeight + "px";
            }
        },
        onResizeStart: function() {
            if (this.isMaximized()) {
                return false;
            }
            this.setActive(true);
            this._setResizeOverlayVisible(true);
            this._cachedDragZoneBounds = this._getRestrictionZoneBounds();
            var c = new Sys.CancelEventArgs();
            this.raiseEvent("resizeStart", c);
            if (c.get_cancel()) {
                return false;
            }
        },
        onResizing: function(c) {
            if (!this._cachedDragZoneBounds || this._checkRestrictionZoneBounds(this._cachedDragZoneBounds, c)) {
                this._manageVisibilityFirefox(false);
                if (this._isiOS5Safari) {
                    this.setContentFixedHeight(c.height, this._iframeWrapper);
                }
                if (this._dockMode) {
                    this.setWidthDockMode(c.width - 1);
                    this.setHeightDockMode(c.height - 1);
                } else {
                    this._setResizeOverlaySize();
                }
                var e = this._getCurrentBounds();
                var i = this.get_minWidth();
                var g = parseInt(this.get_maxWidth());
                var h = this.get_minHeight();
                var f = parseInt(this.get_maxHeight());
                var d = false;
                if (c.width < i || g && c.width > g) {
                    var k = i;
                    if (c.width < i) {
                        c.width = i;
                    } else {
                        c.width = g;
                        k = g;
                    }
                    var j = this._resizeExtender._originalBounds;
                    if (this._resizeExtender._resizeDir.west) {
                        c.x = j.x + (j.width - k);
                        if (this._cachedDragZoneBounds) {
                            c.x -= this._cachedDragZoneBounds.x;
                        }
                    } else {
                        c.x = e.x;
                    }
                    c.y = e.y;
                    c.height = e.height;
                    d = true;
                }
                if (c.height < h || f && c.height > f) {
                    c.height = (c.height < h) ? h : f;
                    c.x = e.x;
                    c.y = e.y;
                    c.width = e.width;
                    d = true;
                }
                if (d) {
                    this.setSize(c.width, c.height);
                    this._manageVisibilityFirefox(false);
                    this._setPopupVisible(c.x, c.y);
                    return false;
                }
                this._updateTitleWidth();
                return true;
            }
            return false;
        },
        onResizeEnd: function() {
            this._manageVisibilityFirefox(false);
            this._cachedDragWindowBounds = null;
            var c = this._getCurrentBounds();
            if (!this._dockMode) {
                this._setResizeOverlayVisible(false);
            }
            this._setPopupVisible(c.x, c.y);
            this._storeBounds();
            if (this._overlay && $telerik.isFirefox) {
                this._popupBehavior._onMove();
            }
            this.raiseEvent("resizeEnd", new Sys.EventArgs());
            this._manageVisibilityFirefox(true);
        },
        onDragStart: function() {
            this.setActive(true);
            if (this.isPinned() || this.isMaximized()) {
                return false;
            }
            if (this.isMinimized() && this.get_minimizeZoneID()) {
                return false;
            }
            var e = this.get_popupElement();
            this._cachedDragZoneBounds = this._getRestrictionZoneBounds();
            var d = $telerik.getSize(e);
            var c = $telerik.getBorderBox(e);
            d.width -= c.horizontal;
            d.height -= c.vertical;
            this._cachedDragWindowBounds = d;
            this._setResizeOverlayVisible(true);
            this.raiseEvent("dragStart", new Sys.EventArgs());
            return true;
        },
        onDragEnd: function(d) {
            this._cachedDragZoneBounds = null;
            this._cachedDragWindowBounds = null;
            if (this._overlay && $telerik.isFirefox) {
                this._popupBehavior._onMove();
            }
            this._setResizeOverlayVisible(false);
            this._manageVisibilityFirefox(false);
            var c = this._getCurrentBounds();
            this._manageVisibilityFirefox(false);
            this.moveTo(c.x, c.y);
            this.setActive(true);
            if (this.isMinimized()) {
                this._getTitleElement().style.width = "";
            }
            this._manageVisibilityFirefox(true);
            this.raiseEvent("dragEnd", new Sys.EventArgs());
        },
        onDrag: function(c) {
            if (!this._cachedDragZoneBounds) {
                return true;
            }
            var e = this._cachedDragWindowBounds;
            var f = this._cachedDragZoneBounds;
            c.width = e.width;
            c.height = e.height;
            var d = this._checkRestrictionZoneBounds(f, c);
            if (!d) {
                if (c.x <= f.x) {
                    c.x = f.x;
                } else {
                    if (f.x + f.width <= c.x + e.width) {
                        c.x = f.x + f.width - e.width;
                    }
                }
                if (c.y <= f.y) {
                    c.y = f.y;
                } else {
                    if (f.y + f.height <= c.y + e.height) {
                        c.y = f.y + f.height - e.height;
                    }
                }
                d = true;
            }
            return d;
        },
        initialize: function() {
            b.RadWindow.callBaseMethod(this, "initialize");
            this.initView();
            var d = this.get_element();
            if (d.innerHTML.toLowerCase().indexOf("thank you for using the trial version of radcontrols for asp.net ajax") > 0) {
                d.style.display = "";
            }
            if (this.get_visibleOnPageLoad()) {
                setTimeout(Function.createDelegate(this, function() {
                    this.show();
                }), 0);
            }
            this._registerWindowResizeHandler(true);
            var c = this.get_element().className;
            if (c) {
                this.set_cssClass(c.replace(/^ /, ""));
            }
        },
        initView: function() {
            var c = b.Window.UIFactory;
            if (!this.ui || this.ui.window != this) {
                this.ui = c.getRenderer(this._renderMode, this);
            }
            if (!this.view || this.view.window != this) {
                this.view = c.getView(this._renderMode, this);
            }
        },
        dispose: function() {
            var c = this.get_windowManager();
            if (c) {
                if (c.get_preserveClientState()) {
                    c.saveWindowState(this);
                }
                if (this.get_destroyOnClose()) {
                    c.removeWindow(this);
                }
            }
            this.disposeUI();
            b.RadWindow.callBaseMethod(this, "dispose");
        },
        disposeUI: function() {
            if (this._windowAnimation) {
                this._windowAnimation.dispose();
            }
            if (!$telerik.isChrome && !$telerik.isSafari) {
                this._removeFromDOM = this.get_destroyOnClose();
            }
            this._enableMoveResize(false);
            this._makeModal(false);
            this._registerTitlebarHandlers(false);
            if (this._titleIconElement) {
                $clearHandlers(this._titleIconElement);
            }
            this._registerWindowResizeHandler(false);
            this._registerIframeLoadHandler(false);
            if (this._openerElement) {
                this._registerOpenerElementHandler(this._openerElement, false);
            }
            this.set_behaviors(b.WindowBehaviors.None);
            if (this.view) {
                this.view.dispose();
            }
            if (this.ui) {
                this.ui.dispose();
            }
            this.view = this.ui = null;
            var d = this._iframe;
            if (d) {
                d.radWindow = null;
                var h = "sandbox" in document.createElement("iframe");
                d.src = h ? "about:blank" : "javascript:'<html></html>';";
                d.name = "";
                d.removeAttribute("name");
                d.removeAttribute("NAME");
            }
            this._createTouchScrollExtender(false);
            if (this._contentElement && this._isPredefined) {
                this._contentElement.innerHTML = "";
            }
            var c = this.get_contentElement();
            if (this._dockMode && c) {
                if (Sys && Sys.WebForms) {
                    var g = Sys.WebForms.PageRequestManager.getInstance();
                    if (g && g.get_isInAsyncPostBack()) {
                        $telerik.disposeElement(c);
                    }
                }
            }
            var e = this._popupElement;
            if (e && e.parentNode) {
                e.parentNode.removeChild(e);
            }
            var f = this._popupBehavior;
            if (this.get_destroyOnClose() && f) {
                f.dispose();
                this._popupBehavior = null;
            }
        },
        hide: function() {
            this._hide();
            this._registerGlobalBodyEventHandlers(false);
            return true;
        },
        clone: function(e) {
            var f = document.createElement("span");
            if (e) {
                f.setAttribute("id", e);
            }
            var d = this.get_contentElement();
            var c = d ? d.cloneNode(true) : null;
            if (this._renderMode != 0) {
                this._contentElement = c;
            }
            try {
                var g = $telerik.cloneControl(this, b.RadWindow, f);
            } finally {
                if (this._renderMode != 0 && d) {
                    this.set_contentElement(d);
                }
            }
            return g;
        },
        _createTouchScrollExtender: function(e) {
            var c = $get(this.get_id() + "_C");
            if (c) {
                var d = this._dropDownTouchScroll;
                if (d) {
                    if (!e) {
                        d.dispose();
                        this._dropDownTouchScroll = null;
                    }
                } else {
                    if (e) {
                        this._dropDownTouchScroll = new b.TouchScrollExtender(c);
                        this._dropDownTouchScroll.initialize();
                    }
                }
            }
        },
        set_contentElement: function(c) {
            if (!this._isPredefined && c.getElementsByTagName("iframe").length == 0) {
                this._dockMode = true;
            }
            if (this.view) {
                this.view.setContent(c);
            }
        },
        _setShadowCSSClass: function(c) {
            this.ui.setShadowCssClass(c);
        },
        get_contentElement: function() {
            return this._contentElement || (this.ui ? this.ui.pendingContent : null);
        },
        isCreated: function() {
            return this._popupElement != null;
        },
        show: function() {
            var d = this.isCreated();
            this._createUI();
            var c = new Sys.CancelEventArgs();
            this.raiseEvent("beforeShow", c);
            if (c.get_cancel()) {
                return;
            }
            if (this.get_navigateUrl() && (!d || this.get_reloadOnShow())) {
                this.setUrl(this.get_navigateUrl());
            }
            if (!d && (this.get_initialBehaviors() != b.WindowBehaviors.None)) {
                this._show();
                this._afterShow();
                if (this.isInitialBehaviorEnabled(b.WindowBehaviors.Minimize)) {
                    this.minimize();
                }
                if (this.isInitialBehaviorEnabled(b.WindowBehaviors.Maximize)) {
                    this.maximize();
                }
                if (this.isInitialBehaviorEnabled(b.WindowBehaviors.Pin)) {
                    this.togglePin();
                }
                return;
            }
            if (this.isModal() && this.get_centerIfModal()) {
                this.center();
            }
            if (this.get_animation() == b.WindowAnimation.None) {
                this._show();
                this._afterShow();
            } else {
                this._playAnimation();
            }
        },
        _show: function() {
            if (this.get_offsetElementID() && !this._offsetElement) {
                var e = $get(this.get_offsetElementID());
                if (e) {
                    this._offsetElement = e;
                }
            }
            var d = this._popupBehavior.get_parentElement();
            if (this._offsetElement && !this._offsetSet) {
                this._popupBehavior.set_parentElement(this._offsetElement);
                this._offsetSet = true;
            }
            this.set_visibleTitlebar(this._visibleTitlebar);
            this.set_visibleStatusbar(this._visibleStatusbar);
            this._reSetWindowPosition();
            this._popupVisible = true;
            this.setVisible(true);
            var f = this._getStoredBounds();
            if (this._firstShow && !f) {
                this.set_width(this.get_width());
                this.set_height(this.get_height());
            } else {
                this._restoreBounds();
            }
            if (d != this._popupBehavior.get_parentElement()) {
                this._popupBehavior.set_parentElement(d);
            }
            var c = this.get_contentElement();
            if (!this._isPredefned && c) {
                $telerik.repaintChildren(c);
            }
        },
        _hide: function() {
            if (!this.get_animation() || this.get_animation() == 0) {
                this._afterHide();
            } else {
                if (this._enableShadow && $telerik.isIE) {
                    this._setShadowCSSClass(false);
                }
                var c = Function.createDelegate(this, this._afterHide);
                var d = this.isMaximized();
                $telerik.$(this._popupElement).stop().fadeOut(this.get_animationDuration(), function() {
                    c(d);
                });
            }
        },
        _afterHide: function(c) {
            if (!this._popupBehavior) {
                return;
            }
            this._manageVisibilityFirefox(true);
            if (c == null) {
                c = this.isMaximized();
            }
            var d = this.isMinimized();
            if (c || d) {
                this.restore();
            }
            if ($telerik.isFirefox) {
                this.setOverflowVisible(false);
            }
            this._popupVisible = false;
            if ($telerik.isIE9Mode) {
                this._moveElementToShowOutOfView();
            } else {
                this.setVisible(false);
            }
            this._getWindowController().notifyWindowClosed(this);
        },
        _moveElementToShowOutOfView: function() {
            this.view.moveOutOfSight();
        },
        get_leftHidingPoint: function() {
            return this._isRightToLeft ? 10000 : -10000;
        },
        _afterShow: function() {
            if ($telerik.isIE9Mode) {
                this._restoreElementToShowStyling();
            }
            this.setActive(true);
            if ($telerik.isFirefox) {
                this.setOverflowVisible(true);
            }
            this._registerGlobalBodyEventHandlers(true);
            this._storeBounds();
            this.raiseEvent("show", new Sys.EventArgs());
            var c = !this.get_animation() == b.WindowAnimation.None;
            if (this.get_autoSize() && (this._dockMode || c)) {
                this.autoSize(c);
            }
            if (this.get_enableAriaSupport() && this._popupElement && this.isVisible()) {
                this._popupElement.setAttribute("aria-hidden", "false");
            }
        },
        _restoreElementToShowStyling: function() {
            if (this._popupBehavior) {
                a(this._popupBehavior.get_elementToShow()).css("overflow", "");
            }
        },
        _playAnimation: function() {
            var f = Function.createDelegate(this, function() {
                var p = this._getCalculatedPopupBounds();
                this._setPopupVisible(p.x, p.y);
                var l = $telerik.getBounds(this._popupElement);
                var o = this.get_offsetElementID();
                if (o) {
                    var m = $get(o);
                    if (m) {
                        var n = $telerik.getBounds(m);
                        l.x = n.x;
                        l.y = n.y;
                    }
                }
                $telerik.$(this._popupElement).hide();
                return l;
            });
            var c = this._popupElement;
            if (this._enableShadow && $telerik.isIE) {
                this._setShadowCSSClass(false);
            }
            var e = this.get_animation();
            var k = this._openerElement ? $telerik.getBounds(this._openerElement) : null;
            var g = f();
            var d = this.get_animationDuration();
            var j = "" + this._position;
            var i = null;
            var h = Function.createDelegate(this, function() {
                var l = this.get_popupElement();
                l.style.filter = "";
                if ($telerik.isIE7) {
                    l.style.removeAttribute("filter");
                }
                l.style.opacity = "";
                if (this._enableShadow && $telerik.isIE && !$telerik.isIE6) {
                    this._setShadowCSSClass(true);
                }
                this._show();
                this._afterShow();
            });
            b.Animations.playJQueryAnimation(c, e, k, g, j, i, h, d);
        },
        _onClick: function(c) {
            this.show();
            return this._cancelEvent(c);
        },
        _onKeyDown: function(c) {
            var d = this._shortCutManager.isShortCutHit(c);
            if (!d) {
                return;
            }
            if (this.isActive()) {
                this.fire(d.get_name());
            }
        },
        _cancelEvent: function(c) {
            if (c) {
                c.returnValue = false;
                c.cancelBubble = true;
                c.preventDefault();
                c.stopPropagation();
            }
            return false;
        },
        _getWindowController: function() {
            return b.RadWindowController.getInstance();
        },
        _getReloadOnShowUrl: function(d) {
            var e = "rwndrnd=" + Math.random();
            if (d.indexOf("?") > -1) {
                e = "&" + e;
            } else {
                e = "?" + e;
            }
            var c = d.indexOf("#");
            d = (c > -1) ? d.substr(0, c) + e + d.substr(c) : d + e;
            return d;
        },
        getWindowBounds: function() {
            return this._getCalculatedPopupBounds();
        },
        toString: function() {
            return "[RadWindow id=" + this.get_id() + "]";
        },
        center: function() {
            var c = this._getCentralBounds();
            this.moveTo(c.x, c.y);
        },
        moveTo: function(g, h) {
            var d = this._popupElement;
            if (this.isVisible()) {
                this._manageVisibilityFirefox(false);
            }
            if (d) {
                var c = this.ui.getBounds();
                var e = this._getRestrictionZoneBounds();
                if (e) {
                    var f = this._checkRestrictionZoneBounds(null, new Sys.UI.Bounds(g + e.x, h + e.y, c.width, c.height));
                    if (!f) {
                        return false;
                    }
                }
            }
            g = parseInt(g);
            h = parseInt(h);
            this._createUI();
            this._setPopupVisible(g, h);
            this._storeBounds();
            if (this.isVisible()) {
                this._manageVisibilityFirefox(true);
            }
            return true;
        },
        setSize: function(d, c) {
            this._firstShow = false;
            this.set_width(d);
            this.set_height(c);
            this._storeBounds();
        },
        _calculateBoundsToFit: function(o, e) {
            var p = this.get_minWidth() - this._getHandlesWidth();
            var q = this._getTitleElement();
            if (q) {
                q.style.width = "1px";
            }
            var c;
            var d;
            o.style.height = this._renderMode == 0 ? "1px" : "";
            o.style.width = this._renderMode == 0 ? "1px" : "";
            if (this._dockMode) {
                o.style.position = "absolute";
                try {
                    var l = o.scrollWidth + $telerik.getBorderBox(o).horizontal;
                    d = l > p ? l : p;
                    c = o.scrollHeight;
                    if (this._contentCell) {
                        Sys.UI.DomElement.addCssClass(this._contentCell, "rwLoading");
                    }
                } finally {
                    o.style.position = "";
                }
            } else {
                d = e.scrollWidth;
                if (d < p) {
                    o.style.width = p + "px";
                    d = e.scrollWidth;
                }
                c = e.scrollHeight;
            }
            var m = this._getRestrictionZoneBounds();
            var r = m ? m : this._getViewportBounds();
            var t = this._getHandlesWidth() + d;
            var g = this.get_defaultMinHeight() + c;
            if (this._enableShadow && $telerik.isIE && !$telerik.isIE6 && this._tableElement) {
                var n = parseInt(this._tableElement.offsetHeight) - parseInt(this.get_height());
                if (n > 0) {
                    g -= n;
                }
            }
            var s = Math.min(t, r.width);
            var f = Math.min(g, r.height);
            var k = this.get_minWidth();
            var j = this.get_minHeight();
            var h = parseInt(this.get_maxHeight());
            var i = parseInt(this.get_maxWidth());
            if (k > s) {
                s = k;
            }
            if (j > f) {
                f = j;
            }
            if (h && h < f) {
                f = h;
            }
            if (i && i < s) {
                s = i;
            }
            return {
                width: s,
                height: f,
                contentPageWidth: d,
                contentPageHeight: c
            };
        },
        _autoSizeBehaviorBounds: function(e, c) {
            var f = this._getRestrictionZoneBounds();
            var i = f ? f : this._getViewportBounds();
            var d = e;
            if (f) {
                d.y -= f.y;
                d.x -= f.x;
            }
            if (this.isAutoSizeBehaviorEnabled(b.WindowAutoSizeBehaviors.WidthProportional)) {
                d.x = this.calcPosition(e.x, e.width, c.width, i.width, false);
                d.width = c.width;
            } else {
                if (this.isAutoSizeBehaviorEnabled(b.WindowAutoSizeBehaviors.Width)) {
                    d.width = c.width;
                }
            }
            if (this.isAutoSizeBehaviorEnabled(b.WindowAutoSizeBehaviors.HeightProportional)) {
                d.y = this.calcPosition(e.y, e.height, c.height, i.height, true);
                d.height = c.height;
            } else {
                if (this.isAutoSizeBehaviorEnabled(b.WindowAutoSizeBehaviors.Height)) {
                    d.height = c.height;
                }
            }
            var g = 17;
            if (d.height < c.contentPageHeight) {
                d.width = Math.min(d.width + g, i.width);
            }
            if (d.width < c.contentPageWidth) {
                d.height = Math.min(d.height + g, i.height);
            }
            if (!f) {
                this.set_keepInScreenBounds(true);
            } else {
                if (d.width == f.width) {
                    d.x = 0;
                }
                if (d.height == f.height) {
                    d.y = 0;
                    if (this._enableShadow && $telerik.isIE && !$telerik.isIE6 && this._tableElement) {
                        var h = parseInt(this._tableElement.offsetHeight) - parseInt(this.get_height());
                        d.height -= h;
                    }
                }
            }
            return d;
        },
        autoSize: function(m) {
            if (this.isClosed() || this.isMinimized() || this.isMaximized()) {
                return;
            }
            this.setOverflowVisible(true);
            this._autoSizeInProgress = !this.get_autoSize();
            var e = this.get_contentFrame();
            var j = this.get_popupElement();
            var k = $telerik.getBounds(j);
            var c = $telerik.getBorderBox(j);
            k.width -= c.horizontal;
            k.height -= c.vertical;
            var f = null;
            var h = this.get_keepInScreenBounds();
            var l = this.get_contentElement();
            if (!this._dockMode) {
                try {
                    f = e.contentWindow.document.documentElement;
                    if (!f) {
                        return;
                    }
                } catch (g) {
                    return false;
                }
                l = f;
                if ($telerik.isIE || $telerik.isFirefox) {
                    l = e;
                }
            }
            var d = this._calculateBoundsToFit(l, f);
            var i = this._autoSizeBehaviorBounds(k, d);
            i.width += c.horizontal;
            i.height += c.vertical;
            this.setOverflowVisible(false);
            if (m) {
                this._autoSizeWithAnimation(i);
            } else {
                this._restoreRect = null;
                this.setBounds(i);
                this.setOverflowVisible(true);
                if (this._contentCell) {
                    Sys.UI.DomElement.removeCssClass(this._contentCell, "rwLoading");
                }
                this.raiseEvent("autoSizeEnd", new Sys.EventArgs());
            }
            if ($telerik.isIE && e) {
                e.style.overflow = "hidden";
                setTimeout(function() {
                    e.style.overflow = "";
                }, 0);
            }
            this.set_keepInScreenBounds(h);
            if (e) {
                l.style.width = "100%";
                l.style.height = "100%";
                if ($telerik.isIE9Mode) {
                    this.set_height(this.get_height());
                }
            }
            return true;
        },
        _autoSizeWithAnimation: function(e) {
            var d = this.get_popupElement();
            if (this._enableShadow && $telerik.isIE) {
                this._setShadowCSSClass(false);
            }
            var f = Function.createDelegate(this, function() {
                if (this.isClosed()) {
                    return;
                }
                var h = this.get_popupElement();
                h.style.filter = "";
                if ($telerik.isIE7) {
                    h.style.removeAttribute("filter");
                }
                h.style.opacity = "";
                this._restoreRect = null;
                this.setBounds(e);
                this.setOverflowVisible(true);
                if (this._contentCell) {
                    Sys.UI.DomElement.removeCssClass(this._contentCell, "rwLoading");
                }
                if (this._enableShadow && $telerik.isIE && !$telerik.isIE6) {
                    this._setShadowCSSClass(true);
                }
                this.raiseEvent("autoSizeEnd", new Sys.EventArgs());
            });
            if (this._tableElement) {
                this._tableElement.style.height = "100%";
            }
            var c = {
                width: e.width,
                height: e.height,
                x: e.x,
                y: e.y
            };
            var g = this._getRestrictionZoneBounds();
            if (g) {
                c.x += g.x;
                c.y += g.y;
            }
            $telerik.$(d).animate({
                width: c.width,
                height: c.height,
                left: c.x,
                top: c.y,
                opacity: 1
            }, 300, null, f);
        },
        setBounds: function(c) {
            if (!c) {
                return;
            }
            this._checkRestrictionZoneBounds = function() {
                return true;
            };
            this.moveTo(c.x, c.y);
            this.setSize(c.width, c.height);
            this._checkRestrictionZoneBounds = b.RadWindow.prototype._checkRestrictionZoneBounds;
        },
        _substractWrappersBorder: function(e, f) {
            var h = this.get_popupElement();
            var c = this._contentCell;
            if (!h || !c) {
                return e;
            }
            var g = $telerik.getBorderBox(h);
            var d = $telerik.getBorderBox(c);
            e -= f ? (g.horizontal + d.hrizontal) : (g.vertical + d.vertical);
            return e;
        },
        setWidthDockMode: function(c) {
            if (!this._dockMode || !this.get_contentElement()) {
                return;
            }
            this.view.setContentWidth(c);
        },
        setHeightDockMode: function(d) {
            var c = this.get_contentElement();
            if (!this._dockMode || !c) {
                return;
            }
            this.setContentFixedHeight(d, c);
        },
        setContentFixedHeight: function(d, c) {
            if (this.isCreated()) {
                this.view.setContentFixedHeight(d, c);
            }
        },
        calcPosition: function(g, f, e, i, c) {
            var h = g + Math.round((f - e) / 2);
            if (h < 0 || h + f > i) {
                h = Math.round(Math.abs((i - e) / 2));
                if (this.isAutoSizeBehaviorEnabled(b.WindowAutoSizeBehaviors.Default)) {
                    var d = this._dockMode ? window : this.BrowserWindow;
                    h += c ? Math.max(d.document.documentElement.scrollTop, d.document.body.scrollTop) : Math.max(d.document.documentElement.scrollLeft, d.document.body.scrollLeft);
                }
            }
            return h;
        },
        _maintainMaximizedSize: function() {
            if (this.isVisible() && this._getRestrictionZoneBounds()) {
                this._reSetWindowPosition();
            }
            if (!this.isMaximized()) {
                return;
            }
            if (this.view) {
                this.view.setMaximizeSize();
            }
        },
        _enablePageScrolling: function(e) {
            var c = document.body;
            var d = document.documentElement;
            if (e) {
                if (null != this._documentOverflow) {
                    d.style.overflow = this._documentOverflow;
                }
                if (null != this._bodyOverflow) {
                    c.style.overflow = this._bodyOverflow;
                }
                this._documentOverflow = null;
                this._bodyOverflow = null;
            } else {
                if (null == this._documentOverflow) {
                    this._documentOverflow = d.style.overflow;
                }
                if (null == this._bodyOverflow) {
                    this._bodyOverflow = c.style.overflow;
                }
                c.style.overflow = "hidden";
                d.style.overflow = "hidden";
            }
        },
        _getRestrictionZoneBounds: function() {
            var d = null;
            if (this.get_restrictionZoneID()) {
                var c = $get(this.get_restrictionZoneID());
                if (c) {
                    d = $telerik.getBounds(c);
                    d.scrollLeft = 0;
                    d.scrollTop = 0;
                }
            }
            return d;
        },
        _storeBounds: function() {
            if (!this.isCreated()) {
                return;
            }
            var c = this._getCurrentBounds();
            if (this.isMaximized()) {
                return false;
            }
            if (this.isMinimized()) {
                if (this._restoreRect) {
                    c.width = this._restoreRect.width;
                    c.height = this._restoreRect.height;
                } else {
                    c.width = this.get_width();
                    c.height = this.get_height();
                }
            }
            if ($telerik.isIE9Mode && this._restoreRect && c.x == this.get_leftHidingPoint() && c.y == -10000) {
                c.x = this._restoreRect.x;
                c.y = this._restoreRect.y;
            }
            this._restoreRect = c;
        },
        _restoreBounds: function() {
            if (!this._restoreRect) {
                return;
            }
            var c = this._restoreRect;
            this.setSize(c.width, c.height);
            this.moveTo(c.x, c.y);
        },
        _getStoredBounds: function() {
            if (this._restoreRect) {
                return this._restoreRect;
            }
        },
        _deleteStoredBounds: function() {
            this._restoreRect = null;
        },
        _getCurrentBounds: function() {
            var c = this.ui.getBounds();
            if (this._firstShow != true) {
                this._updateWindowSize(this._height);
                this._firstShow = true;
            }
            var d = this._getRestrictionZoneBounds();
            if (d) {
                c.x -= d.x;
                c.y -= d.y;
            }
            return c;
        },
        _getCentralBounds: function() {
            var c = this._getCurrentBounds();
            var d = this._getViewportBounds();
            var e = parseInt((d.width - c.width) / 2);
            var f = parseInt((d.height - c.height) / 2);
            c.x = e + d.scrollLeft;
            c.y = f + d.scrollTop;
            return c;
        },
        _getViewportBounds: function() {
            var f = this._getRestrictionZoneBounds();
            if (f) {
                return f;
            }
            var c = $telerik.getClientBounds();
            var d = $telerik.getCorrectScrollLeft(document.documentElement) || $telerik.getCorrectScrollLeft(document.body);
            var e = document.documentElement.scrollTop || document.body.scrollTop;
            c.scrollLeft = d;
            c.scrollTop = e;
            if (this.isIE) {
                if (c.width == 0) {
                    c.width = document.body.clientWidth;
                }
                if (c.height == 0) {
                    c.height = document.body.clientHeight;
                }
            }
            return c;
        },
        _getCalculatedPopupBounds: function() {
            var g = this._getStoredBounds();
            if (g) {
                return g;
            }
            var e = this._getCurrentBounds();
            var d = this._offsetElement;
            if (this._top == null && this._left == null && !d) {
                e = this._getCentralBounds();
            } else {
                if (d) {
                    e.y = 0;
                    e.x = 0;
                } else {
                    var f = this._getViewportBounds();
                    e.x = f.scrollLeft;
                    e.y = f.scrollTop;
                }
                var c = this._left ? this._left : 0;
                e.x += c;
                var h = this._top ? this._top : 0;
                e.y += h;
            }
            return e;
        },
        _checkRestrictionZoneBounds: function(e, c) {
            var d = e;
            if (!d) {
                d = this._getRestrictionZoneBounds();
                if (!d) {
                    return true;
                }
            }
            return b.ResizeExtender.containsBounds(d, c);
        },
        _getTitlebarHeight: function() {
            if (!this.ui) {
                return 0;
            }
            return this.ui.getTitlebarHeight();
        },
        _reSetWindowPosition: function() {
            var c = this._getCalculatedPopupBounds();
            this._setPopupVisible(c.x, c.y);
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
        _setPopupVisible: function(c, d) {
            var e = this._getRestrictionZoneBounds();
            if (e) {
                c += e.x;
                d += e.y;
            }
            if (this.isCreated()) {
                this.view.moveTo(c, d);
            }
        },
        _createDefaultTable: function() {
            var c = document.createElement("table");
            c.align = "left";
            c.cellSpacing = 0;
            c.cellPadding = 0;
            c.insertRow(-1);
            return c;
        },
        _isWindowRightToLeft: function() {
            var d = this._isRightToLeft;
            if (d == null) {
                var c = this.get_element();
                var e = c.parentNode ? c : this._getDefaultParent();
                d = this._isRightToLeft = $telerik.isRightToLeft(e);
            }
            return d;
        },
        _createStatusbarResizer: function(c) {
            if (this.ui) {
                this.ui.createStatusbarResizer();
            }
        },
        _createStatusbarMessageCell: function(e) {
            var f = e.rows[0].insertCell(-1);
            f.style.width = "100%";
            var d = this._getStatusMessageElement();
            f.appendChild(d);
            var c = document.createElement("label");
            c.setAttribute("for", d.id);
            c.innerHTML = "status label";
            c.style.display = "none";
            f.appendChild(c);
        },
        _createUI: function() {
            this.initView();
            this.ui.createUI();
        },
        _getDefaultParent: function() {
            var c = this.get_formID() ? document.getElementById(this.get_formID()) : null;
            if (!c) {
                if (document.forms && document.forms.length > 0) {
                    c = document.forms[0];
                } else {
                    c = document.body;
                }
            }
            return c;
        },
        _getStatusMessageElement: function() {
            if (this.ui) {
                return this.ui.getStatusMessageNode();
            }
        },
        _getTitleCommandButtonsHolder: function() {
            if (this.ui) {
                return this.ui.getTitleCommandsContainer();
            }
        },
        _getTitleElement: function() {
            if (this.ui) {
                return this.ui.getTitleNode();
            }
        },
        _getTitleIcon: function() {
            if (this.ui) {
                return this.ui.getIconNode();
            }
        },
        _getTitleCommandButton: function(c) {
            if (this.ui) {
                return this.ui.getCommandButton(c);
            }
        },
        getTitleCommandButton: function(c) {
            return this._getTitleCommandButton(c);
        },
        _getHandlesWidth: function() {
            if (!this._handlesWidth && this.ui) {
                this._handlesWidth = this.ui.getHandlesWidth();
            }
            return this._handlesWidth;
        },
        get_defaultMinWidth: function() {
            if (this.ui) {
                return this.ui.get_uiMinWidth();
            }
        },
        get_defaultMinHeight: function() {
            if (this.ui) {
                return this.ui.get_uiMinHeight();
            }
        },
        setOverflowVisible: function(e) {
            if (!e && this._overflowHidden) {
                return;
            }
            var f = "hidden";
            var d = "hidden";
            var i = "hidden";
            var h;
            var c;
            if (!this._dockMode) {
                try {
                    var g = this.get_contentFrame();
                    if (g) {
                        g.style.overflow = e ? "" : "hidden";
                    }
                    h = g.contentWindow.document.documentElement;
                    if (!h) {
                        return;
                    }
                    c = g.contentWindow.document.body;
                    if (!e) {
                        this._oldBodyOverflow = c.style.overflow;
                        this._oldDocOverflow = h.style.overflow;
                        this._overflowHidden = true;
                    }
                } catch (j) {}
            }
            if (e) {
                d = this._oldBodyOverflow;
                i = this._oldDocOverflow;
                f = "auto";
                this._overflowHidden = false;
            }
            if (this._dockMode) {
                this.get_contentElement().style.overflow = f;
            } else {
                if (h && c) {
                    if (i || i == "") {
                        h.style.overflow = i;
                    }
                    if (d || d == "") {
                        c.style.overflow = d;
                    }
                }
            }
        },
        _manageVisibilityFirefox: function(d) {
            var c = this._popupBehavior;
            if ($telerik.isFirefox && Sys.Browser.version < 4 && c) {
                c.set_manageVisibility(d);
            }
        },
        _updateTitleWidth: function() {
            if (this.ui) {
                this.ui.updateTitleWidth();
            }
        },
        _addWindowToDocument: function() {
            this.view.moveToDefaultParent();
        },
        _createBackReference: function() {
            var f = this;
            if (!f.Argument) {
                f.Argument = {};
            }
            var d = this._iframe;
            try {
                d.radWindow = f;
                if (d.contentWindow != null) {
                    d.contentWindow.radWindow = f;
                }
            } catch (c) {}
        },
        _getFullSkinName: function() {
            return "RadWindow RadWindow_" + this.get_skin() + " rwNormalWindow rwTransparentWindow";
        },
        _configureMinimizeButton: function(c) {
            var e = (true == c) ? this._getLocalizationString("Restore") : this._getLocalizationString("Minimize");
            var d = (true == c) ? this.restore : this.minimize;
            var g = this._getTitleCommandButton("Minimize");
            if (!(this.isBehaviorEnabled(b.WindowBehaviors.Close)) && g) {
                var h = g.parentNode;
                var f = this._isWindowRightToLeft() ? "right" : "left";
                if (true == c) {
                    f = (f == "right") ? "left" : "right";
                }
                h.style.styleFloat = f;
                h.style.cssFloat = f;
            }
            this._registerTitlebarHandlersButton("Minimize", e, d);
        },
        _configureMaximizeButton: function(c) {
            var e = (true == c) ? this._getLocalizationString("Restore") : this._getLocalizationString("Maximize");
            var d = (true == c) ? this.restore : this.maximize;
            this._registerTitlebarHandlersButton("Maximize", e, d);
        },
        _registerTitlebarHandlersButton: function(d, e, c) {
            if (this.ui) {
                this.ui.changeCommandButtonByName(d, e, Function.createDelegate(this, c));
            }
        },
        isCloned: function() {
            return this._isCloned;
        },
        isBehaviorEnabled: function(c) {
            return c & this._behaviors ? true : false;
        },
        isInitialBehaviorEnabled: function(c) {
            return c & this.get_initialBehaviors() ? true : false;
        },
        isAutoSizeBehaviorEnabled: function(c) {
            return c & this.get_autoSizeBehaviors() ? true : false;
        },
        setVisible: function(c) {
            if (c) {
                this.view.show();
            } else {
                this.view.hide();
            }
        },
        isVisible: function() {
            return this._popupVisible;
        },
        isModal: function() {
            return this._modal;
        },
        isActive: function() {
            return this.view && this.view.isActive();
        },
        isPinned: function() {
            var c = this._getTitleCommandButton("Pin");
            return (c && Sys.UI.DomElement.containsCssClass(c, "on"));
        },
        isClosed: function() {
            return (!this.isVisible());
        },
        isMinimized: function() {
            return (this._popupElement && Sys.UI.DomElement.containsCssClass(this._popupElement, "rwMinimizedWindow"));
        },
        isMaximized: function() {
            return (this._popupElement && Sys.UI.DomElement.containsCssClass(this._popupElement, "rwMaximizedWindow"));
        },
        _moveToMinimizeZone: function() {
            var c = $get(this.get_minimizeZoneID());
            if (c) {
                if (this.isPinned()) {
                    this._isMinimizePinned = true;
                    this.togglePin();
                }
                this.view.minimizeToZone(c);
            }
        },
        _moveToDocument: function() {
            this.view.revertToDefaultParent();
            if (this._isMinimizePinned) {
                this._isMinimizePinned = false;
                this.togglePin();
            }
        },
        minimize: function() {
            if (!this.isCreated()) {
                return;
            }
            var c = this.onCommand("Minimize");
            if (!c) {
                return;
            }
            this.setActive(true);
            if (this.isMaximized()) {
                this._normalizeWindowRootCss();
                this._restoreBounds();
            }
            if (this.view) {
                this.view.minimize();
            }
        },
        restore: function() {
            if (!this.isCreated() || this.isClosed()) {
                return;
            }
            var c = this.onCommand("Restore");
            if (!c) {
                return;
            }
            this._configureMinimizeButton();
            this._configureMaximizeButton();
            if (this.isMinimized() && this.get_minimizeZoneID()) {
                this._moveToDocument();
            }
            this._normalizeWindowRootCss();
            this._enablePageScrolling(true);
            this._restoreBounds();
            this._manageVisibilityFirefox(false);
            this.setVisible(true);
            if (this._enableShadow && !$telerik.isIE6) {
                this._setShadowCSSClass(true);
            }
            if (this.get_showOnTopWhenMaximized() && this._restoreZindex) {
                this._popupElement.style.zIndex = this._restoreZindex;
                this._restoreZindex = null;
            }
            this.setVisible(true);
            this.setActive(true);
            this._manageVisibilityFirefox(true);
            if (this.isVisible()) {
                this._show();
            }
        },
        maximize: function() {
            if (!this.isCreated()) {
                return;
            }
            var c = this.onCommand("Maximize");
            if (!c) {
                return;
            }
            this._storeBounds();
            if (this.isMinimized() && this.get_minimizeZoneID()) {
                this._moveToDocument();
            }
            if (this.isMinimized()) {
                this._normalizeWindowRootCss();
                this._checkRestrictionZoneBounds = function() {
                    return true;
                };
                this._restoreBounds();
                this._checkRestrictionZoneBounds = b.RadWindow.prototype._checkRestrictionZoneBounds;
            }
            this.view.maximize();
            if (!this.isActive()) {
                this.setActive(true);
            }
            if (!this.isActive()) {
                this.setActive(true);
            }
        },
        setActive: function(c) {
            if (this.isCreated() && this.view) {
                this.view.setActive(c);
            }
            if (c) {
                this._getWindowController().set_activeWindow(this);
                this.raiseEvent("activate", new Sys.EventArgs());
            }
        },
        togglePin: function() {
            if (!this.isCreated()) {
                return;
            }
            var e = this.onCommand("Pin");
            if (!e) {
                return;
            }
            this.setActive(true);
            var d = this.isPinned();
            var c = d ? this._getLocalizationString("PinOn") : this._getLocalizationString("PinOff");
            this.view.toggleCommand("Pin");
            this._registerTitlebarHandlersButton("Pin", c, this.togglePin);
            b.RadWindowUtils.setPinned(!d, this);
        },
        reload: function() {
            if (!this.isCreated()) {
                return;
            }
            var d = this.onCommand("Reload");
            if (!d) {
                return;
            }
            if (!this._iframe) {
                return;
            }
            this._onWindowUrlChanging();
            try {
                this._iframe.contentWindow.location.reload();
                if (($telerik.isChrome || $telerik.isSafari) && this._iframe.contentWindow.document.domain != document.domain) {
                    this._onWindowUrlChanged();
                }
            } catch (c) {
                this._onWindowUrlChanged();
            }
        },
        fire: function(c) {
            if (c && typeof(this[c]) == "function") {
                this[c]();
            } else {
                var d = this.get_windowManager();
                if (!d) {
                    return;
                }
                if (c && typeof(d[c]) == "function") {
                    d[c]();
                }
            }
        },
        _normalizeWindowRootCss: function() {
            var d = this._popupElement;
            if (d) {
                $telerik.removeCssClasses(d, ["rwMinimizedWindow", "rwMaximizedWindow", "rwMinimizedWindowShadow"]);
                Sys.UI.DomElement.addCssClass(d, "rwNormalWindow");
                var c = d._hideWindowedElementsIFrame;
                if (c) {
                    Sys.UI.DomElement.removeCssClass(c, "rwMinimizedWindowOverlay");
                }
            }
            this._updateTitleWidth();
        },
        close: function(d) {
            if (this.isClosed()) {
                return;
            }
            var e = new Sys.CancelEventArgs();
            var f = (typeof(d) != "undefined" && !(d instanceof Sys.UI.DomEvent)) ? d : null;
            e._argument = f;
            e.get_argument = function() {
                return this._argument;
            };
            this.raiseEvent("beforeClose", e);
            if (e.get_cancel()) {
                return;
            }
            if ($telerik.isIE9Mode && this.isMaximized() && this.get_destroyOnClose()) {
                this._callHideWithTimeOut();
            } else {
                this.hide();
            }
            var c = new Sys.EventArgs();
            c._argument = f;
            c.get_argument = function() {
                return this._argument;
            };
            this.raiseEvent("close", c);
            this._enablePageScrolling(true);
            this._normalizeWindowRootCss();
            if (d instanceof Sys.UI.DomEvent) {
                d = null;
            }
            this._invokeDialogCallBackFunction(d);
            if (this.get_destroyOnClose() && !this._dockMode) {
                this.dispose();
            }
        },
        _callHideWithTimeOut: function() {
            window.setTimeout(Function.createDelegate(this, this.hide), 0);
        },
        _invokeDialogCallBackFunction: function(c) {
            var d = this.get_clientCallBackFunction();
            if (d) {
                if ("string" == typeof(d)) {
                    d = eval(d);
                }
                if ("function" == typeof(d)) {
                    d(this, c);
                }
            }
        },
        onCommand: function(d) {
            var c = new Sys.CancelEventArgs();
            c._commandName = d;
            c.get_commandName = function() {
                return this._commandName;
            };
            this.raise_command(c);
            if (c.get_cancel()) {
                return false;
            }
            return true;
        },
        setUrl: function(d) {
            if (this._dockMode) {
                return;
            }
            this._createUI();
            this.set_navigateUrl(d);
            var c = d;
            if (this.get_reloadOnShow()) {
                c = this._getReloadOnShowUrl(c);
            }
            this.view.setUrl(c);
            if (!this._loaded) {
                this._registerIframeLoadHandler(true);
            }
            this._loaded = true;
        },
        _registerChildPageHandlers: function(c) {
            var d = null;
            try {
                d = this._iframe.contentWindow.document;
                if (d.domain != document.domain) {
                    return;
                }
            } catch (f) {
                return;
            }
            if (null == d) {
                return;
            }
            if (c) {
                this._onChildPageUnloadDelegate = Function.createDelegate(this, this._onChildPageUnload);
                this._iframe.contentWindow.onunload = this._onChildPageUnloadDelegate;
                this._onChildPageClickDelegate = Function.createDelegate(this, this._onChildPageClick);
                $telerik.addExternalHandler(d, "click", this._onChildPageClickDelegate);
            } else {
                if (this._onChildPageClickDelegate) {
                    $telerik.removeExternalHandler(d, "click", this._onChildPageClickDelegate);
                    this._onChildPageClickDelegate = null;
                }
            }
        },
        _onChildPageUnload: function(c) {
            this._registerChildPageHandlers(false);
            if (this._removeFromDOM && !$telerik.isChrome && !$telerik.isSafari) {
                this._removeFromDOM = false;
                var d = this._popupElement;
                if (d && d.parentNode) {
                    d.parentNode.removeChild(d);
                }
            }
        },
        _onChildPageClick: function(c) {
            if (!this.isVisible() || this.isClosed()) {
                return;
            }
            var d = c.target ? c.target : c.srcElement;
            if (d) {
                if (d.tagName == "INPUT" && d.type == "button") {
                    return;
                } else {
                    if (d.tagName == "BUTTON" || d.tagName == "A") {
                        return;
                    }
                }
            }
            this.setActive(true);
        },
        _onIframeLoad: function() {
            this._onWindowUrlChanged();
            if ($telerik.isFirefox) {
                this.setOverflowVisible(true);
            }
            this._registerChildPageHandlers(true);
            this.raiseEvent("pageLoad", new Sys.EventArgs());
            if (this.get_autoSize()) {
                var e = this.get_animation() != b.WindowAnimation.None;
                this.autoSize(e);
            }
            var d = null;
            try {
                d = this._iframe.contentWindow;
                d.close = Function.createDelegate(this, function() {
                    this.close();
                });
            } catch (c) {
                return false;
            }
        },
        _onWindowUrlChanging: function() {
            if (this.isCreated()) {
                this.view.onUrlChanging();
            }
        },
        _onWindowUrlChanged: function() {
            if (this.isCreated()) {
                this.view.onUrlChanged();
            }
        },
        _updatePopupZindex: function() {
            if (this._popupBehavior) {
                if (this.isVisible()) {
                    this._popupBehavior.show();
                }
            }
        },
        _updateOpacity: function() {
            var c = this._dockMode ? this.get_contentElement() : this.get_contentFrame();
            if (c) {
                if (this._opacity < 100) {
                    if (this._contentCell) {
                        this._contentCell.style.background = "none transparent";
                    }
                    var d = c.style;
                    d.filter = "alpha(opacity=" + this._opacity + ")";
                    d.opacity = (this._opacity / 100);
                } else {
                    if (this._contentCell) {
                        this._contentCell.style.background = "";
                    }
                    if ($telerik.isIE) {
                        if (this._contentCell) {
                            this._contentCell.removeAttribute("style");
                        }
                        c.style.removeAttribute("filter");
                        c.style.removeAttribute("opacity");
                    } else {
                        c.style.filter = "";
                        c.style.opacity = "";
                    }
                }
            }
        },
        get_zindex: function() {
            return this.ui ? this.ui.get_zIndexCss() : -1;
        },
        get_browserWindow: function() {
            return this._browserWindow;
        },
        get_contentFrame: function() {
            return this._iframe;
        },
        get_offsetElementID: function() {
            return this._offsetElementID;
        },
        set_offsetElementID: function(c) {
            if (this._offsetElementID != c) {
                this._offsetElementID = c;
                this._offsetElement = $get(c);
                this._deleteStoredBounds();
                this._offsetSet = false;
            }
            if (this.isVisible()) {
                this._show();
            }
        },
        get_openerElementID: function() {
            return this._openerElementID;
        },
        set_openerElementID: function(c) {
            if (this._openerElementID != c) {
                if (this._openerElement) {
                    this._registerOpenerElementHandler(this._openerElement, false);
                    this._openerElement = null;
                }
                this._openerElementID = c;
                if (this._openerElementID) {
                    this._openerElement = $get(this._openerElementID);
                }
                if (this._openerElement) {
                    this._registerOpenerElementHandler(this._openerElement, true);
                }
            }
        },
        get_left: function() {
            return this._left;
        },
        set_left: function(c) {
            if (this._left != c) {
                this._left = parseInt(c) || parseInt(c) == 0 ? parseInt(c) : null;
            }
        },
        get_top: function() {
            return this._top;
        },
        set_top: function(c) {
            if (this._top != c) {
                this._top = parseInt(c) || parseInt(c) == 0 ? parseInt(c) : null;
            }
        },
        get_stylezindex: function() {
            if (this.ui) {
                return this.ui.get_initialZIndexCss();
            }
        },
        get_title: function() {
            return this._title;
        },
        set_title: function(c) {
            if (this._title != c) {
                this._title = c;
            }
            if (this.isCreated()) {
                this.view.setTitleText(this._title);
            }
        },
        get_width: function() {
            return parseInt(this._width);
        },
        _fixSizeValue: function(c) {
            c = "" + c;
            if (-1 == c.indexOf("px")) {
                c = parseInt(c);
                if (!isNaN(c)) {
                    c = c + "px";
                } else {
                    c = "";
                }
            }
            return c;
        },
        set_width: function(h) {
            if (null == h) {
                return false;
            }
            if (this.isMaximized()) {
                return false;
            }
            var e = this.get_minWidth();
            if (e && e > h) {
                h = e;
            }
            var d = parseInt(this.get_maxWidth());
            if (d && d < h && d > e) {
                h = d;
            }
            if (this.isVisible()) {
                this._manageVisibilityFirefox(false);
            }
            h = this._fixSizeValue(h);
            if (this.isCreated()) {
                var f = this.ui.getBounds();
                var c = parseInt(h);
                if (isNaN(c)) {
                    c = f.width;
                }
                var g = this._checkRestrictionZoneBounds(null, new Sys.UI.Bounds(f.x, f.y, c, f.height));
                if (!g) {
                    return false;
                }
            }
            if (this._width != h) {
                this._width = h;
            }
            if (this._dockMode) {
                this.setWidthDockMode(this.get_width());
            }
            if (this.isCreated()) {
                if (!this.popupElementIsOutOfView()) {
                    this._deleteStoredBounds();
                }
                this.view.setWidth(this._width);
            }
            this._updateTitleWidth();
            this._manageVisibilityFirefox(true);
            return true;
        },
        popupElementIsOutOfView: function() {
            return !!this.view && this.view.isOutOfSight();
        },
        get_minWidth: function() {
            var d = parseInt(this._minWidth);
            if (!this.isCreated()) {
                return d;
            }
            var c = this.get_defaultMinWidth();
            return (d && (d > c)) ? d : c;
        },
        set_minWidth: function(c) {
            if (this._minWidth != c) {
                this._minWidth = c;
            }
        },
        get_minHeight: function() {
            var d = parseInt(this._minHeight);
            if (!this.isCreated()) {
                return d;
            }
            var c = this.get_defaultMinHeight();
            return (d && (d > c)) ? d : c;
        },
        set_minHeight: function(c) {
            if (this._minHeight != c) {
                this._minHeight = c;
            }
        },
        get_height: function() {
            return parseInt(this._height);
        },
        set_height: function(h) {
            if (null == h) {
                return false;
            }
            if (this.isMaximized()) {
                return false;
            }
            var e = this.get_minHeight();
            if (e && e > h && (!d || (d && d >= e))) {
                h = e;
            }
            var d = parseInt(this.get_maxHeight());
            if (d && d < h) {
                h = d;
            }
            if (this.isVisible()) {
                this._manageVisibilityFirefox(false);
            }
            h = this._fixSizeValue(h);
            if (this.isCreated()) {
                this._firstShow = false;
                var c = this.get_contentElement();
                if (this._dockMode && c) {
                    c.style.height = "";
                }
                var f = this.ui.getBounds();
                var g = this._checkRestrictionZoneBounds(null, new Sys.UI.Bounds(f.x, f.y, f.width, parseInt(h)));
                if (!g) {
                    return false;
                }
            }
            if (this._height != h) {
                this._height = h;
            }
            if (this._dockMode) {
                this.setHeightDockMode(this.get_height());
            }
            if (this.isCreated()) {
                if (!this.popupElementIsOutOfView()) {
                    this._deleteStoredBounds();
                }
                this.view.setHeight(this._height);
                this.view.updatePopupZindex();
            }
            this._manageVisibilityFirefox(true);
            if (this._isiOS5Safari) {
                this.setContentFixedHeight(this.get_height(), this._iframeWrapper);
            }
            return true;
        },
        _updateWindowSize: function(c, d) {
            if (this.view) {
                this.view.setHeight(c, d);
            }
        },
        get_behaviors: function() {
            return this._behaviors;
        },
        set_behaviors: function(h) {
            if (this._behaviors != h) {
                this._behaviors = h;
            }
            if (null == this._titlebarElement) {
                return;
            }
            this._enableMoveResize(false);
            this._enableMoveResize(true);
            var d = b.WindowBehaviors;
            var c = [
                [this.isBehaviorEnabled(d.Pin), "rwPinButton", this._getLocalizationString("PinOn"), Function.createDelegate(this, this.togglePin)],
                [this.isBehaviorEnabled(d.Reload), "rwReloadButton", this._getLocalizationString("Reload"), Function.createDelegate(this, this.reload)],
                [this.isBehaviorEnabled(d.Minimize), "rwMinimizeButton", this._getLocalizationString("Minimize"), Function.createDelegate(this, this.minimize)],
                [this.isBehaviorEnabled(d.Maximize), "rwMaximizeButton", this._getLocalizationString("Maximize"), Function.createDelegate(this, this.maximize)],
                [this.isBehaviorEnabled(d.Close), "rwCloseButton", this._getLocalizationString("Close"), Function.createDelegate(this, this.close)]
            ];
            var f = [];
            for (var g = 0; g < c.length; g++) {
                var e = c[g];
                if (e[0]) {
                    f.push(e.splice(1, 3));
                }
            }
            if (this.view) {
                this._buttonsArray = this.view.setCommandButtons(f);
            }
        },
        addShortcut: function(c, d) {
            if (this._shortCutManager) {
                this._shortCutManager.addShortCut(c.toLowerCase(), d);
            } else {
                if (!this.get_shortcuts()) {
                    this._shortcuts = "[['" + c.toLowerCase() + "', '" + d + "']]";
                }
                this._registerGlobalBodyEventHandlers(true);
            }
        },
        removeShortcut: function(c) {
            if (this._shortCutManager) {
                this._shortCutManager.removeShortCut(c.toLowerCase());
            }
        },
        getShortcutString: function(d) {
            if (!this._shortCutManager) {
                return null;
            }
            var c = this._shortCutManager.findShortCutByName(d.toLowerCase());
            return (c && c.get_shortCutString()) ? c.get_shortCutString() : null;
        },
        isShortcutAdded: function(c) {
            return this.getShortcutString(c.toLowerCase()) ? true : false;
        },
        removeAllShortcutsCommand: function(c) {
            while (this.isShortcutAdded(c)) {
                this.removeShortcut(c.toLowerCase());
            }
        },
        get_modal: function() {
            return this._modal;
        },
        set_modal: function(c) {
            if (this._modal != c) {
                this._modal = c;
            }
            this._makeModal(this._modal);
            if (this.isVisible()) {
                this._afterShow();
            }
        },
        get_visibleTitlebar: function() {
            return this._visibleTitlebar;
        },
        set_visibleTitlebar: function(d) {
            if (this._visibleTitlebar != d) {
                this._visibleTitlebar = d;
            }
            var c = this.get_popupElement();
            if (c) {
                d ? Sys.UI.DomElement.removeCssClass(c, "rwNoTitleBar") : Sys.UI.DomElement.addCssClass(c, "rwNoTitleBar");
            }
            if (this.ui && this.ui.titlebar) {
                this.ui.titlebar.style.display = d ? "" : "none";
                if (this.get_enableAriaSupport()) {
                    this.ui.titlebar.setAttribute("aria-hidden", !d);
                }
            }
        },
        get_visibleStatusbar: function() {
            return this._visibleStatusbar;
        },
        set_visibleStatusbar: function(c) {
            if (this._visibleStatusbar != c) {
                this._visibleStatusbar = c;
            }
            if (this._statusCell) {
                this._statusCell.parentNode.style.display = c ? "" : "none";
                if (this.get_enableAriaSupport()) {
                    this._statusCell.parentNode.setAttribute("aria-hidden", !c);
                }
            }
        },
        get_overlay: function() {
            return this._overlay;
        },
        set_overlay: function(c) {
            this._overlay = c;
            if (this._popupBehavior) {
                this._popupBehavior.set_overlay(this._overlay);
            }
            if (this.isVisible()) {
                this._reSetWindowPosition();
            }
        },
        get_opacity: function() {
            return this._opacity;
        },
        set_opacity: function(c) {
            if (this.get_opacity() != c) {
                this._opacity = c > 100 ? 100 : c;
                this._opacity = c < 0 ? 0 : c;
                if (this.isCreated()) {
                    this._updateOpacity();
                }
            }
        },
        get_iconUrl: function() {
            return this._iconUrl;
        },
        set_iconUrl: function(c) {
            this._iconUrl = c;
            if (this._titleIconElement) {
                if (this.get_iconUrl() == "") {
                    this._titleIconElement.className = "rwIcon";
                } else {
                    this._titleIconElement.style.background = "transparent url('" + c + "') no-repeat scroll 0px 0px";
                }
            }
        },
        get_renderMode: function() {
            return this._renderMode;
        },
        set_renderMode: function(c) {
            this._renderMode = c;
        },
        get_keepInScreenBounds: function() {
            return this._keepInScreenBounds;
        },
        set_keepInScreenBounds: function(c) {
            this._keepInScreenBounds = c;
            if (this._popupBehavior) {
                this._popupBehavior.set_keepInScreenBounds(this._keepInScreenBounds);
            }
            if (this.isVisible()) {
                this._reSetWindowPosition();
            }
        },
        get_popupElement: function() {
            return this._popupElement;
        },
        set_status: function(d) {
            var c = this._getStatusMessageElement();
            if (c) {
                window.setTimeout(function() {
                    c.value = d;
                }, 0);
            }
        },
        get_status: function() {
            var c = this._getStatusMessageElement();
            if (c) {
                return c.value;
            }
        },
        raise_command: function(c) {
            this.raiseEvent("command", c);
        },
        add_resize: function(c) {
            this.get_events().addHandler("resizeEnd", c);
        },
        remove_resize: function(c) {
            this.get_events().removeHandler("resizeEnd", c);
        },
        saveClientState: function() {
            var d = ["position"];
            var e = {};
            for (var c = 0; c < d.length; c++) {
                e[d[c]] = this["get_" + d[c]]();
            }
            return Sys.Serialization.JavaScriptSerializer.serialize(e);
        },
        _applyAriaForLayoutTables: function() {
            var e = this._tableElement;
            if (e) {
                e.setAttribute("role", "presentation");
                var m = e.getElementsByTagName("tr");
                for (var c = 0; c < m.length; c++) {
                    var l = m[c];
                    l.setAttribute("role", "presentation");
                    var h = l.getElementsByTagName("td");
                    for (var d = 0; d < h.length; d++) {
                        h[d].setAttribute("role", "presentation");
                    }
                }
            }
            var k = this.ui.titlebar;
            if (k) {
                k.setAttribute("role", "presentation");
            }
            var f = this._statusCell;
            if (f) {
                var g = f.getElementsByTagName("table")[0];
                if (g) {
                    g.setAttribute("role", "presentation");
                }
            }
        },
        _applyAriaSupport: function() {
            this._applyAriaForLayoutTables();
            var c = this.get_popupElement();
            c.setAttribute("aria-hidden", "true");
            c.setAttribute("aria-labelledby", this._getTitleElement().id);
            if (this._isPredefined) {
                c.setAttribute("role", "alertdialog");
                c.setAttribute("aria-describedby", this.get_id() + "_content");
            } else {
                c.setAttribute("role", "dialog");
            }
        }
    };
    a.registerControlProperties(b.RadWindow, {
        minimizeZoneID: null,
        restrictionZoneID: "",
        minimizeIconUrl: null,
        clientCallBackFunction: null,
        navigateUrl: null,
        localization: null,
        shortcuts: null,
        initialBehaviors: b.WindowBehaviors.None,
        destroyOnClose: false,
        reloadOnShow: false,
        showContentDuringLoad: true,
        visibleOnPageLoad: false,
        showOnTopWhenMaximized: true,
        animation: b.WindowAnimation.None,
        animationDuration: 500,
        autoSize: false,
        autoSizeBehaviors: b.WindowAutoSizeBehaviors.Default,
        windowManager: null,
        cssClass: "",
        name: null,
        skin: "Deafult",
        formID: null,
        enableShadow: false,
        enableAriaSupport: false,
        maxWidth: null,
        maxHeight: null,
        centerIfModal: true
    });
    a.registerControlEvents(b.RadWindow, ["command", "dragStart", "dragEnd", "activate", "beforeShow", "show", "pageLoad", "close", "beforeClose", "resizeStart", "resizeEnd", "autoSizeEnd"]);
    b.RadWindow.registerClass("Telerik.Web.UI.RadWindow", b.RadWebControl);
    b.RadWindowUtils._zIndex = 3000;
    b.RadWindowUtils.get_newZindex = function(c) {
        c = parseInt(c);
        if (null == c || isNaN(c)) {
            c = 0;
        }
        if (b.RadWindowUtils._zIndex < c) {
            b.RadWindowUtils._zIndex = c;
        }
        b.RadWindowUtils._zIndex++;
        return b.RadWindowUtils._zIndex;
    };
    b.RadWindowUtils._pinnedList = {};
    b.RadWindowUtils.setPinned = function(i, g) {
        if (i) {
            var h = g._getViewportBounds();
            var j = g._getCurrentBounds();
            g.LeftOffset = j.x - h.scrollLeft;
            g.TopOffset = j.y - h.scrollTop;
            var d = window.setInterval(function() {
                b.RadWindowUtils._updatePinnedElementPosition(g);
            }, 100);
            b.RadWindowUtils._pinnedList[d] = g;
        } else {
            var c = null;
            var f = b.RadWindowUtils._pinnedList;
            for (var e in f) {
                if (f[e] == g) {
                    c = e;
                    break;
                }
            }
            if (null != c) {
                window.clearInterval(c);
                b.RadWindowUtils._pinnedList[c] = null;
            }
            g.TopOffset = null;
            g.LeftOffset = null;
        }
    };
    b.RadWindowUtils._updatePinnedElementPosition = function(d) {
        if (d.isMaximized() || !d.isVisible()) {
            return;
        }
        var e = d._getViewportBounds();
        var g = d._getCurrentBounds();
        var c = (d.LeftOffset != null) ? d.LeftOffset + e.scrollLeft : g.x;
        var f = (d.TopOffset != null) ? d.TopOffset + e.scrollTop : g.y;
        if (g.x != c || g.y != f) {
            d.moveTo(c, f);
        }
    };
})();
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.IRenderer = function() {};
    b.IRenderer.prototype = {
        createUI: function() {},
        setContent: function(d) {},
        get_container: function() {},
        getHandlesWidth: function() {},
        setShadowCssClass: function(d) {},
        getBounds: function() {},
        updateTitleWidth: function() {},
        getTitleNode: function() {},
        createTitle: function() {},
        getIconNode: function() {},
        createIcon: function() {},
        getTitleCommandsContainer: function() {},
        createTitleCommandsContainer: function() {},
        getStatusMessageNode: function() {},
        createStatusMessage: function() {},
        createStatusbarResizer: function() {},
        getCommandButton: function() {},
        createCommandButton: function(d) {},
        changeCommandButton: function(d, f, e) {},
        changeCommandButtonByName: function(e, f, d) {},
        clearCommandButtons: function() {},
        geTitlebarHeight: function() {},
        get_zIndexCss: function() {},
        get_initialZIndexCss: function() {},
        get_uiMinWidth: function() {},
        get_uiMinHeight: function() {},
        dispose: function() {}
    };
    b.IRenderer.registerInterface("Telerik.Web.UI.Window.IRenderer");
    b.RendererBase = function(d) {
        this.window = d;
    };
    b.RendererBase.prototype = {};
    b.RendererBase.registerClass("Telerik.Web.UI.Window.RendererBase", null, b.IRenderer);
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.IView = function() {};
    b.IView.prototype = {
        moveTo: function(d, e) {},
        setContent: function(d) {},
        setUrl: function(d) {},
        show: function() {},
        hide: function() {},
        isVisible: function() {},
        maximize: function() {},
        minimize: function() {},
        setWidth: function(d) {},
        setHeight: function() {},
        setMaximizeSize: function() {},
        setContentFixedHeight: function() {},
        setContentWidth: function(d) {},
        setTitleText: function(d) {},
        showShadow: function() {},
        hideShadow: function() {},
        moveOutOfSight: function() {},
        isOutOfSight: function() {},
        enableMoveResize: function(d) {},
        disableMoveResize: function(d) {},
        setCommandButtons: function(d) {},
        toggleCommand: function(d) {},
        minimizeToZone: function(d) {},
        moveToDefaultParent: function() {},
        revertToDefaultParent: function() {},
        setActive: function(d) {},
        isActive: function() {},
        onUrlChanging: function() {},
        onUrlChanged: function() {},
        updatePopupZindex: function() {},
        dispose: function() {}
    };
    b.IView.registerInterface("Telerik.Web.UI.Window.IView");
    b.ViewBase = function(d) {
        this.window = d;
    };
    b.ViewBase.prototype = {};
    b.ViewBase.registerClass("Telerik.Web.UI.Window.ViewBase", null, b.IView);
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.ClassicRenderer = function(d) {
        b.ClassicRenderer.initializeBase(this, [d]);
        this.container = this.table = this.titleCell = this.titlebar = this.topResizer = this.commandsContainer = this.title = this.icon = this.statusMessage = this.contentFrame = this.content = this.contentCell = this.bottomResizer = this.statusCell = null;
    };
    b.ClassicRenderer.prototype = {
        createUI: function() {
            if (!this.container) {
                var E = this.window.get_id();
                var F = "RadWindowWrapper_" + E;
                var q = this.window._isWindowRightToLeft();
                var t = document.createElement("div");
                t.id = F;
                t.className = this.window._getFullSkinName();
                var l = this.window.get_cssClass();
                if (l) {
                    Sys.UI.DomElement.addCssClass(t, l);
                }
                if (q) {
                    Sys.UI.DomElement.addCssClass(t, "RadWindow_rtl");
                }
                if (!this.window._visibleTitlebar) {
                    Sys.UI.DomElement.addCssClass(t, "rwNoTitleBar");
                }
                t.style.width = this.window._width;
                t.style.height = this.window._height;
                t.setAttribute("unselectable", "on");
                this.container = this.window._popupElement = t;
                var x = document.createElement("table");
                x.cellSpacing = 0;
                x.cellPadding = 0;
                Sys.UI.DomElement.addCssClass(x, "rwTable");
                this.table = this.window._tableElement = x;
                var f = [];
                if (q) {
                    f = ["rwCorner rwTopRight", "rwTitlebar", "rwCorner rwTopLeft", "rwCorner rwBodyRight", "rwWindowContent", "rwCorner rwBodyLeft", "rwCorner rwBodyRight", "rwStatusbar", "rwCorner rwBodyLeft", "rwCorner rwFooterRight", "rwFooterCenter", "rwCorner rwFooterLeft"];
                } else {
                    f = ["rwCorner rwTopLeft", "rwTitlebar", "rwCorner rwTopRight", "rwCorner rwBodyLeft", "rwWindowContent", "rwCorner rwBodyRight", "rwCorner rwBodyLeft", "rwStatusbar", "rwCorner rwBodyRight", "rwCorner rwFooterLeft", "rwFooterCenter", "rwCorner rwFooterRight"];
                }
                var v = ["rwTitleRow", "rwContentRow", "rwStatusbarRow", "rwFooterRow"];
                var p = 0;
                for (var m = 0; m < 4; m++) {
                    var u = x.insertRow(-1);
                    u.className = v[m];
                    for (var r = 1; r <= 3; r++) {
                        var d = u.insertCell(-1);
                        d.innerHTML = "&nbsp;";
                        d.className = f[p];
                        p++;
                    }
                }
                var A = x.rows[0].cells[1];
                A.innerHTML = "";
                this.titleCell = this.window._titleCell = A;
                var C = document.createElement("div");
                C.className = "rwTopResize";
                C.innerHTML = "<!-- / -->";
                this.topResizer = this.window._topResizer = C;
                this.titleCell.appendChild(this.window._topResizer);
                var y = this.window._createDefaultTable();
                y.className = "rwTitlebarControls";
                this.titlebar = this.window._titlebarElement = y;
                this.titleCell.appendChild(this.titlebar);
                var D = this.getIconNode();
                var n = this.titlebar.rows[0].insertCell(-1);
                n.appendChild(D);
                this.window.set_iconUrl(this.window.get_iconUrl());
                var B = this.getTitleNode();
                var z = this.titlebar.rows[0].insertCell(-1);
                z.appendChild(B);
                this.window.set_title(this.window._title);
                var g = this.titlebar.rows[0].insertCell(-1);
                g.noWrap = true;
                g.style.whiteSpace = "nowrap";
                g.appendChild(this.window._getTitleCommandButtonsHolder());
                var h = x.rows[1].cells[1];
                h.vAlign = "top";
                h.innerHTML = "";
                this.contentCell = this.window._contentCell = h;
                if (!(this.window._dockMode || this.window._isPredefined)) {
                    Sys.UI.DomElement.addCssClass(this.contentCell, "rwExternalContent");
                }
                if (this.window._enableShadow && !$telerik.isIE6) {
                    this.window._setShadowCSSClass(true);
                }
                var s = this.window.get_name();
                var w = this.window._createDefaultTable();
                w.style.width = "100%";
                this.statusCell = this.window._statusCell = x.rows[2].cells[1];
                this.statusCell.innerHTML = "";
                this.statusCell.appendChild(w);
                if (!q) {
                    this.window._createStatusbarMessageCell(w);
                }
                if (this.window.isBehaviorEnabled(Telerik.Web.UI.WindowBehaviors.Resize)) {
                    this.createStatusbarResizer(w);
                }
                if (q) {
                    this.window._createStatusbarMessageCell(w);
                }
                this.container.appendChild(this.window._tableElement);
                this.container.style.display = "none";
                this.container.style.position = "absolute";
                this.window._addWindowToDocument();
                this.window._registerTitlebarHandlers(true);
                this.window.set_visibleTitlebar(this.window._visibleTitlebar);
                this.window.set_visibleStatusbar(this.window._visibleStatusbar);
                if (this.window.get_enableAriaSupport()) {
                    this.window._applyAriaSupport();
                }
                if (this.window._dockMode) {
                    var k = this.content = $get(this.window.get_id() + "_C");
                    if (k && k.innerHTML) {
                        k.style.display = "";
                        k.style.overflow = "auto";
                        k.style.border = "0px";
                        this.window.set_contentElement(k);
                        this.window.setWidthDockMode(this.window.get_width());
                        this.window.setHeightDockMode(this.window.get_height());
                    }
                } else {
                    var e = ($telerik.isIE && !$telerik.isIE9Mode) ? document.createElement("<iframe name='" + s + "'>") : document.createElement("iframe");
                    e.name = s;
                    e.src = "javascript:'<html></html>';";
                    e.style.width = "100%";
                    e.style.height = "100%";
                    e.style.border = "0px";
                    e.frameBorder = "0";
                    if ($telerik.isIE8) {
                        e.style.display = "block";
                    }
                    this.contentFrame = this.window._iframe = e;
                    if ($telerik.isMobileSafari && !this.window._isPredefined) {
                        var o = document.createElement("div");
                        a(o).addClass("rwIframeWrapperIOS");
                        o.appendChild(this.contentFrame);
                        this.contentCell.appendChild(o);
                        if (this.window._isiOS5Safari) {
                            this.window.setContentFixedHeight(this.window.get_height(), o);
                        }
                        this.window._iframeWrapper = o;
                    } else {
                        this.contentCell.appendChild(this.window._iframe);
                    }
                    this.window._createBackReference();
                }
                this.window._updateOpacity();
            }
            if (!$telerik.isTouchDevice) {
                this.container.style.Transform = "none";
                this.container.style.BackfaceVisibility = "visible";
                this.container.style.webkitTransform = "none";
                this.container.style.webkitBackfaceVisibility = "visible";
                this.container.style.OTransform = "none";
                this.container.style.OBackfaceVisibility = "visible";
                this.container.style.MozTransform = "none";
                this.container.style.MozBackfaceVisibility = "visible";
                this.container.style.msTransform = "none";
                this.container.style.msBackfaceVisibility = "visible";
            }
            if (!this.window._popupBehavior) {
                this.window.set_behaviors(this.window._behaviors);
                this.popupBehavior = this.window._popupBehavior = $create(Telerik.Web.PopupBehavior, {
                    id: (new Date() - 100) + "PopupBehavior",
                    parentElement: null,
                    overlay: this.window._overlay,
                    keepInScreenBounds: this.window._keepInScreenBounds
                }, null, null, this.container);
            }
        },
        setContent: function(d) {
            this.contentCell.appendChild(d);
            d.style.display = "";
            this.content = this.window._contentElement = d;
        },
        get_container: function() {
            return this.container;
        },
        getHandlesWidth: function() {
            if (!this._handlesWidth) {
                var e = this.table;
                if (!e) {
                    return 0;
                }
                var d = parseInt($telerik.getCurrentStyle(e.rows[2].cells[0], "width"));
                if (!d) {
                    return 0;
                }
                this._handlesWidth = 2 * d;
            }
            return this._handlesWidth;
        },
        setShadowCssClass: function(d) {
            if (d) {
                Sys.UI.DomElement.addCssClass(this.container, "rwShadow");
                Sys.UI.DomElement.addCssClass(this.table, "rwShadow");
            } else {
                Sys.UI.DomElement.removeCssClass(this.container, "rwShadow");
                Sys.UI.DomElement.removeCssClass(this.table, "rwShadow");
            }
        },
        getBounds: function() {
            var e = this.container;
            var f = (e.style.display == "none");
            e.style.display = "";
            var d = $telerik.getBounds(e);
            if (f) {
                e.style.display = "none";
            }
            return d;
        },
        updateTitleWidth: function() {
            if (this.window._visibleTitlebar && !this.window.isMinimized()) {
                var k = this.getTitleNode();
                if (!k) {
                    return;
                }
                k.style.width = "1px";
                var l = 0;
                var e = this.getTitleCommandsContainer();
                var d = e.offsetWidth;
                if (d > 0) {
                    var h = e.getElementsByTagName("LI");
                    if (h.length == 0) {
                        d = 0;
                    } else {
                        if (h[0] && h[0].offsetWidth > 0) {
                            d = h.length * h[0].offsetWidth;
                        }
                    }
                    e.style.width = d ? d + "px" : "";
                    l += d;
                }
                var f = this.getIconNode();
                var g = f.offsetWidth;
                if (g > 0 && f.parentNode.tagName == "TD") {
                    f.parentNode.style.width = g + "px";
                    l += g;
                }
                l += this.getHandlesWidth();
                var i = 0;
                var j = this.titlebar;
                i = j ? j.offsetWidth - l : l;
                if (i > 0) {
                    k.style.width = i + "px";
                }
            }
        },
        getTitleNode: function() {
            if (!this.title) {
                this.createTitle();
            }
            return this.title;
        },
        createTitle: function() {
            var d = document.createElement("em");
            d.setAttribute("unselectable", "on");
            if (this.window.get_enableAriaSupport()) {
                d.id = this.window.get_id() + "_title";
                d.setAttribute("role", "label");
            }
            return this.title = this.window._titleElement = d;
        },
        getIconNode: function() {
            if (!this.icon) {
                this.createIcon();
            }
            return this.icon;
        },
        createIcon: function() {
            var d = document.createElement("a");
            d.className = "rwIcon";
            $addHandler(d, "mousedown", this.window._cancelEvent);
            this.icon = this.window._titleIconElement = d;
        },
        getTitleCommandsContainer: function() {
            if (!this.commandsContainer) {
                this.createTitleCommandsContainer();
            }
            return this.commandsContainer;
        },
        createTitleCommandsContainer: function() {
            var d = document.createElement("ul");
            d.className = "rwControlButtons";
            if (this.window.get_enableAriaSupport()) {
                d.setAttribute("role", "presentation");
            }
            this.commandsContainer = this.window._buttonsElement = d;
        },
        getStatusMessageNode: function() {
            if (!this.statusMessage) {
                this.createStatusMessage();
            }
            return this.statusMessage;
        },
        createStatusMessage: function() {
            var d = document.createElement("input");
            d.id = this.window.get_id() + "_status";
            d.readOnly = "readonly";
            d.setAttribute("unselectable", "on");
            this.statusMessage = this.window._statusMessageElement = d;
        },
        createStatusbarResizer: function() {
            if (this.bottomResizer) {
                return;
            }
            var d = this.statusCell.firstChild.rows[0].insertCell(-1);
            d.style.width = "15px";
            var e = document.createElement("div");
            d.appendChild(e);
            this.bottomResizer = this.window._bottomResizer = e;
        },
        getCommandButton: function(d) {
            if (!d || !this.commandsContainer) {
                return null;
            }
            var e = d.toLowerCase();
            e = e.charAt(0).toUpperCase() + e.substring(1);
            d = "rw" + e + "Button";
            return a("." + d, this.commandsContainer)[0];
        },
        createCommandButton: function(d) {
            var f = document.createElement("li");
            var e = document.createElement("a");
            e.href = "javascript:void(0);";
            e.className = d[0];
            e.setAttribute("title", d[1]);
            if (this.window.get_enableAriaSupport()) {
                f.setAttribute("role", "presentation");
                e.setAttribute("role", "button");
            }
            var g = document.createElement("span");
            g.innerHTML = d[1];
            e.appendChild(g);
            $telerik.addHandler(e, "click", d[2]);
            $addHandlers(e, {
                dblclick: this._cancelEvent,
                mousedown: this._cancelEvent
            }, this);
            $telerik.addHandler(e, "click", this._cancelEvent);
            f.appendChild(e);
            this.commandsContainer.appendChild(f);
            return e;
        },
        changeCommandButton: function(d, f, e) {
            if (!d) {
                return;
            }
            d.setAttribute("title", f);
            d.innerHTML = f;
            $telerik.clearHandlers(d);
            $telerik.addHandler(d, "click", e);
            $addHandlers(d, {
                dblclick: this._cancelEvent,
                mousedown: this._cancelEvent
            }, this);
        },
        changeCommandButtonByName: function(e, g, f) {
            var d = this.getCommandButton(e);
            if (d) {
                this.changeCommandButton(d, g, f);
            }
        },
        clearCommandButtons: function() {
            var e = a(this.commandsContainer);
            var d = e.find("a[class$='Button']");
            for (var f = 0; f < d.length; f++) {
                this.clearCommandButton(d[f]);
            }
            e.empty();
        },
        clearCommandButton: function(d) {
            $clearHandlers(d);
        },
        getTitlebarHeight: function() {
            if (!this.table) {
                return 0;
            }
            return this.table.rows[0].offsetHeight;
        },
        get_zIndexCss: function() {
            return this.container ? this.container.style.zIndex : -1;
        },
        get_initialZIndexCss: function() {
            var d = this.window.get_element();
            return d ? parseInt(d.style.zIndex || $telerik.getComputedStyle(d, "zIndex")) : null;
        },
        get_uiMinWidth: function() {
            if (!this._defaultMinWidth) {
                var d = this.getHandlesWidth();
                this._defaultMinWidth = d;
                if (this.window._visibleTitlebar) {
                    var f = this.table;
                    var h = this.title;
                    var e = h.style.width;
                    if (h) {
                        h.style.width = "1px";
                    }
                    if (this.content) {
                        this.content.style.width = "1px";
                    }
                    f.style.width = "1px";
                    var g = this.titleCell.offsetWidth;
                    h.style.width = e;
                    f.style.width = "";
                    if (this.content) {
                        this.content.style.width = "";
                    }
                    this._defaultMinWidth += g;
                }
            }
            return this._defaultMinWidth;
        },
        get_uiMinHeight: function() {
            if (!this._defaultMinHeight) {
                var d = Math.ceil(this.getHandlesWidth() / 2);
                this._defaultMinHeight = d;
                this._defaultMinHeight += this.window._visibleTitlebar ? this.titleCell.offsetHeight : d;
                this._defaultMinHeight += this.window._visibleStatusbar ? this.statusCell.offsetHeight : 0;
            }
            return this._defaultMinHeight;
        },
        dispose: function() {
            this.container = this.table = this.titleCell = this.titlebar = this.topResizer = this.commandsContainer = this.title = this.icon = this.statusMessage = this.contentFrame = this.content = this.contentCell = this.bottomResizer = this.statusCell = null;
        },
        _cancelEvent: function(d) {
            return $telerik.cancelRawEvent(d);
        }
    };
    b.ClassicRenderer.registerClass("Telerik.Web.UI.Window.ClassicRenderer", b.RendererBase, b.IRenderer);
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.ClassicView = function(d) {
        b.ClassicView.initializeBase(this, [d]);
        this.ui = this.window.ui;
    };
    b.ClassicView.prototype = {
        moveTo: function(d, e) {
            this.ui.popupBehavior._setCoordinates(d, e);
            this.ui.popupBehavior.show();
            this._removeExplicitMSAjaxWidth();
            this.ui.updateTitleWidth();
        },
        show: function() {
            if (this.ui.popupBehavior) {
                this.ui.popupBehavior.show();
            }
            this._isViewVisible = true;
        },
        hide: function() {
            if (this.ui.popupBehavior) {
                this.ui.popupBehavior.hide();
            }
            this._isViewVisible = false;
            this._ariaHide();
        },
        isVisible: function() {
            return this._isViewVisible;
        },
        setContent: function(e) {
            var d = this.ui.content;
            if (d && e != d) {
                $telerik.disposeElement(d);
                d.innerHTML = "";
                d.appendChild(e);
                e = d;
            }
            this.ui.createUI();
            if (this.ui.contentFrame) {
                this.ui.contentFrame.style.display = "none";
            } else {
                if (!this.window._dropDownTouchScroll && Telerik.Web.UI.TouchScrollExtender._getNeedsScrollExtender()) {
                    this.window._createTouchScrollExtender(true);
                }
            }
            this.ui.setContent(e);
        },
        setUrl: function(e) {
            var d = this.ui.contentFrame;
            if (!d) {
                return;
            }
            d.src = e;
            this.onUrlChanging();
        },
        maximize: function() {
            this.ui.setShadowCssClass(false);
            var d = this.ui.container;
            $telerik.removeCssClasses(d, ["rwNormalWindow", "rwMinimizedWindow", "rwMinimizedWindowShadow"]);
            Sys.UI.DomElement.addCssClass(d, "rwMaximizedWindow");
            this.window._configureMaximizeButton(true);
            this.window._configureMinimizeButton();
            this.window._maintainMaximizedSize();
            this.window._maintainMaximizedSize();
            var e = d._hideWindowedElementsIFrame;
            if (e) {
                Sys.UI.DomElement.removeCssClass(e, "rwMinimizedWindowOverlay");
                this.ui.popupBehavior._handleElementResize();
            }
            if (this.window.get_showOnTopWhenMaximized()) {
                var f = d.style.zIndex;
                if (f) {
                    this.window._restoreZindex = f;
                }
                d.style.zIndex = 100000;
            }
            this.ui.updateTitleWidth();
        },
        setMaximizeSize: function() {
            var e = this.ui.container;
            if (!e) {
                return;
            }
            var i = this.window._getViewportBounds();
            e.style.top = (i.scrollTop + i.y) + "px";
            e.style.left = (i.scrollLeft + i.x) + "px";
            var g = parseInt(this.window.get_maxWidth());
            var f = parseInt(this.window.get_maxHeight());
            if (g) {
                i.width = g;
            }
            if (f) {
                i.height = f;
            }
            $telerik.setSize(e, {
                width: i.width,
                height: i.height
            });
            var l = this.window._getRestrictionZoneBounds();
            if (!l) {
                this.window._enablePageScrolling(false);
            }
            var j = this.window._tableElement;
            i = $telerik.getContentSize(e);
            var d = $telerik.getBorderBox(j);
            var h = $telerik.getPaddingBox(j);
            var k = i.height - d.vertical - h.vertical;
            j.style.height = k + "px";
            this.window._fixIeHeight(j, k);
            if (this.window._dockMode) {
                this.window.setWidthDockMode(i.width);
                this.window.setHeightDockMode(i.height);
            }
            this.ui.updateTitleWidth();
            if (this.window._isiOS5Safari) {
                this.window.setContentFixedHeight(i.height, this.window._iframeWrapper);
            }
        },
        minimize: function() {
            this.window._configureMinimizeButton(true);
            this.window._configureMinimizeButton(true);
            this.window._enablePageScrolling(true);
            var d = this.ui.container;
            $telerik.removeCssClasses(d, ["rwNormalWindow", "rwMaximizedWindow"]);
            Sys.UI.DomElement.addCssClass(d, "rwMinimizedWindow");
            if (this.window._enableShadow && !$telerik.isIE6) {
                this.ui.setShadowCssClass(true);
                Sys.UI.DomElement.addCssClass(d, "rwMinimizedWindowShadow");
            }
            var e = d._hideWindowedElementsIFrame;
            if (e) {
                Sys.UI.DomElement.addCssClass(e, "rwMinimizedWindowOverlay");
            }
            this.ui.getTitleNode().style.width = "";
            this.minimizeToZone(this.window.get_minimizeZoneID());
        },
        setWidth: function(e) {
            var d = this.ui.container;
            var f = parseInt(e);
            d.style.width = (f - $telerik.getBorderBox(d).horizontal) + "px";
            this.updatePopupZindex();
        },
        setHeight: function(j, i) {
            var e = this.ui.container;
            var h = this.ui.table;
            var f = parseInt(j ? j : h.style.height);
            if (true == i) {
                f = h.offsetHeight;
            }
            if (parseInt(f) == 0) {
                return;
            }
            var d = $telerik.getBorderBox(e).vertical;
            f = f > d ? f - d : f;
            var g = f + "px";
            h.style.height = g;
            this._fixTableHeightInIE(h, f);
            e.style.height = g;
        },
        setContentFixedHeight: function(f, d) {
            if (!d) {
                return;
            }
            var j = this.ui;
            var g = this._substractWrappersBorder(f);
            var k = this.window.isVisible();
            var e = j.table.rows[3].cells[1];
            var i = j.table.rows[0].cells[1];
            var h = j.table.rows[2].cells[1];
            g -= k ? parseInt($telerik.getBounds(e).height) : parseInt($telerik.getCurrentStyle(e, "height"));
            if (this.window._visibleTitlebar) {
                g -= k ? parseInt($telerik.getBounds(j.titlebar).height) : parseInt($telerik.getCurrentStyle(j.titlebar, "height"));
                g -= k ? parseInt($telerik.getBounds(j.topResizer).height) : parseInt($telerik.getCurrentStyle(j.topResizer, "height"));
            } else {
                g -= k ? parseInt($telerik.getBounds(i).height) : parseInt($telerik.getCurrentStyle(i, "height"));
            }
            if (this.window._visibleStatusbar) {
                g -= k ? parseInt($telerik.getBounds(h).height) : parseInt($telerik.getCurrentStyle(h, "height"));
            }
            if (g > 0) {
                d.style.height = g + "px";
            }
        },
        setContentWidth: function(d) {
            if (!this.ui.content) {
                return;
            }
            widthToSet = this.window._substractWrappersBorder(d) - this.ui.getHandlesWidth();
            if (widthToSet > 0) {
                this.ui.content.style.width = widthToSet + "px";
            }
        },
        setTitleText: function(d) {
            if (!this.ui.title) {
                return;
            }
            this.ui.title.innerHTML = d || "&nbsp;";
            this.ui.updateTitleWidth();
        },
        showShadow: function() {
            this.ui.setShadowCssClass(true);
        },
        hideShadow: function() {
            this.ui.setShadowCssClass(false);
        },
        moveOutOfSight: function() {
            var e = this.ui.popupBehavior;
            if (e) {
                this.window._storeBounds();
                var d = e.get_elementToShow();
                a(d).css({
                    display: "",
                    position: "absolute",
                    top: "-10000px",
                    left: this.window.get_leftHidingPoint() + "px",
                    overflow: "hidden"
                });
                if (d._hideWindowedElementsIFrame && d._hideWindowedElementsIFrame.style) {
                    d._hideWindowedElementsIFrame.style.display = "none";
                }
            }
            this._ariaHide();
        },
        isOutOfSight: function() {
            var d = this.ui.container;
            if (!d) {
                return false;
            }
            var e = parseInt(d.style.left, 10);
            return $telerik.isIE9Mode && e == this.window.get_leftHidingPoint();
        },
        enableMoveResize: function(d) {
            this.disableMoveResize(d);
            if (!this.ui.container) {
                return;
            }
            var h = this.ui.table.rows;
            var e = {};
            var g = this.window._isWindowRightToLeft();
            if (d.resize) {
                this.ui.createStatusbarResizer();
                this.ui.bottomResizer.style.display = "";
                if (g) {
                    e = {
                        nw: h[0].cells[2],
                        n: this.ui.topResizer,
                        ne: h[0].cells[0],
                        w: [h[1].cells[2], h[2].cells[2]],
                        e: [h[1].cells[0], h[2].cells[0]],
                        sw: h[3].cells[2],
                        s: h[3].cells[1],
                        se: [h[3].cells[0], this.ui.bottomResizer]
                    };
                } else {
                    e = {
                        nw: h[0].cells[0],
                        n: this.ui.topResizer,
                        ne: h[0].cells[2],
                        w: [h[1].cells[0], h[2].cells[0]],
                        e: [h[1].cells[2], h[2].cells[2]],
                        sw: h[3].cells[0],
                        s: h[3].cells[1],
                        se: [h[3].cells[2], this.ui.bottomResizer]
                    };
                }
            }
            if (d.move) {
                e.move = this.ui.titleCell;
            }
            this.resizeExtender = this.window._resizeExtender = new Telerik.Web.UI.ResizeExtender(this.window, this.ui.container, e, this.ui.table);
            var f = this.window._dockMode ? null : this.ui.contentFrame;
            this.resizeExtender.set_iframeToSkip(f);
        },
        disableMoveResize: function(d) {
            if (this.resizeExtender) {
                this.resizeExtender.dispose();
                this.resizeExtender = this.window._resizeExtender = null;
            }
            if (d.Resize && this.ui.bottomResizer) {
                this.ui.bottomResizer.style.display = "none";
            }
        },
        setCommandButtons: function(d) {
            var e = [];
            this.ui.clearCommandButtons();
            for (var f = 0; f < d.length; f++) {
                e.push(this.ui.createCommandButton(d[f]));
            }
            this.ui.updateTitleWidth();
            return e;
        },
        toggleCommand: function(e) {
            var d = this.ui.getCommandButton(e);
            if (!d) {
                return;
            }
            Sys.UI.DomElement.toggleCssClass(d, "on");
        },
        minimizeToZone: function(e) {
            if (!e) {
                return;
            }
            if (typeof(e) == "string") {
                e = $get(e);
            }
            var d = this.ui.container;
            if (d.parentNode != e) {
                d.parentNode.removeChild(d);
                e.appendChild(d);
                this.window.setVisible(true);
                d.style.position = "static";
                if ($telerik.isIE) {
                    d.style.display = "inline";
                } else {
                    d.style.cssFloat = "left";
                }
            }
        },
        moveToDefaultParent: function() {
            var d = this.window._getDefaultParent();
            d.insertBefore(this.ui.container, d.firstChild);
        },
        revertToDefaultParent: function() {
            var d = this.ui.container;
            d.parentNode.removeChild(d);
            d.style.position = "absolute";
            if ($telerik.isIE) {
                d.style.display = "";
            } else {
                d.style.cssFloat = "";
            }
            this.moveToDefaultParent();
        },
        setActive: function(e) {
            var d = this.ui.container;
            if (e) {
                if (!this.window.isMaximized()) {
                    var g = parseInt(d.style.zIndex);
                    var f = this.ui.get_initialZIndexCss() || Telerik.Web.UI.RadWindowUtils.get_newZindex(g);
                    d.style.zIndex = "" + f;
                }
                Sys.UI.DomElement.removeCssClass(d, "rwInactiveWindow");
            } else {
                Sys.UI.DomElement.addCssClass(d, "rwInactiveWindow");
            }
        },
        isActive: function() {
            var d = this.ui.container;
            return (d && !Sys.UI.DomElement.containsCssClass(d, "rwInactiveWindow"));
        },
        onUrlChanging: function() {
            if (!this.ui.contentFrame) {
                return;
            }
            if (this.window.get_showContentDuringLoad()) {
                var e = this.ui.statusMessage;
                if (e) {
                    Sys.UI.DomElement.addCssClass(e, "rwLoading");
                }
            } else {
                var d = this.ui.contentFrame;
                var f = d.style;
                f.position = "absolute";
                f.top = "-10000px";
                if ($telerik.isIE9Mode) {
                    this.setHeight(this.window._height);
                }
                if (this.window._isWindowRightToLeft() && $telerik.isChrome) {
                    f.width = "1px";
                }
                var g = d.parentNode;
                Sys.UI.DomElement.addCssClass(g, "rwLoading");
            }
        },
        onUrlChanged: function() {
            var h = this.ui.statusMessage;
            var g = this.ui.contentFrame;
            if (this.window.get_showContentDuringLoad()) {
                if (h) {
                    Sys.UI.DomElement.removeCssClass(h, "rwLoading");
                }
            } else {
                g.style.position = "";
                if (this.window._isWindowRightToLeft() && $telerik.isChrome) {
                    g.style.width = "100%";
                }
                var j = g.parentNode;
                Sys.UI.DomElement.removeCssClass(j, "rwLoading");
                if ($telerik.isIE9Mode) {
                    if (this.window.isMaximized()) {
                        this.window._maintainMaximizedSize();
                    } else {
                        if (!this.window.isMinimized()) {
                            this.setHeight(this.window.get_height());
                        }
                    }
                }
            }
            if (h) {
                this.window.set_status(this.window.get_navigateUrl());
            }
            try {
                var d = g.contentWindow.document;
                var i = d.title;
                if (i && i != this.window.get_title()) {
                    this.window.set_title(i.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
                }
            } catch (f) {}
        },
        updatePopupZindex: function() {
            var d = this.ui.popupBehavior;
            if (d) {
                if (this.window.isVisible()) {
                    d.show();
                }
            }
        },
        dispose: function() {},
        _substractWrappersBorder: function(f, g) {
            var i = this.ui.container;
            var d = this.ui.contentCell;
            if (!i || !d) {
                return f;
            }
            var h = $telerik.getBorderBox(i);
            var e = $telerik.getBorderBox(d);
            f -= g ? (h.horizontal + e.hrizontal) : (h.vertical + e.vertical);
            return f;
        },
        _fixTableHeightInIE: function(g, e) {
            if ("CSS1Compat" == document.compatMode) {
                var d = (g.offsetHeight - parseInt(e));
                if (d > 0) {
                    var f = (parseInt(g.style.height) - d);
                    if (f > 0) {
                        g.style.height = f + "px";
                    }
                }
            }
        },
        _removeExplicitMSAjaxWidth: function() {
            if (!this.window.get_width()) {
                this.ui.container.style.width = "";
            }
        },
        _ariaHide: function() {
            if (this.window.get_enableAriaSupport() && this.ui.container && !this.window.isVisible()) {
                this.ui.container.setAttribute("aria-hidden", "true");
            }
        }
    };
    b.ClassicView.registerClass("Telerik.Web.UI.Window.ClassicView", b.ViewBase, b.IView);
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.LightweightRenderer = function(d) {
        b.LightweightRenderer.initializeBase(this, [d]);
        this.options = a.extend({
            skin: this.window.get_skin(),
            minTitleWidth: 30
        });
        this.container = this.titlebar = this.icon = this.title = this.commandsContainer = this.content = this.contentFrame = this.statusbar = this.statusMessage = this.topResizer = this.bottomResizer = null;
    };
    b.LightweightRenderer.prototype = {
        createUI: function() {
            if (this.container) {
                return;
            }
            var l = this.window._isWindowRightToLeft();
            var d = Sys.UI.DomElement.addCssClass;
            var e = document.createElement("div");
            this.container = this.window._popupElement = e;
            e.id = "RadWindowWrapper_" + this.window.get_id();
            e.className = this._getSkinCssClass();
            var i = this.window.get_cssClass();
            if (i) {
                d(e, i);
            }
            if (l) {
                d(e, "rwRtl");
            }
            if (!this.window._visibleTitlebar) {
                d(e, "rwNoTitleBar");
            }
            this.setShadowCssClass(this.window._enableShadow);
            e.setAttribute("unselectable", "on");
            var f = e.style;
            f.width = this.window._width;
            f.height = this.window._height;
            f.position = "absolute";
            var n = this.titlebar = this.window._titlebarElement = document.createElement("div");
            n.className = "rwTitleBar";
            e.appendChild(n);
            var o = document.createElement("div");
            o.className = "rwTitleWrapper";
            n.appendChild(o);
            o.appendChild(this.getIconNode());
            o.appendChild(this.getTitleNode());
            this.window.set_title(this.window._title);
            o.appendChild(this.getTitleCommandsContainer());
            this.window._registerTitlebarHandlers(true);
            var g = this.content = $get(this.window.get_id() + "_C") || this.pendingContent || document.createElement("div");
            if (g) {
                g.removeAttribute("id");
                g.style.display = "none";
                g.className = "rwContent";
                this.setContent(g);
            }
            if (!this.window._dockMode) {
                var h = g.getElementsByTagName("iframe");
                var j = h.length > 0 ? h[0] : document.createElement(($telerik.isIE && !$telerik.isIE9Mode) ? "<iframe name='" + name + "'>" : "iframe");
                j.name = name;
                j.src = "javascript:'<html></html>';";
                j.style.width = "100%";
                j.style.height = "100%";
                j.style.border = "0px";
                j.frameBorder = "0";
                if ($telerik.isIE8) {
                    j.style.display = "block";
                }
                this.contentFrame = this.window._iframe = j;
                if ($telerik.isMobileSafari && !this.window._isPredefined) {
                    var k = document.createElement("div");
                    a(k).addClass("rwIframeWrapperIOS");
                    k.appendChild(this.contentFrame);
                    if (this.window._isiOS5Safari) {
                        this.window.setContentFixedHeight(this.window.get_height(), k);
                    }
                    this.window._iframeWrapper = k;
                }
                Sys.UI.DomElement.addCssClass(this.content, "rwExternalContent");
                this.content.appendChild(this.contentFrame);
                this.window._createBackReference();
            }
            if (this.window._visibleStatusbar) {
                var m = this.statusbar = document.createElement("div");
                m.className = "rwStatusBar";
                e.appendChild(m);
                m.appendChild(this.getStatusMessageNode());
                if (this.window.isBehaviorEnabled(Telerik.Web.UI.WindowBehaviors.Resize)) {
                    m.appendChild(this.createStatusbarResizer());
                }
            }
            this.window._addWindowToDocument();
            if (!$telerik.isTouchDevice) {
                this.container.style.Transform = "none";
                this.container.style.BackfaceVisibility = "visible";
                this.container.style.webkitTransform = "none";
                this.container.style.webkitBackfaceVisibility = "visible";
                this.container.style.OTransform = "none";
                this.container.style.OBackfaceVisibility = "visible";
                this.container.style.MozTransform = "none";
                this.container.style.MozBackfaceVisibility = "visible";
                this.container.style.msTransform = "none";
                this.container.style.msBackfaceVisibility = "visible";
            }
            if (!this.window._popupBehavior) {
                this.window.set_behaviors(this.window._behaviors);
                this.popupBehavior = this.window._popupBehavior = $create(Telerik.Web.PopupBehavior, {
                    id: (new Date() - 100) + "PopupBehavior",
                    parentElement: null,
                    overlay: this.window._overlay,
                    keepInScreenBounds: this.window._keepInScreenBounds
                }, null, null, this.container);
            }
        },
        _getSkinCssClass: function() {
            return "RadWindow RadWindow_" + this.options.skin + " rwTransparentWindow rwRoundedCorner";
        },
        setContent: function(d) {
            this._setContent(d);
            this.content = this.window._contentElement = d;
        },
        _setContent: function(e) {
            var d = this.container.children;
            if (d.length == 1) {
                this.container.appendChild(e);
            } else {
                this.container.insertBefore(e, d[1]);
            }
            e.style.display = "";
        },
        get_container: function() {
            return this.container;
        },
        getHandlesWidth: function() {
            return 12;
        },
        setShadowCssClass: function(e) {
            var d = e ? Sys.UI.DomElement.addCssClass : Sys.UI.DomElement.removeCssClass;
            d(this.container, "rwShadow");
        },
        getBounds: function() {
            var e = this.container;
            var f = (e.style.display == "none");
            e.style.display = "";
            var d = $telerik.getBounds(e);
            if (f) {
                e.style.display = "none";
            }
            return d;
        },
        showContentOverlay: function() {
            var d = this.contentOverlay;
            if (!this.contentOverlay) {
                d = this.createContentOverlay();
            }
            d.style.display = "";
        },
        hideContentOverlay: function() {
            if (!this.contentOverlay) {
                return;
            }
            this.contentOverlay.style.display = "none";
        },
        createContentOverlay: function() {
            var d = this.content;
            var e = this.contentOverlay = document.createElement("div");
            var f = e.style;
            f.position = "absolute";
            f.top = 0;
            f.left = 0;
            f.zIndex = "1";
            f.backgroundColor = "white";
            f.filter = "alpha(opacity=0)";
            f.opacity = 0;
            f.width = "100%";
            f.height = "100%";
            d.appendChild(e);
            return e;
        },
        updateTitleWidth: function() {},
        getTitleNode: function() {
            if (!this.title) {
                this.createTitle();
            }
            return this.title;
        },
        createTitle: function() {
            var d = document.createElement("h6");
            d.setAttribute("unselectable", "on");
            d.className = "rwTitle";
            if (this.window.get_enableAriaSupport()) {
                d.id = this.window.get_id() + "_title";
                d.setAttribute("role", "label");
            }
            this.title = this.window._titleElement = d;
        },
        getIconNode: function() {
            if (!this.icon) {
                this.createIcon();
            }
            return this.icon;
        },
        createIcon: function() {
            var d = document.createElement("span");
            d.className = "rwIcon";
            this.icon = this.window._titleIconElement = d;
        },
        getTitleCommandsContainer: function() {
            if (!this.commandsContainer) {
                this.createTitleCommandsContainer();
            }
            return this.commandsContainer;
        },
        createTitleCommandsContainer: function() {
            var d = document.createElement("ul");
            d.className = "rwCommands";
            if (this.window.get_enableAriaSupport()) {
                d.setAttribute("role", "presentation");
            }
            this.commandsContainer = this.window._buttonsElement = d;
        },
        getStatusMessageNode: function() {
            if (!this.statusMessage) {
                this.createStatusMessage();
            }
            return this.statusMessage;
        },
        createStatusMessage: function() {
            var d = document.createElement("input");
            d.id = this.window.get_id() + "_status";
            d.readOnly = "readonly";
            d.setAttribute("unselectable", "on");
            this.statusMessage = this._statusMessageElement = d;
        },
        createStatusbarResizer: function() {
            if (this.bottomResizer) {
                return;
            }
            var d = document.createElement("span");
            d.className = "rwResize";
            return this.bottomResizer = d;
        },
        getCommandButton: function(d) {
            if (!d || !this.commandsContainer) {
                return null;
            }
            var e = d.toLowerCase();
            e = e.charAt(0).toUpperCase() + e.substring(1);
            var f = ".rw" + e + "Button, .rw" + e;
            return a(f, this.commandsContainer)[0];
        },
        createCommandButton: function(e) {
            var f = document.createElement("li");
            f.className = "rwListItem";
            var d = document.createElement("button");
            d.className = e[0];
            d.innerHTML = d.title = e[1];
            $telerik.addHandler(d, "click", this._preventDefault);
            $telerik.addHandler(d, "click", e[2]);
            $addHandlers(d, {
                dblclick: this._cancelEvent,
                mousedown: this._cancelEvent
            }, this);
            f.appendChild(d);
            this.commandsContainer.appendChild(f);
            if (this.window.get_enableAriaSupport()) {
                f.setAttribute("role", "presentation");
                d.setAttribute("role", "button");
            }
            return d;
        },
        changeCommandButton: function(d, f, e) {
            d.innerHTML = d.title = f;
            $telerik.clearHandlers(d);
            $telerik.addHandler(d, "click", this._preventDefault);
            $telerik.addHandler(d, "click", e);
            $addHandlers(d, {
                dblclick: this._cancelEvent,
                mousedown: this._cancelEvent
            }, this);
        },
        changeCommandButtonByName: function(f, g, e) {
            var d = this.getCommandButton(f);
            if (d) {
                this.changeCommandButton(d, g, e);
            }
        },
        clearCommandButtons: function() {
            var e = a(this.commandsContainer);
            var d = e.find("button");
            for (var f = 0; f < d.length; f++) {
                this.clearCommandButton(d[f]);
            }
            e.empty();
        },
        clearCommandButton: function(d) {
            $telerik.clearHandlers(d);
        },
        geTitlebarHeight: function() {
            if (!this.titlebar) {
                return 0;
            }
            return this.titlebar.offsetHeight;
        },
        get_zIndexCss: function() {
            return this.container ? this.container.style.zIndex : -1;
        },
        get_initialZIndexCss: function() {
            var d = this.window.get_element();
            return d ? parseInt(d.style.zIndex || $telerik.getComputedStyle(d, "zIndex")) : null;
        },
        get_uiMinWidth: function() {
            this._minUIWidth = this.options.minTitleWidth || 0;
            this._minUIWidth += this.getHandlesWidth();
            if (this.commandsContainer) {
                this._minUIWidth += this.commandsContainer.offsetWidth;
            }
            if (this.icon) {
                this._minUIWidth += this.icon.offsetWidth;
            }
            return this._minUIWidth;
        },
        get_uiMinHeight: function() {
            if (!this._minUIHeight) {
                this._minUIHeight = this.getHandlesWidth() || 0;
                if (this.window._visibleTitlebar) {
                    this._minUIHeight += this.titlebar.offsetHeight;
                }
                if (this.window._visibleStatusbar) {
                    this._minUIHeight += this.statusbar.offsetHeight;
                }
            }
            return this._minUIHeight;
        },
        dispose: function() {
            this.container = this.titlebar = this.icon = this.title = this.commandsContainer = this.content = this.contentFrame = this.statusbar = this.statusMessage = this.topResizer = this.bottomResizer = null;
        },
        _cancelEvent: function(d) {
            return $telerik.cancelRawEvent(d);
        },
        _preventDefault: function(d) {
            if (d.preventDefault) {
                d.preventDefault();
            }
            d.returnValue = false;
        }
    };
    b.LightweightRenderer.registerClass("Telerik.Web.UI.Window.LightweightRenderer", b.RendererBase, b.IRenderer);
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.LightweightView = function(d) {
        b.LightweightView.initializeBase(this, [d]);
        this.ui = this.window.ui;
    };
    b.LightweightView.prototype = {
        moveTo: function(d, e) {
            this.ui.popupBehavior._setCoordinates(d, e);
            this.ui.popupBehavior.show();
            this._removeExplicitMSAjaxWidth();
            this.ui.updateTitleWidth();
            this.window.set_left(d);
            this.window.set_top(e);
        },
        setContent: function(e) {
            var d = this.ui.content;
            if (d && e != d) {
                $telerik.disposeElement(d);
                d.innerHTML = "";
                d.appendChild(e);
                e = d;
            }
            if (!this.window.isCreated()) {
                this.ui.pendingContent = e;
            }
            this.ui.createUI();
            if (this.window._isPredefined && this.ui.contentFrame) {
                this.ui.contentFrame.style.display = "none";
                this.ui.contentFrame.style.height = "";
            }
            if (this.ui.contentFrame && this.ui.contentFrame.parentNode != e) {
                this.ui.contentFrame.style.display = "none";
            } else {
                if (!this.window._dropDownTouchScroll && Telerik.Web.UI.TouchScrollExtender._getNeedsScrollExtender()) {
                    this.window._createTouchScrollExtender(true);
                }
            }
            this.ui.setContent(e);
        },
        setUrl: function(e) {
            var d = this.ui.contentFrame;
            if (!d) {
                return;
            }
            d.src = e;
            this.setContentFixedHeight(this.window.get_height(), this.ui.content);
            this.onUrlChanging();
        },
        show: function() {
            if (this.ui.popupBehavior) {
                this.ui.popupBehavior.show();
            }
            this._repaintResizable();
            this._isViewVisible = true;
        },
        hide: function() {
            if (this.ui.popupBehavior) {
                this.ui.popupBehavior.hide();
            }
            this._isViewVisible = false;
        },
        isVisible: function() {
            return this._isViewVisible;
        },
        maximize: function() {
            this.ui.setShadowCssClass(false);
            var d = this.ui.container;
            $telerik.removeCssClasses(d, ["rwNormalWindow", "rwMinimizedWindow", "rwMinimizedWindowShadow"]);
            Sys.UI.DomElement.addCssClass(d, "rwMaximizedWindow");
            this.window._configureMaximizeButton(true);
            this.window._configureMinimizeButton();
            this.window._maintainMaximizedSize();
            this.window._maintainMaximizedSize();
            var e = d._hideWindowedElementsIFrame;
            if (e) {
                Sys.UI.DomElement.removeCssClass(e, "rwMinimizedWindowOverlay");
                this.ui.popupBehavior._handleElementResize();
            }
            if (this.window.get_showOnTopWhenMaximized()) {
                var f = d.style.zIndex;
                if (f) {
                    this.window._restoreZindex = f;
                }
                d.style.zIndex = 100000;
            }
            this.ui.updateTitleWidth();
        },
        setMaximizeSize: function() {
            var d = this.ui.container;
            if (!d) {
                return;
            }
            var g = this.window._getViewportBounds();
            d.style.top = (g.scrollTop + g.y) + "px";
            d.style.left = (g.scrollLeft + g.x) + "px";
            var f = parseInt(this.window.get_maxWidth());
            var e = parseInt(this.window.get_maxHeight());
            if (f) {
                g.width = f;
            }
            if (e) {
                g.height = e;
            }
            $telerik.setSize(d, {
                width: g.width,
                height: g.height
            });
            var h = this.window._getRestrictionZoneBounds();
            if (!h) {
                this.window._enablePageScrolling(false);
            }
            if (this.window._dockMode) {
                this.window.setWidthDockMode(g.width);
                this.window.setHeightDockMode(g.height);
            }
            this.ui.updateTitleWidth();
            if (this.ui.contentFrame) {
                this.setContentFixedHeight(g.height, this.ui.content);
            }
        },
        minimize: function() {
            this.window._configureMinimizeButton(true);
            this.window._configureMinimizeButton(true);
            this.window._enablePageScrolling(true);
            var d = this.ui.container;
            $telerik.removeCssClasses(d, ["rwNormalWindow", "rwMaximizedWindow"]);
            Sys.UI.DomElement.addCssClass(d, "rwMinimizedWindow");
            if (this.window._enableShadow && !$telerik.isIE6) {
                this.ui.setShadowCssClass(true);
                Sys.UI.DomElement.addCssClass(d, "rwMinimizedWindowShadow");
            }
            var e = d._hideWindowedElementsIFrame;
            if (e) {
                Sys.UI.DomElement.addCssClass(e, "rwMinimizedWindowOverlay");
            }
            this.setWidth(200);
            this.setHeight(this.ui.titlebar.offsetHeight);
            this.ui.getTitleNode().style.width = "";
            this.minimizeToZone(this.window.get_minimizeZoneID());
        },
        setWidth: function(d) {
            this._setWidth(d);
            this._repaintResizable();
        },
        _setWidth: function(e) {
            var d = this.ui.container;
            var f = parseInt(e);
            f -= $telerik.getBorderBox(d).horizontal;
            f -= $telerik.getPaddingBox(d).horizontal;
            d.style.width = f + "px";
        },
        setHeight: function(d) {
            this._setHeight(d);
            this._repaintResizable();
        },
        _setHeight: function(h) {
            var d = this.ui.container;
            var f = parseInt(h);
            if (f == 0) {
                return;
            }
            this.setContentFixedHeight(f, this.ui.content);
            var e = $telerik.getBorderBox(d).vertical;
            e += $telerik.getPadding(d, Telerik.Web.BoxSide.Bottom);
            f = f > e ? f - e : f;
            var g = f + "px";
            d.style.height = g;
        },
        setContentFixedHeight: function(e, d) {
            if (!d) {
                return;
            }
            var g = this.ui;
            var f = this._substractWrappersBorder(e) - $telerik.getPaddingBox(g.container).vertical;
            var h = this.window.isVisible();
            if (this.window._visibleTitlebar) {
                f -= h ? parseInt($telerik.getBounds(g.titlebar).height) : parseInt($telerik.getCurrentStyle(g.titlebar, "height"));
            }
            f -= $telerik.getPaddingBox(d).vertical;
            f -= $telerik.getBorderBox(d).vertical;
            if (this.window._visibleStatusbar) {
                f -= h ? parseInt(g.statusbar.offsetHeight) : parseInt($telerik.getCurrentStyle(g.statusbar, "height"));
                f -= h ? 0 : parseInt($telerik.getBorderBox(g.statusbar).vertical);
            }
            if (f > 0) {
                d.style.height = f + "px";
            }
        },
        setContentWidth: function(d) {
            this.ui.content.style.width = "";
        },
        setTitleText: function(d) {
            if (!this.ui.title) {
                return;
            }
            this.ui.title.innerHTML = d || "&nbsp;";
            this.ui.updateTitleWidth();
        },
        showShadow: function() {
            this.ui.setShadowCssClass(true);
        },
        hideShadow: function() {
            this.ui.setShadowCssClass(false);
        },
        moveOutOfSight: function() {
            var e = this.ui.popupBehavior;
            if (e) {
                this.window._storeBounds();
                var d = e.get_elementToShow();
                a(d).css({
                    display: "",
                    position: "absolute",
                    top: "-10000px",
                    left: this.window.get_leftHidingPoint() + "px",
                    overflow: "hidden"
                });
                if (d._hideWindowedElementsIFrame && d._hideWindowedElementsIFrame.style) {
                    d._hideWindowedElementsIFrame.style.display = "none";
                }
            }
            this._ariaHide();
        },
        isOutOfSight: function() {
            var d = this.ui.container;
            if (!d) {
                return false;
            }
            var e = parseInt(d.style.left, 10);
            return $telerik.isIE9Mode && e == this.window.get_leftHidingPoint();
        },
        enableMoveResize: function(d) {
            this.disableMoveResize(d);
            if (d.move && !this.draggable) {
                this.draggable = new Telerik.Web.UI.Widgets.Draggable(this.ui.container, {
                    handle: this.ui.titlebar,
                    shouldPreventDefault: false
                });
                this.draggable.add_dragStart(Function.createDelegate(this, function(i, f) {
                    this._cancelDragSelection(f.get_domEvent());
                    this.window.setActive(true);
                    var n = this.window.isPinned() || this.window.isMaximized() || (this.window.isMinimized() && this.window.get_minimizeZoneID());
                    f.set_cancel(n);
                    if (n) {
                        return;
                    }
                    this.restrictBounds = this.window._getRestrictionZoneBounds();
                    var l = $telerik.getPaddingBox(this.ui.container);
                    if (this.restrictBounds) {
                        var g = $telerik.getBorderBox(this.ui.container);
                        var j = this.restrictBounds,
                            k = {
                                x: j.x,
                                y: j.y,
                                width: j.width - l.horizontal - g.horizontal,
                                height: j.height - l.vertical - g.vertical
                            },
                            h = {
                                minX: k.x,
                                minY: k.y,
                                maxX: k.width + k.x,
                                maxY: k.height + k.y
                            };
                        var m = {
                            x: this.window.get_left(),
                            y: this.window.get_top()
                        };
                        m.y = Math.max(h.minY, Math.min(h.maxY, m.y));
                        f._position.y = m.y;
                        this.moveTo(m.x, m.y);
                        i.set_constraints(h);
                    }
                    this.window.raiseEvent("dragStart", new Sys.EventArgs());
                }));
                this.draggable.add_dragging(Function.createDelegate(this, function(g, f) {
                    this.ui.showContentOverlay();
                    $telerik.cancelRawEvent(f.get_domEvent());
                    f.set_cancel(this.window.isPinned() || this.window.isMaximized() || (this.window.isMinimized() && this.window.get_minimizeZoneID()));
                }));
                this.draggable.add_dragEnd(Function.createDelegate(this, function(g, f) {
                    this.ui.hideContentOverlay();
                    var h = f.get_newPosition();
                    this.moveTo(h.x, h.y);
                    this.window._storeBounds();
                    this._repaintResizable();
                    this.window.raiseEvent("dragEnd", new Sys.EventArgs());
                }));
            }
            if (d.resize && !this.resizable) {
                this.resizable = new Telerik.Web.UI.Widgets.Resizable(this.ui.container, {
                    appendHandleToElement: !$telerik.isIE,
                    constraints: {
                        minWidth: this.ui.get_uiMinWidth(),
                        minHeight: this.ui.get_uiMinHeight()
                    },
                    handleSize: 12,
                    shouldPreventDefault: false
                });
                this.resizable.add_resizeStart(a.proxy(this._resizeStartHandler, this));
                this.resizable.add_resizing(a.proxy(this._resizingHandler, this));
                this.resizable.add_resizeEnd(a.proxy(this._resizeEndHandler, this));
                if (this.ui.bottomResizer) {
                    var e = new Telerik.Web.UI.Widgets.Handle(this.ui.bottomResizer, "SE", {
                        cursorType: "se-resize"
                    });
                    e.add_dragStart(a.proxy(this.resizable._handleDragStart, this.resizable));
                    e.add_dragging(a.proxy(this.resizable._handleDragging, this.resizable));
                    e.add_dragEnd(a.proxy(this.resizable._handleDragEnd, this.resizable));
                }
            }
        },
        _resizeStartHandler: function(f, d) {
            this.ui.showContentOverlay();
            $telerik.cancelRawEvent(d.get_domEvent());
            this.window.setActive(true);
            if (this.window.isMinimized() || this.window.isMaximized()) {
                d.set_cancel(true);
            }
            f.set_constraints({
                minWidth: this.ui.get_uiMinWidth(),
                minHeight: this.ui.get_uiMinHeight()
            });
            this.restrictBounds = this.window._getRestrictionZoneBounds();
            this.resizeHelper = {
                width: this.window.get_width(),
                height: this.window.get_height() || this.ui.container.clientHeight,
                offset: {
                    top: parseInt(this.window.get_top()),
                    left: parseInt(this.window.get_left())
                },
                borders: $telerik.getBorderBox(this.ui.container)
            };
            var e = new Sys.CancelEventArgs();
            this.window.raiseEvent("resizeStart", e);
            d.set_cancel(e.get_cancel());
        },
        touchCount: 0,
        _resizingHandler: function(j, d) {
            $telerik.cancelRawEvent(d.get_domEvent());
            var g = this.restrictBounds,
                f = this._getResizeBounds(d),
                e = this.resizeHelper.borders,
                h = {
                    x: f.x - e.left,
                    y: f.y - e.top,
                    width: f.width + e.horizontal,
                    height: f.height + e.vertical
                };
            var i = this.window._checkRestrictionZoneBounds(g, h);
            f.width = Math.max(j.options.constraints.minWidth, f.width);
            f.height = Math.max(j.options.constraints.minHeight, f.height);
            d.set_cancel(true);
            if (i && this.touchCount++ > 0) {
                var k = this.ui.container.style;
                k.left = f.x + "px";
                k.top = f.y + "px";
                this._setWidth(f.width);
                this._setHeight(f.height);
                this._currentResizeBounds = f;
            }
        },
        _getResizeBounds: function(d) {
            var f = d.get_direction();
            var h = function(k) {
                return f.indexOf(k) > -1;
            };
            var e = d.get_delta();
            var i = this.resizeHelper;
            var g = h("N") ? -1 : 1;
            var j = h("W") ? -1 : 1;
            return {
                x: i.offset.left + (h("W") ? e.x : 0),
                y: i.offset.top + (h("N") ? e.y : 0),
                width: i.width + j * e.x,
                height: i.height + g * e.y
            };
        },
        _getMoveBounds: function(d) {
            var e = d.get_newPosition();
            var f = this.resizeHelper;
            return {
                x: e.x,
                y: e.y,
                width: f.width,
                height: f.height
            };
        },
        _resizeEndHandler: function(f, d) {
            this.touchCount = 0;
            $telerik.cancelRawEvent(d.get_domEvent());
            this.ui.hideContentOverlay();
            var e = this._currentResizeBounds;
            if (e) {
                this.moveTo(parseInt(e.x), parseInt(e.y));
                this.window.set_width(parseInt(e.width));
                this.window.set_height(parseInt(e.height));
            }
            this.window._storeBounds();
            this.window.raiseEvent("resizeEnd", new Sys.EventArgs());
            this._currentResizeBounds = null;
        },
        _repaintResizable: function() {
            if (this.resizable) {
                this.resizable.repaint();
            }
        },
        _isDir: function(d, e) {
            return d.indexOf(e) > -1;
        },
        disableMoveResize: function(d) {
            if (d.move && this.draggable) {
                this.draggable.dispose();
                this.draggable = null;
            }
            if (d.resize && this.resizable) {
                this.resizable.dispose();
                this.resizable = null;
            }
        },
        setCommandButtons: function(d) {
            var e = [];
            this.ui.clearCommandButtons();
            for (var f = 0; f < d.length; f++) {
                e.push(this.ui.createCommandButton(d[f]));
            }
            this.ui.updateTitleWidth();
            return e;
        },
        toggleCommand: function(e) {
            var d = this.ui.getCommandButton(e);
            if (!d) {
                return;
            }
            Sys.UI.DomElement.toggleCssClass(d, "on");
        },
        minimizeToZone: function(e) {
            if (!e) {
                return;
            }
            if (typeof(e) == "string") {
                e = $get(e);
            }
            var d = this.ui.container;
            if (d.parentNode != e) {
                d.parentNode.removeChild(d);
                e.appendChild(d);
                this.window.setVisible(true);
                d.style.position = "static";
                if ($telerik.isIE) {
                    d.style.display = "inline";
                } else {
                    d.style.cssFloat = "left";
                }
            }
        },
        moveToDefaultParent: function() {
            var d = this.window._getDefaultParent();
            d.insertBefore(this.ui.container, d.firstChild);
        },
        revertToDefaultParent: function() {
            var d = this.window._getDefaultParent();
            d.insertBefore(this.ui.container, d.firstChild);
        },
        setActive: function(e) {
            var d = this.ui.container;
            if (e) {
                if (!this.window.isMaximized()) {
                    var g = parseInt(d.style.zIndex);
                    var f = this.ui.get_initialZIndexCss() || Telerik.Web.UI.RadWindowUtils.get_newZindex(g);
                    d.style.zIndex = "" + f;
                }
                Sys.UI.DomElement.removeCssClass(d, "rwInactiveWindow");
            } else {
                Sys.UI.DomElement.addCssClass(d, "rwInactiveWindow");
            }
            this._repaintResizable();
        },
        isActive: function() {
            var d = this.ui.container;
            return (d && !Sys.UI.DomElement.containsCssClass(d, "rwInactiveWindow"));
        },
        onUrlChanging: function() {
            if (!this.ui.contentFrame) {
                return;
            }
            if (this.window.get_showContentDuringLoad()) {
                var e = this.ui.statusbar;
                if (e) {
                    Sys.UI.DomElement.addCssClass(e, "rwLoading");
                }
            } else {
                var d = this.ui.contentFrame;
                var f = d.style;
                d.originalPosition = f.position;
                d.originalHeight = f.height;
                f.position = "absolute";
                f.top = "-10000px";
                if ($telerik.isIE9Mode) {
                    this.setHeight(this.window._height);
                }
                if (this.window._isWindowRightToLeft() && $telerik.isChrome) {
                    f.width = "1px";
                }
                Sys.UI.DomElement.addCssClass(this.ui.container, "rwLoading");
            }
        },
        onUrlChanged: function() {
            var i = this.ui.statusbar;
            if (this.window.get_showContentDuringLoad()) {
                if (i) {
                    Sys.UI.DomElement.removeCssClass(i, "rwLoading");
                }
            } else {
                var g = this.ui.contentFrame;
                g.style.position = "";
                g.style.height = g.originalHeight;
                g.originalHeight = null;
                if (this.window._isWindowRightToLeft() && $telerik.isChrome) {
                    g.style.width = "100%";
                }
                Sys.UI.DomElement.removeCssClass(this.ui.container, "rwLoading");
                if ($telerik.isIE9Mode) {
                    if (this.window.isMaximized()) {
                        this.window._maintainMaximizedSize();
                    } else {
                        if (!this.window.isMinimized()) {
                            this.setHeight(this.window.get_height());
                        }
                    }
                }
            }
            if (i) {
                this.window.set_status(this.window.get_navigateUrl());
            }
            try {
                var d = g.contentWindow.document;
                var h = d.title;
                if (h && h != this.window.get_title()) {
                    this.window.set_title(h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
                }
            } catch (f) {}
        },
        updatePopupZindex: function() {
            var d = this.ui.popupBehavior;
            if (d) {
                if (this.window.isVisible()) {
                    d.show();
                }
            }
        },
        dispose: function() {},
        _substractWrappersBorder: function(d, e) {
            var g = this.ui.container;
            if (!g) {
                return d;
            }
            var f = $telerik.getBorderBox(g);
            d -= e ? f.horizontal : f.vertical;
            return d;
        },
        _removeExplicitMSAjaxWidth: function() {
            if (!this.window.get_width()) {
                this.ui.container.style.width = "";
            }
        },
        _ariaHide: function() {
            if (this.window.get_enableAriaSupport() && this.ui.container && !this.window.isVisible()) {
                this.ui.container.setAttribute("aria-hidden", "true");
            }
        },
        _cancelDragSelection: function(d) {
            if (!$telerik.isTouchDevice) {
                $telerik.cancelRawEvent(d);
            }
        },
        _preventDefault: function(d) {
            if (d.preventDefault) {
                d.preventDefault();
            }
            d.returnValue = false;
        }
    };
    b.LightweightView.registerClass("Telerik.Web.UI.Window.LightweightView", b.ViewBase, b.IView);
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI.Window");
(function(a, b, c) {
    b.UIFactory = {
        getRenderer: function(d, f) {
            var e = Telerik.Web.UI.RenderMode;
            if (d == e.Classic) {
                return new b.ClassicRenderer(f);
            } else {
                if (d == e.Lite) {
                    return new b.LightweightRenderer(f);
                }
            }
        },
        getView: function(d, f) {
            var e = Telerik.Web.UI.RenderMode;
            if (d == e.Classic) {
                return new b.ClassicView(f);
            } else {
                if (d == e.Lite) {
                    return new b.LightweightView(f);
                }
            }
        }
    };
})($telerik.$, Telerik.Web.UI.Window);
Type.registerNamespace("Telerik.Web.UI");
Telerik.Web.UI.WindowShortCutManager = function(a) {
    this._shortcuts = [];
    this.addShortCuts(a);
};
Telerik.Web.UI.WindowShortCutManager.prototype = {
    addShortCuts: function(b) {
        if (typeof(b) == "string") {
            b = Sys.Serialization.JavaScriptSerializer.deserialize(b);
        }
        for (var a = 0; a < b.length; a++) {
            this.addShortCut(b[a][0], b[a][1]);
        }
    },
    addShortCut: function(b, c) {
        var a = new Telerik.Web.UI.WindowShortCut(b, c);
        a.HashValue = this._getShortCutHashValue(a);
        this._shortcuts[a.HashValue] = a;
    },
    removeShortCut: function(b) {
        var a = this.findShortCutByName(b);
        if (a) {
            this._shortcuts[a.HashValue] = null;
        }
    },
    setShortCut: function(a, b) {
        this.removeShortCut(a);
        this.addShortCut(a, b);
    },
    isShortCutHit: function(a) {
        return this._hitTest(a.keyCode, a.ctrlKey, (null != a.ctrlLeft ? a.ctrlLeft : a.ctrlKey), a.shiftKey, (null != a.shiftLeft ? a.shiftLeft : a.shiftKey), a.altKey, (null != a.altLeft ? a.altLeft : a.altKey));
    },
    _hitTest: function(d, b, f, h, g, a, e) {
        var c = this._getHashValue(d, b, f, h, g, a, e);
        return this._shortcuts[c];
    },
    _getHashValue: function(d, b, f, h, g, a, e) {
        var i = d & 65535;
        var c = 0;
        c |= (b ? (1 << 0) : 0);
        c |= (h ? (1 << 2) : 0);
        c |= (a ? (1 << 4) : 0);
        i |= (c << 16);
        return i;
    },
    _getShortCutHashValue: function(a) {
        return this._getHashValue(a.KeyCode, a.CtrlKey, a.LeftCtrlKey, a.ShiftKey, a.LeftShiftKey, a.AltKey, a.LeftAltKey);
    },
    findShortCutByName: function(c) {
        var a;
        for (var b in this._shortcuts) {
            a = this._shortcuts[b];
            if (null != a && a._name == c) {
                return a;
            }
        }
        return null;
    }
};
Telerik.Web.UI.WindowShortCut = function(a, b) {
    this._name = a;
    this._shortcutString = "";
    this.setShortCut(b);
};
Telerik.Web.UI.WindowShortCut.prototype = {
    CtrlKey: false,
    LeftCtrlKey: false,
    ShiftKey: false,
    LeftShiftKey: false,
    AltKey: false,
    LeftAltKey: false,
    KeyCode: 0,
    get_name: function() {
        return this._name;
    },
    set_name: function(a) {
        this._name = a;
    },
    get_shortCutString: function() {
        return this._shortcutString;
    },
    setShortCut: function(a) {
        this._parseShortcutString(a);
        this._shortcutString = a;
    },
    _parseShortcutString: function(b) {
        if ("string" == typeof(b)) {
            this.CtrlKey = false;
            this.LeftCtrlKey = false;
            this.ShiftKey = false;
            this.LeftShiftKey = false;
            this.AltKey = false;
            this.LeftAltKey = false;
            this.KeyCode = 0;
            b = b.replace(/\s*/gi, "");
            b = b.replace(/\+\+/gi, "+PLUS");
            var d = b.split("+");
            var c = "";
            for (var a = 0; a < d.length; a++) {
                c = d[a].toUpperCase();
                switch (c) {
                    case "LCTRL":
                        this.LeftCtrlKey = true;
                    case "CTRL":
                        this.CtrlKey = true;
                        break;
                    case "LSHIFT":
                        this.LeftShiftKey = true;
                    case "SHIFT":
                        this.ShiftKey = true;
                        break;
                    case "LALT":
                        this.LeftAltKey = true;
                    case "ALT":
                        this.AltKey = true;
                        break;
                    case "F1":
                        this.KeyCode = 112;
                        break;
                    case "F2":
                        this.KeyCode = 113;
                        break;
                    case "F3":
                        this.KeyCode = 114;
                        break;
                    case "F4":
                        this.KeyCode = 115;
                        break;
                    case "F5":
                        this.KeyCode = 116;
                        break;
                    case "F6":
                        this.KeyCode = 117;
                        break;
                    case "F7":
                        this.KeyCode = 118;
                        break;
                    case "F8":
                        this.KeyCode = 119;
                        break;
                    case "F9":
                        this.KeyCode = 120;
                        break;
                    case "F10":
                        this.KeyCode = 121;
                        break;
                    case "F11":
                        this.KeyCode = 122;
                        break;
                    case "F12":
                        this.KeyCode = 123;
                        break;
                    case "ENTER":
                        this.KeyCode = 13;
                        break;
                    case "HOME":
                        this.KeyCode = 36;
                        break;
                    case "END":
                        this.KeyCode = 35;
                        break;
                    case "LEFT":
                        this.KeyCode = 37;
                        break;
                    case "RIGHT":
                        this.KeyCode = 39;
                        break;
                    case "UP":
                        this.KeyCode = 38;
                        break;
                    case "DOWN":
                        this.KeyCode = 40;
                        break;
                    case "PAGEUP":
                        this.KeyCode = 33;
                        break;
                    case "PAGEDOWN":
                        this.KeyCode = 34;
                        break;
                    case "SPACE":
                        this.KeyCode = 32;
                        break;
                    case "TAB":
                        this.KeyCode = 9;
                        break;
                    case "BACK":
                        this.KeyCode = 8;
                        break;
                    case "CONTEXT":
                        this.KeyCode = 93;
                        break;
                    case "ESCAPE":
                    case "ESC":
                        this.KeyCode = 27;
                        break;
                    case "DELETE":
                    case "DEL":
                        this.KeyCode = 46;
                        break;
                    case "INSERT":
                    case "INS":
                        this.KeyCode = 45;
                        break;
                    case "PLUS":
                        this.KeyCode = "+".charCodeAt(0);
                        break;
                    default:
                        this.KeyCode = c.charCodeAt(0);
                        break;
                }
            }
        } else {
            throw {
                description: "Invalid shortcut string"
            };
        }
    }
};
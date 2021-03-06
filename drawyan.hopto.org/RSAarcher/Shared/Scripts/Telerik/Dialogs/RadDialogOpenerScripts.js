Type.registerNamespace("Telerik.Web.UI");
(function() {
    var a = $telerik.$;
    var b = Telerik.Web.UI;
    b.DialogDefinition = function() {
        this.Width = "600px";
        this.Height = "400px";
        this.Title = "";
        this.Behaviors = 36;
        this.Modal = true;
        this.VisibleStatusbar = false;
        this.VisibleTitlebar = true;
        this.ClientCallbackFunction = "";
    };
    b.DialogDefinition.registerClass("Telerik.Web.UI.DialogDefinition", null);
    b.DialogDefinitionsDictionary = function(f) {
        for (var e in f) {
            var g = f[e];
            var c = new b.DialogDefinition();
            for (var d in g) {
                c[d] = g[d];
            }
            this[e] = c;
        }
    };
    b.DialogDefinitionsDictionary.registerClass("Telerik.Web.UI.DialogDefinitionsDictionary", null);
    b.DialogOpenEventArgs = function(d, c) {
        b.DialogOpenEventArgs.initializeBase(this);
        this._dialogName = d;
        if (c) {
            this._parameters = c;
        } else {
            this._parameters = {};
        }
    };
    b.DialogOpenEventArgs.prototype = {
        get_dialogName: function() {
            return this._dialogName;
        },
        set_parameters: function(c) {
            this._parameters = c;
        },
        get_parameters: function() {
            return this._parameters;
        }
    };
    b.DialogOpenEventArgs.registerClass("Telerik.Web.UI.DialogOpenEventArgs", Sys.EventArgs);
    b.RadDialogOpener = function(c) {
        b.RadDialogOpener.initializeBase(this, [c]);
        this._dialogDefinitions = {};
        this._handlerChecked = false;
        this._dialogParametersProviderTypeName = "";
        this._dialogUniqueID = "";
        this._dialogContainers = {};
    };
    b.RadDialogOpener.prototype = {
        initialize: function() {
            b.RadDialogOpener.callBaseMethod(this, "initialize");
            this._dialogDefinitions = new b.DialogDefinitionsDictionary(this.get_dialogDefinitions());
        },
        get_dialogDefinitions: function() {
            return this._dialogDefinitions;
        },
        openUrl: function(o, c, p, i, f, e, n, j, d, l, m, h) {
            h = "EXTERNAL_URL" + (h || "default");
            var g = this._getDialogContainer(h);
            g.set_width(p + "px");
            g.set_height(i + "px");
            g.set_behaviors(d || b.WindowBehaviors.Default);
            g.set_modal(j == true);
            g.set_visibleStatusbar(l == true);
            g.set_visibleTitlebar(m == true);
            g.set_title(n ? n : "");
            g.set_keepInScreenBounds(true);
            var k = new b.DialogOpenEventArgs(o, c);
            this.raiseEvent("open", k);
            g.ClientParameters = c;
            g.set_clientCallBackFunction(f);
            g.setUrl(o);
            g.show();
            g.center();
            window.setTimeout(function() {
                g.setActive(true);
            }, 100);
        },
        open: function(g, d, c) {
            if (!this._handlerChecked) {
                this._checkDialogHandler(this.get_handlerUrl());
            }
            var f = this._getDialogDefinition(g);
            var j = new b.DialogOpenEventArgs(g, d);
            this.raiseEvent("open", j);
            var d = j.get_parameters();
            if (!c) {
                c = f.ClientCallbackFunction;
            }
            var e;
            if (this.get_useClassicDialogs()) {
                e = $create(b.ClassicDialog, {
                    dialogOpener: this
                });
                e.ClientParameters = d;
                this._applyParameters(g, e);
                if (c) {
                    e.set_clientCallBackFunction(c);
                }
                window.__getCurrentRadEditorRadWindowReference = function() {
                    return e;
                };
                var h = "width=" + parseInt(f.Width) + ",height=" + parseInt(f.Height);
                h += ",resizable=0,scrollbars=0,status=0,toolbar=0,menubar=0,directories=0";
                var k = e.open(h, g);
                k.radWindow = e;
                return k;
            } else {
                e = this._getDialogContainer(g);
                var i = f.Height;
                e.set_height(i);
                e.set_width(f.Width);
                e.set_behaviors(f.Behaviors);
                e.set_modal(f.Modal);
                e.set_visibleStatusbar(f.VisibleStatusbar);
                e.set_visibleTitlebar(f.VisibleTitlebar);
                e.set_keepInScreenBounds(true);
                if (f.ReloadOnShow != null) {
                    e.set_reloadOnShow(f.ReloadOnShow);
                }
                e.ClientParameters = d;
                this._applyParameters(g, e);
                if (c) {
                    e.set_clientCallBackFunction(c);
                }
                e.show();
                e.set_height(i);
                e.center();
                window.setTimeout(function() {
                    e.setActive(true);
                }, 100);
            }
        },
        openLight: function(f, d, c) {
            var g = 195;
            var j = 350;
            if (d) {
                if (d.height) {
                    g = d.height;
                }
                if (d.width) {
                    j = d.width;
                }
            }
            var h = new b.DialogOpenEventArgs(f, d);
            this.raiseEvent("open", h);
            var d = h.get_parameters();
            var e = this._getDialogContainer(f);
            e.set_height(g);
            e.set_width(j);
            e.set_behaviors(Telerik.Web.UI.WindowBehaviors.Move + Telerik.Web.UI.WindowBehaviors.Close);
            e.set_modal(true);
            e.set_visibleStatusbar(false);
            e.set_visibleTitlebar(true);
            if (c) {
                e.set_clientCallBackFunction(c);
            }
            e.ClientParameters = d;
            Telerik.Web.UI.LightDialogsControllerClass.initializeLightDialog(e);
            e.show();
            e.set_height(g);
            e.center();
            if (d.stripPopupHeight === true) {
                var i = e.get_popupElement();
                if (i) {
                    i.style.height = "";
                }
            }
            window.setTimeout(function() {
                e.setActive(true);
            }, 100);
        },
        _applyParameters: function(g, d) {
            var i = this._getDialogParameters(g);
            if (!i) {
                return;
            }
            var l = "&dp=" + encodeURIComponent(i);
            var c = this._getBaseDialogUrl(g);
            var m = c.length + l.length;
            var j = this._dialogParametersProviderTypeName == "";
            var k = j && m <= this.get_dialogUrlLengthLimit();
            if (k) {
                var f = d.get_navigateUrl();
                var n = c + l;
                if (f != n) {
                    d.setUrl(n);
                } else {
                    var e = d.get_contentFrame();
                    if (e && e.contentWindow && e.contentWindow.$find) {
                        var h = e.contentWindow.initDialog;
                        if (h) {
                            e.contentWindow.setTimeout(function() {
                                h();
                            }, 1);
                        }
                    }
                }
            } else {
                d.setUrl(c);
                d.DialogParameters = i;
            }
        },
        _closeContainerDelegate: function(c) {
            this.raiseEvent("close", c);
        },
        _getDialogContainer: function(c) {
            if (typeof(this._dialogContainers[c]) == "undefined") {
                var d = $find(this.get_id() + c);
                if (null != d) {
                    d.dispose();
                }
                this._dialogContainers[c] = this.get_container().clone(this.get_id() + c);
                var e = this;
                this._dialogContainers[c].get_dialogOpener = function() {
                    return e;
                };
                this._dialogContainers[c].add_close(Function.createDelegate(this, this._closeContainerDelegate));
            }
            return this._dialogContainers[c];
        },
        _getBaseDialogUrl: function(c) {
            var d = this.get_handlerUrl().indexOf("?") < 0 ? "?" : "&";
            var e = this.get_handlerUrl() + d + "DialogName=" + c;
            if (this.get_enableTelerikManagers()) {
                e += "&UseRSM=true";
            }
            e += "&Skin=" + this.get_skin() + "&Title=" + encodeURIComponent(this._getDialogDefinition(c)["Title"]) + "&doid=" + this._dialogUniqueID + "&dpptn=" + encodeURIComponent(this._dialogParametersProviderTypeName) + this.get_additionalQueryString();
            return e;
        },
        _getDialogDefinition: function(d) {
            var c = this.get_dialogDefinitions()[d];
            if (c) {
                return c;
            } else {
                throw Error.argumentNull("dialogName", String.format("Dialog Parameters for the {0} dialog do not exist", d));
            }
        },
        _getDialogParameters: function(c) {
            return this._getDialogDefinition(c)["SerializedParameters"];
        },
        _checkDialogHandler: function(f) {
            var e = f.indexOf("?") < 0 ? "?" : "&";
            var d = f + e + "checkHandler=true";
            var g = new Sys.Net.WebRequest();
            g.set_url(d);
            g.add_completed(Function.createDelegate(this, this._checkRequestCompleted));
            var c = new Sys.Net.XMLHttpExecutor();
            g.set_executor(c);
            c.executeRequest();
        },
        _checkRequestCompleted: function(d, c) {
            if (d.get_responseAvailable()) {
                var e = d.get_responseData();
                if (e && e.indexOf("HandlerCheckOK") > 0) {
                    this._handlerChecked = true;
                    return;
                }
            }
            window.alert("Web.config registration missing!\n The Telerik dialogs require a HttpHandler registration in the web.config file. Please, use the control's Smart Tag to add the handler automatically, or see the help for more information: Controls > RadEditor > Dialogs > Introduction");
        }
    };
    a.registerControlProperties(b.RadDialogOpener, {
        additionalQueryString: "",
        enableTelerikManagers: false,
        handlerUrl: "",
        container: null,
        dialogUrlLengthLimit: 2000,
        useClassicDialogs: false,
        skin: ""
    });
    a.registerControlEvents(b.RadDialogOpener, ["open", "close"]);
    b.RadDialogOpener.registerClass("Telerik.Web.UI.RadDialogOpener", b.RadWebControl);
    b.ClassicDialog = function(d, c) {
        b.ClassicDialog.initializeBase(this);
        this.BrowserWindow = window;
        this._dialogOpener = null;
        this._clientCallBackFunction = null;
        this._window = null;
        this._url = "";
        this._events = {
            close: [],
            beforeClose: [],
            show: []
        };
    };
    b.ClassicDialog.prototype = {
        close: function(c) {
            this.raiseEvent("beforeClose");
            this.raiseEvent("close");
            if (null != c && !(c instanceof Sys.UI.DomEvent)) {
                var d = this.get_clientCallBackFunction();
                if (typeof(d) == "string") {
                    d = eval(d);
                }
                if (d) {
                    d(this, c);
                }
            }
            var e = this.get_contentFrame();
            e.setTimeout(function() {
                e.close();
                e.parent.focus();
            }, 100);
        },
        open: function(d, c) {
            this._window = window.open(this.get_navigateUrl(), c, d);
            this._window.focus();
            if (!this._window.contentWindow) {
                this._window.contentWindow = this._window;
            }
            this.raiseEvent("show");
            return this._window;
        },
        get_dialogOpener: function() {
            return this._dialogOpener;
        },
        set_dialogOpener: function(c) {
            this._dialogOpener = c;
        },
        get_clientCallBackFunction: function() {
            return this._clientCallBackFunction;
        },
        set_clientCallBackFunction: function(c) {
            this._clientCallBackFunction = c;
        },
        setUrl: function(c) {
            this._url = c;
        },
        get_navigateUrl: function() {
            return this._url;
        },
        get_contentFrame: function() {
            return this._window;
        },
        set_title: function(c) {
            if (this._window && this._window.document) {
                this._window.document.title = c;
            }
        },
        dispose: function() {
            this._window = null;
            this._clientCallBackFunction = null;
            this._dialogOpener = null;
            this._events = null;
            b.ClassicDialog.callBaseMethod(this, "dispose");
        },
        add_close: function(c) {
            Array.add(this._events.close, c);
        },
        remove_close: function(c) {
            Array.remove(this._events.close, c);
        },
        add_show: function(c) {
            Array.add(this._events.show, c);
        },
        remove_show: function(c) {
            Array.remove(this._events.show, c);
        },
        add_beforeClose: function(c) {
            Array.add(this._events.beforeClose, c);
        },
        remove_beforeClose: function(c) {
            Array.remove(this._events.beforeClose, c);
        },
        raiseEvent: function(d, c) {
            var e = this._events[d];
            this._raiseEvent(e, c);
        },
        _raiseEvent: function(d, c) {
            if (!d || (d.length === 0)) {
                return;
            }
            d = Array.clone(d);
            if (!d._handler) {
                d._handler = function(j, f) {
                    for (var g = 0, h = d.length; g < h; g++) {
                        d[g](j, f);
                    }
                };
            }
            var e = d._handler;
            if (e) {
                if (!c) {
                    c = Sys.EventArgs.Empty;
                }
                e(this, c);
            }
        }
    };
    b.ClassicDialog.registerClass("Telerik.Web.UI.ClassicDialog", Sys.Component);
})();
Type.registerNamespace("Telerik.Web.UI");
if (typeof(Telerik.Web.UI.EditorCommandEventArgs) == "undefined") {
    Telerik.Web.UI.EditorCommandEventArgs = function(a, b, c) {
        Telerik.Web.UI.EditorCommandEventArgs.initializeBase(this);
        this._name = this._commandName = a;
        this._tool = b;
        this._value = c;
        this.value = c;
        this._callbackFunction = null;
    };
    Telerik.Web.UI.EditorCommandEventArgs.prototype = {
        get_name: function() {
            return this._name;
        },
        get_commandName: function() {
            return this._commandName;
        },
        get_tool: function() {
            return this._tool;
        },
        get_value: function() {
            return this._value;
        },
        set_value: function(a) {
            this.value = a;
            this._value = a;
        },
        set_callbackFunction: function(a) {
            this._callbackFunction = a;
        }
    };
    Telerik.Web.UI.EditorCommandEventArgs.registerClass("Telerik.Web.UI.EditorCommandEventArgs", Sys.CancelEventArgs);
}
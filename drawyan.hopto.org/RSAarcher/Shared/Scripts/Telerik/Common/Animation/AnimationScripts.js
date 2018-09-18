Type.registerNamespace("Telerik.Web.UI.Animations");
(function() {
    var a = $telerik.$;
    var b = Telerik.Web.UI;
    b.Animations.playJQueryAnimation = function(d, f, o, i, n, l, k, e, m) {
        if (!d) {
            return;
        }
        if (!f) {
            f = 2;
        }
        if (!o) {
            o = new Sys.UI.Bounds(1, 1, 1, 1);
        }
        if (!i) {
            i = new Sys.UI.Bounds(1, 1, 1, 1);
        }
        var c = e ? e : 500;
        if (!n) {
            n = 32;
        }
        n += "";
        var q = parseInt(n.substr(0, 1));
        var j = parseInt(n.substr(1, 1));
        if (l) {
            l();
        }
        a(d).stop(false, true);
        if (f == 2) {
            a(d).css({
                left: i.x,
                top: i.y
            }).fadeIn(c, k);
            return;
        }
        if (f == 8) {
            var g = $telerik.getClientBounds();
            var h = $telerik.getClientBounds();
            o.x = h.width / 2;
            o.y = h.height;
            switch (j) {
                case 2:
                    o.x = i.x;
                    break;
                case 3:
                    o.x = g.width;
                    break;
                case 1:
                    o.x = g.x;
            }
            switch (q) {
                case 2:
                    o.y = i.y;
                    break;
                case 1:
                    o.y = g.y - i.height;
                    break;
                case 3:
                    o.y = g.height;
            }
        } else {
            if (f == 4) {
                o.x = i.x;
                o.y = i.y;
                o.width = i.width;
                o.height = 1;
                switch (j) {
                    case 2:
                        o.x = i.x;
                        break;
                    case 3:
                        o.x = i.x;
                        break;
                    case 1:
                        var p = i.x;
                        if (2 == q) {
                            p += i.width;
                        }
                        o.x = p;
                }
                switch (q) {
                    case 2:
                        o.y = i.y;
                        o.height = i.height;
                        o.width = 1;
                        break;
                    case 1:
                        o.y = i.y + i.height;
                        break;
                    case 3:
                        o.y = i.y;
                }
            } else {
                if (f == 1) {}
            }
        }
        a(d).css({
            width: o.width,
            height: o.height,
            left: o.x,
            top: o.y,
            opacity: 0.1,
            filter: "alpha(opacity=10)"
        }).show().animate({
            width: i.width,
            height: i.height,
            left: i.x,
            top: i.y,
            opacity: m ? m : 1
        }, c, null, k);
    };
    a.fx.prototype.oldstep = a.fx.prototype.step;
    a.fx.prototype.step = function(d) {
        var e = this.prop;
        if (e == "left" || e == "top" || e == "telerikCarouselAngle" || e == "telerikCoverFlowIndex") {
            if (this.elem.getAttribute("paused")) {
                if (!this.elem.getAttribute("elapsedTime")) {
                    var c = (+new Date) - this.startTime;
                    this.elem.setAttribute("elapsedTime", c);
                }
                return true;
            }
            if (this.elem.getAttribute("elapsedTime")) {
                this.startTime = (+new Date) - this.elem.getAttribute("elapsedTime");
                this.elem.removeAttribute("elapsedTime");
            }
        }
        return this.oldstep(d);
    };
    b.Animations.jMoveBase = function(f, e, c, d) {
        b.Animations.jMoveBase.initializeBase(this);
        this._owner = f;
        this._element = e;
        this._duration = c;
        this._events = null;
        this._animationEndedDelegate = null;
        this._isPlaying = false;
        this._isPaused = false;
        this._isCyclic = false;
        this._easing = d;
        this._isDisposed = false;
    };
    b.Animations.jMoveBase.prototype = {
        initialize: function() {
            b.Animations.jMoveBase.callBaseMethod(this, "initialize");
            this._animationEndedDelegate = Function.createDelegate(this, this._animationEnded);
        },
        dispose: function() {
            if (this._isDisposed) {
                return;
            }
            this._getAnimationQuery().stop(true, false);
            this._owner = null;
            this._element = null;
            this._animationEndedDelegate = null;
            b.Animations.jMoveBase.callBaseMethod(this, "dispose");
            this._isDisposed = true;
        },
        get_isPlaying: function() {
            return this._isPlaying;
        },
        get_isCyclic: function() {
            return this._isCyclic;
        },
        set_isCyclic: function(c) {
            this._isCyclic = c;
        },
        get_easing: function() {
            return this._easing;
        },
        set_easing: function(c) {
            this._easing = c;
        },
        get_duration: function() {
            return this._duration;
        },
        set_duration: function(c) {
            this._duration = c;
        },
        get_isActive: function() {
            return true;
        },
        play: function(h) {
            var e = this._getAnimationQuery().filter("[paused='true']");
            var d = e.attr("paused");
            e.removeAttr("paused");
            if (d && e.attr("elapsedTime")) {
                this._isPlaying = true;
                this._isPaused = false;
            } else {
                var c = this._owner;
                var g = c.get_frameDuration();
                if (this._isPaused && this._isCyclic && (g > 0 && !h) && c._setAnimationTimeout) {
                    c._setAnimationTimeout(g);
                } else {
                    var f = this._animationStarted();
                    if (f != false) {
                        this._playAnimation();
                        this._isPlaying = true;
                        this._isPaused = false;
                    }
                }
            }
        },
        stop: function() {
            this._getAnimationQuery().stop(false, this._isPlaying);
            this._isPlaying = false;
        },
        pause: function() {
            if (this._isPlaying) {
                this._getAnimationQuery().filter(":animated").attr("paused", true);
            }
            this._isPlaying = false;
            this._isPaused = true;
        },
        add_started: function(c) {
            this.get_events().addHandler("started", c);
        },
        remove_started: function(c) {
            this.get_events().removeHandler("started", c);
        },
        add_ended: function(c) {
            this.get_events().addHandler("ended", c);
        },
        remove_ended: function(c) {
            this.get_events().removeHandler("ended", c);
        },
        _getAnimationQuery: function() {
            return a(this._element);
        },
        _playAnimation: function() {},
        _animationStarted: function() {
            var c = new Sys.CancelEventArgs();
            this._raiseEvent("started", c);
            return !c.get_cancel();
        },
        _animationEnded: function() {
            this._isPlaying = false;
            this._raiseEvent("ended", Sys.EventArgs.Empty);
        },
        _raiseEvent: function(d, c) {
            var e = this.get_events().getHandler(d);
            if (e) {
                if (!c) {
                    c = Sys.EventArgs.Empty;
                }
                e(this, c);
            }
        }
    };
    b.Animations.jMoveBase.registerClass("Telerik.Web.UI.Animations.jMoveBase", Sys.Component);
    b.Animations.jMove = function(g, e, c, f, h, d) {
        b.Animations.jMove.initializeBase(this, [g, e, c, d]);
        this._horizontal = (typeof(f) == "undefined" || f == null) ? 0 : f;
        this._vertical = (typeof(h) == "undefined" || h == null) ? 0 : h;
    };
    b.Animations.jMove.prototype = {
        initialize: function() {
            b.Animations.jMove.callBaseMethod(this, "initialize");
        },
        dispose: function() {
            b.Animations.jMove.callBaseMethod(this, "dispose");
        },
        get_vertical: function() {
            return this._vertical;
        },
        set_vertical: function(c) {
            this._vertical = c;
        },
        get_horizontal: function() {
            return this._horizontal;
        },
        set_horizontal: function(c) {
            this._horizontal = c;
        },
        _getFinalPosition: function() {
            return (isNaN(parseInt(this._vertical))) ? this._horizontal : this._vertical;
        },
        _getAnimatedProperty: function() {
            return (isNaN(parseInt(this._vertical))) ? "left" : "top";
        },
        _getPosition: function() {
            return this._element.style[this._getAnimatedProperty()];
        },
        _playAnimation: function() {
            var d = this._getFinalPosition();
            var f = this._getAnimationQuery();
            var c = this._getAnimatedProperty();
            var e = {
                queue: true
            };
            e[c] = d;
            f.stop(true, !this._isCyclic).animate(e, this._duration, this._easing, this._animationEndedDelegate);
        }
    };
    b.Animations.jMove.registerClass("Telerik.Web.UI.Animations.jMove", b.Animations.jMoveBase);
    b.Animations.jCarousel = function(i, f, g, d, h, c, e) {
        b.Animations.jCarousel.initializeBase(this, [i, f, d, e]);
        this._items = g;
        this._minScale = h.minScale;
        this._x = h.xO;
        this._y = h.yO;
        this._xRadius = h.xR;
        this._yRadius = h.yR;
        this._customProperties = c;
        this._angle = Math.PI / 2;
        this._query = null;
    };
    b.Animations.jCarousel.prototype = {
        initialize: function() {
            b.Animations.jCarousel.callBaseMethod(this, "initialize");
        },
        dispose: function() {
            b.Animations.jCarousel.callBaseMethod(this, "dispose");
            this._items = null;
            this._customProperties = null;
            this._query = null;
        },
        get_angle: function() {
            return this._angle;
        },
        set_angle: function(c) {
            this._angle = c;
        },
        _getFinalPosition: function() {
            return this._angle;
        },
        _getAnimatedProperty: function() {
            return "telerikCarouselAngle";
        },
        _getAnimationQuery: function() {
            var c = this._query;
            if (!c) {
                a.each(this._items, function(e, f) {
                    var d = this.element;
                    if (!c) {
                        c = a(d);
                    } else {
                        c = c.add(d);
                    }
                });
                this._query = c;
            }
            return c;
        },
        _playAnimation: function() {
            this._getAnimationQuery().stop(true, !this._isCyclic);
            var e = this._items;
            var f = (e.length > 0) ? ((Math.PI * 2) / e.length) : 0;
            var c = this._angle;
            var d = this;
            a.each(e, function(g, h) {
                if (c.toString().indexOf("e") > -1) {
                    c = (Math.round(c * 10000) / 10000);
                }
                a(this.element).stop(true, false).animate({
                    queue: true,
                    telerikCarouselAngle: c
                }, {
                    xO: d._x,
                    yO: d._y,
                    xR: d._xRadius,
                    yR: d._yRadius,
                    minScale: d._minScale,
                    reflection: this.reflection,
                    width: this.width,
                    height: this.height,
                    outerWidth: this.outerWidth,
                    outerHeight: this.outerHeight,
                    customProperties: d._customProperties,
                    duration: d._duration,
                    easing: d._easing,
                    complete: d._animationEndedDelegate
                });
                c += f;
            });
        }
    };
    b.Animations.jCarousel.registerClass("Telerik.Web.UI.Animations.jCarousel", b.Animations.jMoveBase);
    a.fx.step.telerikCarouselAngle = function(e) {
        var c = e.now;
        var g = e.options;
        var j = Math.sin(c);
        var f = g.minScale;
        var i = f + (j + 1) * ((1 - f) / 2);
        var n = g.xO + (((Math.cos(c + Math.PI) * g.xR) - g.outerWidth / 2) * i);
        var o = g.yO + ((j * g.yR) * i);
        e.elem.telerikCarouselAngle = e.now;
        var d = a.extend({}, g.customProperties);
        if (g.customProperties) {
            var m = /^([\d+-.]+)(.*)$/;
            a.each(d, function(p, r) {
                var q = m.exec(r);
                if (q) {
                    d[p] = q ? (q[1] * i + q[2]) : r;
                }
            });
        }
        var k = !a.support.opacity && (g.customProperties && g.customProperties.opacity) && g.reflection;
        var l = "px";
        var h = a.extend(d, {
            width: g.width * i + l,
            height: g.height * i * (k ? 2 : 1) + l,
            left: n + l,
            top: o + l,
            zIndex: parseInt(i * 100)
        });
        a(e.elem).css("display", "none").css(h).css("display", "");
    };
    b.Animations.jCoverFlow = function(i, f, g, d, h, c, e) {
        b.Animations.jCoverFlow.initializeBase(this, [i, f, d, e]);
        this._items = g;
        this._minScale = h.minScale;
        this._x = h.xO;
        this._y = h.yO;
        this._xRadius = h.xR;
        this._yRadius = h.yR;
        this._xItemSpacing = h.xItemSpacing;
        this._yItemSpacing = h.yItemSpacing;
        this._selectedItemOffsetX = h.selectedItemOffsetX;
        this._selectedItemOffsetY = h.selectedItemOffsetY;
        this._matrix = h.matrix;
        this._customProperties = c;
        this._index = 0;
        this._query = null;
    };
    b.Animations.jCoverFlow.prototype = {
        initialize: function() {
            b.Animations.jCoverFlow.callBaseMethod(this, "initialize");
        },
        dispose: function() {
            b.Animations.jCoverFlow.callBaseMethod(this, "dispose");
            this._items = null;
            this._customProperties = null;
            this._matrix = null;
            this._query = null;
        },
        get_index: function() {
            return this._index;
        },
        set_index: function(c) {
            this._index = c;
        },
        _getFinalPosition: function() {
            return this._index;
        },
        _getAnimatedProperty: function() {
            return "telerikCoverFlowIndex";
        },
        _getAnimationQuery: function() {
            if (!this._query) {
                var d = this._items;
                var f = a();
                for (var c = 0, e = d.length; c < e; c++) {
                    f.add(d[c].element);
                }
                this._query = f;
            }
            return this._query;
        },
        _getTransformProperty: function() {
            var c = "transform";
            if ($telerik.isIE9Mode) {
                c = "msTransform";
            } else {
                if ($telerik.isIE) {
                    c = "filter";
                } else {
                    if ($telerik.isFirefox) {
                        c = "MozTransform";
                    } else {
                        if ($telerik.isSafari) {
                            c = "WebkitTransform";
                        } else {
                            if ($telerik.isOpera) {
                                c = "OTransform";
                            }
                        }
                    }
                }
            }
            return c;
        },
        _playAnimation: function() {
            this._getAnimationQuery().stop(true, !this._isCyclic);
            var g = this._items;
            var h = g.length;
            var f = this._owner.isVertical();
            var e = this._index;
            var i = g[e];
            if (!i) {
                return;
            }
            var j = {
                top: this._y - i.outerHeight / 2,
                right: this._x + i.outerWidth / 2,
                bottom: this._y + i.outerHeight / 2,
                left: this._x - i.outerWidth / 2
            };
            var d = this._matrix;
            if (d.m11 == 1 && d.m22 == 1 && d.m12 == 0 && d.m21 == 0) {
                d = null;
            }
            var k = this._getTransformProperty();
            var c = this;
            var l = $telerik.getContentSize(this._owner._clipElement);
            a.each(g, function(B, I) {
                var n = (B - e);
                var z = (n == 0);
                var G = z ? 1 : c._minScale;
                var s = this.element;
                var o = parseInt(s.telerikCoverFlowIndex);
                var u = (o == 0);
                var p = u ? 1 : c._minScale;
                var v = (n > 0);
                var C = c._x + this.outerWidth / 2;
                var J = f ? (C - this.outerWidth * G) : (j[v ? "right" : "left"]);
                var q = f ? (C - this.outerWidth * p) : (j[o > 0 ? "right" : "left"]);
                var A = c._y + this.outerHeight / 2;
                var K = f ? (j[v ? "bottom" : "top"]) : (A - this.outerHeight * G);
                var r = f ? (j[o > 0 ? "bottom" : "top"]) : (A - this.outerHeight * p);
                var H = {};
                var m = (u || z);
                if (f || m) {
                    H.top = {
                        start: r,
                        end: K
                    };
                }
                if (!f || m) {
                    H.left = {
                        start: q,
                        end: J
                    };
                }
                for (var t = 0; t < 2; t++) {
                    var w = (t == 0);
                    var D = w ? n : o;
                    var E = w ? G : p;
                    if (D > 0) {
                        if (f) {
                            H.top[w ? "end" : "start"] += c._yRadius + (--D * c._yItemSpacing);
                        } else {
                            H.left[w ? "end" : "start"] += c._xRadius + (--D * c._xItemSpacing);
                        }
                    } else {
                        if (D < 0) {
                            if (f) {
                                H.top[w ? "end" : "start"] += -(c._yRadius + this.outerHeight * E) + (++D * c._yItemSpacing);
                            } else {
                                H.left[w ? "end" : "start"] += -(c._xRadius + this.outerWidth * E) + (++D * c._xItemSpacing);
                            }
                        } else {
                            H.left[w ? "end" : "start"] += c._selectedItemOffsetX;
                            H.top[w ? "end" : "start"] += c._selectedItemOffsetY;
                        }
                    }
                }
                if (m || ((!H.top || ((H.top.start >= -this.outerHeight * p && H.top.start <= l.height) || (H.top.end >= -this.outerHeight * G && H.top.end <= l.height))) && (!H.left || ((H.left.start >= -this.outerWidth * p && H.left.start <= l.width) || (H.left.end >= -this.outerWidth * G && H.left.end <= l.width))))) {
                    var F = {
                        zIndex: ((h - Math.abs(o)) * 100)
                    };
                    if (H.top) {
                        F.top = H.top.start + "px";
                    }
                    if (H.left) {
                        F.left = H.left.start + "px";
                    }
                    if (Math.abs(o - n) > 1) {
                        F.zIndex = ((h - Math.abs(n)) * 100);
                    }
                    a(s).stop(true, false).css(F).animate({
                        queue: true,
                        telerikCoverFlowIndex: n
                    }, {
                        isVertical: f,
                        animateSize: m,
                        steps: H,
                        minScale: c._minScale,
                        width: this.width,
                        height: this.height,
                        outerWidth: this.outerWidth,
                        outerHeight: this.outerHeight,
                        matrix: d,
                        transformProperty: k,
                        reflection: this.reflection,
                        itemsCount: h,
                        customProperties: c._customProperties,
                        duration: c._duration,
                        easing: c._easing,
                        complete: c._animationEndedDelegate
                    });
                } else {
                    a(s).stop(true, false).attr("telerikCoverFlowIndex", n);
                }
            });
        }
    };
    b.Animations.jCoverFlow.registerClass("Telerik.Web.UI.Animations.jCoverFlow", b.Animations.jMoveBase);
    a.fx.step.telerikCoverFlowIndex = function(f) {
        var d = f.now;
        var m = f.options;
        f.elem.telerikCoverFlowIndex = d;
        var o = Math.abs((d - f.start) / (f.end - f.start));
        var w = "px";
        var n = {};
        if (Math.abs(f.start - f.end) <= 1) {
            n.zIndex = parseInt((m.itemsCount - Math.abs(d)) * 100);
        }
        var s = 0;
        var u = 0;
        var h = m.isVertical;
        var l = m.minScale;
        var p = m.animateSize ? (f.end == 0 ? (l + (1 - l) * o) : (1 - (1 - l) * o)) : l;
        if (m.animateSize) {
            if (m.customProperties) {
                var e = a.extend({}, m.customProperties);
                var x = /^([\d+-.]+)(.*)$/;
                a.each(e, function(y, A) {
                    var z = x.exec(A);
                    e[y] = z ? (z[1] * p + z[2]) : A;
                });
                n = a.extend(e, n);
            }
            n = a.extend(n, {
                width: m.width * p + w,
                height: m.height * p + w
            });
        }
        if (m.matrix) {
            var i = a.extend({}, m.matrix);
            var k = m.animateSize ? (f.end == 0 ? (1 - o) : o) : 1;
            var j = (d == 0) ? 0 : (d < 0 ? -1 : 1);
            if (f.start * f.end < 0) {
                if ((f.start < 0 && d < 0) || (f.start > 0 && d > 0)) {
                    k = 1 - o * Math.abs((f.end - f.start) / f.start);
                } else {
                    k = o * Math.abs((f.end - f.start) / f.end) - Math.abs(f.start / f.end);
                }
            }
            i = {
                m11: 1 - (1 - i.m11) * k,
                m12: (i.m12 * k) * j,
                m21: (i.m21 * k) * j,
                m22: 1 - (1 - i.m22) * k
            };
            var g = ("filter" == m.transformProperty);
            var r = "matrix(" + i.m11 + ", " + i.m21 + ", " + i.m12 + ", " + i.m22 + ", 0, 0)";
            if (g) {
                r = "progid:DXImageTransform.Microsoft.Matrix(FilterType='bilinear',M11=" + i.m11 + ", M12=" + i.m12 + ", M21=" + i.m21 + ", M22=" + i.m22 + ",sizingMethod='auto expand')";
            }
            n[m.transformProperty] = r;
            var t = Math.abs(i.m11) + Math.abs(i.m12);
            var v = Math.abs(i.m21) + Math.abs(i.m22);
            if (!h) {
                s = j * ((1 - t) / 2);
            } else {
                u = j * ((1 - v) / 2);
            }
            if (g) {
                s += (t - 1) / 2;
                u += (v - 1) / 2;
                if (m.matrix.m12 && m.reflection) {
                    s *= 2;
                }
            }
        }
        var c = m.animateSize;
        var q = m.steps;
        if ((h || c) && q.top) {
            n.top = (q.top.start + (q.top.end - q.top.start) * o) - u * p * m.outerHeight + w;
        }
        if ((!h || c) && q.left) {
            n.left = (q.left.start + (q.left.end - q.left.start) * o) - s * p * m.outerWidth + w;
        }
        if ("filter" == m.transformProperty && m.matrix && m.reflection) {
            n.height = 2 * (n.height ? parseInt(n.height) : (l * m.height)) + w;
        }
        a(f.elem).css("display", "none").css(n).css("display", "");
    };
})();
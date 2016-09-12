/*
 * Author: bindy.Yuan(128080)
 * Version: 0.1.0
 * Compile Date: 2016-09-08 19:32
*/ 
/**
 * @author  Rhine.Liu
 * @mender  BindyYuan
 * @date    2016.05.30
 * @version 1.1.3
 * mender : 结合preloadJS做预加载；结合微信useragent给的网络信息判断抽帧
 */


function CanvasVideo(option) {
    this.init(option);
}
CanvasVideo.prototype = {
    lastFrame: 0,
    currFrame: 0,
    paused: true,
    startTime: 0,
    loaded : false,
    _fps: 24,
    _loop: false,
    _reverse: false,
    _ratio: 1,
    pixel:new Image(),
    lastTime : 0,
    init: function (option) {
        var self = this;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - self.lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            self.lastTime = currTime + timeToCall;
            return id;
        };
        if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

        this.canvas = option.canvas;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.context = this.canvas.getContext('2d');
        this.baseImg = option.baseImg;
        this.preloadProgress = option.preloadProgress || -1;

        //ratio结合wifi和系统
        var ua = window.navigator.userAgent.toLowerCase();
        var browser = checkMobile();
        if(browser.android){
            if(ua.indexOf('cosbox')){
                this._ratio = 2;
            }else{
                this._ratio = 1;
            }
        }else{
            // if(ua.indexOf('wifi'));
            this._ratio = 1;
        }

        /*for (var k in option) {
            if (typeof this[k] === 'function') {
                this[k](option[k]);
            }
        }*/
        this.totalFrame = Math.ceil(option.total / this._ratio);
        if (option.imageFn) {
            option.images = [];
            for (var i = 0; i < this.totalFrame; ++i) {
                option.images.push(option.imageFn(i * this._ratio));
            }
        }
        this._frames = [];
        this._imageLoader = new createjs.LoadQueue(false, this.baseImg);
        this._imageLoader.on('fileload', function (e) {
            if (self._destroyed) return;
            var ponit = e.result.src.lastIndexOf('/');
            var index = option.images.indexOf(e.result.src.substr(ponit + 1, e.result.src.length - ponit));
            option.images[index] = null;
            self._frames[index] = e.result;
        });
        this._imageLoader.on('complete',  function () {
            console.log('complete');
            self.loaded = true;
            self.trigger("completeLoad");
        });
        this._imageLoader.on('progress',function (e) {
            if(self.preloadProgress>0 && e.loaded >= self.preloadProgress){
                self.trigger('progress');
            }
        })
        this._imageLoader.loadManifest(option.images);
        this._events = {};
        if (this._usePixel) {
            this.pixel.src = this.baseImg + 'pix_3.png'
        }
    },
    resize : function () {
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    },
    play: function (frame) {
        if (this._destroyed) return this;
        this.paused = false;
        this._lastUpdateTime = new Date().getTime();
        this.trigger("play");
        this.__update(frame && Math.floor(frame / this._ratio));
        this.startTime = Date.now();
        return this;
    },
    pause: function () {
        this.paused = true;
        if (this._timeout) {
            cancelAnimationFrame(this._timeout);
            this._timeout = null;
        }
        if (this._useAudio) this._useAudio.pause();
        this.trigger("pause");
        return this;
    },
    stop: function () {
        return this.gotoAndStop(0);
    },
    replay: function () {
        return this.gotoAndPlay(0);
    },
    gotoAndPlay: function (frame) {
        return this.play(frame);
    },
    gotoAndStop: function (frame) {
        this.currFrame = Math.floor(frame / this._ratio);
        this.__render();
        return this.pause();
    },
    fps: function (num) {
        this._fps = Math.max(0.01, Math.min(60, num));
        return this;
    },
    loop: function (boolean) {
        this._loop = boolean;
        return this;
    },
    yoyo: function (boolean) {
        this._yoyo = boolean;
        return this;
    },
    reverse: function (boolean) {
        this._reverse = boolean;
        return this;
    },
    extract: function (ratio) {
        this._ratio = Math.max(1, ratio);
        return this;
    },
    poster: function (frame) {
        if (frame == undefined) frame = 0;
        var self = this;
        var img = new Image();
        img.onload = function () {
        	self.currFrame = frame;
        	self.__render();
        };
        img.src = this._frames[frame].src;
        return this;
    },
    // 特殊接口：使用栅格封面
    usePixel: function (val) {
        this._usePixel = val;
        return this;
    },
    // 特殊接口：使用音频同步
    useAudio: function (audio) {
        this._useAudio = audio;
        return this;
    },
    __update: function (frame) {
        var self = this;
        if (self.paused) return;

        if (frame != undefined) self.currFrame = frame;

        if (self._timeout) {
            cancelAnimationFrame(self._timeout);
        }

        self._timeout = requestAnimationFrame(function () {
            self.__update();
        });

        var interval = 1000 / self._fps * self._ratio;
        var now = new Date().getTime();
        if (now - self._lastUpdateTime > interval) {
            self._lastUpdateTime += interval;

            if (frame == undefined) self.__next();
            if (!self.paused) self.__render();
        }
    },
    __next: function () {
        if (!this._reverse) { // 正序播放
            // 特殊设置：图片未加载完时暂停
            if (this._frames && this.currFrame + 1 < this.totalFrame && !this._frames[this.currFrame + 1]) {
                if (this._useAudio) this._useAudio.pause();
                return;
            } else {
                if (this._useAudio && this._useAudio.paused) {
                    this._useAudio.currentTime = this.currFrame / this._fps;
                    this._useAudio.play();
                }
            }
            if ((this.currFrame += 1) > this.totalFrame - 1 && !this._loop) {
                this.trigger("end");
                this.pause();
            } else if (this.currFrame > this.totalFrame - 1 && this._loop) {
                this.trigger("loop");
                if (!this._yoyo) {
                    this.currFrame = 0;
                } else {
                    this._reverse = !this._reverse;
                    this.currFrame = this.totalFrame - 1;
                    this.trigger("yoyo");
                }
            }
        } else { // 倒序播放
            if ((this.currFrame -= 1) < 0 && !this._loop) {
                this.trigger("end");
                this.pause();
            } else if (this.currFrame < 0 && this._loop) {
                this.trigger("loop");
                if (!this._yoyo) {
                    this.currFrame = this.totalFrame - 1;
                } else {
                    this._reverse = !this._reverse;
                    this.currFrame = 0;
                    this.trigger("yoyo");
                }
            }
        }
    },
    __render: function () {
        var img = this._frames[this.currFrame];
        if (!img) return;
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.canvasWidth, this.canvasHeight);
        this.lastFrame = this.currFrame;
        this.trigger("render", this.currFrame * this._ratio);

        if (this._usePixel) {
            this.context.fillStyle = this.context.createPattern(this.pixel, "repeat");
            this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    },
    destroy: function () {
        this._destroyed = true;
        this.pause();
        this.off();
        this._imageLoader.stop();
        this._frames = null;
        this.trigger("destroy");
        if (this._useAudio) this._useAudio.pause();
    },

    on: function (events, handler) {
        events = events.split(" ");
        for (var i = 0; i < events.length; ++i) {
            if (!this._events[events[i]]) this._events[events[i]] = [];
            this._events[events[i]].unshift(handler);
        }
        return this;
    },


    one: function (events, handler) {
        var _handler = function () {
            handler();
            off.call(this, events, _handler);
        };
        return on.call(this, events, _handler);
    },

    off: function (events, handler) {
        if (events) {
            events = events.split(" ");
            var _events = this._events;
            for (var i = 0; i < events.length; ++i) {
                if (!_events[events[i]]) continue;
                if (!handler) {
                    _events[events[i]] = [];
                } else {
                    for (var j = _events[events[i]].length - 1; j >= 0; --j) {
                        if (_events[events[i]][j] == handler) _events[events[i]].splice(j, 1);
                    }
                }
            }
        } else {
            this._events = {};
        }
        return this;
    },

    trigger: function () {
        var events = Array.prototype.shift.call(arguments);
        events = events.split(" ");
        for (var i = 0; i < events.length; ++i) {
            if (this._events[events[i]]) {
                for (var j = this._events[events[i]].length - 1; j >= 0; --j) {
                    try {
                        this._events[events[i]][j].apply(this, arguments);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        return this;
    }
}



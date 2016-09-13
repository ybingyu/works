/*
 * Author: bindy.Yuan(128080)
 * Version: 0.1.0
 * Compile Date: 2016-09-12 21:57
*/
config = {
    // imgPath: ['http://wd.work.ybingyu.com:777/image/'],
    imgPath: 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/undercover/image/',
    // imgPath: ['httsp://img','.91huo.cn/news.cos/img/2016/08/wd/'],
    totalLvl: 4,// 关卡数
    lvl: [
        // 口红-手机-书本-眼镜
        // ['wrong','right']
        [
            {
                path: 'M1/',
                pre: 'M1_',
                total: 134
            },
            {
                path: 'kh/',
                pre: 'kh_',
                total: 151
            }
        ],
        [
            {
                path: 'M2/',
                pre: 'M2_',
                total: 88
            },
            {
                path: 'sj/',
                pre: 'sj_',
                total: 126
            }
        ],
        [
            {
                path: 'M3/',
                pre: 'M3_',
                total: 109
            },
            {
                path: 'sb/',
                pre: 'sb_',
                total: 101
            }
        ],
        [
            {
                path: 'M4/',
                pre: 'M4_',
                total: 132
            },
            {
                path: 'yj/',
                pre: 'yj_',
                total: 126
            }
        ]
    ],
    state: {right: 1, wrong: 0},
    outCls: 'rotate-room-left-out',
    inCls: 'rotate-room-left-in',
    curCls: 'cur',
    lvlSecound: 2500
};
var insideMan = (function () {
    var curLvl = 0,
        curSlide,
        $main,
        $slide,
        slideCount,
        isAnimating = false,
        endCurrPage = false,
        endNextPage = false,
        $curSlide, $nextPage,
        animEndEventName = '',
        $choseLi,
        canvasVideo,
        loadVideoIndex = [],
        canvas,
        curState = false,
        isWaitLoad,
        browser = checkMobile(),
        $wrongIcon,
        $rightIcon,
        endFocus = false,
        isPassAll = false;
    var init = function () {
        // alert(navigator.userAgent.toLowerCase())
            // 横竖屏检测
            $(function () {
                orientationChange();
            })
            // 安卓 用resize
            // if (browser.android) {
            orientationEvent = 'resize';
            /*}else{
             orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
             }*/
            window.addEventListener(orientationEvent, orientationChange, false);

            //8.15
            if (browser.android) {
                $('#main').addClass('android');
            }
            initSlide();
            initGame();

            $('#startBtn').on('touchend', function () {
                nextLvl();
            });

            //获得魂币按钮
            $('#getBtn').on('touchend', 'a', function () {
                if(!$(this).parent().hasClass("disable")) {
                    $('#coinLayer').addClass('show');
                }
            });
            // 提交uid按钮
            $('#submitBtn').on('touchend', function () {
                // 成功
                getCoinSuccess();
            });
            $('#uidInput').on('blur', function () {
                $('body').scrollTop(0).scrollLeft(0);
                if (!browser.android) {
                    $('#coinLayer').removeClass('rotate');
                }
                endFocus = false;
            }).on('focus', function () {
                endFocus = true;
                // 安卓微信默认旋转 故此安卓除外
                if (!browser.android) {
                    if (window.orientation && (window.orientation == 90 || window.orientation == -90)) {
                        return;
                    }
                    $('#coinLayer').addClass('rotate');
                }
            });
            initShare();
            initBgSound();
        },
        getCoinSuccess = function () {
            // 8.16
            $('#getCoinLayer').addClass('show').on(animEndEventName, 'p', function () {
                setTimeout(function () {
                    $('#coinLayer').removeClass('show');
                    $('#getCoinLayer').removeClass('show');
                    $('#getBtn').addClass('disable');
                },1000);
            });
            // setTimeout(function () {
            //     $('#coinLayer').removeClass('show');
            //     $('#getCoinLayer').removeClass('show');
            //     $('#getBtn').addClass('disable');
            // },4000);
        },
        initBgSound = function () {
            $(document).one('touchend', function () {
                var bgSound = document.getElementById('bgSound');
                if (bgSound.paused) {
                    bgSound.play();
                }
            })
        },
        initShare = function () {
            // 判断显示魂币按钮/分享按钮
            // if(!盒子){
            //     $('#getBtn').addClass('hide').next('.share-btn').removeClass('hide');
            // }
            $('#endSlide .share-btn').on('touchend', 'a', function () {
                // 分享
                // if(!盒子){
                $('#shareTip').addClass('show');
                // }
            });
            $('#main .cover-layer').on('touchend', function (e) {
                if (endFocus) {
                    return;
                }
                if($(this).hasClass('loading')){return;}


                var tagName = e.target.tagName.toLowerCase();
                if (tagName == 'a' || tagName == 'input') {
                    return;
                }
                this.classList.remove('show');
            })
            $('#shareTip').on('touchend', function () {
                $(this).removeClass('show');
            })
        },
        initSlide = function () {
            $main = $('#main');
            $slide = $main.find('.slide');
            slideCount = $slide.length;
            curSlide = 0;
            isAnimating = false;
            endCurrPage = false;
            endNextPage = false;
            animEndEventName = 'webkitAnimationEnd animationend';

            $slide.each(function () {
                this.dataset.cls = this.className;
            })
            $slide.eq(curSlide).addClass(config.curCls);
        },
        switchSlide = function (page) {
            if (isAnimating) {
                return false;
            }
            if (page < 0 || page >= slideCount) {
                return false;
            }
            isAnimating = true;

            $curSlide = $slide.eq(curSlide);
            $nextPage = $slide.eq(page != undefined ? page : (curSlide + 1));
            // 8.16 20:44
            if (browser.android && page != 6) {
                endCurrPage = true;
                endNextPage = true;
                onEndAnimation($curSlide, $nextPage);
            } else {
                $curSlide.addClass(config.outCls).on(animEndEventName, function () {

                    $curSlide.off(animEndEventName);
                    endCurrPage = true;
                    if (endNextPage) {
                        onEndAnimation($curSlide, $nextPage);
                    }
                });

                $nextPage.addClass(config.inCls).on(animEndEventName, function () {
                    $nextPage.off(animEndEventName);
                    endNextPage = true;
                    if (endCurrPage) {
                        onEndAnimation($curSlide, $nextPage);
                    }
                });
            }

            curSlide = page != undefined ? page : (curSlide + 1);
        },
        onEndAnimation = function ($outpage, $inpage) {
            endCurrPage = false;
            endNextPage = false;
            resetPage($outpage, $inpage);
            isAnimating = false;
        },
        resetPage = function ($outpage, $inpage) {
            $outpage[0].className = $outpage[0].dataset.cls;
            $inpage[0].className = $inpage[0].dataset.cls + ' ' + config.curCls;
        },
        initGame = function () {
            if (!$choseLi) {
                $choseLi = $('#choseList li');
                $wrongIcon = $('#wrongIcon').on(animEndEventName, function () {
                    this.classList.remove('show');
                });
                $rightIcon = $('#rightIcon').on(animEndEventName, function () {
                    this.classList.remove('show');
                });
                $('#nextBtn').on('touchend', nextLvl);
                $main.find('.slide-game').on('touchend', function (e) {
                    if (e.target.tagName.toLowerCase() === 'a') {
                        console.log('right');
                        playVideo(config.state.right);
                        curState = config.state.right;
                        return false;
                    }

                    playVideo(config.state.wrong);
                    curState = config.state.wrong;
                    console.log('wrong');
                }).on('touchstart', function (e) {
                    //8.16 17:30
                    if(self.isPassAll){
                        return;
                    }
                    if (e.target.tagName.toLowerCase() === 'a') {
                        if (e.targetTouches.length == 1) {
                            var touch = e.targetTouches[0];
                            $rightIcon[0].classList.add('show');
                            $rightIcon[0].style.left = touch.pageX + 'px';
                            $rightIcon[0].style.top = touch.pageY + 'px';
                        }
                        return;
                    }
                    if (e.targetTouches.length == 1) {
                        var touch = e.targetTouches[0];
                        $wrongIcon[0].classList.add('show');
                        $wrongIcon[0].style.left = touch.pageX + 'px';
                        $wrongIcon[0].style.top = touch.pageY + 'px';
                    }
                });
            }
            initVideo();
            curLvl = -1;
            curState = false;
            isWaitLoad = false;
            $('#choseList .chose').removeClass('chose');
        },
        nextLvl = function () {
            curLvl++;
            if (curLvl >= config.totalLvl) {
                return false;
            }
            $('#nextBtn').removeClass('show');
            $('#choseList .chose').removeClass('chose');
            $choseLi[curLvl].classList.add('chose');
            $($choseLi[curLvl]).find('.circular').on(animEndEventName,function () {
                setTimeout(function () {
                    switchSlide(curLvl + 2);
                    // 如果当前视频没有加载 出现等待加载层
                    // if(!canvasVideo[curLvl][canvasVideo[curLvl].length - 1] || !canvasVideo[curLvl][canvasVideo[curLvl].length - 1].loaded){
                    // 先加载错误的
                    if (!canvasVideo[curLvl][0] || !canvasVideo[curLvl][0].loaded) {
                        $('#lvlLoad').addClass('show');
                        isWaitLoad = true;
                    }
                },1000)
            });
            switchSlide(1);
           /* setTimeout(function () {
                switchSlide(curLvl + 2);
                // 如果当前视频没有加载 出现等待加载层
                // if(!canvasVideo[curLvl][canvasVideo[curLvl].length - 1] || !canvasVideo[curLvl][canvasVideo[curLvl].length - 1].loaded){
                // 先加载错误的
                if (!canvasVideo[curLvl][0] || !canvasVideo[curLvl][0].loaded) {
                    $('#lvlLoad').addClass('show');
                    isWaitLoad = true;
                }
            }, config.lvlSecound);*/
            canvas.classList.remove('show');
        },
        initVideo = function () {
            loadVideoIndex = [0, 0];
            if (!canvas) {
                canvas = document.getElementById('video');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initGameVideoItem();
            }

            canvas.classList.remove('show');
        },
        initGameVideoItem = function () {
            var _i = loadVideoIndex[0];
            var _j = loadVideoIndex[1];
            if (!canvasVideo) {
                canvasVideo = [];
            }
            if (!canvasVideo[_i]) {
                canvasVideo[_i] = new Array(config.lvl[_i].length);
            }

            /*canvasVideo[_i][_j] = new CanvasVideo({
                canvas: canvas,
                total: config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].total,
                fps: 12,
                baseImg: '',
                imageFn: function (frame) {
                    var name = '0000' + frame;
                    var baseImg = '';
                    var type = String(typeof config.imgPath);

                    if(type === 'object'){
                        baseImg = config.imgPath[0] + frame % 10 +config.imgPath[1];
                    }else if(type === 'string'){
                        baseImg = config.imgPath;
                    }
                        return baseImg + config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].path +config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].pre + name.substr(name.length - 5, 5) + '.jpg';
                    // return config.imgPath + config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].path + name.substr(name.length - 5, 5) + '.png';
                }
            });*/

            var baseImg = '';
            var type = String(typeof config.imgPath);

            if(type === 'object'){
                baseImg = config.imgPath[0] + (_i*2 +_j) +config.imgPath[1];
            }else if(type === 'string'){
                baseImg = config.imgPath;
            }

            canvasVideo[_i][_j] = new CanvasVideo({
                canvas: canvas,
                total: config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].total,
                fps: 12,
                baseImg: baseImg + config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].path,
                imageFn: function (frame) {
                    var name = '0000' + frame;
                    return config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].pre + name.substr(name.length - 5, 5) + '.jpg';
                    // return config.imgPath + config.lvl[loadVideoIndex[0]][loadVideoIndex[1]].path + name.substr(name.length - 5, 5) + '.png';
                }
            });
            canvasVideo[_i][_j].on('end', endVideo);
            canvasVideo[_i][_j].on('completeLoad', function () {
                // if(isWaitLoad && canvasVideo[curLvl][canvasVideo[curLvl].length - 1] && canvasVideo[curLvl][canvasVideo[curLvl].length - 1].loaded){
                if (isWaitLoad && canvasVideo[curLvl][0] && canvasVideo[curLvl][0].loaded) {
                    $('#lvlLoad').removeClass('show');
                    isWaitLoad = false;
                }
                canvasVideo[loadVideoIndex[0]][loadVideoIndex[1]].loaded = true;
                if (loadVideoIndex[1]++ >= config.lvl[0].length - 1) {
                    loadVideoIndex[1] = 0;
                    if (loadVideoIndex[0]++ >= config.lvl.length - 1) {
                        return false;
                    }
                }
                initGameVideoItem();
            });
        },
        playVideo = function (state) {
            //8.16 17:30
            if(self.isPassAll){
                return;
            }
            canvasVideo[curLvl][state].resize();
            canvasVideo[curLvl][state].gotoAndStop(0);
            canvas.classList.add('show');
            canvasVideo[curLvl][state].play();
        },
        endVideo = function () {
            console.log('video end');
            if (curState == config.state.right) {
                if (curLvl >= config.totalLvl - 1) {
                    // setTimeout(function () {
                        switchSlide(slideCount - 1);
                        canvas.classList.remove('show');
                    // }, 0);
                    //8.16 17:30
                    self.isPassAll = true;
                    return;
                }
                $('#nextBtn').addClass('show');
            } else {
                canvas.classList.remove('show');
            }
        },
        orientationChange = function () {
            var _bodyW = $('body').width();
            var _bodyH = $('body').height();
            var _mainW = $('#main').width();
            var _mainH = $('#main').height();
            if (_bodyW > _bodyH) {
                // 横屏
                $main.removeClass('rotate').css({
                    'width': _bodyW,
                    'height': _bodyH
                });
                canvas.width = _bodyW;
                canvas.height = _bodyH;
            } else {
                // 竖屏
                $main.css({
                    'width': _bodyH,
                    'height': _bodyW
                }).addClass('rotate');
                canvas.width = _bodyH;
                canvas.height = _bodyW;
            }
            $('#main').removeClass('hide');
            setTimeout(function () {
                $('#load').removeClass('show');
            }, 2500);
            // console.log(_bodyW,_bodyH);
            /*if (window.orientation == 0 || window.orientation == -180) {}*/
        };
    return {
        init: init
    }
})();
insideMan.init();



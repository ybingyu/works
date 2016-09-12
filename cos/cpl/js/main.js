/*
 * Author: bindy.Yuan(128080)
 * Version: 0.1.0
 * Compile Date: 2016-09-08 19:32
*/
CONFIG = {
    imgPath: 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/cpl/image/',
    coverBg: {path: 'cover/', pre: '1_', total: 125, preloadProgress: 0.5},
    giftBg: {path: 'result/', pre: '1_', total: 32},
    lotterPage: 2,
    gift: ['门票', '金刚石', '门票折扣券', '神之眼', '神行石', '复活石']
}

var cpl = (function () {
    var mainSwiper,
        isLbAni = false,//flag 1
        lbTimeID = null,//flag 1
        lbIndex = 0,
        lbCount = 0,
        $lbItem,
        $lbPage ,//flag 2
        isCoverLoaded = false,
        isLottery = false,//是否已经在抽奖
        restLotteryTime = 3,//可抽奖次数
        coverCanvas,
        resultCanvas;
    var init = function () {
            mainSwiper = new Swiper('#main', {
                initialSlide: 0,
                speed: 500,
                direction: 'vertical',
                // flag 1
                longSwipes : 0.1,
                nextButton: '.next-btn',
                onTransitionStart: function (swiper) {
                    // swiper.slides[swiper.activeIndex]
                    // console.log(swiper.activeIndex);
                    //flag 1
                    clearLbTimer();

                    switch (swiper.activeIndex) {
                        case 0:
                            if (isCoverLoaded) {
                                coverCanvas.play();
                            }
                            break;
                        case 1:
                            if (coverCanvas) {
                                coverCanvas.pause();
                            }
                            initLB();
                            break;
                        case 2:
                            lottery.random = -1;
                            if (resultCanvas) {
                                resultCanvas.pause();
                            }
                            updateRestLotteryTime();
                            break;
                        case 3:
                            //flag
                            if (resultCanvas&&resultCanvas.paused) {
                                resultCanvas.play();
                            }
                            break;
                    }

                    if (swiper.activeIndex >= CONFIG.lotterPage) {
                        $('#nextBtn').addClass('hide');
                        swiper.lockSwipeToNext();
                        // console.log('lock');
                    } else {
                        $('#nextBtn').removeClass('hide');
                        swiper.unlockSwipeToNext();
                        // console.log('unlock');
                    }
                },
                onTransitionEnd: function (swiper) {
                    // console.log(swiper.activeIndex);
                }
            })
            initLottery();
            initCoverCanvas();
            initPop();
            initAudio();

            if (!isCoverLoaded) {
                // 只预加载3s
                setTimeout(function () {
                    $('#load').removeClass('show');
                }, 3000);
            }
        },
        // flag 2
        initAudio = function () {
            $(document).on('tap',function () {
                var bg = document.getElementById('bg');
                if(bg.paused){
                    bg.play();
                }
                $(document).off('tap');
            });
        },
        initCoverCanvas = function () {
            if (!coverCanvas) {
                var c = document.getElementById('coverCanvas');
                c.width = window.innerWidth;
                c.height = window.innerHeight;
                coverCanvas = new CanvasVideo({
                    canvas: c,
                    total: CONFIG.coverBg.total,
                    baseImg: CONFIG.imgPath + CONFIG.coverBg.path,
                    preloadProgress: CONFIG.coverBg.preloadProgress,
                    imageFn: function (frame) {
                        var name = '0000' + frame;
                        return CONFIG.coverBg.pre + name.substr(name.length - 5, 5) + '.jpg';
                    }
                });
                coverCanvas.loop(true);
                coverCanvas.on('completeLoad', function () {
                    /*if(coverCanvas.paused){
                     coverCanvas.play();
                     isCoverLoaded = true;
                     }*/
                    //flag 1
                    $('#load').removeClass('show');

                    resultCanvas = new CanvasVideo({
                        canvas: document.getElementById('giftBg'),
                        total: CONFIG.giftBg.total,
                        baseImg: CONFIG.imgPath + CONFIG.giftBg.path,
                        imageFn: function (frame) {
                            var name = '0000' + (frame + 5);
                            return CONFIG.giftBg.pre + name.substr(name.length - 5, 5) + '.jpg';
                        }
                    })
                    resultCanvas.loop(true);
                });
                coverCanvas.on('progress', function () {
                    // $('#load').removeClass('show');
                    if (coverCanvas.paused) {
                        coverCanvas.play();
                        isCoverLoaded = true;
                    }
                })

            }
        },
        //flag 2
        initLB = function () {
            if (!$lbItem) {
                $lbItem = $('#lb .lb-item');
                lbCount = $lbItem.size();
                var pageHtml = '';
                for(var i = 0;i<lbCount;i++){
                    var cls = '';
                    if(i==0){
                        cls = 'on'
                    }
                    pageHtml += '<li class="' + cls+'"></li>';
                }
                $lbPage = $('#lb .page').html(pageHtml).find('li');

                $('#lb').on('swipeLeft',function () {
                    // if(isLbAni){return;}
                    lbTimer(lbIndex + 1);

                    // console.log('left');
                }).on('swipeRight',function () {
                    // if(isLbAni){return;}

                    // console.log('right');
                    lbTimer(lbIndex - 1);
                }).on('transitionend webkitTransitionEnd','.on',function () {
                    isLbAni = false;
                })
            }

            clearLbTimer();

            lbTimeID = setInterval(lbTimer, 3000);
        },
    //flag 2
        lbTimer = function (i) {
            if (!mainSwiper || isLbAni) {
                return;
            }
            var cur = lbIndex;
            if(i>=0){
                lbIndex = i;
                clearLbTimer();
            }else{
                lbIndex ++;
            }

            if (lbIndex > lbCount - 1) {
                lbIndex = 0;
            }
            $lbItem.eq(cur).removeClass('on');
            $lbItem.eq(lbIndex).addClass('on');
            $lbPage.eq(cur).removeClass('on');
            $lbPage.eq(lbIndex).addClass('on');
            isLbAni = true;
            if (mainSwiper.activeIndex == 1 && i >= 0) {
                clearLbTimer();
                lbTimeID = setInterval(lbTimer, 3000);
            }
        },
        clearLbTimer = function () {
            if(lbTimeID){
                clearInterval(lbTimeID);
                lbTimeID = null;
            }
        },
        roll = function () {
            lottery.times += 1;
            lottery.roll();
            if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {//结束
                clearTimeout(lottery.timer);
                lottery.prize = -1;
                lottery.times = 0;
                isLottery = false;
                lottery.callBack(lottery.prize);
            } else {
                if (lottery.times < lottery.cycle) {
                    lottery.speed -= 10;
                } else if (lottery.times == lottery.cycle) {
                    lottery.prize = lottery.random;
                } else {
                    if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                        lottery.speed += 110;
                    } else {
                        lottery.speed += 20;
                    }
                }
                if (lottery.speed < 40) {
                    lottery.speed = 40;
                }
                lottery.timer = setTimeout(roll, lottery.speed);
            }
            return false;
        },
        initLottery = function () {
            // 抽奖
            lottery.init('lottery', function (s) {
                // 抽奖特效回调 显示奖品内容
                if (lottery.random < 0) {
                    return;
                }
                setTimeout(function () {
                    var $curResult, $img;
                    if (lottery.random == 0) {
                        // 抽中门票
                        $curResult = $('#result').find('.result-ticket').removeClass('hide');
                        $('#result').find('.result-other').addClass('hide');
                    } else {
                        // 一般道具
                        $curResult = $('#result').find('.result-other').removeClass('hide');
                        $('#result').find('.result-ticket').addClass('hide');
                        // flag
                        // $curResult.find('.title').html('恭喜你抽中' + CONFIG.gift[lottery.random]);
                        $curResult.find('.title')[0].className = 'title gift-' + (lottery.random + 1);
                    }
                    $img = $curResult.find('.prize-pic');
                    $img.append($('#giftBg'));
                    $img.find('img').attr('src', CONFIG.imgPath + 'gift-' + (lottery.random + 1) + '.png');

                    mainSwiper.unlockSwipeToNext();
                    mainSwiper.slideNext();
                }, 1000)
            });
            $("#lottery .btn").on('tap', function () {
                if (mainSwiper.animating || mainSwiper.activeIndex != CONFIG.lotterPage || isLottery || restLotteryTime <= 0) {
                    return false;
                } else {
                    lottery.speed = 100;
                    // for 程序：
                    // 中奖随机数 顺时针 初始序号为0
                    // 在这里请求抽奖结果
                    // eg.
                    lottery.random = Math.floor(Math.random() * 6) | 0;
                    // lottery.random = 3;
                    console.log(lottery.random);
                    roll();
                    isLottery = true;
                    restLotteryTime--;
                    updateRestLotteryTime();
                    return false;
                }
            });
            // 查看抽奖历史
            $('#giftBtn').on('touchend', function () {
                $('#giftPop').addClass('show');
            })
        },
        initPop = function () {
            $('.pop').not('.pop-ewm').on('touchend', function (e) {
                if (e.target.classList.contains('pop')) {
                    e.target.classList.remove('show')
                }
            })
        },
        updateRestLotteryTime = function () {
            $('#rest').html(restLotteryTime);
        }
        ;
    return {
        init: init
    };
})();

// 抽奖
var lottery = {
    index: 0,	//当前转动到哪个位置，起点位置
    count: 0,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 20,	//初始转动速度
    times: 0,	//转动次数
    cycle: 50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置
    random: -1,	//中奖位置
    init: function (id, callBack) {
        if ($("#" + id + " li").length > 0) {
            $lottery = $("#" + id);
            $units = $lottery.find("li");
            this.obj = $lottery;
            this.count = $units.length;
            $units.eq(this.index).addClass("on");
        }
        this.callBack = callBack || function () {

            }
    },
    roll: function () {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $units.eq(index).removeClass("on");
        index += 1;
        if (index > count - 1) {
            index = 0;
        }
        $units.eq(index).addClass("on");
        this.index = index;
        return false;
    },
    stop: function (index) {
        this.prize = index;
        return false;
    }
};


cpl.init();

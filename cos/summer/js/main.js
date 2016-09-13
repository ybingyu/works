/*
 * Author: bindy Yuan
 * Version: 0.1.0
 * Compile Date: 2016-09-13 09:52
*/
var config = {
    imgPath: 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/sumber/image/',
    month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 2016年
    choseCls: 'chose',
    grayCls: 'gray',
    choseMax: 5,
    curYear: 2016,
    resultImg: [['result/result-', '.jpg'], ['result/txt-', '.png']],
    lotteryImg: ['lottery-front.png'],
    sleepIndex: 1,
    minSleep: 6,
    hour: [// type : 0(按天算),1(固定),2(0+1)
        {name: '睡觉', type: '0', need: 10, color: '#8aa0cd'},
        {name: '发呆', type: '0', need: 3, color: '#9ad31a'},
        {name: '看书', type: '0', need: 3, color: '#d2ac77'},
        {name: '刷剧', type: '0', need: 4 * 0.75, color: '#eb9793', txt: '4集×0.75小时'},
        {name: '看电视', type: '0', need: 4, color: '#fad09b'},
        {name: '看电影', type: '0', need: 4, color: '#b9e1f9', txt: '2部电影×2小时'},
        {name: '看奥运', type: '1', need: 136, color: '#a98ba9', txt: '8小时×17天'},
        {name: '看直播', type: '0', need: 5, color: '#434343'},
        {name: '玩音乐', type: '0', need: 3, color: '#bbace2'},
        {name: '打球', type: '0', need: 3, color: '#98c458'},
        {name: '游泳', type: '0', need: 2, color: '#62c8e3'},
        {name: '健身', type: '0', need: 3, color: '#7b82a2'},
        {name: '逛街', type: '0', need: 3, color: '#f39190'},
        {name: '聚会', type: '1', need: 90, color: '#96a9a1', txt: '9小时×10聚'},
        {name: '撩妹', type: '0', need: 6, color: '#b99dc0'},
        {name: '玩手游', type: '0', need: 8, color: '#9c9089'},
        {name: '刷朋友圈', type: '0', need: 5, color: '#9cc0a0'},
        {name: '玩游戏', type: '0', need: 8, color: '#d2ac77'},
        {name: '旅游', type: '1', need: 168, color: '#7186a3', txt: '24小时×7天'},
        {name: '做作业', type: '2', need: [2, 30], color: '#9190b5', txt: '+6小时×5天'},//need[每天。固定部分]
        {name: '实践', type: '0', need: 3, color: '#a2cabb'},
        {name: '家务', type: '0', need: 6, color: '#9479bf'},
        {name: '打工', type: '0', need: 6, color: '#ccd8cc'}
    ]
}
var summer = (function () {
    var mainSwiper,
        resultSwiper,
        lottery = {},
        preload,
        isInit = [],
        curTime = [],// 当前时间[m.d]
        choseTime = [],// 结束时间[m,d]
        choseIcon = [], // 选择的ICON maxLength:5
        countAnimationEnd = false,// count animation end to next
        restDay = 0,
        restHour = 0,
        restResult = [],//用于显示每次减后的时间
        needTime = [],
        resultTimer = null,//用于绘制result txt
        $resultNum;
    var init = function () {
            mainSwiper = new Swiper('#main', {
                direction: 'horizontal',
                initialSlide: 0,
                speed: 500,
                onlyExternal: true,
                onTransitionStart: function (swiper) {
                    var type = swiper.slides[swiper.activeIndex].dataset.type;
                    switch (type) {
                        case 'cover':
                            break;
                        case 'chose':
                            initChose(swiper);
                            break;
                        case 'count':
                            initCount(swiper);
                            break;
                        case 'result':
                            initResult(swiper);
                            break;
                        case 'end':
                            initEnd(swiper);
                            break;
                        case 'lottery':
                            // initLottery(swiper);
                            break;
                    }
                },
                onTransitionEnd: function (swiper) {
                    var type = swiper.slides[swiper.activeIndex].dataset.type;
                    switch (type) {
                        case 'cover':
                            break;
                        case 'chose':
                            break;
                        case 'count':
                            break;
                        case 'result':
                            break;
                        case 'end':
                            break;
                        case 'lottery':
                            initLottery(swiper);
                            break;
                    }
                }
            });
            $('#startBtn').on('touchend', function () {
                mainSwiper.slideNext();
            });
            $('#main .again-btn').on('touchend', function () {
                mainSwiper.slideTo(1, 1);
            });
            initBgSound();
        },
        initBgSound = function () {
            /*window.unload = function () {
                var bgSound = document.getElementById('bgSound');
                bgSound.pause();
            }*/
            $(document).one('touchend',function () {
                var bgSound = document.getElementById('bgSound');
                if (bgSound.paused) {
                    bgSound.play();
                }
            })
        },
        initChose = function (swiper) {
            swiper = swiper || mainSwiper;
            if (!isInit[swiper.activeIndex]) {
                isInit[swiper.activeIndex] = true;
                var htm = '';
                for (var i = new Date().getMonth() + 1; i <= 12; i++) {
                    if (i == 9) { //默认为9月1咯~
                        htm += '<option value="' + i + '" selected>' + i + '</option>';
                        continue;
                    }
                    htm += '<option value="' + i + '" >' + i + '</option>';
                }
                $('#month').html(htm).on('change', function () {
                    var month = $(this).val();
                    var data = config.month[month - 1];
                    var htm = '';
                    for (var i = 1; i <= data; i++) {
                        htm += '<option value="' + i + '" >' + i + '</option>';
                    }
                    $('#date').html(htm);
                }).trigger('change');
                $('#popDate').on('touchend', '.close-btn', function () {
                    var nowTime = new Date();
                    var nowM = nowTime.getMonth() + 1;
                    var nowD = nowTime.getDate();
                    var m = $('#month').val();
                    var d = $('#date').val();
                    if (nowM > m) {
                        alert('请输入正确时间');
                        return;
                    } else if (nowM == m && nowD >= d) {
                        alert('请输入正确时间');
                        return;
                    }
                    choseTime = [m, d];
                    curTime = [nowM, nowD];
                    // var end = new Date(config.curYear, m - 1, d, nowTime.getHours()).getTime();
                    // restHour = parseInt((end - nowTime.getTime()) / (1000 * 60 * 60)) + (24 - nowTime.getHours());
                    var end = new Date();
                    end.setMonth(m-1);
                    end.setDate(d);
                    restHour = parseInt((end - nowTime) / (1000 * 60 * 60)) ;
                    restDay = Math.floor(restHour / 24);
                    $(this).closest('.pop').removeClass('show');
                });
                $('#choseList').on('touchend', 'li', function () {
                    var $this = $(this);
                    var key = parseInt($this[0].dataset.key);
                    if (isNaN(key)) {
                        return;
                    }

                    if ($this.hasClass(config.choseCls)) { //移除选中
                        if (choseIcon.length == config.choseMax) {
                            $this.closest('ul').removeClass(config.grayCls);
                        }
                        $this.removeClass(config.choseCls);
                        var tempStr = choseIcon.toString();
                        for (var i = 0; i < choseIcon.length; i++) {
                            if (choseIcon[i] == key) {
                                choseIcon.splice(i, 1);
                                break;
                            }
                        }
                    } else { //选中
                        if (choseIcon.length >= config.choseMax) {
                            return;
                        }
                        $this.addClass(config.choseCls);
                        choseIcon.push(key);
                        choseIcon.sort(sortNumber);
                        if (choseIcon.length >= config.choseMax) {
                            $this.closest('ul').addClass(config.grayCls);
                        }
                    }

                    function sortNumber(a, b) {
                        return a - b;
                    }

                    console.log(choseIcon);
                });
                $('#okBtn').on('touchend', function () {
                    if (choseIcon.length < 5) {
                        return;
                    }
                    mainSwiper.slideNext();
                });
            } else {
                $('#choseList').removeClass(config.grayCls);
                for (var i = 0, $li = $('#choseList li'); i < $li.length; i++) {
                    $li.eq(i).removeClass(config.choseCls);
                }
                choseIcon = [];
                choseTime = [];
                curTime = [];
            }
            $('#popDate').addClass('show');
        },
        initCount = function (swiper) {
            swiper = swiper || mainSwiper;
            if (!isInit[swiper.activeIndex]) {
                isInit[swiper.activeIndex] = true;
                $('#detailBtn').on('touchend', function () {
                    if (!countAnimationEnd) {
                        return;
                    }
                    mainSwiper.slideNext();
                });
                $('#detailBtn .loaded').on('webkitAnimationEnd', function () {
                    countAnimationEnd = true;
                });
                $('#resultSwiper').on('touchend', '.lottery-btn', function () {
                    mainSwiper.slideNext();
                })
            } else {
                $(mainSwiper.slides[mainSwiper.activeIndex]).removeClass('counted');
            }

            // test start
            /* choseTime= [9,3];
             curTime = [7,21];
             choseIcon = [1,2,3,4,5];*/
            // test end

            preLoadResult();
            countAnimationEnd = false;

            var htm = '<p class="num"><i class="year">' + config.curYear + '</i><i class="month">' + curTime[0] + '</i><i class="date">' + curTime[1] + '</i></p>' +
                '<p class="num"><i class="year">' + config.curYear + '</i><i class="month">' + choseTime[0] + '</i><i class="date">' + choseTime[1] + '</i></p>' +
                '<p class="num"><span class="has"></span><i class="day">' + restDay + '</i><span class="day-txt"></span><i class="hour">' + restHour + '</i><span class="hour-txt"></span></p>';
            $('#result').html(htm);
        },
        initResult = function (swiper) {
            // 7.25
            swiper = swiper || mainSwiper;
            if (!isInit[swiper.activeIndex]) {
                isInit[swiper.activeIndex] = true;
                /*resultSwiper = new Swiper('#resultSwiper', {
                 direction: 'horizontal',
                 initialSlide: 0,
                 speed: 500,
                 // effect :'fade',
                 observer: true,
                 shortSwipes : true,
                 pagination: '.swiper-pagination',
                 paginationClickable: true,
                 onTransitionStart: function (swiper) {
                 // drawResult(swiper)
                 if(swiper.activeIndex = swiper.slides.length - 1){
                 $('#resultNum').html('');
                 }
                 }
                 });*/
            } else {
                // resultSwiper.removeAllSlides();
            }
            // test start
            /*choseIcon = [20, 2, 4, 5, 6];
             restDay = 45;
             restHour = 1080;
             preLoadResult();*/
            // test end

            needTime = [];
            restResult = [restHour];
            var htm = '';
            var iconHtm = '';
            var resultHtml = '';
            for (var i = 0; i < choseIcon.length; i++) {
                var txt = '此处扣去 ';
                var cur = config.hour[choseIcon[i] - 1];
                switch (cur.type) {
                    case '0':
                        needTime[i] = cur.need * restDay;
                        if(cur.txt){
                            txt += cur.txt + '×' + restDay + '天=<b style="color:' + cur.color + '">' + needTime[i] + '</b>小时';
                        }else {
                            txt += cur.need + '小时×' + restDay + '天=<b style="color:' + cur.color + '">' + needTime[i] + '</b>小时';
                        }
                        break;
                    case '1':
                        needTime[i] = cur.need;
                        txt += cur.txt + '=<b style="color:' + cur.color + '">' + cur.need + '</b>小时';
                        break;
                    case '2':
                        // 7.25
                        needTime[i] = cur.need[0] * restDay + cur.need[1];
                        txt += cur.need[0] + '小时×' + restDay + '天' + cur.txt + '=<b style="color:' + cur.color + '">' + needTime[i] + '</b>小时';
                        break;
                }
                restResult[i + 1] = restResult[i] - needTime[i];
                htm += '<div class="swiper-slide swiper-slide-' + choseIcon[i] + '" data-index="' + choseIcon[i] + '"><div class="txt-front"><canvas width="640" height="469"></canvas></div><p>' + txt + '</p></div>';
                iconHtm += '<li class="icon-' + choseIcon[i] + '" data-key="' + choseIcon[i] + '"></li>';
                resultHtml += '<span>-' + needTime[i] + '</span>';
            }
            htm += '<div class="swiper-slide swiper-slide-conclusion">' +
                '<div class="content">' +
                '<ul class="icon-list" >' + iconHtm +
                '</ul>' +
                '<p class="title num" id="numTitle"><span>' + restHour + '</span>' + resultHtml + '</p>' +
                '<span class="line"></span>' +
                '<p class="result-num num" id="resultNum"></p>' +
                '</div>' +
                '<p class="tip">本结果由英魂暑假分析仪不负责任得出</p>' +
                '<a class="lottery-btn"></a>' +
                '</div>';
            $('#resultSwiper .swiper-wrapper').html(htm);
            PageTransitions.init({
                container: '#resultSwiper'
            });
            // resultSwiper.slideTo(0, 1);
            $('#numTitle').on('webkitAnimationEnd', 'span', function () {
                var index = $(this).index();
                if (!$resultNum) {
                    $resultNum = $('#resultNum');
                }
                var options = {
                    useEasing: true,
                    useGrouping: true,
                    separator: '',
                    decimal: '',
                    prefix: '',
                    suffix: ''
                };
                var startNum = parseInt($resultNum.html()) || 0;
                var countUp = new CountUp("resultNum", startNum, restResult[index], 0, 0.8, options);
                countUp.start();
                // $resultNum.html(restResult[index]);
            })
        },
        initEnd = function (swiper) {
            swiper = swiper || mainSwiper;
            if (!isInit[swiper.activeIndex]) {
                isInit[swiper.activeIndex] = true;
                $('#shareBtn').on('touchend', function () {
                    $('#share').addClass('show');
                })
                $('#share').on('touchend', function () {
                    $(this).removeClass('show');
                    // test start
                    mainSwiper.slideNext();
                    // test end
                })
            }
            // test start
            /*choseIcon = [20, 2, 4, 5, 1];
             restDay = 45;
             restHour = 1080;*/
            // test end
            var isSleep = false;
            for (var i = 0; i < choseIcon.length; i++) {
                if (choseIcon[i] == config.sleepIndex) {
                    isSleep = true;
                    break;
                }
            }
            restHour = restResult[restResult.length - 1];
            if (isSleep) {
                // 有选睡觉
                $('#endResult').removeClass('no-sleep');
            } else {
                restHour -= config.minSleep * restDay;
                $('#endResult').addClass('no-sleep');
            }
            console.log(restHour)
            var d = Math.floor(restHour / 24);
            var h = Math.floor(restHour % 24);
            $('#endResult').find('.rest-day').html(d);
            $('#endResult').find('.rest-hour').html(Math.abs(h));
            // 7.25
            // to remove result page add event
            $(window).off('touchstart');
        },
        initLottery = function (swiper) {
            swiper = swiper || mainSwiper;
            $('#lottery').removeClass('drawed');
            // 抽奖逻辑写介个里面咯~
            // 刮刮乐
            if (!isInit[swiper.activeIndex]) {
                lottery.lotteryCanvas = document.getElementById('lotteryCanvas');
                lottery.$lotteryResult = $('#lotteryResult');
                lottery.ctx = lottery.lotteryCanvas.getContext('2d');
                lottery.w = lottery.lotteryCanvas.width;
                lottery.h = lottery.lotteryCanvas.height;
                lottery.radius = 50;
                lottery.target_offset_x = lottery.lotteryCanvas.getBoundingClientRect().left;
                console.log(lottery.target_offset_x);
                lottery.target_offset_y = lottery.lotteryCanvas.getBoundingClientRect().top;
                // 事件
                lottery.lotteryCanvas.addEventListener('touchstart', lotteryEventDown, false);
                lottery.lotteryCanvas.addEventListener('touchmove', lotteryEventMove, false);
                lottery.lotteryCanvas.addEventListener('touchend', lotteryEventUp, false);

                initPreload(config.lotteryImg, drawLotteryImg);
                isInit[swiper.activeIndex] = true;
            } else {
                lottery.ctx.globalCompositeOperation = 'source-over';
                drawLotteryImg();
            }


            lottery.isTouch = false;
        },
        preLoadResult = function () {
            var preloadA = [];
            for (var i = 0; i < choseIcon.length; i++) {
                preloadA.push({
                    id: 'bg' + choseIcon[i],
                    src: config.resultImg[0][0] + choseIcon[i] + config.resultImg[0][1]
                });
                preloadA.push({
                    id: 'text' + choseIcon[i],
                    src: config.resultImg[1][0] + choseIcon[i] + config.resultImg[1][1]
                });
            }
            initPreload(preloadA, function () {
                $(mainSwiper.slides[mainSwiper.activeIndex]).addClass('counted');
            });
        },
        drawResult = function (swiper) {
            var $curSlide = $(swiper.slides[swiper.activeIndex]);
            var index = parseInt($curSlide[0].dataset.index);
            var canvas = $(swiper.slides[swiper.activeIndex]).find('.txt-front canvas')[0]; //获取canvas
            if ($curSlide[0].dataset.isDraw) {
                canvas.style.visibility = 'hidden';
                return;
            }
            canvas.classList.remove('fadeOut');
            var context = canvas.getContext('2d'); //canvas追加2d画图
            var img = preload.getResult('bg' + index);
            context.globalCompositeOperation = 'source-over';
            context.drawImage(img, 0, 0);
            context.globalCompositeOperation = 'destination-out';
            function draw(x, y) {
                context.beginPath();
                var radgrad = context.createRadialGradient(x, y, 0, x, y, 30);
                radgrad.addColorStop(0, 'rgba(0,0,0,0.9)');
                radgrad.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
                context.fillStyle = radgrad;
                context.arc(x, y, 120, 0, Math.PI * 2, true);
                context.fill();
            }

            var w = canvas.width, h = canvas.height, x = 10, y = 10, step = 30, dir_x = 1, dur_y = 30;
            if (resultTimer) {
                clearInterval(resultTimer);
                resultTimer = null;
            }
            resultTimer = setInterval(function () {
                var curStep_x = Math.floor(Math.random() * step) + 10,
                    curStep_y = Math.random() / 5;
                x += curStep_x * dir_x;
                y = -1 / 4 * x + dur_y;
                if (x > w) {
                    dir_x = -1;
                    dur_y += 30;
                } else if (x < 0) {
                    dir_x = 1;
                    dur_y += 30;
                }
                if (y > h) {
                    clearInterval(resultTimer);
                    resultTimer = null;
                    canvas.classList.add('fadeOut');
                }
                draw(x, y)
            }, 10);
            $curSlide[0].dataset.isDraw = true;
        },
        drawLotteryImg = function () {
            var img = preload.getResult(config.lotteryImg);
            lottery.ctx.drawImage(img, 0, 0);
            lottery.ctx.globalCompositeOperation = 'destination-out';
            $('#lottery').addClass('drawed');
        },
        lotteryEventDown = function (e) {
            e.preventDefault();
            lottery.isTouch = true;
        },
        lotteryEventUp = function (e) {
            e.preventDefault();
            lottery.isTouch = false;
        },
        lotteryEventMove = function (e) {
            e.preventDefault();
            if (!lottery.isTouch || !e.touches.length) return;

            var touch = e.touches[0],
                x = touch.pageX - lottery.target_offset_x,
                y = touch.pageY - lottery.target_offset_y;

            lottery.ctx.beginPath();
            lottery.ctx.arc(x, y, lottery.radius, 0, Math.PI * 2, true);
            lottery.ctx.fill();
        },
        initPreload = function (pre, fn) {
            if (!preload) {
                preload = new createjs.LoadQueue(false, config.imgPath);
            }
            preload.removeAllEventListeners("complete");
            preload.on("complete", fn || handleComplete);
            var type = (typeof(pre)).toLowerCase();
            if (type == 'object') {
                preload.loadManifest(pre);
            } else if (type == 'string') {
                pre = [pre];
                preload.loadManifest(pre);
            }
        },
        handleComplete = function (e) {

        };
    return {
        init: init
    };
})();

// 7.25
var PageTransitions = (function () {
    var $main = $('#resultSwiper'),
        $pages = $main.find('.swiper-slide'),
        pagesCount = $pages.length,
        current = 0,
        isAnimating = false,
        endCurrPage = false,
        endNextPage = false,
        curClass = 'swiper-slide-active',
        animEndEventNames = 'webkitAnimationEnd',
        $pageContainer,
        pageCurClass = 'swiper-pagination-bullet-active',
        pageClass = '';

    function init(option) {
        $(window).on('touchstart', function (e) {
            e.preventDefault();
        });
        $main = $(option.container || '#swiper');
        $pages = $main.find(option.child || '.swiper-slide');
        pagesCount = $pages.length;
        current = option.initialSlide || 0;
        isAnimating = false;
        endCurrPage = false;
        endNextPage = false;
        curClass = option.curClass || 'swiper-slide-active';
        animEndEventNames = 'webkitAnimationEnd';
        $pageContainer = $main.find(config.pageContainer || '.swiper-pagination');
        pageCurClass = option.pageCurClass || 'swiper-pagination-bullet-active';
        pageClass = option.pageClass || 'swiper-pagination-bullet';

        $pages.each(function () {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });
        $main.on('swipeLeft',
            function () {
                nextPage();
            }).on('swipeRight',
            function () {
                prevPage();
            });

        $pages.eq(current).addClass(curClass);
        // page
        var htm = '';
        for (var i = 0; i < pagesCount; i++) {
            var cls = 'swiper-pagination-bullet';
            if (current == i) {
                cls += ' swiper-pagination-bullet-active'
            }
            htm += '<span class="' + cls + '"></span>';
        }
        $pageContainer.html(htm);
    }

    function nextPage() {
        if (isAnimating) {
            return false;
        }

        var $currPage = $pages.eq(current);


        if (current < pagesCount - 1) {
            ++current;
        }
        else {
            return;
        }
        isAnimating = true;


        var $nextPage = $pages.eq(current).addClass(curClass),
            outClass = 'moveToLeftEasing page-ontop',
            inClass = 'moveFromRight';


        $currPage.addClass(outClass).on(animEndEventNames, function () {
            $currPage.off(animEndEventNames);
            endCurrPage = true;
            if (endNextPage) {
                onEndAnimation($currPage, $nextPage);
            }
        });

        $nextPage.addClass(inClass).on(animEndEventNames, function () {
            $nextPage.off(animEndEventNames);
            endNextPage = true;
            if (endCurrPage) {
                onEndAnimation($currPage, $nextPage);
            }
        });
        changePagination();
    }

    function prevPage() {
        if (isAnimating) {
            return false;
        }


        var $currPage = $pages.eq(current);

        if (current > 0) {
            --current;
        }
        else {
            return;
        }

        isAnimating = true;

        var $prevPage = $pages.eq(current).addClass(curClass),
            outClass = 'moveToRightEasing',
            inClass = 'moveFromLeft page-ontop';


        $currPage.addClass(outClass).on(animEndEventNames, function () {
            $currPage.off(animEndEventNames);
            endCurrPage = true;
            if (endNextPage) {
                onEndAnimation($currPage, $prevPage);
            }
        });

        $prevPage.addClass(inClass).on(animEndEventNames, function () {
            $prevPage.off(animEndEventNames);
            endNextPage = true;
            if (endCurrPage) {
                onEndAnimation($currPage, $prevPage);
            }
        });
        changePagination();
    }

    function changePagination() {
        $pageContainer.find('.' + pageCurClass).removeClass(pageCurClass);
        $pageContainer.find('.' + pageClass + ':nth-child(' + (current + 1) + ')').addClass(pageCurClass);
    }

    function onEndAnimation($outpage, $inpage) {
        endCurrPage = false;
        endNextPage = false;
        resetPage($outpage, $inpage);
        isAnimating = false;
    }

    function resetPage($outpage, $inpage) {
        $outpage.attr('class', $outpage.data('originalClassList'));
        $inpage.attr('class', $inpage.data('originalClassList') + ' ' + curClass);
    }

    return {
        init: init
    };

})();
summer.init();


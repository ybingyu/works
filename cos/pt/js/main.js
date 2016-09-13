/*
 * Author: bindy Yuan
 * Version: 0.1.0
 * Compile Date: 2016-05-09 16:23
*/
// 横竖屏检测
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', orientationChange, false);

function orientationChange() {
	if (window.orientation == 90 || window.orientation == -90) {
		//横屏
		$('#originTip').removeClass('hide');
	} else {
		//竖屏
		$('#originTip').addClass('hide');
	}
}
orientationChange();

Array.prototype.inArray = function(searchItem) {
	for (var i = 0, len = this.length; i < len; i++) {
		if (searchItem == this[i]) {
			return true;
		}
	}
	return false;
}

const config = {
	rect: [4, 4], //拼图 行 列数
	time: 30, //总时间
	chance: 25, // 机会
	cardPath: 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/pt/img/',
	card: [ // 奖品
		{
			img: 'card-null.png',
			txt: '还需努力'
		}, {
			img: 'card-hk.png',
			txt: '限时皮肤卡'
		},{
			img: 'card-qe.png',
			txt: '限时皮肤卡'
		}, {
			img: 'card-css.png',
			txt: '传送石'
		}, {
			img: 'card-ffs.png',
			txt: '复活石'
		}, {
			img: 'card-jgs.png',
			txt: '金刚石'
		}, {
			img: 'card-jf.png',
			txt: '掌魂积分'
		}, {
			img: 'card-jf-10.png',
			txt: '掌魂积分'
		},
	]
};


var jigsaw = (function() {
	var rectOrigArr = [], //图片拆分后，存储正确排序的数组
		rectRandArr = [], //图片打乱顺序后，存储当前排序的数组
		rectWidth, rectHeight, // 方块的宽高
		contWidth, contHeight, // 容器的宽高
		contOffset, //容器offset
		$rects, // 方块doms
		$moveRect, //移动的方块
		moveIndex_1 = -1, //移动图片的下标
		moveIndex_2 = -1, //被移动图片的下标
		moveX = -1,
		moveY = -1, // 移动图片的点击位置
		pageX, pageY,
		time, timer, $time,
		chance, // 机会数
		freeChance, // 免费翻牌次数
		curChoseCard, // 当前点击的卡
		$result,
		$freeCardTip, $card,
		// 4.9
		isTransition;
	var init = function() {
			mainSwiper = new Swiper('#main', {
				direction: 'vertical',
				onTouchStart: swiperLock,
				onInit: swiperLock,
				initialSlide: 0,
				speed : 300,// 4.9
				onTransitionEnd: function(swiper) {
					switch (swiper.activeIndex) {
						case 0:
							// 还原方块
							updateRect(rectOrigArr);
							$('#gameRect').removeClass('game-win game-begin');
							$result.removeClass('result-success result-fail');
							break;
						case 1:
							initGame();
							// startGame();
							setTimeout(startGame, 3000);
							break;
					}
					// 4.9
					swiperLock(mainSwiper);
					isTransition = false;
				}
			});
			$('#startBtn').on('touchend', function() {
				swiperSlideTo(mainSwiper, 1);
			});
			$('#againBtn').on('touchend', function() {
				if (freeChance >= 1) {
					return;
				}
				showAllCard();
				setTimeout(function() {
					swiperSlideTo(mainSwiper, 0);
				}, 2000);
			});
			$('#shareBtn').on('touchend', function() {
				showAllCard();
			});
			// get chance
			chance = 25;
			chanceCheck();
		},
		chanceCheck = function() {
			if (chance <= 0) {
				$('#chanceEnd').removeClass('hide');
			}
		},
		initGame = function() {
			if (!$rects) {
				$rects = $('#gameRect li');
				var $rect = $($rects.eq(0));
				rectWidth = $rect.width();
				rectHeight = $rect.height();
				contWidth = rectWidth * config.rect[0];
				contHeight = rectHeight * config.rect[1];
				contOffset = $('#gameRect').offset();
				$time = $('#time');
				$result = $('#result');
				$freeCardTip = $('#cardTips');
				$card = $('#card li');

				for (var i = 0; i < config.rect[1]; i++) {
					for (var j = 0; j < config.rect[0]; j++) {
						//将碎片所属div的下标存入数组，用于最终校验是否排序完成
						rectOrigArr.push(i * config.rect[0] + j);
					}
				}

				// rect move event
				$('#gameRect').on('touchstart', 'li', function(e) {
					e.preventDefault();
					$moveRect = $(this);
					$moveRect.addClass('drag').on('touchend', rectTouchend);
					moveIndex_1 = $moveRect.index();
					var offset = $moveRect.offset();
					var touch = e.touches[0];
					moveX = touch.pageX - offset.left;
					moveY = touch.pageY - offset.top;

					$(document).on('touchmove', function(e) {
						var touch = e.touches[0];
						var x = touch.pageX - moveX - contOffset.left;
						var y = touch.pageY - moveY - contOffset.top;
						x = x < 0 ? 0 : x;
						x = (x + rectWidth) > contWidth ? (contWidth - rectWidth) : x;
						y = y < 0 ? 0 : y;
						y = (y + rectHeight) > contHeight ? (contHeight - rectHeight) : y;
						setRectPos($moveRect, x, y, true);
						pageX = touch.pageX;
						pageY = touch.pageY;
						$moveRect.off('touchend');
						// console.log('move');
					}).on('touchend', function(e) {
						//被交换的碎片下标
						moveIndex_2 = rectChangeIndex((pageX - contOffset.left), (pageY - contOffset.top), moveIndex_1);

						//碎片交换
						if (moveIndex_1 == moveIndex_2) {
							rectReturn(moveIndex_1);
						} else {
							rectExchange(moveIndex_1, moveIndex_2);
						}

						rectTouchend();
					});
				}).on('transitionend', 'li', rectTransitionend).on('webkitTransitionEnd', 'li', rectTransitionend);

				$freeCardTip.on('touchend', '.close-btn', function() {
					$freeCardTip.addClass('hide');
				}).on('touchend', '.card-btn', function() {
					card();
					$freeCardTip.addClass('hide');
				});
				// 翻牌
				$('#card').on('touchend', 'li', function() {
					if($(this).hasClass('show')){
						return;
					}
					// if(curChoseCard>=0){return;}
					curChoseCard = $(this).index();
					if (freeChance <= 0) { // 消耗积分进行翻牌 显示弹窗
						$freeCardTip.removeClass('hide');
						return;
					}
					card();
				});
			}
			showTime(config.time);
			for (var i = 0, len = $card.size(); i < len; i++) {
				var $c = $card.eq(i);
				$c.removeClass('show');

				$c.find('.card-img').attr({
					src: '',
					alt: 'loading...'
				});
				$c.find('.card-name').html('loading...');
			}
		},
		rectTouchend = function() {
			$(document).off('touchmove').off('touchend');
			if ($moveRect) {
				$moveRect.removeClass('drag');
			}

			$moveRect = null;
			moveIndex_1 = -1;
			moveIndex_2 = -1;
			moveX = -1;
			moveY = -1;
		},
		rectTransitionend = function() {
			setRectPos($(this), parseInt(this.dataset.dx), parseInt(this.dataset.dy));
			$(this).removeClass('move drag');
			// console.log('transitionend');
		},
		startGame = function() {
			chance--;
			freeChance = -1;
			curChoseCard = -1;
			chanceCheck();

			time = config.time;

			updateTime();
			randomImg();
			timerClear();
			// 游戏开始 延时 等方块移动完
			setTimeout(function() {
				$('#gameRect').addClass('game-begin');
				timer = setInterval(timerInterval, 1000);
			}, 300);
		},
		endGame = function() {
			timerClear();
		},
		card = function() {
			// 开始抽奖
			var index = Math.floor(Math.random() * config.card.length);

			showChoseCard(index);
		},
		showAllCard = function() {
			for (var i = 0, len = $card.size(); i < len; i++) {
				if($card.eq(i).hasClass('show')){
					continue;
				}
				showCard(Math.floor(Math.random() * config.card.length), i);
			}
		},
		showChoseCard = function(i) {
			freeChance--;
			showCard(i, curChoseCard);
		},
		showCard = function(i, index) {
			var $curCard = $card.eq(index);
			$curCard.find('.card-img').attr({
				src: config.cardPath + config.card[i].img,
				alt: config.card[i].txt
			});
			$curCard.find('.card-name').html(config.card[i].txt);
			$curCard.addClass('show');
		},
		/**
		 * 生成不重复的随机数组的函数
		 */
		randomImg = function() {
			//清空数组
			rectRandArr = [];

			var order; //随机数，记录图片放置在什么位置
			for (var i = 0, len = rectOrigArr.length; i < len; i++) {
				order = Math.floor(Math.random() * len);
				if (rectRandArr.length > 0) {
					while (rectRandArr.inArray(order)) {
						order = Math.floor(Math.random() * len);
					}
				}
				rectRandArr.push(order);
			}
			// console.log(rectRandArr);
			updateRect(rectRandArr);
		},
		/**
		 * 根据数组给图片排序
		 * @param  {arr} arr 用于排序的数组
		 */
		updateRect = function(arr) {
			for (var i = 0, len = arr.length; i < len; i++) {
				var x = arr[i] % config.rect[0] * rectWidth;
				var y = Math.floor(arr[i] / config.rect[0]) * rectHeight;
				setRectPos($rects.eq(i), x, y);
			}
		},
		/**
		 * 设置方块位置
		 * @param {dom}  $r     方块
		 * @param {num}  x      x坐标
		 * @param {num}  y      y坐标
		 * @param {boolean} isMove 是否移动
		 */
		setRectPos = function($r, x, y, isMove) {
			if (!$r || !$r[0] || !$r[0].dataset) {
				return;
			}
			var scale = isMove ? 1.05 : 1;
			var transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')';
			// console.log(transform)
			$r.css({
				'transform': transform,
				'-webkit-transform': transform
			});
			$r[0].dataset.dx = x;
			$r[0].dataset.dy = y;
		},
		/**
		 * 通过坐标，计算被交换的碎片下标
		 * @param  {num} x    touchx坐标
		 * @param  {num} y    touchy坐标
		 * @param  {num} orig 被拖动的碎片下标，防止不符合碎片交换条件时，原碎片返回
		 * @return {num}      被交换节点在节点列表中的下标
		 */
		rectChangeIndex = function(x, y, orig) {
			//鼠标拖动碎片移至大图片外
			if (x < 0 || x > contWidth || y < 0 || y > contHeight) {
				return orig;
			}
			//鼠标拖动碎片在大图范围内移动
			var row = Math.floor(y / rectHeight),
				col = Math.floor(x / rectWidth),
				location = row * config.rect[0] + col;
			var i = 0,
				len = rectRandArr.length;
			while ((i < len) && (rectRandArr[i] != location)) {
				i++;
			}
			return i;
		},
		/**
		 * 被拖动图片返回原位置
		 * @param  index 被拖动图片的下标
		 */
		rectReturn = function(index) {
			var row = Math.floor(rectRandArr[index] / config.rect[0]); //行
			var col = rectRandArr[index] % config.rect[0]; //列

			$moveRect.addClass('move');
			setRectPos($moveRect, col * rectWidth, row * rectHeight, true);
			console.log('return');
		},
		/**
		 * rectExchange 两块图片碎片进行交换
		 * @param  from 被拖动的碎片
		 * @param  to   被交换的碎片
		 * @return      交换结果，成功为true,失败为false
		 */
		rectExchange = function(from, to) {
			//被拖动图片、被交换图片所在行、列
			var rowFrom = Math.floor(rectRandArr[from] / config.rect[0]);
			var colFrom = rectRandArr[from] % config.rect[0];
			var rowTo = Math.floor(rectRandArr[to] / config.rect[0]);
			var colTo = rectRandArr[to] % config.rect[0];

			var temp = rectRandArr[from]; //被拖动图片下标，临时存储

			//被拖动图片变换位置
			$rects.eq(from).addClass('move');
			setRectPos($rects.eq(from), colTo * rectWidth, rowTo * rectHeight);
			//交换图片变换位置
			$rects.eq(to).addClass('move');
			setRectPos($rects.eq(to), colFrom * rectWidth, rowFrom * rectHeight);

			//两块图片交换存储数据
			rectRandArr[from] = rectRandArr[to];
			rectRandArr[to] = temp;
			console.log('exchange');

			endCheck();
		},
		endCheck = function() {
			//判断是否完成全部移动，可以结束游戏
			if (checkPass(rectOrigArr, rectRandArr)) {
				console.log('win');
				$result.addClass('result-success').removeClass('result-fail');
				$('#gameRect').addClass('game-win');
				freeChance = 1;
			} else if (time <= 0) {
				console.log('fail');
				$result.addClass('result-fail').removeClass('result-success');
				freeChance = 0;
			} else {
				return;
			}

			// console.log(score);
			$('#chance').html(chance);
			endGame();
		},
		/**
		 * [checkPass 判断游戏是否成功的函数]
		 * @param  rightArr  [正确排序的数组]
		 * @param  puzzleArr [拼图移动的数组]
		 * @return           [是否完成游戏的标记，是返回true，否返回false]
		 */
		checkPass = function(rightArr, puzzleArr) {
			if (rightArr.toString() == puzzleArr.toString()) {
				return true;
			}
			return false;
			// for test:
			// return true;
		},
		timerInterval = function() {
			time--;
			updateTime();
		},
		timerClear = function() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		},
		updateTime = function() {
			showTime(time);
			if (time <= 0) {
				endCheck();
			}
		},
		showTime = function(t) {
			var m = '0' + Math.floor(t / 60);
			var s = '0' + t % 60;
			var str = m.substr(m.length - 2) + ':' + s.substr(s.length - 2);
			$time.html(str);
		},
		swiperUnLock = function(swiper) {
			swiper.unlockSwipes();
			// 4.9
			isTransition = true;
		},
		swiperLock = function(swiper) {
			swiper.lockSwipes();
		},
		swiperSlideTo = function(swiper, index) {
			// 4.9
			if(isTransition){
				return;
			}
			if (!swiper || isNaN(index)) {
				return;
			}
			swiperUnLock(swiper);
			swiper.slideTo(index);
		};
	return {
		init: init
	};
})();

jigsaw.init();

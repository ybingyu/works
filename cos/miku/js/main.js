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



const config = {
	volume: 100,
	bgVolume: 0.2, //背景音乐音量
	left: 0,
	right: 1,
	level: 30,
	audioPath: 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/miku/audio/',
	levelAniTime: 1000, // 关卡动画结束-开始鼓声之间的时间
	preTime: 1000, // 准备时间
	choseTime: 2000, // 选择时间
	durTime: 1000, // 出题间隔
	levelJudge: 1, //每关出题次数
};

var listen = (function() {
	var mainSwiper,
		curLevel = 0, //当前关卡
		bgSound, judgeSound,
		curSound,
		curJudge, // 每关答题次数
		isPlay = false,
		$gu,
		$gameSlide,
		$level,
		choseTimer, // 选择时间timer
		browser = checkMobile();
	var init = function() {
			mainSwiper = new Swiper('#main', {
				direction: 'vertical',
				onTouchStart: swiperLock,
				onInit: swiperLock,
				initialSlide: 0,
				onTransitionEnd: function(swiper) {
					switch (swiper.activeIndex) {
						case 0:
							break;
						case 1:
							$('#rule').addClass('show');
							break;
						case 2:
							if ($level) {
								$level[0].className = 'num-0';
								$level[1].className = 'num-0';
							}
							break;
					}
				}
			});

			initBgSound();
			initSound();
			$('#rule .close-btn').on('touchend', function() {
				$('#rule').removeClass('show');
				initGame();
			});
			$('#startBtn').on('touchend', function() {
				swiperSlideTo(mainSwiper, 1);
				endJudgeSound();
			});
			$('#againBtn').on('touchend', function() {
				swiperSlideTo(mainSwiper, 0);
			});
		},
		initBgSound = function() {
			// Howler.iOSAutoEnable = false;
			// updata android 低版本howler音频只播放头3s,故此用原生audio
			if (browser.android) {
				bgSound = new Audio();
				bgSound.src = config.audioPath + 'bgm.mp3';
				bgSound.loop = true;
				bgSound.play();
				bgSound.volume = config.bgVolume;
			} else {
				bgSound = new Howl({
					urls: [config.audioPath + 'bgm.mp3'],
					autoplay: true,
					loop: true,
					volume: config.bgVolume
				}).play();
			}
		},
		initSound = function() {
			judgeSound = [];
			judgeSound[0] = new Howl({
				urls: [config.audioPath + 'left.mp3'],
				onend: endJudgeSound
			})
			judgeSound[1] = new Howl({
				urls: [config.audioPath + 'right.mp3'],
				onend: endJudgeSound
			})
		},
		endJudgeSound = function() {
			if (browser.android && bgSound.paused) {
				bgSound.play();
			}
		},
		initGame = function() {
			if (!$gu) {
				$gu = $('#gu').on('tap', '.gu', choseGu);
				$gameSlide = $('#gameSlide').on('webkitAnimationEnd animationend', function() {
					$gameSlide.removeClass('fail');
					swiperSlideTo(mainSwiper, 2);
				});
				$('#level').on('webkitTransitionEnd transitionend', 'i', function() {
					if (mainSwiper.activeIndex != 1) {
						return;
					}
					setTimeout(randomSound, config.levelAniTime);
				});

				$level = $('#level i');
			}
			curLevel = 0;
			isPlay = false;
			startLevel();
		},
		startLevel = function() {
			if (curLevel >= config.level) {
				console.log('all pass');
				success();
				return;
			}
			if (curSound >= 0) {
				return;
			}
			updateLevel();
			curJudge = 0;
			var curVolume;
			// 难度分段
			if (curLevel >= 0 && curLevel <= 5) {
				curVolume = -8 * curLevel + 50;
			} else if (curLevel > 5 && curLevel <= 13) {
				curVolume = -5 / 7 * curLevel + 100 / 7;
			} else if(curLevel > 13 && curLevel <= 20){
				curVolume = 5;
			}else if(curLevel == 27 || curLevel == 30){
				curVolume = 4;
			}else{
				curVolume = 3;
			}
			curVolume /= config.volume;
			// curVolume = Math.floor(config.judgeVolume - curLevel * durVolume);

			for (var i = 0; i < judgeSound.length; i++) {
				judgeSound[i].volume(curVolume);
			}
			console.log('curVolume', judgeSound[0].volume());
			console.log('curLevel', curLevel);
		},
		updateLevel = function() {
			$level[0].className = 'num-' + parseInt((curLevel + 1) / 10);
			$level[1].className = 'num-' + (curLevel + 1);
		},
		choseGu = function(e) {
			if (!isPlay) {
				return;
			}
			if (config[this.dataset.s] == curSound) {
				console.log('correct chose');
				clearChoseTimer();

				if (curJudge >= config.levelJudge) {
					// 完成本关 下一关
					console.log('finish cur level');
					curLevel++;
					startLevel();
				} else {
					setTimeout(randomSound, config.durTime);
				}
			} else {
				// 选错
				fail();
			}
			isPlay = false;
		},
		success = function() {
			result();
			swiperSlideTo(mainSwiper, 2);
		},
		fail = function() {
			$gameSlide.addClass('fail');
			result();
		},
		result = function() {
			clearChoseTimer();
			var leveStr = '0' + curLevel;
			leveStr = leveStr.substr(leveStr.length - 2);
			var levelArr = leveStr.split('');
			$('#result').html('<i class="num-' + levelArr[0] + '"></i><i class="num-' + levelArr[1] + '"></i>');
		},
		clearChoseTimer = function() {
			if (choseTimer) {
				clearTimeout(choseTimer);
				choseTimer = null;
			}
			$gu.removeClass('ani');
			curSound = -1;
		},
		randomSound = function() {
			if (curSound >= 0 || isPlay) {
				return;
			}
			curJudge++;
			curSound = Math.round(Math.random() * 1);
			console.log('curSound', curSound);
			isPlay = false;
			setTimeout(function() {
				isPlay = true;
				judgeSound[curSound].play();

				// 超时未选择
				choseTimer = setTimeout(fail, config.choseTime);
			}, config.preTime);
			$gu.addClass('ani');
		},
		swiperUnLock = function(swiper) {
			swiper.unlockSwipes();
		},
		swiperLock = function(swiper) {
			swiper.lockSwipes();
		},
		swiperSlideTo = function(swiper, index) {
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

listen.init();

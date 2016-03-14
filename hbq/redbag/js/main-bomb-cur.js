var Config = {
	imgPath: '../image/',
	audioPath: '../audio/',
	preload: [
		['audio', 'run.mp3'],
		['audio', 'slide.mp3'],
		['audio', 'bomb.mp3'],
		['audio', 'curtain.mp3'],
		['audio', 'result.mp3'],
		['img', 'ride-man.png'],
		['img', 'curtain-left.png'],
		['img', 'curtain-right.png'],
		['img', 'speak.png'],
		['img', 'start-bth.png'],
		['img', 'red-bag.png'],
		['img', 'bg.jpg'],
		['img', 'cloud-01.png'],
		['img', 'cloud-02.png'],
		['img', 'cloud-03.png'],
		['img', 'cloud-04.png'],
		['img', 'cloud-05.png'],
		['img', 'cloud-06.png'],
		['img', 'house.png'],
		['img', 'dust.png'],
		['img', 'prev-bg.png'],
		['img', 'bc.png'],
		['img', 'xx.png'],
		['img', 'lb.png'],
		['img', 'bomb.png'],
		['img', 'red-bag-s.png'],
		['img', 'clock.png'],
		['img', 'hand.png'],
		['img', 'arrow.png'],
		['img', 'number.png'],
	],
	game: {
		time: 12000,
		redBag: [
			{
				money: 100,
				cls: '',
				ratio: [0.35,0.3,0.2],
				width: -1,
				speed: 1
			}, {
				money: 50,
				cls: 'red-bag-m',
				ratio: [0.25,0.2,0.3],
				width: -1,
				speed: 2
			}, {
				money: 10,
				cls: 'red-bag-sm',
				ratio: [0.1,0.2,0.25],
				width: -1,
				speed: 3
			}, {
				money: -1,
				cls: 'bomb',
				ratio: [0.3,0.3,0.25],
				width: -1,
				speed: 2,
				maxNum : [2,2,2]
			}
		],
		baseRatio: 100,
		man : ['man-xiang','man-lvbu','man-bocai']
	},
	width: 1280,
	duration : 100
};
document.documentElement.ontouchstart = function(e){
   e.preventDefault();
};
// 横竖屏检测
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', orientationChange, false);

function orientationChange() {
	if (window.orientation == 90 || window.orientation == -90) {
		//横屏
		document.getElementById('turnBox').classList.remove('hide');
	} else {
		//竖屏
		document.getElementById('turnBox').classList.add('hide');
	}
	windowWidth = window.width;
}
orientationChange();

Array.prototype.indexOf = function(e) {
	for (var i = 0, j; j = this[i]; i++) {
		if (j == e) {
			return i;
		}
	}
	return -1;
}
Array.prototype.lastIndexOf = function(e) {
	for (var i = this.length - 1, j; j = this[i]; i--) {
		if (j == e) {
			return i;
		}
	}
	return -1;
}
Array.prototype.remove = function(dx) {
	if (isNaN(dx) || dx > this.length) {
		return false;
	}
	this.splice(dx, 1);
}

var page = (function(){
	var $domScene,
		$loadTxt = $('#load .load-txt'),
		$loadImg = $('#load .cur-load'),
		curScene = -1,
		prevScene = -1,
		isAudio = 1,
		self = this,
		initPrevScene = function(){
			init(function(){
				$domScene = $('.scene');
				switchScene(0);
				playBg('begin.mp3');
			});
		},
		switchScene = function(index, dom, time) {
			if (curScene == index) {
				return;
			}
			if (curScene >= 0) {
				$domScene.eq(curScene).addClass('prev-scene');
			}

			$domScene.eq(index).removeClass('prev-scene cur-scene').addClass('cur-scene');
			if (dom) {
				dom.on('animationend', function() {
					$domScene.eq(prevScene).removeClass('cur-scene');
				});
			} else if (time) {
				setTimeout(function() {
					$domScene.eq(prevScene).removeClass('cur-scene');
				}, time);
			} else if (curScene >= 0) {
				$domScene.eq(curScene).removeClass('cur-scene');
			}
			prevScene = curScene;
			curScene = index;
			// init scene
			switch (index) {
				case 0:
					$('#startBtn').on('tap', function() {
						switchScene(1, $('#rideMan'));
						playAudio('curtain.mp3');
					});
					$('#speak').on('animationend webkitAnimationEnd',function(){
						$domScene.eq(curScene).on('touchend',function(){
							$domScene.eq(curScene).addClass('speak-end').off('touchend');
						});
					});
					break;
				case 1:
					sceneChose();
					break;
			}
		},
		sceneChose = function() {
			var $manChoose = $('#manChoose');
			$choseMans = $manChoose.find('.man');
			$firstMan = $choseMans.eq(0);
			choseManIndex = 0;
			var $onMan = $manChoose.find('.on');
			choseManWidth = $onMan.width();
			choseManLeft = parseInt($onMan.next('.man').css('margin-left'));
			$firstMan.css('margin-left', ((Config.width - choseManWidth) + (choseManWidth + choseManLeft) * (choseManIndex - 1) + choseManLeft) * -1 + 'px');
			touch.on($manChoose, 'touchstart', function(ev) {
				ev.preventDefault();
				$('#choseHand').addClass('hide');
			});
			touch.on($manChoose, 'swiperight', function(ev) {
				choseMan(-1);
			});
			touch.on($manChoose, 'swipeleft', function(ev) {
				choseMan(1);
			});
			$manChoose.on('doubleTap', '.man.on .tap', function() {
				$domScene.eq(curScene).addClass('fade-out').on('animationend webkitAnimationEnd', function(e) {
					var index = $domScene.eq(curScene).find('.man.on').index();
					window.location.href = 'game.shtml?i=' +index +'&a=' + isAudio;
				})
			});
		},
		choseMan = function(dir) {
			// $('#choseHand').addClass('hide');
			choseManIndex += dir;
			if (choseManIndex >= $choseMans.length) {
				choseManIndex = $choseMans.length - 1;
			} else if (choseManIndex < 0) {
				choseManIndex = 0;
			}
			$firstMan.css('margin-left', ((Config.width - choseManWidth) + (choseManWidth + choseManLeft) * (choseManIndex - 1) + choseManLeft) * -1 + 'px');
			$choseMans.eq(choseManIndex).addClass('on').siblings('.on').removeClass('on');
		},
		// game
		initGameScene = function(){
			init(initGame,false);
		},
		initGame = function(){
			playBg('game.mp3');

			$gameGuide = $('#gameGuide').removeClass('game-guide-hide');
			$countRed = $('#count .red-count');
			$clock = $('#count .clock');

			curBombNum = 0;
			manLeft = 0;
			// isMove = false;
			redCount = 0;
			curTime = 0;
			dx = 0;
			timeDuration = 200;
			curSecound = 0;
			isGame = false;
			$clock.html(Config.game.time + 's');
			$countRed.html(redCount);

			// man
			initMan();

			document.addEventListener("visibilitychange", function() {
				visibilityChange();
			});
			document.addEventListener("webkitvisibilitychange", function() {
				visibilityChange();
			});

			$('#result').on('touchend', '.result-btn', function() {
				$('#result').addClass('result-open');
				playAudio('result.mp3');
			}).on('touchend', '.again-btn', function() {
				window.location.href = 'index.shtml?a=' + isAudio;
			}).on('touchend', '.rank-btn', function() {
				// show rank
				popShow('#rank');
			}).on('touchend', '.share-btn', function() {
				// show rank
				popShow('#shareLayer');
			});
			$('#shareLayer').on('touchend',function(){
				$(this).removeClass('pop-show');
			});

			$('#rank .address-btn').on('touchend', function() {
				popShow('#addressPop');
			});

			// 提交地址表单
			$('#addressPop .submit-address').on('touchend', function() {
				// 隐藏pop
				popHide('#addressPop');
			});

			//pop hide
			$('.pop:not(.rank)').on('touchend', function(e) {
				console.log(e.target);
				if ($(e.target).hasClass('pop')) {
					popHide($(this));
				}
			});
			$('#rank').on('touchend', function(e) {
				console.log(e.target);
				var $this = $(e.target);
				if (!($this.hasClass('rank-tbl') || $this.closest('.rank-tbl').size())) {
					popHide($(this));
				}
			});
		},
		initMan = function() {
			manKind = GetQueryString('i') || 0;
			$man = $('#main .cur-scene').find('.man-move');
			$man.html('<div class="man ' + Config.game.man[manKind] + '"><div class="body"></div></div>');
			manWidth = $man.width();
			manHeight = $man.height();
			manTop = $man.offset().top;
			touch.on($man, 'touchstart', function(ev) {
				ev.preventDefault();
				if(!isGame){
					// red bag
					initRedBag();
					if (self.timer) {
						clearInterval(self.timer);
						self.timer = null;
					}
					self.timer = setInterval(timeout, timeDuration);
					isGame = true;
				}
			});
			touch.on($man, 'drag', function(ev) {
				if ($gameGuide) {
					$gameGuide.addClass('game-guide-hide');
					$gameGuide = null;
				}
				if($man){
					dx = dx || 0;
					manLeft = dx + ev.x;
					if(manLeft < - manWidth/2){
						manLeft = - manWidth/2;
					}else if(manLeft >= Config.width - manWidth/2){
						manLeft = Config.width - manWidth/2;
					}
					$man[0].style.webkitTransform = "translate3d(" + manLeft + "px,0,0)";
				}
			});
			touch.on($man, 'dragend', function(ev) {
				if($man){
					dx += ev.x;
					if(dx <  - manWidth/2){
						dx = - manWidth/2;
					}else if(dx >= Config.width - manWidth/2){
						dx = Config.width - manWidth/2;
					}
				}
			});
		},
		initRedBag = function() {
			$redBag = $('#redBag');
			if (Config.game.redBag[0].width < 0) {
				for (var i = 0, len = Config.game.redBag.length; i < len; i++) {
					$redBag.html('<li class="' + Config.game.redBag[i].cls + '"></li>');
					Config.game.redBag[i].width = $redBag.find('li').width();
					Config.game.redBag[i].height = $redBag.find('li').height();
				}
			}

			$redBag.children('li').remove();
			$redBag.on('animationiteration webkitAnimationIteration', 'li', function(e) {
				var left = setRedBagLeft();
				$(e.target).css('left', left)[0].dataset.left = left;
			}).on('animationend webkitAnimationEnd', 'li', function(e) {
				console.log('animationend');
				$(e.target).remove();
			});
			redBagChild = $redBag[0].childNodes;
			randomRedBag();
		},
		visibilityChange = function() {
			if (document.hidden) {
				if (self.timer) {
					clearInterval(self.timer);
					self.timer = null;
				}
			} else {
				if (!self.timer) {
					self.timer = setInterval(timeout, timeDuration);
				}
			}
		},
		timeout = function() {
			if(!self.timer){return;}
			if (curTime % (1000 / timeDuration) == 0) {
				curSecound++;
			}
			curTime++;
			$clock.html((Config.game.time - curSecound) + 's');
			if (Config.game.time <= curSecound) {
				console.log('timeend');
				gameEnd();
				manGameEnd();
				showResult();
				return;
			}

			hitCheck();
			randomRedBag();
		},
		hitCheck = function() {
			if(!redBagChild){
				return;
			}
			for (var i = 0, len = redBagChild.length; i < len; i++) {
				if (!redBagChild[i]) {
					continue;
				}
				var k = parseInt(redBagChild[i].dataset.kind);
				var redBagLeft = parseInt(redBagChild[i].dataset.left);
				var redBagWidth = Config.game.redBag[k].width;
				var redBagHeight = Config.game.redBag[k].height;
				var redBagTop = $(redBagChild[i]).offset().top;
				var duration = 50;
				if (redBagTop + redBagHeight < manTop || redBagTop > manTop+ manHeight) {
					continue;
				};

				if (((redBagLeft + redBagWidth) > (manLeft + duration)) && (redBagLeft < (manLeft + manWidth + duration))) {
					console.log('hit');
					var money = Config.game.redBag[k].money;
					if (money >= 0) {
						redCount += money;
						$man.append('<span class="man-txt"> +' + money + '</span>');
					} else {
						// hit bomb
						console.log('bomb');
						playAudio('bomb.mp3');
						if ($man) {
							$man.addClass('man-bomb');
						}

						$man.on('animationend webkitAnimationEnd','.body',function(){
							setTimeout(function() {
								manGameEnd();
								showResult();
							}, 1000);
						}).on('animationend webkitAnimationEnd','.man-txt',function(){
							$(this).remove();
							curBombNum--;
							if(curBombNum<=0){curBombNum=0;}
						})
						gameEnd();
					}
					$countRed.html(redCount);
					if(redBagChild&& redBagChild[i])
						$(redBagChild[i]).remove();
					break;
				}
			}
		},
		manGameEnd = function() {
			if ($man) {
				$man.removeClass('man-bomb').addClass('game-end');
			}
			$man = null;
		},
		showResult = function() {
			// result
			var htm = '';
			var countStr = redCount.toString().split('');
			for (var i = 0; i < countStr.length; i++) {
				htm += '<i class="rn-' + countStr[i] + '"></i>';
			}
			$('#result').removeClass('hide').find('.rn-innver').html(htm);
			$('#count').addClass('game-end');
		},
		gameEnd = function() {
			if (self.timer) {
				clearInterval(self.timer);
				self.timer = null;
			}
			$redBag.children('li').remove();
			$redBag.off('webkitAnimationIteration animationiteration webkitTransitionEnd transitionend', 'li');
			$redBag = null;
			redBagChild = null;
			$('#manDisable').removeClass('hide');
		},
		randomRedBag = function() {
			if (!self.timer || curTime % 3 > 0 || !redBagChild || redBagChild.length > 5) { //间隔 或者总数超过n+1
				return;
			}
			// console.log('red',redBagChild.length)
			var count = Math.ceil(Math.random() * 2); //出现1-2红包
			var game = Config.game;
			var randomRatio, curRedBag, ratio, htm = '';
			var bombKey = game.redBag.length -1;
			for (var i = 0; i < count; i++) {
				randomRatio = Math.ceil(Math.random() * Config.game.baseRatio);

				ratio = 0;
				for (var k in game.redBag) {
					if (randomRatio <= (game.redBag[k].ratio[parseInt(manKind)] + ratio) * game.baseRatio) {
						console.log(k,curBombNum);
						if(k==bombKey){
							if(curBombNum > game.redBag[bombKey].maxNum){
								console.log('continue')
								i--;
								continue;
							}else{
								curBombNum ++ ;
							}
						}
						var left = setRedBagLeft();
						// var speed = Math.ceil(1 + Math.random() * 3);
						var speed = game.redBag[k].speed;
						var delay = Math.ceil(Math.random() * 4);
						htm += '<li data-kind="' + k + '" data-left="' + left + '" style="left:' + left + 'px;" class="drop red-bag-' + speed + ' red-bag-delay-' + delay +' ' + game.redBag[k].cls + '">' + (game.redBag[k].money > 0 ? game.redBag[k].money : '') + '</li>';
						break;
					}
					ratio += game.redBag[k].ratio[parseInt(manKind)];
				}
			}
			$redBag.append($(htm));
			console.log($(htm))
		},
		setRedBagLeft = function() {
			return Math.ceil(Config.duration + Math.random() * (Config.width - Config.duration * 2));
		},
		// common
		setAudio = function(){
			isAudio = parseInt(GetQueryString('a')|| '1') ;
			$audioBtn = $('#audioBtn');
			browser = checkMobile();
			$audioBtn.on('touchend',function(){
				isAudio = isAudio==1 ? 0 : 1;
				if(!isAudio){
					bg.pause();
					for(var k in audio){
						audio[k].pause();
					}
					$(this).addClass('audio-pause');
				}else{
					playBg();
					$(this).removeClass('audio-pause');
				}
			})
			if(!isAudio){
				$audioBtn.addClass('audio-pause');
			}
		},
		playAudio = function(key){
			if(browser.android || !isAudio){//安卓单音频流 不播放特效音
				return;
			}
			audio[key].play();
		},
		playBg = function(url){
			if(!self.bg){
				self.bg = new Audio(Config.audioPath + url);
				self.bg.loop = true;
			}
			if(!isAudio){
				return;
			}
			self.bg.play();
		},
		popShow = function(pop) {
			$(pop).addClass('pop-show');
		},
		popHide = function(pop) {
			if (typeof pop == 'string') {
				$(pop).removeClass('pop-show');
				return;
			}
			pop.removeClass('pop-show');
		},
		init = function(fn,isShowLoad){
			isShowLoad = isShowLoad || true;
			var initFn = fn || function(){};
			setAudio();
			var loadPreload = new preload();
			loadPreload.init([
				['img', 'load.png']
			], function() {
				if(isShowLoad){
					$('#load').removeClass('hide');
				}
				var p = new preload();
				p.init(Config.preload, function() {
					$loadImg = null;
					$loadTxt = null;
					$('#load').addClass('hide');
					$('#main').removeClass('hide');
					if(!isShowLoad){
						$('#main').removeClass('hide').find('.cur-scene').addClass('fade-in');
					}
					initFn();
				}, function() {
					if (arguments.length < 2) {
						return;
					}
					var curImg = arguments[0];
					var len = arguments[1];
					var progress = Math.ceil((curImg + 1) / len * 100);
					if (progress >= 100) {
						progress = 100;
					}
					var progressStr = progress.toString();
					$loadTxt.html(progress + '%');
					$loadImg.css('height', progress + '%');
				});
			});
		};
	return {
		initPrevScene: initPrevScene,
		initGameScene : initGameScene
	};
})();


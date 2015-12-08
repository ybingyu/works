// 横竖屏检测
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationChange, false);

function orientationChange() {
	if (window.orientation == 90 || window.orientation == -90) {
		//横屏
		$('#originTip').show();
	} else {
		//竖屏
		$('#originTip').hide();
	}
}

// 图片预加载
var imgPreLoad = new ImagesControl(function() {
	orientationChange();
	initPage();
});

var pageSwiper = null;
var gc = null;

function initPage() {
	// swiper
	pageSwiper = new Swiper('.swiper-container', {
		paginationClickable: true,
		mode: 'vertical',
		noSwiping: true,
		onSlideChangeStart: function() {
			$('.animate').removeClass('animate');
			$(pageSwiper.activeSlide()).addClass('animate');
		}
	});

	// 进入第二页
	$('#nextBtn').on('tap', function() {
		pageSwiper.swipeNext();
	});

	// 隐藏规则
	$('#playBtn').on('tap', function() {
		$('#rules').addClass('fadeOut');
		gc = new GameControl();
	})
}

/**
 * control对象
 **/
function GameControl() {
	this.init();
}

/**
 * 游戏初始化
 */
GameControl.prototype.init = function() {
	var _this = this;
	$('#rules').addClass('dn').removeClass('fadeOut');

	$('#tower').attr('src', 'image/ta.png');

	_this.initHammer();
	setTimeout(function() {
		_this.initBlood();
		_this.initTime();
		_this.hammerAnimate();
		_this.initPress();
	}, 500);
}
GameControl.prototype.initHammer = function() {
	var _this = this;
	if(_this.$hammer){return;}
	_this.$hammer = $('#hammer');
	_this.nGameW = $('#game').width();
	_this.nHammerW = _this.$hammer.width();
	_this.nHammerLeft = (_this.nGameW - _this.nHammerW) / 2;
	_this.dirc = 1;
	_this.hammerAnimateTime = null;
	_this.$hammer.css({
		left: this.nHammerLeft
	});
	_this.$hammer.on('animationend', animationEnd);

	_this.$hammer.on('webkitAnimationEnd', animationEnd);

	function animationEnd() {
		var nHammerCenter = _this.nHammerLeft + _this.nHammerW / 2;
		var range = 10;
		//是否击中范围
		if (nHammerCenter > (_this.nGameW / 2 - range) && nHammerCenter < (_this.nGameW / 2 + range)) {
			console.log('hit');
			_this.bloodCut();
		}
		_this.resetHammer();
		setTimeout(function() {
			_this.hammerAnimate();
		}, 500); //复位
	}
}
GameControl.prototype.resetHammer = function() {
		this.dirc = 1;
		this.nHammerLeft = (this.nGameW - this.nHammerW) / 2;
		this.$hammer.css({
			left: this.nHammerLeft
		});
	}
	// 锤子左右
GameControl.prototype.hammerAnimate = function() {
		var _this = this;
		if (_this.curBlood <= 0 || _this.curTime <= 0) {
			return;
		}

		if (!_this.hammerAnimateTime) {
			_this.$hammer.removeClass('hammer-out');
			_this.hammerAnimateTime = setInterval(function() {
				var speed = Math.ceil(Math.random() * 2);
				if ((_this.nHammerLeft + _this.nHammerW) >= _this.nGameW) {
					_this.dirc = -1;
				} else if (_this.nHammerLeft <= -10) {
					_this.dirc = 1;
				}
				_this.nHammerLeft += speed * _this.dirc;
				_this.$hammer.css({
					left: _this.nHammerLeft
				});
			}, 2);
		}
	}
	// 停止锤子动画
GameControl.prototype.stopHammerAnimate = function() {
		var _this = this;
		if (_this.hammerAnimateTime) {
			clearInterval(_this.hammerAnimateTime);
			_this.hammerAnimateTime = null;
		}
	}
	// 发射锤子
GameControl.prototype.hammerOut = function() {
	this.stopHammerAnimate();

	this.$hammer.addClass('hammer-out');
}

// 按钮
GameControl.prototype.initPress = function() {
	var _this = this;
	_this.qFlag = false;
	if(!_this.$q){
		_this.$q = $('#pressQ');
	}
	_this.$q.on('tap', function() {
		if (_this.qFlag) {
			return;
		}
		_this.qFlag = true;
		_this.$q.toggleClass('pressed');

		_this.hammerOut();
	})
	$('#pressW').on('tap', function() {
		if (!_this.qFlag) {
			return;
		}
		_this.qFlag = false;
		_this.$q.toggleClass('pressed');
	})
}

GameControl.prototype.resetPress = function() {
	$('#pressW').off('tap').removeClass('pressed');
	$('#pressQ').off('tap').removeClass('pressed');
}
GameControl.prototype.initBlood = function() {
	if(!this.$blood){this.$blood = $('#blood');}
	this.curBlood = 1; //血量
	this.setBlood();
}
GameControl.prototype.setBlood = function() {
	var html = '';
	for (var i = 0; i < this.curBlood; i++) {
		html += '<li></li>';
	}
	this.$blood.html(html);
}

// blood
GameControl.prototype.bloodCut = function() {
		this.curBlood--;
		if (this.curBlood <= 0) {
			this.gameWin();
		}

		this.setBlood();
	}
	// time
GameControl.prototype.initTime = function() {
	if(!this.$time){this.$time = $('#time');}
	this.clearTime();
	this.curTime = 20; //时间
	this.$time.html(this.curTime + '”');
	var _this = this;
	this.curTimeTimer = setInterval(function() {
		_this.$time.html(--_this.curTime + '”');
		if (!_this.curTime) {
			if (_this.curBlood <= 0) {
				_this.gameWin();
			} else {
				_this.gameLose();
			}
			return;
		}
	}, 1000);
}
GameControl.prototype.clearTime = function() {
	if (!this.curTime) {
		clearInterval(this.curTimeTimer);
		this.curTimeTimer = null;
	}
}
GameControl.prototype.gameWin = function() {
	console.log('game win');

	$('#tower').attr('src', 'image/down.gif');
	setTimeout(function() {
		$('#tower').attr('src', 'image/ta.png');
		$('#lotteryPop').removeClass('dn');
		$('#lotteryPop a').on('tap', function() {
			// 开始抽奖！
			$('#lotteryPop').addClass('dn');
		})
	}, 1300);
	this.gameEnd();
}
GameControl.prototype.gameLose = function() {
	console.log('game lose');
	this.gameEnd();
}
GameControl.prototype.gameEnd = function() {
	this.stopHammerAnimate();
	this.clearTime();
	this.resetPress();
}




$('#test').on('tap',function(){
	gc.init();
})
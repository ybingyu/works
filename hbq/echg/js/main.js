/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-10-27 17:11
*/ 
// 横竖屏检测
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', orientationChange, false);
function orientationChange() {
    if (window.orientation == 90 || window.orientation == -90) {
        //横屏
        $('originTip').classList.remove('hide');
    } else {
        //竖屏
        $('originTip').classList.add('hide');
    }
}
orientationChange();

// a:active效果
document.body.addEventListener('touchstart', function() {});

document.ontouchmove = function(event){
    event.preventDefault();
};
document.ontouchstart = function(event){
    event.preventDefault();
};

// class control
function hide(dom){
	if(!dom){
		return;
	}
	addClass(dom,'hide');
}
function show(dom){
	if(!dom){
		return;
	}
	removeClass(dom,'hide');
}
function addClass(dom,cls){
	if(!dom){return;}
	dom.classList.add(cls);
}
function removeClass(dom,cls){
	if(!dom){return;}
	dom.classList.remove(cls);
}
function $(id){
	return document.getElementById(id);
}

IMGPATH = 'http://7xnz8p.com1.z0.glb.clouddn.com/echg/'; //预加载的图片路径前缀
PRELOADIMGS = [
	'clock-h.png',
	'clock-m.png',
	'clock.png',
	'dl.png',
	'again.png',
	'again.png',
	'arrow.png',
	'blood-sd.png',
	'blood-sl.png',
	'head.png',
	'man-nrt.png',
	'man-sd.png',
	'man-sw-b.png',
	'man-sw-hurt.png',
	'man-sw-t.png',
	'man-yj-1.png',
	'man-yj-2.png',
	'man-yj-word.png',
	'music.png',
	'music-off.png',
	'number.png',
	'road.png',
	'sd.png',
	'share.png',
	'page-0.jpg',
	'page-1.jpg',
	'page-2.jpg',
	'page-3.jpg',
	'page-4.jpg',
	'page-5.jpg',
	'page-6.jpg',
	'page-7.jpg',
	'share-layer.png',
	'sl.png',
	'sw.png',
	'title.png',
	'txt-bg.png',
	'txt-bg-sd.png',
	'txt-bg-sl.png',
	'txt-bg-sm.png',
	'txt-bg-sw.png',
	'txt-bg-yj.png',
	'txt-bg-zs.png',
	'verse-1.png',
	'verse-2.png',
	'verse-3.png',
	'verse-4.png',
	'verse-5.png',
	'verse-6.png',
	'verse-7.png',
	'verse-8.png',
	'woman.png',
	'yj.png',
	'zdl.png',
	'zs.png',
	'zs-arrow.png',
	'zs-blood.png',
	'zs-horse.png',
	'zs-man.png'
];

var echg = {};
echg.init = function(){
	var self = this;
	new ImagesControl(['load-bg.jpg','progress.png'],function(){
		self.domLoad = $('load');
		self.domLoadTxt = $('progressTxt');
		self.domLoadProgress = $('progressBar');
		show(self.domLoad);
		var imgPreLoad = new ImagesControl(PRELOADIMGS,
			function() {
				self.initData();
				self.domLoadTxt = null;
				self.domLoadProgress = null;
				self.domLoad = null;
			},
			function(){
				if(arguments.length < 2 ){
					return;
				}
				var curImg = arguments[0];
				var len = arguments[1];
				var progress = Math.ceil(curImg/len*100);
				if(progress>=100){
					progress = 100;
				}
				self.domLoadTxt.innerHTML = progress;
				self.domLoadProgress.style.cssText = 'width:' + progress + '%';
			});
		
		// 请在这里请求数据
		self.userData = [
			[2014,8,20,21],//第一次登录[年,月,日,时]
			[10680,80.1],//[综合战斗力,打败全国xx%玩家,
			[54],//综合胜率
			[860,75],//[杀敌数,占整个二测人头数xx%]
			[624,18298],//[死亡次数,死亡排名]
			[624],//[被救援次数]
			[132,99.1]//[斩杀敌将,占斩杀人头的xx%]
		];
	});
};

echg.initData = function(){
	this.initdomDataHtml();
	this.initPage();
};

echg.initdomDataHtml = function(){
	if(!this.userData){
		return;
	}

	// page 1: 第一次登录
	// this.domDataHtml($('numberYear'),this.userData[0][0],'年');
	this.domDataHtml($('numberDate'),[this.userData[0][1],this.userData[0][2],this.userData[0][3]],['月','日','时',]);
	// page 2:综合战斗力
	this.domDataHtml($('zhzdl'),this.userData[1][0]);
	this.domDataHtml($('smZhzdl'),this.userData[1][1],'%');
	// page 3:综合胜率
	this.domDataHtml($('sl'),this.userData[2][0],'%');
	// page 4:杀敌
	this.domDataHtml($('sd'),this.userData[3][0],'人');
	this.domDataHtml($('smSd'),this.userData[3][1],'%');
	// page 5:死亡
	this.domDataHtml($('sw'),this.userData[4][0],'次');
	this.domDataHtml($('smSw'),this.userData[4][1]);
	// page 6:救援
	this.domDataHtml($('jy'),this.userData[5][0],'次');
	// page 7:斩杀敌将
	this.domDataHtml($('zs'),this.userData[6][0],'名');
	this.domDataHtml($('smZs'),this.userData[6][1],'%');
};

echg.domDataHtml = function(o,num,unit){
	var delay = o.getAttribute('swiper-animate-delay');
	var numA = (typeof num == 'object') ? num : [num];
	var unitA = (typeof unit == 'object') ? unit : [unit];
	var htm = '';

	for(var i = 0,len = numA.length; i<len;i++){
		htm += this.number(numA[i],unitA[i],delay);
	}
	o.innerHTML = htm;
};

echg.number = function(num,unit,delay){
	var numStr = num.toString();
	var htm = '';
	unit = unit || '';
	for(var i = 0, len = numStr.length;i < len ;i ++){
		if(numStr[i] == '.'){
			htm += numStr[i];
			continue;
		}
		htm += '<i class="ani" swiper-animate-effect="bdn-' + numStr[i] + '" ';
		if(delay){
			htm += 'swiper-animate-delay="' + delay + '"';
		}
		htm += '></i>';
	}
	htm += unit;
	return htm;
};
echg.initPage = function(){
	var self = this;

	hide(self.domLoad);
	show($('main'));

	orientationChange();

	// share layer
	self.domShareLayer = $('shareLayer');
	self.domShareLayer.addEventListener('touchend',function(e){
		hide(e.target);
	});

	self.domArrow = $('arrow');
	// swiper
	self.swiper = new Swiper ('.swiper-container', {
		pagination: '.swiper-pagination',
		direction : 'vertical',
		watchSlidesProgress: true,
		mousewheelControl : true,
		longSwipesRatio:0.1,
		onTransitionEnd : function(swiper){
			if(swiper.activeIndex == 8){
				hide(self.domArrow);
			}else{
				show(self.domArrow);
			}
		},
		onInit: function(swiper){
			swiperAnimateCache(swiper); //隐藏动画元素
			swiperAnimate(swiper); //初始化完成开始动画
		},
	  	onSlideChangeEnd: function(swiper){
	    		swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
	  	}
	});

	// page-8 btns
	$('againBtn').addEventListener('touchend',function(){
		self.swiper.slideTo(1);
	});
	$('shareBtn').addEventListener('touchend',function(){
		show(self.domShareLayer);
	});

	// music btn
	self.domMusic = $('musicBtn');
	self.audio = $('audio');
	self.audio.play();
	self.domMusic.addEventListener('touchend',function(e){
		if(self.audio.paused){
			self.audio.play();
			removeClass(self.domMusic,'music-off');
		}else{
			self.audio.pause();
			addClass(self.domMusic,'music-off');
		}
	});

	// arrow
	self.domArrow.addEventListener('touchend',function(){
		self.swiper.slideNext();
	});

	// pop close
	document.querySelector('#pop .pop-close').addEventListener('touchend',function(){
		hide($('pop'));
	});
};


echg.init();


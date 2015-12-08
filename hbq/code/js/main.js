/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-09-16 14:54
*/
// 横竖屏检测
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', orientationChange, false);
function orientationChange() {
    if (window.orientation == 90 || window.orientation == -90) {
        //横屏
        document.getElementById('originTip').classList.remove('hide');
    } else {
        //竖屏
        document.getElementById('originTip').classList.add('hide');
    }
}
//判断手机系统
var browser={
    versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {         //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
};

document.ontouchmove = function(event){
    event.preventDefault();
};
document.ontouchstart = function(event){
    event.preventDefault();
};

IMGPATH = 'http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/image/'; //预加载的图片路径前缀
PRELOADIMGS = [
	[
		'solider.png',
	],
	[
		'page-03.jpg',
		'dec-border.png',
		'hand.png',
		'dec-square.png',
		'lh1.jpg',
		'lh2.jpg',
		'lh3.jpg',
		'lh-all.jpg',
		'man.png',
		'page-05.jpg',
		'zm.png',
	]
];

var hbq = {};
hbq.init = function(){
	this.imgPreLoad();
	this.isInited = [];
	this.sound = {};
	this.sound.ring = new Audio5js({
		ready: function () {
        		this.load('http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/audio/01-ring.mp3');
      	}
    	});
	this.sound.ride = new Audio5js({
		ready: function () {
        		this.load('http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/audio/02-ride.mp3');
      	}
    	});
	this.sound.war = new Audio5js({
		ready: function () {
        		this.load('http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/audio/03-war.mp3');
      	}
    	});
	this.sound.hit = new Audio5js({
		ready: function () {
        		this.load('http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/audio/04-hit.mp3');
      	}
    	});
	this.sound.broke = new Audio5js({
		ready: function () {
        		this.load('http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/audio/05-broke.mp3');
      	}
    	});
	this.sound.zm = new Audio5js({
		ready: function () {
        		this.load('http://7xnz8p.com1.z0.glb.clouddn.com/hbq/code/audio/06-zm.mp3');
      	}
    	});
};

/**
 * 图片预加载
 * @param  {array} imgArray 图片名称数组
 */
hbq.imgPreLoad = function() {
	var imgPreLoad = new ImagesControl(PRELOADIMGS[0],function() {
		orientationChange();
		document.getElementById('load').classList.add('hide');
		hbq.initPage(1);
	});
};

/**
 * 初始化页面
 * @param  {num} i index
 * {bool} show 是否先显示 true 先显示;先显示等前一屏动画结束后 再隐藏前一屏
 */
hbq.initPage = function(i,show,aniEle){
	this.prevCurPage = this.curPage;
	if(this.prevCurPage && !show){
		this.prevCurPage.classList.remove('curpage');
	}
	this.curPage = document.getElementById('page' + i);
	this.curPage.classList.remove('page-out-ani');
	this.curPage.classList.remove('page-in-ani');
	this.curPage.classList.add('curpage');
	if(this.prevCurPage && show && aniEle){
		this.animationEnd(aniEle, function(){
			hbq.prevCurPage.classList.remove('curpage');
		});
		this.transitionEnd(aniEle, function(){
			hbq.prevCurPage.classList.remove('curpage');
		});
	}
	setTimeout(function(){
		hbq.curPage.classList.add('page-in-ani');
	},1000);

	switch(i){
		case 1:
			this.initPagePhone(i-1);
			new ImagesControl(PRELOADIMGS[1]);
			break;
		case 2:
			this.initPagePinch(i-1);
			break;
		case 3:
			this.initPageWar(i-1);
			break;
		case 4:
			this.initPageHit(i-1);
			break;
		case 5:
			this.initPageZm(i-1);
			break;
	}

};

/*page 01*/
MAXPHONE = 462;
MINPHONE = 10;
hbq.initPagePhone = function(index){
	this.startLoop(this.sound.ring);
	if(this.isInited[index]){
		return;
	}

	this.phoneIcon = document.querySelector('#phone .jt-icon');
	this.phoneBg = document.querySelector('#phone .jt-bg');
	this.phoneWord = document.querySelector('#phone .jt-word');

	var phonePanRight = new Hammer(this.phoneIcon);
	phonePanRight.on('panright', function (e) {
          hbq.phoneMove(e);
     });
	var phonePanLeft = new Hammer(this.phoneIcon);
	phonePanLeft.on('panleft', function (e) {
          hbq.phoneMove(e);
     });
	var phonePanEnd = new Hammer(this.phoneIcon);
	phonePanEnd.on('panend', function (e) {
          if(hbq.phoneIconLeft < MAXPHONE){
          		hbq.phoneIconLeft = MINPHONE;
          		hbq.phoneIcon.style.cssText = 'left:' + hbq.phoneIconLeft + 'px;transition: all 0.5s;-webkit-transition: all 0.5s;';
          		hbq.phoneBg.style.cssText = 'width:100%;transition: all 0.5s;-webkit-transition: all 0.5s;';
          		setTimeout(function(){
          			hbq.phoneWord.classList.remove('hide');
          		},0.5);
          }else{
          		hbq.initPage(2);
          		hbq.stopLoop(hbq.sound.ring);
          		hbq.phoneIconLeft = MINPHONE;
          		hbq.phoneBg.style.cssText = 'width:100%;';
          		hbq.phoneIcon.style.cssText = 'left:' + hbq.phoneIconLeft + 'px;';
          		hbq.phoneWord.classList.remove('hide');
          }
     });
	this.isInited[index] = true;
};

hbq.phoneMove = function(e){
     hbq.phoneIconLeft = MINPHONE + e.deltaX + e.center.x;
     hbq.phoneIconLeft = hbq.phoneIconLeft<=MINPHONE ? MINPHONE:hbq.phoneIconLeft;
     hbq.phoneIconLeft = hbq.phoneIconLeft>=MAXPHONE ? MAXPHONE:hbq.phoneIconLeft;
     hbq.phoneIcon.style.cssText = 'left:' + hbq.phoneIconLeft + 'px;transition: none;-webkit-transition: none;';
     hbq.phoneBg.style.cssText = 'width:' + (624 + MINPHONE - hbq.phoneIconLeft) + 'px;transition: none;-webkit-transition: none;';
     hbq.phoneWord.classList.add('hide');
};

/*page 02*/
hbq.initPagePinch = function(index){
	// using for pc test
	// setTimeout(function(){
	// 	hbq.pinchOut();
	// },1000);

	this.pinchout = false;
	if(!browser.versions.android){// android 不兼容多音频 只播骑马声音
		this.startLoop(this.sound.war);
		this.sound.war.volume(1);
	}

	if(this.isInited[index]){
		return;
	}
	var pinch = new Hammer(this.curPage);
	pinch.add(new Hammer.Pinch());
	pinch.on('pinchout', function (e) {
		hbq.pinchOut();
     });
	this.isInited[index] = true;
};
hbq.pinchOut = function(){
	if(!hbq.pinchout){
		hbq.curPage.classList.add('page-out-ani');
		hbq.initPage(3,true,document.querySelector('.page-2-b'));
		hbq.pinchout = true;
	}
};

/*page 03*/
hbq.initPageWar = function(index){
	this.sound.ride.play();
	if(this.isInited[index]){
		return;
	}
	this.animationEnd(document.getElementById('solider'),function(){
		hbq.initPage(4);
		if(!browser.versions.android){
			hbq.stopLoop(hbq.sound.war);
		}
	});
	this.isInited[index] = true;
};

/*page 4*/
hbq.initPageHit = function(index){
	this.sound.war.volume(0.5);
	setTimeout(function(){
		hbq.sound.hit.play();
	},3000);

	if(this.isInited[index]){
		return;
	}
	this.animationEnd(document.querySelector('#sp .lh-6'),function(){
		hbq.curPage.addEventListener('touchend',function(){
			hbq.curPage.classList.add('page-shock');
			hbq.curPage.removeEventListener('touchend');
			hbq.sound.broke.play();
		});
	});

	this.animationEnd(document.getElementById('lhAll'),function(){
		hbq.curPage.classList.remove('page-shock');
		hbq.initPage(5);
	});
	this.isInited[index] = true;
};

/*page 5*/
hbq.initPageZm = function(index){
	this.startLoop(this.sound.zm);
	this.sound.zm.volume(0.3);
	if(this.isInited[index]){
		return;
	}
	// share layer
	var shareBtn = document.getElementById('shareBtn');
	shareBtn.addEventListener('touchend',function(){
		var shareLayer = document.getElementById('share');
		shareLayer.classList.remove('hide');
	});
	var shareLayer = document.getElementById('share');
	shareLayer.addEventListener('touchend',function(e){
		e.target.classList.add('hide');
	});
	// 重新再战
	var againBtn = document.getElementById('againBtn');
	againBtn.addEventListener('touchend',function(){
		hbq.initPage(1);
		hbq.stopLoop(hbq.sound.zm);
	});
	// 弹窗 pop close
	document.querySelector('.pop').addEventListener('touchend',function(e){
		e.target.classList.add('hide');
	});
	this.isInited[index] = true;
};
hbq.pad = function(num,n){
	var len = num.toString().length;
	while(len < n){
		num = '0'+num;
		len ++;
	}
	return num;
};

hbq.animationEnd = function(o,fn){
	o.addEventListener('webkitAnimationEnd', fn);
	o.addEventListener('animationend', fn);
};
hbq.transitionEnd = function(o,fn){
	o.addEventListener('webkitTransitionEnd', fn);
	o.addEventListener('transitionend', fn);
};

hbq.loopCallBack = function(){
	this.play();
};

hbq.startLoop = function(o){
	o.seek(0);
	o.play();
	o.on('ended', hbq.loopCallBack, o);
};
hbq.stopLoop = function(sound){
	sound.off('ended',hbq.loopCallBack);
	sound.playPause();
};



hbq.init();

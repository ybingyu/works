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

// a:active效果
document.body.addEventListener('touchstart', function() {});
document.ontouchmove = function(event){
    event.preventDefault();
};

IMGPATH = '../image/'; //预加载的图片路径前缀
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
	this.sound.ring = new Howl({
  		urls: ['../audio/01-ring.mp3'],
  		loop : true
	});
	this.sound.ride = new Howl({
  		urls: ['../audio/02-ride.mp3']
	});
	this.sound.war = new Howl({
  		urls: ['../audio/03-war.mp3'],
  		loop : true
	});
	this.sound.hit = new Howl({
  		urls: ['../audio/04-hit.mp3']
	});
	this.sound.broke = new Howl({
  		urls: ['../audio/05-broke.mp3']
	});
	this.sound.zm = new Howl({
  		urls: ['../audio/06-zm.mp3'],
  		loop : true,
  		volume : 0.8
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
	this.sound.ring.play();
	if(this.isInited[index]){
		return;
	}

	this.phoneIcon = document.querySelector('#phone .jt-icon');
	this.phoneBg = document.querySelector('#phone .jt-bg');
	this.phoneWord = document.querySelector('#phone .jt-word');

	var phonePanStart = new Hammer(this.phoneIcon);
	phonePanStart.on('panstart', function (e) {
          Howler.iOSAutoEnable = false;
     });
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
          		hbq.sound.ring.stop();
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

	if(this.isInited[index]){
		return;
	}
	var pinch = new Hammer(this.curPage);
	pinch.add(new Hammer.Pinch());
	pinch.on('pinchout', function (e) {
		if(!hbq.pinchout){
			hbq.pinchOut();
			hbq.pinchout = true;
		}
     });
	this.isInited[index] = true;
};
hbq.pinchOut = function(){
	hbq.curPage.classList.add('page-out-ani');
	hbq.initPage(3,true,document.querySelector('.page-2-b'));
	
};

/*page 03*/
hbq.initPageWar = function(index){
	this.sound.war.play();
	hbq.sound.ride.play();
	if(this.isInited[index]){
		return;
	}
	this.animationEnd(document.getElementById('solider'),function(){
		hbq.initPage(4);
		hbq.sound.war.stop();
	});
	this.isInited[index] = true;
};

/*page 4*/
hbq.initPageHit = function(index){
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
	this.sound.zm.play();
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
		hbq.sound.zm.stop();
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

hbq.init();
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

// a:active效果
// document.body.addEventListener('touchstart', function() {});

// document.ontouchmove = function(event){
//      event.preventDefault();
// };
// document.ontouchstart = function(event){
//      event.preventDefault();
// };
function hide(dom){
	if(!dom){
		return;
	}
	dom.addClass('hide');
}
function show(dom){
	if(!dom){
		return;
	}
	dom.removeClass('hide');
}

// img
IMGPATH = 'http://7xnz8p.com1.z0.glb.clouddn.com/hbq%2Fyuandan%2Fimage%2F'; //预加载的图片路径前缀
PRELOADIMGS = [
	'event-sf.png',
	'man-sf.png',
	'foot.png',
	'han.png',
	'box.png',
	'bg.jpg',
	'word-sf.png',
	'word-lg.png',
	'event-lg.png',
	'man-lg.png',
	'eyes-01.png',
	'eyes-02.png',
	'mao.png',
	'word-ec.png',
	'event-ec.png',
	'man-ec.png',
	'xiaba.png',
	'meimao.png',
	'hand.png',
	'word-sj.png',
	'event-sj.png',
	'gaizi.png',
	'man-sj.png',
	'head.png',
	'gift.png'
];
// audio
AUDIOPATH =  'http://7xnz8p.com1.z0.glb.clouddn.com/hbq%2Fyuandan%2Faudio%2F';
AUDIO = [
	['1',1000],
	['2',800],
	['3',20],
	['4',300],
	['5'],
	['sunshangxiang']
];

// new year
var newYear = {};
newYear.init = function(){
	var self = this;
	new ImagesControl(['style_z.png','load-bg.jpg','load-head.png'],function(){
		self.domLoad = $('#load');
		self.domLoadNumber = $('#loadNumber');
		self.domLoadHead = $('#loadHead');
		self.domLoadBar = $('#loadBar');
		show(self.domLoad);
		// audio pre load
		self.initEffectAudio();

		var imgPreLoad = new ImagesControl(PRELOADIMGS,
			function() {
				self.initPage();
				self.domLoadNumber = null;
				self.domLoadHead = null;
				self.domLoadBar = null;
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
				var progressStr = progress.toString();
				var htm ='';
				for(var i = 0,len = progressStr.length; i<len;i++){
					htm += '<i class="load-' + progressStr[i] + '"></i>';
				}
				self.domLoadNumber.html(htm + '<i class="load-p"></i>') ;
				self.domLoadBar.css('width' ,progress + '%');
				self.domLoadHead.css('left' , progress + '%');
			});
	});
};

newYear.initPage = function(){
	var self = this;

	hide(self.domLoad);
	show($('#main'));

	orientationChange();

	self.domArrow = $('#arrow');
	// swiper
	self.swiper = new Swiper ('.swiper-container', {
		pagination: '.swiper-pagination',
		direction : 'vertical',
		watchSlidesProgress: true,
		mousewheelControl : true,
		longSwipesRatio:0.1,
		onTransitionEnd : function(swiper){
			if(swiper.activeIndex == swiper.slides.length-1){
				hide(self.domArrow);
			}else{
				show(self.domArrow);
			}
			newYear.audioPlay(swiper.activeIndex + 1);
		},
		onInit: function(swiper){
			swiperAnimateCache(swiper); //隐藏动画元素
			swiperAnimate(swiper); //初始化完成开始动画
		},
	  	onSlideChangeEnd: function(swiper){
	    		swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
	  	}
	});

	// pop close
	self.$pop = document.querySelectorAll('.pop');
	for(var i = 0,len = self.$pop.length;i <len;i ++){
		self.$pop[i].addEventListener('touchend',function(e){
			e.target.classList.remove('pop-show');
			$('#giftBox').removeClass('gift-open');
			if(!$('#shareLayer').hasClass('share-show') && $(e.target).hasClass('pop')&&!$(e.target).hasClass('pop-show')){
				self.audioPlay(self.swiper.activeIndex + 1);
			}
		})
	}


	// gift box
	$('#giftBtn').on('touchend',function(){
		$('#giftBox').addClass('gift-open');
		// 显示弹窗
		$('#pop').addClass('pop-show');
		self.audioPlay(5);
	});

	// arrow
	self.domArrow.on('touchend',function(){
		self.swiper.slideNext();
	});

	// 香香的声音 点击播放
	$('#popPlayBtn').on('touchend',function(){
		$('#disc').addClass('disc-animate');
		self.audioPlay(AUDIO.length,function(){
			$('#disc').removeClass('disc-animate');
		});

	});
    // 分享提示层
    $('.share-btn').on('touchend',function(){
        $('#shareLayer').addClass('share-show');
    })
    $('#shareLayer').on('touchend',function(e){
        e.target.classList.remove('share-show');
    })

	// self.audioPlay(self.swiper.activeIndex+1);
	// self.swiper.slideTo(1);

        newYear.audioPlay(newYear.swiper.activeIndex + 1);
    var userflag=  2;
    var usertype=  2;
      $('#getmore').on('touchend',function(){


        if(userflag == 2) {

            $('#pop').removeClass('pop-show');
            $('#giftBox').removeClass('gift-open');

            if (usertype == 1)
                $('#popLetter').addClass('pop-show');//新玩家
            if (usertype == 2) {
                $('#popSound').addClass('pop-show');//老玩家
            }
        }
        else {

            $('#pop').removeClass('pop-show');
            $('#giftBox').removeClass('gift-open');
            $('#showlogin').removeClass('hide');
            // $('#showlogin').addClass('dn');

        }

    });

};

newYear.initEffectAudio = function(){
	var self = newYear;
	if(!self.effectAudio){
		self.effectAudio = {};
		self.effectAudio.audio = new Audio();
		self.effectAudio.audiobuffer = [];
		self.initEffectAudioFormat();
		for(var i = 0,len = AUDIO.length; i < len;i++){
			self.effectAudio.audiobuffer[i] = new Audio();
			self.effectAudio.audiobuffer[i].src = AUDIOPATH + AUDIO[i][0] + self.effectAudio.audioFormat;
			self.effectAudio.audiobuffer[i].load();
		}
	}
};
newYear.initEffectAudioFormat = function(){
	var self = newYear;
	if(self.effectAudio.audio.canPlayType){
		var playMsgMpeg = self.effectAudio.audio.canPlayType('audio/mpeg');
		var playMsgOgg = self.effectAudio.audio.canPlayType('audio/ogg; codecs="vorbis"');
		if(playMsgMpeg == 'probably'){
			self.effectAudio.audioFormat = '.mp3';
			return;
		}else if(playMsgOgg == 'probably'){
			self.effectAudio.audioFormat = '.ogg';
			return;
		}else{
			self.effectAudio.audioFormat = '.mp3';
			return;
		}
	}
}
newYear.audioPlay = function(index,fnCallback){
	var self = newYear;
	if( !AUDIO[index-1]){
		return;
	}
	if(self.effectAudio.curIndex == index - 1){
		self.effectAudio.audio.volume = 1;
		self.effectAudio.audio.play();
		return;
	}
	if(self.hasPopShow(index-1)){
		self.audioPause();
		return;
	}
	self.effectAudio.curIndex = index - 1;
	self.audioPause();
	self.effectAudio.audio.src = self.effectAudio.audiobuffer[self.effectAudio.curIndex].src;
	console.log(self.effectAudio.audio.src);
	self.effectAudio.audio.play();
     self.effectAudio.audio.volume = 1;
	self.effectAudio.loopFn = function(){
		if(self.hasPopShow(self.effectAudio.curIndex)){
			self.audioPause();
			return;
		}
		if(self.effectAudio.loopTimer){
			clearTimeout(self.effectAudio.loopTimer);
		}
		self.effectAudio.loopTimer = setTimeout(function(){
			self.effectAudio.audio.play();
			self.effectAudio.audio.volume = 1;
		}, AUDIO[self.effectAudio.curIndex][1]);
	};
	if(!AUDIO[self.effectAudio.curIndex][1]){
		self.effectAudio.loopFn = fnCallback || function(){};
	}
	self.effectAudio.audio.addEventListener('ended',self.effectAudio.loopFn);
};
newYear.audioPause = function(){
	var self = newYear;
	self.effectAudio.audio.removeEventListener('ended',self.effectAudio.loopFn);
	if(self.effectAudio.loopTimer){
		clearTimeout(self.effectAudio.loopTimer);
	}
     self.effectAudio.audio.volume = 0;
};
newYear.hasPopShow = function(index){
	var self = newYear;
	if(index>=4){
		return false;
	}
	for(var i = 0,len = self.$pop.length;i <len;i ++){
		if($(self.$pop[i]).hasClass('pop-show')){
			return true;
		}
	}
};
newYear.init();


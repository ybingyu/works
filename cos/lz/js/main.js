/*
 * Author: bindy Yuan
 * Version: 0.1.0
 * Compile Date: 2016-09-13 10:36
*/
var video = '<iframe frameborder="0" width="525" height="295" src="http://v.qq.com/iframe/player.html?vid=q030759ne4h&tiny=0&auto=0" allowfullscreen></iframe>';
// 1136
var videoMp4 = '<video src="http://zy.down.99.com/gw/cos/2016/video/lz.mp4" poster="image/video-postor.jpg" ></video>';
var audipPath = 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/lz/audio/bg.mp3';
var basePath = 'http://7xnz8p.com1.z0.glb.clouddn.com/cos/lz/image/';
var imgManifest = [
	[
		'bz.png',
		'fang.png',
		'jiu.png',
		'tit.png',
		'yw-l.png',
		'yw-r.png',
		'cover-e.png',
		'cover-q.png',
		'cover-w.png',
		'cover-r.png',
		'qt.png',
		'qt-hua.png',
		'question-bg.png',
		'e.png',
		'e-gray.png',
		'q.png',
		'q-gray.png',
		'w.png',
		'w-gray.png',
		'r.png',
		'r-gray.png',
		'e-light.png',
		'q-light.png',
		'count-1.png',
		'count-2.png',
		'count-3.png',
		'num-1.png',
		'num-2.png',
		'num-3.png',
		'num-4.png',
		'num-di.png',
		'num-ti.png',
		'right.png',
		'tv.png'
	],
	[
		'q1.jpg',
		'a1.jpg',
	],
	[
		'q2.jpg',
		'a2.jpg',
	],
	[
		'q3.jpg',
		'a3.jpg',
	],
	[
		'q4.jpg',
		'a4.jpg',
		'skill-e.jpg',
		'skill-r.jpg',
		'skill-q.jpg',
		'skill-w.jpg',
	],
	[
		'logo.png',
		'again-btn.png',
		'share-btn.png'
	],
];


var lz = (function() {
	var preload,
		$load,
		$loadTxt,
		isLoad = [],
		curLoad = 0,
		curSlideIndex = -1,
		$slides,
		$curSlide,
		$result,
		isLastQuestionResult = false,
		// $curKey,
		grayCount = 0,
		$answer ,
		answerI,
		answerLen,
		audio,
		isSkillShow = [],
		isAgain = false,
		// 1136
		isAudioPlay = false,
		browser = checkMobile();
	var init = function() {
			if (!preload) {
				$load = $('#load');
				$loadTxt = $load.find('.loading-txt');
				preload = new createjs.LoadQueue(false, basePath);
				preload.on("progress", handleProgress);
				preload.on("complete", handleComplete);
				preload.on("fileload", handleFileLoad);
				preload.loadManifest(imgManifest[curLoad]);
			}
			$slides = $('#main .slide');
			$('#main').on('webkitAnimationEnd animationend', '.slide', function() {
				if ($(this).hasClass('fadeOut')) {
					$(this).removeClass('fadeOut cur');
				}
			})
			.on('webkitAnimationEnd animationend','.count i',function(){
				$(this).closest('.cover').removeClass('show');
				$curSlide.find('.question-video').addClass('play');
			})
			.on('webkitAnimationEnd animationend','.question-video',function(){
				if($(this).hasClass('a')){ // 播完答案
					setTimeout(gotoSlide,1000);
					return;
				}
				if(!isLastQuestionResult){ // 播完题目
					setTimeout(function(){
						$curSlide.find('.question-word').addClass('show');
						$curSlide.find('.answer').removeClass('gray');
					},500);
				}else/* if($curKey)*/{ // 播完技巧
					// $curKey.addClass('gray');
					// grayCount ++;
					if(grayCount>=4){
						gotoSlide();
					}
				}
			})
			.on('touchend','.answer a',function(){
				$this = $(this);
				$parent = $this.closest('.answer');
				if(!isLastQuestionResult && ($this.hasClass('gray')||$parent.hasClass('gray'))){
					return;
				}
				var skillIndex = $this.index();
				if(isSkillShow[skillIndex]){
					return;
				}

				if(!isLastQuestionResult){
					$curSlide.find('.question-word').removeClass('show');

					if($this.hasClass('q')){// right
						$result = $curSlide.find('.result-right').addClass('show');
					}else{ // wrong
						$result = $curSlide.find('.result-wrong').addClass('show');
					}
					setTimeout(function(){
						hideResult();
					},2500);
					$result.one('touchend',hideResult);
				}else{ // 最后一题 技能分别播放
					$result.removeClass('show');
					$curSlide.find('.question-video')[0].className = 'question-video skill-' + this.className;
					// $curKey = $(this);
					$(this).addClass('gray').removeClass('light');
					grayCount ++;

					isSkillShow[skillIndex] = true;
				}
				$parent.addClass('gray');

				if(isLastQuestion()){// 答完最后一题
					isLastQuestionResult = true;
					setTimeout(lightInTurn,600);
				}else{
				}
			})
			// 17:00
			/*.on('webkitAnimationEnd animationend','.result .txt',function(){
				setTimeout(lightInTurn,600);
			})*/;
			$('#startBtn').on('webkitAnimationEnd animationend', function() {
				$(this).on('touchend', function() {
					gotoSlide(1);
				});
			})
			$('#againBtn').on('touchend',function(){
				reInit();
				gotoSlide(1);
			});
			// 17:40
			$('#shareBtn').on('touchend',function(){
				$('#shareLayer').addClass('show');
				removeVideo(true);
			});
			$('#moreBtn').on('touchend',function(){
				$('#ewmLayer').addClass('show');
				removeVideo(true);
			});
			// 1136
			$('.cover-layer').on('touchend',function(e){
				if(e.target.tagName.toLowerCase() === 'img'){
					return;
				}
				$(this).removeClass('show');
				addVideo(true);
			});

			bgAudio();
		},
		reInit = function(){
			// 1136
			if(isAudioPlay){
				playAudio();
			}else{
				pauseAudio();
			}

			// 1500
			removeVideo();

			$('#music').removeClass('hide');
			$curSlide.find('.question-video').html('');
			isSkillShow = [];
			isAgain = true;
			isLastQuestionResult = false;
			grayCount = 0;
			$answer = null;
			// $curKey = null;
		},
		bgAudio = function(){
			audio = new Audio(audipPath);
			audio.play();
			audio.loop = true;
			audio.addEventListener('canplay',function(){
				console.log('canplay')
				playAudio();
			})
			// 掌魂音频点击播放
			$(document).one('touchend',function(){
				if(audio.paused){
					playAudio();
				}
			})
			$('#music').on('touchend',function(){
				if(audio.paused){
					playAudio();
				}else{
					pauseAudio();
				}
			});
		},
		// 1136
		playAudio = function(){
			isAudioPlay = true;
			audio.play();
			$('#music').removeClass('stopped');
		},
		pauseAudio = function(){
			isAudioPlay = false;
			audio.pause();
			$('#music').addClass('stopped');
		},
		lightInTurn = function(){
			if(!$answer){
				$answer = $curSlide.find('.answer a');
				answerI = -1;
				answerLen = $answer.length;
			}
			answerI ++;
			$answer.eq(answerI).addClass('light');
			if(answerI >=answerLen -1){
				$answer.eq(answerI).closest('.answer').removeClass('gray');
				return;
			}
			setTimeout(lightInTurn,600);
		},
		hideResult = function(){
			if($result && !isLastQuestionResult){
				$result.removeClass('show');
				$curSlide.find('.question-video').removeClass('play').addClass('a');
			}
		},
		isLastQuestion = function(){
			return curSlideIndex==(imgManifest.length -2);
		},
		handleComplete = function(e) {
			isLoad[curLoad] = true;
			if (curSlideIndex < 0) {
				$loadTxt.html('当前加载进度为 100 %');
				setTimeout(function() {
					$load.addClass('hide opacity');
					$('#main').removeClass('hide');
					// 页面正式逻辑
					gotoSlide(0);
				}, 300);
			}
			if(isLoad[curSlideIndex]){
				if(!$slides.eq(curSlideIndex).hasClass('cur')){
					$load.addClass('hide');
					$slides.eq(curSlideIndex).addClass('cur');
				}
			}
			if (curLoad < imgManifest.length) {
				console.log((curLoad + 1) + ' loaded');
				curLoad++;
				preload.loadManifest(imgManifest[curLoad]);
				$loadTxt.html('当前加载进度为 0 %');
				var $img = $slides.eq(curLoad).find('img');
				for(var i = 0;i<$img.size();i ++){
					var curImg = $img.eq(i)[0];
					var src = curImg.dataset.src;
					if(src){curImg.src = src;}
				}
			}
		},
		handleProgress = function(e) {
			if ($load.hasClass('hide')) {
				return;
			}
			if(curSlideIndex<0){
				$loadTxt.html('当前加载进度为 ' + parseInt(e.loaded * 100) + ' %');
			}else{
				$loadTxt.html('正在加载题目 ' + parseInt(e.loaded * 100) + ' %');
			}
		},
		handleFileLoad = function(e) {
			// load file
		},
		gotoSlide = function(i) {
			if (i == curSlideIndex) {
				return;
			}
			if (i == undefined) {
				i = curSlideIndex + 1;
			}
			if (i >= $slides.length ) {
				return;
			}
			if (curSlideIndex >= 0) {
				$slides.eq(curSlideIndex).addClass('fadeOut');
			}
			curSlideIndex = i;
			$curSlide = $slides.eq(i);

			// 重置页面
			if(isAgain && curSlideIndex && curSlideIndex < $slides.length - 1){
				$curSlide.find('.question-video')[0].className = 'question-video';
				$curSlide.find('.count')[0].className = 'cover count show';
				$curSlide.find('.question-word')[0].className = 'cover question-word';
				$curSlide.find('.result-wrong')[0].className = 'cover result result-wrong';
				$curSlide.find('.result-right')[0].className = 'cover result result-right';
				$curSlide.find('.answer').html('<a href="javascript:;" class="q"></a> <a href="javascript:;" class="w"></a> <a href="javascript:;" class="e"></a> <a href="javascript:;" class="r"></a>')[0].className = 'transparent answer gray';
				if(curSlideIndex == isLastQuestion()){
					$curSlide.find('.question-video .inner').scrollTop(0);
				}
			}

			// 判断资源是否已经加载完毕
			if (!isLoad[curSlideIndex]) {
				$load.removeClass('hide');
			}else{
				$curSlide.addClass('cur');
			}
			if(i==$slides.length -1){// 进入 最后一p 音频停止
				// 17:00
				addVideo();
				// 1136
				audio.pause();
				$('#music').addClass('hide');
			}
		},
		// 17:00
		removeVideo = function(isCheck){
			if(!isCheck){// 不进行判断 一定移除
				$curSlide.find('.question-video').html('');
				return;
			}
			if(curSlideIndex == $slides.length - 1&& browser.android&& browser.weixin){// 安卓微信在最后一屏移除
				$curSlide.find('.question-video').html('');
			}
		},
		addVideo = function(isCheck){
			// if(env == 'app'){
			// 	$curSlide.find('.question-video').html(videoMp4);
			// 	return;
			// }
			if(isCheck && curSlideIndex == $slides.length - 1 && browser.weixin && browser.android){
				$curSlide.find('.question-video').html(video);
				return;
			}else{
				$curSlide.find('.question-video').html(video);
			}
		};
	return {
		init: init
	};
})();
lz.init();

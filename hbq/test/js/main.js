/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-08-14 15:19
*/ 
// 横竖屏检测
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', orientationChange, false);

function orientationChange() {
    if (window.orientation == 90 || window.orientation == -90) {
        //横屏
        $('#originTip').show();
    } else {
        //竖屏
        $('#originTip').hide();
    }
}


var hbqTest = {};
/**
 * 初始化
 */
hbqTest.init = function(){
	var self = this;
	$('#beginBtn').on('touchend',function(){
		self.beginTest();
	});

	// 按指纹3秒
	self.$finger = $('#finger');
	self.$finger.on('touchstart',function(e){
		e.preventDefault();
		self.fingerTimer = setTimeout(function(){
			self.endFinger();

			// 随机产生兵种 或者 读取曾保存的结果(麻烦补充)
			var index = Math.floor(Math.random() * result.length);
			console.log(index);
			self.showResult(index);
		},3000);
		$(this).addClass('finger-animation');
	});
	self.$finger.on('touchend',function(e){
		self.endFinger();
	});

	// 再试一次
	self.$pageBegin = $('#pageBegin');
	self.$pageResult = $('#pageResult');
	$('#againBtn').on('touchend',function(){
		self.$pageBegin.removeClass('dn');
		self.$pageResult.addClass('dn');

		self.$pageBegin.addClass('fadeIn');
		self.$pageBegin.on("webkitAnimationEnd", beginAnimationEnd);
		self.$pageBegin.on("animationend", beginAnimationEnd);
		function beginAnimationEnd(){
			self.$pageBegin.removeClass('fadeIn');
			self.$pageBegin.off("webkitAnimationEnd");
			self.$pageBegin.off("animationend");
		}
		self.beginTest();
	});
};

/**
 * 松开指纹 或 按住3秒后
 */
hbqTest.endFinger = function(){
	var self = this;
	self.$finger.removeClass('finger-animation');
	if(self.fingerTimer){
		clearTimeout(self.fingerTimer);
		self.fingerTimer = null;
	}
};

/**
 * begin
 */
hbqTest.beginTest = function (){
	$('#fingerSection').removeClass('dn');
	$('#beginSection').addClass('dn');
}

/**
 * 显示结果
 * @param  {number} index result index
 */
hbqTest.showResult = function(index){
	if(isNaN(index) && !result && !result[index]){
		return;
	}
	var self = this;
	self.$pageBegin.addClass('slideOutUp');
	self.$pageBegin.on("webkitAnimationEnd", beginAnimationEnd);
	self.$pageBegin.on("animationend", beginAnimationEnd);
	function beginAnimationEnd(){
		self.$pageBegin.addClass('dn');
		self.$pageBegin.removeClass('slideOutUp');
		self.$pageBegin.off("webkitAnimationEnd");
		self.$pageBegin.off("animationend");
	}

	self.$pageResult.removeClass('dn');
	self.$pageResult.addClass('fadeInUp');
	self.$pageResult.on("webkitAnimationEnd", resultAnimationEnd);
	self.$pageResult.on("animationend", resultAnimationEnd);
	function resultAnimationEnd(){
		self.$pageResult.removeClass('fadeInUp');
		self.$pageResult.off("webkitAnimationEnd");
		self.$pageResult.off("animationend");
	}

	var r = result[index];
	$('#resultImg').attr({'src':IMGPATH + r.img});
	$('#resultTxt').html(r.lname + '：' + r.txt);
	$('#resultName').html(r.lname);
	$('#infoBtn').attr({'href' : 'http://hbq.99.com/guide/info.shtml?index=4&&id=' + r.lId});
};

hbqTest.init();

/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-07-30 19:17
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

IMGPATH = 'http://7xnz8p.com1.z0.glb.clouddn.com/hbq/huber/image/'; //图片路径前缀

var huber = {};
huber.init = function(){
	huber.imgPreLoad();

	// 关闭按钮-当前弹窗
	$('.close-btn').on('touchend',function(){
		$(this).closest('.pop').addClass('dn');
	});
}
/**
 * 图片预加载
 * @param  {array} imgArray 图片名称数组
 */
huber.imgPreLoad = function() {
	IMG = [
		'close.png',
		'features.png',
		'h-detail-bg.jpg',
		'header.jpg',
		'h-select-bg.png',
		'hs-head-bg.png',
		'left.png',
		'right.png',
		'logo.png',
		'map.jpg',
		'map-horse.png',
	];
	var imgPreLoad = new ImagesControl(function() {
		orientationChange();
		$('#loading').addClass('bounceOutUp');
		var load = document.getElementById('loading');
		load.addEventListener("webkitAnimationEnd", loadAnimationEnd);
		load.addEventListener("animationend", loadAnimationEnd);
		function loadAnimationEnd(){
			$('#loading').addClass('dn');
		}
		huber.showPage(1);
	});
};
/**
 * 显示对应页
 * @param  {num} i index
 */
huber.showPage = function(i){
	if(!this.$pages){
		this.$pages = $('#pages .page');
	}
	$('#pages .page-show').removeClass('page-show');
	this.$pages.eq(i-1).addClass('page-show');
	this.initPage(i);
};
/**
 * 初始化页面
 * @param  {num} i index
 */
huber.initPage = function(i){
	switch(i){
		case 1:
			this.initPageMap();
			break;
		case 2:
			this.initPageForm();
			break;
		case 3:
			this.initPageResult();
			break;
	}
};
/**
 * page 01 地图页 初始化
 */
huber.initPageMap = function(){
	var _this = this;
	$('#match').addClass('dn');
	$('#horseDetail').addClass('dn');

	$('#hSelect li').on('touchend',function(){
		_this.selectHorseKind(this);
		return false;
	});

	//3d
	if(!this.horse3D){
		this.horse3D = new rotate3D();
		$('#hd3DLeft').on('touchend',function(){
			_this.horse3D.goImgPrev();
			return false;
		})
		$('#hd3DRight').on('touchend',function(){
			_this.horse3D.goImgNext();
			return false;
		})
		// 点击详情弹窗中的马 进行选择马预约 跳转第二页
		$('#hdShow').on('touchend',function(){
			$('#match').removeClass('dn');
			_this.showPage(2);
			return false;
		})
	}

	this.selectHorseKind();
};
/**
 * 选马 3大种
 */
huber.selectHorseKind = function($curLi){
	$curLi = $curLi || $('#hSelect li:first-child');
	var _this = this;
	this.curHKind = $($curLi).attr('hkind');// 当前马种类 西域马、华夏马、河曲马
	var hhorse = horse[this.curHKind];
	var htm = '';
	for(var hid in hhorse){
		var h = hhorse[hid];
		if(!h){
			continue;
		}
		htm += '<a href="javascript:;" class="h-map-horse mph-p' + h.hposition + '" hInd="' + hid + '"></a>';
	}
	$('#huberMap').html(htm);
	$('#huberMap a').on('touchend',function(){
		var i = $(this).attr("hInd");
		_this.selectHorse(i);
		return false;
	});
	$('#hSelect .on').removeClass('on');
	$($curLi).addClass('on');
};
/**
 * 点击地图上的马显示详情弹窗
 */
huber.selectHorse = function(hid){
	this.curHId = hid;//当前马的二级种类序号
	var hhorse = horse[this.curHKind];
	var h = hhorse[this.curHId];

	var $features = $('#features .features-num');
	var features = h.features;
	var len = $features.length;
	for(var i = 0; i < len; i++){
		$features.eq(i).html(features[i]);
	}
	$('#hdShow').css({'background-image':'url(' + HIMGPATH + h.himg + ')'});
	this.horse3D.init();

	$('#hHead img').attr('src',HIMGPATH + h.hhead);
	var $hdInfo = $('#hdInfo');
	$hdInfo.find('.hd-name').html(h.hname + '<span class="hd-lvl">LV' + h.lvl + '</span>');
	$hdInfo.find('.hd-des').html(h.desc);

	$('#horseDetail').removeClass('dn');
};

/**
 * page 02 填信息 初始化
 */
huber.initPageForm = function(){
	// 显示上一步选择的马信息
	var sHorse = horse[this.curHKind],
		h = sHorse[this.curHId];
	$('#selectedHorse img').attr('src',HIMGPATH + h.hheaded);
	var $selectedHorse = $('#selectedHorse');
	$selectedHorse.find('.hd-name').html(h.hname + '<span class="hd-star">★</span><span class="hd-lvl">LV' + h.lvl + '</span>')
	$selectedHorse.find('.hd-des').html(h.desc);

	// 点确认 提交表单后 跳转结果页
	$('#hfOkBtn').on('touchend',function(){
		huber.showPage(3);
		return false;
	})
}
/**
 * page 03 结果
 */
huber.initPageResult = function(){
	$('#community .community-tit').on('touchend',function(){
		$(this).next('.community-list').toggleClass('community-list-show');
		return false;
	})
	$('#zgxqBtn').on('touchend',function(){
		$('#zgxq').toggleClass('dn');
		return false;
	})
	// $(document).on('touchend',function(){
	// 	$('#zgxq').addClass('dn');
	// 	$('#share').addClass('dn');
	// 	return false;
	// })
	$('#moreBtn').on('touchend',function(){
		huber.showPage(1);
		return false;
	})

	var hhorse = horse[this.curHKind];
	var h = hhorse[this.curHId];
	$('#hResult').html(h.success);
}
/**
 * 3D
 */
var rotate3D = function(){
	this.init();
};
rotate3D.prototype.init = function() {
	this.currImg = 0;
	this.records = 0;
	this.total = 20;
	this.ele = document.getElementById('hdShow');
	this.ele.className = 'hd-show';
}
rotate3D.prototype.goImgNext = function() {
	var self = this;
 	self.currImg++;
 	self.ele.className = 'hd-show hd-show-'+ ((self.currImg) > self.total ? (self.currImg = 1) : self.currImg);
 };
rotate3D.prototype.goImgPrev = function() {
	var self = this;
 	self.ele.className = 'hd-show hd-show-'+ ((self.currImg-1) < 1 ? (self.currImg = self.total) : self.currImg);
 	self.currImg--;
 };

huber.init();

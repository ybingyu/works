/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-08-12 15:35
*/ 
var hbqTest = {};
hbqTest.init = function(){
	var self = this;
	$(function(){
		if(judgeMobile()){
			$('body').removeClass('normal').addClass('mobile');
		}
		else{
			$('body').removeClass('mobile').addClass('normal');
		}
		$('#testBegin').on('click touchend',function(){
			self.initTest();
		});
		self.eleTestTit = $('#testSection .test-tit');
		self.eleTestOption = $('#testSection .test-option');

		self.$nextBtn = $('#testNext').on('click touchend',function(){
			self.showTest(self.curTest);
		});

		self.$finishBtn = $('#testFinish').on('click touchend',function(){
			self.showResult(self.curTest);
		});
		$('#reTest').on('click touchend',function(){
			self.showProgress('#beginSection');
		});
	});
};

hbqTest.initTest = function(){
	this.curTest = 1;
	this.showTest(this.curTest);
	this.showProgress('#testSection');
	this.$nextBtn.addClass('dn');
	this.$finishBtn.addClass('dn');
};

hbqTest.showProgress = function(id){
	var arrId = ['#beginSection','#testSection','#resultPop'];

	for(var i = 0 ; i < arrId.length ; i ++){
		if(id === arrId[i]){
			$(arrId[i]).removeClass('dn');
			continue;
		}
		$(arrId[i]).addClass('dn');
	}
};

hbqTest.showTest = function(key){
	if(!test && typeof key !== 'number' ){
		return;
	}
	this.$nextBtn.addClass('dn');
	this.$finishBtn.addClass('dn');
	var self = this;
	var curTest = test[key];
	if(!curTest){
		return;
	}
	self.eleTestTit.html('Q：' + curTest.question);
	var option = curTest.option;
	var htm = '<label><input type="radio" value="' + option['A'].to + '" name="test" >A、' + option['A'].text + '</label>' +
				'<label><input type="radio" value="' + option['B'].to + '" name="test" >B、' + option['B'].text + '</label>' +
				'<label><input type="radio" value="' + option['C'].to + '" name="test" >C、' + option['C'].text + '</label>'  ;
	self.eleTestOption.html(htm);
	$('#testSection input[type="radio"]').change(function(){
		var selected = $('#testSection input[name="test"]:checked').val();
		if(isNaN(parseInt(selected))){
			self.$finishBtn.removeClass('dn');
			self.$nextBtn.addClass('dn');
			self.curTest = selected;
		}else{
			self.$nextBtn.removeClass('dn');
			self.$finishBtn.addClass('dn');
			self.curTest = parseInt(selected);
		}
	});
};

hbqTest.showResult = function(key){
	if(!result && typeof key!=='string' ){
		return;
	}
	var r = result[key];
	if(!r){
		return;
	}
	this.showProgress('#resultPop');
	// $('#resultPop').removeClass('dn');
	$('#result').html(r.tit);
	var talk = r.talk;
	$('#talk').html('<p>评：'+ talk[0] + '</p><p>回：' + talk[1] + '</p>');
	$('#resultUrl').attr({'href' : r.url});
};

hbqTest.init();
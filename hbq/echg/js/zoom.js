/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-10-27 17:11
*/ 
function zoom(width) {
	var ratio; //缩放比例
	c_width = document.documentElement.clientWidth;
	ratio = c_width / width;
	document.body.style.cssText = "zoom:" + ratio;

	//计算target-densitydpi数值
	var phoneWidth = parseInt(window.screen.width);
	var dpi = width / phoneWidth * window.devicePixelRatio * 160;
	var viewCont = document.querySelector("meta[name='viewport']").content;
	viewCont += ', target-densitydpi=' + dpi;
	document.querySelector("meta[name='viewport']").content = viewCont;
}
window.addEventListener("resize", function() {
	zoom(ORIGINAL);
}, false);
zoom(ORIGINAL);
/*
 * Author: ybingyu
 * Version: 0.1.0
 * Compile Date: 2015-09-16 14:54
*/ 
function ImagesControl(arr, fn) {
    this.init(arr, fn);
}
ImagesControl.prototype.init = function(arr, fn) {
    var _this = this;

    this.nLoadedImgs = 0;

    this.preLoadImgs(arr, fn);
};


/**
 * 批量加载
 * @param {array} arr 图片路径数组
 * @param {function} fn 回调函数
 */
ImagesControl.prototype.preLoadImgs = function(arr, fnBack) {
    var arrNewImgs = [];
    this.nLoadedImgs = 0;
    var postaction = fnBack || function() {};
    var arr = (typeof arr != "object") ? [arr] : arr; //确保都是数组

    var _this = this;

    function ImgsLoadPost() {
        _this.nLoadedImgs++;
        if (_this.nLoadedImgs == arr.length) {
            console.log("图片加载完成");
            postaction(arrNewImgs);
        }
    }
    for (var i = 0,len = arr.length ; i < len; i++) {
        arrNewImgs[i] = new Image();
        arrNewImgs[i].onload = function() {
            this.onload = null;
            ImgsLoadPost();
        }
        arrNewImgs[i].onerror = function() {
                ImgsLoadPost();
            }
            // IMGPATH 路径前缀
        arrNewImgs[i].src = IMGPATH + arr[i];
    }
    return {
        done: function(f) {
            postaction = f || postaction;
        }
    };
};


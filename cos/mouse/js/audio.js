/**
 * 音频
 */
function AudioControl(index,fn){
    var _this = this;

    this.data = new AudioData(DomControl.getCWidth(),DomControl.getCHeight(),index);

    // 初始化ele
    this.ele = {},
    this.ele.oLoad = document.querySelector("#load");
    this.ele.oCanvas = document.querySelector("canvas");

    document.querySelector("#load .load_txt").innerHTML = "玩命加载音频资源中...<br/>请竖起您的手机访问";

    DomControl.removeClass(this.ele.oLoad,"dn");

    this.ele.oCanvas.width = this.data.nCW;
    this.ele.oCanvas.height = this.data.nCH;

    this.ctx = this.ele.oCanvas.getContext("2d");

    this.ctx.font = "2rem Arial";

    // Blue gradient for progress bar
    var progress_lingrad = this.ctx.createLinearGradient(0,this.data.nProcessY+this.data.nProcessH,0,0);
    progress_lingrad.addColorStop(0, '#4DA4F3');
    progress_lingrad.addColorStop(0.4, '#ADD9FF');
    progress_lingrad.addColorStop(1, '#9ED1FF');
    this.ctx.fillStyle = progress_lingrad;

    this.preLoad(this.data.aSrc,fn);
}
/**
 * 预加载
 */
AudioControl.prototype.preLoad = function(arr,fnBack){
    AudioControl.Sound={};
    this.data.nLoadedSound=0;
    this.fnCallBack = fnBack;
    var fnCallBack=function(){};
    var arr=(typeof arr!="object")?[arr] : arr;//确保都是数组

    var _this = this;
    function SoundLoadPost(){
        if(_this.data.nLoadedSound == arr.length){
            console.log("音频已经加载完成");
            if(browser.versions.ios){//ios处理
                document.querySelector("#load .load_txt").innerHTML = "加载完毕，请点击继续<p id=\"loadGo\" class=\"level_btn lb_next ab_center_x\" style=\"width: 30%;margin-top:50px\"><a href=\"javascript:;\"></a></p>";
                document.querySelector("#loadGo").onclick = function(){
                    DomControl.addClass(_this.ele.oLoad,"dn");
                    DomControl.removeClass(document.querySelector("#fullMain"),"dn");
                    if(fnBack){
                        fnBack();
                    }
                }
            }else{
                DomControl.addClass(_this.ele.oLoad,"dn");
                DomControl.removeClass(document.querySelector("#fullMain"),"dn");
                if(fnBack){
                    fnBack();
                }
            }
            return;
        }

        var i = _this.data.nLoadedSound;
        var a =  new Howl({
            urls: [AUDIOPATH + arr[i] +'.mp3', AUDIOPATH + arr[i] +'.wav'],
            onload : SoundLoadPost,
            loop : arr[i]=="bg"? true:false
        })
        AudioControl.Sound[arr[i]] = a;
        _this.data.nLoadedSound++;
        _this.drawProcess();
    }
    SoundLoadPost();

    return {
        done:function(fn){
            fnCallBack = fn || fnCallBack;
        }
    }
}
/**
 * 播放音乐
 * @param {str} id
 */
AudioControl.play = function (id){
    if(browser.versions.android ){//安卓由于兼容问题 只播放背景音乐 且只使用原生的方法
        if(id == "bg"){
            var a = new Audio(AUDIOPATH + "bg.mp3");
            a.play();
            a.loop = true;
            return;
        }else{
            return;
        }
    }
    var loop = false;
    if(id=="bg"){loop = true}
    if(!AudioControl.Sound[id]){
        var a =  new Howl({
            urls: [AUDIOPATH + id +'.mp3', AUDIOPATH + id +'.wav'],
            loop : loop
        })
        a.play();
        AudioControl.Sound[id] = a;
        return;
    }

    AudioControl.Sound[id].play();
    // AudioControl.Sound[id].loop(loop);
}


/**
 * 绘制
 */
AudioControl.prototype.drawProcess = function () {
    if(!this.ctx){
        return;
    }
    // 画圆角矩形
    var curW = this.data.nLoadedSound / this.data.aSrc.length * this.data.nProcessW;
    // Clear everything before drawing
    this.ctx.clearRect(this.data.nProcessX-5,this.data.nProcessY-5,this.data.nProcessW+15,this.data.nProcessH+100);
    ImagesControl.prototype.progressLayerRect(this.ctx, this.data.nProcessX, this.data.nProcessY, this.data.nProcessW, this.data.nProcessH, this.data.radius);
    ImagesControl.prototype.progressBarRect(this.ctx, this.data.nProcessX, this.data.nProcessY, curW, this.data.nProcessH, this.data.radius, this.data.nProcessW);
    ImagesControl.prototype.progressText(this.ctx, this.data.nProcessX, this.data.nProcessY,curW, this.data.nProcessH, this.data.radius, this.data.nProcessW );
}
/**
 * 管理类 (Modal)
 */
function AudioData(cw,ch,index){
    // 屏幕宽高
    this.nCH = ch;
    this.nCW = cw;
    //相对于屏幕的比例
    var nWp = 0.8,
        nHp = 0.05;
    //坐标
    this.nProcessX = this.nCW * (1 - nWp) / 2;
    this.nProcessY = this.nCH * 0.2;
    // 宽度
    this.nProcessW = this.nCW * nWp;
    this.nProcessH = this.nCH * nHp;
    // radius
    this.radius = this.nProcessH / 2;
    // 首页图片资源
    this.aSrc = AUDIO[index];
    this.nLoadedImgs = 0;
}
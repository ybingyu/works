/**
 * 
 * @authors Bingyu Yuan ()
 * @date    2015-01-07 16:04:18
 * @version $Id$
 */

var gameCtrl ;
windowOnload( function(){
    var lvl = parseInt(GetQueryString("lvl")) || 0;
    gameCtrl = new GameControl(lvl);
    
    // gameCtrl.beginLevel();
})


/**
 * control对象
 **/
function GameControl(lvl){
    this.init(lvl);
}

/**
 * 游戏初始化
 */
GameControl.prototype.init = function(lvl){
    var _this = this;

    this.oLevel = this.initLevel(lvl);//关卡控制对象
    this.oScore = this.initScore();//统计对象
    this.oSpriteSet = this.initSpriteSet();//9宫格 地鼠


    Sprite.prototype.setScore(this.oScore);//为地鼠绑定分数对象

    this.initEle();
}

/**
 * 关卡结束 
 */
GameControl.prototype.endLevel = function(){
    // 重置地鼠
    this.oSpriteSet.resetSprites();
    // 移除定时器
    this.setTimer();
    this.oScore.resetLvl();
}
/**
 * 关卡开始
 */
GameControl.prototype.beginLevel = function(){
    var _this = this;
    // 重置分数对象
    _this.oScore.init(_this.oLevel.getTargetCount(),_this.oLevel.getCurLvl());
    //消失吧！分享 什么鬼
    var oShbox = document.getElementById("shareBox");
    DomControl.addClass(oShbox,"dn");

    var oCllver = document.querySelector("#gameBegin .cl_level"),
        oClReady = document.querySelector("#gameBegin .cl_ready"),
        oClGo = document.querySelector("#gameBegin .cl_go"),
        oCoverLayer = document.getElementById("gameBegin");//覆盖层
    
    //ready go动画
    DomControl.removeClass(oCoverLayer,"dn");
    DomControl.removeClass(oCllver,"dn");

    // 0128 audio
    var time = 1000;
    DomControl.ainma(oCllver,oClReady,function(){
        // 0128 audio
        AudioControl.play("readygo");
        DomControl.ainma(oClReady,oClGo,function(){
            DomControl.ainma([oClGo,oCoverLayer],null,function(){
                DomControl.ainma(null,null,function(){
                    // 设置地鼠动画时间
                    _this.oSpriteSet.initSpritesAnimateDur(_this.oLevel.getAnimationDuration());
                    // 产生随机老鼠
                    _this.randomCreateMouse();
                    _this.setTimer();
                    _this.oScore.setDownCount();
                },time)
            },time)
        },time)
    },time);
}
/**
 * 初始化 关卡 对象
 */
GameControl.prototype.initLevel = function(lvl){
    var lvl = new Level(lvl);
    return lvl;
}
/**
 * 初始化 地鼠集合 对象
 */
GameControl.prototype.initSpriteSet = function(){
    var spriteSet = new SpriteSet();
    return spriteSet;
}
/**
 * 初始化 分数 对象
 */
GameControl.prototype.initScore = function(){
    var _this = this;
    var score = new Score(0,this.oLevel.getCurLvl());
    return score;
}

/**
 * 随机显现地鼠
 */
GameControl.prototype.randomCreateMouse = function(){
    if(this.oScore.isLevelEnd()){//当前关卡时间到
        this.oScore.levelEnd();
        this.endLevel();
        console.log("time end");
        return;
    }
    if(this.oScore.data.nTime < 2){
        return;
    }

    this.oSpriteSet.randomCreateSprite(this.oLevel);
}


/**
 * 设置 或 取消 随机产生地鼠 定时器
 */
GameControl.prototype.setTimer = function(){
    var _this = this;
    if(!this.timer){ 
        this.timer = setInterval(function(){
            _this.randomCreateMouse();
        },this.oLevel.getSpeed());
    }else{
        clearInterval(this.timer);
        this.timer = null;
    }
}
/**
 * view 绑定结果面板按钮事件
 */
GameControl.prototype.initEle = function(){
    var _this = this;
    this.ele = {};
    //下一关函数绑定
    var oNext = document.querySelectorAll("#lvlResult .level_btns .lb_next");
    var len = oNext.length
    for(var i = 0;i < len ;i++){
        DomControl.addEvent(oNext[i],"touchend",function(event) {
            // alert("click next")
            _this.oLevel.nextLevel();
            _this.beginLevel();
            hideLveRes(event.target);
        }); 
    }
    
    //再玩一次
    var oAgain = document.querySelectorAll("#lvlResult .level_btns .lb_again");
    len = oAgain.length;
    for(var i = 0;i < len;i++){
        DomControl.addEvent(oAgain[i],"touchend", function(event){
            _this.oLevel.init(0);
            _this.beginLevel();
            hideLveRes(event.target);
        })
    }

    //返回主页
    var oHome = document.querySelectorAll("#lvlResult .level_btns .lb_home");
    len = oHome.length;
    for(var i = 0;i < len;i++){
        DomControl.addEvent(oHome[i],"touchend",function(){
            if(ScoreData.prototype.AScoreSet.length >0 ){
                window.location.href = "../index.html?max=1"; 
            }else{
                window.location.href = "../index.html?max=0"; 
            }
        });
    }

    //查看排行
    var oRank = document.querySelectorAll("#lvlResult .level_btns .lb_rank");
    len = oRank.length;
    for(var i = 0;i < len;i++){
        DomControl.addEvent(oRank[i],"touchend",function(){
            if(ScoreData.prototype.AScoreSet.length >0 ){
                window.location.href = "../rank.html?max=1"; 
            }else{
                window.location.href = "../rank.html?max=0"; 
            }
        });
    }  

    //分享
    var oShare = document.querySelectorAll("#lvlResult .level_btns .lb_share");
    len = oShare.length;
    for(var i = 0;i < len;i++){
        DomControl.addEvent(oShare[i],"touchend",function(){
            //分享 什么鬼
            var oShbox = document.getElementById("shareBox");
            DomControl.removeClass(oShbox,"dn");
        });
    }

    function hideLveRes(_this){
        var parent = _this.parentNode;
        while(parent.id != "lvlResult"){
            parent = parent.parentNode;
        }
        DomControl.addClass(parent,"dn");
    }
}    
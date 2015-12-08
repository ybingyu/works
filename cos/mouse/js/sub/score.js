/**
 * 分数等统计(Control)
 * @param {num} targetCount 目标分数
 */
function Score(targetCount,lvl){
    this.init(targetCount);
}
/*
 * 初始化
 * @param {num} targetCount 当前关卡 目标分数
 * @param {num} lvl 当前关序号
 */
Score.prototype.init = function(targetCount,lvl){
    this.data = new ScoreData(targetCount,lvl);//Modal

    // view :绑定dom
    if(typeof this.ele != "undefined"){
        this.showTime(); 
        return;
    }
    
    this.initEle();

    this.showTime();
}
/**
 * 初始化view :绑定dom
 */
Score.prototype.initEle = function(){    
    this.ele = {};
    //倒计时
    this.ele.oTimeBar = document.querySelector("#time .time_proc");
    this.ele.oTimeTxt = document.querySelector("#time .time_txt");
    this.nTimeProc = document.querySelector("#time .time_proc_box").offsetWidth;//遮罩层总长度
    //连杀
    this.ele.oDoubleHit = document.querySelector("#doubleHit");

    this.ele.oLvlRes = document.getElementById("lvlResult");//通关小结面板
    this.ele.oLvlResPass = this.ele.oLvlRes.querySelector(".pass_level");//通关小结
    this.ele.oLvlResFail = this.ele.oLvlRes.querySelector(".fail_level");//再接再厉
    this.ele.oLvlResAll = this.ele.oLvlRes.querySelector(".all_level");//全部过关

    this.ele.oLevelPass = document.getElementById("lvlPass");//通关标识
    this.ele.oLevelFail = document.querySelector("#gameBegin .cl_fail");
    // 0128 audio
    var oBadge = this.ele.oLvlResAll.querySelectorAll(".badge"),
        nBadgeLen = oBadge.length;
    for(var i = 0;i < nBadgeLen;i++ ){
        DomControl.addEvent(oBadge[i],"webkitAnimationEnd",function(){
            AudioControl.play("badge");           
        });
    }
}
/**
 * 设置倒计时
 */
Score.prototype.setDownCount = function(){
    var _this = this;
    this.showTime();
    if(this.timer){
        clearInterval(this.timer);
    }
    // 倒计时
    this.timer = setInterval(function(){
        _this.showTime();
    },1000);
}

/**
 * 分数统计
 * @param {num} type 击中的地鼠类型 小兵0 英雄1
 */
Score.prototype.setCount = function(type){
    // 统计击中数
    if(type == 0){
        this.data.nSoldierCount ++;
    }else if(type == 1){
        this.data.nHeroCount ++;
    }
    // 统计连击数
    var nowTime =  this.data.getNowTime();

    // if((nowTime - this.data.nHitTime) < DOUBLE_HIT_INTERVAL){
    if (type == 1) {
        this.data.nDoubleHit ++;
        this.showDoubleHit();
    }else{
        // this.data.nDoubleHit = 1;
        this.hideDoubleHit();
    }
    this.data.nMaxDoubleHit = this.data.nDoubleHit > this.data.nMaxDoubleHit ? this.data.nDoubleHit : this.data.nMaxDoubleHit;
    this.data.nHitTime = nowTime;
}
/**
 * 判断是否达到关卡设置时间
 */
Score.prototype.isLevelEnd = function(){
    return this.data.isLevelEnd();
}

/**
 * 判断是否达到目标
 */
Score.prototype.isLevelPass = function(){
    console.log("huzg" + (this.data.nHeroCount + this.data.nSoldierCount))
    console.log("zongshu" + (this.data.nRasSoliderCount + this.data.nRasHeroCount))
    if((this.data.nHeroCount + this.data.nSoldierCount) > (this.data.nRasSoliderCount + this.data.nRasHeroCount) * 0.6){
        return true;
    }
    return false;
}

/**
 * 统计随机生成的小兵或者英雄数量
 * @param {num} type //小兵0 英雄1
 */
Score.prototype.countRasSprite = function(type){
    if(type == 0){
        this.data.nRasSoliderCount ++;
    }else if(type == 1){
        this.data.nRasHeroCount ++;
    }
    console.log("Raszong" + (this.data.nRasSoliderCount  + this.data.nRasHeroCount))
}

/**
 * 重置连击数
 */
Score.prototype.resetDoubleHit = function(){
    this.data.nDoubleHit = 0;
    this.data.nMaxDoubleHit = this.data.nDoubleHit > this.data.nMaxDoubleHit ? this.data.nDoubleHit : this.data.nMaxDoubleHit;
    this.hideDoubleHit();
}
/**
 * 当前关结束时 重置数据 保存关卡数据
 */
Score.prototype.resetLvl = function(){
    if(this.data && this.data.bIsPass){
        //计算总分
        this.data.getTotalScore();
        //存储当前关数据
        var oTemp = ScoreData.prototype.AScoreSet[this.data.nCurLevel];
        if(oTemp){
            ScoreData.prototype.AScoreSet[this.data.nCurLevel] = oTemp.nTotalScore > this.data.nTotalScore? oTemp : this.data;
        }else{
            ScoreData.prototype.AScoreSet[this.data.nCurLevel] = this.data;
        }
        
        console.log(ScoreData.prototype.AScoreSet);
    }
    //取消定时器
    this.setDownCount();
    //隐藏连杀等
    DomControl.addClass(this.ele.oDoubleHit,"dn");
}
/**
 * 倒计时显示
 */
Score.prototype.showTime = function(){
    // 0128 audio
    if(!this.nTimeProc){
        this.nTimeProc = document.querySelector("#time .time_proc_box").offsetWidth;//遮罩层总长度
    }
    this.ele.oTimeBar.style.cssText = "width:" + (this.data.nTime / LEVEL_TIME * 1000 * this.nTimeProc) + "px";
    this.ele.oTimeTxt.innerHTML = this.data.nTime;
    if(this.data.nTime<10){
        this.ele.oTimeTxt.innerHTML = "0" + this.data.nTime;
    }
    if(this.data.isLevelEnd()){
        clearInterval(this.timer);
    }
    this.data.nTime --;
    if(this.data.nTime<=0){
        this.data.nTime = 0;
    }
}
/**
 * 连击显示
 */
Score.prototype.showDoubleHit = function(){
    if(this.data.nDoubleHit <=1){
        return;
    }
    this.ele.oDoubleHit.innerHTML = "<span class=\"dh_num\">" +
        this.data.nDoubleHit+
        "</span>连杀！"
    DomControl.removeClass(this.ele.oDoubleHit,"dn");
}
/**
 * 连击隐藏
 */
Score.prototype.hideDoubleHit = function(){
    DomControl.addClass(this.ele.oDoubleHit,"dn");
}
/**
 * 关卡结束 显示
 */
Score.prototype.levelEnd = function(){
    var _this = this;
    DomControl.addClass(_this.ele.oLevelPass,"dn");
    DomControl.addClass(_this.ele.oLevelFail,"dn");
    DomControl.addClass(_this.ele.oLvlResFail,"dn");
    DomControl.addClass(_this.ele.oLvlResAll,"dn");
    DomControl.addClass(_this.ele.oLvlResPass,"dn");


    this.data.bIsPass = this.isLevelPass();
    isPass();
    //禁止滚动
    var oMain = document.getElementById("fullMain");
    oMain.style.cssText = "height:100%;overflow:hidden;"
    //全部过关
    if(this.data.nCurLevel >= (LEVEL_INFO.length -1)){
        // 0128 audio
        AudioControl.play("pass");
        setTimeout(function(){
            DomControl.ainma(_this.ele.oLevelPass,[_this.ele.oLvlRes,_this.ele.oLvlResAll],function(){
                _this.updateLvlRes(2);
            })
        },1000)
        return;
    }

    //通关
    if(_this.data.bIsPass){        
        // 0128 audio
        AudioControl.play("pass");
        setTimeout(function(){
            DomControl.ainma(_this.ele.oLevelPass,[_this.ele.oLvlRes,_this.ele.oLvlResPass],function(){
                _this.updateLvlRes(0);
            })
        },1000)
        return;
    }else{
        //失败
        // 0128 audio
        AudioControl.play("fail");
        setTimeout(function(){
            DomControl.ainma(_this.ele.oLevelFail,[_this.ele.oLvlRes,_this.ele.oLvlResFail],function(){
                _this.updateLvlRes(1);
            })
        },1000)
        return;
    }

    function isPass(){
        if(_this.data.bIsPass){
            DomControl.removeClass(_this.ele.oLevelPass,"dn");
        }else{
            DomControl.removeClass(document.querySelector("#gameBegin"),"dn");
            DomControl.removeClass(_this.ele.oLevelFail,"dn");
        }
    }
}
/**
 * 过关小结面板 显示
 */
Score.prototype.updateLvlRes = function(flag){
    switch(flag){
        case 0://成功过关
            var oHeroNum = this.ele.oLvlResPass.querySelector(".hero_num .levelr_num");
            this.lvlResultAnimate(oHeroNum,this.data.nHeroCount);

            var oSoliderNum = this.ele.oLvlResPass.querySelector(".soldier_num .levelr_num");
            this.lvlResultAnimate(oSoliderNum,this.data.nSoldierCount);

            var oDblNum = this.ele.oLvlResPass.querySelector(".dbl_num .levelr_num");
            this.lvlResultAnimate(oDblNum,this.data.nMaxDoubleHit == 1?0 : this.data.nMaxDoubleHit);


            var oTotal = this.ele.oLvlResPass.querySelector(".total_score .levelr_num");
            this.lvlResultAnimate(oTotal,this.data.getTotalScore());

            break;
        case 1://再接再厉
            var oHeroNum = this.ele.oLvlResFail.querySelector(".hero_num .levelr_num");
            this.lvlResultAnimate(oHeroNum,this.data.nHeroCount);

            var oSoliderNum = this.ele.oLvlResFail.querySelector(".soldier_num .levelr_num");
            this.lvlResultAnimate(oSoliderNum,this.data.nSoldierCount);


            var oDblNum = this.ele.oLvlResFail.querySelector(".dbl_num .levelr_num");
            this.lvlResultAnimate(oDblNum,this.data.nMaxDoubleHit == 1?0 : this.data.nMaxDoubleHit);

            var oTotal = this.ele.oLvlResFail.querySelector(".total_score .levelr_num");
            this.lvlResultAnimate(oTotal,this.data.getTotalScore());
            break;
        case 2://全部完成            
            console.log(ScoreData.prototype.AScoreSet);
            var nHC = 0,
                nSC = 0,
                nTotallS = 0,
                nMaxDH = 0;
            var len = ScoreData.prototype.AScoreSet.length;
            for(var i = 0;i< len; i++){
                var sd = ScoreData.prototype.AScoreSet[i];
                if(!sd){
                    continue;
                }
                nHC += sd.nHeroCount;
                nSC += sd.nSoldierCount;
                nTotallS += sd.nTotalScore;
                nMaxDH = sd.nMaxDoubleHit > nMaxDH ? sd.nMaxDoubleHit : nMaxDH;
            }
            var oTotal = this.ele.oLvlResAll.querySelector(".total_score .levelr_num");
            this.lvlResultAnimate(oTotal,this.data.getTotalScore());

            var oSuper = this.ele.oLvlResAll.querySelector(".levelr_super");
            if(nHC>0){//超神的杀戮
                // var str = SUPER_TIT[nHC.toString()];
                // 连杀英雄
                nMaxDH = nMaxDH > 10 ? 10 : nMaxDH;
                var str = SUPER_TIT[nMaxDH.toString()];
                console.log("nMaxDH" +nMaxDH);
                if(typeof str == "undefined"){str = ""}
                oSuper.innerHTML = str;
                DomControl.removeClass(oSuper,"dn")
            }else{
                DomControl.addClass(oSuper,"dn")
            }

            //您已击败(后台读取？)
            var oBadgeTxt = this.ele.oLvlResAll.querySelector("#badgeBeat .badge_txt_num");
            oBadgeTxt.innerHTML = "30%";
            //您当前排名(后台读取？)
            var oBadgeRankTxt = this.ele.oLvlResAll.querySelector("#badgeRank .badge_txt_num");
            oBadgeRankTxt.innerHTML = 100;
            var oTotal = this.ele.oLvlResAll.querySelector(".total_score .levelr_num");
            this.lvlResultAnimate(oTotal,nTotallS);
            break;
    }
}


/**
 * 过关小结面板数字动画
 */
Score.prototype.lvlResultAnimate = function(ele,num){
    // 动画不兼容 去掉
    //   var options = {
    //   useEasing : true, 
    //   useGrouping : true, 
    //   separator : '', 
    //   decimal : '' ,
    //   prefix : '' ,
    //   suffix : '' 
    // }
    // var num = new countUp(ele, 0, num,null , 1, options);
    // num.start();
    ele.innerHTML = num;
}
/**
 * 分数统计（Modal）
 * @param {num} targetCount 当前关卡目标击中数
 * @param {num} lvl 当前关卡序号
 */
function ScoreData(targetCount,lvl){
    this.init(targetCount,lvl);
}
/**
 * 初始化
 * @param {num} targetCount 当前关卡目标击中数
 */
ScoreData.prototype.init = function(targetCount,lvl){
    this.nCurLevel = lvl || 0;//当前关序号
    this.nHeroCount = 0;//击中英雄次数
    this.nSoldierCount = 0;//击中小兵次数
    this.nTargetCount = targetCount || 0;//目标次数
    this.nLevelBeginTime = this.getNowTime();//游戏开始时间
    this.nHitTime = 0;//当前击中时间 用于统计连击数
    this.nDoubleHit = 0;//当前连击数
    this.nMaxDoubleHit = 0;//最高连击数
    this.nLevelEnd = false;//当前关卡是否结束
    this.nTotalScore = 0;//当前关卡分数

    this.nRasHeroCount = 0;//产生英雄的数量
    this.nRasSoliderCount = 0;//产生小兵的数量

    this.nTime = LEVEL_TIME/1000;//倒计时

    this.bIsPass = false;//是否过关
}
ScoreData.prototype.AScoreSet = [];//总分
/**
 * 获得当前时间
 */
ScoreData.prototype.getNowTime = function(){
    var now = new Date();    
    return now.getTime();
}
/**
 * 判断是否达到关卡设置时间
 * @param 
 */
ScoreData.prototype.isLevelEnd = function(){
    var nowTime = this.getNowTime();
    if(this.nTime<=0){
        this.nLevelEnd = true;
    }
    return this.nLevelEnd;
}
/**
 * 统计分数
 * @return {num} 总分
 */
ScoreData.prototype.getTotalScore = function(){
    this.nTotalScore = HERO_COUNT*this.nHeroCount + SOLDIER_COUNT * this.nSoldierCount;
    return this.nTotalScore;
}


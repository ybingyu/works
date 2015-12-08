
/**
 * 关卡 对象 (Control)
 */
function Level(lvl){
    this.init(lvl);
}
Level.prototype.init = function(lvl){
    this.data = new LevelData(lvl);

    if(this.ele){
        this.showLevel();
        return;
    }
    this.ele = {};
    this.ele.oCllver = document.querySelector("#gameBegin .cll_txt"),//关
    this.ele.oLvlTit = document.querySelector("#lvl .level_ind"),//关 题目
    
    this.showLevel();
}
/**
 * 读取下一关
 */
Level.prototype.nextLevel = function(){
    this.data.nextLevel();
    this.showLevel();
}
/**
 * 下一关 lvl 元素显示
 */
Level.prototype.showLevel = function(){
    this.ele.oCllver.innerHTML = this.ele.oLvlTit.innerHTML = (parseInt(this.data.nCurLevel) + 1);
}
/**
 * 读取本关目标
 * @return {num} 本关目标
 */
Level.prototype.getTargetCount = function(){
    return this.data.getTargetCount();
}
/**
 * 读取本关随机Class
 * @return {num} 本关随机Class
 */
Level.prototype.getRandomSpriteCls = function(){
    return this.data.getRandomSpriteCls();
}
/**
 * 读取本关速度
 * @return {num} 速度
 */
Level.prototype.getSpeed = function(){
    return this.data.getSpeed();
}
/**
 * 读取当前关数
 * @return {num} 当前关数
 */
Level.prototype.getCurLvl = function(){
    return this.data.getCurLvl();
}
/**
 * 读取当前地鼠动画时间
 * @return {num} 当前关卡地鼠出现到消失时间间隔（动画时间 秒）
 */
Level.prototype.getAnimationDuration = function(){
    return this.data.getAnimationDuration();
}




/**
 * 关卡数据 对象(Modal)
 */
function LevelData(lvl){
    this.init(lvl);
}
/*
 * 初始化 
 * @param {num} curLev 当前关卡序号 默认值0
 */
LevelData.prototype.init = function(curLev){
    this.nCurLevel = (typeof curLev != "number") ? 0 :  curLev;//当前关卡
    var infoLen = LEVEL_INFO.length;
    if(this.nCurLevel >= infoLen){//关卡全过
        this.nCurLevel = infoLen;
        console.log("game end");
        return;
    }
    console.log(this.nCurLevel)
    this.oLevelInfo = LEVEL_INFO[this.nCurLevel];//关卡数据
    if(this.aRandomSpriteCls){
        this.aRandomSpriteCls = null;
    }
    this.aRandomSpriteCls = this.CreateRandomSpriteCls();//当前关随机样式
}

/**
 * 读取下一关
 */
LevelData.prototype.nextLevel = function(){    
    this.init(++this.nCurLevel) ;
}
/**
 * 当前关卡随机出现样式
 * @return {array} 二维数组 [0]样式名称 [1]地鼠种类 小兵0 英雄1
 */
LevelData.prototype.CreateRandomSpriteCls = function(){
    // 产生英雄class
    var len = this.getHeroCount();
    var aRandomSpriteCls = new Array();
    randomCls(len,1,HERO_CLS,HERO_CLS_LEN, aRandomSpriteCls);
    len = this.getSoldierCount();
    randomCls(len,0,SOLDIER_CLS,SOLDIER_CLS_LEN, aRandomSpriteCls);

    function randomCls(len,type,clsName,count, returnArr){
        returnArr = returnArr || new Array();
        for(var i = 0; i < len ;i ++){
            var spriteCls = new Array();
            var clsIndex = Math.ceil(Math.random() * count);
                spriteCls[0] = clsName + clsIndex;//样式
            if(clsIndex<10){
                spriteCls[0] = clsName + "0" + clsIndex;//样式
            }
            spriteCls[1] = type;//种类
            returnArr.push(spriteCls);
        }
        return returnArr;
    }
    // console.log("randomcls:" + aRandomSpriteCls)
    return aRandomSpriteCls;
}
/**
 * 读取英雄数量
 * @return {num} 英雄数量 
 */
LevelData.prototype.getHeroCount = function(){
    if(this.oLevelInfo){
        return this.oLevelInfo.heroCount;
    }
}
/**
 * 读取小兵数量
 * @return {num} 小兵数量
 */
LevelData.prototype.getSoldierCount = function(){
    return this.oLevelInfo? this.oLevelInfo.soldierCount:0;
}
/**
 * 读取本关目标
 * @return {num} 本关目标
 */
LevelData.prototype.getTargetCount = function(){
    return this.oLevelInfo? this.oLevelInfo.targetCount:0;
}

/**
 * 读取本关随机Class
 * @return {num} 本关随机Class
 */
LevelData.prototype.getRandomSpriteCls = function(){
    return this.aRandomSpriteCls? this.aRandomSpriteCls:null;
}
/**
 * 读取本关速度
 * @return {num} 速度
 */
LevelData.prototype.getSpeed = function(){
    return this.oLevelInfo? this.oLevelInfo.speed:0;
}
/**
 * 读取当前关卡数
 * @return {num} 当前关卡数
 */
LevelData.prototype.getCurLvl = function(){
    return this.oLevelInfo? this.nCurLevel:0;
}
/**
 * 读取当前地鼠动画时间
 * @return {num} 当前关卡地鼠出现到消失时间间隔（动画时间 秒）
 */
LevelData.prototype.getAnimationDuration = function(){
    return this.oLevelInfo? this.oLevelInfo.animationDuration:0;
}
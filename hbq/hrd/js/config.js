/*
 * Author: bindy Yuan
 * Version: 0.1.0
 * Compile Date: 2016-09-13 11:06
*/
const config={};config.imgPath="http://7xnz8p.com1.z0.glb.clouddn.com/hbq/hrd/image/",config.audioPath="http://7xnz8p.com1.z0.glb.clouddn.com/hbq/hrd/audio/",config.preload=[config.imgPath+"story-01.png",config.imgPath+"story-02.png",config.imgPath+"story-03.png",config.imgPath+"story-04.png",config.imgPath+"story-05.png",config.imgPath+"story-06.png",config.imgPath+"story-07.png",config.imgPath+"xiang-01.png",config.imgPath+"xiang-02.png",config.imgPath+"xiang-03.png",config.imgPath+"xiang-04.png",config.imgPath+"xiang-han.png",config.imgPath+"letme-l.png",config.imgPath+"letme-r.png",config.imgPath+"hand.png",config.imgPath+"d-01.png",config.imgPath+"d-02.png",config.imgPath+"d-03.png",config.imgPath+"d-04.png",config.imgPath+"d-05.png",config.imgPath+"d-06.png",config.imgPath+"d-07.png",config.imgPath+"dongzhuo-01.png",config.imgPath+"dongzhuo-02.png",config.imgPath+"btn.png",config.imgPath+"eyes-01.png",config.imgPath+"eyes-02.png",config.imgPath+"t-01.png",config.imgPath+"t-02.png",config.imgPath+"t-03.png",config.imgPath+"t-04.png",config.imgPath+"t-05.png",config.imgPath+"t-06.png",config.imgPath+"t-07.png",config.imgPath+"t-08.png",config.imgPath+"t-09.png",config.imgPath+"t-10.png"],config.dir={UP:1,RIGHT:2,DOWN:3,LEFT:4},config.master="dq",config.winPos=[3,1],config.rectMoveTime=100,config.rect={ssx:{size:[2,1],view:"ssx.png"},bc:{size:[2,1],view:"bc.png"},lb:{size:[2,1],view:"lb.png"},hce:{size:[2,1],view:"hce.png"},dz:{size:[2,1],view:"dz.png"},cr:{size:[2,1],view:"cr.png"},hz:{size:[2,1],view:"hz.png"},vssx:{size:[1,2],view:"ssx-v.png"},vlb:{size:[1,2],view:"lb-v.png"},vcd:{size:[1,2],view:"cd-v.png"},vhx:{size:[1,2],view:"hx-v.png"},vhg:{size:[1,2],view:"hg-v.png"},b1:{size:[1,1],view:"b-01.png"},b2:{size:[1,1],view:"b-02.png"},b3:{size:[1,1],view:"b-03.png"},b4:{size:[1,1],view:"b-04.png"},dq:{size:[2,2],view:"dq.png"}},config.level=[[["ssx","","bc",""],["lb","",0,0],["hce","","dz",""],["b1","b2","dq",""],["b3","b4","",""]],[["cr","","bc",""],["hz","","dz",""],[0,"b1","b2",0],["vssx","vlb","dq",""],["","","",""]],[["b1","cr","","b2"],["vcd","dq","","vlb"],["","","",""],["vssx","b1","b2","vhg"],["",0,0,""]]],config.score=[[10,15,20,25],[15,20,25,30],[20,25,30,35]],config.scoreStar=[3,2.5,2,1.5,1];
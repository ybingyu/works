/**
 *
 * @authors Bingyu Yuan ()
 * @date    2015-01-07 16:49:16
 * @version $Id$
 */

CEIL_NUM_X = 3,
CEIL_NUM_Y = 3;
LEVEL_TIME = 30000;//关卡总时间
DOUBLE_HIT_INTERVAL = 2500;//连击间隔时间(毫秒)
/**
 * 关卡信息
 * @prama {num} id 关卡序号
 * @prama {num} speed 随机产生地鼠的时间间隔(毫秒)
 * @prama {num} heroCount 当前关卡英雄种类(maxlength 9)
 * @prama {num} soldierCount 当前关卡小兵种类(maxlength 5)
 * @prama {num} targetCount 当前关卡目标击中地鼠个数
 * @prama {num} animationDuration 当前关卡地鼠出现到消失时间间隔（动画时间 秒）
 */
LEVEL_INFO = [
    //关卡1
    {"id":1, "speed":300,"heroCount":1 ,"soldierCount":5, "targetCount":10,"animationDuration":1.8},
    // 关卡2
    {"id":2, "speed":300,"heroCount":1 ,"soldierCount":5, "targetCount":15,"animationDuration":1.5},
    // 关卡3
    {"id":3, "speed":300,"heroCount":1 ,"soldierCount":5, "targetCount":20,"animationDuration":1.4},
    // 关卡4
    {"id":4, "speed":300,"heroCount":1 ,"soldierCount":5, "targetCount":25,"animationDuration":1.3},

]

SUPER_TIT = {
    "3":"大杀特杀！",
    "4":"主宰比赛！",
    "5":"杀人如麻！",
    "6":"无人能挡！",
    "7":"变态杀戮！",
    "8":"妖怪般杀戮！",
    "9":"如同神一般！",
    "10":"超神一般的杀戮！"
}

//分数
HERO_COUNT = 5;
SOLDIER_COUNT = 1;
// 英雄cls
HERO_CLS = "hero_";
HERO_CLS_LEN = 9;
// 小兵cls
SOLDIER_CLS = "soldier_";
SOLDIER_CLS_LEN = 5;

IMGPATH = "http://7xnz8p.com1.z0.glb.clouddn.com/cos/mouse/image/"
IMG = [
        [//index 0
        "bg_b.jpg",
        "bg_m.jpg",
        "bg_t.jpg",
        "best_btn.png",
        "best_btn_h.png",
        "best_btn_dis.png",
        "game_logo.png",
        "logo.png",
        "illus_btn.png",
        "illus_tit.png",
        "illus_bg_b.png",
        "illus_bg_m.png",
        "illus_bg_t.png",
        "illus_btn_h.png",
        "illus_ok_btn.png",
        "illus_ok_btn_h.png",
        "start_btn.png",
        "start_btn_h.png",
        "rank_btn.png",
        "rank_btn_h.png",
        "index_dec_br.png",
        "next.png",
        "next_h.png"
        ],
        [//game 1
        "again.png",
        "again_h.png",
        "badge.png",
        "fail.png",
        "game_bg_b.jpg",
        "game_cover.png",
        "game_bg_m.jpg",
        "game_dec_br.png",
        "game_level.png",
        "go.png",
        "hited_01.png",
        "hited_02.png",
        "hited_03.png",
        "hited_04.png",
        "hited_05.png",
        "hole.png",
        "hole_hr_h.png",
        "hole_hr_v.png",
        "home.png",
        "home_h.png",
        "level_bg.png",
        "lvlall_tit.png",
        "lvlfail_tit.png",
        "lvlall_tit.png",
        "next.png",
        "next_h.png",
        "rank.png",
        "rank_h.png",
        "pass.png",
        "ready.png",
        "share.png",
        "share_h.png",
        "time_proc.png",
        "time_cover.png",
        "colour.png",
        "light.png",
        "illus_bg_b.png",
        "illus_bg_m.png",
        "illus_bg_t.png",
        "sprite/hero_01.png",
        "sprite/hero_02.png",
        "sprite/hero_03.png",
        "sprite/hero_04.png",
        "sprite/hero_05.png",
        "sprite/hero_06.png",
        "sprite/hero_07.png",
        "sprite/hero_08.png",
        "sprite/hero_09.png",
        "sprite/solider_01.png",
        "sprite/solider_02.png",
        "sprite/solider_03.png",
        "sprite/solider_04.png",
        "sprite/solider_05.png"
        ],
        [//rank 2
        "rank_btn_c.png",
        "rank_btn_ch.png",
        "rank_btn_l.png",
        "rank_btn_r.png",
        "rank_btn_lh.png",
        "rank_btn_rh.png",
        "rank_btns.jpg",
        "rank_tit.jpg",
        "game_bg_b.jpg",
        "game_cover.png",
        "game_bg_m.jpg",
        "next.png",
        "next_h.png"
        ],
        [//invite 3
        "bg_b.jpg",
        "bg_m.jpg",
        "bg_t.jpg",
        "friend_btn.png",
        "friend_btn_h.png",
        "help.png",
        "game_logo.png",
        "illus_btn.png",
        "illus_tit.png",
        "illus_bg_b.png",
        "illus_bg_m.png",
        "illus_bg_t.png",
        "illus_btn_h.png",
        "illus_ok_btn.png",
        "illus_ok_btn_h.png",
        "index_dec_br.png",
        "logo.png",
        "next.png",
        "next_h.png"
        ]
    ]

AUDIOPATH = "http://7xnz8p.com1.z0.glb.clouddn.com/cos/mouse/audio/";
AUDIO = [
    //index:
    [
        "bg",
        "badge"
    ],
    //game:
    [
        "badge",
        "fail",
        "hit",
        "pass",
        "readygo",
        "bg"
    ],
    //rank:
    [
        "bg"
    ],
    //invite:
    [
        "bg"
    ]
]

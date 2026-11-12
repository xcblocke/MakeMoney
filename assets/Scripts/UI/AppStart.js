//是否完成过管理工具的初始化
cc.director.initMgr = false;

function initMgr(){
    cc.Mgr = {};
    cc.Mgr.Parse = false;
    cc.Mgr.preLoadingScene = false;
    cc.Mgr.loadSound = false;
    cc.Mgr.initData = false;

    cc.Mgr.global = require("Global");
    cc.Mgr.Event = require("Event");
    cc.Mgr.ShareInfos = require("ShareInfos");
    cc.Mgr.ShareInfos.init();
    cc.Mgr.PlatformController = require("PlatformController");
    cc.Mgr.PlatformController.Init();

    cc.Mgr.AdsMgr = require("AdsMgr");
    cc.Mgr.AdsMgr.Init();

    //声音
    var AudioMgr = require("AudioMgr");
    cc.Mgr.AudioMgr = new AudioMgr();
    cc.Mgr.AudioMgr.init();
    cc.Mgr.AudioMgr.playBGM("bgm");

    var MapDataMgr = require("MapDataMgr");
    cc.Mgr.MapDataMgr = new MapDataMgr();
    cc.Mgr.MapDataMgr.initMaps(); //初始化解析数据表

    var UserDataMgr = require("UserDataMgr");
    cc.Mgr.UserDataMgr = new UserDataMgr();
}

var RankPanel = require("RankPanel");
var HistoryPanel = require("HistoryPanel");
var HonorPanel = require("HonorPanel");
var SkillPanel = require("SkillPanel");
var SkillUpPanel = require("SkillUpPanel");
var SettingPanel = require("SettingPanel");
var CommonTipPanel = require("CommonTipPanel");
cc.Class({
    extends: cc.Component,
    properties: {
        StartAtlas:cc.SpriteAtlas,
        BtnsNode:cc.Node,
        InputNode:cc.Node,
        InputText:cc.EditBox,
        SexSp:cc.Sprite,

        LoadingNode:cc.Node,
        LoadingJuHua:cc.Node,

        //面板
        rankPanel:RankPanel,
        historyPanel:HistoryPanel,
        honorPanel:HonorPanel,
        skillPanel:SkillPanel,
        skillUpPanel:SkillUpPanel,
        settingPanel:SettingPanel,
        commonTipPanel:CommonTipPanel,

        NameLbl:cc.Label,

        wxSubContextView:cc.Node,
        SwanSubContextView:cc.Node,
    },

    onLoad:function () {
        //目前我们先不保存任何数据  每次开始清理一次
        //cc.sys.localStorage.clear();
        cc.director.GlobalEvent.clear();
        this.InputNode.active = false;
        if(cc.director.initMgr == false)
        {
            cc.log("还没有初始化过");
            initMgr();
            //cc.Mgr.global.InitChangeData();
            cc.director.GlobalEvent.on(cc.Mgr.Event.ParseFinish, function(){
                cc.Mgr.UserDataMgr.initData();
                
                cc.Mgr.PlatformController.setUserCloudStorage(cc.Mgr.UserDataMgr.HistoryHighAssets);
                cc.director.initMgr = true;
            }, this);
        }
        else
        {
            //cc.log("之前有过初始化");
            cc.Mgr.global.InitChangeData();
            cc.Mgr.UserDataMgr.initData();
            cc.director.initMgr = true;
        }  
    },

    start () {
        //首先监听右上角的按钮
        cc.Mgr.PlatformController.ShareTopNav();

        cc.Mgr.PlatformController.ShowClubButton(true);

        cc.director.preloadScene("gamescene", function(){
            cc.Mgr.preLoadingScene = true;
        });

        this.NameLbl.string = cc.Mgr.PlatformController.nickName;

        this.LoadingJuHua.runAction(cc.repeatForever(cc.rotateBy(0.2,45)));

        var action = cc.sequence(
            cc.callFunc(function(){
                
            }, this),
            cc.fadeIn(2.0),
            cc.callFunc(function(){
               
            }, this),
        );
        this.BtnsNode.runAction(action);

        //注册事件监听
        cc.director.GlobalEvent.on(cc.Mgr.Event.AchieveTip, function(data){
            //cc.log("提示打开完成成就提示");
            this.commonTipPanel.node.active = true;
            this.commonTipPanel.ShowPanel(data);
        }, this);

        cc.director.GlobalEvent.on(cc.Mgr.Event.OpenUpgradeSkill, function(data){
            //cc.log("提示技能升级提示");
            this.skillUpPanel.node.active = true;
            this.skillUpPanel.ShowPanel(data);
        }, this);


        cc.Mgr.AdsMgr.ShowBannerAds();
    },

    onLoadSuccess:function() {
        
    },

    gotoGameScene:function(){
        ///* 先注册名字
        if(cc.Mgr.UserDataMgr.playerName == "")
        {
            this.InputNode.active = true;
            return;
        }
        //*/
        
        if(cc.Mgr.Parse && cc.Mgr.preLoadingScene && cc.Mgr.initData)
        {
            cc.Mgr.PlatformController.ShowClubButton(false);
            cc.Mgr.AudioMgr.playSFX("click");
            cc.director.loadScene("gamescene");
        }
    },

    ConfirmYourName:function(){
        cc.Mgr.UserDataMgr.playerName = cc.Mgr.PlatformController.nickName;
        this.InputNode.active = false;
        this.gotoGameScene();
        //if(this.InputText.string != "")
        //{
        //    cc.Mgr.AudioMgr.playSFX("click");
            ////cc.log("你选择的名字是 = "+ this.InputText.string);
        //    cc.Mgr.UserDataMgr.playerName = this.InputText.string;
        //    this.InputNode.active = false;
        //    this.gotoGameScene();
        //}
    },

    update(dt)
    {
        if(cc.Mgr.Parse && cc.Mgr.preLoadingScene && cc.Mgr.initData)
        {
            this.LoadingNode.active = false;
        }
    },

    ConfrimSexMan:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.UserDataMgr.Sex = 1;
        this.SexSp.spriteFrame = this.StartAtlas.getSpriteFrame("manIcon");
    },

    ConfrimSexWoMan:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.UserDataMgr.Sex = 2;
        this.SexSp.spriteFrame = this.StartAtlas.getSpriteFrame("womanIcon");
    },

    OpenRank:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        if(!cc.Mgr.PlatformController.IsLoginSync())
        {
            var param = {};
            param.text = "请先登陆手机百度";
            param.forWhat = "Login";
            this.commonTipPanel.node.active = true;
            this.commonTipPanel.ShowPanel(param);
            return;
        }

        cc.Mgr.PlatformController.showSubContentView();
        cc.Mgr.PlatformController.SendMessageToSubView("RankOpen");
        if(cc.Mgr.PlatformController.platform == "wx")
            this.wxSubContextView.active = true;
        else if(cc.Mgr.PlatformController.platform == "baidu")
            this.SwanSubContextView.active = true;

        if(cc.Mgr.PlatformController.platform == "wx" || cc.Mgr.PlatformController.platform == "baidu")
            this.rankPanel.node.active = true;
    },

    CloseRankView:function(){
        this.rankPanel.node.active = false;
        cc.Mgr.PlatformController.hideSubContentView();
        cc.Mgr.PlatformController.SendMessageToSubView("RankClose");
        this.wxSubContextView.active = false;
        this.SwanSubContextView.active = false;
    },

    OpenSkill:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.skillPanel.node.active = true;
        this.skillPanel.ShowPanel();
    },

    OpenAchieve:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.honorPanel.node.active = true;
        this.honorPanel.ShowPanel();
    },

    OpenRecord:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        //cc.log("历史纪录：++++++" + cc.Mgr.UserDataMgr.RecordList.length);
        if(cc.Mgr.UserDataMgr.RecordList.length == 0)
        {
            var param = {};
            param.text = "你还未有过游戏记录,请畅快游戏吧";
            param.forWhat = "";
            this.commonTipPanel.node.active = true;
            this.commonTipPanel.ShowPanel(param);
            return;
        }
        this.historyPanel.node.active = true;
        this.historyPanel.ShowPanel();
    },

    OpenCredit:function(){

    },

    OpenSetting:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.settingPanel.node.active = true;
        this.settingPanel.ShowPanel();
    },

    ShareToFriend:function(){
        var index = Math.floor(Math.random()*6);
        cc.Mgr.PlatformController.ShareToFriend(index);
    },

    ChangeName:function(){
        cc.Mgr.PlatformController.InitRandNickName();
        this.NameLbl.string = cc.Mgr.PlatformController.nickName;
    },
});

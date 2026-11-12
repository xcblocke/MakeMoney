var AchieveCond = require("AchieveCond");
var RecordStruct = require("RecordStruct");
var AdsParam = require("AdsParam");
var RetirePanel = cc.Class({
    extends: cc.Component,

    properties: {
        desLbl:cc.RichText,
        crCode:cc.Sprite,
        SkillGetLbl:cc.Label,
        ReGetLbl:cc.Label,
        roundGetSkillPoint:0,
        skillPointPanel:cc.Node,

        nameLbl:cc.Label,
        zongjieLbl:cc.Label,

        InitMoneyLbl:cc.Label,

        CompanyNode:cc.Node,
        CompanyLbl:cc.Label,

        MarryNode:cc.Node,
        MarryLbl:cc.Label,

        MillionNode:cc.Node,
        MillionLbl:cc.Label,

        TenMillionNode:cc.Node,
        TenMillionLabel:cc.Label,

        HundredMillionNode:cc.Node,
        HundredMillionLbl:cc.Label,

        RetireAgeLbl:cc.Label,
        RetireAssetLbl:cc.Label,

        HighAssetsLbl:cc.Label,
    },

    ShowPanel:function () {
        var playerName = cc.Mgr.UserDataMgr.playerName;
        var Assets = cc.Mgr.UserDataMgr.AssetsMoney;
        var hasMarry = cc.Mgr.UserDataMgr.JudeHasMarryCond();
        var hasCar = cc.Mgr.UserDataMgr.JudeHasCar();
        var hasHouse = cc.Mgr.UserDataMgr.JudeHasHouse();
        var HasFLL = cc.Mgr.UserDataMgr.JudeHasCarById(2);
        var HasGuBao = cc.Mgr.UserDataMgr.JudeHasHouseById(1);//古堡的id
        var seed = 0;//Math.floor(Math.random()*2);
        var ast = Math.floor(Assets / 10000);
        if(ast < 100 && !hasMarry)
        {
            seed = 0;
        }
        else if(ast < 100 && hasMarry)
        {
            seed = 1;
        }
        else if(ast > 100 && ast < 1000)
        {
            seed = 2;
        }
        else if(ast > 1000 && ast < 10000 && (!hasCar || !hasHouse))
        {
            seed = 3;
        }
        else if(ast > 1000 && ast < 10000 && hasCar && hasHouse)
        {
            seed = 4;
        }
        else if(ast > 10000 && (!HasFLL || !HasGuBao))
        {
            seed = 5;
        }
        else if(ast > 10000 && HasFLL && HasGuBao)
        {
            seed = 6;
        }

        var str = cc.Mgr.global.getTranslation("Retire_" + seed);
        var age = cc.Mgr.UserDataMgr.Age;
        if(cc.Mgr.global.useRetireAds == false)
            age -= 1;
        
        var HighAssets = cc.Mgr.UserDataMgr.HighAssets;

        var k=0;
        this.zongjieLbl.string = "";
        this.schedule(()=>{
            k++;
            this.zongjieLbl.string = str.substring(0,k);
        }, 0.3, str.length + 1, 0.3); 
        
        this.nameLbl.string = playerName;

        this.InitMoneyLbl.string = cc.Mgr.global.getTranslation("CashInit_"+cc.Mgr.global.InitGetMoneyId);
        
        if(cc.Mgr.UserDataMgr.MarryAge != 0)
        {
            this.MarryNode.active = true;
            var marryage = cc.Mgr.UserDataMgr.MarryAge;
            var marryrole = cc.Mgr.global.getTranslation("role_"+cc.Mgr.UserDataMgr.MarryRoleId);
            this.MarryLbl.string = marryage+"岁时同: "+ marryrole+"结成伴侣";
        }
        else
        {
            this.MarryNode.active = false;
        }

        //if(cc.Mgr.UserDataMgr.DivorceAge != 0)
        //{
        //    var marryage = cc.Mgr.UserDataMgr.DivorceAge;
        //}

        if(cc.Mgr.UserDataMgr.FundationAge != 0)
        {
            this.CompanyNode.active = true;
            var marryage = cc.Mgr.UserDataMgr.FundationAge;
            var companyName = cc.Mgr.global.getTranslation("company_" + cc.Mgr.UserDataMgr.FundationCompanyId);
            this.CompanyLbl.string = marryage+"岁时创办: "+companyName;
        }
        else
        {
            this.CompanyNode.active = false;
        }

        //if(cc.Mgr.UserDataMgr.BankruptAge != 0)
        //{
        //    var marryage = cc.Mgr.UserDataMgr.BankruptAge;
        //}

        if(cc.Mgr.UserDataMgr.MillionAge != 0)
        {
            this.MillionNode.active = true;
            var marryage = cc.Mgr.UserDataMgr.MillionAge;
            this.MillionLbl.string = marryage+"岁时资产突破百万";
        }
        else
        {
            this.MillionNode.active = false;
        }

        if(cc.Mgr.UserDataMgr.TenMillionAge != 0)
        {
            this.TenMillionNode.active = true;
            var marryage = cc.Mgr.UserDataMgr.TenMillionAge;
            this.TenMillionLabel.string = marryage+"岁时资产突破千万";
        }
        else
        {
            this.TenMillionNode.active = false;
        }

        if(cc.Mgr.UserDataMgr.HundredMillionAge != 0)
        {
            this.HundredMillionNode.active = true;
            var marryage = cc.Mgr.UserDataMgr.HundredMillionAge;
            this.HundredMillionLbl.string = marryage+"岁时进入亿万富豪榜";
        }
        else
        {
            this.HundredMillionNode.active = false;
        }

        this.RetireAgeLbl.string = age + "退休时资产:";
        this.RetireAssetLbl.string = cc.Mgr.global.FormatNum(Assets);
        this.HighAssetsLbl.string = cc.Mgr.global.FormatNum(HighAssets);

        this.desLbl.string = "";
        cc.Mgr.UserDataMgr.playTimes += 1; //玩家的游戏次数增加
        
        cc.Mgr.UserDataMgr.CreateRecord();
        this.CaculateSkillPoint();
        this.CaculateAchieveState();
    },

    ClickConfirm:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if(cc.Mgr.UserDataMgr.HistoryHighAssets < cc.Mgr.UserDataMgr.AssetsMoney)
        {
            cc.Mgr.UserDataMgr.RefreshHistoryHighAsset(cc.Mgr.UserDataMgr.AssetsMoney);
            cc.Mgr.PlatformController.setUserCloudStorage(cc.Mgr.UserDataMgr.AssetsMoney);
        }
        cc.Mgr.UserDataMgr.SaveUserData();
        cc.director.loadScene("start_scene");
    },

    ClickShare:function(){
        cc.Mgr.PlatformController.ShareToFriend(1);
    },

    //结算技能点
    CaculateSkillPoint:function(){
        var asset = Math.floor(cc.Mgr.UserDataMgr.AssetsMoney / 10000);
        var skillPoint = 0;
        if(asset <= 100)
        {
            skillPoint = 0;
        }
        else if(asset > 100 && asset <= 999)
        {
            skillPoint = Math.floor(asset/100)*10;
        }
        else if(asset >= 1000 && asset <= 9999)
        {
            skillPoint = 90 + Math.floor(asset/500)*10;
        }
        else if(asset >= 10000 && asset <= 99999)
        {
            skillPoint = 300 + Math.floor(asset/5000)*10;
        }
        else if(asset >= 100000)
        {
            skillPoint = 500;
        }
        this.ReGetLbl.node.active = false;
        var reputationSkillPoint = 0;
        if(asset >= 100)
        {
            reputationSkillPoint = Math.floor(cc.Mgr.UserDataMgr.Reputation / 2);
            if (reputationSkillPoint > 50)
            {
                this.ReGetLbl.node.active = true;
                reputationSkillPoint = 500;
            }
        }

        this.roundGetSkillPoint += skillPoint + Math.floor(skillPoint * (cc.Mgr.UserDataMgr.SkillPointGetBonus / 100)) + reputationSkillPoint;
        cc.Mgr.UserDataMgr.SkillBonusPoint += this.roundGetSkillPoint;
        this.SkillGetLbl.string = this.roundGetSkillPoint;
        //cc.log("本局获得的技能点 = " + this.roundGetSkillPoint);
        this.skillPointPanel.active = true;
        if(this.roundGetSkillPoint == 0)
            this.skillPointPanel.active = false;
        //cc.Mgr.UserDataMgr.SkillBonusPoint = skillPoint + Math.floor(skillPoint * (cc.Mgr.UserDataMgr.SkillPointGetBonus / 100));
    },

    DoubleSkillPoint:function(){
        var self = this;
        cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointE, function(out){
            if(out == 0)
            {
                cc.Mgr.UserDataMgr.SkillBonusPoint += self.roundGetSkillPoint;
                self.CloseDoublePanel();
            }
        }); 
        
        //var index = Math.floor(Math.random()*6);
        //cc.Mgr.PlatformController.ShareToFriend(index);
    },

    CloseDoublePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.skillPointPanel.active = false;
    },

    //结算是否完成了 成就
    CaculateAchieveState:function()
    {
        var AchievementList = cc.Mgr.UserDataMgr.AchievementList;
        for (var i = 0; i < AchievementList.length; i++) {
            var dt = AchievementList[i];
            if(!dt.hasFinish)
            {
                cc.Mgr.UserDataMgr.JudeFinishAnyAchievement(dt.Id);
            }
        }
    },

    
});
module.exports = RetirePanel;
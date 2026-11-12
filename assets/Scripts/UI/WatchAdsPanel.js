var TempBonus = require("TempBonus");
var AdsParam = require("AdsParam");
var MateUnLockType = require("MateUnLockType");
var WatchAdsPanel = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        LoveGod:cc.Sprite,
        BetGod:cc.Sprite,
        MammomGod:cc.Sprite,
        StockGod:cc.Sprite,

        BtnLbl:cc.Sprite,
        BtnIconSp:cc.Sprite,
        BtnBgSp:cc.Sprite,

        forWhat:{
        	default:TempBonus.NULL,
        	type:TempBonus,
        },//是为了干嘛用的

        CloseAni:cc.Animation,
    },

    ShowPanel:function(data){
        this.LoveGod.node.active = false;
        this.BetGod.node.active = false;
        this.MammomGod.node.active = false;
        this.StockGod.node.active = false;
        this.CloseAni.play("ShowLater");

        if(data.Sp == "aishen")
        {
        	this.forWhat = TempBonus.LoveBonus;
            this.LoveGod.node.active = true;
            this.ShowBtnActive(cc.Mgr.global.hasActiveAiShen);
        }
        if(data.Sp == "dushen")
        {
        	this.forWhat = TempBonus.BetBonus;
            this.BetGod.node.active = true;
            this.ShowBtnActive(cc.Mgr.global.hasActiveDuShen);
        }
        if(data.Sp == "caishen")
        {
        	this.forWhat = TempBonus.AssetBonus;
            this.MammomGod.node.active = true;
            this.ShowBtnActive(cc.Mgr.global.hasActiveCaiShen);
        }
        if(data.Sp == "gushen")
        {
        	this.forWhat = TempBonus.StockBonus;
            this.StockGod.node.active = true;
            this.ShowBtnActive(cc.Mgr.global.hasActiveGuShen);
        }
    },

    ShowBtnActive:function(active){
        if(active)
        {
            this.BtnLbl.spriteFrame = this.Atlas.getSpriteFrame("active_txt_y");
            this.BtnLbl.node.setPosition(cc.v2(0,2));
            this.BtnIconSp.node.active = false;
            this.BtnBgSp.spriteFrame = this.Atlas.getSpriteFrame("btn_gray");
        }
        else
        {
            this.BtnLbl.spriteFrame = this.Atlas.getSpriteFrame("video_active_txt");
            this.BtnLbl.node.setPosition(cc.v2(36,2));
            this.BtnIconSp.node.active = true;
            this.BtnBgSp.spriteFrame = this.Atlas.getSpriteFrame("blueBtnBg");
        }
    },

    ClickBtn:function(){
    	//cc.Mgr.global.TempAdsBonus = this.forWhat;
    	if(this.forWhat == TempBonus.LoveBonus)
    	{
            if(cc.Mgr.global.hasActiveAiShen)
                return;

            var self = this;
            cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointG, function(out){
                if(out == 0)
                {
                    cc.Mgr.UserDataMgr.UnLockOneMate(MateUnLockType.ToDate, cc.Mgr.UserDataMgr.Sex);
                    cc.Mgr.global.TempAdsBonus = TempBonus.NULL;
                    cc.Mgr.global.hasActiveAiShen = true;
                    self.node.active = false;
                }
            }); 
    	}
    	else if(this.forWhat == TempBonus.BetBonus)
    	{
            if(cc.Mgr.global.hasActiveDuShen)
                return;
            var self = this;
            cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointH, function(out){
                if(out == 0)
                {
                    cc.Mgr.global.TempAdsBetBonus = TempBonus.BetBonus;
                    cc.Mgr.global.hasActiveDuShen = true;
                    self.node.active = false;
                }
            });
    	}
    	else if(this.forWhat == TempBonus.StockBonus)
    	{
            if(cc.Mgr.global.hasActiveGuShen)
                return;
            var self = this;
            cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointI, function(out){
                if(out == 0)
                {
                    cc.Mgr.global.TempAdsStockBonus = TempBonus.StockBonus;
                    cc.Mgr.global.hasActiveGuShen = true;
                    self.node.active = false;
                }
            });
    	}
    	else if(this.forWhat == TempBonus.AssetBonus)
    	{
            if(cc.Mgr.global.hasActiveCaiShen)
                return;

            var self = this;
            cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointJ, function(out){
                if(out == 0)
                {
                    cc.Mgr.global.TempAdsAssetBonus = TempBonus.AssetBonus;
                    cc.Mgr.global.hasActiveCaiShen = true;
                    self.node.active = false;
                }
            });
    	}
    },

    ClosePanel:function()
    {
        this.node.active = false;
    },
});
module.exports = WatchAdsPanel;

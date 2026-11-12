var AdsParam = require("AdsParam");
var CommonTipPanel = require("CommonTipPanel");
var SkillPanel = cc.Class({
    extends: cc.Component,

    properties: {
        skillParent_1:cc.Node,
        skillParent_2:cc.Node,
        skillParent_3:cc.Node,
        skillParent_4:cc.Node,

        itemPre:cc.Prefab,

        SkillPointLbl:cc.Label,

        CommonTip:CommonTipPanel,
    },

    InitPanel:function(){
        var list_1 = cc.Mgr.UserDataMgr.getSkillListById(1);
        var list_2 = cc.Mgr.UserDataMgr.getSkillListById(2);
        var list_3 = cc.Mgr.UserDataMgr.getSkillListById(3);
        var list_4 = cc.Mgr.UserDataMgr.getSkillListById(4);

        for (var i = list_1.length - 1; i >= 0; i--) {
            var data = list_1[i];
            var obj = cc.instantiate(this.itemPre);
            obj.parent = this.skillParent_1;
            obj.active = true;
            obj.getComponent("SkillItem").ShowData(data, list_1.length);
        }

        for (var i = list_2.length - 1; i >= 0; i--) {
            var data = list_2[i];
            var obj = cc.instantiate(this.itemPre);
            obj.parent = this.skillParent_2;
            obj.active = true;
            obj.getComponent("SkillItem").ShowData(data, list_2.length);
        }

        for (var i = list_3.length - 1; i >= 0; i--) {
            var data = list_3[i];
            var obj = cc.instantiate(this.itemPre);
            obj.parent = this.skillParent_3;
            obj.active = true;
            obj.getComponent("SkillItem").ShowData(data, list_3.length);
        }

        for (var i = list_4.length - 1; i >= 0; i--) {
            var data = list_4[i];
            var obj = cc.instantiate(this.itemPre);
            obj.parent = this.skillParent_4;
            obj.active = true;
            obj.getComponent("SkillItem").ShowData(data, list_4.length);
        }
    },

    RefreshPanel:function(){
        this.SkillPointLbl.string = cc.Mgr.UserDataMgr.SkillBonusPoint;
        
        var children_1 = this.skillParent_1.children;
        var children_2 = this.skillParent_2.children;
        var children_3 = this.skillParent_3.children;
        var children_4 = this.skillParent_4.children;

        var list_1 = cc.Mgr.UserDataMgr.getSkillListById(1);
        var list_2 = cc.Mgr.UserDataMgr.getSkillListById(2);
        var list_3 = cc.Mgr.UserDataMgr.getSkillListById(3);
        var list_4 = cc.Mgr.UserDataMgr.getSkillListById(4);

        for (var i = children_1.length - 1; i >= 0; i--) {
            var sc = children_1[i].getComponent("SkillItem");
            if(sc != null)
            {
                if(list_1[list_1.length - i - 1] != null)
                {
                    sc.ShowData(list_1[list_1.length - i - 1], list_1.length);
                }
            }
        }

        for (var i = children_2.length - 1; i >= 0; i--) {
            var sc = children_2[i].getComponent("SkillItem");
            if(sc != null)
            {
                if(list_2[list_2.length - i - 1] != null)
                {
                    sc.ShowData(list_2[list_2.length - i - 1], list_2.length);
                }
            }
        }

        for (var i = children_3.length - 1; i >= 0; i--) {
            var sc = children_3[i].getComponent("SkillItem");
            if(sc != null)
            {
                if(list_3[list_3.length - i - 1] != null)
                {
                    sc.ShowData(list_3[list_3.length - i - 1], list_3.length);
                }
            }
        }

        for (var i = children_4.length - 1; i >= 0; i--) {
            var sc = children_4[i].getComponent("SkillItem");
            if(sc != null)
            {
                if(list_4[list_4.length - i - 1] != null)
                {
                    sc.ShowData(list_4[list_4.length - i - 1], list_4.length);
                }
            }
        }

    },

    ShowPanel:function () {
        var children = this.skillParent_1.children;
        this.SkillPointLbl.string = cc.Mgr.UserDataMgr.SkillBonusPoint;
        if(children.length == 0)
        {
            //cc.log("第一次初始化");
            this.InitPanel();
        }
        else
        {
            //cc.log("刷新============");
            this.RefreshPanel();
        }
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.UserDataMgr.SaveUserData();
        cc.Mgr.UserDataMgr.initData();
        this.node.active = false;
    },

    ShowAds:function()
    {
        cc.Mgr.AudioMgr.playSFX("click");
        
        if(cc.Mgr.UserDataMgr.VideoAdsTimes >= 3)
        {
            this.CommonTip.node.active = true;
            var param = {};
            param.text = "今天的广告次数已经用完。明天再来";
            var testDate = new Date();
            cc.Mgr.UserDataMgr.VideoLastTime = testDate.toDateString();
            this.CommonTip.ShowPanel(param);
        }
        else
        {
            var self = this;
            cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointA, function(out){
                if(out == 0)
                {
                    cc.Mgr.UserDataMgr.SkillBonusPoint += 150;
                    cc.Mgr.UserDataMgr.VideoAdsTimes += 1;
                    self.RefreshPanel();
                    self.SkillPointLbl.string = cc.Mgr.UserDataMgr.SkillBonusPoint;
                }
                else
                {
                    console.log("视频广告没有看完或者加载出错");
                }
            });
            
        }
        

        //this.CommonTip.node.active = true;
        //var param = {};
        //param.text = "目前广告还未开放，敬请期待";
        //this.CommonTip.ShowPanel(param);
    },

});
module.exports = SkillPanel;

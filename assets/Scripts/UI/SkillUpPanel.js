var SkillPanel = require("SkillPanel");
var ItemType = require("ItemType");
var SkillUpPanel = cc.Class({
    extends: cc.Component,

    properties: {
        skillPanel:SkillPanel,
        titleLbl:cc.Label,
        Data:null,
        DesNull:cc.Label,
        DesNormal:cc.Node,

        des1:cc.Label,
        des2:cc.Label,
        costLbl:cc.Label,
    },

    ShowPanel:function(data){
        this.Data = null;
        this.Data = data;
        this.titleLbl.string = data.name;
        //cc.log("草泥马哦" + this.Data.level);
        if(data.Uplv == data.level)
        {
            this.DesNull.node.active = true;
            this.DesNormal.active = false;
            this.DesNull.string = cc.Mgr.global.getTranslation("Tf_"+data.desId)+ "\n技能已升至满级";
        }
        else
        {
            this.DesNull.node.active = false;
            this.DesNormal.active = true;
            var bonuscur = cc.Mgr.MapDataMgr.getSkillAddBonusByTwoIdAndLv(data.Id, data.subId, data.level);
            var bonusnext = cc.Mgr.MapDataMgr.getSkillAddBonusByTwoIdAndLv(data.Id, data.subId, (data.level+1));
            
            this.des1.string = cc.Mgr.global.getTranslation("Tf_"+data.desId);
            this.costLbl.string = cc.Mgr.MapDataMgr.getUpgradeCostByTwoId(data.Id, data.subId, (data.level + 1));
            if(data.level == 0)
            {
                this.des1.string = cc.Mgr.global.getTranslation("Tf_"+data.desId);
                if(bonusnext < 1)
                    this.des2.string = (bonusnext * 100) + "%";
                else
                    this.des2.string = bonusnext;
            }
            else
            {
                if(bonusnext < 1)
                    this.des2.string = (bonuscur * 100) + "% - " + (bonusnext * 100);
                else
                    this.des2.string = bonuscur +"—"+bonusnext;
            }
        }
    },

    ClickUpGrade:function(){
        if(this.Data.Uplv == this.Data.level)
        {
            this.ClosePanel();
            return;
        }

        var re = cc.Mgr.UserDataMgr.UpGradeSkill(this.Data.Id, this.Data.subId, (this.Data.level + 1));
        if(re == false)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            this.DesNull.node.active = true;
            this.DesNormal.active = false;
            this.DesNull.string = "升级技能失败\n(技能点不足或者未点亮上一个天赋)";
        }
        else
        {
            this.skillPanel.RefreshPanel();
            //cc.Mgr.UserDataMgr.SkillBonusPoint -= cc.Mgr.MapDataMgr.getUpgradeCostByTwoId(this.Data.Id, this.Data.subId, (this.Data.level + 1));
            this.ClosePanel();
        }

    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },
});
module.exports = SkillUpPanel;

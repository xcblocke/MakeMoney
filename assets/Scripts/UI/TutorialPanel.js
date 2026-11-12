var TutorialStep = require("TutorialStep"); 
var TutorialPanel = cc.Class({
    extends: cc.Component,

    properties: {
        DesLbl:cc.Label,
        step:1, //记录引导步骤

        Finger:cc.Node,
        EffectCircle:cc.Node,

        TpObj:cc.Node,
        DesObj:cc.Node,
        //下面是引导点位置
        pos11:cc.Node,
        pos12:cc.Node,
        pos13:cc.Node,
        pos14:cc.Node,
        pos15:cc.Node,

        pos21:cc.Node,
        pos22:cc.Node,

        pos31:cc.Node,
        pos32:cc.Node,

        callFunc:null,
    },

    ShowPanel:function(dt)
    {
        this.step = dt.step;
        //cc.log("设定位置============" + this.step);
        var des = "tutorial_"+this.step;
        this.DesLbl.string = cc.Mgr.global.getTranslation(des);
        switch(this.step){
            case 11:
            this.SetTpObjPos(this.pos11.getPosition(),11);
            break;
            case 12:
            this.SetTpObjPos(this.pos12.getPosition(),12);
            break;
            case 13:
            this.SetTpObjPos(this.pos13.getPosition(),13);
            break;
            case 14:
            this.SetTpObjPos(this.pos14.getPosition(),14);
            break;
            case 15:
            this.SetTpObjPos(this.pos15.getPosition(), 15);
            break;
            case 21:
            this.SetTpObjPos(this.pos21.getPosition(),21);
            break;
            case 22:
            this.SetTpObjPos(this.pos22.getPosition(),22);
            break;
            case 31:
            this.SetTpObjPos(this.pos31.getPosition(), 31);
            break;
            case 32:
            this.SetTpObjPos(this.pos32.getPosition(), 32);
            break;
            case 41:
            this.SetTpObjPos(this.pos32.getPosition(), 41);
            break;
            case 51:
            this.SetTpObjPos(this.pos32.getPosition(), 51);
            break;
            default:
            this.ClosePanel();
            break;
        }
    },

    ClosePanel:function(){
        this.node.active = false;
    },

    SetCallFunc:function(func){
        this.callFunc = null;
        this.callFunc = func;
    },

    SetTpObjPos:function(pos, tutorrialId)
    {
        //cc.log("设定位置============");
        this.TpObj.setPosition(pos);
        if(tutorrialId == 12 || tutorrialId == 15)
            this.DesObj.setPosition(30,145);
        else
            this.DesObj.setPosition(-110,145);


        if(tutorrialId == TutorialStep.DateToMarry_1 || tutorrialId == TutorialStep.MateDate_2 || tutorrialId == TutorialStep.Business_2 || tutorrialId == TutorialStep.StockBonus_1)
        {
            this.Finger.active = false;
            this.EffectCircle.active = false;
        }
        else
        {
            this.Finger.active = true;
            this.EffectCircle.active = true;
        }
    },

    StartTutorialStep:function()
    {
        if(this.callFunc != null && typeof this.callFunc == "function")
        {
            this.callFunc();
            //cc.log("_________________________________________");
        }
    },

    StartSpNextTutorialStep:function()
    {
        if(this.step == TutorialStep.DateToMarry_1 || this.step == TutorialStep.MateDate_2 || this.step == TutorialStep.Business_2 || this.step == TutorialStep.StockBonus_1)
        {   
            cc.Mgr.AudioMgr.playSFX("click");
            if(this.callFunc != null && typeof this.callFunc == "function")
            {
                this.callFunc();
            }
        }
    },
});
module.exports = TutorialPanel;

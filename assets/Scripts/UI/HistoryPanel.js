
var HistoryPanel = cc.Class({
    extends: cc.Component,

    properties: {
        nameLbl:cc.Label,
        personNum:cc.Label,
        assetHigh:cc.Label,
        retireAsset:cc.Label,
        Million:cc.Label,
        TenMillion:cc.Label,
        HundredMillion:cc.Label,
    },

    ShowPanel:function () {
        this.nameLbl.string = cc.Mgr.UserDataMgr.playerName;
        this.personNum.string = cc.Mgr.UserDataMgr.playTimes;

        var param = this.getRecordData();
        this.assetHigh.string = param.highAsset;
        this.retireAsset.string = param.as;
        this.Million.string = param.milltimes;
        this.TenMillion.string = param.thousend;
        this.HundredMillion.string = param.hundredmill;
    },

    getRecordData:function(){
        //cc.log(JSON.stringify(cc.Mgr.UserDataMgr.RecordList))
        var list = cc.Mgr.UserDataMgr.RecordList;
        var allasset = 0;
        var milltimes = 0;
        var thousend = 0;
        var hundredmill = 0;
        var highAsset = list[0].highAssets;
        for (var i = 0; i < list.length; i++) {
            allasset += list[i].assets;
            if(list[i].highAssets > highAsset)
            {
                highAsset = list[i].highAssets;
            }
            if(list[i].level == 1)
            {
                milltimes += 1;
            }
            else if(list[i].level == 2)
            {
                thousend += 1;
            }
            else if(list[i].level == 3)
            {
                hundredmill += 1;
            }
        }

        var as = Math.floor(allasset / list.length);
        var param = {};
        param.as = as;
        param.milltimes = milltimes;
        param.thousend = thousend;
        param.hundredmill = hundredmill;
        param.highAsset = highAsset;
        return param;
    },

    ChangeName:function(){
        //cc.log("===========");
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },

});
module.exports = HistoryPanel;

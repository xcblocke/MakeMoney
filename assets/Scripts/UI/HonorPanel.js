
var HonorPanel = cc.Class({
    extends: cc.Component,

    properties: {
        itemParent:cc.Node,
        itemPre:cc.Prefab,
    },

    InitPanel:function(){
    	var DataList = cc.Mgr.UserDataMgr.AchievementList;
    	for (var i = 0; i <= DataList.length - 1; i++) {
    		var data = DataList[i];
            var obj = cc.instantiate(this.itemPre);
            obj.parent = this.itemParent;
            obj.active = true;
            obj.getComponent("HonorItem").ShowData(data);
    	}
    },

    RefreshPanel:function(){
    	var DataList = cc.Mgr.UserDataMgr.AchievementList;
    	var children = this.itemParent.children;
    	for (var i = 0; i <= children.length -1; i++) {
    		var data = DataList[i];
    		var sc = children[i].getComponent("HonorItem");
   			if(sc != null)
   			{
   				sc.ShowData(DataList[i]);
   			}
    	}
    },

    ShowPanel:function () {
    	var children = this.itemParent.children;
    	if(children.length == 0)
    	{
    		this.InitPanel();
    	}
    	else
    	{
    		this.RefreshPanel();
    	}
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
    	this.node.active = false;
    },

    
});
module.exports = HonorPanel;

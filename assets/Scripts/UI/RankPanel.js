
var RankPanel = cc.Class({
    extends: cc.Component,

    properties: {

    },

   	ShowPanel:function(DataList){
      /*
   		var index = 0;
   		var children = this.itemParent.children;
   		for (var j = 0; j <= children.length - 1; j++) {
   			var sc = children[i].getComponent("RankItem");
   			if(sc != null)
   			{
   				if(DataList[j] != null)
   				{
   					sc.ShowData(DataList[j]);
   					index = j;
   				}
   				else
   				{
   					children[i].active = false;
   				}
   			}
   		}
   		//如果需要重新初始化一些实例
   		if(index < DataList.length-1)
   		{
   			for (var i = index + 1; i <= DataList.length-1; i++) {
	   			var data = DataList[i];
	            var obj = cc.instantiate(this.rankPre);
	            obj.parent = this.itemParent;
	            obj.active = true;
	            obj.getComponent("RankItem").init(data);
	   		}
   		}
      */
   	},
});

var AchieveCondData = require("AchieveCondData");
var AchieveData = cc.Class({
    name:"AchieveData",

    properties: {
    	name:"",
    	icon:"",
        Id:cc.Integer,
        desId:cc.Integer,
        condList:[AchieveCondData],
       //额外条件 
    },
});
module.exports = AchieveData;

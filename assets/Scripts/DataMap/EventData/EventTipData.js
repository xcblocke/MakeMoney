var EventCost = require("EventCost");
var EventResult = require("EventResult");
var EventTipData = cc.Class({
    name:"EventTipData",
    properties: {
        name:"",
        Id:cc.Integer,
        desId:cc.Integer,
    	cost:[EventCost],
    	YResults:[EventResult],
    	NResults:[EventResult],
    },
});
module.exports = EventTipData;

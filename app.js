var sm = require('./NodeStateMachine.js');

var data = [{
        State: "已投递",
        Entry: function (event) {
            console.log("进入状态：" + this.State + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data) + " 事件数据：" + JSON.stringify(event.data));
            return true;
        },
        Exit: function () {
            console.log("退出状态：" + this.State);
            return true;
        },
        TransferList: [{
                Target: "已查看",
                Condition: function (event) {
                    if (event.name == "查看") {
                        return true;
                    }
                    else {
                        return false;
                    }
                } ,
                Action: function (prev, event) {
                    console.log("状态变更：" + prev + " -> " + this.Target + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
                    return true;
                }
            }, {
                Target: "未通过",
                Condition: function (event) {
                    if (event.name == "拒绝") {
                        return true;
                    }
                    else {
                        return false;
                    }
                } ,
                Action: function (prev, event) {
                    console.log("状态变更：" + prev + " -> " + this.Target + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
                    return true;
                }
            }]
    }, {
        State: "已查看",
        Entry: function (event) {
            console.log("进入状态：" + this.State + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
            return true;
        },
        Exit: function () {
            console.log("退出状态：" + this.State);
            return true;
        },
        TransferList: [{
                Target: "已内推",
                Condition: function (event) {
                    if (event.name == "内推") {
                        return true;
                    }
                    else {
                        return false;
                    }
                } ,
                Action: function (prev, event) {
                    console.log("状态变更：" + prev + " -> " + this.Target + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
                    return true;
                }
            }, {
                Target: "未通过",
                Condition: function (event) {
                    if (event.name == "拒绝") {
                        return true;
                    }
                    else {
                        return false;
                    }
                } ,
                Action: function (prev, event) {
                    console.log("状态变更：" + prev + " -> " + this.Target + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
                    return true;
                }
            }]
    }, {
        State: "已内推",
        Entry: function (event) {
            console.log("进入状态：" + this.State + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
            return true;
        },
        Exit: function () {
            console.log("退出状态：" + this.State);
            return true;
        },
        TransferList: [{
                Target: "未通过",
                Condition: function (event) {
                    if (event.name == "拒绝") {
                        return true;
                    }
                    else {
                        return false;
                    }
                } ,
                Action: function (prev, event) {
                    console.log("状态变更：" + prev + " -> " + this.Target + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
                    return true;
                }
            }]
    }, {
        State: "未通过",
        Entry: function (event) {
            console.log("进入状态：" + this.State + " 事件名：" + event.name + " 事件数据：" + JSON.stringify(event.data));
            return true;
        },
        Exit: function () {
            console.log("退出状态：" + this.State);
            return true;
        },
        TransferList: []
    }];

var stateMachine = sm.getStateMachine(data);
if (stateMachine instanceof String) {
    console.log(stateMachine);
    return;
}

var checkResult = stateMachine.selfCheck();
if (checkResult.length < 1) {
    var userdata = {
        userid: 0
    };
    console.log("----开始状态为 已投递，触发事件 查看");
    var trigger = stateMachine.trigger("已投递", sm.createEvent("查看", userdata));
    console.log(trigger);
    
    console.log("\n----开始状态为 已查看，触发事件 内推");
    var trigger = stateMachine.trigger("已查看", sm.createEvent("内推", userdata));
    console.log(trigger);
    
    console.log("\n----开始状态为 已内推，触发事件 拒绝");
    var trigger = stateMachine.trigger("已内推", sm.createEvent("拒绝", userdata));
    console.log(trigger);
    
    console.log("\n----开始状态为 已投递，触发事件 拒绝");
    var trigger = stateMachine.trigger("已投递", sm.createEvent("拒绝", userdata));
    console.log(trigger);
    
    console.log("\n----开始状态为 已投递，触发事件 无转移事件");
    var trigger = stateMachine.trigger("已投递", sm.createEvent("无转移事件", userdata));
    console.log(trigger);
    console.log("\n----结束");
} else {
    console.warn("状态机自检失败，原因：\n" + checkResult.join("\n"));
}
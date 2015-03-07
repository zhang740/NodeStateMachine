function StateMachine(data) {
    var states = this.states = {};
    for (var i = 0, length = data.length; i < length; i++) {
        if (states[data[i].State]) {
            console.error("状态机初始化异常，状态：" + data[i].State + " 重复定义，可能会导致预期外结果。");
        }
        states[data[i].State] = data[i];
    }
}
StateMachine.prototype.selfCheck = function () {
    var result = [], states = this.states;
    for (var st in states) {
        var tl = states[st].TransferList;
        if (tl instanceof Array) {
            for (var i = 0, tlength = tl.length; i < tlength; i++) {
                if (!tl[i].Target || !states[tl[i].Target]) {
                    result.push("状态：" + st + " 中目标状态：" + tl[i].Target + " 不存在");
                }
            }
        }
    }
    return result;
};
StateMachine.prototype.trigger = function (state, event) {
    var nowstate = this.states[state], states = this.states;
    if (!(nowstate.TransferList instanceof Array)) {
        return false;
    }
    for (var i = 0, length = nowstate.TransferList.length; i < length; i++) {
        var tl = nowstate.TransferList[i];
        if (!tl["Condition"] || tl.Condition(event) != false) {
            if (!nowstate["Exit"] || nowstate.Exit(event) != false) {
                if (!tl["Action"] || tl.Action(nowstate.State, event) != false) {
                    if (!states[tl.Target]["Entry"] || states[tl.Target].Entry(event)) {
                        return true;
                    } else {
                        console.error("状态：" + tl.Target + " 进入失败。");
                    }
                } else {
                    console.error("状态转移：" + nowstate.State + " -> " + tl.Target + " 转移失败。");
                }
            } else {
                console.error("状态：" + nowstate.State + " 退出失败。");
            }
        }
    }
    return false;
};

function Event(name, data) {
    this.name = name;
    this.data = data;
}

exports.getStateMachine = function (data) {
    if (!(data instanceof Array)) return "数据不正确";
    return new StateMachine(data);
};

exports.createEvent = function (name, data) {
    return new Event(name, data);
}
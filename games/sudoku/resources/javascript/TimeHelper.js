let TimeHelper = (function() {

    let normalizeTime = function(time) {
        let t = "";
        t += time < 10 ? "0" + time : time;
        return t;
    }

    let parse = function(timeObj) {
        //let timeObjForParsing = this || timeObj;
        let time = "";
        time += normalizeTime(timeObj.hours);
        time += ":" + normalizeTime(timeObj.minutes);
        time += ":" + normalizeTime(timeObj.seconds);
        return time;
    }

    return {
        normalizeTime,
        parse
    }
})();
// 随机数
export const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 格式化时间 时间戳  分秒
export const formatTime = (timestamp) => {
    var duration = parseInt(timestamp / 1000);
    var minute = parseInt(duration / 60);
    var sec = (duration % 60) + "";
    var isM0 = ":";
    if (minute === 0) {
        minute = "00";
    } else if (minute < 10) {
        minute = "0" + minute;
    }
    if (sec.length === 1) {
        sec = "0" + sec;
    }
    return minute + isM0 + sec;
};

// 格式化时间 ms 年月日
export function timestampToTime(timestamp) {
    if (timestamp === 0 || timestamp == null) {
        return ''
    } else {
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return Y + M + D
    }
}


// 秒转换分钟00:00:00格式
export function timeToMinute(times) {
    var t;
    if (times > -1) {
        var hour = Math.floor(times / 3600);
        var min = Math.floor(times / 60) % 60;
        var sec = times % 60;
        if (hour < 10) {
            t = '0' + hour + ":";
        } else {
            t = hour + ":";
        }

        if (min < 10) { t += "0"; }
        t += min + ":";
        if (sec < 10) { t += "0"; }
        t += sec.toFixed(2);
    }
    t = t.substring(0, t.length - 3);
    return t;

}


//格式化索引
export const formatIndex = (index) => {
    if (index < 9) {
        return '0' + (index + 1);
    } else {
        return index + 1
    }
}


// 格式化播放数

export function numberFormat(value) {
    var param = {};
    var k = 10000,
        sizes = ['', '万', '亿', '万亿'],
        i;
    if (value < k) {
        param.value = value
        param.unit = ''
    } else {
        i = Math.floor(Math.log(value) / Math.log(k));
        param.value = ((value / Math.pow(k, i))).toFixed(2);
        param.unit = sizes[i];
    }
    return param.value + param.unit;
}


// 节流
export function throttle(func, delay) {
    let pre = 0
    return function () {
        let now = new Date();
        if (now - pre >= delay) {
            func();
            pre = now;
        }
    }
}





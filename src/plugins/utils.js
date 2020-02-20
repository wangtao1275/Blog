/**
 * ES6 之 对象的简写方式
简写有两条基本原则：

同名的属性可以省略不写
对象中的方法中的 : function 可以省略不写
 */

export const utils = {
  /**
   *
   *
   * @param {String} name
   * @param {String} value
   * @param {Number || String} day
   */
  setCookie: function(name, value, day) {
    if (day) {
      const Days = day;
      const exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie =
        name +
        "=" +
        escape(value) +
        ";expires=" +
        exp.toUTCString() +
        ";domain=" +
        location.hostname +
        ";path=/";
    } else {
      document.cookie =
        name + "=" + escape(value) + ";domain=" + location.hostname + ";path=/";
    }
  },

  /**
   *
   *
   * @param {String} name
   * @returns
   */
  getCookie: function(name) {
    let arr;
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  },

  // 删除cookies
  delCookie: function(name) {
    utils.setCookie(name, " ", -1);
  },

  /**
   *
   *日期转化工具，根据传入时间与当前时间进行对比，超过一天以日为单位，超过一小时以小时为单位，其他以分钟单位
   * @param {*} date
   * @returns
   */
  dateSwitch: function(date) {
    if (!date) return;
    const nowTime = Date.parse(new Date());
    const createTime =
      Date.parse(new Date(date)) ||
      Date.parse(new Date(date.replace(/-/g, "/")));
    if (createTime > nowTime) return;
    const nowDays = Math.round(nowTime / 1000 / 60 / 60 / 24);
    const createDays = Math.round(createTime / 1000 / 60 / 60 / 24);
    if (nowDays !== createDays) {
      if (nowDays - createDays > 3) {
        return date;
      } else {
        return nowDays - createDays + "天前";
      }
    }

    const time = nowTime - createTime;
    const minutesRound = Math.ceil(time / 1000 / 60);
    if (minutesRound < 60) {
      if (minutesRound < 1) {
        return "刚刚";
      } else {
        return minutesRound + "分钟前";
      }
    }
    const hoursRound = Math.floor(time / 1000 / 60 / 60);
    return hoursRound + "小时前";
  },

  /**
   * 倒计时
   * @param {*2019-06-14 16:25:53} time
   * 目标日期必须大于当前日期
   * @returns
   */
  getDistanceTime(time) {
    if (!time) return;
    const endTime = new Date(Date.parse(time.replace(/-/g, "/")));
    const nowTime = new Date();
    const distance = endTime.getTime() - nowTime.getTime();
    let day = 0,
      hour = 0,
      minute = 0;
    if (distance >= 0) {
      day = Math.floor(distance / 1000 / 60 / 60 / 24);
      hour = Math.floor((distance / 1000 / 60 / 60) % 24);
      minute = Math.floor((distance / 1000 / 60) % 60);
    } else {
      return;
    }
    return day + "天" + hour + "时" + minute + "分";
  },

  /**
   *匹配数字格式
   *
   * @param {*} val
   */
  calViewNum(val) {
    val = parseInt(val);
    if (val < 10000) {
      return val + "";
    } else if (val >= 10000 && val < 100000) {
      return (val / 10000).toFixed(1) + "万";
    } else if (val >= 100000 && val < 1000000) {
      return Math.floor(val / 10000) + "万";
    } else if (val >= 1000000) {
      return "100万+";
    } else {
      return "";
    }
  },

  /**
   *
   *获取滚动条当前的位置
   * @returns
   */
  getScrollTop: function() {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return parseInt(scrollTop);
  },

  /**
   *获取当前可视范围的高度
   *
   * @returns
   */
  getScrollHeight: function() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  },

  /**
   *获取文档完整的高度
   *
   * @returns
   */
  getClientHeight: function() {
    let clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    } else {
      clientHeight = Math.max(
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    }
    return clientHeight;
  },

  /**
   * 格式化查询参数，去掉空元素
   *
   * @param {*} data
   * @returns
   */
  formatParams(data) {
    if (!Object.keys(data).length) {
      return {};
    }

    for (const key in data) {
      if (["", null, "-999"].indexOf(data[key]) > -1) {
        delete data[key];
      }
    }
    return data;
  }
};

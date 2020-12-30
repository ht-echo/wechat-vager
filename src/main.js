import Vue from "vue";
import App from "./App";
import store from "./store/index";
//--------------------
//----华丽的分割线-----
//--------------------
import Toast from "./wxcomponents/vant/weapp/toast/toast";
Vue.prototype.$Toast = Toast;
import Notify from "./wxcomponents/vant/weapp/notify/notify";
Vue.prototype.$Notify = Notify;

Vue.config.productionTip = false;
App.mpType = "app";
Vue.prototype.towxml = require("./wxcomponents/custom/towxml/index.js");
// 增加一个名为 isPicture 的函数作为
// String 构造函数的原型对象的一个方法。
String.prototype.$isPicture = function() {
  //判断是否是图片 - strFilter必须是小写列举
  var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|.svg|";
  if (this.indexOf(".") > -1) {
    var p = this.lastIndexOf(".");
    var strPostfix = this.substring(p, this.length) + "|";
    strPostfix = strPostfix.toLowerCase();
    if (strFilter.indexOf(strPostfix) > -1) {
      return true;
    }
  }
  return false;
};
Vue.prototype.$timeFormat = timeFormat;
function timeFormat(timestamp) {
  let mistiming = Math.round(new Date() / 1000) - timestamp;
  let postfix = mistiming > 0 ? "前" : "后";
  mistiming = Math.abs(mistiming);
  let arrr = ["年", "个月", "星期", "天", "小时", "分钟", "秒"];
  let arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

  for (let i = 0; i < 7; i++) {
    let inm = Math.floor(mistiming / arrn[i]);
    if (inm != 0) {
      return inm + arrr[i] + postfix;
    }
  }
}
const app = new Vue({
  ...App,
  store,
});
app.$mount();

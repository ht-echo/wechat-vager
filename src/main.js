import Vue from "vue";
import App from "./App";
import store from "./store/index";
//--------------------
//----华丽的分割线-----
//--------------------
import Toast from "./wxcomponents/vant/weapp/toast/toast";
Vue.prototype.$Toast = Toast;

Vue.config.productionTip = false;
App.mpType = "app";
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

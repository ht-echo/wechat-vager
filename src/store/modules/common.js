import Vue from "vue";
export default {
  state: {
    userInfo: {}, //用户信息
    reposInfo: {}, //其他信息
    isLogin: false,
    userToken: "",
  },
  mutations: {
    setUserInfo(state, value) {
      state.isLogin = true;
      state.userToken = value.userToken;
      //设置用户信息
      for (let key in value) {
        Vue.set(state.userInfo, key, value[key]);
      }
      uni.setStorage({
        key: "userInfo",
        data: value,
      });
      uni.setStorage({
        key: "isLogin",
        data: value.isLogin,
      });
      uni.setStorage({
        key: "userToken",
        data: value.userToken,
      });
    },
    setReposInfo(state, value) {
      state.reposInfo = value;
      uni.setStorage({
        key: "reposInfo",
        data: value,
      });
    },
  },
};

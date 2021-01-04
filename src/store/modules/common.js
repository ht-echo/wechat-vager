import Vue from "vue";
export default {
  state: {
    userInfo: {}, //用户信息
    reposInfo: {}, //其他信息
    isLogin: false,
    userToken: "",
    lang: "",
    setSerachValue: "-",
  },
  mutations: {
    setUserInfo(state, value) {
      state.isLogin = value.isLogin;
      state.userToken = value.userToken;
      state.userInfo = value;
      //设置用户信息
      uni.setStorage({
        key: "userInfo",
        data: state.userInfo,
      });
      uni.setStorage({
        key: "isLogin",
        data: state.isLogin,
      });
      uni.setStorage({
        key: "userToken",
        data: state.userToken,
      });
    },
    setReposInfo(state, value) {
      state.reposInfo = value;
      uni.setStorage({
        key: "reposInfo",
        data: value,
      });
    },
    lang(state, value) {
      state.lang = value;
      uni.setStorage({
        key: "lang",
        data: value,
      });
    },
    setSerachValue(state, value) {
      state.setSerachValue = value;
      uni.setStorage({
        key: "setSerachValue",
        data: value,
      });
    },
  },
};

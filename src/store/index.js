import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import Common from "./modules/common";

export default new Vuex.Store({
  modules: {
    Common,
  },
});

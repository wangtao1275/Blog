import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { fetch } from "./plugins/axios";
import "./plugins/vue-lazyload";

import { utils } from "@/plugins/utils";
import { all } from "./config/api/api-all";

function registerUtils() {
  Vue.prototype.$utils = utils;
  const obj = {};
  for (const prop in all) {
    obj[prop] = all[prop](fetch);
  }
  Vue.prototype.$request = obj;
}

registerUtils();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import axios from "axios";
import store from "../store";
import $router from "../router";
import { Loading, Notification } from "element-ui";

let requestCount = 0;
let loading = null,
  notify = null;

axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

let config = {
  baseURL: "",
  timeout: 60 * 1000,
  withCredentials: true, // Check cross-site Access-Control
  responseType: "json" //`responseType` indicates the type of data that the server will respond with
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    let role_uri = sessionStorage.getItem("activeMenu");
    config.headers["Role-Uri"] = JSON.parse(role_uri);

    requestCount++;
    loadingOpen();

    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  function(response) {
    requestCount--;
    if (requestCount <= 0) {
      loadingHide();
    }

    let isResource = response.config.responseType;
    let res = response.data;
    let code = res.code;
    let msg = res.message;

    let tipWhiteList = ["E23005"];
    if (!res.success && msg) {
      if (tipWhiteList.indexOf(code) < 0) {
        messageShow("错误", msg);
      } else {
        return Promise.reject(response);
      }

      if (code === "E10000") {
        store.dispatch("delAdminInfo");
        $router.push("/");
      }
      if (code === "E10001") {
        $router.push("/nopower");
      }
    }
    return isResource == "blob" ? response : res;
  },
  function(error) {
    let res = error.response,
      title = "异常",
      msg = "";

    if (res && res.data) {
      msg = res.data.message;
    } else {
      if (error.code == "ECONNABORTED") {
        msg = "请求超时，请刷新页面重试。";
      } else {
        msg = "系统异常，请联系管理员；错误码: " + error.response.status;
      }
    }
    messageShow(title, msg);
    loadingHide();

    if (res && res.data) {
      let code = res.data.code;

      if (code === "E10000") {
        store.dispatch("delAdminInfo");
        $router.push("/");
      }
      if (code === "E10001") {
        $router.push("/nopower");
      }
    }

    return Promise.reject(error);
  }
);

function loadingOpen() {
  loading = Loading.service({ fullscreen: true });
}

// 加载效果 关闭
function loadingHide() {
  loading.close();
  requestCount = 0;
}

function messageShow(title='错误', msg) {

    if(notify) {
        return;
    }
    notify = Notification.error({
        title: title,
        message: msg,
        onClose() {
            notify = null;
        }
    });
    
}

const fetch = (url, data={}, method='POST', responseType='json') => {
    if(Object.keys(data).length) {
        for (const key in object) {
            if(data[key] === null) {
                delete data[key];
            }
        }
    }
    // 处理 url '/news/{newsId}'
  if (/\{(\w+)\}/.test(url)) {
    var res = url.match(/\{(\w+)\}/);
    url = url.replace(/\{(\w+)\}/, data[res[1]]);
    delete data[res[1]];
  }
  let args = { url, method};
  if(method === 'GET' || method === 'DELETE') {
      args.params = data;
  } else {
      args.data = data;
  }

  args.responseType = responseType;

  return _axios(args);

}


export { _axios, fetch}

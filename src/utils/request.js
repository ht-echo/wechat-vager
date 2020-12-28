// baseUrl
const baseUrl = "https://gitee.com/api/v5";
export default {
  baseOptions(params, method = "GET") {
    return new Promise(function(resolve, reject) {
      let { url, data } = params;
      let httpDefaultOpts = {
        url: baseUrl + url,
        data: data,
        method: method.toUpperCase(),
      };
      uni
        .request(httpDefaultOpts)
        .then((res) => {
          resolve(res[1]);
        })
        .catch((res) => {
          reject(res[1]);
        });
    });
  },
  get(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option);
  },
  post: function(url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, "POST");
  },
  put(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "PUT");
  },
  delete(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option, "DELETE");
  },
};

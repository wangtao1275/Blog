import COS from 'cos-js-sdk-v5';
export const delCosImg = {
  data() {
    return {
      cos: null,
      sign: null
    };
  },
  methods: {
    // 先获取存储桶名称、Region、临时密钥信息
    async getCossign() {
      let res = await this.$request.common.cossign();
      if (res.success) {
        let data = res.result;
        this.sign = data;
        this.cos = new COS({
          getAuthorization: function(options, callback) {
            callback({
              TmpSecretId: data.tmpSecretId,
              TmpSecretKey: data.tmpSecretKey,
              XCosSecurityToken: data.sessionToken,
              ExpiredTime: data.expiredTime // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
            });
          }
        });
      }
    },
    // 删除
    async delToTXCloud(imgUrl, fn) {
      let _this = this;
      // 空地址 和 base64格式图片直接执行回调函数
      if (!imgUrl || imgUrl.indexOf('data:image') >= 0) {
        fn();
        return;
      }
      await this.getCossign();
      let aFilename = imgUrl.split('/');
      let key = aFilename[aFilename.length - 1];
      this.cos.deleteObject(
        {
          Bucket: this.sign.buketName /* 必须 */,
          Region: this.sign.regionName /* 存储桶所在地域，必须字段 */,
          Key: key /* 必须 */
        },
        function(err, data) {
          // console.log(err || data);
          if (!err) {
            fn(() => {
              _this.$notify.success({
                title: '提示',
                message: '操作成功!'
              });
            });
          }
        }
      );
    }
  }
};

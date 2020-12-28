<template>
  <div class="painter">
    <mp-painter :palette="customData" @imgOK="onImgOK" @imgErr="onImgErr" />
  </div>
</template>

<script>
export default {
  props: {
    customData: {
      type: Object,
      default: () => {},
    },
    save: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onImgOK(e) {
      console.log("onImgOK", e.detail.path);
      if (this.save) {
        this.saveImageToPhotos(e.detail.path);
      }
      this.$emit("onPainterFinished");
    },

    onImgErr(e) {
      console.log("onImgErr", e);
      this.$emit("onPainterFinished");
    },
    saveImageToPhotos(filePath) {
      let that = this;
      // 相册授权
      uni.getSetting({
        success(res) {
          // 进行授权检测，未授权则进行弹层授权
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            uni.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                that.saveImage(filePath);
              },
              // 拒绝授权时，则进入手机设置页面，可进行授权设置
              fail() {
                uni.showModal({
                  title: "提示",
                  content: "保存图片需要您的授权",
                  showCancel: true,
                  cancelText: "取消",
                  cancelColor: "#7f7f7f",
                  confirmText: "去设置",
                  confirmColor: "#2d8cf0",
                  success(modalRes) {
                    if (modalRes.confirm) {
                      uni.openSetting({
                        success(data) {
                          console.log("openSetting success");
                        },
                        fail(data) {
                          console.log("openSetting fail");
                        },
                      });
                    } else if (res.cancel) {
                      console.log("用户点击取消");
                    }
                  },
                });
              },
            });
          } else {
            // 已授权则直接进行保存图片
            that.saveImage(filePath);
          }
        },
        fail(res) {
          console.log(res);
        },
      });
    },

    saveImage(filePath) {
      uni.saveImageToPhotosAlbum({
        filePath: filePath, // 此为图片路径
        success: (res) => {
          console.log(res);
          uni.showModal({
            showCancel: false,
            title: "图片已保存到系统相册",
            content: "快去分享给小伙伴们吧~~",
            confirmText: "我知道了",
            confirmColor: "#2d8cf0",
            success() {},
          });
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>

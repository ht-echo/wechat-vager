<template>
  <div class="user_info">
    <van-toast id="van-toast" />
    <van-share-sheet
      :show="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      @select="onSelect"
      @close="onClose"
    />
    <Painter
      style="position:fixed;top:-9999rpx"
      :customData="posterData"
      save
      @onPainterFinished="onPainterFinished"
    />
    <van-overlay :show="overlayShow">
      <view class="wrapper">
        <van-loading size="24px">加载中...</van-loading>
      </view>
    </van-overlay>
    <div class="info_head">
      <div class="title">{{ reposInfo.full_name }}</div>
      <div class="des">{{ reposInfo.description }}</div>
    </div>
    <div class="info-more">
      <van-grid column-num="3">
        <van-grid-item
          @click="gridClick(item)"
          :icon="item.icon"
          :text="item.title"
          v-for="item in gridArr"
          :key="item.id"
        />
      </van-grid>
      <div class="paddingDiv"></div>
      <van-cell-group>
        <van-cell title="拥有者" :value="reposInfo.owner.login" />
        <van-cell @click="viewCode" title="查看代码" is-link />
        <van-cell title="默认分支" :value="reposInfo.default_branch" />
        <van-cell
          title="license"
          :value="reposInfo.license == null ? '--' : reposInfo.license"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import Painter from "@/components/repo/painter";
export default {
  components: {
    Painter,
  },
  data() {
    return {
      showShare: false,
      shareOptions: [
        { name: "微信", icon: "wechat", openType: "share" },
        // { name: "微博", icon: "weibo", openType: "share" },
        // { name: "复制链接", icon: "link" },
        // { name: "分享海报", icon: "poster", openType: "share" },
        // { name: "二维码", icon: "qrcode", openType: "share" },
      ],
      posterData: {},
      overlayShow: false,
      reposInfo: [],
      gridArr: [
        {
          id: 1,
          title: "分享",
          icon: "share-o",
        },
        {
          id: 2,
          title: "保存项目照",
          icon: require("../../static/images/save.png"),
        },
        {
          id: 3,
          title: "复制链接",
          icon: require("../../static/images/copy.png"),
        },
      ],
      codeData: [],
      codeUrl: "",
      userToken: "",
    };
  },
  created() {
    uni.getStorage({
      key: "reposInfo",
      success: (res) => {
        this.reposInfo = res.data;
      },
    });
    this.userToken = uni.getStorageSync("userToken");
  },
  methods: {
    async viewCode() {
      let params = {
        access_token: this.userToken,
        owner: this.reposInfo.owner.login,
        repo: this.reposInfo.path,
        sha: this.reposInfo.default_branch,
      };
      uni.setStorage({
        key: "codeParams",
        data: params,
      });
      uni.navigateTo({
        url: `/pages/user/code?` + qs.stringify(params),
      });
    },
    onSelect(event) {
      this.onClose();
    },
    onClose() {
      this.showShare = false;
    },
    paste(value) {
      uni.setClipboardData({
        data: "https://gitee.com/" + value,
      });
    },
    onPainterFinished() {
      console.log("onPainterFinished");
      this.posterData = null;
    },
    gridClick(item) {
      if (item.id == 1) {
        this.showShare = true;
      } else if (item.id == 2) {
        this.saveImg();
      } else if (item.id == 3) {
        this.paste(this.reposInfo.full_name);
      }
    },
    saveImg() {
      this.overlayShow = true;
      console.log("saveImg");
      let that = this;
      const path = "/pages/user/repos";

      wx.cloud
        .callFunction({
          // 要调用的云函数名称
          name: "wxacode",
          // 传递给云函数的event参数
          data: {
            path: path,
            name: `${that.reposInfo.owner.login}_${that.reposInfo.name}`,
          },
        })
        .then((res) => {
          that.overlayShow = false;

          console.log("wxacode", res);
          if (res.result && res.result.length > 0) {
            that.generatePoster(res.result[0].tempFileURL);
          } else {
            that.overlayShow = false;
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    generatePoster(imgUrl) {
      const data = {
        background: "#f7f7f7",
        width: "750rpx",
        height: "1100rpx",
        borderRadius: "0rpx",
        views: [
          {
            type: "rect",
            css: {
              left: "50rpx",
              width: "650rpx",
              top: "50rpx",
              color: "#ffffff",
              height: "900rpx",
              borderRadius: "20rpx",
              shadow: "10rpx 10rpx 5rpx #888888",
            },
          },
          {
            type: "rect",
            css: {
              left: "50rpx",
              width: "650rpx",
              height: "640rpx",
              top: "50rpx",
              color: "#2d8cf0",
              borderRadius: "20rpx",
            },
          },
          {
            type: "rect",
            css: {
              left: "50rpx",
              width: "650rpx",
              height: "50rpx",
              top: "640rpx",
              color: "#2d8cf0",
            },
          },
          {
            type: "text",
            text: `「${this.reposInfo.name}」`,
            css: {
              top: "80rpx",
              left: "375rpx",
              align: "center",
              fontSize: "38rpx",
              color: "#ffffff",
              width: "550rpx",
              maxLines: "1",
            },
          },
          {
            type: "text",
            text: `Stars：★${this.reposInfo.stargazers_count}  ${
              this.reposInfo.stargazers_count > 99 ? "🔥" : ""
            }`,
            css: {
              top: "150rpx",
              left: "80rpx",
              width: "550rpx",
              maxLines: "1",
              fontSize: "28rpx",
              color: "#ffffff",
            },
          },
          {
            type: "text",
            text: `作者：${this.reposInfo.owner.login}`,
            css: {
              top: "250rpx",
              left: "80rpx",
              width: "550rpx",
              maxLines: "1",
              fontSize: "28rpx",
              color: "#ffffff",
            },
          },
          {
            type: "text",
            text: `GitHub：https://gitee.com/${this.reposInfo.full_name}`,
            css: {
              top: "350rpx",
              left: "80rpx",
              width: "550rpx",
              fontSize: "28rpx",
              color: "#ffffff",
              lineHeight: "36rpx",
              maxLines: "2",
            },
          },
          {
            type: "text",
            text: `项目描述：${this.reposInfo.description || "暂无描述"}`,
            css: {
              top: "450rpx",
              left: "80rpx",
              width: "550rpx",
              fontSize: "28rpx",
              maxLines: "4",
              color: "#ffffff",
              lineHeight: "36rpx",
            },
          },
          {
            type: "image",
            url: `${imgUrl}`,
            css: {
              bottom: "180rpx",
              left: "120rpx",
              width: "200rpx",
              height: "200rpx",
            },
          },
          {
            type: "text",
            text: "扫码识别，查看项目",
            css: {
              bottom: "290rpx",
              left: "350rpx",
              fontSize: "28rpx",
              color: "#666666",
            },
          },
          {
            type: "text",
            text: "分享自「vager」",
            css: {
              bottom: "230rpx",
              left: "350rpx",
              fontSize: "28rpx",
              color: "#666666",
            },
          },
          {
            type: "text",
            text: "开源的世界，有你才更精彩",
            css: {
              bottom: "60rpx",
              left: "375rpx",
              align: "center",
              fontSize: "28rpx",
              color: "#666666",
            },
          },
        ],
      };
      this.posterData = { ...data };
    },
  },
};
</script>

<style lang="less" scoped>
.user_info {
  .paddingDiv {
    height: 20rpx;
    background: transparent;
  }
  .info_head {
    background: #2d8cf0;
    height: 166rpx;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 50rpx;
    .title {
      font-size: 36rpx;
    }
    .des {
      font-size: 24rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 40rpx;
      width: 710rpx;
      text-align: center;
    }
  }
  .info-more {
    margin: -50rpx 20rpx 0;
  }
}
</style>

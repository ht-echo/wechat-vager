<template>
  <view class="login">
    <van-notify id="van-notify" />
    <div class="bg-top">
      <image class="bg-img" v-if="bgImg" :src="bgImg"></image>
    </div>
    <div class="login-tabsBox">
      <van-tabs
        @change="tabChange"
        nav-class="login-nav"
        custom-class="login-tabs"
        type="line"
        color="#2d8cf0"
        line-height="0px"
        swipeable
        :active="activeName"
      >
        <van-tab title="Token登录" name="token">
          <div class="login-info">
            <van-field
              @change="token = $event.mp.detail"
              required
              clearable
              label="Token"
              placeholder="请输入Token"
            />
          </div>
        </van-tab>
        <!-- <van-tab title="账号" name="account">
          <div class="login-info">
            <van-cell-group>
              <van-field
                :value="username"
                required
                clearable
                label="用户名"
                placeholder="请输入用户名"
                bind:click-icon="onClickIcon"
              />

              <van-field
                :value="password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                required
                :border="false"
              />
            </van-cell-group>
          </div>
        </van-tab> -->
        <div class="tabs-btnBox">
          <van-button
            @click="loginFn"
            custom-class="tabs-btn"
            round
            color="#2d8cf0"
            type="primary"
          >
            {{ inputName }}
          </van-button>
        </div>
      </van-tabs>
    </div>
    <div class="clone-text" @click="paste(getGiteeToken)">
      <span>点击复制，打开浏览器，按流程创建token</span>
      <span class="text-info">{{ getGiteeToken }}</span>
    </div>
  </view>
</template>

<script>
import { getUser } from "@/apis/api";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      token: "",
      bgImg: "/static/images/octocat.png",
      activeName: "token",
      username: "",
      password: "",
      inputName: "token 登录",
      getGiteeToken: "https://gitee.com/profile/personal_access_tokens",
    };
  },
  onLoad(option) {},
  onShow() {},
  methods: {
    ...mapMutations(["setUserInfo"]),

    paste(value) {
      uni.setClipboardData({
        data: value,
      });
    },
    async loginFn() {
      console.log("token", this.token);
      if (this.activeName == "token" && this.token != "") {
        let { statusCode, data } = await getUser({
          access_token: this.token,
        });

        // console.log(data);
        if (statusCode == 200 || statusCode == 304) {
          this.$Notify({
            type: "success",
            message: "登录成功",
          });
          await this.setUserInfo({
            ...data,
            ...{ userToken: this.token, isLogin: true },
          });
          uni.switchTab({
            url: "/pages/mine/mine",
            success() {
              let page = getCurrentPages().pop(); //跳转页面成功之后
              if (!page) return;
              page.onLoad(); //如果页面存在，则重新刷新页面
            },
          });
        }
      }
    },
    tabChange(tab) {
      if (tab.detail.name == "account") {
        this.inputName = "账号登录";
      } else {
        this.inputName = "token 登录";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 750rpx;
  .bg-top {
    height: 400rpx;
    background: #2d8cf0;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg-img {
      width: 200rpx;
      height: 166rpx;
      // margin-top: 100rpx;
    }
  }
  .login-tabsBox {
    margin: -100rpx 50rpx 0;
    background: #fff;
    padding: 0 20rpx 20rpx;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.05);
    .login-info {
      margin: 20rpx 0 10rpx;
    }
    .tabs-btnBox {
      margin-top: 18rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .tabs-btn {
        width: 480rpx !important;
        margin-bottom: 20rpx;
      }
    }
  }
  .clone-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 100rpx;
    .text-info {
      color: #2d8cf0;
    }
  }
}
</style>

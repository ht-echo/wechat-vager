<template>
  <view class="toLogin">
    <van-popup
      :show="accountBoxshow"
      position="top"
      custom-style="height: 20%;"
      @close="accountClose"
    >
      <official-account
        class="account-info"
        @load="bindState"
        @error="bindState"
        style=""
      ></official-account>
    </van-popup>
    <van-dialog id="van-dialog" zIndex="9999" />
    <block v-if="isLogin == true">
      <view class="userInfo">
        <div class="head-info">
          <van-image
            class="headImg"
            round
            width="100rpx"
            height="100rpx"
            :src="userInfo.avatar_url"
          />
          <div class="userName">{{ userInfo.name }}</div>
          <div class="userName-Login">{{ "@" + userInfo.login }}</div>
        </div>
        <van-row custom-class="headTitle">
          <van-col span="8" custom-class="headTitle-col">
            <div @click="showRepos('user')" class="col-info">
              <div class="value">{{ userInfo.public_repos }}</div>
              <div class="label">Repos</div>
            </div>
            <div class="col-line"></div>
          </van-col>

          <van-col span="8" custom-class="headTitle-col">
            <div @click="toNodataPage" class="col-info">
              <div class="value">{{ userInfo.followers }}</div>
              <div class="label">Followers</div>
            </div>
            <div class="col-line"></div>
          </van-col>

          <van-col span="8" custom-class="headTitle-col">
            <div @click="toNodataPage" class="col-info">
              <div class="value">{{ userInfo.following }}</div>
              <div class="label">Following</div>
            </div>
          </van-col>
        </van-row>
        <van-cell-group custom-class="cell-top">
          <van-cell
            @click="showRepos('started')"
            is-link
            title="star的仓库"
            link-type="navigateTo"
          />
          <van-cell
            @click="toNodataPage"
            is-link
            title="issues"
            link-type="navigateTo"
          />
        </van-cell-group>
        <van-cell-group custom-class="cell-top">
          <van-cell
            title-width="150rpx"
            title="邮箱"
            :value="userInfo.email.length > 0 ? userInfo.email : '---'"
          />
          <van-cell
            @click="copyBlog(userInfo.blog)"
            title-width="150rpx"
            title="博客"
            value-class="blogClass"
            :value="userInfo.blog.length > 0 ? userInfo.blog : '---'"
          />
          <van-cell
            title-width="150rpx"
            title="简介"
            :value="userInfo.bio.length > 0 ? userInfo.bio : '---'"
          />
        </van-cell-group>
        <van-cell-group custom-class="cell-top cell-bottom">
          <van-cell
            v-if="userInfo.login == 'ht-echo'"
            @click="showAccountbox"
            is-link
            title="公众号"
            link-type="navigateTo"
            url="/pages/dashboard/index"
          />
          <van-cell is-link @click="logOut" title="退出登录" />
        </van-cell-group>
      </view>
    </block>
    <block v-else>
      <view class="toLogin-btnBox">
        <image class="bg-img" v-if="bgImg" :src="bgImg"></image>
        <van-button
          @click="toLogin"
          custom-class="toLogin-btn"
          round
          color="#2d8cf0"
          type="primary"
        >
          {{ inputName }}
        </van-button>
      </view>
    </block>
  </view>
</template>

<script>
import { getUser, getUserRepos } from "@/apis/api";
import { mapState, mapMutations } from "vuex";
import Dialog from "@/wxcomponents/vant/weapp/dialog/dialog";
export default {
  data() {
    return {
      isLogin: false,
      accountBoxshow: false,
      accountState: 5,
      userToken: "",
      userInfo: {},
      inputName: "登录",
      bgImg: "/static/images/octocat.png",
      repoData: [],
    };
  },
  onTabItemTap(e) {
    // tab 点击时执行，此处直接接收单击事件
  },
  onPullDownRefresh() {
    this.getData();
  },
  onLoad() {
    console.log("onLoad");
  },
  onShow() {
    console.log("onshow", uni.getStorageSync("isLogin"));
    uni.getStorage({
      key: "userToken",
      success: (res) => {
        this.userToken = res.data;
      },
    });
    uni.getStorage({
      key: "userInfo",
      success: (res) => {
        this.userInfo = res.data;
      },
    });
    if (uni.getStorageSync("isLogin")) {
      uni.getStorage({
        key: "isLogin",
        success: (res) => {
          this.isLogin = res.data;
        },
      });
    } else {
      this.isLogin = false;
    }
  },
  created() {},
  computed: {
    // isLogin() {
    //   return uni.getStorageSync("isLogin");
    // },
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    toNodataPage() {
      uni.navigateTo({
        url: "/pages/noData/index",
      });
    },
    copyBlog(value) {
      uni.setClipboardData({
        data: value,
      });
    },
    bindState(e) {
      this.accountState = e.detail.status;
    },
    showRepos(type) {
      uni.navigateTo({
        url: "/pages/user/repos?type=" + type + "&name=" + this.userInfo.login,
      });
    },
    accountClose() {
      uni.showTabBar({
        animation: true,
      });
      this.accountBoxshow = false;
    },
    showAccountbox() {
      if (this.accountState == 0) {
        uni.hideTabBar({
          animation: false,
        });
        setTimeout(() => {
          this.accountBoxshow = true;
        }, 300);
      }
    },
    async getData() {
      if (this.userInfo.id) {
        let { statusCode, data } = await getUser({
          access_token: this.userInfo.userToken,
        });
        if (statusCode == 200) {
          this.setUserInfo({ ...this.userInfo, ...data });
          uni.getStorage({
            key: "userInfo",
            success: (res) => {
              this.userInfo = res.data;
              uni.stopPullDownRefresh();
            },
          });
        }
      }
    },
    toLogin() {
      uni.navigateTo({
        url: "/pages/mine/login",
      });
    },
    logOut() {
      uni.hideTabBar({
        animation: false,
      });
      setTimeout(() => {
        Dialog.confirm({
          title: "退出登录",
          message: "",
        })
          .then(() => {
            // on confirm
            uni.showTabBar({
              animation: true,
            });
            this.setUserInfo({
              isLogin: false,
              userToken: "",
            });
            uni.reLaunch({
              url: "/pages/mine/mine",
            });
          })
          .catch(() => {
            uni.showTabBar({
              animation: true,
            });
          });
      }, 100);
    },
  },
};
</script>

<style lang="less" scoped>
.toLogin {
  height: 750rpx;
  /deep/ .blogClass {
    color: #1989fa;
  }
  .commonBorder {
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
  }
  .toLogin-btnBox {
    padding-top: 300rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .bg-img {
      width: 200rpx;
      height: 166rpx;
      margin-bottom: 30rpx;
    }
    /deep/ .toLogin-btn {
      width: 480rpx !important;
    }
  }
  .userInfo {
    padding: 0 40rpx 40rpx;
    height: 750rpx;
    background-size: 100% 375rpx;
    background-image: url("@/static/images/account_bg.png");
    background-repeat: no-repeat;
    .head-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #f8f8f8;
      font-size: 28rpx;
      line-height: 50rpx;
    }
    /deep/ .headTitle {
      .commonBorder;
      background-color: #fff;
      margin-top: 30rpx;
      .headTitle-col {
        color: #947f7f;
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .col-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          .value {
            color: #000;
          }
        }
        .col-line {
          width: 1rpx;
          height: 40rpx;
          background: #7f7f7f;
        }
      }
    }
    /deep/ .cell-top {
      .commonBorder;
      margin-top: 20rpx;
    }
    /deep/ .cell-bottom {
      margin-bottom: 40rpx;
    }
  }
}
</style>

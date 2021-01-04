<template>
  <view class="index">
    <van-toast id="van-toast" />
    <div class="refBox" @click="recover">
      <van-icon color="#fff" size="60rpx" name="replay" />
    </div>
    <van-nav-bar fixed placeholder custom-class="navBar" title="项目推荐">
      <van-icon
        @click="chooseLang('lang')"
        size="20"
        name="exchange"
        slot="left"
      />
      <van-icon
        @click="chooseLang('search')"
        size="24"
        name="search"
        slot="right"
      />
    </van-nav-bar>
    <div class="info">
      <div class="repoBox" v-if="activeName == 'repo'">
        <RepoList :repoData="dataList" />
      </div>
      <div class="userBox" v-if="activeName == 'user'"></div>
    </div>
  </view>
</template>

<script>
import { search } from "@/apis/api";
import RepoList from "@/components/repo/repoList";
import moment from "moment";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    RepoList,
  },
  data() {
    return {
      dataList: [],
      activeName: "repo",
      userInfo: {},
      type: "repositories",
      lang: "",
      text: "-",
      search: false,
      page: 1,
    };
  },
  onPullDownRefresh() {
    this.page++;
    this.text = "-";
    this.getData();
  },
  onLoad(option) {},
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
    this.text = uni.getStorageSync("setSerachValue");
    console.log("this.text", this.text);
    this.setSerachValue("-");
    this.lang = uni.getStorageSync("lang");
    this.getData();
  },
  methods: {
    ...mapMutations(["setSerachValue"]),
    recover() {
      this.page = 1;
      this.text = "-";
      this.getData();
    },
    async getData(text) {
      let params = {
        type: this.type,
        access_token: this.userInfo.userToken,
        q: this.text,
        page: this.page,
      };
      if (this.userInfo.userToken == "" || this.userInfo.userToken == null) {
        this.$Toast.fail("请先登录");
        return;
      }
      if (this.lang != "") {
        params = {
          ...params,
          ...{ language: this.lang },
        };
      } else {
        params = {
          ...params,
        };
      }
      let { statusCode, data } = await search(params);
      if (statusCode == 200) {
        data.map((v) => {
          if (v.updated_at) {
            v.updated_at =
              "update " + this.$timeFormat(moment(v.updated_at).unix());
          }
        });
        this.dataList = data;
        uni.stopPullDownRefresh();
      }
    },
    chagneTab(tab) {
      console.log(tab.detail.name);
      this.activeName = tab.detail.name;
      if (tab.detail.name == "repo") {
        this.type = "repositories";
      } else {
        this.type = "users";
      }
    },
    chooseLang(name) {
      if (name == "lang") {
        uni.navigateTo({
          url: "/pages/index/indexBar",
        });
      } else if (name == "search") {
        uni.navigateTo({
          url: "/pages/index/search",
        });
      }
    },
  },
};
</script>

<style lang="less">
.index {
  width: 750rpx;
  .refBox {
    position: fixed;
    right: 40rpx;
    top: 400rpx;
    background: #ddd;
    padding: 10rpx;
  }
  .navBar {
    padding-top: 0 !important;
  }
}
</style>
>

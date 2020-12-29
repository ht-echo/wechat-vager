<template>
  <div class="code">
    <div v-for="item in codeData" :key="item.sha">
      <van-cell
        @click="getCodeData(item)"
        :title="item.path"
        :icon="item.type == 'tree' ? folderUrl : fileUrl"
        :is-link="item.type == 'tree'"
      />
      <div class="bgdiv"></div>
    </div>
  </div>
</template>

<script>
import { getCode } from "@/apis/api";
import qs from "qs";
export default {
  data() {
    return {
      folderUrl: require("../../static/images/folder.png"),
      fileUrl: require("../../static/images/file.png"),
      codeData: [],
      codeParams: {},
    };
  },
  async onLoad(e) {
    console.log("e", e);
    this.codeParams = e;
    this.getData();
  },
  methods: {
    async getCodeData(e) {
      console.log("getCodeData", e.type);
      this.codeParams = {
        ...this.codeParams,
        ...e,
      };
      if (e.type == "tree") {
        await uni.navigateTo({
          url: `/pages/user/code?` + qs.stringify(this.codeParams),
        });
      } else if (e.type == "blob") {
        await uni.navigateTo({
          url: `/pages/user/file?` + qs.stringify(this.codeParams),
        });
      }
    },
    async getData() {
      uni.setNavigationBarTitle({
        title: this.codeParams.path,
      });
      let { statusCode, data } = await getCode(this.codeParams, {
        access_token: this.codeParams.access_token,
      });
      if (statusCode == 200) {
        this.codeData = [...data.tree];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.code {
  padding: 20rpx 20rpx;
  .bgdiv {
    background: transparent;
    height: 20rpx;
  }
}
</style>

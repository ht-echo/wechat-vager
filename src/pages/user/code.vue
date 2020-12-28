<template>
  <div class="code">
    <div v-for="item in codeData" :key="item.sha">
      <van-cell
        @click="getCodeData(item, item.type)"
        :title="item.path"
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
      codeData: [],
      codeParams: {},
    };
  },
  async onLoad(e) {
    this.codeParams = e;
    setTimeout(() => {
      this.getCodeData(e);
    }, 300);
  },
  methods: {
    async getCodeData(e, type) {
      console.log("getCodeData", type);
      let params = e;
      if (type == "tree") {
        params = { ...this.codeParams, ...{ sha: e.sha } };
        console.log("params", params);
        await uni.navigateTo({
          url: `/pages/user/code?` + qs.stringify(params),
        });
        return;
      } else if (type == "blob") {
        params = { ...this.codeParams, ...{ sha: e.sha } };
        await uni.navigateTo({
          url: `/pages/user/file?` + qs.stringify(params),
        });
        return;
      }
      let { statusCode, data } = await getCode(params, {
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

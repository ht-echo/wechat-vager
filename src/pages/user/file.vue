<template>
  <div class="file">
    <div class="info">
      {{ info }}
    </div>
  </div>
</template>

<script>
import { getBlob } from "@/apis/api";
import { base64_decode } from "../../utils/base64";
import Markdown from "../../components/repo/markdown";

export default {
  data() {
    return {
      info: [],
    };
  },
  async onLoad(e) {
    let { statusCode, data } = await getBlob(e, {
        access_token: e.access_token,
    });
    if (statusCode == 200) {
      this.info = data;
    }
  },
};
</script>

<style lang="less" scoped>
.file {
  padding: 20rpx;
  background: #fff;
  .info {
    padding: 20rpx;
  }
}
</style>

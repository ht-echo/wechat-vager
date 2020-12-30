<template>
  <div class="file">
    <div class="info">
      <div class="imgBox" v-if="hasImg == true">
        <van-image width="50" height="50" v-if="imgUrl" :src="imgUrl" alt="" />
      </div>
      <div style="white-space:pre-wrap" class="textBox" v-if="hasImg == false">
        <!-- <towxml :nodes="content" v-if="content" /> -->
        {{ md }}
      </div>
    </div>
  </div>
</template>

<script>
import { getCode } from "@/apis/api";
import { base64_decode } from "@/utils/base64";
import uParse from "@/components/u-parse/u-parse.vue";
import marked from "marked";
export default {
  data() {
    return {
      htmlContent: "",
      imgUrl: "",
      hasImg: false,
      content: "",
      md: "",
    };
  },
  async onLoad(e) {
    console.log("e.path", e.path);
    uni.setNavigationBarTitle({
      title: decodeURIComponent(e.path),
    });
    let { statusCode, data } = await getCode(e, {
      access_token: e.access_token,
    });
    if (statusCode == 200) {
      if (data.content.length > 0) {
        if (e.path.$isPicture()) {
          this.hasImg = true;
          this.imgUrl = "data:image/png;base64," + data.content;
        } else {
          this.hasImg = false;
          let md = base64_decode(data.content);
          this.md = md;
          this.getWxml(md);
        }
      }
    }
  },
  methods: {
    getWxml(res) {
      this.content = this.towxml(res, "markdown", {});
      // console.log("this.content", this.content);
    },
  },
};
</script>

<style lang="less" scoped>
.file {
  padding: 20rpx;
  background: #f8f8f8;
  .info {
    background: #fff;
    .imgBox {
      background: #f1f1f1;
      height: 400rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .textBox {
      padding: 20rpx;
      line-height: 48rpx;
      overflow-x: auto;
    }
  }
}
</style>

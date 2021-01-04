<template>
  <div class="search">
    <van-search
      @search="search"
      @change="handChange"
      :value="value"
      shape="round"
      background="#fff"
      placeholder="请输入搜索关键词"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      value: "",
    };
  },

  methods: {
    ...mapMutations(["setSerachValue"]),
    handChange(e) {
      this.value = e.detail;
    },
    search() {
      console.log("this.value", this.value);
      this.setSerachValue(this.value);
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  height: 750rpx;
}
</style>

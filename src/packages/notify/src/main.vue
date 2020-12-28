<template>
  <van-notify :id="customSelector" />
</template>

<script>
// import Notify from "/wxcomponents/vant/weapp/notify/notify";
export default {
  props: {
    type: {
      type: Number,
      default: "success",
    },
    type: {
      type: Number,
      default: "success",
    },
    type: {
      type: Number,
      default: "success",
    },
    type: {
      type: Number,
      default: "success",
    },
  },
  methods: {
    init() {
      Notify({
        type,
        message,
        duration,
        selector,
      });
    },
  },
};
</script>

<style lang="less" scoped></style>

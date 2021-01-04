<template>
  <div class="reps">
    <div
      @click="showMore(item)"
      class="reps_box"
      v-for="item in repoData"
      :key="item.id"
    >
      <div class="title">
        <van-icon
          name="label"
          size="28rpx"
          color="#909399"
          style="margin:10rpx"
        />
        {{ item.full_name }}
      </div>
      <div class="des">{{ item.description }}</div>
      <div class="des">
        <span
          class="des_text"
          style="margin-right:40rpx;"
          v-if="item.language != '' && item.language != null"
        >
          <span>
            <van-icon
              size="24rpx"
              :name="require('@/static/images/lang.png')"
            />
          </span>
          <span style="margin-left:10rpx">{{ item.language }}</span>
        </span>
        <span class="des_text" v-if="item.stargazers_count > 0">
          <div class="iconClass">
            <van-icon
              size="24rpx"
              :name="require('@/static/images/star.png')"
            />
          </div>
          <span style="margin-left:10rpx">{{ item.stargazers_count }}</span>
        </span>
      </div>
      <div class="updateTime">
        {{ item.updated_at }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    repoData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setReposInfo"]),

    showMore(item) {
      uni.navigateTo({
        url: "/pages/user/info",
        success: (data) => {
          this.setReposInfo(item);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.reps {
  .reps_box {
    box-sizing: border-box;
    background: #fff;
    margin: 20rpx 20rpx 0;
    padding: 20rpx;
    line-height: 48rpx;
    .title {
      color: #323233;
      font-size: 28rpx;
      display: flex;
      align-items: center;
    }
    .des {
      color: #969799;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      .des_text {
        display: flex;
        align-items: center;
      }
      .iconClass {
        display: flex;
        align-items: center;
        height: 100%;
        margin-top: -15rpx;
      }
    }
    .updateTime {
      font-size: 24rpx;
      color: #909399;
    }
  }
}
</style>

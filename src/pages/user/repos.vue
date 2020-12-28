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
      <div class="des" v-if="item.language != '' && item.language != null">
        {{ item.language }}
      </div>
      <div class="updateTime">
        {{ item.updated_at }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getUserRepos, getUserStarred } from "@/apis/api";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      repoData: [],
      userToken: "",
      clickType: "",
      userName: "",
    };
  },
  onLoad(e) {
    console.log(e);
    this.clickType = e.type;
    this.userName = e.name;
    this.userToken = uni.getStorageSync("userInfo").userToken;
    console.log("created", this.userToken);
    this.getData();
  },
  created() {},
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
    async getData() {
      if (this.clickType == "user") {
        let { statusCode, data } = await getUserRepos({
          access_token: this.userToken,
          sort: "updated",
        });
        if (statusCode == 200) {
          this.repoData = data;
          data.map((v) => {
            if (v.updated_at) {
              v.updated_at =
                "update " + this.$timeFormat(moment(v.updated_at).unix());
            }
          });
        }
      } else if (this.clickType == "started") {
        let res = await getUserStarred(this.userName);
        if (res.statusCode == 200) {
          this.repoData = [...res.data];

          res.data.map((v) => {
            if (v.updated_at) {
              v.updated_at =
                "update " + this.$timeFormat(moment(v.updated_at).unix());
            }
          });
        }
      }
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
    }
    .updateTime {
      font-size: 24rpx;
      color: #909399;
    }
  }
}
</style>

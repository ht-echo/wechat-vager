<template>
  <RepoList :repoData="repoData" />
</template>

<script>
import moment from "moment";
import { getUserRepos, getUserStarred } from "@/apis/api";
import { mapState, mapMutations } from "vuex";
import RepoList from "@/components/repo/repoList";
export default {
  components: {
    RepoList,
  },
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
</style>

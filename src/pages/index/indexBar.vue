<template>
  <div class="indexBar">
    <van-dialog id="van-dialog" />
    <div class="topBox">
      <div>
        选择语言，生成标签
      </div>
      <div class="tagBox" v-show="langText">
        <van-tag
          size="large"
          v-show="showTag"
          mark
          type="primary"
          closeable
          @close="closeTag"
        >
          {{ langText }}
        </van-tag>
      </div>
    </div>
    <van-index-bar>
      <view v-for="(item, index) in pySegSort.segs" :key="index">
        <van-index-anchor :index="item.initial" />
        <van-cell
          @click="chooseCell(info)"
          v-for="(info, i) in item.data"
          :key="i"
          :title="info.name"
        />
      </view>
    </van-index-bar>
  </div>
</template>

<script>
import { languages } from "@/utils/languages";
import Dialog from "@/wxcomponents/vant/weapp/dialog/dialog";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      showTag: true,
      langText: "",
    };
  },
  created() {
    this.langText = uni.getStorageSync("lang");
  },
  methods: {
    ...mapMutations(["lang"]),

    closeTag(event) {
      this.showTag = false;
      this.lang("");
    },
    chooseCell(info) {
      Dialog.confirm({
        title: `确认将${info.name}设置为筛选语言吗？`,
      }).then(() => {
        this.langText = info.name;
        this.lang(info.name);
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 600,
        });
      });
    },
  },
  computed: {
    pySegSort() {
      if (languages.length == 0) return;
      if (!String.prototype.localeCompare) return null;
      let letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split("");
      let zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");
      let segs = []; // 存放数据
      let res = {};
      let curr;
      let re = /[^\u4e00-\u9fa5]/; //中文正则
      let pattern = new RegExp(
        "[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]"
      ); //特殊符号

      letters.filter((items, i) => {
        curr = {
          initial: "", //字母
          data: [], //数据
        };
        languages.map((v, index) => {
          // 特殊字符
          if (pattern.test(v.name[0])) {
            if (
              (!zh[i - 1] || zh[i - 1].localeCompare(v.name) <= 0) &&
              v.name.localeCompare(zh[i]) == -1
            ) {
              curr.data.push(v);
            }
          }
          // 判断首个字是否是中文
          if (re.test(v.name[0])) {
            // 英文
            if (v.name[0].toUpperCase() == items) {
              curr.data.push(v);
            }
          } else {
            // 中文
            if (
              (!zh[i - 1] || zh[i - 1].localeCompare(v.name) <= 0) &&
              v.name.localeCompare(zh[i]) == -1
            ) {
              curr.data.push(v);
            }
          }
        });

        if (curr.data.length) {
          curr.initial = letters[i];
          segs.push(curr);
          curr.data.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
      res.segs = Array.from(new Set(segs)); //去重
      console.log(res);
      return res;
    },
  },
};
</script>

<style lang="less" scoped>
.indexBar {
  .topBox {
    padding: 0 20rpx;
    height: 160rpx;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>

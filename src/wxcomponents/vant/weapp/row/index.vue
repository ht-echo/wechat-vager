<template>
<uni-shadow-root class="vant-weapp-row-index"><view class="custom-class van-row" :style="viewStyle">
  <slot></slot>
</view></uni-shadow-root>
</template>

<script>

global['__wxRoute'] = 'vant/weapp/row/index'
import { VantComponent } from '../common/component';
VantComponent({
  relation: {
    name: 'col',
    type: 'descendant',
    current: 'row',
    linked(target) {
      if (this.data.gutter) {
        target.setGutter(this.data.gutter);
      }
    },
  },
  props: {
    gutter: {
      type: Number,
      observer: 'setGutter',
    },
  },
  data: {
    viewStyle: '',
  },
  mounted() {
    if (this.data.gutter) {
      this.setGutter();
    }
  },
  methods: {
    setGutter() {
      const { gutter } = this.data;
      const margin = `-${Number(gutter) / 2}px`;
      const viewStyle = gutter
        ? `margin-right: ${margin}; margin-left: ${margin};`
        : '';
      this.setData({ viewStyle });
      this.getRelationNodes('../col/index').forEach((col) => {
        col.setGutter(this.data.gutter);
      });
    },
  },
});
export default global['__wxComponents']['vant/weapp/row/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-row:after{display:table;clear:both;content:""}
</style>
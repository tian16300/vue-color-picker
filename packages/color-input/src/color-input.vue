<template lang="html">
  <div class="m-color-picker color-input-group-wrapper" tabindex="-1" v-on:click="event => { event.stopPropagation() }">
     <div class="color-input-wrapper color-input-group">
       <input v-model="value" :disabled="disabled" type="text" class="color-input" @change="handleChangeInput">
     <span ref="btn" class="color-input-group-addon">
       <button type="button" class="color-btn" @click="handlerOpenPicker">
         <div class="colorBtn"
          v-bind:style="`background: ${showColor}`"
          v-on:click="handlerOpenPicker"
          v-bind:class="{ disabled: disabled }"
        ></div>
      </button>
     </span>

     </div>
     <div  ref="picker" style="position: absolute; top: 0px; left: 0px; width: 100%;">
       <div>
          <!-- 颜色色盘 -->
    <div  class="color-input-picker" v-if="openStatus" :style="{
      left:left,
      top:top
    }" v-bind:class="{ open: openStatus }">
        <VColor v-model="html5Color" @change="handleChangeColor"  />
        <ul class="tColor">
          <li 
            v-for="(color, index) of tColor"
            :key="index"
            v-bind:style="{ background: colorMap(color) }"
            v-on:mouseover="hoveColor = color"
            v-on:mouseout="hoveColor = null"
            v-on:click="updataValue(color)"
          ></li>
        </ul>
      </div>
       </div>
     </div>
    
    </div>
</template>

<script>
import VColor from "v-color";
import "v-color/dist/index.css";
function colorMap(value) {
  return value == "transparent"
    ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center'
    : value;
}
export default {
  name: "ColorInput",
  components: {
    VColor: VColor,
  },
  props: {
    // 当前颜色值
    value: {
      type: String,
      required: true,
    },
    // 默认颜色
    defaultColor: {
      type: String,
      default: "transparent",
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 面板打开状态
      openStatus: false,
      // 鼠标经过的颜色块
      hoveColor: null,
      // 主题颜色
      tColor: [
        "#000000",
        "#ffffff",
        "#eeece1",
        "#1e497b",
        "#4e81bb",
        "#e2534d",
        "#9aba60",
        "#8165a0",
        "#47acc5",
        "#f9974c",
        "transparent",
      ],
      html5Color: this.value,
      left: "0px",
      top: "0px",
    };
  },
  computed: {
    // 显示面板颜色
    showPanelColor() {
      if (this.hoveColor) {
        return this.hoveColor;
      } else {
        return this.showColor;
      }
    },
    // 显示颜色
    showColor() {
      let value = this.value || this.defaultColor;
      return this.colorMap(value);
    },
    // 颜色面板
    colorPanel() {
      let colorArr = [];
      for (let color of this.colorConfig) {
        colorArr.push(this.gradient(color[1], color[0], 5));
      }
      return colorArr;
    },
  },
  methods: {
    colorMap,
    getElementLeft(element){
        /* eslint-disable */
　　　　let actualLeft = element.offsetLeft;
　　　　let current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualLeft;
　　},
   getElementTop(element){
       /* eslint-disable */
　　　　let actualTop = element.offsetTop;
　　　　let current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualTop;
　　},
    handlerOpenPicker() {
      this.left = this.getElementLeft(this.$refs.btn) - 251 + 45  + "px";
      this.top = this.getElementTop(this.$refs.btn) + 32  + "px";
      this.openStatus = !this.disabled;
    },
    handleChangeInput(e) {
      this.updataValue(e.target.value);
    },
    documentBlurClosePanel(e) {
      if (!e.target.closest(".color-input-picker")) {
        this.closePanel();
      }
    },
    closePanel() {
      this.openStatus = false;
    },
    // 更新组件的值 value
    updataValue(value, noClose) {
      this.$emit("input", value);
      this.$emit("change", value);
      if (!noClose) this.openStatus = false;
    },
    // 设置默认颜色
    handleDefaultColor() {
      this.updataValue(this.defaultColor);
    },
    // 格式化 hex 颜色值
    parseColor(hexStr) {
      if (hexStr.length === 4) {
        hexStr =
          "#" +
          hexStr[1] +
          hexStr[1] +
          hexStr[2] +
          hexStr[2] +
          hexStr[3] +
          hexStr[3];
      } else {
        return hexStr;
      }
    },
    // RGB 颜色 转 HEX 颜色
    rgbToHex(r, g, b) {
      let hex = ((r << 16) | (g << 8) | b).toString(16);
      return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
    },
    // HEX 转 RGB 颜色
    hexToRgb(hex) {
      hex = this.parseColor(hex);
      let rgb = [];
      for (let i = 1; i < 7; i += 2) {
        rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
      }
      return rgb;
    },
    // 计算渐变过渡颜色
    gradient(startColor, endColor, step) {
      // 讲 hex 转换为 rgb
      let sColor = this.hexToRgb(startColor);
      let eColor = this.hexToRgb(endColor);

      // 计算R\G\B每一步的差值
      let rStep = (eColor[0] - sColor[0]) / step;
      let gStep = (eColor[1] - sColor[1]) / step;
      let bStep = (eColor[2] - sColor[2]) / step;

      let gradientColorArr = [];
      // 计算每一步的hex值
      for (let i = 0; i < step; i++) {
        gradientColorArr.push(
          this.rgbToHex(
            parseInt(rStep * i + sColor[0]),
            parseInt(gStep * i + sColor[1]),
            parseInt(bStep * i + sColor[2])
          )
        );
      }
      return gradientColorArr;
    },
    /**
     *
     */
    handleChangeColor(value) {
      let color = "rgba(" + value.rgba.join(",") + ")";
      this.updataValue(color, true);
    },
  },
  created() {
    /*添加click事件*/
    document.addEventListener("click", this.documentBlurClosePanel.bind(this));
  },
  mounted() {
    document.body.append(this.$refs.picker);
    this.left = this.getElementLeft(this.$refs.btn) - 251 + 45  + "px";
    this.top = this.getElementTop(this.$refs.btn) + 32  + "px";
  },
  beforeDestroy() {
    document.removeEventListener(
      "click",
      this.documentBlurClosePanel.bind(this)
    );
    document.body.removeChild(this.$refs.picker);
  },
};
</script>

<style lang="scss" scoped>
.m-color-picker {
  &.color-input-group-wrapper{
        display: inline-block;
        width: 100%;
        text-align: start;
        vertical-align: top;
  }
  .color-input-group-wrapper{
        display: inline-block;
        width: 100%;
        text-align: start;
        vertical-align: top;
  }
  .color-input-group{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    display: table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    .color-input{
      display: table-cell;
      float: left;
      width: 100%;
      margin-bottom: 0;
      text-align: inherit;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .color-input-group-addon{
      position: relative;
      padding: 0;
      color: rgba(0,0,0,.65);
      font-weight: 400;
      font-size: 14px;
      text-align: center;
      background-color: #fafafa;
      border: 0;
      border-radius: 4px;
      transition: all .3s;
      display: table-cell;
      width: 1px;
      line-height: 0;
      vertical-align: top;
    }
    .color-btn,button.color-btn{
          line-height: 1;
          position: relative;
          display: inline-block;
          font-weight: 400;
          white-space: nowrap;
          text-align: center;
          background-image: none;
          box-shadow: 0 2px 0 rgba(0,0,0,.015);
          cursor: pointer;
          transition: all .3s cubic-bezier(.645,.045,.355,1);
          user-select: none;
          touch-action: manipulation;
          height: 32px;
          padding: 6px 10px;
          font-size: 14px;
          border-radius: 4px;
          background-color: #fff;
          border-width: 1px;
          border-style: solid;
          border-color: #d9d9d9;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left-width: 0;
          outline: 0;
    }
  }
  .color-input {
    box-sizing: border-box;
    margin: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: 32px;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 1.5;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: top 0.3s;
    &:focus,
    &:hover {
      border-color: #40a9ff;
      border-right-width: 1px !important;
    }
  }
  .colorBtn {
    width: 24px;
    height: 100%;
    display: inline-block;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
    border-radius: 0;
    margin-right: 0;
    cursor: pointer;
    vertical-align: top;
  }
  .colorBtn.disabled {
    cursor: no-drop;
  }
}
.color-input-picker {
  ul,
  li,
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  /deep/ .cp__fm-switcher > div {
    margin-top: -10px;
  }
  /deep/ .cp__ctrl-pane {
    padding: 6px 8px;
  }
  /deep/ .cp__fm-fields {
    line-height: 1.2;
    span {
      margin-top: 6px;
    }
  }
  position: absolute;
  width: 250px;
  background: #fff;
  border: 1px solid #ddd;
  visibility: hidden;
  border-radius: 2px;
  margin-top: 2px;
  padding-bottom: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: all 0.3s ease;
  box-sizing: content-box;
  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 5px;
    line-height: 1;
    color: #333;
  }
  .tColor {
    line-height: 1.4;
    padding: 0 6px;
    margin: 0;
    li {
      width: 16px;
      height: 16px;
      display: inline-block;
      margin: 0 5px;
      transition: all 0.3s ease;
      border-radius: 3px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
      cursor: pointer;
    }
    li:hover {
      transform: scale(1.3);
    }
  }
  /* 颜色选择器复写 */
  .cp__wrapper {
    box-shadow: none;
  }
}
.color-input-picker.open {
  visibility: visible;
  opacity: 1;
  z-index: 1;
}
</style>
  

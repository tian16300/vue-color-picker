<template lang="html">
  <div class="m-color-picker" tabindex="-1" v-on:click="event => { event.stopPropagation() }">
    <!-- 颜色显示小方块 -->
    <div class="color-row">
      <div class="color-col-2">
      <div class="colorBtn"
      v-bind:style="`background: ${showColor}`"
      v-on:click="handlerOpenPicker"
      v-bind:class="{ disabled: disabled }"
    ></div>
    </div>
    <div class="color-col-7">
     <input v-model="value" :disabled="disabled" type="text" class="color-input" @change="handleChangeInput">
     </div>
    </div>
     <!-- 颜色色盘 -->
    <div ref="picker" class="color-input-picker" :style="{
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
    handlerOpenPicker() {
      let pos = this.$el.getBoundingClientRect();
      this.left = this.$el.scrollLeft + pos.left + "px";
      this.top = this.$el.scrollTop + pos.top + 240 + "px";
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
    let pos = this.$el.getBoundingClientRect();
    this.left = this.$el.scrollLeft + pos.left + "px";
    this.top = this.$el.scrollTop + pos.top + 280 + "px";
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
  display: inline-block;
  .color-row {
    display: flex;
    flex-flow: row wrap;
  }
  .color-col-2 {
    flex: 0 0 20%;
    max-width: 20%;
    padding-right: 4px;
  }
  .color-col-7 {
    flex: 0 0 70%;
    max-width: 70%;
    padding: 0 4px;
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
  position: relative;
  text-align: left;
  font-size: 14px;
  outline: none;
  .colorBtn {
    width: 100%;
    height: 32px;
    display: inline-block;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
    vertical-align: middle;
  }
  .colorBtn.disabled {
    cursor: no-drop;
  }

  .hd {
    overflow: hidden;
    line-height: 29px;
    .colorView {
      width: 100px;
      height: 30px;
      float: left;
      transition: background-color 0.3s ease;
    }
    .defaultColor {
      width: 80px;
      float: right;
      text-align: center;
      border: 1px solid #ddd;
      cursor: pointer;
      color: #333;
    }
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
    padding: 8px 8px;
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
  

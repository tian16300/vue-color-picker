// 导入组件
import ColorInput from './src/color-input.vue'

// 为组件提供 install 安装方法，供按需引入
ColorInput.install = function (Vue) {
  Vue.component(ColorInput.name, ColorInput)
}

// 默认导出组件
export default ColorInput

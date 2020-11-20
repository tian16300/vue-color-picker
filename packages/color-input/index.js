// 导入组件
import colorInput from './src/color-input.vue'

// 为组件提供 install 安装方法，供按需引入
colorInput.install = function (Vue) {
  Vue.component(colorInput.name, colorInput)
}

// 默认导出组件
export default colorInput

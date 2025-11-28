import Vue from 'vue'

const components = ['CircleShape', 'Picture', 'VText', 'VButton', 'Group', 'RectShape', 'LineShape', 'VTable', 'VChart', 'QrCode', 'NursingTags', 'Infusion']

components.forEach((key) => {
  Vue.component(key, () => import(`@/custom-component/${key}/Component`))
  Vue.component(`${key}Attr`, () => import(`@/custom-component/${key}/Attr`))
})

const svgs = ['SVGStar', 'SVGTriangle']

svgs.forEach((key) => {
  Vue.component(key, () => import(`@/custom-component/svgs/${key}/Component`))
  Vue.component(`${key}Attr`, () => import(`@/custom-component/svgs/${key}/Attr`))
})

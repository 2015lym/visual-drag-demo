export const styleData = [
  { key: 'left', label: 'x 坐标' },
  { key: 'top', label: 'y 坐标' },
  { key: 'rotate', label: '旋转角度' },
  { key: 'width', label: '宽' },
  { key: 'height', label: '高' },
  { key: 'color', label: '颜色' },
  { key: 'backgroundColor', label: '背景色' },
  { key: 'borderWidth', label: '边框宽度' },
  { key: 'borderStyle', label: '边框风格' },
  { key: 'borderColor', label: '边框颜色' },
  { key: 'borderRadius', label: '边框半径（圆角）' },
  { key: 'fontSize', label: '字体大小' },
  { key: 'fontWeight', label: '字体粗细' },
  { key: 'lineHeight', label: '行高' },
  { key: 'letterSpacing', label: '字间距' },
  { key: 'textAlign', label: '左右对齐' },
  { key: 'verticalAlign', label: '上下对齐' },
  { key: 'opacity', label: '不透明度' },
  { key: 'padding', label: '内间距' },
  { key: 'nursingGap', label: '护理文书间距' },
]

export const styleMap = {
  left: 'x 坐标',
  top: 'y 坐标',
  rotate: '旋转角度',
  width: '宽',
  height: '高',
  color: '颜色',
  backgroundColor: '背景色',
  borderWidth: '边框宽度',
  borderStyle: '边框风格',
  borderColor: '边框颜色',
  borderRadius: '边框半径（圆角）',
  fontSize: '字体大小',
  fontWeight: '字体粗细',
  lineHeight: '行高',
  letterSpacing: '字间距',
  textAlign: '左右对齐',
  verticalAlign: '上下对齐',
  opacity: '不透明度',
}

export const textAlignOptions = [
  {
    label: '左对齐',
    value: 'left',
  },
  {
    label: '居中',
    value: 'center',
  },
  {
    label: '右对齐',
    value: 'right',
  },
]

export const borderStyleOptions = [
  {
    label: '无',
    value: 'none',
  },
  {
    label: '实线',
    value: 'solid',
  },
  {
    label: '虚线',
    value: 'dashed',
  },
]

export const verticalAlignOptions = [
  {
    label: '上对齐',
    value: 'top',
  },
  {
    label: '居中对齐',
    value: 'middle',
  },
  {
    label: '下对齐',
    value: 'bottom',
  },
]

export const selectKey = ['textAlign', 'borderStyle', 'verticalAlign']

export const optionMap = {
  textAlign: textAlignOptions,
  borderStyle: borderStyleOptions,
  verticalAlign: verticalAlignOptions,
}

export const dataFields = [
  { label: '无', value: '0' },
  { label: '床位号', value: 'bedName' },
  { label: '科室名称', value: 'deptName' },
  { label: '患者ID', value: 'patientId' },
  { label: '患者姓名', value: 'name' },
  { label: '患者性别', value: 'sex' },
  { label: '患者年龄', value: 'age' },
  { label: '医保类型', value: 'healthInsurance' },
  { label: '患者性别+年龄+医保类型', value: 'sexagehealthInsurance' },
  { label: '入院日期', value: 'admissionDate' },
  { label: '医生姓名', value: 'doctor' },
  { label: '护士姓名', value: 'nurse' },
  { label: '二维码', value: 'qrCode' },
  { label: '医疗消息', value: 'nurseMessage' },
  { label: '护理文书', value: 'nursingTags' },
  { label: '输液消息', value: 'infusion' },
]

export const eventFields = [
  { label: '无', value: '0' },
  { label: '更多选项', value: 'showMenus' },
  { label: '护理工具', value: 'nursingTools' },
  { label: '扫码点餐', value: 'scanOrder' },
  { label: '健康宣教', value: 'healthEducation' },
  { label: '历史消息', value: 'historyMessage' },
  { label: '检查手术', value: 'examSurgery' },
  { label: '问卷调查', value: 'survey' },
  { label: '退出应用', value: 'exitApp' },
  { label: '呼叫', value: 'call' },
  { label: '定位', value: 'location' },
  { label: '入院须知', value: 'admissionNotice' },
  { label: '费用查询', value: 'feeQuery' }
]

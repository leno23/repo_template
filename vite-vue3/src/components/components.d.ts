// import { ButtonProps } from 'tdesign-vue-next'
// import { TNode } from 'tdesign-vue-next/es/common'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    // components下的全局组件
    Card: typeof import('./Card/index.vue')['default']
    Rate: typeof import('./Rate/index.vue')['default']
    FilterInput: typeof import('./FilterInput/index.vue')['default']
    CloudProviderLogo: typeof import('./CloudProviderLogo/index.vue')['default']
    BusinessSelect: typeof import('./BusinessSelect/index.vue')['default']

    VxeButton: typeof import('vxe-table')['Button']
    VxeCheckbox: typeof import('vxe-table')['Checkbox']
    VxeCheckboxGroup: typeof import('vxe-table')['CheckboxGroup']
    VxeColgroup: typeof import('vxe-table')['Colgroup']
    VxeColumn: typeof import('vxe-table')['Column']
    VxeForm: typeof import('vxe-table')['Form']
    VxeFormGather: typeof import('vxe-table')['FormGather']
    VxeFormItem: typeof import('vxe-table')['FormItem']
    VxeGrid: typeof import('vxe-table')['Grid']
    VxeIcon: typeof import('vxe-table')['Icon']
    VxeInput: typeof import('vxe-table')['Input']
    VxeList: typeof import('vxe-table')['List']
    VxeModal: typeof import('vxe-table')['Modal']
    VxeOptgroup: typeof import('vxe-table')['Optgroup']
    VxeOption: typeof import('vxe-table')['Option']
    VxePager: typeof import('vxe-table')['Pager']
    VxePulldown: typeof import('vxe-table')['Pulldown']
    VxeRadio: typeof import('vxe-table')['Radio']
    VxeRadioButton: typeof import('vxe-table')['RadioButton']
    VxeRadioGroup: typeof import('vxe-table')['RadioGroup']
    VxeSelect: typeof import('vxe-table')['Select']
    VxeSwitch: typeof import('vxe-table')['Switch']
    VxeTable: typeof import('vxe-table')['Table']
    VxeTextarea: typeof import('vxe-table')['Textarea']
    VxeToolbar: typeof import('vxe-table')['Toolbar']
    VxeTooltip: typeof import('vxe-table')['Tooltip']

    // tdesign终于加了global.d.ts文件，但是官方的也写漏组件了
    TAffix: typeof import('tdesign-vue-next')['Affix'];
    TAlert: typeof import('tdesign-vue-next')['Alert'];
    TAnchor: typeof import('tdesign-vue-next')['Anchor'];
    TAnchorItem: typeof import('tdesign-vue-next')['AnchorItem'];
    TAnchorTarget: typeof import('tdesign-vue-next')['AnchorTarget'];
    TAside: typeof import('tdesign-vue-next')['Aside'];
    TAutoComplete: typeof import('tdesign-vue-next')['AutoComplete'];
    TAvatar: typeof import('tdesign-vue-next')['Avatar'];
    TAvatarGroup: typeof import('tdesign-vue-next')['AvatarGroup'];
    TBadge: typeof import('tdesign-vue-next')['Badge'];
    TBaseTable: typeof import('tdesign-vue-next')['BaseTable'];
    TBreadcrumb: typeof import('tdesign-vue-next')['Breadcrumb'];
    TBreadcrumbItem: typeof import('tdesign-vue-next')['BreadcrumbItem'];
    TButton: typeof import('tdesign-vue-next')['Button'];
    TCalendar: typeof import('tdesign-vue-next')['Calendar'];
    TCard: typeof import('tdesign-vue-next')['Card'];
    TCascader: typeof import('tdesign-vue-next')['Cascader'];
    TCascaderPanel: typeof import('tdesign-vue-next')['CascaderPanel'];
    TCheckTag: typeof import('tdesign-vue-next')['CheckTag'];
    TCheckbox: typeof import('tdesign-vue-next')['Checkbox'];
    TCheckboxGroup: typeof import('tdesign-vue-next')['CheckboxGroup'];
    TCol: typeof import('tdesign-vue-next')['Col'];
    TCollapse: typeof import('tdesign-vue-next')['Collapse'];
    TCollapsePanel: typeof import('tdesign-vue-next')['CollapsePanel'];
    TColorPicker: typeof import('tdesign-vue-next')['ColorPicker'];
    TColorPickerPanel: typeof import('tdesign-vue-next')['ColorPickerPanel'];
    TComment: typeof import('tdesign-vue-next')['Comment'];
    TConfigProvider: typeof import('tdesign-vue-next')['ConfigProvider'];
    TContent: typeof import('tdesign-vue-next')['Content'];
    TDatePicker: typeof import('tdesign-vue-next')['DatePicker'];
    TDatePickerPanel: typeof import('tdesign-vue-next')['DatePickerPanel'];
    TDateRangePicker: typeof import('tdesign-vue-next')['DateRangePicker'];
    TDateRangePickerPanel: typeof import('tdesign-vue-next')['DateRangePickerPanel'];
    TDialog: typeof import('tdesign-vue-next')['Dialog'];
    TDivider: typeof import('tdesign-vue-next')['Divider'];
    TDrawer: typeof import('tdesign-vue-next')['Drawer'];
    TDropdown: typeof import('tdesign-vue-next')['Dropdown'];
    TDropdownItem: typeof import('tdesign-vue-next')['DropdownItem'];
    TDropdownMenu: typeof import('tdesign-vue-next')['DropdownMenu'];
    TEnhancedTable: typeof import('tdesign-vue-next')['EnhancedTable'];
    TFooter: typeof import('tdesign-vue-next')['Footer'];
    TForm: typeof import('tdesign-vue-next')['Form'];
    TFormItem: typeof import('tdesign-vue-next')['FormItem'];
    TGuide: typeof import('tdesign-vue-next')['Guide'];
    THeadMenu: typeof import('tdesign-vue-next')['HeadMenu'];
    THeader: typeof import('tdesign-vue-next')['Header'];
    THighlightOption: typeof import('tdesign-vue-next')['HighlightOption'];
    TIcon: typeof import('tdesign-vue-next')['Icon'];
    TImage: typeof import('tdesign-vue-next')['Image'];
    TImageViewer: typeof import('tdesign-vue-next')['ImageViewer'];
    TInput: typeof import('tdesign-vue-next')['Input'];
    TInputAdornment: typeof import('tdesign-vue-next')['InputAdornment'];
    TInputGroup: typeof import('tdesign-vue-next')['InputGroup'];
    TInputNumber: typeof import('tdesign-vue-next')['InputNumber'];
    TJumper: typeof import('tdesign-vue-next')['Jumper'];
    TLayout: typeof import('tdesign-vue-next')['Layout'];
    TLink: typeof import('tdesign-vue-next')['Link'];
    TList: typeof import('tdesign-vue-next')['List'];
    TListItem: typeof import('tdesign-vue-next')['ListItem'];
    TListItemMeta: typeof import('tdesign-vue-next')['ListItemMeta'];
    TLoading: typeof import('tdesign-vue-next')['Loading'];
    TMenu: typeof import('tdesign-vue-next')['Menu'];
    TMenuGroup: typeof import('tdesign-vue-next')['MenuGroup'];
    TMenuItem: typeof import('tdesign-vue-next')['MenuItem'];
    TMessage: typeof import('tdesign-vue-next')['Message'];
    TNotification: typeof import('tdesign-vue-next')['Notification'];
    TOption: typeof import('tdesign-vue-next')['Option'];
    TOptionGroup: typeof import('tdesign-vue-next')['OptionGroup'];
    TPagination: typeof import('tdesign-vue-next')['Pagination'];
    TPopconfirm: typeof import('tdesign-vue-next')['Popconfirm'];
    TPopup: typeof import('tdesign-vue-next')['Popup'];
    TPrimaryTable: typeof import('tdesign-vue-next')['PrimaryTable'];
    TProgress: typeof import('tdesign-vue-next')['Progress'];
    TRadio: typeof import('tdesign-vue-next')['Radio'];
    TRadioButton: typeof import('tdesign-vue-next')['RadioButton'];
    TRadioGroup: typeof import('tdesign-vue-next')['RadioGroup'];
    TRangeInput: typeof import('tdesign-vue-next')['RangeInput'];
    TRangeInputPopup: typeof import('tdesign-vue-next')['RangeInputPopup'];
    TRate: typeof import('tdesign-vue-next')['Rate'];
    TRow: typeof import('tdesign-vue-next')['Row'];
    TSelect: typeof import('tdesign-vue-next')['Select'];
    TSelectInput: typeof import('tdesign-vue-next')['SelectInput'];
    TSkeleton: typeof import('tdesign-vue-next')['Skeleton'];
    TSlider: typeof import('tdesign-vue-next')['Slider'];
    TSliderButton: typeof import('tdesign-vue-next')['SliderButton'];
    TSpace: typeof import('tdesign-vue-next')['Space'];
    TStepItem: typeof import('tdesign-vue-next')['StepItem'];
    TSteps: typeof import('tdesign-vue-next')['Steps'];
    TSubmenu: typeof import('tdesign-vue-next')['Submenu'];
    TSwiper: typeof import('tdesign-vue-next')['Swiper'];
    TSwiperItem: typeof import('tdesign-vue-next')['SwiperItem'];
    TSwitch: typeof import('tdesign-vue-next')['Switch'];
    TTabPanel: typeof import('tdesign-vue-next')['TabPanel'];
    TTable: typeof import('tdesign-vue-next')['Table'];
    TTabs: typeof import('tdesign-vue-next')['Tabs'];
    TTag: typeof import('tdesign-vue-next')['Tag'];
    TTagInput: typeof import('tdesign-vue-next')['TagInput'];
    TTextarea: typeof import('tdesign-vue-next')['Textarea'];
    TTimePicker: typeof import('tdesign-vue-next')['TimePicker'];
    TTimePickerPanel: typeof import('tdesign-vue-next')['TimePickerPanel'];
    TTimeRangePicker: typeof import('tdesign-vue-next')['TimeRangePicker'];
    TTimeline: typeof import('tdesign-vue-next')['Timeline'];
    TTimelineItem: typeof import('tdesign-vue-next')['TimelineItem'];
    TTooltip: typeof import('tdesign-vue-next')['Tooltip'];
    TTransfer: typeof import('tdesign-vue-next')['Transfer'];
    TTree: typeof import('tdesign-vue-next')['Tree'];
    TTreeSelect: typeof import('tdesign-vue-next')['TreeSelect'];
    TUpload: typeof import('tdesign-vue-next')['Upload'];

    BusinessSelect: typeof import('./BusinessSelect/index.vue')['default']
  }

  // import type { LoadingPluginType, MessagePluginType, NotificationPluginType, DialogMethod } from 'tdesign-vue-next'
  // interface ComponentCustomProperties {
  //   // 扩展在globalProperties上的tdesign的方法(虽然不会这样用)
  //   $message: MessagePluginType
  //   $dialog: DialogMethod
  //   $notify: NotificationPluginType
  //   $loading: LoadingPluginType
  // }
}

// declare module 'tdesign-vue-next' {
//   export interface TdDialogProps {
//     confirmBtn?: string | null | TNode | ButtonProps
//   }
// }

export {}

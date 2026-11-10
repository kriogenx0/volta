// Logical sidebar groupings for the component list. A group is alphabetical (the
// smoke test checks it) unless it says `ordered: true`, which keeps the order written
// here on purpose. Every name here must exist in components/index.js --
// Components-examples.jsx asserts this.
export default [
  {
    // The fields people type into or choose a value in, in the order written
    label: 'Inputs',
    ordered: true,
    components: [
      'TextBox', 'AutoComplete', 'ComboBox', 'NumericField',
      'MultiSelect', 'NativeSelect', 'TimePicker', 'DatePicker', 'TextEditable',
    ],
  },
  {
    // Anything you pick, toggle, press or edit in place
    label: 'Controls',
    components: [
      'Button', 'Checkbox', 'CheckboxGroup', 'ColorPicker', 'Radio', 'RadioGroup',
      'SegmentedControl', 'Slider', 'TagInput', 'Toggle',
    ],
  },
  {
    // The structure around a field: its label, hint and layout, and whole forms
    label: 'Forms',
    components: ['BaseForm', 'Field', 'FieldHint', 'FieldLabel', 'FieldRow', 'Label'],
  },
  {
    label: 'Navigation',
    components: [
      'Link', 'NavBar', 'NavSidebar', 'PageHeading', 'PageWidth', 'SideBarList', 'Tabs',
    ],
  },
  {
    label: 'Layout',
    components: [
      'Alert', 'Card', 'Dialog', 'Drawer', 'FullView', 'Layer', 'Lazy', 'Modal',
      'Overlay', 'SplitView',
    ],
  },
  {
    label: 'Feedback & Status',
    components: [
      'Badge', 'Empty', 'ErrorList', 'ErrorMessage', 'IndicatorDot', 'Loader', 'Message',
      'ProgressBar', 'ToastMessage', 'Tooltip',
    ],
  },
  {
    label: 'Media & Files',
    components: [
      'AudioTrack', 'Avatar', 'Calendar', 'FileManager', 'FilePicker', 'FileUploader',
      'ImageCrop', 'ImageDropZone', 'ImagePicker', 'ImageUploader', 'Map', 'MapSelector',
      'MobilePhone', 'Thumb', 'VideoPlayer', 'VideoUploadPlayer',
    ],
  },
  {
    label: 'Actions & Menus',
    components: [
      'ActionMenu', 'ClipboardHover', 'CloseButton', 'Dropdown', 'DropdownList',
      'IconButton', 'Tag',
    ],
  },
  {
    label: 'Rich Text',
    components: [
      'Code', 'ContentEditable', 'RichText',
    ],
  },
  {
    label: 'Lists',
    components: [
      'List', 'ListDefinitions',
    ],
  },
  {
    label: 'Icons',
    components: [
      'Icon',
    ],
  },
];

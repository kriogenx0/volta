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
      'Button', 'Checkbox', 'CheckboxGroup', 'ColorPicker', 'NativeColorPicker', 'NativeSlider', 'Radio', 'RadioGroup',
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
      'Card', 'FullView', 'Lazy', 'SplitView',
    ],
  },
  {
    // What opens over the page: dialogs, alerts, panels and the layers behind them
    label: 'Modals',
    components: [
      'Alert', 'Dialog', 'Drawer', 'Layer', 'Modal', 'Overlay',
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
      'AudioPlayer', 'Avatar', 'Calendar', 'FileManager', 'FilePicker', 'FileUploader',
      'ImageCrop', 'ImageDropZone', 'ImagePicker', 'ImageUploader',
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
    // Text and what it is made of: editable text, rich text, and label and value pairs
    label: 'Text',
    components: [
      'ContentEditable', 'Definitions', 'RichText',
    ],
  },
  {
    // Components whose job is to put a third-party library behind Volta's props
    label: 'External Libraries',
    components: [
      'Code', 'Map', 'MapSelector',
    ],
  },
  {
    label: 'Lists',
    components: [
      'List',
    ],
  },
  {
    label: 'Icons',
    components: [
      'Icon',
    ],
  },
];

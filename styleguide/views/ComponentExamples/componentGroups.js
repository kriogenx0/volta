// Logical sidebar groupings for the component list. Each group is alphabetical
// (the smoke test checks it). Every name here must
// exist in components/index.js -- Components-examples.jsx asserts this.
export default [
  {
    // Anything you type into, plus the text around a field (label, hint, error)
    label: 'Form Text',
    components: [
      'AutoComplete', 'ComboBox', 'DatePicker', 'Field', 'FieldHint', 'FieldLabel',
      'FieldRow', 'Label', 'NumericField', 'SearchSelector', 'TagInput', 'TextBox',
      'TextEditable',
    ],
  },
  {
    // Anything you pick, toggle or press
    label: 'Form Controls',
    components: [
      'BaseForm', 'Button', 'Checkbox', 'CheckboxGroup', 'ColorPalettePicker',
      'ColorPicker', 'MultiSelect', 'Radio', 'RadioGroup', 'SegmentedControl', 'Select',
      'Slider', 'TimePicker', 'Toggle',
    ],
  },
  {
    label: 'Navigation',
    components: [
      'ActionLink', 'GlobalNav', 'Link', 'NavBar', 'PageHeading', 'PageWidth', 'TabBar',
      'Tabs', 'TabsRouted',
    ],
  },
  {
    label: 'Layout & Overlays',
    components: [
      'Alert', 'Card', 'Dialog', 'Drawer', 'FullView', 'Layer', 'Lazy', 'Modal',
      'ModalDialog', 'Overlay', 'PopOver', 'SplitView',
    ],
  },
  {
    label: 'Feedback & Status',
    components: [
      'Badge', 'Empty', 'ErrorList', 'ErrorText', 'IndicatorDot', 'Loader', 'Message',
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
      'List', 'ListCard', 'ListDefinitions',
    ],
  },
  {
    label: 'Icons',
    components: [
      'Icon',
    ],
  },
];

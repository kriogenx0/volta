// Logical sidebar groupings for the component list. Every name here must
// exist in components/index.js -- Components-examples.jsx asserts this.
export default [
  {
    // Anything you type into, plus the text around a field (label, hint, error)
    label: 'Form Text',
    components: [
      'TextField', 'Textarea', 'TextEditable', 'NumericField',
      'TagInput', 'ComboBox', 'AutoComplete', 'SearchSelector', 'DateInput',
      'DatePicker', 'BaseInput', 'Label', 'Field', 'FieldRow', 'FormRow',
    ],
  },
  {
    // Anything you pick, toggle or press
    label: 'Form Controls',
    components: [
      'Button', 'Checkbox', 'CheckboxGroup', 'Radio', 'RadioGroup', 'Select',
      'MultiSelect', 'Slider', 'Toggle', 'SegmentedControl', 'TimePicker',
      'ColorPicker', 'ColorPalettePicker', 'BaseForm',
    ],
  },
  {
    label: 'Navigation',
    components: [
      'GlobalNav', 'NavBar', 'TabBar', 'Tabs', 'TabsRouted', 'Link',
      'ActionLink', 'PageHeading', 'PageWidth',
    ],
  },
  {
    label: 'Layout & Overlays',
    components: [
      'Card', 'Drawer', 'FullView', 'SplitView', 'Overlay', 'Layer',
      'Dialog', 'Modal', 'ModalDialog', 'Alert', 'PopOver',
    ],
  },
  {
    label: 'Feedback & Status',
    components: [
      'Badge', 'Empty', 'IndicatorDot', 'Loader', 'ProgressBar', 'ToastMessage', 'Tooltip',
      'Message', 'ErrorList', 'ErrorText',
    ],
  },
  {
    label: 'Media & Files',
    components: [
      'AudioTrack', 'Avatar', 'Calendar', 'FileManager', 'FilePicker', 'FileUploader',
      'ImageCrop', 'ImageDropZone', 'ImagePicker', 'ImageUploader',
      'VideoPlayer', 'VideoUploadPlayer', 'MobilePhone', 'Map', 'MapSelector', 'Thumb',
    ],
  },
  {
    label: 'Actions & Menus',
    components: [
      'ActionMenu', 'ClipboardHover', 'CloseButton', 'IconButton', 'Dropdown',
      'DropdownList', 'Tag',
    ],
  },
  {
    label: 'Rich Text',
    components: ['CKEditor', 'ContentEditable', 'RichTextQuill', 'RichTextTinyMCE', 'Code'],
  },
  {
    label: 'Lists',
    components: ['ListDefinitions', 'List', 'ListHeader', 'FilterSectionListItem', 'ListCard', 'ListCardRow'],
  },
  {
    label: 'Icons',
    components: ['Icon'],
  },
];

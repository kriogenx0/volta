// Logical sidebar groupings for the component list. Every name here must
// exist in components/index.js -- Components-examples.jsx asserts this.
export default [
  {
    label: 'Forms & Inputs',
    components: [
      'Button', 'Checkbox', 'CheckboxGroup', 'ComboBox', 'DateInput',
      'DatePicker', 'Field', 'FieldRow', 'BaseForm',
      'BaseInput', 'FormRow', 'Label', 'MultiSelect', 'NumericField',
      'Radio', 'RadioGroup', 'Select', 'Slider', 'TagInput', 'TextBox',
      'Textarea', 'TextEditable', 'TextField', 'TimePicker', 'Toggle',
      'AutoComplete', 'SearchSelector', 'SegmentedControl', 'ColorPicker',
      'ColorPalettePicker',
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
      'Badge', 'Empty', 'IndicatorDot', 'Loader', 'ProgressBar', 'Toast', 'Tooltip',
      'Message', 'ErrorList', 'ErrorText',
    ],
  },
  {
    label: 'Media & Files',
    components: [
      'AudioTrack', 'Avatar', 'Calendar', 'FileManager', 'FilePicker', 'FileUploader',
      'ImageCrop', 'ImageDropZone', 'ImagePicker', 'ImageUploader',
      'VideoPlayer', 'VideoUploadPlayer', 'MobilePhone', 'Map', 'MapSelector',
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

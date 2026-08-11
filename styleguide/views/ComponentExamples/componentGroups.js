// Logical sidebar groupings for the component list. Every name here must
// exist in components/index.js -- Components-examples.jsx asserts this.
export default [
  {
    label: 'Forms & Inputs',
    components: [
      'Button', 'Checkbox', 'CheckboxGroup', 'ComboBox', 'DateInput',
      'DatePicker', 'DateFormat', 'Field', 'FormField', 'BaseForm',
      'BaseInput', 'FormRow', 'Label', 'MultiSelect', 'NumericField',
      'Radio', 'RadioGroup', 'Select', 'Slider', 'TagInput', 'TextBox',
      'TextEditable', 'TextField', 'TimePicker', 'Toggle', 'AutoComplete',
      'SearchSelector', 'SegmentedControl', 'ColorPicker', 'ColorPalettePicker',
    ],
  },
  {
    label: 'Navigation',
    components: [
      'GlobalNav', 'NavBar', 'TabBar', 'Tabs', 'TabsRouted', 'Link',
      'PageHeading', 'PageWidth',
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
      'Badge', 'Empty', 'IndicatorDot', 'Loader', 'LoaderBars', 'LoaderClock',
      'LoaderKnob', 'LoaderSpinner', 'ProgressBar', 'Toast', 'Tooltip',
      'Message', 'ErrorList',
    ],
  },
  {
    label: 'Media & Files',
    components: [
      'AudioTrack', 'Calendar', 'FileManager', 'FilePicker', 'FileUploader',
      'ImageCrop', 'ImageDropZone', 'ImagePicker', 'ImageUploader',
      'VideoPlayer', 'VideoUploadPlayer', 'MobilePhone', 'Map', 'MapSelector',
    ],
  },
  {
    label: 'Actions & Menus',
    components: [
      'ActionMenu', 'ClipboardHover', 'CloseButton', 'Dropdown',
      'DropdownList', 'Tag',
    ],
  },
  {
    label: 'Rich Text',
    components: ['CKEditor', 'ContentEditable', 'RichTextQuill', 'RichTextTinyMCE'],
  },
  {
    label: 'Lists',
    components: ['ListDefinitions', 'List', 'ListHeader', 'FilterSectionListItem'],
  },
  {
    label: 'Icons',
    components: ['Icon'],
  },
];

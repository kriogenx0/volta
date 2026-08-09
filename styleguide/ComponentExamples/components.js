import * as Volta from '../../components';

import ActionMenuExamples from '../../components/ActionMenu/ActionMenu-examples';
import BadgeExamples from '../../components/Badge/Badge-examples';
import ButtonExamples from '../../components/Button/Button-examples';
import CardExamples from '../../components/Card/Card-examples';
import CheckboxExamples from '../../components/Checkbox/Checkbox-examples';
import CheckboxGroupExamples from '../../components/CheckboxGroup/CheckboxGroup-examples';
import ClipboardHoverExamples from '../../components/ClipboardHover/ClipboardHover-examples';
import CloseButtonExamples from '../../components/CloseButton/CloseButton-examples';
import DateInputExamples from '../../components/DateInput/DateInput-examples';
import DrawerExamples from '../../components/Drawer/Drawer-examples';
import DropdownExamples from '../../components/Dropdown/Dropdown-examples';
import DropdownListExamples from '../../components/DropdownList/DropdownList-examples';
import EmptyExamples from '../../components/Empty/Empty-examples';
import FieldExamples from '../../components/Field/Field-examples';
import FileManagerExamples from '../../components/FileManager/FileManager-examples';
import FilePickerExamples from '../../components/FilePicker/FilePicker-examples';
import FileUploaderExamples from '../../components/FileUploader/FileUploader-examples';
import FormFieldExamples from '../../components/FormField/FormField-examples';
import FullViewExamples from '../../components/FullView/FullView-examples';
import GlobalNavExamples from '../../components/GlobalNav/GlobalNav-examples';
import IconExamples from '../../components/Icon/Icon-examples';
import IndicatorDotExamples from '../../components/IndicatorDot/IndicatorDot-examples';
import ListDefinitionsExamples from '../../components/ListDefinitions/ListDefinitions-examples';
import LoaderExamples from '../../components/Loader/Loader-examples';
import ModalExamples from '../../components/Modal/Modal-examples';
import MultiSelectExamples from '../../components/MultiSelect/MultiSelect-examples';
import OverlayExamples from '../../components/Overlay/Overlay-examples';
import ProgressBarExamples from '../../components/ProgressBar/ProgressBar-examples';
import RadioExamples from '../../components/Radio/Radio-examples';
import RadioGroupExamples from '../../components/RadioGroup/RadioGroup-examples';
import SelectExamples from '../../components/Select/Select-examples';
import SplitViewExamples from '../../components/SplitView/SplitView-examples';
import TabsExamples from '../../components/Tabs/Tabs-examples';
import TagExamples from '../../components/Tag/Tag-examples';
import TagInputExamples from '../../components/TagInput/TagInput-examples';
import TextEditableExamples from '../../components/TextEditable/TextEditable-examples';
import TextFieldExamples from '../../components/TextField/TextField-examples';
import ToggleExamples from '../../components/Toggle/Toggle-examples';
import VideoPlayerExamples from '../../components/VideoPlayer/VideoPlayer-examples';
import VideoUploadPlayerExamples from '../../components/VideoUploadPlayer/VideoUploadPlayer-examples';

const curated = [
  ActionMenuExamples,
  BadgeExamples,
  ButtonExamples,
  CardExamples,
  CheckboxExamples,
  CheckboxGroupExamples,
  ClipboardHoverExamples,
  CloseButtonExamples,
  DateInputExamples,
  DrawerExamples,
  DropdownExamples,
  DropdownListExamples,
  EmptyExamples,
  FieldExamples,
  FileManagerExamples,
  FilePickerExamples,
  FileUploaderExamples,
  FormFieldExamples,
  FullViewExamples,
  GlobalNavExamples,
  IconExamples,
  IndicatorDotExamples,
  ListDefinitionsExamples,
  LoaderExamples,
  ModalExamples,
  MultiSelectExamples,
  OverlayExamples,
  ProgressBarExamples,
  RadioExamples,
  RadioGroupExamples,
  SelectExamples,
  SplitViewExamples,
  TabsExamples,
  TagExamples,
  TagInputExamples,
  TextEditableExamples,
  TextFieldExamples,
  ToggleExamples,
  VideoPlayerExamples,
  VideoUploadPlayerExamples,
];

const curatedNames = curated.map((c) => c.name);

// Everything the library exports that doesn't have a curated set of
// examples yet gets a minimal default-props render instead, so the
// styleguide always covers every component in components/index.js.
const generic = Object.keys(Volta)
  .filter((name) => name !== 'Theme' && !curatedNames.includes(name))
  .sort()
  .map((name) => {
    const Component = Volta[name];
    return {
      name,
      description: 'No curated examples yet -- showing a default instance.',
      examples: [
        {
          name: 'Default',
          code: `<${name} />`,
          output: <Component />,
        },
      ],
    };
  });

export default [...curated, ...generic].sort((a, b) => a.name.localeCompare(b.name));

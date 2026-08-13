import Button from '../../components/Button';
import ToastMessage from '../../components/ToastMessage/ToastMessage';

export default {
  name: 'ToastMessage',
  description: 'An imperative, stacking notification shown briefly in the corner of the screen. Call ToastMessage.success/error/warning/info(message) from anywhere -- no need to render a component.',
  examples: [
    {
      name: 'Success',
      code: 'ToastMessage.success("Changes saved")',
      output: (
        <Button onClick={() => ToastMessage.success('Changes saved')}>
          Show success toast
        </Button>
      )
    },
    {
      name: 'Error',
      code: 'ToastMessage.error("Something went wrong")',
      output: (
        <Button onClick={() => ToastMessage.error('Something went wrong')}>
          Show error toast
        </Button>
      )
    },
    {
      name: 'Warning',
      code: 'ToastMessage.warning("This action can\'t be undone")',
      output: (
        <Button onClick={() => ToastMessage.warning("This action can't be undone")}>
          Show warning toast
        </Button>
      )
    },
    {
      name: 'Info',
      code: 'ToastMessage.info("A new version is available")',
      output: (
        <Button onClick={() => ToastMessage.info('A new version is available')}>
          Show info toast
        </Button>
      )
    }
  ]
};

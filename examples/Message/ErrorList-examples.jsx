import ErrorList from '../../components/Message/ErrorList';

export default {
  name: 'ErrorList',
  description: 'A list of validation errors keyed by field name, such as a Django REST Framework error response. The field name is shown as a label, except for non_field_errors.',
  examples: [
    {
      name: 'Errors by field',
      code: `<ErrorList
  errors={{
    email: 'Enter a valid email address.',
    password: 'This password is too short.'
  }}
/>`,
      output: (
        <ErrorList
          errors={{
            email: 'Enter a valid email address.',
            password: 'This password is too short.'
          }}
        />
      )
    },
    {
      name: 'Form-level error',
      code: '<ErrorList errors={{ non_field_errors: \'Unable to log in with the provided credentials.\' }} />',
      output: <ErrorList errors={{ non_field_errors: 'Unable to log in with the provided credentials.' }} />
    },
    {
      name: 'Several messages for one field',
      code: `<ErrorList
  errors={{
    username: ['This field may not be blank.', 'Ensure this value has at least 3 characters.']
  }}
/>`,
      output: (
        <ErrorList
          errors={{
            username: ['This field may not be blank.', 'Ensure this value has at least 3 characters.']
          }}
        />
      )
    },
    {
      name: 'No errors',
      code: '<ErrorList errors={{}} />',
      output: <ErrorList errors={{}} />
    }
  ]
};

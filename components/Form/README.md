# BaseForm

A form that posts its fields to a URL, shows the server's validation errors, and calls back on the response. `BaseInput` and `FormRow` are its building blocks.

## When to use

- **A simple form-encoded POST** such as login or sign-up, where the server answers 200, 201 or 400 with errors keyed by field name (a Django REST Framework style response).
- A form with client-side validation, a JSON API or several states is better built from [`Field`](../Field/README.md) with `TextField` and your own submit handler. Showing field-keyed server errors on their own is [`ErrorList`](../Message/README.md).
- `FormRow` alone is a label beside a control with helper text and errors, for forms you build yourself. A ruled settings row is [`FieldRow`](../FieldRow/README.md).

## Usage

```jsx
import { BaseForm } from 'volta';

<BaseForm
  action="/auth/login/"
  fields={[
    { fieldName: 'username', inputType: 'text', displayName: 'Username' },
    { fieldName: 'password', inputType: 'password', displayName: 'Password' },
  ]}
  submitValue="Log In"
  handle200={(response) => goHome()}
  handle400={(response, body) => track(body)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `action` | `string` | | The URL to POST to. The form sends `multipart/form-data` with `fetch` and `credentials: 'include'`. |
| `fields` | `{ fieldName, inputType, displayName }[]` | `[]` | The inputs. `fieldName` is required and is the input's `name` and React key; `inputType` is the native `type`; `displayName` is the placeholder and `aria-label`. |
| `submitValue` | `string` | `'Submit'` | The submit button text. |
| `submittingValue` | `string` | `'Submitting...'` | The button text, disabled, while the request runs. |
| `handle200` | `function` | `null` | Called with the response on 200. |
| `handle201` | `function` | `null` | Called with the response on 201. |
| `handle400` | `function` | `null` | Called with `(response, body)` on 400; `body` is the parsed JSON, which is also shown as errors above the fields. |
| `handle404` | `function` | `null` | Called with the response on 404. |
| `autoSelectFirst` | `bool` | `false` | Focuses the first field on mount. |
| `showSubmit` | `bool` | `true` | When `false` the submit button is hidden; submit from outside with `shouldSubmit`. |
| `shouldSubmit` | `bool` | `false` | Submits the form when it becomes `true` (and on mount if it starts `true`). Reset it in `onSubmit` to submit again. |
| `onSubmit` | `function` | no-op | Called, with no arguments, when a submit starts. |
| `centered` | `bool` | | Centres the text in the inputs. |
| `submitButtonClass` | `string` | `''` | Extra class on the submit button. |
| `children` | `node` | | Extra content between the fields and the submit button. Named inputs in it are sent too. |

Any other status, or a network failure, shows a "SERVER ERROR" line and calls no handler. The submit button is a native `input` or `button` styled by the form's own stylesheet (`btn btn-primary` classes), not the Volta `Button`.

## BaseInput props

A text input with no visible label: `displayName` is both its placeholder and its `aria-label`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `fieldName` | `string` | | The input's `name`. |
| `inputType` | `string` | | The native `type` (`text`, `password`, `email`). |
| `displayName` | `string` | | Placeholder and `aria-label`. |
| `centered` | `bool` | | Centres the text. |
| `autoSelect` | `bool` | | Focuses it once, on mount. |

## FormRow props

A label column beside a body column that wraps below it on narrow widths.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | `null` | The row label. A `<p>`, not a `<label>`. |
| `optionalText` | `string` | `null` | Small muted detail under the label. |
| `helperText` | `string` | `null` | A line under the control. |
| `errors` | `string[]` | `[]` | Messages shown under the control, only when `showError` is `true`. |
| `showError` | `bool` | `false` | Shows `errors` and adds `is-error` to the row. |
| `isFlush` | `bool` | | Removes the label's top padding, for a control taller than one line. |
| `isValid` | `bool` | | Declared but not used. |
| `className` | `string` | `''` | Added to the row. |
| `children` | `node` | | The control. |

## Accessibility

- `BaseInput` has an `aria-label` but no visible label; once a user types, the placeholder is gone. Prefer `FormRow` with `TextField` where a visible label matters.
- Errors are a list above the fields with no live region and no link to the input, so a screen reader is not told when they appear. `FormRow` errors are the same: text only, no `role="alert"`, no `aria-describedby`.
- `FormRow`'s label is not tied to its control. Give the control its own `aria-label`.
- The submit button is native, so Enter in a field submits. Errors are text, not colour alone.

## Do and don't

- Do return 400 with `{ fieldName: ['message'] }` so errors appear under the right name; `non_field_errors` is shown without a name.
- Do reset `shouldSubmit` in `onSubmit` when submitting from a button of your own.
- Don't use it for a JSON API; it sends form data.
- Don't pass `isValid`; it does nothing.
- Don't rely on a `BaseInput` placeholder as the only label where users can't tell from context what a field is for.

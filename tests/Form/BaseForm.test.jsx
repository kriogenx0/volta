import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { BaseForm, BaseInput, FormRow } from '../../components/Form';

const FIELDS = [
  { fieldName: 'username', inputType: 'text', displayName: 'Username' },
  { fieldName: 'password', inputType: 'password', displayName: 'Password' }
];

const respond = (status, body) => Promise.resolve({
  status,
  statusText: status === 500 ? 'Internal Server Error' : '',
  json: () => Promise.resolve(body)
});

const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

describe('BaseForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('renders without crashing', () => {
    const { container } = render(<BaseForm />);
    expect(container).toBeInTheDocument();
  });

  // The app builds JSX with the automatic runtime, which (unlike the classic
  // createElement this suite's Babel config uses) does not apply defaultProps.
  // jsx() hands the component exactly what the app's elements do.
  it('works with no props, as the app builds it', () => {
    render(jsx(BaseForm, {}));
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button.className).not.toMatch(/undefined|null/);
  });

  it('renders one named input per field and a submit button', () => {
    render(<BaseForm fields={FIELDS} submitValue="Log In" />);
    expect(screen.getByRole('textbox', { name: 'Username' })).toHaveAttribute('name', 'username');
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('does not put the word "undefined" in the submit button class', () => {
    render(<BaseForm fields={FIELDS} />);
    expect(screen.getByRole('button', { name: 'Submit' }).className).not.toMatch(/undefined|null/);
  });

  it('adds the submit button class', () => {
    render(<BaseForm submitButtonClass="big" />);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveClass('big');
  });

  it('hides the submit button when showSubmit is off', () => {
    render(<BaseForm showSubmit={false} />);
    expect(screen.getByRole('button', { name: 'Submit', hidden: true }).parentElement).not.toBeVisible();
  });

  it('renders children inside the form', () => {
    render(<BaseForm><p>Extra content</p></BaseForm>);
    expect(screen.getByText('Extra content').closest('form')).toBeInTheDocument();
  });

  it('posts the form data to the action and calls handle200', async () => {
    global.fetch.mockReturnValue(respond(200));
    const handle200 = jest.fn();
    const onSubmit = jest.fn();
    render(<BaseForm action="/login" fields={FIELDS} handle200={handle200} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'alex' } });
    submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(handle200).toHaveBeenCalledTimes(1));
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/login');
    expect(options.method).toBe('POST');
    expect(options.body.get('username')).toBe('alex');
  });

  it('calls handle201 when the server created something', async () => {
    global.fetch.mockReturnValue(respond(201));
    const handle201 = jest.fn();
    render(<BaseForm action="/signup" handle201={handle201} />);
    submit();
    await waitFor(() => expect(handle201).toHaveBeenCalledTimes(1));
  });

  it('shows the field errors from a 400 response and passes them to handle400', async () => {
    const body = { username: ['This field is required.'], non_field_errors: ['Bad credentials.'] };
    global.fetch.mockReturnValue(respond(400, body));
    const handle400 = jest.fn();
    render(<BaseForm action="/login" handle400={handle400} />);
    submit();

    expect(await screen.findByText('This field is required.')).toBeInTheDocument();
    expect(screen.getByText('Bad credentials.')).toBeInTheDocument();
    expect(handle400).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }), body);
  });

  it('shows a page-not-found error on a 404 and calls handle404', async () => {
    global.fetch.mockReturnValue(respond(404));
    const handle404 = jest.fn();
    render(<BaseForm action="/missing" handle404={handle404} />);
    submit();
    expect(await screen.findByText('404 - Page not found.')).toBeInTheDocument();
    expect(handle404).toHaveBeenCalledTimes(1);
  });

  it('shows an error for any other status instead of failing silently', async () => {
    global.fetch.mockReturnValue(respond(500));
    render(<BaseForm action="/broken" />);
    submit();
    expect(await screen.findByText('500 - Internal Server Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('shows the error when the request itself fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network down'));
    render(<BaseForm action="/login" />);
    submit();
    expect(await screen.findByText('Network down')).toBeInTheDocument();
  });

  it('clears earlier errors after a successful submit', async () => {
    global.fetch.mockReturnValueOnce(respond(404)).mockReturnValueOnce(respond(200));
    render(<BaseForm action="/login" />);
    submit();
    expect(await screen.findByText('404 - Page not found.')).toBeInTheDocument();
    submit();
    await waitFor(() => expect(screen.queryByText('404 - Page not found.')).toBeNull());
  });

  it('swaps the submit button for a disabled one while submitting', async () => {
    let finish;
    global.fetch.mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    render(<BaseForm action="/login" submittingValue="Working..." />);
    submit();

    const busy = await screen.findByRole('button', { name: 'Working...' });
    expect(busy).toBeDisabled();
    fireEvent.click(busy);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    finish({ status: 200 });
    expect(await screen.findByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits when shouldSubmit turns on', async () => {
    global.fetch.mockReturnValue(respond(200));
    const { rerender } = render(<BaseForm action="/login" shouldSubmit={false} />);
    expect(global.fetch).not.toHaveBeenCalled();
    rerender(<BaseForm action="/login" shouldSubmit />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it('focuses the first field when autoSelectFirst is on', () => {
    render(<BaseForm fields={FIELDS} autoSelectFirst />);
    expect(screen.getByLabelText('Username')).toHaveFocus();
  });
});

describe('BaseInput', () => {
  it('renders a named input with a placeholder and an accessible name', () => {
    render(<BaseInput inputType="email" fieldName="email" displayName="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('placeholder', 'Email');
  });

  it('centers its text when centered', () => {
    render(<BaseInput fieldName="email" displayName="Email" centered />);
    expect(screen.getByRole('textbox')).toHaveClass('l-text-align-center');
  });

  it('does not take focus again when the form re-renders', () => {
    const { rerender } = render(<><BaseInput fieldName="a" displayName="A" autoSelect /><input aria-label="Other" /></>);
    expect(screen.getByLabelText('A')).toHaveFocus();

    screen.getByLabelText('Other').focus();
    rerender(<><BaseInput fieldName="a" displayName="A" autoSelect /><input aria-label="Other" /></>);
    expect(screen.getByLabelText('Other')).toHaveFocus();
  });
});

describe('FormRow', () => {
  it('shows the label, details and help text around its children', () => {
    render(
      <FormRow label="Name" optionalText="Optional" helperText="Shown publicly">
        <input aria-label="Name field" />
      </FormRow>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Optional')).toBeInTheDocument();
    expect(screen.getByText('Shown publicly')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name field' })).toBeInTheDocument();
  });

  it('shows errors only when showError is on', () => {
    const { container, rerender } = render(<FormRow label="Name" errors={['Too short']} />);
    expect(screen.queryByText('Too short')).toBeNull();
    expect(container.firstChild).not.toHaveClass('is-error');

    rerender(<FormRow label="Name" errors={['Too short', 'Not unique']} showError />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByText('Not unique')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('is-error');
  });

  it('works with no props, as the app builds it', () => {
    const { container } = render(jsx(FormRow, { showError: true }));
    expect(container.firstChild).toHaveClass('volta-form_row');
  });

  it('renders with no props and keeps a custom class', () => {
    const { container, rerender } = render(<FormRow />);
    expect(container.firstChild).toHaveClass('volta-form_row');
    rerender(<FormRow className="extra" />);
    expect(container.firstChild).toHaveClass('extra');
  });
});

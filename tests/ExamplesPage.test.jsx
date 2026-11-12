import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import VoltaDocs from '../styleguide/views/VoltaDocs';
import Examples, { EXAMPLES } from '../styleguide/views/Examples/Examples';

const showExamples = () => render(<MemoryRouter><Examples /></MemoryRouter>);
const open = (label) => fireEvent.click(within(screen.getByRole('navigation', { name: 'Example pages' })).getByRole('button', { name: label }));

describe('the Examples page', () => {
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('is in the styleguide header, after Components, and opens at /examples', () => {
    render(<MemoryRouter><VoltaDocs /></MemoryRouter>);
    const header = within(screen.getByRole('navigation', { name: 'Styleguide sections' }));
    const names = header.getAllByRole('button').map((button) => button.textContent);
    expect(names.indexOf('Examples')).toBe(names.indexOf('Components') + 1);
    fireEvent.click(header.getByRole('button', { name: 'Examples' }));
    expect(window.location.pathname).toBe('/examples');
    expect(screen.getByRole('heading', { name: 'Login', level: 2 })).toBeInTheDocument();
  });

  it('lists the common pages: login, signup, dashboard, list, table and settings', () => {
    showExamples();
    expect(EXAMPLES.map(({ label }) => label)).toEqual(['Login', 'Signup', 'Dashboard', 'List', 'Table', 'Settings']);
    EXAMPLES.forEach(({ label }) => expect(screen.getByRole('button', { name: label })).toBeInTheDocument());
  });

  it.each(EXAMPLES.map(({ label }) => [label]))('shows the %s page, titled and described, with no errors', (label) => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    showExamples();
    open(label);
    expect(screen.getByRole('heading', { name: label, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-current', 'page');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

describe('the example pages', () => {
  beforeEach(showExamples);

  it('Login asks for the password and says so when it is missing', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByText('Enter your password.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('status')).toHaveTextContent('Signed in');
  });

  it('Login and Signup link to each other', () => {
    fireEvent.click(screen.getByRole('link', { name: 'Create an account' }));
    expect(screen.getByRole('heading', { name: 'Signup', level: 2 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Sign in' }));
    expect(screen.getByRole('heading', { name: 'Login', level: 2 })).toBeInTheDocument();
  });

  it('Signup keeps the button off until the terms are agreed', () => {
    open('Signup');
    expect(screen.getByRole('button', { name: 'Create account' })).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled();
  });

  it('Dashboard shows the numbers, goals and activity', () => {
    open('Dashboard');
    expect(screen.getByText('$48,290')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
    expect(screen.getByText(/published "Launch checklist"/)).toBeInTheDocument();
  });

  it('List filters by the search and shows an empty state', () => {
    open('List');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search people' }), { target: { value: 'turing' } });
    expect(screen.getByText('Alan Turing')).toBeInTheDocument();
    expect(screen.queryByText('Ada Lovelace')).toBeNull();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search people' }), { target: { value: 'zzz' } });
    expect(screen.getByText(/No one matches/)).toBeInTheDocument();
  });

  it('Table is a real table whose tabs filter it by status', () => {
    open('Table');
    const table = screen.getByRole('table', { name: 'Orders' });
    expect(within(table).getAllByRole('row')).toHaveLength(7);
    fireEvent.click(screen.getByRole('tab', { name: 'Pending' }));
    expect(within(table).getAllByRole('row')).toHaveLength(3);
  });

  it('Settings has tabs, switches that toggle, and a confirmed delete', () => {
    open('Settings');
    fireEvent.click(screen.getByRole('tab', { name: 'Notifications' }));
    const product = screen.getByRole('checkbox', { name: 'Product news' });
    expect(product).not.toBeChecked();
    fireEvent.click(product);
    expect(product).toBeChecked();
    fireEvent.click(screen.getByRole('tab', { name: 'Danger zone' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete account' }));
    expect(screen.getByRole('alertdialog', { name: 'Delete your account?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('status')).toHaveTextContent('Deleted');
  });
});

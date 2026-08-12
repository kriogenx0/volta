import Toast from '../../components/Toast/Toast';

describe('Toast', () => {
  it('exposes a render function', () => {
    expect(typeof Toast.render).toBe('function');
  });

  it('creates a toaster container in the document on render', () => {
    Toast.render('Hello');
    expect(document.querySelector('.toaster-message')).toBeInTheDocument();
  });
});

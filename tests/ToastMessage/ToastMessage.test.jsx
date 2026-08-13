import { screen, waitFor } from '@testing-library/react';

import ToastMessage from '../../components/ToastMessage/ToastMessage';

describe('ToastMessage', () => {
  it('shows a message for each variant', async () => {
    ToastMessage.success('Saved');
    expect(await screen.findByText('Saved')).toBeInTheDocument();
  });

  it('removes the message on dismiss', async () => {
    const id = ToastMessage.info('Heads up');
    await screen.findByText('Heads up');

    ToastMessage.dismiss(id);

    await waitFor(() => {
      expect(screen.queryByText('Heads up')).not.toBeInTheDocument();
    });
  });
});

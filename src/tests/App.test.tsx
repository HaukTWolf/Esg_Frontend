import { render, screen } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: () => Promise.resolve([]),
    } as unknown as Response)
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the simplified learning flow headline', async () => {
  render(<App />);
  expect(await screen.findByText(/Vokabeln einfach lernen/i)).toBeInTheDocument();
  expect(screen.getByText(/Neues Wort eingeben/i)).toBeInTheDocument();
});

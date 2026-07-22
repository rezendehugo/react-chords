import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const React = require('react');
const { render, screen, within } = require('@testing-library/react');
const { HashRouter } = require('react-router-dom');
const App = require('./App').default;

function renderWithHashRoute (route) {
  window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}#${route}`);

  return render(
    <HashRouter>
      <App />
    </HashRouter>
  );
}

describe('Tester shell', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
  });

  test('renders the global top bar with compact instrument navigation', () => {
    renderWithHashRoute('/guitar');

    const topBar = screen.getByRole('banner');
    const instrumentNav = within(topBar).getByLabelText('Instruments');

    expect(screen.getByRole('heading', { name: 'Chords Database', level: 1 })).toBeInTheDocument();
    expect(within(instrumentNav).getByRole('link', { name: 'Guitar' })).toHaveAttribute('aria-current', 'page');
    expect(within(instrumentNav).getByRole('link', { name: 'Ukulele' })).toBeInTheDocument();
    expect(within(instrumentNav).getByRole('link', { name: 'Piano' })).toBeInTheDocument();
    expect(within(topBar).getByRole('textbox', { name: 'Search chord' })).toBeInTheDocument();
  });

  test('uses the instrument heading as the primary page label', () => {
    renderWithHashRoute('/ukulele');

    expect(screen.getByRole('heading', { name: 'Ukulele', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Browse ukulele key and suffix family.')).toBeInTheDocument();
  });

  test('renders the shared key rail with route-driven active state', () => {
    renderWithHashRoute('/piano/Csharp');

    const keyFilter = screen.getByLabelText('Piano keys');

    expect(within(keyFilter).getByRole('link', { name: 'C#' })).toHaveAttribute('aria-current', 'page');
    expect(within(keyFilter).getByRole('link', { name: 'All' })).not.toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Focused on key C# with suffix filters.')).toBeInTheDocument();
  });

  test('renders suffix navigation only on selected-key routes', () => {
    renderWithHashRoute('/guitar/C');

    const suffixPanel = screen.getByText('Suffix').closest('aside');

    expect(suffixPanel).not.toBeNull();
    expect(within(suffixPanel).getByRole('link', { name: 'All' })).toBeInTheDocument();
  });

  test('does not render the suffix sidebar on all-keys routes', () => {
    renderWithHashRoute('/guitar');

    expect(screen.queryByText('Suffix')).not.toBeInTheDocument();
  });
});

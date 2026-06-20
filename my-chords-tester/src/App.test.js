import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const React = require('react');
const { fireEvent, render, screen, waitFor } = require('@testing-library/react');
const App = require('./App').default;
const { BrowserRouter } = require('react-router-dom');
const cavaquinhoChords = require('@tombatossals/chords-db/lib/cavaquinho.json');

describe('Cavaquinho Instrument Support', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders all instruments including cavaquinho', () => {
    window.history.pushState({}, '', '/cavaquinho/C');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('link', { name: 'Guitar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ukulele' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Piano' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cavaquinho' })).toBeInTheDocument();
  });

  test('cavaquinho is navigable', () => {
    window.history.pushState({}, '', '/cavaquinho/C');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const cavaquinhoLink = screen.getByRole('link', { name: 'Cavaquinho' });
    expect(cavaquinhoLink).toBeInTheDocument();
    expect(cavaquinhoLink.closest('a')).toHaveAttribute('href', '/cavaquinho');
  });

  test('renders every C major cavaquinho position on the C key page', () => {
    window.history.pushState({}, '', '/cavaquinho/C');

    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const cMajor = cavaquinhoChords.chords.C.find(chord => chord.suffix === 'major');
    const renderedPositions = container.querySelectorAll('a[href="/cavaquinho/C/major"] svg[viewBox^="0 0 80"]');

    expect(cMajor.positions).toHaveLength(7);
    expect(renderedPositions).toHaveLength(cMajor.positions.length);
  });

  test('uses expanded cavaquinho chord data for C suffixes', () => {
    const expectedCounts = {
      minor: 3,
      m7: 11,
      m7b5: 8,
      dim: 12,
      dim7: 12,
      maj7: 11
    };

    Object.entries(expectedCounts).forEach(([suffix, count]) => {
      const chord = cavaquinhoChords.chords.C.find(chord => chord.suffix === suffix);

      expect(chord).toBeDefined();
      expect(chord.positions).toHaveLength(count);
    });
  });

  test('uses four independent fingers for D minor position 2', () => {
    const dMinor = cavaquinhoChords.chords.D.find(chord => chord.suffix === 'minor');
    const position = dMinor.positions[1];

    expect(position.frets).toEqual([3, 2, 3, 3]);
    expect(position.fingers).toEqual([2, 1, 3, 4]);
    expect(position.barres).toEqual([]);
    expect(position.capo).toBeUndefined();
  });

  test('renders cavaquinho diagrams with six visible frets', () => {
    window.history.pushState({}, '', '/cavaquinho/C');

    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const cMajorFirstDiagram = container.querySelector('a[href="/cavaquinho/C/major"] svg[viewBox="0 0 80 94"]');
    const neckPath = cMajorFirstDiagram.querySelector('path[d*="M 10 72 H 40"]');

    expect(neckPath).toBeInTheDocument();
    expect(neckPath.getAttribute('d')).toContain('V 72');
  });

  test('renders the cavaquinho progression optimizer route', () => {
    window.history.pushState({}, '', '/cavaquinho/progression');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Progression Optimizer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add chord' })).toBeInTheDocument();
    expect(screen.getByText('Total movement score:')).toBeInTheDocument();
  });

  test('updates the optimized progression from dropdown selections', () => {
    window.history.pushState({}, '', '/cavaquinho/progression');
    window.localStorage.clear();

    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Chord 1 key'), { target: { value: 'F' } });
    fireEvent.change(screen.getByLabelText('Chord 1 suffix'), { target: { value: 'maj7' } });

    expect(screen.getAllByText('Fmaj7').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.chords-grid svg[viewBox^="0 0 80"]')).toHaveLength(4);
  });

  test('shows supported suffix choices in the progression builder', () => {
    window.history.pushState({}, '', '/cavaquinho/progression');
    window.localStorage.clear();

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Chord 1 suffix'), { target: { value: '9' } });

    expect(screen.getAllByText('C9').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('option', { name: '9' }).length).toBeGreaterThan(0);
  });

  test('cycles and releases a manual shape for one progression chord', async () => {
    window.history.pushState({}, '', '/cavaquinho/progression');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const automaticShape = screen.getByText(/^Auto · Position \d+ of 7$/);
    const automaticPosition = Number(automaticShape.textContent.match(/Position (\d+)/)[1]);
    const expectedPosition = automaticPosition === 7 ? 1 : automaticPosition + 1;

    fireEvent.click(screen.getByRole('button', { name: 'Next shape for chord 1' }));

    expect(screen.getByText(`Manual · Position ${expectedPosition} of 7`)).toBeInTheDocument();

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem('cavaquinhoProgression'));
      expect(saved[0].positionIndex).toBe(expectedPosition - 1);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Use automatic shape for chord 1' }));

    expect(screen.getByText(/^Auto · Position \d+ of 7$/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use automatic shape for chord 1' })).toBeDisabled();
  });

  test('clears only the changed chord manual shape', async () => {
    window.history.pushState({}, '', '/cavaquinho/progression');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next shape for chord 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next shape for chord 2' }));
    fireEvent.change(screen.getByLabelText('Chord 1 key'), { target: { value: 'F' } });

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem('cavaquinhoProgression'));
      expect(saved[0].positionIndex).toBeNull();
      expect(Number.isInteger(saved[1].positionIndex)).toBe(true);
    });

    expect(screen.getByRole('button', { name: 'Use automatic shape for chord 1' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Use automatic shape for chord 2' })).not.toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Next shape for chord 1' }));
    fireEvent.change(screen.getByLabelText('Chord 1 suffix'), { target: { value: 'maj7' } });

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem('cavaquinhoProgression'));
      expect(saved[0].positionIndex).toBeNull();
      expect(Number.isInteger(saved[1].positionIndex)).toBe(true);
    });
  });

  test('restores a saved manual shape after remounting', async () => {
    window.history.pushState({}, '', '/cavaquinho/progression');

    const firstRender = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous shape for chord 1' }));

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem('cavaquinhoProgression'));
      expect(saved[0].positionIndex).toBe(6);
    });

    const savedPosition = JSON.parse(window.localStorage.getItem('cavaquinhoProgression'))[0].positionIndex;
    firstRender.unmount();

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(`Manual · Position ${savedPosition + 1} of 7`)).toBeInTheDocument();
  });

  test('falls back to automatic selection for an outdated saved shape', () => {
    window.history.pushState({}, '', '/cavaquinho/progression');
    window.localStorage.setItem('cavaquinhoProgression', JSON.stringify([
      { key: 'C', suffix: 'major', positionIndex: 99 },
      null
    ]));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/^Auto · Position \d+ of 7$/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use automatic shape for chord 1' })).toBeDisabled();
  });
});

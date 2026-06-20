import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import ChordBlock from '@tombatossals/react-chords/lib/Chord/ChordBlock'
import guitarChords from '@tombatossals/chords-db/lib/guitar.json';
import ukuleleChords from '@tombatossals/chords-db/lib/ukulele.json';
import pianoChords from '@tombatossals/chords-db/lib/piano.json';
import cavaquinhoChords from '@tombatossals/chords-db/lib/cavaquinho.json';
import { addMidiToPosition } from '@tombatossals/react-chords/lib/Chord/midiUtils';
import { optimizeProgression } from './progressionOptimizer';
import './App.css';

const instruments = {
    guitar: {
        name: 'Guitar',
        chords: guitarChords,
        config: {
            strings: 6,
            fretsOnChord: 4,
            name: 'Guitar',
            keys: [],
            tunings: {
                standard: ['E', 'A', 'D', 'G', 'B', 'E']
            }
        }
    },
    ukulele: {
        name: 'Ukulele',
        chords: ukuleleChords,
        config: {
            strings: 4,
            fretsOnChord: 4,
            name: 'Ukulele',
            keys: [],
            tunings: {
                standard: ['G', 'C', 'E', 'A']
            }
        }
    },
    piano: {
        name: 'Piano',
        chords: pianoChords,
        config: {
            strings: 0,
            fretsOnChord: 24,
            name: 'Piano',
            keys: [],
            tunings: {
                standard: []
            }
        }
    },
    cavaquinho: {
        name: 'Cavaquinho',
        chords: cavaquinhoChords,
        config: {
            strings: 4,
            fretsOnChord: 6,
            name: 'Cavaquinho',
            keys: [],
            tunings: {
                standard: ['D', 'G', 'B', 'D']
            }
        }
    }
};

/**
 * Formats the chord name for display.
 * Replaces 'sharp' with '#' and handles suffix display.
 * @param {string} key - The chord key (e.g., 'Csharp').
 * @param {string} suffix - The chord suffix (e.g., 'major', 'm').
 * @returns {string} The formatted chord name.
 */
const formatSuffix = (suffix) => {
    if (suffix === 'm7b5') {
        return 'm7(5b)';
    }

    return suffix.replace(/sharp/g, '#').replace(/flat/g, 'b');
};

const formatChordName = (key, suffix) => {
    const formattedKey = key.replace('sharp', '#').replace('flat', 'b');
    
    // Don't display 'major' for major chords, just the key.
    if (suffix === 'major') {
        return formattedKey;
    }

    return `${formattedKey}${formatSuffix(suffix)}`;
};

const defaultProgression = [
    { key: 'C', suffix: 'major', positionIndex: null },
    { key: 'A', suffix: 'm7', positionIndex: null },
    { key: 'D', suffix: 'm7', positionIndex: null },
    { key: 'G', suffix: '7', positionIndex: null }
];

const getCavaquinhoSuffixes = (key) =>
    (cavaquinhoChords.chords[key] || []).map(chord => chord.suffix);

const createProgressionStep = () => ({ key: 'C', suffix: 'major', positionIndex: null });

const normalizeProgressionStep = (step) => {
    const chord = (cavaquinhoChords.chords[step.key] || [])
        .find(candidate => candidate.suffix === step.suffix);
    const positionIndex = Number.isInteger(step.positionIndex) &&
        chord &&
        step.positionIndex >= 0 &&
        step.positionIndex < chord.positions.length
        ? step.positionIndex
        : null;

    return { key: step.key, suffix: step.suffix, positionIndex };
};

const loadSavedProgression = () => {
    try {
        const saved = window.localStorage.getItem('cavaquinhoProgression');
        if (!saved) {
            return defaultProgression;
        }

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return defaultProgression;
        }

        const validSteps = parsed.filter(step => step && step.key && step.suffix);

        return validSteps.length > 0
            ? validSteps.map(normalizeProgressionStep)
            : defaultProgression;
    } catch (error) {
        return defaultProgression;
    }
};

function ProgressionOptimizerPage() {
    const keys = Object.keys(cavaquinhoChords.chords);
    const [progression, setProgression] = useState(loadSavedProgression);
    const result = React.useMemo(
        () => optimizeProgression(progression, cavaquinhoChords),
        [progression]
    );

    useEffect(() => {
        window.localStorage.setItem('cavaquinhoProgression', JSON.stringify(progression));
    }, [progression]);

    const updateStep = (index, field, value) => {
        setProgression(current => current.map((step, stepIndex) => {
            if (stepIndex !== index) {
                return step;
            }

            if (field === 'key') {
                const suffixes = getCavaquinhoSuffixes(value);
                const suffix = suffixes.includes(step.suffix) ? step.suffix : suffixes[0];

                return { key: value, suffix, positionIndex: null };
            }

            if (field === 'suffix') {
                return { ...step, suffix: value, positionIndex: null };
            }

            return { ...step, [field]: value };
        }));
    };

    const selectShape = (index, positionIndex) => {
        setProgression(current => current.map((step, stepIndex) => stepIndex === index
            ? { ...step, positionIndex }
            : step));
    };

    const cycleShape = (index, currentPositionIndex, positionCount, direction) => {
        const positionIndex = (currentPositionIndex + direction + positionCount) % positionCount;
        selectShape(index, positionIndex);
    };

    const removeStep = (index) => {
        setProgression(current => current.length === 1
            ? current
            : current.filter((_, stepIndex) => stepIndex !== index));
    };

    return (
        <div className="text-center bg-white text-gray-800">
            <header className="bg-gray-800 text-white p-5 flex justify-between items-center">
                <h1 className="text-2xl">Chords Database</h1>
                <Link to="/cavaquinho" className="text-white underline">Back to Cavaquinho</Link>
            </header>
            <div className="p-5 max-w-7xl mx-auto text-left">
                <ul className="flex list-none py-4 px-0 m-0 border-b border-gray-200 gap-3">
                    <li>
                        <Link to="/cavaquinho" className="inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border border-transparent text-blue-500 hover:bg-gray-200">
                            Cavaquinho
                        </Link>
                    </li>
                    <li>
                        <Link to="/cavaquinho/progression" className="inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border bg-blue-500 text-white border-blue-200">
                            Progression
                        </Link>
                    </li>
                </ul>

                <h2 className="text-3xl font-medium my-4">Progression Optimizer</h2>
                <p className="mb-4 text-gray-700">
                    Choose a chord sequence and the tester will pick cavaquinho shapes with minimum finger movement.
                </p>

                <div className="grid gap-3 mb-5">
                    {progression.map((step, index) => {
                        const suffixes = getCavaquinhoSuffixes(step.key);

                        return (
                            <div key={index} className="flex flex-wrap items-center gap-3 p-3 border border-gray-200 rounded">
                                <span className="font-bold w-8">{index + 1}.</span>
                                <label>
                                    <span className="sr-only">Key</span>
                                    <select
                                        aria-label={`Chord ${index + 1} key`}
                                        value={step.key}
                                        onChange={(event) => updateStep(index, 'key', event.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    >
                                        {keys.map(key => (
                                            <option key={key} value={key}>{key}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <span className="sr-only">Suffix</span>
                                    <select
                                        aria-label={`Chord ${index + 1} suffix`}
                                        value={step.suffix}
                                        onChange={(event) => updateStep(index, 'suffix', event.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    >
                                        {suffixes.map(suffix => (
                                            <option key={suffix} value={suffix}>{formatSuffix(suffix) || 'major'}</option>
                                        ))}
                                    </select>
                                </label>
                                <strong>{formatChordName(step.key, step.suffix)}</strong>
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="border border-gray-300 rounded py-2 px-3 hover:bg-gray-100"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setProgression(current => current.concat(createProgressionStep()))}
                        className="bg-blue-500 text-white rounded py-2 px-4"
                    >
                        Add chord
                    </button>
                    <button
                        type="button"
                        onClick={() => setProgression(defaultProgression)}
                        className="border border-gray-300 rounded py-2 px-4 hover:bg-gray-100"
                    >
                        Reset
                    </button>
                </div>

                {result.missing.length > 0
                    ? (
                        <div className="p-4 border border-red-200 bg-red-50 rounded">
                            Missing data for {result.missing.map(step => formatChordName(step.key, step.suffix)).join(', ')}.
                        </div>
                      )
                    : (
                        <>
                            <div className="mb-5 p-4 border border-gray-200 rounded bg-gray-50">
                                <strong>Total movement score:</strong> {result.totalScore.toFixed(1)}
                                <span className="ml-3">
                                    {result.transitions.map((score, index) => (
                                        <span key={index} className="inline-block ml-2">
                                            {formatChordName(result.steps[index].key, result.steps[index].suffix)} → {formatChordName(result.steps[index + 1].key, result.steps[index + 1].suffix)}: {score.toFixed(1)}
                                        </span>
                                    ))}
                                </span>
                            </div>
                            <div className="chords-grid grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5 suffix-selected">
                                {result.steps.map((step, index) => {
                                    const positionCount = step.chord.positions.length;
                                    const isManual = Number.isInteger(progression[index].positionIndex);

                                    return (
                                        <div key={`${step.key}-${step.suffix}-${index}`} className="text-center">
                                            <ChordBlock
                                                instrument={instruments.cavaquinho.config}
                                                position={step.position}
                                                name={formatChordName(step.key, step.suffix)}
                                            />
                                            <div className="text-sm text-gray-600 mt-2">
                                                {isManual ? 'Manual' : 'Auto'} · Position {step.positionIndex + 1} of {positionCount}
                                                {index > 0 && ` · move ${step.movementScore.toFixed(1)}`}
                                            </div>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    aria-label={`Previous shape for chord ${index + 1}`}
                                                    title="Previous shape"
                                                    onClick={() => cycleShape(index, step.positionIndex, positionCount, -1)}
                                                    className="border border-gray-300 rounded w-9 h-9 hover:bg-gray-100"
                                                >
                                                    ‹
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={`Use automatic shape for chord ${index + 1}`}
                                                    onClick={() => selectShape(index, null)}
                                                    disabled={!isManual}
                                                    className="border border-gray-300 rounded h-9 px-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Auto
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={`Next shape for chord ${index + 1}`}
                                                    title="Next shape"
                                                    onClick={() => cycleShape(index, step.positionIndex, positionCount, 1)}
                                                    className="border border-gray-300 rounded w-9 h-9 hover:bg-gray-100"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                      )}
            </div>
        </div>
    );
}

function ChordBrowser() {
    const params = useParams();

    // O estado agora é derivado da URL, com valores padrão
    const selectedInstrument = params.instrument || 'guitar';
    const selectedKey = params.key || 'All';
    const selectedSuffix = params.suffix || 'All';

    const [searchTerm, setSearchTerm] = useState('');

    // Limpa a busca ao trocar de página
    useEffect(() => {
        setSearchTerm('');
    }, [selectedInstrument, selectedKey, selectedSuffix]);

    const currentInstrumentData = instruments[selectedInstrument];
    const chords = currentInstrumentData.chords;
    const instrument = currentInstrumentData.config;
    const allKeys = Object.keys(chords.chords);

    const availableSuffixes = React.useMemo(() => {
        if (selectedKey === 'All' || !chords.chords[selectedKey]) {
            return [];
        }
        const suffixes = chords.chords[selectedKey].map(chord => chord.suffix);
        return [...new Set(suffixes)];
    }, [chords, selectedKey]);

    const keysToRender = selectedKey === 'All'
      ? allKeys
      : allKeys.filter(key => key === selectedKey);

  return (
      <div className="text-center bg-white text-gray-800">
          <header className="bg-gray-800 text-white p-5 flex justify-between items-center">
              <h1 className="text-2xl">Chords Database</h1>
              <input
                  type="text"
                  placeholder="Search chord..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 rounded text-gray-800 text-base w-1/3"
              />
          </header>
          <div className="p-5 max-w-7xl mx-auto text-left">
                <ul className="flex list-none py-4 px-0 m-0 border-b border-gray-200 gap-3">
                    {Object.keys(instruments).map(instrumentName => (
                        <li key={instrumentName} >
                            <Link
                                to={`/${instrumentName}`}
                                className={`inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border ${selectedInstrument === instrumentName ? 'bg-blue-500 text-white border-blue-200' : 'border-transparent text-blue-500 hover:bg-gray-200'}`}
                            >
                                {instruments[instrumentName].name}
                            </Link>
                        </li>
                    ))}
                    {selectedInstrument === 'cavaquinho' && (
                        <li>
                            <Link
                                to="/cavaquinho/progression"
                                className="inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border border-transparent text-blue-500 hover:bg-gray-200"
                            >
                                Progression
                            </Link>
                        </li>
                    )}
                </ul>
                <main className={`lg:flex lg:gap-5 ${selectedKey !== 'All' ? 'has-sidebar' : ''}`}>
                    {selectedKey !== 'All' && (
                        <aside className="lg:flex-shrink-0 lg:w-52 py-4">
                            <ul className="list-none p-0 m-0">
                                <li className="p-1 text-xl font-bold">Suffixes:</li>
                                <li>
                                    <Link
                                        to={`/${selectedInstrument}/${selectedKey}`}
                                        className={`block w-full text-left rounded py-1 px-3 cursor-pointer ${selectedSuffix === 'All' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        All
                                    </Link>
                                </li>
                                {availableSuffixes.map(suffix => (
                                    <li key={suffix}>
                                        <Link
                                            to={`/${selectedInstrument}/${selectedKey}/${suffix}`}
                                            className={`block w-full text-left rounded py-1 px-3 cursor-pointer ${selectedSuffix === suffix ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                        >
                                            {formatChordName(selectedKey, suffix)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    )}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-medium my-4">{instrument.name}</h2>
                        <ul className="flex flex-wrap list-none p-0 pb-5 m-0 items-center gap-3">
                            <li className="font-bold">Keys:</li>
                            <li >
                                <Link
                                    to={`/${selectedInstrument}`}
                                    className={`inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border ${selectedKey === 'All' ? 'bg-blue-500 text-white border-blue-200' : 'border-transparent text-blue-500 hover:bg-gray-200'}`}
                                >
                                    All
                                </Link>
                            </li>
                            {allKeys.map(key => (
                                <li key={key}>
                                    <Link
                                        to={`/${selectedInstrument}/${key}`}
                                        className={`inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border ${selectedKey === key ? 'bg-blue-500 text-white border-blue-200' : 'border-transparent text-blue-500 hover:bg-gray-200'}`}
                                    >
                                        {key.replace('sharp', '#')}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {keysToRender.map(key => {
                            const chordsForKey = (chords.chords[key] || []).filter(chord => {
                                const chordName = formatChordName(chord.key, chord.suffix);
                                const suffixFilter = selectedSuffix === 'All' || chord.suffix === selectedSuffix;
                                return suffixFilter && chordName.toLowerCase().includes(searchTerm.toLowerCase());
                            });

                            if (chordsForKey.length === 0) {
                                return null; // Não renderiza a seção se estiver vazia após o filtro
                            }

                            return (
                                <div key={key} className="mb-10">
                                    {selectedKey === 'All' && <h3 className="border-b border-gray-200 pb-2 mb-5">{key.replace('sharp', '#')}</h3>}
                                    <div className={`chords-grid grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-5 ${selectedKey === 'All' ? 'all-selected' : ''} ${selectedSuffix !== 'All' ? 'suffix-selected' : ''}`}>
                                        {selectedInstrument === 'piano'
                                            ? chordsForKey.map(chord => (
                                                <Link to={`/${selectedInstrument}/${chord.key}/${chord.suffix}`} key={`${chord.key}-${chord.suffix}`} className="no-underline">
                                                    <ChordBlock
                                                        instrument={instrument}
                                                        position={chord.positions[0]}
                                                        name={formatChordName(chord.key, chord.suffix)}
                                                        isPiano={true}
                                                    />
                                                </Link>
                                              ))
                                            : chordsForKey.map((chord, chordIndex) => {
                                                  const positionsToRender = selectedKey !== 'All' ? chord.positions : chord.positions.slice(0, 1);
                                                  return positionsToRender.map((position, posIndex) => (
                                                    <Link to={`/${selectedInstrument}/${chord.key}/${chord.suffix}`} key={`${chordIndex}-${posIndex}`} className="no-underline">
                                                        <ChordBlock
                                                            instrument={instrument}
                                                            position={addMidiToPosition(position, selectedInstrument)}
                                                            name={formatChordName(chord.key, chord.suffix)}
                                                        />
                                                    </Link>
                                                  ));
                                              })
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
          </div>
      </div>
  );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<ChordBrowser />} />
            <Route path="/cavaquinho/progression" element={<ProgressionOptimizerPage />} />
            <Route path="/:instrument" element={<ChordBrowser />} />
            <Route path="/:instrument/:key" element={<ChordBrowser />} />
            <Route path="/:instrument/:key/:suffix" element={<ChordBrowser />} />
        </Routes>
    );
}

export default App;

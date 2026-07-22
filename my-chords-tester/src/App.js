import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import ChordBlock from '@tombatossals/react-chords/lib/Chord/ChordBlock';
import guitarChords from '@tombatossals/chords-db/lib/guitar.json';
import ukuleleChords from '@tombatossals/chords-db/lib/ukulele.json';
import pianoChords from '@tombatossals/chords-db/lib/piano.json';
import { addMidiToPosition } from '@tombatossals/react-chords/lib/Chord/midiUtils';
import { PrimaryInstrumentNav } from './navigation';
import { AppTopBar, InstrumentControls, KeyFilterBar } from './testerShell';
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
  }
};

function formatChordName (key, suffix) {
  const formattedKey = key.replace('sharp', '#').replace('flat', 'b');

  if (suffix === 'major') {
    return formattedKey;
  }

  return `${formattedKey}${suffix.replace(/sharp/g, '#').replace(/flat/g, 'b')}`;
}

function PageFrame ({ children, searchTerm, onSearchChange, selectedInstrument }) {
  return (
    <div className="app-shell">
      <AppTopBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        navigation={(
          <PrimaryInstrumentNav
            instruments={instruments}
            selectedInstrument={selectedInstrument}
          />
        )}
      />
      <div className="app-shell__content">
        {children}
      </div>
    </div>
  );
}

function ChordBrowser () {
  const params = useParams();
  const selectedInstrument = params.instrument || 'guitar';
  const selectedKey = params.key || 'All';
  const selectedSuffix = params.suffix || 'All';
  const [searchTerm, setSearchTerm] = useState('');

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

  const summary = selectedKey === 'All'
    ? `Browse ${instrument.name.toLowerCase()} key and suffix family.`
    : `Focused on key ${selectedKey.replace('sharp', '#')} with suffix filters.`;

  return (
    <PageFrame
      selectedInstrument={selectedInstrument}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <main className="browser-layout">
        <InstrumentControls
          title={instrument.name}
          summary={summary}
          keyFilter={(
            <KeyFilterBar
              instrumentName={instrument.name}
              selectedInstrument={selectedInstrument}
              selectedKey={selectedKey}
              keys={allKeys}
            />
          )}
        />

        <section className="browser-main">
          {selectedKey !== 'All' && (
            <aside className="content-surface content-surface--compact">
              <p className="content-surface__eyebrow">Suffix</p>
              <ul className="suffix-sidebar__list">
                <li>
                  <Link
                    to={`/${selectedInstrument}/${selectedKey}`}
                    className={`suffix-sidebar__link ${selectedSuffix === 'All' ? 'is-active' : ''}`}
                  >
                    All
                  </Link>
                </li>
                {availableSuffixes.map(suffix => (
                  <li key={suffix}>
                    <Link
                      to={`/${selectedInstrument}/${selectedKey}/${suffix}`}
                      className={`suffix-sidebar__link ${selectedSuffix === suffix ? 'is-active' : ''}`}
                    >
                      {formatChordName(selectedKey, suffix)}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="browser-results">
            {keysToRender.map(key => {
              const chordsForKey = (chords.chords[key] || []).filter(chord => {
                const chordName = formatChordName(chord.key, chord.suffix);
                const suffixFilter = selectedSuffix === 'All' || chord.suffix === selectedSuffix;
                return suffixFilter && chordName.toLowerCase().includes(searchTerm.toLowerCase());
              });

              if (chordsForKey.length === 0) {
                return null;
              }

              return (
                <div key={key} className="content-surface content-surface--results">
                  {selectedKey === 'All' && <h3 className="results-section__title">{key.replace('sharp', '#')}</h3>}
                  <div className={`chords-grid grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 ${selectedKey === 'All' ? 'all-selected' : ''} ${selectedSuffix !== 'All' ? 'suffix-selected' : ''}`}>
                    {selectedInstrument === 'piano'
                      ? chordsForKey.map(chord => (
                          <Link to={`/${selectedInstrument}/${chord.key}/${chord.suffix}`} key={`${chord.key}-${chord.suffix}`} className="no-underline block">
                            <ChordBlock
                              instrument={instrument}
                              position={chord.positions[0]}
                              name={formatChordName(chord.key, chord.suffix)}
                              isPiano={true}
                            />
                          </Link>
                        ))
                      : chordsForKey.map((chord, chordIndex) => {
                          const positionsToRender = selectedSuffix !== 'All' ? chord.positions : chord.positions.slice(0, 1);

                          return positionsToRender.map((position, posIndex) => (
                            <Link to={`/${selectedInstrument}/${chord.key}/${chord.suffix}`} key={`${chordIndex}-${posIndex}`} className="no-underline block">
                              <ChordBlock
                                instrument={instrument}
                                position={addMidiToPosition(position, selectedInstrument)}
                                name={formatChordName(chord.key, chord.suffix)}
                              />
                            </Link>
                          ));
                        })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </PageFrame>
  );
}

function App () {
  return (
    <Routes>
      <Route path="/" element={<ChordBrowser />} />
      <Route path="/:instrument" element={<ChordBrowser />} />
      <Route path="/:instrument/:key" element={<ChordBrowser />} />
      <Route path="/:instrument/:key/:suffix" element={<ChordBrowser />} />
    </Routes>
  );
}

export default App;

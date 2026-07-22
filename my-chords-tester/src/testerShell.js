import React from 'react';
import { Link } from 'react-router-dom';

export function AppTopBar ({ searchTerm, onSearchChange, navigation }) {
  return (
    <header className="app-topbar">
      <div className="app-topbar__inner">
        <div className="app-topbar__copy">
          <h1 className="app-topbar__title">Chords Database</h1>
          <p className="app-topbar__subtitle">Browse instruments and chord shapes</p>
        </div>
        <div className="app-topbar__actions">
          {navigation}
          <label className="app-topbar__search">
            <span className="sr-only">Search chord</span>
            <input
              type="text"
              placeholder="Search chord..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="app-topbar__search-input"
            />
          </label>
        </div>
      </div>
    </header>
  );
}

export function InstrumentControls ({ title, summary, keyFilter }) {
  return (
    <section className="instrument-controls-surface">
      <div className="instrument-controls-surface__header">
        <h2 className="instrument-controls-surface__title">{title}</h2>
        <p className="instrument-controls-surface__summary">{summary}</p>
      </div>
      {keyFilter}
    </section>
  );
}

export function KeyFilterBar ({ instrumentName, selectedInstrument, selectedKey, keys }) {
  return (
    <nav className="key-filter-bar" aria-label={`${instrumentName} keys`}>
      <span className="key-filter-bar__label">Keys</span>
      <div className="key-filter-bar__chips">
        <Link
          to={`/${selectedInstrument}`}
          aria-current={selectedKey === 'All' ? 'page' : undefined}
          className={`key-filter-chip ${selectedKey === 'All' ? 'is-active' : ''}`}
        >
          All
        </Link>
        {keys.map((key) => (
          <Link
            key={key}
            to={`/${selectedInstrument}/${key}`}
            aria-current={selectedKey === key ? 'page' : undefined}
            className={`key-filter-chip ${selectedKey === key ? 'is-active' : ''}`}
          >
            {key.replace('sharp', '#')}
          </Link>
        ))}
      </div>
    </nav>
  );
}

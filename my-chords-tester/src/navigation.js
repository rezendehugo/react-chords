import React from 'react';
import { Link } from 'react-router-dom';

export function PrimaryInstrumentNav ({ instruments, selectedInstrument }) {
  return (
    <nav aria-label="Instruments">
      <ul className="primary-instrument-nav">
        {Object.keys(instruments).map((instrumentName) => (
          <li key={instrumentName}>
            <Link
              to={`/${instrumentName}`}
              aria-current={selectedInstrument === instrumentName ? 'page' : undefined}
              className={`primary-instrument-nav__link ${selectedInstrument === instrumentName ? 'is-active' : ''}`}
            >
              {instruments[instrumentName].name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const primaryLinkClasses = (isActive) =>
  `inline-block font-bold rounded py-1 px-3 cursor-pointer no-underline border ${isActive ? 'bg-blue-500 text-white border-blue-200' : 'border-transparent text-blue-500 hover:bg-gray-200'}`;

const secondaryLinkClasses = (isActive) =>
  `inline-block font-semibold rounded py-1 px-3 cursor-pointer no-underline border ${isActive ? 'bg-gray-100 text-gray-900 border-gray-300' : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

export function PrimaryInstrumentNav ({ instruments, selectedInstrument }) {
  return (
    <ul className="flex list-none py-4 px-0 m-0 border-b border-gray-200 gap-3" aria-label="Instruments">
      {Object.keys(instruments).map((instrumentName) => (
        <li key={instrumentName}>
          <Link
            to={`/${instrumentName}`}
            aria-current={selectedInstrument === instrumentName ? 'page' : undefined}
            className={primaryLinkClasses(selectedInstrument === instrumentName)}
          >
            {instruments[instrumentName].name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CavaquinhoSecondaryNav ({ activeView }) {
  return (
    <ul className="flex list-none py-2 px-0 m-0 gap-3" aria-label="Cavaquinho sections">
      <li>
        <Link
          to="/cavaquinho"
          aria-current={activeView === 'library' ? 'page' : undefined}
          className={secondaryLinkClasses(activeView === 'library')}
        >
          Chord Library
        </Link>
      </li>
      <li>
        <Link
          to="/cavaquinho/progression"
          aria-current={activeView === 'progressions' ? 'page' : undefined}
          className={secondaryLinkClasses(activeView === 'progressions')}
        >
          Progressions
        </Link>
      </li>
    </ul>
  );
}

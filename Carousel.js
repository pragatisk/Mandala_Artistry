import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Carousel({ items }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef();

  useEffect(() => {
    if (items.length > 1) {
      timer.current = setInterval(() => {
        setIdx(prev => (prev + 1) % items.length);
      }, 4000);
    }
    return () => clearInterval(timer.current);
  }, [items]);

  const prev = () => setIdx(prev => (prev - 1 + items.length) % items.length);
  const next = () => setIdx(prev => (prev + 1) % items.length);
  if (!items.length) return null;

  return (
    <div className="relative max-w-4xl mx-auto overflow-hidden rounded-lg h-80">
      {items.map((itm, i) => (
        <div
          key={itm._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={itm.imageUrl} alt={itm.name} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h3 className="text-2xl text-white font-semibold">{itm.name}</h3>
          </div>
        </div>
      ))}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
}

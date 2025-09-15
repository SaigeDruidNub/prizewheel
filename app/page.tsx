"use client";
import React, { useRef, useState } from "react";

// Note: If the prize is "10% off purchase", it does NOT apply to Bags for Beans.

const originalPrizes = [
  "10% off purchase",
  "Free Elemental Profile Reading",
  "Free Element Sticker w/Purchase",
  "Free Spell Kit w/Spell Vessel Purchase",
  "10% off purchase",
  "Free Elemental Profile Reading",
  "Free Element Sticker w/Purchase",
  "Free Spell Kit w/Spell Vessel Purchase",
];

function shuffle(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PrizeWheel() {
  const [cycling, setCycling] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const [prizes, setPrizes] = useState<string[]>(originalPrizes);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showModal, setShowModal] = useState(true);

  // Shuffle prizes only on initial mount (client side)
  React.useEffect(() => {
    setPrizes(shuffle(originalPrizes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCycling = () => {
    if (cycling) return;
    setSelected(null);
    setCycling(true);
    intervalRef.current = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % prizes.length);
    }, 120);
  };

  const stopCycling = () => {
    if (!cycling) return;
    setCycling(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(prizes[highlightIndex]);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="prizewheel-root">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Warning: Flashing Effect</h2>
            <p>
              This page contains a simulated flashing effect. If you are prone
              to seizures or photosensitive epilepsy, please do not proceed.
            </p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              I Understand, Proceed
            </button>
          </div>
        </div>
      )}
      <div
        className="prizewheel-grid"
        style={{
          filter: showModal ? "blur(2px)" : undefined,
          pointerEvents: showModal ? "none" : undefined,
        }}
      >
        {prizes.map((prize, i) => (
          <div
            key={i}
            className={`prizewheel-square${
              highlightIndex === i ? " prizewheel-highlight" : ""
            }`}
          >
            {prize}
          </div>
        ))}
      </div>
      <div
        className="prizewheel-controls"
        style={{
          filter: showModal ? "blur(2px)" : undefined,
          pointerEvents: showModal ? "none" : undefined,
        }}
      >
        <button
          onClick={startCycling}
          disabled={cycling}
          className="prizewheel-btn"
        >
          {cycling ? "Cycling..." : "Start"}
        </button>
        <button
          onClick={stopCycling}
          disabled={!cycling}
          className="prizewheel-btn"
        >
          Stop
        </button>
      </div>
      {selected && (
        <div
          className="prizewheel-result"
          style={{
            filter: showModal ? "blur(2px)" : undefined,
            pointerEvents: showModal ? "none" : undefined,
          }}
        >
          You won: {selected}
          {selected.includes("10% off") && (
            <div style={{ fontSize: "1rem", color: "#d32f2f", marginTop: 8 }}>
              <strong>Note:</strong> 10% off does <u>not</u> apply to Bags for
              Beans.
            </div>
          )}
        </div>
      )}
      <style>{`
        body, html {
          background: #181818;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          color: #222;
          padding: 32px 24px 24px 24px;
          border-radius: 16px;
          box-shadow: 0 4px 32px #0008;
          max-width: 90vw;
          width: 400px;
          text-align: center;
        }
        .modal-content h2 {
          margin-top: 0;
          color: #d32f2f;
        }
        .modal-btn {
          margin-top: 24px;
          padding: 10px 28px;
          font-size: 1.1rem;
          border-radius: 8px;
          border: none;
          background: #1976d2;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .modal-btn:hover {
          background: #512da8;
        }
        .prizewheel-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
          background: #181818;
          min-height: 100vh;
          width: 100vw;
        }
        .prizewheel-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(80px, 1fr));
          grid-template-rows: repeat(2, minmax(80px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
          width: 100%;
          max-width: 600px;
        }
        .prizewheel-square {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 1.1rem;
          font-weight: normal;
          border: 4px solid #333;
          background: #512da8;
          color: #fff;
          border-radius: 16px;
          transition: all 0.2s;
          min-height: 80px;
          min-width: 80px;
          max-width: 140px;
          max-height: 140px;
          padding: 8px;
          box-sizing: border-box;
          word-break: break-word;
        }
        .prizewheel-square:nth-child(3n+1) {
          background: #512da8;
        }
        .prizewheel-square:nth-child(3n+2) {
          background: #1976d2;
        }
        .prizewheel-square:nth-child(3n) {
          background: #43a047;
        }
        .prizewheel-highlight {
          border-color: #2196f3;
          background: #bbdefb !important;
          color: #222 !important;
          box-shadow: 0 0 16px #2196f3;
          font-weight: bold;
        }
        .prizewheel-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 12px;
        }
        .prizewheel-btn {
          padding: 10px 24px;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          background: #1976d2;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .prizewheel-btn:disabled {
          background: #bdbdbd;
          color: #888;
          cursor: not-allowed;
        }
        .prizewheel-result {
          margin-top: 24px;
          font-size: 1.3rem;
          font-weight: bold;
          text-align: center;
        }
        @media (max-width: 600px) {
          .modal-content {
            width: 95vw;
            padding: 18px 4vw 18px 4vw;
          }
          .prizewheel-grid {
            grid-template-columns: repeat(4, minmax(60px, 1fr));
            grid-template-rows: repeat(2, minmax(60px, 1fr));
            gap: 8px;
            max-width: 100vw;
          }
          .prizewheel-square {
            min-height: 60px;
            min-width: 60px;
            max-width: 90px;
            max-height: 90px;
            font-size: 0.75rem;
            padding: 2px;
          }
          .prizewheel-controls {
            flex-direction: column;
            gap: 18px;
            align-items: stretch;
          }
          .prizewheel-btn {
            padding: 14px 0;
            font-size: 1.6rem;
            width: 90vw;
            max-width: 420px;
            min-width: 220px;
            margin-left: auto;
            margin-right: auto;
          }
          .prizewheel-result {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

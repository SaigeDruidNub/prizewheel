"use client";
import React, { useRef, useState } from "react";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 40,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 140px)",
          gridTemplateRows: "repeat(2, 140px)",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {prizes.map((prize, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 20,
              fontWeight: highlightIndex === i ? "bold" : "normal",
              border:
                highlightIndex === i ? "4px solid #2196f3" : "2px solid #333",
              background:
                highlightIndex === i
                  ? "#bbdefb"
                  : i % 3 === 0
                  ? "#512da8" // purple
                  : i % 3 === 1
                  ? "#1976d2" // blue
                  : "#43a047", // green
              color: highlightIndex === i ? "#222" : "#fff",
              boxShadow: highlightIndex === i ? "0 0 16px #2196f3" : "none",
              borderRadius: 16,
              transition: "all 0.2s",
              height: "140px",
              width: "140px",
              overflow: "hidden",
              padding: "8px",
            }}
          >
            {prize}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <button
          onClick={startCycling}
          disabled={cycling}
          style={{
            padding: "10px 30px",
            fontSize: 18,
            cursor: cycling ? "not-allowed" : "pointer",
          }}
        >
          {cycling ? "Cycling..." : "Start"}
        </button>
        <button
          onClick={stopCycling}
          disabled={!cycling}
          style={{
            padding: "10px 30px",
            fontSize: 18,
            cursor: !cycling ? "not-allowed" : "pointer",
          }}
        >
          Stop
        </button>
      </div>
      {selected && (
        <div style={{ marginTop: 30, fontSize: 24, fontWeight: "bold" }}>
          You won: {selected}
        </div>
      )}
    </div>
  );
}

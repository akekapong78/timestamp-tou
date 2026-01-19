"use client";

import { useState } from "react";
import { getRateTOU } from "./utils/tou";
import ResultTable from "./components/ResultTable";
import DownloadCSV from "./components/DownloadCSV";

type Row = {
  datetime: string;
  rate: string;
};

export default function Page() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  const handleSubmit = () => {
    const lines = input
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    const result = lines.map(dt => ({
      datetime: dt,
      rate: getRateTOU(dt),
    }));

    setRows(result);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Timestamp TOU</h1>

      <textarea
        className="w-full h-60 border p-2 font-mono"
        placeholder="Paste datetime here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit}
      >
        Process
      </button>

      {rows.length > 0 && (
        <>
          <ResultTable rows={rows} />
          <DownloadCSV rows={rows} />
        </>
      )}
    </div>
  );
}
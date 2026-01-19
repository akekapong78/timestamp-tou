"use client";

import { useState } from "react";
import { getRateTOU } from "./utils/tou";
import ResultTable from "./components/ResultTable";
import DownloadCSV from "./components/DownloadCSV";
import { CalendarDays, Eye } from "lucide-react";
import HolidayModal from "./components/HolidayModal";
import holidays from "@/app/data/holidays.json";

type Row = {
  datetime: string;
  rate: string;
};


export default function Page() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [openHoliday, setOpenHoliday] = useState(false);

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
    <>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <header className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100">
            <div className="">
              <h1 className="text-2xl font-bold text-purple-800">
                Timestamp TOU
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                วิเคราะห์ TOU (P / OP / H) จาก timestamp ทุก 15 นาที
              </p>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3">
              {/* Calendar icon */}
              <a
                href="https://www.pea.co.th/announcements/off-peak-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-purple-200 p-2
                          text-purple-700 hover:bg-purple-50 transition"
                title="PEA Off-Peak Calendar"
              >
                <CalendarDays size={20} />
              </a>

              {/* Eye icon */}
              <button
                onClick={() => setOpenHoliday(true)}
                className="rounded-xl border border-purple-200 p-2
                          text-purple-700 hover:bg-purple-50 transition"
                title="Preview Holiday List"
              >
                <Eye size={20} />
              </button>
            </div>
          </header>

          {/* Input */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100 space-y-4">
            <label className="block text-sm font-medium text-purple-700">
              Paste Datetime
            </label>

            <textarea
              className="w-full h-64 resize-none rounded-xl border border-purple-200 
                        p-3 font-mono text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder={`ตัวอย่าง:\n2025-07-09 09:15\n2025-07-09 09:30\n...`}
              value={input}
              onChange={e => setInput(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-purple-700 px-6 py-2.5
                          text-sm font-semibold text-white
                          hover:bg-purple-800
                          transition"
              >
                Process
              </button>
            </div>
          </section>

          {/* Result */}
          {rows.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-purple-800">
                  Result ({rows.length.toLocaleString()} records)
                </h2>
                <DownloadCSV rows={rows} />
              </div>

              <ResultTable rows={rows} />
            </section>
          )}
        </div>
      </main>
      <HolidayModal
        open={openHoliday}
        onClose={() => setOpenHoliday(false)}
        holidays={holidays}
      />
    </>
  );
}
"use client";

import { useState } from "react";
import { getRateTOU, parseDatetimeToISO } from "@/app/utils/tou";
import ResultTable from "./ResultTable";
import DownloadCSV from "./ExportDataButton";
import { detectDefaultFormat } from "@/app/utils/helper";
import { Row } from "../interface/data";
import { AlertMessage } from "../interface/modal";
import { CalendarDays, Eye } from "lucide-react";
import HolidayModal from "./HolidayModal";
import { AlertModal } from "./AlertModal";
import { FORMAT_OPTIONS } from "../constanst/datetime";
import holidays from "@/app/data/holidays.json";
import Summary from "./Summary";
import LoadingOverlay from "./LoadingOverlay";

export default function TouRateCalculator() {
  const [input, setInput] = useState(
`2025-07-07 08:00\t0.021000
2025-07-07 08:15\t0.019500
2025-07-07 08:30\t0.022000
2025-07-07 08:45\t0.025000
2025-07-07 09:00\t0.023500
2025-07-07 09:15\t0.035000
2025-07-07 09:30\t0.042000
2025-07-07 09:45\t0.048000
2025-07-07 10:00\t0.058000
2025-07-07 10:15\t0.061000
2025-07-07 10:30\t0.055000
2025-07-07 10:45\t0.052000
2025-07-12 09:00\t0.018000
2025-07-12 09:15\t0.021000
2025-07-12 09:30\t0.019500
2025-07-12 09:45\t0.022000
2025-07-12 10:00\t0.020000`
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [openHoliday, setOpenHoliday] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [dateFormat, setDateFormat] = useState(() => detectDefaultFormat());

  const [alert, setAlert] = useState<AlertMessage>({
    type: "success",
    title: "",
    message: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [multiplier, setMultiplier] = useState<number>(1);

  const scaledRows = rows.map(r => ({
    ...r,
    value: r.value != null ? r.value * multiplier : r.value,
  }));

  const handleReset = () => {
    setRows([]);
    setInput("");
  }

  const handleProcess = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await new Promise(requestAnimationFrame);

    if (!input) {
      setAlert({
        type: "warning",
        title: "Warning",
        message: "Please input datetime",
      });
      setOpenAlert(true);
      setIsProcessing(false);
      return;
    }

    const parsed = input
      .split(/\r?\n/)
      .map(line => {
        const parts = line
          .replace(/\u00A0/g, " ")
          .replace(/\t/g, " ")
          .trim()
          .split(/\s+/);

        if (parts.length < 2) return null; // date and time or + value

        parts[1] = parts[1].replace(".", ":"); // for : dayjs can parse "23/04/2025 08.00" but not "23/04/2025 08:00"
        const datetime = parts[0] + " " + parts[1];
        const value = parts[2] ? Number(parts[2]): null;

        return { datetime, value };
      })
      .filter(Boolean);

    if (parsed.length === 0) {
      setAlert({
        type: "warning",
        title: "Warning",
        message: "No valid data found. Please check your input format.",
      });
      setOpenAlert(true);
      setIsProcessing(false);
      return;
    }

    const result: Row[] = parsed.map((r) => {
      const canonicalDatetime = parseDatetimeToISO(r!.datetime, dateFormat);

      return {
        datetime: canonicalDatetime ?? r!.datetime,
        value: r!.value,
        rate: canonicalDatetime
          ? getRateTOU(canonicalDatetime, "YYYY-MM-DD HH:mm")
          : "error",
      };
    });

    setRows(result);

    if (result.some(r => r.rate == "error")) {
      setAlert({
        type: "error",
        title: "Invalid input",
        message: "Please check your datetime",
      });
      setOpenAlert(true);
      setIsProcessing(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    setAlert({
      type: "success",
      title: "Success",
      message: "Result is ready",
    });
    setOpenAlert(true);
    setIsProcessing(false);
  };

  return (
    <>
      <section className="w-full">
        <div className="mx-auto space-y-6">
          {/* Header */}
          <header className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100">
              <div className="flex items-center gap-3">
                {/* Top title */}
                <h1 className="text-2xl font-bold text-purple-800">
                  1️⃣ Stamp Rate TOU
                </h1>
                
                {/* Calendar icon */}
                <a
                  href="https://www.pea.co.th/announcements/off-peak-calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-purple-200 p-2
                            text-purple-700 hover:bg-purple-50 transition"
                  title="PEA Off-Peak Calendar"
                  aria-label="PEA Off-Peak Calendar"
                >
                  <CalendarDays size={20} />
                </a>

                {/* Eye icon */}
                <button
                  onClick={() => setOpenHoliday(true)}
                  className="rounded-xl border border-purple-200 p-2 cursor-pointer
                            text-purple-700 hover:bg-purple-50 transition"
                  title="Preview Holiday List"
                  aria-label="Preview Holiday List"
                >
                  <Eye size={20} />
                </button>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                วิเคราะห์ Rate TOU (P / OP / H) จากข้อมูล Datetime ทุก ๆ 15 นาที ที่โหลดโปรไฟล์มา
              </p>
          </header>

          {/* Input */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100 space-y-4">
            <div className="flex gap-3 justify-between">
              {/* format dropdown */}
              <label className="block text-sm font-medium text-purple-700">
                <b>Input Datetime</b>  
                <div className="text-gray-500">copy เฉพาะคอลัมน์ Datetime จาก Excel ที่โหลดโปรไฟล์มา</div>
              </label>

              <div className="flex align-center items-center gap-2">
                <label className="text-sm font-medium text-purple-700 mb-1">
                  Choose Date Format
                </label>

                <select
                  value={dateFormat}
                  onChange={e => setDateFormat(e.target.value)}
                  className="rounded-xl border border-purple-200
                            bg-white p-2 text-sm text-gray-500
                            focus:ring-2 focus:ring-purple-400"
                >
                  {FORMAT_OPTIONS.map(f => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              className="w-full h-64 resize-none rounded-xl border border-purple-200 
                        p-3 font-mono text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder=""
              value={input}
              onChange={e => setInput(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="rounded-xl bg-gray-700 px-6 py-2.5
                          text-sm font-semibold text-white
                          hover:bg-purple-400 cursor-pointer
                          transition mr-2"
                title="Reset"
                aria-label="Reset Data"
              >
                Reset
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition ${isProcessing ? "bg-purple-500 cursor-not-allowed opacity-80" : "bg-purple-700 hover:bg-purple-800 cursor-pointer"}`}
                title={isProcessing ? "Processing..." : "Process"}
                aria-label="Process"
              >
                {isProcessing ? "Processing..." : "Process"}
              </button>
            </div>

          </section>

          {/* Summary */}
          {rows.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100 space-y-4">

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-purple-800">
                  Summary
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <label className="font-medium text-purple-700">ตัวคูณ (Multiplier)</label>
                  <input
                    type="number"
                    step="any"
                    value={multiplier}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      setMultiplier(isNaN(v) ? 1 : v);
                    }}
                    className="w-28 rounded-xl border border-purple-200 p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <Summary rows={scaledRows} />

            </section>
          )}

          {/* Result Table */}
          {rows.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow-sm border border-purple-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-purple-800">
                  Result ({rows.length.toLocaleString()} records)
                </h2>
                <DownloadCSV rows={scaledRows} />
              </div>

              <ResultTable rows={scaledRows} />
            </section>
          )}
        </div>
      </section>

      <HolidayModal
        open={openHoliday}
        onClose={() => setOpenHoliday(false)}
        holidays={holidays}
      />
      <AlertModal
        open={openAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => console.log("confirmed")}
        onClose={() => setOpenAlert(false)}
      />

      <LoadingOverlay open={isProcessing} label="Processing data..." />
    </>
  );
}
import { Row } from "../interface/data";

export default function DownloadCSV({ rows }: { rows: Row[] }) {
  const download = () => {
    const headers = "Datetime,kW,Rate\n"; // เพิ่ม Header ให้ไฟล์
    const content = rows.map(r => {
      const val = r.value ?? ""; 
      return `"${r.datetime}",${val},"${r.rate}"`;
    }).join("\n");

    const blob = new Blob([headers + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "timestamp_tou.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="rounded-xl border border-purple-600
                 px-4 py-2 text-sm font-semibold
                 text-purple-700 cursor-pointer
                 hover:bg-purple-50 transition"
    >
      Download CSV
    </button>
  );
}
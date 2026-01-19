type Row = {
  datetime: string;
  rate: string;
};

export default function DownloadCSV({ rows }: { rows: Row[] }) {
  const download = () => {
    const csv =
      "datetime,rate\n" +
      rows.map(r => `"${r.datetime}",${r.rate}`).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
                 text-purple-700
                 hover:bg-purple-50 transition"
    >
      Download CSV
    </button>
  );
}
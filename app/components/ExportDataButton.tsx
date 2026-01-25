import { useState } from "react";
import { Row } from "../interface/data";
import { AlertMessage } from "../interface/modal";
import { AlertModal } from "./AlertModal";

export default function DownloadCSV({ rows }: { rows: Row[] }) {

  const [openAlert, setOpenAlert] = useState(false);
  
  const [alert, setAlert] = useState<AlertMessage>({
    type: "success",
    title: "",
    message: "",
  })

  const buildCSV = () => {
    const headers = "Datetime,kW,Rate\n";
    const content = rows
      .map(r => {
        const val = r.value ?? "";
        return `"${r.datetime}",${val},"${r.rate}"`;
      })
      .join("\n");

    return headers + content;
  };

  const download = () => {
    const csv = buildCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "timestamp_tou.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
  try {
    const csv = buildCSV();
    await navigator.clipboard.writeText(csv);
    setAlert({
      type: "success",
      title: "Copied",
      message: "CSV copied to clipboard",
    });
    setOpenAlert(true);
  } catch (err) {
    setAlert({
      type: "error",
      title: "Error",
      message: "Failed to copy CSV to clipboard: " + err,
    });
    setOpenAlert(true);
  }
};

  return (
    <div className="flex gap-2">
      <button
        onClick={copyToClipboard}
        className="rounded-xl border border-purple-600
                  px-4 py-2 text-sm font-semibold
                  text-purple-700 cursor-pointer
                  hover:bg-purple-50 transition"
      >
        Copy to clipboard
      </button>

      <button
        onClick={download}
        className="rounded-xl border border-purple-600
                  px-4 py-2 text-sm font-semibold
                  text-purple-700 cursor-pointer
                  hover:bg-purple-50 transition"
      >
        Download CSV
      </button>

      <AlertModal
        open={openAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => console.log("confirmed")}
        onClose={() => setOpenAlert(false)}
      />;
    </div>
  );
}
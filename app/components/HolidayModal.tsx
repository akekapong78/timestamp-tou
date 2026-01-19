type Props = {
  open: boolean;
  onClose: () => void;
  holidays: Holiday[];
};

type Holiday = {
  date: string;
  name: string;
}

export default function HolidayModal({ open, onClose, holidays }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}   // 👈 คลิกพื้นหลัง = ปิด
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // 👈 กันไม่ให้ปิด
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-800">
            Holiday List
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 overflow-auto rounded-lg border border-purple-100">
          <ul className="divide-y text-sm font-mono">
            {holidays.map((h, i) => (
              <li
                key={i}
                className="
                  px-3 py-2
                  flex justify-between
                  text-gray-600
                  hover:bg-purple-100
                  hover:text-purple-700
                  transition-colors
                "
              >
                <span>{h.name}</span>
                <span className="text-purple-400">{h.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
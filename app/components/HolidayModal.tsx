type Props = {
  open: boolean;
  onClose: () => void;
  holidays: string[];
};

export default function HolidayModal({ open, onClose, holidays }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-800">
            Holiday / Off-Peak List
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 overflow-auto rounded-lg border border-purple-100 text-purple-300">
          <ul className="divide-y text-sm font-mono">
            {holidays.map((d, i) => (
              <li key={i} className="px-3 py-1.5">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
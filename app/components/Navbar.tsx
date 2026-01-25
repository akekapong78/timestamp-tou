type Menu = "tou" | "shift";

type Props = {
  active: Menu;
  onChange: (menu: Menu) => void;
};

export default function Navbar({ active, onChange }: Props) {
  return (
    <nav className="inline-flex gap-1 rounded-2xl bg-white/50 backdrop-blur-md p-1.5 border border-purple-100 shadow-sm">
      <button
        onClick={() => onChange("tou")}
        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
          active === "tou"
            ? "bg-purple-700 text-white shadow-lg shadow-purple-200"
            : "text-purple-600 hover:bg-purple-100"
        }`}
      >
        แยก Rate TOU จาก Datetime
      </button>
      <button
        onClick={() => onChange("shift")}
        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
          active === "shift"
            ? "bg-purple-700 text-white shadow-lg shadow-purple-200"
            : "text-purple-600 hover:bg-purple-100"
        }`}
      >
        เลื่อนค่า kW หลังจาก Reset เวลา
      </button>
    </nav>
  );
}
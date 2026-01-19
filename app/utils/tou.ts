import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import holidays from "@/app/data/holidays.json";

dayjs.extend(isBetween);

const holidaySet = new Set(holidays);

export function getRateTOU(dateStr: string): "P" | "OP" | "H" {
  const d = dayjs(dateStr);

  if (!d.isValid()) return "OP"; // หรือ throw error

  const dateOnly = d.format("YYYY-MM-DD");
  const day = d.day(); // 0=Sun, 6=Sat
  const time = d.format("HH:mm");

  // H: weekend or special holiday
  if (day === 0 || day === 6 || holidaySet.has(dateOnly)) {
    return "H";
  }

  // P: 09:15 - 22:00
  if (time >= "09:15" && time <= "22:00") {
    return "P";
  }

  // OP: rest
  return "OP";
}
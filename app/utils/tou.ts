import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import holidays from "@/app/data/holidays.json";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { normalize24 } from "./helper";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
const DATE_FORMATS = [
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD HH:mm:ss",
  "DD/MM/YYYY HH.mm",
  "DD/MM/YYYY HH.mm.ss",
  "DD/MM/YYYY HH:mm",
  "DD/MM/YYYY HH:mm:ss",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "MM/DD/YYYY HH:mm",
  "MM/DD/YYYY HH:mm:ss",
  "MM/DD/YYYY HH.mm",
  "MM/DD/YYYY HH.mm.ss",
  "YYYY-MM-DD HH:mm",
  "YY-MM-DD HH:mm:ss",
  "DD/MM/YY HH.mm",
  "DD/MM/YY HH.mm.ss",
  "DD/MM/YY HH:mm",
  "DD/MM/YY HH:mm:ss",
  "DD/MM/YY",
  "MM/DD/YY",
  "MM/DD/YY HH:mm",
  "MM/DD/YY HH:mm:ss",
  "MM/DD/YY HH.mm",
  "MM/DD/YY HH.mm.ss",
  "YYYY-MM-DD HH:mm",

  "YYYY-M-D HH:mm:ss",
  "D/M/YYYY HH.mm",
  "D/M/YYYY HH.mm.ss",
  "D/M/YYYY HH:mm",
  "D/M/YYYY HH:mm:ss",
  "D/M/YYYY",
  "M/D/YYYY",
  "M/D/YYYY HH:mm",
  "M/D/YYYY HH:mm:ss",
  "M/D/YYYY HH.mm",
  "M/D/YYYY HH.mm.ss",
  "YYYY-M-D HH:mm",
  "YY-M-D HH:mm:ss",
  "D/M/YY HH.mm",
  "D/M/YY HH.mm.ss",
  "D/M/YY HH:mm",
  "D/M/YY HH:mm:ss",
  "D/M/YY",
  "M/D/YY",
  "M/D/YY HH:mm",
  "M/D/YY HH:mm:ss",
  "M/D/YY HH.mm",
  "M/D/YY HH.mm.ss",
];

const holidaySet = new Set<string>(
  holidays.map(h => h.date) // "YYYY-MM-DD"
);

export function getRateTOU(dateStr: string): "P" | "OP" | "H" | "error" {
  let normalized = dateStr
    .replace(/\u00A0/g, " ") // nbsp
    .replace(/\t/g, " ")     // 🔑 TAB จาก Excel
    .replace(/\s+/g, " ")    // กันหลายช่อง
    .trim();

  normalized = normalize24(normalized);
  const d = dayjs(normalized, DATE_FORMATS, true);
  if (!d.isValid()) {
    console.log("Invalid date:", normalized); 
    return "error"; // หรือ throw error
  }

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
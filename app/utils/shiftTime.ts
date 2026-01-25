import { Row } from "../interface/data";

export function shiftNonZeroDown(rows: Row[]): Row[] {
  // เก็บค่าที่ไม่ใช่ 0
  const values = rows
    .map(r => r.value)
    .filter(v => v !== 0);

  let pointer = values.length - 1;

  // เดินจากล่างขึ้นบน
  return rows
    .slice()
    .reverse()
    .map(row => {
      if (pointer >= 0) {
        const v = values[pointer];
        pointer--;
        return { ...row, value: v };
      }
      return { ...row, value: null }; // หรือ ""
    })
    .reverse();
}
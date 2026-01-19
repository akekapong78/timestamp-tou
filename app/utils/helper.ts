import dayjs from "dayjs";

export function normalize24(input: string): string {
  return input.replace(
    /(\d{2}\/\d{2}\/\d{4})\s+24[.:](\d{2})/,
    (_, date, min) =>
      dayjs(date, "DD/MM/YYYY")
        .format("DD/MM/YYYY") + ` 00:${min}`
  );
}
import dayjs from "dayjs";

export function normalize24(input: string): string {
  return input.replace(
    /(\d{2}\/\d{2}\/\d{4})\s+24[.:](\d{2})/,
    (_, date, min) =>
      dayjs(date, "DD/MM/YYYY")
        .format("DD/MM/YYYY") + ` 00:${min}`
  );
}

export function detectDefaultFormat() {
  if (typeof navigator === "undefined") return "DD/MM/YYYY HH:mm";

  const locale = navigator.language;
  console.log(locale);

  if (locale.startsWith("en-US")) return "MM/DD/YYYY HH:mm";
  if (locale.startsWith("ja")) return "YYYY-MM-DD HH:mm";

  return "DD/MM/YYYY HH:mm";
}
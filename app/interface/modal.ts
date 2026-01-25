export type AlertMessage = {
  type: "success" | "error" | "warning";
  title: string;
  message: string;
};
import React from "react";

export type AlertType = "success" | "warning" | "error";

interface AlertModalProps {
  open: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const typeConfig = {
  success: {
    icon: "✅",
    titleColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  warning: {
    icon: "⚠️",
    titleColor: "text-yellow-600",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  },
  error: {
    icon: "❌",
    titleColor: "text-red-600",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
};

export const AlertModal: React.FC<AlertModalProps> = ({
  open,
  type,
  title,
  message,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{config.icon}</span>
          <h2 className={`text-lg font-semibold ${config.titleColor}`}>
            {title}
          </h2>
        </div>

        <p className="text-sm text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {/* <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm border border-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button> */}

          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`rounded-lg px-4 py-2 text-sm text-white ${config.buttonColor}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
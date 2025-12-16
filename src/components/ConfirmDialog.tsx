//import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Подтверждение",
  message,
  confirmText = "Удалить",
  cancelText = "Отмена",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md shadow-xl relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-slate-300 text-sm">{message}</p>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-white"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 transition text-white font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

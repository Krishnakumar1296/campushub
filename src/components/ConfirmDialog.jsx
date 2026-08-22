import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Delete" }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </span>
        <p className="pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="btn-outline px-5 py-2.5">
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="btn-danger px-5 py-2.5"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

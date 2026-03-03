import type { ReactNode } from "react";

import { Button } from "./Button";

export interface ModalProps {
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}

export function Modal({ children, footer, onClose, open, title }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div aria-modal="true" className="ui-modal-backdrop" role="dialog">
      <div className="ui-modal">
        <div className="ui-modal-head">
          <h2 className="ui-modal-title">{title}</h2>
          <button aria-label="Close dialog" className="ui-modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
        <div className="ui-modal-actions">
          {footer ?? <Button onClick={onClose} variant="ghost">Close</Button>}
        </div>
      </div>
    </div>
  );
}

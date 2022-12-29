import ReactDom from "react-dom";
import { ModalProps, ModalReturn } from "../../types/types";

function Modal({ open, onClose, children }: ModalProps): ModalReturn {
  if (!open) return null;

  const overlayRootEl = document.getElementById("modal-root");
  if (overlayRootEl === null) return null;

  return ReactDom.createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-neutral-900 opacity-70"
      />
      <div className="fixed z-[1000] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2	">
        {children}
      </div>
    </>,
    overlayRootEl
  );
}

export default Modal;

import * as React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {isOpen && (
          <>
            <div className="modal-backdrop"></div>
            <div className="modal-content">
              <button 
                className="modal-close-button" 
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
              {children}
            </div>
          </>
        )}
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
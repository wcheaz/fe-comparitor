import * as React from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Global modal stack to manage z-index and body overflow
const modalStack: number[] = [];

const updateBodyOverflow = () => {
  if (typeof document !== 'undefined') {
    if (modalStack.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, ...props }, ref) => {
    const [zIndex, setZIndex] = React.useState(50);
    
    React.useEffect(() => {
      if (isOpen) {
        const newZIndex = modalStack.length > 0 ? Math.max(...modalStack) + 10 : 50;
        setZIndex(newZIndex);
        modalStack.push(newZIndex);
        updateBodyOverflow();
      }
      
      return () => {
        if (isOpen) {
          const index = modalStack.indexOf(zIndex);
          if (index > -1) {
            modalStack.splice(index, 1);
          }
          updateBodyOverflow();
        }
      };
    }, [isOpen, zIndex]);

    if (!isOpen) {
      return null;
    }

    const modalContent = (
      <>
        <div 
          className="modal-backdrop" 
          style={{ zIndex: zIndex }}
          onClick={onClose}
        />
        <div 
          className="modal-content" 
          style={{ zIndex: zIndex + 1 }}
          ref={ref}
          {...props}
        >
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
    );

    // Use React Portal to render modal at document body level
    if (typeof document !== 'undefined') {
      return createPortal(modalContent, document.body);
    }
    
    return modalContent;
  }
);

Modal.displayName = "Modal";

export { Modal };
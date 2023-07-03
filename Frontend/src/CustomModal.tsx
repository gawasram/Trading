import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmation</h2>
        <p>Are you sure you want to accept this offer?</p>
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onAccept}>Accept</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
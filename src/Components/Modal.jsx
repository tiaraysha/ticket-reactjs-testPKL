import React from 'react';

export default function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal show fade d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

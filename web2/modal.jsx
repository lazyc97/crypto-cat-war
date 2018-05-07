import React from 'react';

const MessageModal = (props) => (
  <div className="modal fade" id="message-modal" tabIndex="-1" role="dialog" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="message-modal-title"></h5>
        </div>
        <div className="modal-body" id="message-modal-content"></div>
        <div className="modal-footer">
          <button type="button" id="message-modal-close" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
);

const ConfirmModal = (props) => (
  <div className="modal fade" id="confirm-modal" tabIndex="-1" role="dialog" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="confirm-modal-title"></h5>
        </div>
        <div className="modal-body" id="confirm-modal-content"></div>
        <div className="modal-footer">
          <button type="button" id="confirm-modal-yes" className="btn btn-primary" data-dismiss="modal">Yes</button>
          <button type="button" id="confirm-modal-no" className="btn btn-secondary" data-dismiss="modal">No</button>
        </div>
      </div>
    </div>
  </div>
);

const TextInputModal = (props) => (
  <div className="modal fade" id="text-input-modal" tabIndex="-1" role="dialog" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="text-input-modal-title"></h5>
        </div>
        <div className="modal-body">
          <label htmlFor="text-input-modal-input" className="col-form-label" id="text-input-modal-label"></label>
          <input type="text" className="form-control" id="text-input-modal-input"></input>
        </div>
        <div className="modal-footer">
          <button type="button" id="text-input-modal-confirm" className="btn btn-primary" data-dismiss="modal">Confirm</button>
          <button type="button" id="text-input-modal-close" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
);

const Modal = (props) => (
  <React.Fragment>
    <MessageModal />
    <ConfirmModal />
    <TextInputModal />
  </React.Fragment>
);

export default Modal;
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function CreateTaskModal({ onClose }) {
  const [data, setData] = useState({ task: "", enddate: "", priority: "" });

  

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton >
        <Modal.Title>Create Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newTaskTitle" className="form-label">Task Title</label>
            <input
              type="text"
              className="form-control"
              id="newTaskTitle"
              name='task'
              value={data.task}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              name='enddate'
              value={data.enddate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label" >Priority</label>
            <select
              className="form-select"
              id="priority"
              name='priority'
              value={data.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Create Task</Button>
      </Modal.Footer>
    </Modal>
  );
}

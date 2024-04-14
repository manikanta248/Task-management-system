import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {ToastContainer,toast} from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css'
export default function AddSubTaskModal({ addSubTask, onClose,_id }) {
  const [data, setData] = useState({ task: "", enddate: "" });
  const [error,setError]=useState(null)

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };


    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(data)
      const formattedDate = formatDate(data.enddate);
      const newData = { ...data, enddate: formattedDate }
      console.log(data)
      try {
        const response = await fetch(`http://localhost:5000/api/putsubtask/${_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data) // Send form data in the request body
        });
        const json = await response.json();
        if (!json.success) {
          toast.error(json.error,{toastId:325234});
        } else {
          // Clear form data on successful submission
          toast.success("Subtask added successfylly",{toastId:323})
          setData({ task: "", enddate: ""});
          onClose();// Close the modal
        }
      } catch (error) {
        console.error(error);
        setError("Internal server error");
      }
       // Close the modal after submitting
  };
  const formatDate = (dateString) => {
    // Split the date string by '/' and reorder it to 'yyyy-MM-dd'
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
  };

  return (
    <div>
      {addSubTask && (
        <Modal show={true} centered onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Sub Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Form for adding subtask */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newTaskTitle" className="form-label">Task</label>
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
              {/* Add more fields as needed */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary" onClick={handleSubmit}>Add Sub Task</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

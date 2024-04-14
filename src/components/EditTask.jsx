import React, { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function EditTask({ edit, toggleModal, editData, setEditData, _id }) {


    const [error, setError] = useState(null);


    const handleEditSubmit = async (e) => {
        e.preventDefault();
        // Format the date in 'yyyy-MM-dd' format
        console.log("Original end date:", editData.enddate);
        // Format the date in 'yyyy-MM-dd' format
        const formattedDate = formatDate(editData.enddate);

        // Update the enddate property of editData with the formatted date
        const editedData = { ...editData, enddate: formattedDate };
        try {
            const response = await fetch(`http://localhost:5000/api/edittask/${_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData) // Send editedData with formatted date
            });
            const json = await response.json();
            if (!json.success) {
                toast.error(json.error, { toastId: 1 });
            } else {
                // Clear form data on successful submission
                toast.success("Task Edited successfully", { toastId: 2 })
                setEditData({ task: "", endDate: "", priority: "", status: "" });
                toggleModal1();
                
                // Reload the task data after editing
            }
        } catch (error) {
            console.error(error);
            toast.error("Internal server error", { toastId: 5 });
        }
    };

    const formatDate = (dateString) => {
        // Split the date string by '/' and reorder it to 'yyyy-MM-dd'
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    };

    const toggleModal1 = () => {
        toggleModal(); // Call the toggleModal function passed as prop
    };
    return (
        <div>

            {edit && (
                <Modal show={edit} onHide={toggleModal1} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Add form fields for editing task */}
                        {/* For example: */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="newTaskTitle" className="form-label">Task Title</label>
                                <input type="text" className="form-control" id="newTaskTitle" name='task' value={editData.task} onChange={(e) => setEditData({ ...editData, task: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">End Date</label>
                                <input type="date" className="form-control" id="endDate" name='enddate' value={editData.endDate} onChange={(e) => setEditData({ ...editData, endDate: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="priority" className="form-label">Priority</label>
                                <select className="form-select" id="priority" name='priority' value={editData.priority} onChange={(e) => setEditData({ ...editData, priority: e.target.value })}>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    id="status"
                                    name="status"
                                    value={editData.status}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            {/* Add more fields as needed */}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={toggleModal1}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleEditSubmit}>
                            Save changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
}

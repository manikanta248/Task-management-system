import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditTask from '../components/EditTask'
import AddSubTaskModal from '../components/AddSubTask';
import {ToastContainer,toast} from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css'

export default function Tasks() {
  const [askDelete, setaskDelete] = useState(false);
  const [createTask, setcreateTask] = useState(false);
  const [addSubTask, setAddSubTask] = useState(false); // State for the subtask modal
  const [viewTask, setViewTask] = useState(false);
  const [data, setData] = useState({ task: "", enddate: "", priority: "", status: "To Do" });
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({ task: "", enddate: "", priority: "", status: "", _id: "" });
  const [id, setid] = useState("");
  const [message, setmessage] = useState("")
  const [showmessage, setshowmessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  const [TaskData, setTaskData] = useState([]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/deletetask/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Include an empty request body
      });

      if (response.ok) {
        // Task deleted successfully, update UI or perform any other action
        toast.success('Task deleted successfully',{toastId: 12   });

        toggleDeleteModal()

      } else {
        // Handle other response statuses (e.g., 404 Not Found)
        toast.error('Failed to delete task',{toastId: 10   });
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle fetch errors
    }
  };



  const loadTaskData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/gettask", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      });
      const data = await response.json();
      // Format the dates before setting the state
      const formattedData = data.map(task => {
        // Ensure the task has an endDate property and it's not already a Date object
        if (task.endDate && !(task.endDate instanceof Date)) {
          return {
            ...task,
            endDate: new Date(task.endDate).toLocaleDateString(),
          };
        }
        return task; // Return unchanged if endDate is missing or already a Date object
      });
      setTaskData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };
  
  const sortByPriority = () => {
    // Sort the TaskData array by priority
    const sortedData = TaskData.sort((a, b) => {
      // Assuming priority is a string: 'low', 'medium', 'high'
      const priorityOrder = { low: 0, medium: 1, high: 2 };
      return priorityOrder[b.priority] - priorityOrder[a.priority]; // Reverse order here
    });
    setTaskData([...sortedData]);
  };
  
  const sortByDate = () => {
    // Sort the TaskData array by end date
    const sortedData = TaskData.sort((a, b) => {
      // Convert end date strings to Date objects for comparison
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      return dateA - dateB;
    });
    setTaskData([...sortedData]);
  };

  useEffect(() => {
    loadTaskData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formatDate(data.enddate);
    const newData = { ...data, enddate: formattedDate }
    console.log(data)
    try {
      const response = await fetch("http://localhost:5000/api/puttask", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data) // Send form data in the request body
      });
      const json = await response.json();
      if (!json.success) {
        toast.error(json.error,{toastId: 9})
      } else {
        // Clear form data on successful submission
        toast.success("Task created successfully",{toastId: 13})
        setData({ task: "", enddate: "", priority: "" });
        setcreateTask(false); // Close the modal
      }
    } catch (error) {
      console.error(error);
      setError("Internal server error");
    }
  };

  const formatDate = (dateString) => {
    // Split the date string by '/' and reorder it to 'yyyy-MM-dd'
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const toggleModal = (taskid, task) => {
    setaskDelete(false);
    setcreateTask(false);
    setEdit(false);
    // Set the data of the selected task to the editData state
  };

  const toggleDeleteModal = () => {
    setaskDelete(!askDelete);
    setcreateTask(false);
  };

  const toggleCreateTaskModal = () => {
    setcreateTask(!createTask);
    setaskDelete(false);
  };

  const toggleAddSubTaskModal = () => {
    setAddSubTask(!addSubTask);
  };

  const toggleViewTask = () => {
    setViewTask(!viewTask);
  };
  const calculateDateDifference = (endDateString) => {
    const endDate = new Date(endDateString);
    const currentDate = new Date();
    const differenceInTime = endDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };
  const handleSearchChange = event => {
    const { name, value } = event.target;
    setSearchQuery(value);
  };
  const filteredTasks = TaskData.filter(task => {
    const formattedDate = new Date(task.endDate).toLocaleDateString();
    return (
      task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formattedDate.includes(searchQuery)
    );
  });


  return (
    <div>
      <Navbar />
      <div className='container'>
        <div className='mt-3' style={{ display: "flex", justifyContent: "end" }}>
          <button className='btn btn-success' onClick={() => setcreateTask(true)} >+ Create Task</button>
        </div>
        <div className='d-flex mx-4 mt-3 justify-content-center' >
        
          <form className="form-inline my-2 my-lg-0" style={{ width: "100%", maxWidth: "900px" }}>
            
            <input className="form-control " style={{ width: "100%" }} type="search" placeholder="Search for task" aria-label="Search" value={searchQuery} onChange={handleSearchChange} />
          </form>
        </div>
        <div className='mx-4 mt-3 d-flex justify-content-end'>
          <h3>Sort Options</h3>
          <button className='btn btn-primary mx-2' onClick={()=>sortByPriority()}>By Priority</button>
          <button className='btn btn-primary ' onClick={()=>sortByDate()}>By Date</button>
        </div>
        <div className='task-container mt-4'>
          <div style={{ minWidth: "18rem", backgroundColor: "#D3D3D3", borderRadius: "22px", display: "flex", justifyContent: "center" }}>
            <h2 style={{fontWeight:"bold"}}>TO DO</h2>
          </div>
          <div className='container alltasks mt-4 '>

            {searchQuery === "" ? TaskData.map((task, index) => (
              task.status === 'To Do' && (
                <div className="card-body cards mt-3 mb-3 mx-1 p-2 position-relative" style={{ height: "auto", backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                  <div className="dropdown position-absolute top-0 end-0">
                    <button className="btn " type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", boxShadow: "none", background: "none"}}>
                      ...
                    </button>
                    <ul className="dropdown-menu" style={{ backgroundColor: "white" }}>
                      <li><a className="dropdown-item" onClick={() => {
                        setEditData({ ...data, _id: task._id });
                        setEdit(true); // Call handleChange separately if needed
                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: "In Progress" });
                        setid(task._id);
                      }}
                      >Edit</a></li>
                      <li><a className="dropdown-item" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</a></li>
                    </ul>
                  </div>
                  <div className='mt'>
                    <label className='mx-3'><h3 >Task</h3></label>
                    <p style={{ wordWrap: "break-word" }} className="card-title mx-3">{task.task}</p>
                  </div>

                  <div className='d-flex mt-4'>
                    <label className='mx-3'><h5>Submit Date</h5></label>
                    <p className={` text-${task.endDate ,calculateDateDifference(task.endDate) < 3 ? 'danger' : (calculateDateDifference(task.endDate) >= 3 && calculateDateDifference(task.endDate) <= 7) ? 'warning' : ''}`}>{task.endDate}</p>

                    

                  </div>
                  {calculateDateDifference(task.endDate) < 0 && <p className='mx-3 text-danger' style={{ fontWeight: "bold" }}>Task submission date is overdue</p>}
                  <p className={`badge text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : task.priority === 'high' ? 'danger' : ''} mx-3`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>

                  <hr />
                  <div className='row mx-2'>
                    <div className='d-flex'>
                      <p style={{ fontWeight: "Bold" }}>Total SubTasks</p>
                      <p className='mx-3'>{task.subtasks.length}</p>
                    </div>
                    <button className='btn btn-primary' onClick={() => { setAddSubTask(true); setid(task._id) }}>+ Add Subtask</button>
                  </div>
                </div>
              )



            )) : filteredTasks.map((task, index) => (
              task.status === 'To Do' && (
                <div key={task._id} className="card-body cards mt-5 mb-3 mx-1 p-2 position-relative" style={{ height: "auto", backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                  <div className="dropdown position-absolute top-0 end-0">
                    <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", boxShadow: "none", background: "none" }}>
                      <span>...</span>
                    </button>
                    <ul className="dropdown-menu" style={{ backgroundColor: "white" }}>
                      <li><a className="dropdown-item" onClick={() => {
                        setEditData({ ...data, _id: task._id });
                        setEdit(true); // Call handleChange separately if needed
                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: task.status });
                        setid(task._id);
                      }}
                      >Edit</a></li>
                      <li><a className="dropdown-item" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</a></li>
                    </ul>
                  </div>
                  <div className='mt'>
                    <label className='mx-3'><h3 >Task</h3></label>
                    <p style={{ wordWrap: "break-word" }} className="card-title mx-3">{task.task}</p>
                  </div>

                  <div className='d-flex mt-4'>
                    <label className='mx-3'><h5>Submit Date</h5></label>
                    <p className={` text-${calculateDateDifference(task.endDate) < 3 ? 'danger' : (calculateDateDifference(task.endDate) >=3 && calculateDateDifference(task.endDate) <= 7) ? 'warning' : ''}`}>{task.endDate}</p>



                  </div>
                  {calculateDateDifference(task.endDate) < 0 && <p className='mx-3 text-danger' style={{ fontWeight: "bold" }}>Task submission date is overdue</p>}
                  <p className={`badge text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : task.priority === 'high' ? 'danger' : ''} mx-3`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>

                  <hr />
                  <div className='row mx-2'>
                    <div className='d-flex'>
                      <p style={{ fontWeight: "Bold" }}>Total SubTasks</p>
                      <p className='mx-3'>{task.subtasks.length}</p>
                    </div>
                    <button className='btn btn-primary' onClick={() => { setAddSubTask(true); setid(task._id) }}>+ Add Subtask</button>
                  </div>
                </div>
              )
            ))}


          </div>
          <div style={{ minWidth: "18rem", backgroundColor: "#D3D3D3", borderRadius: "22px", display: "flex", justifyContent: "center" }}>
            <h2 style={{fontWeight:"bold"}}>IN PROGRESS</h2>
          </div>
          <div className='container alltasks mb-4'>

            {searchQuery === "" ? TaskData.map((task, index) => (
              task.status === 'In Progress' && (
                <div key={task._id} className="card-body cards mt-5 mb-3 mx-1 p-2 position-relative" style={{ height: "auto", backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                  <div className="dropdown position-absolute top-0 end-0">
                    <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", boxShadow: "none", background: "none" }}>
                      <span>...</span>
                    </button>
                    <ul className="dropdown-menu" style={{ backgroundColor: "white" }}>
                      <li><a className="dropdown-item" onClick={() => {
                        setEditData({ ...data, _id: task._id });
                        setEdit(true); // Call handleChange separately if needed
                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: "In Progress" });
                        setid(task._id);
                      }}
                      >Edit</a></li>
                      <li><a className="dropdown-item" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</a></li>
                    </ul>
                  </div>
                  <div className='mt'>
                    <label className='mx-3'><h3 >Task</h3></label>
                    <p style={{ wordWrap: "break-word" }} className="card-title mx-3">{task.task}</p>
                  </div>

                  <div className='d-flex mt-4'>
                    <label className='mx-3'><h5>Submit Date</h5></label>
                    <p className={` text-${calculateDateDifference(task.endDate) < 3 ? 'danger' : (calculateDateDifference(task.endDate) >=3 && calculateDateDifference(task.endDate) <= 7) ? 'warning' : ''}`}>{task.endDate}</p>



                  </div>
                  {calculateDateDifference(task.endDate) < 0 && <p className='mx-3 text-danger' style={{ fontWeight: "bold" }}>Task submission date is overdue</p>}
                  <p className={`badge text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : task.priority === 'high' ? 'danger' : ''} mx-3`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>

                  <hr />
                  <div className='row mx-2'>
                    <div className='d-flex'>
                      <p style={{ fontWeight: "Bold" }}>Total SubTasks</p>
                      <p className='mx-3'>{task.subtasks.length}</p>
                    </div>
                    <button className='btn btn-primary' onClick={() => { setAddSubTask(true); setid(task._id) }}>+ Add Subtask</button>
                  </div>
                </div>
              )



            )) : filteredTasks.map((task, index) => (
              task.status === 'In Progress' && (
                <div key={task._id} className="card-body cards mt-5 mb-3 mx-1 p-2 position-relative" style={{ height: "auto", backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                  <div className="dropdown position-absolute top-0 end-0">
                    <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", boxShadow: "none", background: "none" }}>
                      <span>...</span>
                    </button>
                    <ul className="dropdown-menu" style={{ backgroundColor: "white" }}>
                      <li><a className="dropdown-item" onClick={() => {
                        setEditData({ ...data, _id: task._id });
                        setEdit(true); // Call handleChange separately if needed
                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: "In Progress" });
                        setid(task._id);
                      }}
                      >Edit</a></li>
                      <li><a className="dropdown-item" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</a></li>
                    </ul>
                  </div>
                  <div className='mt'>
                    <label className='mx-3'><h3 >Task</h3></label>
                    <p style={{ wordWrap: "break-word" }} className="card-title mx-3">{task.task}</p>
                  </div>

                  <div className='d-flex mt-4'>
                    <label className='mx-3'><h5>Submit Date</h5></label>
                    <p className={` text-${calculateDateDifference(task.endDate) < 3 ? 'danger' : (calculateDateDifference(task.endDate) >=3 && calculateDateDifference(task.endDate) <= 7) ? 'warning' : ''}`}>{task.endDate}</p>



                  </div>
                  {calculateDateDifference(task.endDate) < 0 && <p className='mx-3 text-danger' style={{ fontWeight: "bold" }}>Task submission date is overdue</p>}
                  <p className={`badge text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : task.priority === 'high' ? 'danger' : ''} mx-3`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>

                  <hr />
                  <div className='row mx-2'>
                    <div className='d-flex'>
                      <p style={{ fontWeight: "Bold" }}>Total SubTasks</p>
                      <p className='mx-3'>{task.subtasks.length}</p>
                    </div>
                    <button className='btn btn-primary' onClick={() => { setAddSubTask(true); setid(task._id) }}>+ Add Subtask</button>
                  </div>
                </div>
              )
            ))}

          </div >
          <div style={{ minWidth: "18rem", backgroundColor: "#D3D3D3", borderRadius: "22px", display: "flex", justifyContent: "center" }}>
            <h2 style={{fontWeight:"bold"}}>COMPLETED</h2>
          </div>
          <div className='container mb-4 alltasks'>

            {searchQuery === "" ? TaskData.map((task, index) => (
              task.status === 'Completed' && (
                <div key={task._id} className="card-body cards mt-5 mb-5 mx-1 p-2 position-relative" style={{ height: "auto", backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                  <div className="dropdown position-absolute top-0 end-0">
                    <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", boxShadow: "none", background: "none" }}>
                      <span>...</span>
                    </button>
                    <ul className="dropdown-menu" style={{ backgroundColor: "white" }}>
                      <li><a className="dropdown-item" onClick={() => {
                        setEditData({ ...data, _id: task._id });
                        setEdit(true); // Call handleChange separately if needed
                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: "In Progress" });
                        setid(task._id);
                      }}
                      >Edit</a></li>
                      <li><a className="dropdown-item" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</a></li>
                    </ul>
                  </div>
                  <div className='mt'>
                    <label className='mx-3'><h3 >Task</h3></label>
                    <p style={{ wordWrap: "break-word" }} className="card-title mx-3">{task.task}</p>
                  </div>

                  <div className='d-flex mt-4'>
                    <label className='mx-3'><h5>Submit Date</h5></label>
                    <p className={` text-${calculateDateDifference(task.endDate) < 3 ? 'danger' : (calculateDateDifference(task.endDate) >=3 && calculateDateDifference(task.endDate) <= 7) ? 'warning' : ''}`}>{task.endDate}</p>



                  </div>
                  {calculateDateDifference(task.endDate) < 0 && <p className='mx-3 text-danger' style={{ fontWeight: "bold" }}>Task submission date is overdue</p>}
                  <p className={`badge text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : task.priority === 'high' ? 'danger' : ''} mx-3`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>

                  <hr />
                  <div className='row mx-2'>
                    <div className='d-flex'>
                      <p style={{ fontWeight: "Bold" }}>Total SubTasks</p>
                      <p className='mx-3'>{task.subtasks.length}</p>
                    </div>
                    <button className='btn btn-primary' onClick={() => { setAddSubTask(true); setid(task._id) }}>+ Add Subtask</button>
                  </div>
                </div>
              )



            )) : filteredTasks.map((task, index) => (
              task.status === 'Completed' && (
                <div key={task._id} className="card-body cards mt-5 mb-5 mx-1 p-2 position-relative" style={{ width: "auto", height: "auto", backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                  <div className="dropdown position-absolute top-0 end-0">
                    <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: "none", boxShadow: "none", background: "none" }}>
                      <span>...</span>
                    </button>
                    <ul className="dropdown-menu" style={{ backgroundColor: "white" }}>
                      <li><a className="dropdown-item" onClick={() => {
                        setEditData({ ...data, _id: task._id });
                        setEdit(true); // Call handleChange separately if needed
                        setEditData({ task: task.task, enddate: task.endDate, priority: task.priority, status: "In Progress" });
                        setid(task._id);
                      }}
                      >Edit</a></li>
                      <li><a className="dropdown-item" onClick={() => { setaskDelete(true); setid(task._id) }}>Delete</a></li>
                    </ul>
                  </div>
                  <div className='mt'>
                    <label className='mx-3'><h3 >Task</h3></label>
                    <p style={{ wordWrap: "break-word" }} className="card-title mx-3">{task.task}</p>
                  </div>

                  <div className='d-flex mt-4'>
                    <label className='mx-3'><h5>Submit Date</h5></label>
                    <p className={` text-${calculateDateDifference(task.endDate) < 3 ? 'danger' : (calculateDateDifference(task.endDate) >=3 && calculateDateDifference(task.endDate) <= 7) ? 'warning' : ''}`}>{task.endDate}</p>



                  </div>
                  {calculateDateDifference(task.endDate) < 0 && <p className='mx-3 text-danger' style={{ fontWeight: "bold" }}>Task submission date is overdue</p>}
                  <p className={`badge text-bg-${task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'warning' : task.priority === 'high' ? 'danger' : ''} mx-3`}>{task.priority === 'low' ? 'Low' : task.priority === 'medium' ? 'Medium' : 'High'}</p>

                  <hr />
                  <div className='row mx-2'>
                    <div className='d-flex'>
                      <p style={{ fontWeight: "Bold" }}>Total SubTasks</p>
                      <p className='mx-3'>{task.subtasks.length}</p>
                    </div>
                    <button className='btn btn-primary' onClick={() => { setAddSubTask(true); setid(task._id) }}>+ Add Subtask</button>
                  </div>
                </div>
              )
            ))}

          </div>
        </div>

      </div>
      <EditTask
        edit={edit}
        toggleModal={toggleModal}
        editData={editData}
        setEditData={setEditData}
            
        _id={id}
      />
      {askDelete && (
        <Modal show={askDelete} onHide={toggleDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this task?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {createTask && (
        <Modal show={createTask} onHide={toggleCreateTaskModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Form for creating task */}
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
                <label htmlFor="priority" className="form-label">Priority</label>
                <select
                  className="form-select"
                  id="priority"
                  name='priority'
                  value={data.priority}
                  onChange={handleChange}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              {/* Add more fields as needed */}
              <Button variant="primary" type="submit">Create Task</Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleCreateTaskModal}>Close</Button>
          </Modal.Footer>
        </Modal>

      )}
      <AddSubTaskModal addSubTask={addSubTask} onClose={() => toggleAddSubTaskModal()} _id={id} />

      {viewTask && (
        <Modal show={viewTask} onHide={toggleViewTask} centered>
          <Modal.Header closeButton>
            <Modal.Title>Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Form for creating task */}
            <div className='container'>
              <div className='container mt-5 p-3' style={{ backgroundColor: "#f3e8a9", borderRadius: "22px" }}>
                <div className='d-flex mx-3'>
                  <p className='badge text-bg-success  mt-2'>low</p>
                  <p className="bi bi-check2-circle mx-1 fs-5 mt-2"> completed</p>
                </div>
                <hr></hr>
                <div className='mx-3'>
                  <h2>Task Title</h2>
                </div>
                <div className='mx-3'>
                  <p >Created date : 22-2-24</p>
                  <p className='badge text-bg-success '>Submit date: 29-4-24</p>
                </div>
                <div className='mx-3'>
                  <p>Sub Task :1</p>


                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleViewTask}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}

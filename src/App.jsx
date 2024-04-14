import {BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import Home from "./screens/Home";
import Tasks from "./screens/Tasks";
import './App.css'
import Completed from "./screens/Completed";
import Inprogress from "./screens/Inprogress";
import Todo from "./screens/Todo";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import {ToastContainer,toast} from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/tasks" element={<Tasks/>}/>
          <Route path="/completed" element={<Completed/>}/>
          <Route path="/inprogress" element={<Inprogress/>}/>
          <Route path="/todo" element={<Todo/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </Router>
      <ToastContainer position='top-center'/>
    </>
  );
}

export default App;







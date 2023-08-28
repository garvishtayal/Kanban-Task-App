import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskFormModal from './components/task-form/taskFormModal';
import Home from './components/home/home';
import TaskComponent from './components/individual-task/individual-task';

const App = () => {
  const [status, setStatus] = useState('To Do');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home status={status} setStatus={setStatus} />}
        />
        <Route
          path="/addTask"
          element={
            <TaskFormModal
              isVisible={true}
              onClose={() => { }}
              onSave={() => { }}
              status={status}
              showToolbar
              initialTitle=''
              initialDescription=''
              taskId={null}
              isEditMode={false}
              updateTaskInTasks={() => {}}
              onTaskAdded={() => {}}
            />
          }
        />
        <Route
          path="/task/:taskId"
          element={<TaskComponent 
            onSave={() => {}}
            taskId=''
            onClose={()=> {}}
            updateTaskInTasks={() => {}}
            />}
        />
      </Routes>
    </Router>
  );
};

export default App;

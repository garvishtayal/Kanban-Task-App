import React, { useState, useEffect } from 'react';
import './home.css';
import TaskFormModal from '../task-form/taskFormModal';
import TaskComponent from '../individual-task/individual-task';

interface Task {
  _id: string;
  title: string;
  status: 'To Do' | 'Doing' | 'Done';
  index: number;
}

const Home: React.FC<{ status: string; setStatus: (status: string) => void }> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState<'To Do' | 'Doing' | 'Done' | ''>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('http://localhost:3001/api/tasks', {
          method: 'GET',
        });
        const data = await response.json();

        const tasksWithIndex = data.map((task: Task, index: number) => ({
          ...task,
          index,
        }));

        setTasks(tasksWithIndex);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLLIElement>, targetStatus: Task['status']) => {
    e.preventDefault();
    const droppedTask = JSON.parse(e.dataTransfer.getData('text/plain'));
    const updatedTasks = tasks.map(t => {
      if (t._id === droppedTask._id) {
        updateTaskStatus(droppedTask._id, targetStatus);
        return { ...t, status: targetStatus };
      }
      return t;
    });

    // If the task is not found in the current tasks list, it's a new task
    if (!updatedTasks.find(task => task._id === droppedTask._id)) {
      const newTask = { ...droppedTask, status: targetStatus };
      updatedTasks.push(newTask);
      updateTaskStatus(newTask._id, targetStatus);
    }

    setTasks(updatedTasks);
  };

  const renderTasks = (status: Task['status']) => {
    const filteredTasks = tasks.filter(task => task.status === status);

    return filteredTasks.length > 0 ? (
      filteredTasks.map(task => (
        <li onClick={() => {
          setSelectedTaskId(task._id);
          setIsVisible(true);
        }}

          key={task._id}
          draggable
          onDragStart={e => handleDragStart(e, task)}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, status)}
        >
          {task.title}
        </li>
      ))
    ) : (


      // Placeholder for an empty column that can receive dropped tasks
      <li
        className="empty-placeholder"
        onDragOver={handleDragOver}
        onDrop={e => handleDrop(e, status)}
      >
        Drop here
      </li>
    );
  };

  return (
    <div className="kanban-container">
      <div className="column todo">
        <h2>To Do</h2>
        <ul>{renderTasks('To Do')}</ul>
        <ul>
          <button className='add-task' onClick={() => {
            setIsFormVisible(true);
            setModalStatus('To Do');
          }}>
            + Add Task
          </button>
        </ul>
      </div>
      <div className="column doing">
        <h2>Doing</h2>
        <ul>{renderTasks('Doing')}</ul>
        <ul>
          <button className='add-task' onClick={() => {
            setIsFormVisible(true);
            setModalStatus('Doing');
          }}>
            + Add Task
          </button>
        </ul>
      </div>
      <div className="column done">
        <h2>Done</h2>
        <ul>{renderTasks('Done')}</ul>
        <ul>
          <button className='add-task' onClick={() => {
            setIsFormVisible(true);
            setModalStatus('Done');
          }}>
            + Add Task
          </button>
        </ul>
      </div>

      {/* Render the form modal overlay conditionally */}
      {isFormVisible && (
        <div className="modal-overlay">
          <div className="task-form-container">
            <TaskFormModal
              isVisible={isFormVisible}
              onClose={() => setIsFormVisible(false)}
              onSave={() => {
                setIsFormVisible(false);
                setModalStatus('');
              }}
              status={modalStatus}
              showToolbar={false}
              initialTitle=''
              initialDescription=''
              taskId={null}
              isEditMode={false}
            />
          </div>
        </div>
      )}

      {/* Render the form modal overlay conditionally */}
      {isVisible && (
        <div className="modal-overlay">
          <div className="task-form-container" onClick={e => e.stopPropagation()}>
            <TaskComponent
              onSave={() => setIsVisible(false)}
              taskId={selectedTaskId}
              onClose={() => setIsVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import './taskFormModal.css';
import { FiX, FiTrash2 } from 'react-icons/fi';

interface Task {
  _id: string;
  title: string;
  status: string;
  description: string;
}

interface TaskFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, status: string) => void;
  status: string;
  showToolbar: boolean;
  initialTitle: string;
  initialDescription: string;
  isEditMode: boolean;
  taskId: string | null;
  updateTaskInTasks: (updatedTask: Task) => void;
  onTaskAdded: () => void;
}

const TaskFormModal: React.FC<TaskFormProps> = ({
  isVisible,
  onClose,
  onSave,
  status,
  showToolbar,
  initialTitle,
  initialDescription,
  isEditMode,
  taskId,
  updateTaskInTasks,
  onTaskAdded
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isEmptyWarningVisible, setIsEmptyWarningVisible] = useState(false);

  const handleSave = async () => {
    if (!title || !description) {
      setIsEmptyWarningVisible(true);
      return;
    }
    try {
      if (isEditMode) {
        const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, status}),
        });

        if (response.ok) {
          console.log('Task updated successfully');
          onClose();
          updateTaskInTasks({
            _id: taskId!,
            title,
            description,
            status,
          });
        } else {
          console.error('Failed to update task');
        }

      }
      else {
        console.log('Status prop:', status);
        const response = await fetch('http://localhost:3001/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, status }),
        });
        if (response.ok) {
          onSave(title, description, status);
          onClose();
          onTaskAdded()
          
        } else {
          console.error('Error saving task:', response.statusText);
        }

      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async() => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, status}),
      });

      if (response.ok) {
        console.log('Task deleted successfully');
        onClose();
        updateTaskInTasks({
          _id: taskId!,
          title: '',
          description: '',
          status: '',
        });

      } else {
        console.error('Failed to delete task');
      }
    }  catch (error) {
      console.error('Error deleting task:', error);
    }
    
  }

  const closeWarning = () => {
    setIsEmptyWarningVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
        <h3>{isEditMode ? `Edit Task` : 'Add New Task'}</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        {showToolbar && (
          <div className="modal-icons">
            <button className="icon-button" onClick={handleDelete}>
              <FiTrash2 />
            </button>
          </div>
        )}
        <div className="modal-body">
          {isEmptyWarningVisible && (
            <div className="warning-message">
              <div className="warning-content">
                Please enter a title and description.
              </div>
              <button className="close-warning-button" onClick={closeWarning}>
                <FiX />
              </button>
            </div>
          )}
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="button" className="save-button" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;

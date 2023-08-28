import React, { useState, useEffect } from 'react';
import TaskFormModal from '../task-form/taskFormModal';

interface TaskComponentProps {
  taskId: string | null;
  onClose: () => void;
  onSave: () => void;
  updateTaskInTasks: (updatedTask: Task) => void; // Correctly typed function prop
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ taskId, onClose, updateTaskInTasks }) => {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`);
        const data = await response.json();
        setSelectedTask(data);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleCloseForm = () => {
    setIsFormVisible(false);
    onClose();
  };

  return (
    <div>
      {isFormVisible && selectedTask && (
        <TaskFormModal
          isVisible={true}
          onClose={handleCloseForm}
          onSave={handleCloseForm}
          status={selectedTask.status}
          showToolbar
          initialTitle={selectedTask.title}
          initialDescription={selectedTask.description}
          isEditMode={Boolean(taskId)}
          taskId={taskId}
          updateTaskInTasks={updateTaskInTasks}
          onTaskAdded={() => {}}
        />
      )}
    </div>
  );
};

export default TaskComponent;

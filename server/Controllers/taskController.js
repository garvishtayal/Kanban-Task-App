const Task = require('../Models/Task');

const taskController = {
  getAllTasks: async (_req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  createTask: async (req, res) => {
    try {
      const { title, description, status } = req.body;
      const task = new Task({ title, description, status });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const taskId = req.params.id;
      const { title, description, status } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { title, description, status },
        { new: true } // Return the updated task
      );

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const taskId = req.params.id;

      const deletedTask = await Task.findByIdAndDelete(taskId);

      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const taskId = req.params.id;

      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

};

module.exports = taskController;

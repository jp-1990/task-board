import React, { useState } from "react";
import { addTask } from "../../app/appSlice";
import { useDispatch } from "../../app/hooks";
import { apiQueries } from "../../utils";

import styles from "./CreateTask.module.css";

interface Task {
  name: string;
  description: string;
  deadline: string;
}
interface Props {
  list_id: number;
  nextIndex: number;
}
const CreateTask: React.FC<Props> = ({ list_id, nextIndex }) => {
  const initialState = {
    name: "",
    description: "",
    deadline: "",
  };

  const [task, setTask] = useState<Task>(initialState);
  const { createTask } = apiQueries;
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCreateTask = async () => {
    const { name, description, deadline } = task;
    if (!name || !description || !deadline) return;
    try {
      const deadlineAsString = new Date(task.deadline).toISOString();
      const newTask = await createTask({
        list_id,
        name,
        description,
        deadline: deadlineAsString,
        index: nextIndex,
      });

      dispatch(addTask(newTask[0]));
      setTask(initialState);
    } catch (err) {
      console.error(`createTask failed: ${err}`);
    }
  };
  return (
    <div className={styles.createTaskContainer}>
      <span>New Task:</span>
      <input
        id="name"
        value={task.name}
        onChange={handleChange}
        placeholder="Task name..."
      />
      <input
        id="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Task description..."
      />
      <input
        id="deadline"
        type={"datetime-local"}
        value={task.deadline}
        onChange={handleChange}
        placeholder="Task deadline..."
      />
      <button onClick={handleCreateTask}>Create New Task</button>
    </div>
  );
};

export default CreateTask;

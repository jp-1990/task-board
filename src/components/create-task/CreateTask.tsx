import React, { useState } from "react";
import { addTask } from "../../app/appSlice";
import { useDispatch } from "../../app/hooks";
import { apiQueries } from "../../utils";
import { TaskType } from "../../types";

import styles from "./CreateTask.module.css";

type Task = Pick<TaskType, "name" | "deadline" | "description">;
interface Props {
  list_id: number;
  nextIndex: number;
}
/**
 *
 * @param {Props} props - {@link Props}
 * @description Component to accept user input and create a new task with a name, description and deadline (list_id and index are added automatically based on the current length of the list and the list_id). Uses redux store and fires apiQuery.createTask to perform create.
 */
const CreateTask: React.FC<Props> = ({ list_id, nextIndex }) => {
  const initialState = {
    name: "",
    description: "",
    deadline: "",
  };

  const [task, setTask] = useState<Task>(initialState);
  const { createTask } = apiQueries;
  const dispatch = useDispatch();

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className={styles.container}>
      <span>New Task:</span>
      <input
        id="name"
        value={task.name}
        onChange={handleTaskInputChange}
        placeholder="Task name..."
      />
      <input
        id="description"
        value={task.description}
        onChange={handleTaskInputChange}
        placeholder="Task description..."
      />
      <input
        id="deadline"
        type={"datetime-local"}
        value={task.deadline}
        onChange={handleTaskInputChange}
        placeholder="Task deadline..."
      />
      <button onClick={handleCreateTask}>Create New Task</button>
    </div>
  );
};

export default CreateTask;

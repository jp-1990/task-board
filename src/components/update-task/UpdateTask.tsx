import React, { useState } from "react";
import { editTask } from "../../app/appSlice";
import { useDispatch } from "../../app/hooks";
import { apiQueries } from "../../utils";
import { TaskType } from "../../types";

import styles from "./UpdateTask.module.css";

const { updateTask } = apiQueries;

type Task = Pick<
  TaskType,
  "name" | "deadline" | "description" | "task_id" | "list_id"
>;
interface Props extends Task {
  setShowUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 *
 * @param {Props} props - {@link Props}
 *
 * @description Component to accept user input and update the name, description and deadline of a task. Uses redux store and fires apiQuery.updateTask to perform update.
 */
const UpdateTask: React.FC<Props> = ({
  name,
  description,
  deadline,
  list_id,
  task_id,
  setShowUpdate,
}) => {
  const [task, setTask] = useState<Omit<Task, "task_id" | "list_id">>({
    name,
    description,
    deadline,
  });
  const dispatch = useDispatch();

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleUpdateTask = async () => {
    const { name, description, deadline } = task;
    if (!name || !description || !deadline) return;
    try {
      const deadlineAsString = new Date(task.deadline).toISOString();
      await updateTask({ ...task, task_id, deadline: deadlineAsString });
      dispatch(editTask({ ...task, task_id, list_id }));
      setShowUpdate(false);
    } catch (err) {
      console.error(`updateTask failed: ${err}`);
    }
  };
  const stopBubbling = (e: any) => e.stopPropagation();
  return (
    <div onClick={stopBubbling} className={styles.container}>
      <span>Update Task:</span>
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
      <button onClick={handleUpdateTask}>Update Task</button>
    </div>
  );
};

export default UpdateTask;

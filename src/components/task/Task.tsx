import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch } from "../../app/hooks";
import { TaskType } from "../../types";
import { toggle } from "../../utils";
import { UpdateTask } from "../update-task";
import { apiQueries } from "../../utils";
import { editTask, removeTask } from "../../app/appSlice";
import styles from "./Task.module.css";

const isBeingDragged = (task: TaskType, selectedTasks: TaskType[]) =>
  !!selectedTasks.find(({ task_id }) => task_id === task.task_id);

interface Props {
  task: TaskType;
  tasks: TaskType[];
  index: number;
  selected: TaskType[];
  setSelected: React.Dispatch<React.SetStateAction<TaskType[]>>;
  dragging: boolean;
}
/**
 *
 * @param {Props} props - {@link Props}
 * @returns Component to display task details and provide functionality to the user to move, update, delete and mark a task as complete.
 */
const Task: React.FC<Props> = ({
  task,
  tasks,
  index,
  selected,
  setSelected,
  dragging,
}) => {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const { task_id, list_id, name, description, deadline, completed } = task;

  const { deleteTask, completeTask } = apiQueries;
  const dispatch = useDispatch();

  const handleSelectTask: React.MouseEventHandler<HTMLLIElement> = (e) => {
    if (e.ctrlKey || e.metaKey) {
      toggle.groupSelection(task, selected, setSelected);
    } else if (e.shiftKey) {
      toggle.rangeSelection(task, tasks, selected, setSelected);
    } else {
      toggle.singleSelection(task, selected, setSelected);
    }
  };

  const handleCompleteTask = async (e: any) => {
    try {
      e.stopPropagation();
      await completeTask({ id: task_id, boolean: !completed });
      dispatch(editTask({ task_id, list_id, completed: !completed }));
    } catch (err) {
      console.error(`handleCompleteTask failed: ${err}`);
    }
  };

  const handleDeleteTask = async (e: any) => {
    try {
      e.stopPropagation();
      for (const task of selected) {
        await deleteTask({ id: task.task_id });
        dispatch(removeTask({ task_id: task.task_id, list_id: task.list_id }));
      }
    } catch (err) {
      console.error(`handleDeleteTask failed: ${err}`);
    }
  };

  const toggleShowUpdateForm = (e: any) => {
    e.stopPropagation();
    setShowUpdate((prev) => !prev);
  };

  // determine style classNames
  const completedStyles = completed ? styles.completed : "";
  const selectedStyles = selected?.find((el) => el.task_id === task_id)
    ? `${styles.selected}`
    : "";
  const draggingStyles =
    dragging && isBeingDragged(task, selected) ? `${styles.dragging}` : "";

  return (
    <Draggable
      key={task_id}
      draggableId={`${task_id}`}
      index={index}
      isDragDisabled={!isBeingDragged(task, selected)}
    >
      {(provided) => (
        <li
          onClick={handleSelectTask}
          className={`${styles.task} ${completedStyles} ${selectedStyles} ${draggingStyles}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3>{name}</h3>
          <h6>{new Date(deadline).toLocaleString()}</h6>
          <span>{description}</span>
          {!showUpdate && (
            <button onClick={toggleShowUpdateForm}>Show Update Form</button>
          )}
          {showUpdate && (
            <>
              <UpdateTask
                task_id={task_id}
                list_id={list_id}
                name={name}
                description={description}
                deadline={deadline}
                setShowUpdate={setShowUpdate}
              />
              <button onClick={toggleShowUpdateForm}>Hide Update Form</button>
            </>
          )}
          <div className={styles.buttonDiv}>
            <button onClick={handleDeleteTask}>Delete</button>
            <button onClick={handleCompleteTask}>Mark As Complete</button>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default Task;

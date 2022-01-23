import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { TaskType } from "../../types";
import { toggle } from "../../utils";
import styles from "./Task.module.css";

const isBeingDragged = (task: TaskType, selectedTasks: TaskType[]) =>
  !!selectedTasks.find(({ id }) => id === task.id);

interface TaskProps {
  task: TaskType;
  tasks: TaskType[];
  index: number;
  selected: TaskType[];
  setSelected: React.Dispatch<React.SetStateAction<TaskType[]>>;
  dragging: boolean;
}
const Task: React.FC<TaskProps> = ({
  task,
  tasks,
  index,
  selected,
  setSelected,
  dragging,
}) => {
  const { id, name, description, deadline } = task;

  const handleOnClick: React.MouseEventHandler<HTMLLIElement> = (e) => {
    if (e.ctrlKey || e.metaKey) {
      toggle.groupSelection(task, selected, setSelected);
    } else if (e.shiftKey) {
      toggle.rangeSelection(task, tasks, selected, setSelected);
    } else {
      toggle.singleSelection(task, selected, setSelected);
    }
  };

  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={!isBeingDragged(task, selected)}
    >
      {(provided) => (
        <li
          onClick={handleOnClick}
          className={`${styles.task} ${
            selected?.find((el) => el.id === id) ? `${styles.selected}` : ""
          } ${
            dragging && isBeingDragged(task, selected)
              ? `${styles.dragging}`
              : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3>{name}</h3>
          <h6>{deadline.toISOString()}</h6>
          <span>{description}</span>
        </li>
      )}
    </Draggable>
  );
};

export default Task;

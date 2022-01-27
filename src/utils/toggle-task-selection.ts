import { TaskType } from "../types";

/**
 *
 * @param task - target task
 * @param state - currently selected tasks state
 * @param setState - React state update function to set currently selected task state
 *
 * @description Toggle a single task into and out of the selected tasks array. Used for un-modified single click selection.
 */
const toggleSingleSelection = (
  task: TaskType,
  state: TaskType[],
  setState: React.Dispatch<React.SetStateAction<TaskType[]>>
) => {
  const { task_id } = task;
  if (state?.find((el) => el.task_id === task_id) && state.length === 1) {
    setState((prev) => prev?.filter((el) => el.task_id !== task_id));
  } else {
    setState([{ ...task }]);
  }
};

/**
 *
 * @param task - target task
 * @param state - currently selected tasks state
 * @param setState - React state update function to set currently selected task state
 *
 * @description Toggle a single task into and out of the selected tasks array, but retain any other tasks in the array. Used for Ctrl/Cmd click selection, where the aim is to select multiple items.
 */
const toggleGroupSelection = (
  task: TaskType,
  state: TaskType[],
  setState: React.Dispatch<React.SetStateAction<TaskType[]>>
) => {
  const { task_id } = task;
  if (state?.find((el) => el.task_id === task_id)) {
    setState((prev) => prev?.filter((el) => el.task_id !== task_id));
  } else {
    setState((prev) => [...prev, { ...task }]);
  }
};

/**
 *
 * @param task - target task
 * @param tasks - all tasks in the target list
 * @param state - currently selected tasks state
 * @param setState - React state update function to set currently selected task state
 *
 * @description Toggle multiple tasks into and out of the selected tasks array. Add or remove other tasks based on the start or end index of the target item compared to any existing tasks in state. Used for shift click selection, where the aim is to select multiple items over a range of indexes.
 */
const toggleRangeSelection = (
  task: TaskType,
  tasks: TaskType[],
  state: TaskType[],
  setState: React.Dispatch<React.SetStateAction<TaskType[]>>
) => {
  if (!state.length) {
    setState([{ ...task }]);
    return;
  }

  let startIndex: number;
  let endIndex: number;
  const tasksToSelect = tasks.reduce((output, current, i) => {
    if (endIndex !== undefined && startIndex === undefined) {
      startIndex = Number(state[state.length - 1].index);
    } else if (state[0].index === current.index && startIndex === undefined)
      startIndex = i;
    if (task.index === current.index) endIndex = i;

    if (i >= startIndex && (endIndex === undefined || i <= endIndex)) {
      output.push(current);
    } else if (i >= endIndex && (startIndex === undefined || i <= startIndex)) {
      output.push(current);
    }

    return output;
  }, [] as TaskType[]);
  setState([...tasksToSelect]);
};

const clearSelection = (
  setState: React.Dispatch<React.SetStateAction<TaskType[]>>
) => {
  setState([]);
};

export const toggle = {
  clearSelection,
  singleSelection: toggleSingleSelection,
  groupSelection: toggleGroupSelection,
  rangeSelection: toggleRangeSelection,
};

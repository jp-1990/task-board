import { TaskType } from "../types";

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

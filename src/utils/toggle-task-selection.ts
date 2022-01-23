import { TaskType } from "../types";

const toggleSingleSelection = (
  task: TaskType,
  state: TaskType[],
  setState: React.Dispatch<React.SetStateAction<TaskType[]>>
) => {
  const { id } = task;
  if (state?.find((el) => el.id === id) && state.length === 1) {
    setState((prev) => prev?.filter((el) => el.id !== id));
  } else {
    setState([{ ...task }]);
  }
};

const toggleGroupSelection = (
  task: TaskType,
  state: TaskType[],
  setState: React.Dispatch<React.SetStateAction<TaskType[]>>
) => {
  const { id } = task;
  if (state?.find((el) => el.id === id)) {
    setState((prev) => prev?.filter((el) => el.id !== id));
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
  const tasksToSelect = tasks.reduce((output, current, index) => {
    if (endIndex !== undefined && startIndex === undefined) {
      startIndex = Number(state[state.length - 1].id);
    } else if (state[0].id === current.id && startIndex === undefined)
      startIndex = index;
    if (task.id === current.id) endIndex = index;

    if (index >= startIndex && (endIndex === undefined || index <= endIndex)) {
      output.push(current);
    } else if (
      index >= endIndex &&
      (startIndex === undefined || index <= startIndex)
    ) {
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

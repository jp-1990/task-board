import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListType, MoveTasksArgs, TaskType } from "../types";
import { apiQueries } from "../utils";

const { updateTaskIndex } = apiQueries;

interface AppState {
  value: ListType[];
}

const initialState: AppState = {
  value: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // add a new list to state if that list is not already present
    addList: (state, action: PayloadAction<ListType>) => {
      if (
        !state.value.find(({ list_id }) => list_id === action.payload.list_id)
      )
        state.value = [...state.value, action.payload];
    },

    // remove list from state by list_id
    removeList: (state, action: PayloadAction<number>) => {
      const newState = state.value.filter(
        ({ list_id }) => list_id !== action.payload
      );
      state.value = newState;
    },

    // add a new task to the appropriate list in state by list_id
    addTask: (state, action: PayloadAction<TaskType>) => {
      const listIndex = state.value.findIndex((list) => {
        return list.list_id === +action.payload.list_id;
      });

      if (listIndex === -1)
        throw new Error("addTask failed: list index cannot be found");
      state.value[listIndex].tasks.splice(
        action.payload.index,
        0,
        action.payload
      );
    },

    editTask: (
      state,
      action: PayloadAction<
        Partial<Omit<TaskType, "type" | "index">> & {
          list_id: number;
          task_id: number;
        }
      >
    ) => {
      const listIndex = state.value.findIndex((list) => {
        return list.list_id === +action.payload.list_id;
      });

      if (listIndex === -1)
        throw new Error("editTask failed: list index cannot be found");
      const taskIndex = state.value[listIndex].tasks.findIndex(
        (task) => task.task_id === action.payload.task_id
      );
      state.value[listIndex].tasks[taskIndex] = {
        ...state.value[listIndex].tasks[taskIndex],
        ...action.payload,
      };
    },

    removeTask: (
      state,
      action: PayloadAction<{
        list_id: number;
        task_id: number;
      }>
    ) => {
      const listIndex = state.value.findIndex((list) => {
        return list.list_id === +action.payload.list_id;
      });

      if (listIndex === -1)
        throw new Error("deleteTask failed: list index cannot be found");

      state.value[listIndex].tasks = state.value[listIndex].tasks.filter(
        (task) => task.task_id !== action.payload.task_id
      );
    },

    // based on the source and desination ids and indexs, slice tasks between lists
    moveTasks: (state, action: PayloadAction<MoveTasksArgs>) => {
      const { source, destination, tasks } = action.payload;

      const reorderedItems: TaskType[] = [];
      const sourceListIndex = state.value.findIndex(
        ({ list_id }) => `${list_id}` === source.id
      );
      tasks.forEach(async (task, i) => {
        const taskIndex = state.value[sourceListIndex].tasks.findIndex(
          ({ task_id }) => task_id === task.task_id
        );
        const [reorderedItem] = state.value[sourceListIndex].tasks.splice(
          taskIndex,
          1
        );
        reorderedItems.push(reorderedItem);
      });

      let destinationIndex = destination.index;
      if (destination.index > source.index && destination.id === source.id)
        destinationIndex = destination.index - (reorderedItems.length - 1);

      const destinationListIndex = state.value.findIndex(
        ({ list_id }) => `${list_id}` === destination.id
      );
      state.value[destinationListIndex].tasks.splice(
        destinationIndex,
        0,
        ...reorderedItems
      );

      state.value[destinationListIndex].tasks.forEach((task, index) => {
        updateTaskIndex({
          id: task.task_id,
          list_id: +destination.id,
          index,
        });
      });
      if (destinationListIndex !== sourceListIndex) {
        state.value[sourceListIndex].tasks.forEach((task, index) => {
          updateTaskIndex({
            id: task.task_id,
            list_id: +source.id,
            index,
          });
        });
      }
    },
  },
});

export const { addList, addTask, editTask, removeTask, moveTasks, removeList } =
  appSlice.actions;
export default appSlice.reducer;

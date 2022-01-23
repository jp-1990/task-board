import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListType, MoveTasksArgs, TaskType } from "../../types";

interface ListsState {
  value: ListType[];
}

const initialState: ListsState = {
  value: [],
};

export const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<ListType>) => {
      if (!state.value.find(({ id }) => id === action.payload.id))
        state.value = [...state.value, action.payload];
    },
    removeList: (state, action: PayloadAction<string>) => {
      state.value.filter(({ id }) => id !== action.payload);
    },
    moveTasks: (state, action: PayloadAction<MoveTasksArgs>) => {
      const { source, destination, tasks } = action.payload;

      const reorderedItems: TaskType[] = [];
      tasks.forEach((task) => {
        const sourceListIndex = state.value.findIndex(
          ({ id }) => id === source.id
        );
        const taskIndex = state.value[sourceListIndex].tasks.findIndex(
          ({ id }) => id === task.id
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
        ({ id }) => id === destination.id
      );
      state.value[destinationListIndex].tasks.splice(
        destinationIndex,
        0,
        ...reorderedItems
      );
    },
  },
});

export const { addList, moveTasks, removeList } = listsSlice.actions;
export default listsSlice.reducer;

import axios from "axios";
import { TaskType } from "../types";

interface CreateList {
  name: string;
}
interface DeleteList {
  id: number;
}
type CreateTask = Omit<TaskType, "task_id" | "type" | "completed" | "overdue">;
type UpdateTask = Omit<
  TaskType,
  "type" | "completed" | "overdue" | "index" | "list_id"
>;
type UpdateTaskIndex = {
  id: number;
  index: number;
  list_id: number;
};
type DeleteTask = {
  id: number;
};
type CompleteTask = {
  id: number;
  boolean: boolean;
};

class ApiQueries {
  // get all items
  getAllItems = async () => {
    try {
      const result = await axios({
        method: "get",
        url: "https://task-board-api.azurewebsites.net/v1/get-all-items",
      });
      return result.data;
    } catch (err) {
      console.error(`getAllItems failed: ${err}`);
    }
  };

  // LISTS
  // create list
  createList = async ({ name }: CreateList) => {
    try {
      const result = await axios({
        method: "post",
        url: "https://task-board-api.azurewebsites.net//v1/create-one-list/",
        data: {
          name,
        },
      });
      return result.data;
    } catch (err) {
      console.error(`createList failed: ${err}`);
    }
  };

  // delete list
  deleteList = async ({ id }: DeleteList) => {
    try {
      const result = await axios({
        method: "post",
        url: "https://task-board-api.azurewebsites.net//v1/delete-one-list/",
        data: {
          id,
        },
      });
      return result.data;
    } catch (err) {
      console.error(`deleteList failed: ${err}`);
    }
  };

  // TASKS
  // create task
  createTask = async ({
    name,
    deadline,
    description,
    index,
    list_id,
  }: CreateTask) => {
    try {
      const result = await axios({
        method: "post",
        url: "https://task-board-api.azurewebsites.net/v1/create-one-task/",
        data: {
          name,
          description,
          deadline,
          index,
          list_id,
        },
      });
      return result.data;
    } catch (err) {
      console.error(`createTask failed: ${err}`);
    }
  };

  // update task
  updateTask = async ({ task_id, name, deadline, description }: UpdateTask) => {
    try {
      const result = await axios({
        method: "patch",
        url: "https://task-board-api.azurewebsites.net/v1/update-one-task/",
        data: {
          id: task_id,
          name,
          description,
          deadline,
        },
      });
      return result.data;
    } catch (err) {
      console.error(`updateTask failed: ${err}`);
    }
  };

  // update task index
  updateTaskIndex = async ({ id, index, list_id }: UpdateTaskIndex) => {
    try {
      const result = await axios({
        method: "patch",
        url: "https://task-board-api.azurewebsites.net/v1/update-task-index/",
        data: {
          id,
          index,
          list_id,
        },
      });
      return result.data;
    } catch (err) {
      console.error(`updateTask failed: ${err}`);
    }
  };

  // delete task
  deleteTask = async ({ id }: DeleteTask) => {
    try {
      const result = await axios({
        method: "post",
        url: "https://task-board-api.azurewebsites.net/v1/delete-one-task/",
        data: {
          id,
        },
      });
      return result.data;
    } catch (err) {
      console.error(`deleteTask failed: ${err}`);
    }
  };

  // complete task
  completeTask = async ({ id, boolean }: CompleteTask) => {
    try {
      const result = await axios({
        method: "patch",
        url: "https://task-board-api.azurewebsites.net/v1/complete-one-task/",
        data: {
          id,
          boolean,
        },
      });
      console.log(
        `task ${id} marked as ${boolean ? "complete" : "incomplete"}`
      );
      return result.data;
    } catch (err) {
      console.error(`updateTask failed: ${err}`);
    }
  };

  // overdue task
  overdueTask = async ({ id }: CompleteTask) => {
    try {
      const result = await axios({
        method: "patch",
        url: "https://task-board-api.azurewebsites.net/v1/overdue-one-task/",
        data: {
          id,
        },
      });
      console.log(`task ${id} is overdue!`);
      return result.data;
    } catch (err) {
      console.error(`updateTask failed: ${err}`);
    }
  };
}

export const apiQueries = new ApiQueries();

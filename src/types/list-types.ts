import TaskType from "./task-types";

export interface ListType {
  list_id: number;
  name: string;
  type: "list";
  tasks: TaskType[];
}

export interface MoveTasksArgs {
  source: { id: string; index: number };
  destination: { id: string; index: number };
  tasks: TaskType[];
}

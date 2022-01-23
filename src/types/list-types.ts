import TaskType from "./task-types";

export interface ListType {
  id: string;
  name: string;
  tasks: TaskType[];
}

export interface MoveTasksArgs {
  source: { id: string; index: number };
  destination: { id: string; index: number };
  tasks: TaskType[];
}

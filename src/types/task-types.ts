interface TaskType {
  task_id: number;
  list_id: number;
  name: string;
  description: string;
  deadline: string;
  completed: boolean;
  overdue: boolean;
  index: number;
  type: "task";
}
export default TaskType;

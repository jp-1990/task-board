import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { List, Task } from "./components";
import { TaskType } from "./types";
import "./App.css";

const tasks = Array.from(Array(6)).map((el, i) => {
  return {
    id: `${i}`,
    name: `task-${i}`,
    description: `Description from task ${i}`,
    deadline: new Date(Date.now()),
  };
});
// const tasks2 = Array.from(Array(6)).map((el, i) => {
//   return {
//     id: `${i + 6}`,
//     name: `task-${i + 6}`,
//     description: `Description from task ${i + 6}`,
//     deadline: new Date(Date.now()),
//   };
// });

function App() {
  // const [list, setList] = useState<Record<string, TaskType[]>>({
  //   list0: tasks,
  //   list1: tasks2,
  // });
  const [list, setList] = useState<TaskType[]>(tasks);

  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleOnDragStart = () => setDragging(true);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(list || []);
    const reorderedItems: TaskType[] = [];
    selectedTasks.forEach((task) => {
      const targetIndex = items.findIndex(({ id }) => id === task.id);
      const [reorderedItem] = items.splice(targetIndex, 1);
      reorderedItems.push(reorderedItem);
    });

    let destinationIndex = result.destination.index;
    if (result.destination.index > result.source.index)
      destinationIndex = result.destination.index - (reorderedItems.length - 1);

    items.splice(destinationIndex, 0, ...reorderedItems);

    setList(items);
    setDragging(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Task Board</h3>
      </header>
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={handleOnDragStart}
      >
        <div className="List-container">
          <List name="list test">
            {list?.map((task, index) => (
              <Task
                key={task.id}
                index={index}
                task={task}
                tasks={list}
                selected={selectedTasks}
                setSelected={setSelectedTasks}
                dragging={dragging}
              />
            ))}
          </List>
          {/* <List name="list test2">
            {tasks2?.map((task, index) => (
              <Task
                key={task.id}
                index={index}
                task={task}
                tasks={tasks}
                selected={selectedTasks}
                setSelected={setSelectedTasks}
                dragging={dragging}
              />
            ))}
          </List> */}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;

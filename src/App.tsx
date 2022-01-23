import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { useSelector, useDispatch } from "./app/hooks";
import { addList, moveTasks, removeList } from "./components/list/listSlice";

import { List, Task } from "./components";
import { TaskType } from "./types";
import "./App.css";

const tasks = Array.from(Array(6)).map((el, i) => {
  return {
    id: `${i}`,
    name: `task-${i}`,
    description: `Description from task ${i}`,
    deadline: new Date(Date.now()).toISOString(),
  };
});
const tasks2 = Array.from(Array(6)).map((el, i) => {
  return {
    id: `${i + 6}`,
    name: `task-${i + 6}`,
    description: `Description from task ${i + 6}`,
    deadline: new Date(Date.now()).toISOString(),
  };
});

function App() {
  const lists = useSelector((state) => state.lists.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!lists.length) {
      dispatch(addList({ id: "0", name: "list-0", tasks }));
      dispatch(addList({ id: "1", name: "list-1", tasks: tasks2 }));
    }
  });

  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleOnDragStart = () => setDragging(true);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    dispatch(
      moveTasks({
        source: { id: result.source.droppableId, index: result.source.index },
        destination: {
          id: result.destination.droppableId,
          index: result.destination.index,
        },
        tasks: selectedTasks,
      })
    );
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
          {lists.map((list) => (
            <List key={list.id} name={list.name} id={list.id}>
              {list.tasks?.map((task, index) => (
                <Task
                  key={task.id}
                  index={index}
                  task={task}
                  tasks={list.tasks}
                  selected={selectedTasks}
                  setSelected={setSelectedTasks}
                  dragging={dragging}
                />
              ))}
            </List>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;

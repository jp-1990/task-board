import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { useSelector, useDispatch } from "./app/hooks";
import { addList, addTask, moveTasks } from "./app/appSlice";

import { List, Task } from "./components";
import { apiQueries } from "./utils";
import { TaskType } from "./types";
import "./App.css";

function App() {
  const [listName, setListName] = useState<string>("");
  const lists = useSelector((state) => state.lists.value);
  const dispatch = useDispatch();
  const { getAllItems, createList } = apiQueries;

  // entry point for data (query all items)
  useEffect(() => {
    const getData = async () => await getAllItems();
    getData().then((data) => {
      data.tasks.sort(
        (a: { index: number }, b: { index: number }) => +a.index - +b.index
      );

      for (const list of data.lists) {
        dispatch(
          addList({
            list_id: list.list_id,
            name: list.name,
            tasks: [],
            type: list.type,
          })
        );
      }
      for (const task of data.tasks) {
        if (task.overdue) console.log(`task ${task.task_id} is overdue!`);

        dispatch(addTask(task));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleListNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setListName(event.target.value);
  const handleCreateList = async () => {
    const newList = await createList({ name: listName });
    dispatch(
      addList({
        list_id: newList[0].list_id,
        name: listName,
        type: "list",
        tasks: [],
      })
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Task Board</h3>
        <div className="create-list-container">
          <span>New List:</span>
          <input
            value={listName}
            onChange={handleListNameInputChange}
            placeholder="List name..."
          ></input>
          <button onClick={handleCreateList}>Create New List</button>
        </div>
      </header>
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={handleOnDragStart}
      >
        <div className="List-container">
          {lists.map((list) => (
            <List
              key={list.list_id}
              name={list.name}
              id={list.list_id}
              length={list.tasks.length}
            >
              {list.tasks?.map((task, index) => (
                <Task
                  key={task.task_id}
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

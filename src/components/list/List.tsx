import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styles from "./List.module.css";
import { removeList } from "../../app/appSlice";
import { useDispatch } from "../../app/hooks";
import { apiQueries } from "../../utils";
import { CreateTask } from "../create-task";

interface ListProps {
  name: string;
  length: number;
  id: number;
}
const List: React.FC<ListProps> = ({ name, id, length, children }) => {
  const dispatch = useDispatch();
  const { deleteList } = apiQueries;

  const handleDeleteList = async () => {
    dispatch(removeList(id));
    await deleteList({ id });
  };
  return (
    <Droppable droppableId={`${id}`}>
      {(provided) => (
        <section className={styles.list}>
          <h2>{name}</h2>

          <CreateTask list_id={id} nextIndex={length} />
          <ul
            className="list-droppable"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children}
            {provided.placeholder}
          </ul>
          <button onClick={handleDeleteList}>Delete List</button>
        </section>
      )}
    </Droppable>
  );
};

export default List;

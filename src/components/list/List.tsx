import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styles from "./List.module.css";
import { removeList } from "../../app/appSlice";
import { useDispatch } from "../../app/hooks";
import { apiQueries } from "../../utils";
import { CreateTask } from "../create-task";

const { deleteList } = apiQueries;

interface Props {
  name: string;
  length: number;
  id: number;
}
/**
 *
 * @param {Props} props - {@link Props}
 * @description Component to provide a container within which Task components should be displayed. Acts as a droppable container, allowing tasks to be moved around within a List, and between Lists. Also provides the user the functionality to delete a list and all tasks related to it.
 */
const List: React.FC<Props> = ({ name, id, length, children }) => {
  const dispatch = useDispatch();

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

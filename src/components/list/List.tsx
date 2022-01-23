import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styles from "./List.module.css";

interface ListProps {
  name: string;
  id: string;
}
const List: React.FC<ListProps> = ({ name, id, children }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <section className={styles.list}>
          <h2>{name}</h2>
          <ul
            className="list-droppable"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children}
            {provided.placeholder}
          </ul>
        </section>
      )}
    </Droppable>
  );
};

export default List;

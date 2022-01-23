import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styles from "./List.module.css";

interface ListProps {
  name: string;
}
const List: React.FC<ListProps> = ({ name, children }) => {
  return (
    <Droppable droppableId={name}>
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

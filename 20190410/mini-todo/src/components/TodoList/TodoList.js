import React, {Component} from 'react';
import TodoItem from "../TodoItem";
import './TodoList.scss';

class TodoList extends Component {
    render() {
        const {
            todoList,
            onToggle,
            onRemove
        } = this.props;
        const renderedList = todoList.map(todo =>
            <TodoItem
                key={todo.id}
                task={todo.task}
                date={todo.date}
                onToggle={() => {
                    onToggle(todo.id);
                }}
                onRemove={() => {
                    onRemove(todo.id);
                }}
                finished={todo.finished}
            />
        );

        return (
            <div className={"todo-list"}>
                {renderedList}
            </div>
        );
    }
}

export default TodoList;

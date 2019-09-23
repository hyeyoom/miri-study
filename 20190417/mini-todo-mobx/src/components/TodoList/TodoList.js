import React, {Component} from 'react';
import TodoItem from "../TodoItem";
import './TodoList.scss';
import { inject, observer } from 'mobx-react';

@inject('TodoStore')
@observer
class TodoList extends Component {
    render() {
        const TodoStore = this.props.TodoStore;
        const renderedList = TodoStore.todoList.map(todo =>
            <TodoItem
                key={todo.id}
                task={todo.task}
                date={todo.date}
                onToggle={() => {
                    todo.finished = !todo.finished;
                    TodoStore.update(todo);
                }}
                onRemove={() => {
                    TodoStore.remove(todo);
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

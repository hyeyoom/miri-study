import React from 'react';
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import './TodoAppMain.scss';

const TodoAppMain = () => {
    return (
        <div className={"todo-app-main"}>
            <h1>mini-todo</h1>
            <TodoInput/>
            <TodoList/>
        </div>
    );
};

export default TodoAppMain;
import React, {Component} from 'react';
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";
import './TodoAppMain.scss';

const testData = new Array(100).fill(0).map(
    (_, i) => ({id: Math.random(), task: `test-${i}`, finished: false, date: `${new Date()}`})
);

class TodoAppMain extends Component {

    state = {
        value: '',
        todoList: testData
    };

    handleInputChange = value => {
        this.setState({
            value: value
        });
    };

    handleInsert = () => {
        const {todoList} = this.state;

        const newTodo = {
            id: Math.random(),
            task: this.state.value,
            date: `${new Date()}`,
            finished: false
        };

        this.setState({
            value: '',
            todoList: [...todoList, newTodo]
        });
    };

    handleToggle = id => {
        const {todoList} = this.state;
        const idx = this.state.todoList.findIndex(todo => todo.id === id);
        todoList[idx].finished = !todoList[idx].finished;

        this.setState({
            todoList: todoList
        });
    };

    handleRemove = id => {
        const {todoList} = this.state;
        const idx = this.state.todoList.findIndex(todo => todo.id === id);
        this.setState({todoList: [...todoList.slice(0, idx), ...todoList.slice(idx + 1, todoList.length)]})
    };

    render() {
        return (
            <div className={"todo-app-main"}>
                <h1>mini-todo</h1>
                <TodoInput
                    value={this.state.value}
                    onChange={this.handleInputChange}
                    onInsert={this.handleInsert}/>
                <TodoList
                    todoList={this.state.todoList}
                    onToggle={this.handleToggle}
                    onRemove={this.handleRemove}/>
            </div>
        );
    }
}

export default TodoAppMain;
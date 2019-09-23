import React, {Component} from 'react';
import './TodoInput.scss';
import { inject } from 'mobx-react';

@inject('TodoStore')
class TodoInput extends Component {

    TodoStore = this.props.TodoStore;

    refInput = React.createRef();

    handleKeyPress = (e) => {
        const {key} = e;
        if (this.refInput.current.value && key.toUpperCase() === 'ENTER') {
            this.insert()
        }
    };

    insert = () => {
        this.TodoStore.add(this.refInput.current.value);
        this.refInput.current.value = '';
    };

    render() {
        return (
            <div className={"todo-input"}>
                <input ref={this.refInput} onKeyPress={e => this.handleKeyPress(e)}/>
                <button onClick={this.insert}>add</button>
            </div>
        );
    }
}

export default TodoInput;
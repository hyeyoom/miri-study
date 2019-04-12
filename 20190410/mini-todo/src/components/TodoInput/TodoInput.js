import React from 'react';
import './TodoInput.scss'

const TodoInput = ({value, onChange, onInsert}) => {
    const handleKeyPress = (e) => {
        const {key} = e;
        if (key.toUpperCase() === 'ENTER') {
            onInsert();
        }
    };

    return (
        <div className={"todo-input"}>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyPress={e => handleKeyPress(e)}
            />
            <button
                onClick={() => {
                    onInsert();
                }}
            >add</button>
        </div>
    );
};

export default TodoInput;

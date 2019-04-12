import React from 'react';
import styles from './TodoItem.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const TodoItem = ({task, date, finished, onToggle, onRemove}) => {
    return (
        <div className={cx('todo-item', {finished})} onClick={e => {
            onToggle();
            e.stopPropagation();
        }}>
            <div className={'task'}>{task}</div>
            <div className={'date'}>{date}</div>
            <div className={'remove'} onClick={e => {
                onRemove();
                e.stopPropagation();
            }}>remove</div>
        </div>
    );
};

export default TodoItem;

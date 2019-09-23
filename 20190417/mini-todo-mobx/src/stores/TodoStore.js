import { observable, action, computed } from 'mobx';

/*
const testData = new Array(500).fill(0).map((_, i) =>
    ({id: Math.random(), task: `task-${i + 1}`, finished: false, date: `${new Date()}`})
);
*/

class TodoStore {

    @observable todoList = [];

    @action add = value => {
        if (!value) {
            return;
        }

        this.todoList.push({
            id: Math.random(),
            task: value,
            finished: false,
            date: `${new Date()}`
        });
    };

    @action update = todo => {
        const idx = this.todoList.findIndex(v => v.id === todo.id);
        if (idx === -1) {
            return;
        }
        this.todoList[idx] = todo;
    };

    @action remove = todo => {
        const idx = this.todoList.findIndex(v => v.id === todo.id);
        if (idx === -1) {
            return;
        }
        this.todoList = [
            ...this.todoList.slice(0, idx),
            ...this.todoList.slice(idx + 1, this.listSize)
        ]
    };

    @computed get remainingTasks() {
        return this.todoList.filter(todo => !todo.finished).length;
    }

    @computed get listSize() {
        return this.todoList.length;
    }
}

const store = new TodoStore();
export default store;
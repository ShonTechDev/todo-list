import { useRef } from 'react'; //imports the useRef hook; helps this file receive the TodoForm as a prop

function TodoForm({ onAddTodo }) {
    const inputRef = useRef();

    const handleAddTodo = (event) => {
        event.preventDefault(); //stops the form from refreshing the page

        const todoTitle = event.target.todoTitle.value.trim(); //.trim() blocks whitespace-only todos
        
        if (todoTitle && todoTitle !== "") {
            onAddTodo(todoTitle); //sends the text back up to App
            event.target.reset();
            inputRef.current.focus(); //puts the cursor back in the input
        }
    };

    return (
    <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder={'Todo text'}
        required
        />
        <button type="submit">  {/*//used instead of onclick, it didn't work */}
        Add Todo
        </button>
    </form>
    );
}

export default TodoForm;




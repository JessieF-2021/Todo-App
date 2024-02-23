import { useEffect, useState } from "react";
import AllTodos from "./components/AllTodos";
import Styles from "./App.module.css";

export default function App() {
  const [task, setTask] = useState("");
  const [alltodos, setAlltodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}`);

        const results = await response.json();
        //console.log("results", results);
        if (results) {
          setAlltodos(results);
        }
        //setTask('');
      } catch (error) {
        //error handling
        setHasError(true);
        setErrorMessage(error.message);
        console.log("err", error.message);
      }
    };

    fetchData();
  }, [loading]);

  
  async function handleUpdate(id) {
    try {
      setLoading(true);
      const request = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      setLoading(false);
      //console.log(response);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

 

  async function handleDelete(id) {
    try {
      setLoading(true);
      const request = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      setLoading(false);
      //console.log(response);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    const todo = {
      chore: task,
    };

    try {
      setLoading(true);
      const request = await fetch(`${import.meta.env.VITE_API_URL}`, {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTask("");

      const response = await request.json();
      setLoading(false);
      console.log(response);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  


  //error handling message to frontend
  if (hasError) {
    return (
      <div style={{ fontSize: "2rem", color: "red", textAlign: "center" }}>
        Oops! something went wrong...
        {errorMessage}
      </div>
    );
  }

  return (
    <div className={Styles.app}>
      <form onSubmit={addTodo}>
        <label htmlFor="task" className={Styles.label}>
          Create a task
        </label>
        {""}
        <br />
        <input
          type="text"
          name=""
          id="task"
          placeholder="add a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button style={{ marginLeft: "1rem" }}>Add Task</button>
      </form>

      {loading ? (
        <div style={{ fontSize: "2rem", color: "black" }}>loading...</div>
      ) : alltodos.length > 0 ? (
        <AllTodos
          alltodos={alltodos}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />
      ) : (
        <p>no task to acomplish now, you can add one above</p>
      )}
    </div>
  );
}

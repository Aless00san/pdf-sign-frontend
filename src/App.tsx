import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="content">
        <div className="card">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="button is-info"
          >
            count is {count}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="text-3xl font-bold underline">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <Button>Button</Button>;
      </div>
    </>
  );
}

export default App;

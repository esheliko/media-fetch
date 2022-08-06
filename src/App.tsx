import { KeyboardEvent, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";


import { autocomplete as fetchAutocomplete } from "./actions";
import { highlight } from "./utils";

import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const autocomplete = useQuery(
    ["autocomplete", userInput],
    () => fetchAutocomplete(userInput),
    { keepPreviousData: true }
  );

  return (
    <div data-tauri-drag-region id="App" className="App">
      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      {autocomplete?.data?.map((item) => (
        <div key={item}>{highlight(item, userInput)}</div>
      ))}
    </div>
  );
}

export default App;

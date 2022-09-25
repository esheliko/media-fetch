import { KeyboardEvent, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { appWindow, LogicalSize } from "@tauri-apps/api/window";

import { autocomplete as fetchAutocomplete } from "./actions";
import { useSizeChange } from "./hooks";
import { highlight } from "./utils";

import "./App.css";

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  const [userInput, setUserInput] = useState("");
  const autocomplete = useQuery(
    ["autocomplete", userInput.toLowerCase()],
    () => fetchAutocomplete(userInput),
    { keepPreviousData: true }
  );

  useSizeChange(
    appRef,
    "App",
    (width, height) => {
      if (width && height) {
        appWindow.setSize(new LogicalSize(width, height));
      }
    },
    [JSON.stringify(autocomplete.data || {})]
  );

  return (
    <div data-tauri-drag-region id="App" className="App" ref={appRef}>
      <div className="search-box">
        <input
          dir="auto"
          autoFocus={true}
          placeholder="Search media..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      {autocomplete?.data?.map((item) => (
        <div key={item}>{highlight(item, userInput)}</div>
      ))}
    </div>
  );
}

export default App;

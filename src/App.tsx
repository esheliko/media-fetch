import { KeyboardEvent, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classnames from "classnames";

// imports autocomplete from "./actions/autocomplete";
// imports youtubeSearch from "./actions/youtubeSearch";
import { useSizeChange } from "./hooks";
import { highlight } from "./utils";

import SearchResult from "./components/SearchResult";

import "./App.css";

const APP_ID = "App";

// const unlisten = await appWindow.onFocusChanged(({ payload: focused }) => {
//   if (!focused) {
//     appWindow.close();
//   }
// });

const fetchAutocomplete = async (input: string) =>
  (await import("./actions/autocomplete")).default(input);
const searchYoutube = async (input: string) =>
  (await import("./actions/youtubeSearch")).default(input);
const searchSpotify = async (input: string) =>
  (await import("./actions/spotifySearch")).default(input);

function App() {
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const [shouldShowSearch, setShouldShowSearch] = useState(false);
  const showSearch = () => setShouldShowSearch(true);

  const [userInput, setUserInput] = useState("");
  const currentDirection: "ltr" | "rtl" | null = useMemo(
    () =>
      searchBoxRef.current &&
      (getComputedStyle(searchBoxRef.current).direction as "ltr" | "rtl"),
    [searchBoxRef.current, userInput]
  );

  const autocomplete = useQuery(
    ["autocomplete", userInput.toLowerCase()],
    () => fetchAutocomplete(userInput),
    { keepPreviousData: true }
  );
  const searchResult = useQuery(
    ["search", userInput.toLowerCase()],
    () => searchYoutube(userInput),
    { keepPreviousData: true, enabled: userInput !== "" }
  );
  const spotifyResults = useQuery(
    ["spotify-search", userInput.toLowerCase()],
    () => searchSpotify(userInput)
  );

  const search = (text?: string) => {
    setUserInput(text ?? userInput);
    showSearch();
    searchBoxRef.current?.focus();
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search(event?.target?.value);
    }
  };

  useSizeChange(APP_ID);

  // useEffect(() => unlisten, []);

  return (
    <div
      data-tauri-drag-region
      id={APP_ID}
      className="App"
      style={{ direction: currentDirection ?? undefined }}
    >
      <div className="search-box">
        <input
          dir="auto"
          ref={searchBoxRef}
          autoFocus={true}
          placeholder="Search media..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={onInputKeyDown}
        />
      </div>
      {!!userInput.length && !!autocomplete.data?.length && (
        <div
          className={classnames("autocomplete", {
            compact: shouldShowSearch,
            loading: autocomplete.isPreviousData && autocomplete.isFetching,
          })}
        >
          {!autocomplete.data?.length &&
            autocomplete.isFetching &&
            autocomplete.isPreviousData &&
            "..."}
          {autocomplete.isError && `${autocomplete.error}`}
          {autocomplete?.data?.map((item) => (
            <div
              key={item}
              className={"autocomplete-result"}
              onClick={() => search(item)}
            >
              {highlight(item, userInput)}
            </div>
          ))}
        </div>
      )}
      {shouldShowSearch && !!searchResult.data?.length && (
        <div className="search-results">
          {searchResult.data?.map((result) => (
            <SearchResult key={result?.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

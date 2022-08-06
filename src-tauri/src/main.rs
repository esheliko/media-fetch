#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use cpython::{ Python, PyDict };

#[tauri::command]
fn search(searchTerms: String) -> String {
    let gil = Python::acquire_gil();
    let py = gil.python();

    let locals = PyDict::new(py);
    locals.set_item(py, "youtube_search", py.import("youtube_search").unwrap());
    locals.set_item(py, "json", py.import("json").unwrap());
    locals.set_item(py, "search_terms", searchTerms).unwrap();

    return py
        .eval("json.dumps(youtube_search.YoutubeSearch(search_terms).videos)", None, Some(&locals))
        .unwrap()
        .to_string();
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
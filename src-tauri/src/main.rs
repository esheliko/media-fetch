#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use std::path::PathBuf;
use serde::ser::SerializeStruct;

use rustube::*;

#[derive(Clone)]
struct MyCallbackArguments(CallbackArguments);

impl serde::Serialize for MyCallbackArguments {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: serde::Serializer {
        let mut state = serializer.serialize_struct("MyCallbackArguments", 2)?;
        state.serialize_field("current_chunk", &self.0.current_chunk)?;
        state.serialize_field("content_length", &self.0.content_length)?;
        return state.end();
    }
}

async fn download_from_youtube(
    window: tauri::Window,
    url: String,
    event_name: String
) -> Result<(), Error> {
    eprintln!("{}", url);
    let id = Id::from_raw(url.as_str())?;
    eprintln!("{}", id);
    let video = Video::from_id(id.into_owned()).await?;
    // let stream = video.best_quality().ok_or(Error::NoStreams)?;

    // let progress_closure = move |args: CallbackArguments| {
    //     eprintln!("{} {}", &event_name, args.current_chunk);
    //     let arguments = MyCallbackArguments(args.clone());
    //     if let Err(error) = window.emit(&event_name, arguments) {
    //         eprintln!("EMIT ERROR: {}", error);
    //     }
    //     return;
    // };

    // let complete_closure = |result: Option<PathBuf>| {
    //     if let Some(value) = result {
    //         eprintln!("COMPLETE: {}", value.display());
    //     }
    // };

    // let callback = Callback::new()
    //     .connect_on_progress_closure(progress_closure)
    //     .connect_on_complete_closure(complete_closure);

    // stream.download_with_callback(callback).await?;
    rustube::download_best_quality(url.as_str()).await?;
    Ok(())
}

#[tauri::command]
async fn youtube_download(
    window: tauri::Window,
    url: &str,
    event_name: &str
) -> Result<(), tauri::Error> {
    match download_from_youtube(window, String::from(url), String::from(event_name)).await {
        Err(error) => {
            let error_message = error.to_string();
            dbg!("ERROR {}", error);
            Err(tauri::Error::FailedToExecuteApi(tauri::api::Error::Command(error_message)))
        }
        Ok(y) => Ok(y),
    }
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![youtube_download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
// imports { invoke } from "@tauri-apps/api/tauri";
// imports { appWindow } from "@tauri-apps/api/window";
// imports { open as browse } from "@tauri-apps/api/dialog";

export default async (url: string) => {
  const { invoke } = await import("@tauri-apps/api/tauri");
  const { appWindow } = await import("@tauri-apps/api/window");
  // const { open: browse } = await import("@tauri-apps/api/dialog");

  const eventName = encodeURIComponent(`download-progress`);
  appWindow.listen(eventName, console.debug);
  invoke("youtube_download", { url, eventName }).then(console.debug);
  // browse({ directory: true });
};

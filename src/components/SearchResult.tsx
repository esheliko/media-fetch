// imports { open } from "@tauri-apps/api/shell";

import { YoutubeResult } from "../actions/youtubeSearch";
// imports { download } from "../actions/download";
import DownloadIcon from "../icons/downloadIcon";
import PlayIcon from "../icons/playIcon";

import "./SearchResult.css";

const openInBrowser = async (url: string) =>
  (await import("@tauri-apps/api/shell")).open(url);

const downloadMedia = async (url: string) =>
  (await import("../actions/download")).default(url);

export default ({ result }: { result: YoutubeResult }) => (
  <div key={result.id} className="search-result">
    <div className="video-details">
      <span dir="auto">{result.title}</span>
      <span className="extra-details">{result.publish_time}</span>
    </div>
    <div className="video-actions">
      <DownloadIcon
        title="Download"
        onClick={() => downloadMedia(result.url)}
      />
    </div>
    {result.thumbnails?.[0] && (
      <div className="video-thumbnail">
        <img src={result.thumbnails[0]} />
        <PlayIcon
          title="Play video in browser"
          onClick={() => openInBrowser(result.url)}
        />
      </div>
    )}
    <span className="video-duration">{result.duration}</span>
  </div>
);

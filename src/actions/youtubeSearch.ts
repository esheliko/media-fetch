// imports { fetch, ResponseType } from "@tauri-apps/api/http";

export type YoutubeResult = {
  id: string;
  thumbnails: any[];
  title: string;
  long_desc: any;
  channel: string;
  duration: string;
  views: string;
  publish_time: string;
  url: string;
};

export const BASE_URL = "https://youtube.com";
const YT_DATA = "ytInitialData";

const encodeSearchTerm = (term: string) =>
  encodeURIComponent(term).replace(/%20/g, "+");

export default async (searchTerms: string) => {
  const max_results = null;
  const videos = await _search(searchTerms, max_results);
  console.debug(videos);
  return videos;
};

const _search = async (searchTerms: string, max_results: number | null) => {
  const { fetch, ResponseType } = await import("@tauri-apps/api/http");

  const encoded_search = encodeSearchTerm(searchTerms);
  const url = `${BASE_URL}/results?search_query=${encoded_search}`;
  let response = "";
  while (!response.includes(YT_DATA)) {
    response = await fetch<string>(url, {
      method: "GET",
      responseType: ResponseType.Text,
    }).then(({ data }) => data);
  }
  const results: YoutubeResult[] = _parse_html(response);
  return results.slice(0, max_results ?? Infinity);
};

const _parse_html = (response: string) => {
  let results: YoutubeResult[] = [];
  const start = response.indexOf(YT_DATA) + YT_DATA.length + 3;
  const end = response.indexOf("};", start) + 1;
  const json_str = response.slice(start, end);
  const data = JSON.parse(json_str);
  const contentsList =
    data["contents"]["twoColumnSearchResultsRenderer"]["primaryContents"][
      "sectionListRenderer"
    ]["contents"];

  for (const contents of contentsList) {
    const videoList = contents?.["itemSectionRenderer"]?.["contents"] ?? [];
    for (const video of videoList) {
      if ("videoRenderer" in video) {
        const videoData = video["videoRenderer"] ?? {};
        const res: YoutubeResult = {
          id: videoData["videoId"],
          thumbnails: (videoData["thumbnail"]?.["thumbnails"] ?? [{}]).map(
            (thumb: { url?: string }) => thumb["url"]
          ),
          title: videoData["title"]?.["runs"]?.[0]?.["text"],
          long_desc: videoData["descriptionSnippet"]?.["runs"]?.["text"],
          channel: videoData["longBylineText"]?.["runs"]?.["text"],
          duration: videoData["lengthText"]?.["simpleText"] ?? "0",
          views: videoData["shortViewCountText"]?.["simpleText"] ?? "0",
          publish_time: videoData["publishedTimeText"]?.["simpleText"] ?? "0",
          url: `${BASE_URL}${videoData["navigationEndpoint"]?.["commandMetadata"]?.["webCommandMetadata"]?.["url"]}`,
        };
        results.push(res);
      }
    }

    if (results.length > 0) {
      return results;
    }
  }

  return results;
};

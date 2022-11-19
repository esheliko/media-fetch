// imports { fetch, ResponseType } from "@tauri-apps/api/http";

import { get_auth_headers } from "../utils/spotifyAuth";

export type SongInformation = {
  name: string;
  album?: string;
  track_number?: [number, number];
  artists: string[];
  cover_image?: { payload: string };
  year?: number;
  genre?: string;
  links: Record<string, string>;
  additional_information?: string;
};

export default async (
  song: string,
  album?: string,
  artist?: string
): Promise<SongInformation | undefined> => {
  const results = await _search_track(song, album, artist);
  return results?.[0];
};

const _search_track = async (
  track: string,
  album?: string,
  artist?: string
): Promise<SongInformation[]> => {
  return (await _search("track", { track, album, artist })).map(_parse_track);
};

const _search = async (
  query_type: string,
  query: Record<string, string | undefined>,
  limit: number = 10
): Promise<Record<string, any>[]> => {
  const queryText = Object.entries(query)
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => `${k}:${v}`)
    .join(" ");

  const headers = await get_auth_headers();
  if (headers === null) return [];

  const { fetch, ResponseType } = await import("@tauri-apps/api/http");
  const data = await fetch<object>("https://api.spotify.com/v1/search", {
    method: "GET",
    responseType: ResponseType.JSON,
    headers: headers,
    query: { q: queryText, limit: "10", offset: "0", type: "track" },
  }).then(({ data }) => data);

  console.debug(data);
  return [data];
};

const _parse_track = (a: any) => a;

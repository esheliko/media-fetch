import { fetch, ResponseType } from "@tauri-apps/api/http";
import { ChangeEvent } from "react";

export default async (query: string): Promise<string[]> => {
  if (query === "") return [];

  const data: string = await fetch<string>(
    `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&q=${query}&callback=google.sbox.p50&gs_gbg=eI176`,
    { method: "GET", responseType: ResponseType.Text }
  ).then(({ data }) => data);

  const obj = JSON.parse(data.slice(35, data.length - 1));
  
  return obj[1].map((result: any[]) => result[0]);
};

"use server";
import axios from "axios";
const TOKEN = process.env.TMDB_API_TOKEN as string;

export async function getTopRatedMedia({
  mediaType,
  pageNumber,
}: {
  mediaType: string;
  pageNumber: number;
}) {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/" +
        mediaType +
        "/top_rated?language=en-US&page=" +
        pageNumber,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getLatestMedia({
  mediaType,
  pageNumber,
}: {
  mediaType: string;
  pageNumber: number;
}) {
  try {
    const slug = mediaType == "movie" ? "now_playing" : "on_the_air";
    const response = await axios.get(
      "https://api.themoviedb.org/3/" +
        mediaType +
        "/" +
        slug +
        "?language=en-US&page=" +
        pageNumber,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPopularMedia({
  mediaType,
  pageNumber,
}: {
  mediaType: string;
  pageNumber: number;
}) {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/" +
        mediaType +
        "/popular?language=en-US&page=" +
        pageNumber,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

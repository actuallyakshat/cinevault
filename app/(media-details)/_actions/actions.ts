"use server";

import axios from "axios";
const TOKEN = process.env.TMDB_API_TOKEN as string;

export async function getMediaDetails({
  mediaType,
  mediaId,
}: {
  mediaType: string;
  mediaId: string;
}) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

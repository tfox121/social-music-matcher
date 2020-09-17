import axios from "axios";

const lastfm = axios.create({
  baseURL: "https://ws.audioscrobbler.com/2.0",
  params: {
    api_key: process.env.NEXT_PUBLIC_LASTFM_API,
    format: "json",
  },
});

const getSimilarArtists = async (artist) => {
  const response = await lastfm.get("/", {
    params: {
      method: "artist.getSimilar",
      limit: "10",
      artist: artist.name,
      // mbid: artist.mbid,
      api_key: process.env.NEXT_PUBLIC_LASTFM_API,
      format: "json",
    },
  });
  return response.data.similarartists;
}

export const getUserTopMusic = async (user, limit, period) => {
  const response = await lastfm.get("/", {
    params: {
      method: "user.getTopArtists",
      user,
      limit,
      period,
      api_key: process.env.NEXT_PUBLIC_LASTFM_API,
      format: "json",
    },
  });
  return response.data.topartists.artist;
}


export const getMatching = async (user1, user2, errorHook) => {
  try {
    const recentTopArtists = await getUserTopMusic(user1, 30, "12month");

    const overallTopArtists = await getUserTopMusic(user1, 400, "overall");

    const similarArtists = await Promise.all(
      recentTopArtists.map(async (artist) => getSimilarArtists(artist))
    );

    const overallTopArtistsFlattened = overallTopArtists.map((artist) => {
      return artist.name;
    });

    const similarArtistTally = {};

    similarArtists.forEach((artistsObj) => {
      artistsObj.artist.forEach((artist) => {
        for (let i in overallTopArtistsFlattened) {
          if (artist.name.includes(overallTopArtistsFlattened[i])) {
            return;
          }
        }
        // if (overallTopArtistsFlattened.includes(artist.name)) {
        //   return
        // }
        if (similarArtistTally[artist.name]) {
          similarArtistTally[artist.name] += 1;
        } else {
          similarArtistTally[artist.name] = 1;
        }
      });
    });

    const friendOverallTopArtists = await getUserTopMusic(
      user2,
      400,
      "overall"
    );

    const friendOverallTopArtistsFlattened = friendOverallTopArtists.map(
      (artist) => {
        return artist.name;
      }
    );

    const commonArtists = []

    Object.keys(similarArtistTally).forEach((key) => {
      if (friendOverallTopArtistsFlattened.includes(key)) {
        commonArtists.push({name: [key], count: similarArtistTally[key]})
      }
    })

    commonArtists.sort((a, b) => {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return 0;
    })

    // console.log(similarArtistTally, Object.keys(similarArtistTally).length);

    // const filteredSimilarArtists = []

    // Object.keys(similarArtistTally).forEach((key) => {
    //   if (similarArtistTally[key] < 2) {
    //     return
    //   }
    //   filteredSimilarArtists.push(key);
    // })

    // console.log(filteredSimilarArtists);

    errorHook("");

    return commonArtists
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 404) {
      errorHook("That username could not be found.");
    } else {
      errorHook("There was a problem with the request.");
    }
  }
};

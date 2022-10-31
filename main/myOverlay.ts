// @ts-ignore
let instance: any = null;
let position: string | null;

type particleType = {
  particle: HTMLImageElement;
  intervalId: number;
};

function formatTime(time: number): string {
  if (time < 10) {
    return `0${time}`;
  }

  return time.toString();
}

function setTime() {
  const time = document.getElementById("time");

  const current = new Date();

  if (time) {
    time.innerHTML = `${formatTime(current.getHours())}:${formatTime(
      current.getMinutes()
    )}`;
  }
}

function setFollowers() {
  instance
    .get(`users/follows?to_id=${user_id}`) // https://api.twitch.tv/helix/follows?to_id=124491073
    .then((res: { data: { total: string } }) => {
      const followers = Number(res.data.total);

      const element = document.getElementById("follower-number");
      if (element) element.innerHTML = followers.toString();
    });
}

function setViewers() {
  instance
    .get(`streams?user_id=${user_id}`)
    .then((res: { data: { data: Array<{ viewer_count: number }> } }) => {
      const { data } = res.data;
      if (data.length > 0) {
        const viewers = res.data.data[0].viewer_count;

        const element = document.getElementById("viewer-number");
        if (element) element.innerHTML = viewers.toString();
      }
    });
}

window.addEventListener("load", () => {
  // #region class
  const bottom = document.getElementById("bottom");
  if (bottom) {
    const url = new URL(window.location.href);
    let className = "bottom-left";
    position = url.searchParams.get("position");

    switch (position) {
      case Position.middle:
        className = "bottom-midle";
        break;
      case Position.right:
        className = "bottom-right";
        break;
      default:
        className = "bottom-left";
    }

    bottom.setAttribute("class", className);
  }
  // #endregion

  // #region time
  setInterval(() => {
    setTime();
  }, 30000);

  setTime();
  // #endregion

  // #region axios
  // @ts-ignore
  axios({
    method: "post",
    url: `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${secret}&grant_type=client_credentials`,
  }).then((res: { data: { access_token: string } }) => {
    const token = res.data.access_token;

    // @ts-ignore
    instance = axios.create({
      baseURL: "https://api.twitch.tv/helix/",
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": clientID,
      },
    });

    setFollowers();
    setViewers();
  });
  // #endregion

  // #region refresh
  setInterval(() => {
    setTime();
    setViewers();
    setFollowers();
  }, 300000);
  // #endregion
});

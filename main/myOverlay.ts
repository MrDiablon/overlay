// @ts-ignore
let twitchInstance: any = null;
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
  const minRef = document.getElementById("min-clock");
  const hourRef = document.getElementById("hour-clock");

  const current = new Date();
  let min = current.getMinutes();
  let hour = current.getHours();

  if (min === 0) {
    min = 60
  }

  if (hour === 0) {
    hour = 24
  }

  const offset = 5

  if (minRef && hourRef) {
    minRef.style.transform = `translate(-45.5%, 2%) rotate(${offset - ((min - 1) * 360/60)}deg) scale(1.2)`;
    hourRef.style.transform = `translate(-48%, -8%) rotate(${offset - ((hour - 1) * 360/24)}deg) scale(0.9)`;

    console.log(min, hour, min * 360/60, hour * 360/24)

    setTimeout(() => {
      minRef.style.transitionDuration = "10s"
      hourRef.style.transitionDuration = "60s"
    }, 1000)
  }


  setInterval(() => {
    const rotageRegex = /(rotate\(-?\d+.?\d*deg\))/
    const numberRegex = /-?\d+(.\d+)?/

    if (minRef) {
      const transform = minRef.style.transform.match(rotageRegex);
      const currentRotation = Number(transform?.[1].match(numberRegex)?.[0]) || 5;
      
      minRef.style.transform = `translate(-45.5%, 2%) rotate(${currentRotation - 360/60}deg) scale(1.2)`;
    }

    if (hourRef) {
      const transform = hourRef.style.transform.match(rotageRegex);
      const currentRotation = Number(transform?.[1].match(numberRegex)?.[0]) || 5;

      hourRef.style.transform = `translate(-48%, -8%) rotate(${currentRotation - 360/60/24}deg) scale(0.9)`;
    }
  }, 60 * 1000);
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
  // setInterval(() => {
  //   setTime();
  // }, 30000);

  console.log("here")
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
    twitchInstance = axios.create({
      baseURL: "https://api.twitch.tv/helix/",
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": clientID,
      },
    });
  });
  // #endregion
});

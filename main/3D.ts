const offsetFace = 0.63
const initialOffset = 0.2 + offsetFace *2
const followersMeshes: any[] = []

function setFollowers() {
  // get twitch followers
  twitchInstance
    .get(`/channels/followers?broadcaster_id=${user_id}`)
    .then((res: { data: { total: string } }) => {
      const followers = Number(res.data.total);

      const hundreds = followers > 100 ? Math.round(followers / 100 ): 0
      const tens = followers > 10 ? Math.floor((followers % 100) / 10) : 0
      const units = followers % 10
      
      if (followersMeshes.length > 0) {
        followersMeshes[0].rotation.x = initialOffset - hundreds * offsetFace
        followersMeshes[1].rotation.x = initialOffset - tens * offsetFace
        followersMeshes[2].rotation.x = initialOffset - units * offsetFace
      }

    });


  // get kick followers
  // @ts-ignore
  axios({
    method: "get",
    url: `https://kick.com/api/v2/channels/mrdiablon`,
  })
    .then((res: { data: { followers_count: number } }) => {
    const followers = res.data.followers_count;

    const element = document.getElementById("follower-number-kick");
    if (element) element.innerHTML = followers.toString();
  });
}

const viewersMeshes: any[] = []
  
function setViewers() {
  twitchInstance
    .get(`streams?user_id=${user_id}`)
    .then((res: { data: { data: Array<{ viewer_count: number }> } }) => {
      const { data } = res.data;
      if (data.length > 0) {
        const viewers = res.data.data[0].viewer_count;

        const tens = Math.floor(viewers / 10)
        const units = viewers % 10

        console.log(tens, units)

        viewersMeshes[0].rotation.x = initialOffset - tens * offsetFace
        viewersMeshes[1].rotation.x = initialOffset - units * offsetFace
      }
    });
}

window.addEventListener('load', () => {
  // @ts-ignore
  const scene = new THREE.Scene()
  // @ts-ignore
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
  // @ts-ignore
  const renderer = new THREE.WebGLRenderer({alpha: true});

  // @ts-ignore
  const loader = new THREE.GLTFLoader()

  renderer.setSize( window.innerWidth, window.innerHeight ); 

  const container = document.getElementById('three-container')

  if (container) {
      container.appendChild(renderer.domElement)
  }

  // creating the loght
  const color = 0xFFFFFF;
  const intensity = 3;
  // @ts-ignore
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  camera.position.z = 10;

  // loading pipe
  loader.load( '3d/tube1.glb', function ( gltf: any ) {

      console.log(gltf)

      scene.add( gltf.scene );
      gltf.scene.scale.set(1.3, 1, 1)
      gltf.scene.rotation.y = Math.PI
      gltf.scene.rotation.x = -Math.PI / 2

      gltf.scene.position.set(-0.5, -6.3, 0)

  }, undefined, function ( error: any ) {
  
      console.error( error );
  
  } );

  // viewers
  loader.load('3d/bague1.glb', function (gltf: any) {
    scene.add(gltf.scene)
    viewersMeshes.push(gltf.scene)
    gltf.scene.position.set(-5, -6.3, 0)
    console.log(gltf)
    gltf.scene.rotation.x = initialOffset

    loader.load('3d/bague1.glb', function (gltf: any) {
      scene.add(gltf.scene)
      viewersMeshes.push(gltf.scene)
      gltf.scene.position.set(-3.7, -6.3, 0)
      gltf.scene.rotation.x = initialOffset

      setViewers();
    })
  })

  //followers
  loader.load('3d/bague1.glb', function (gltf: any) {
    scene.add(gltf.scene)
    followersMeshes.push(gltf.scene)
    gltf.scene.position.set(-0, -6.3, 0)
    gltf.scene.rotation.x = initialOffset

      

    loader.load('3d/bague1.glb', function (gltf: any) {
      scene.add(gltf.scene)
      followersMeshes.push(gltf.scene)
      gltf.scene.position.set(1.3, -6.3, 0)
      gltf.scene.rotation.x = initialOffset

      loader.load('3d/bague1.glb', function (gltf: any) {
        scene.add(gltf.scene)
        followersMeshes.push(gltf.scene)
        gltf.scene.position.set(2.6, -6.3, 0)
        gltf.scene.rotation.x = initialOffset

        setFollowers();
      })
    })
  })



  function animate() {
    renderer.render( scene, camera );
  }

  renderer.setAnimationLoop( animate );
    
  // #region refresh
  setInterval(() => {
    setViewers();
    setFollowers();
  }, 30 * 1000);
  // #endregion
})
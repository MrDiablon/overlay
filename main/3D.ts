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
    const viewers: any[] = []
    loader.load('3d/bague1.glb', function (gltf: any) {
        scene.add(gltf.scene)
        viewers.push(gltf.scene)
        gltf.scene.position.set(-5, -6.3, 0)
    })

    loader.load('3d/bague1.glb', function (gltf: any) {
            scene.add(gltf.scene)
        viewers.push(gltf.scene)
        gltf.scene.position.set(-3.7, -6.3, 0)
        gltf.scene.rotation.x = Math.PI
    })

    //followers
    const followers: any[] = []
    loader.load('3d/bague1.glb', function (gltf: any) {
        scene.add(gltf.scene)
        followers.push(gltf.scene)
        gltf.scene.position.set(-0, -6.3, 0)
    })

    loader.load('3d/bague1.glb', function (gltf: any) {
        scene.add(gltf.scene)
        followers.push(gltf.scene)
        gltf.scene.position.set(1.3, -6.3, 0)
    })

    loader.load('3d/bague1.glb', function (gltf: any) {
        scene.add(gltf.scene)
        followers.push(gltf.scene)
        gltf.scene.position.set(2.6, -6.3, 0)
    })

    function animate() {
        renderer.render( scene, camera );
    }

    renderer.setAnimationLoop( animate );  
})
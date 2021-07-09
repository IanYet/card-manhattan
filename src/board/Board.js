import {
    Color,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    Vector3,
    OrthographicCamera,
    Vector2,
} from 'three'
import { OrbitControls } from 'threeJSM/controls/OrbitControls.js'
import { EffectComposer } from 'threeJSM/postprocessing/EffectComposer.js'
import { RenderPass } from 'threeJSM/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'threeJSM/postprocessing/UnrealBloomPass.js'

import { net } from '../net'
import { drawCity } from './draw'
import { BLOOM_SCENE } from './constant'

class Board {
    renderer
    camera
    secondViewCamera
    scene
    controls
    composer

    /**
     *
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.renderer = this.initRenderer(el)
        this.camera = this.initCamera()
        this.secondViewCamera = this.initSecondViewCamera()
        this.scene = this.initScene()
        this.controls = this.initControls()
        this.composer = this.initEffect()

        this.initLights()
        this.initEvents()

        this.update()
    }

    /**
     *
     * @param {HTMLElement} el
     * @returns {WebGLRenderer} renderer
     */
    initRenderer(el) {
        const cav = document.createElement('canvas')
        cav.style.height = '100vh'
        cav.style.width = '100vw'
        el.appendChild(cav)

        const renderer = new WebGLRenderer({
            canvas: cav,
            antialias: true,
            autoClear: false,
        })

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)

        return renderer
    }

    /**
     *
     * @returns {PerspectiveCamera}
     */
    initCamera() {
        const camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            10,
            1000000
        )
        camera.up.copy(new Vector3(0, 0, 1))
        camera.position.setY(-5000)
        camera.position.setZ(5000)
        return camera
    }

    initSecondViewCamera() {
        const camera = new OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            10,
            1000000
        )
        camera.up.copy(new Vector3(0, 0, 1))
        camera.position.copy(new Vector3(-2000, 0, 500))
        camera.lookAt(new Vector3(0, 0, 0))
        camera.zoom = 0.1
        return camera
    }

    /**
     *
     * @returns {Scene}
     */
    initScene() {
        const scene = new Scene()
        scene.background = new Color(0x334257)
        return scene
    }

    /**
     *
     * @returns {OrbitControls}
     */
    initControls() {
        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        )
        controls.screenSpacePanning = false
        controls.enableDamping = true
        controls.dampingFactor = 0.1
        controls.maxPolarAngle = Math.PI / 2

        return controls
    }

    initLights() {
        const light1 = new HemisphereLight(0xffffff, 0xcccccc, 0.5)
        light1.position.copy(new Vector3(0, 0, 1))
        this.scene.add(light1)

        const light2 = new DirectionalLight(0xffffff, 0.1)
        light2.position.copy(new Vector3(1, -1, 1))
        this.scene.add(light2)
    }

    initEffect() {
        const renderScene = new RenderPass(this.scene, this.camera)
        const bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            0.8 ,
            0.4,
            0.5

        )

        const bloomComposer = new EffectComposer(this.renderer)
        bloomComposer.addPass(renderScene)
        // bloomComposer.addPass(bloomPass)
        return bloomComposer
    }

    initEvents() {
        window.onresize = (ev) => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()

            this.secondViewCamera.left = window.innerWidth / -2
            this.secondViewCamera.right = window.innerWidth / 2
            this.secondViewCamera.top = window.innerHeight / -2
            this.secondViewCamera.bottom = window.innerHeight / 2

            this.renderer.setSize(window.innerWidth, window.innerHeight)
        }
    }

    setOpt(opt) {}

    update() {
        requestAnimationFrame(() => this.update())

        this.controls.update()

        this.renderer.setScissorTest(true)

        this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
        this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight)
        this.composer.render()

        // this.renderer.setViewport(
        //     (window.innerWidth * 4) / 5,
        //     (window.innerHeight * 4) / 5,
        //     window.innerWidth / 5,
        //     window.innerHeight / 5
        // )
        // this.renderer.setScissor(
        //     (window.innerWidth * 4) / 5,
        //     (window.innerHeight * 4) / 5,
        //     window.innerWidth / 5,
        //     window.innerHeight / 5
        // )

        // this.secondViewCamera.updateProjectionMatrix()
        // this.composer.render(
        //     window.axesHelper || this.scene,
        //     this.secondViewCamera
        // )
    }

    async drawBoard() {
        const cityData = (await net.getCity()).data
        drawCity(cityData, this.scene)
    }
}

export { Board }

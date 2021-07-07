import {
    Color,
    FogExp2,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    DirectionalLight,
    AmbientLight,
    HemisphereLight,
    Vector3,
} from 'three'
import { OrbitControls } from 'threeJSM/controls/OrbitControls.js'
import { net } from '../net'
import { drawCity } from './draw'

class Board {
    renderer
    camera
    scene
    controls

    /**
     *
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.renderer = this.initRenderer(el)
        this.camera = this.initCamera()
        this.scene = this.initScene()
        this.controls = this.initControls()
        this.initLights()

        this.update()

        window.onresize = (ev) => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        }
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
            1,
            1000000
        )
        camera.position.setY(-4000)
        camera.position.setZ(4000)
        return camera
    }

    /**
     *
     * @returns {Scene}
     */
    initScene() {
        const scene = new Scene()
        scene.background = new Color(0xeeeeee)
        scene.fog = new FogExp2(0xcccccc, 0.00001)
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
        // controls

        return controls
    }

    initLights() {
        const light1 = new HemisphereLight(0xffffff, 0xcccccc)
        light1.position.copy(new Vector3(0, 0, 1))
        this.scene.add(light1)
    }

    setOpt(opt) {}

    update() {
        requestAnimationFrame(() => this.update())

        this.renderer.render(this.scene, this.camera)
        this.controls.update()
    }

    async drawBoard() {
        const cityData = (await net.getCity()).data
        drawCity(cityData, this.scene)
    }
}

export { Board }

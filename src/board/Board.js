import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
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
            alpha: true,
            premultipliedAlpha: false,
            antialias: true,
            sortObjects: false,
            autoClear: false,
        })

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
            0.1,
            1000
        )
        camera.position.setZ(20)
        return camera
    }

    /**
     *
     * @returns {Scene}
     */
    initScene() {
        const scene = new Scene()
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

    setOpt(opt) {}

    update() {
        requestAnimationFrame(() => this.update())

        this.renderer.render(this.scene, this.camera)
        this.controls.update()
    }

    async drawBoard() {
        const boardData = (await net.getBoard()).data
        drawCity(boardData, this.scene)
    }
}

export { Board }

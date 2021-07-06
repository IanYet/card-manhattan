import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'threeJSM/controls/OrbitControls.js'

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
            100
        )
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

        return controls
    }
}

export { Board }

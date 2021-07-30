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
    SphereBufferGeometry,
    Mesh,
    Raycaster,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { constant, status } from './status'
import { drawCity } from './draw'
import { skyMaterial } from './material'
import TWEEN from '@tweenjs/tween.js'
import { operate } from './operate'

class Board {
    el
    renderer
    camera
    secondViewCamera
    scene
    controls
    raycaster
    mouse
    mode

    /**
     *
     * @param {HTMLElement} el
     */
    init(el) {
        this.renderer = this.initRenderer(el)
        this.camera = this.initCamera()
        this.secondViewCamera = this.initSecondViewCamera()
        this.scene = this.initScene()
        this.controls = this.initControls()
        this.mouse = new Vector2()
        this.raycaster = this.initRaycaster()
        this.mode = constant.VIEW_MODE

        this.initLights()
        this.initEvents()
        this.initSky()

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
            100,
            1000000
        )
        window.camera = camera
        camera.up.copy(new Vector3(0, 0, 1))
        camera.position.setY(-11000)
        camera.position.setZ(2000)

        status.oriViewState.camera = {
            position: new Vector3().copy(camera.position),
            up: new Vector3(0, 0, 1),
        }
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
        scene.background = new Color('rgb(31,50,104)')
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

        controls.target.set(0, 0, 2000)
        status.oriViewState.controls = {
            target: new Vector3().copy(controls.target),
        }

        return controls
    }

    initLights() {
        const light0 = new HemisphereLight(
            // new Color(0xd8c0cb),
            new Color(0xf7d7d6),
            new Color(0xa6afd0),
            0.9
        )
        light0.position.set(0, 0, 1)
        this.scene.add(light0)

        const light2 = new DirectionalLight(new Color(0xffffff), 0.25)
        light2.position.copy(new Vector3(1, -2, 2))
        this.scene.add(light2)

        const light3 = new DirectionalLight(new Color(0xe3e3e3), 0.15)
        light3.position.copy(new Vector3(-1, 2, 0))
        this.scene.add(light3)
    }

    initSky() {
        const geo = new SphereBufferGeometry(20000, 64, 64)
        const mat = skyMaterial
        const mesh = new Mesh(geo, mat)
        mesh.rotateX(Math.PI / 2)
        this.scene.add(mesh)
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
        window.onpointermove = (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        }
    }

    initRaycaster() {
        const raycaster = new Raycaster()
        raycaster.setFromCamera(this.mouse, this.camera)
        return raycaster
    }

    setOpt(opt) {}

    update() {
        requestAnimationFrame(() => this.update())
        TWEEN.update()

        this.controls.update()
        this.raycaster.setFromCamera(this.mouse, this.camera)

        // this.renderer.setScissorTest(true)

        // this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
        // this.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight)
        // this.composer.render()

        this.renderer.render(this.scene, this.camera)

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

    drawBoard(up, cityData) {
        drawCity(this.scene, up, cityData)
    }

    resetViewState() {
        this.camera.position.copy(status.oriViewState.camera.position)
        this.camera.up.copy(status.oriViewState.camera.up)
        this.controls.target.copy(status.oriViewState.controls.target)
    }

    /**
     *
     * @param {string} mode constant.VIEW_MODE | constant.VIEW_MODE
     */
    static changeMode(mode) {
        this.mode = mode
        status.mode = this.mode

        operate.reset()

        // if (mode === constant.OPER_MODE) {
        //     if (!operate.tempFloor) operate.createTempFloor()
        // }
    }
}

export { Board }

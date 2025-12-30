import * as THREE from 'https://esm.sh/three@0.174.0'
import { OrbitControls } from 'https://esm.sh/three@0.174.0/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'https://esm.sh/three@0.174.0/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'https://esm.sh/three@0.174.0/examples/jsm/geometries/TextGeometry.js'
import { RGBELoader } from 'https://esm.sh/three@0.174.0/examples/jsm/loaders/RGBELoader.js'
import GUI from 'https://unpkg.com/lil-gui@0.19.2/dist/lil-gui.esm.min.js'

/**
 * Base
 */
const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Environment map
 * - Start with 2k.hdr
 * - Checkbox toggles Potsdamer Platz (lazy-load on first use)
 */
const rgbeLoader = new RGBELoader()

// false = use 2k.hdr (default), true = use Potsdamer
const env = { potsdamer: false }

let envDefault = null
let envPotsdamer = null
let loadingPotsdamer = false

const applyEnv = () =>
{
    const m = env.potsdamer ? envPotsdamer : envDefault
    if(!m) return

    scene.background = m
    scene.environment = m
}

// Load default HDR immediately (startup)
rgbeLoader.load('/three/textures/environmentMap/2k.hdr', (m) =>
{
    m.mapping = THREE.EquirectangularReflectionMapping
    envDefault = m

    if(!env.potsdamer) applyEnv()
})

// GUI toggle (lazy-load Potsdamer on first check)
gui.add(env, 'potsdamer')
    .name('Potsdamer Platz')
    .onChange(() =>
    {
        if(env.potsdamer && !envPotsdamer && !loadingPotsdamer)
        {
            loadingPotsdamer = true
            rgbeLoader.load('/three/textures/environmentMap/potsdamer_platz_2k.hdr', (m) =>
            {
                m.mapping = THREE.EquirectangularReflectionMapping
                envPotsdamer = m
                loadingPotsdamer = false
                applyEnv()
            }, undefined, () =>
            {
                loadingPotsdamer = false
            })
            return
        }

        applyEnv()
    })

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/three/textures/matcaps/5kim.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Sizes (based on the canvas element)
 */
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Resize
 */
window.addEventListener('resize', () =>
{
    sizes.width = canvas.clientWidth
    sizes.height = canvas.clientHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fonts + Scene content
 */
const fontLoader = new FontLoader()

fontLoader.load('/three/fonts/helvetiker_regular.typeface.json', (font) =>
{
    // Material
    const material = new THREE.MeshPhysicalMaterial()
    material.metalness = 0
    material.roughness = 0.15
    material.map = matcapTexture

    gui.add(material, 'metalness').min(0).max(1).step(0.0001)
    gui.add(material, 'roughness').min(0).max(1).step(0.0001)

    // Transmission
    material.transmission = 1
    material.ior = 1.5
    material.thickness = 0.5

    gui.add(material, 'transmission').min(0).max(1).step(0.0001)
    gui.add(material, 'ior').min(1).max(10).step(0.0001)
    gui.add(material, 'thickness').min(0).max(1).step(0.0001)

    // Text parameters
    const params = {
        text: 'kim pham'
    }

    let textMesh = null
    let textGeometry = null

    const createText = () =>
    {
        if(textMesh)
        {
            textGeometry.dispose()
            scene.remove(textMesh)
        }

        textGeometry = new TextGeometry(params.text, {
            font: font,
            size: 0.5,
            depth: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        })

        textGeometry.center()

        textMesh = new THREE.Mesh(textGeometry, material)
        scene.add(textMesh)
    }

    // Initial
    createText()

    // GUI
    gui.add(params, 'text')
        .name('Text (+ enter)')
        .onFinishChange(createText)

    // Donuts
    const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 32, 64)
    for(let i = 0; i < 30; i++)
    {
        const donut = new THREE.Mesh(donutGeometry, material)
        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        scene.add(donut)
    }

    // Dodecahedrons
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.2)
    for(let i = 0; i < 20; i++)
    {
        const dodecahedron = new THREE.Mesh(dodecahedronGeometry, material)
        dodecahedron.position.x = (Math.random() - 0.5) * 10
        dodecahedron.position.y = (Math.random() - 0.5) * 10
        dodecahedron.position.z = (Math.random() - 0.5) * 10
        dodecahedron.rotation.x = Math.random() * Math.PI
        dodecahedron.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        dodecahedron.scale.set(scale, scale, scale)
        scene.add(dodecahedron)
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    clock.getElapsedTime()

    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
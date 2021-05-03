import * as THREE from '../../../lib/three.module.js'
import {GPUComputationRenderer} from '../../../lib/GPUComputationRenderer.js'
import PARAM from './particle.child.param.js'
import SHADER from './particle.child.shader.js'
import METHOD from './particle.child.method.js'

export default class{
    constructor(group, size, renderer){
        this.init(size, renderer)
        this.create()
        this.add(group)
    }


    // init
    init(size, renderer){
        this.size = size

        this.initGPGPU(renderer)
    }
    initGPGPU(renderer){
        const size = Math.sqrt(PARAM.count)

        this.gpuCompute = new GPUComputationRenderer(size, size, renderer)

        const pos = this.gpuCompute.createTexture()
        const life = this.gpuCompute.createTexture()

        METHOD.fillPosTexture(pos)
        METHOD.fillLifeTexture(life)

        this.posVariable = this.gpuCompute.addVariable('pos', SHADER.pos.fragment, pos)
        this.lifeVariable = this.gpuCompute.addVariable('life', SHADER.life.fragment, life)

        this.gpuCompute.setVariableDependencies(this.posVariable, [this.posVariable, this.lifeVariable])
        this.gpuCompute.setVariableDependencies(this.lifeVariable, [this.posVariable, this.lifeVariable])

        this.posUniforms = this.posVariable.material.uniforms
        this.lifeUniforms = this.lifeVariable.material.uniforms

        this.posUniforms['time'] = {value: 0.0}
        this.posUniforms['random'] = {value: 0.0}
        this.posUniforms['height'] = {value: this.size.obj.h / 2}
        this.posUniforms['x'] = {value: 0.0}
        this.posUniforms['y'] = {value: 0.0}
        this.lifeUniforms['lifeVel'] = {value: PARAM.lifeVel}
        this.lifeUniforms['random'] = {value: 0.0}
        this.lifeUniforms['height'] = {value: this.size.obj.h / 2}

        this.gpuCompute.init()
    }


    // add
    add(group){
        group.add(this.mesh)
    }


    // create
    create(){
        this.createMesh()
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        this.mesh = new THREE.Points(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position, coord} = METHOD.createAttribute(PARAM)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        geometry.setAttribute('coord', new THREE.BufferAttribute(coord, 2))

        return geometry
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                u_color: {value: new THREE.Color(PARAM.color)},
                u_size: {value: PARAM.size},
                u_pos: {value: null},
                u_life: {value: null},
            }
        })
    }


    // animate
    animate(){
        const time = window.performance.now()

        this.gpuCompute.compute()

        this.posUniforms['time'].value = time
        this.posUniforms['random'].value = Math.random()
        this.lifeUniforms['random'].value = Math.random()

        this.posUniforms['x'].value = Math.cos(time * 0.003) * 200
        this.posUniforms['y'].value = Math.sin(time * 0.006) * 100

        this.mesh.material.uniforms['u_life'].value = this.gpuCompute.getCurrentRenderTarget(this.lifeVariable).texture
        this.mesh.material.uniforms['u_pos'].value = this.gpuCompute.getCurrentRenderTarget(this.posVariable).texture
    }
}
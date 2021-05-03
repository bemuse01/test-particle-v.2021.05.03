const METHOD = {
    normalize(x, a, b, min, max){
        return (b - a) * (x - min) / (max - min) + a 
    },
    getVisibleHeight(camera, depth){
        const cameraOffset = camera.position.z
        if(depth < cameraOffset) depth -= cameraOffset
        else depth += cameraOffset
        const vFov = camera.fov * RADIAN
        return 2 * Math.tan(vFov / 2) * Math.abs(depth)
    },
    getVisibleWidth(camera, depth){
        const height = this.getVisibleHeight(camera, depth)
        return height * camera.aspect
    },
    clamp(x, min, max){
        return x <= min ? min : x >= max ? max : x
    },
    shuffle(arr){
        const temp = [...arr]
        for (let i = temp.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1))
            const t = temp[i]
            temp[i] = temp[j]
            temp[j] = t
        }
        return temp
    }
}
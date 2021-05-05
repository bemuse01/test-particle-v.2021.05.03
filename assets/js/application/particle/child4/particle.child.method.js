export default {
    createAttribute({count}){
        const position = []
        const coord = []

        const w = Math.sqrt(count)
        const h = w

        for(let i = 0; i < count; i++){
            position.push(0, 0, 0)

            const u = (i % w) / w
            const v = Math.floor(i / h) / h

            coord.push(u, v)
        }

        return {position: new Float32Array(position), coord: new Float32Array(coord)}
    },
    fillPosTexture(texture, size){
        const {data, width, height} = texture.image
        const {w, h} = size

        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // const x = 0
                // const y = 0
                const x = Math.random() * w - w / 2
                const y = Math.random() * h - h / 2
                // const z = Math.random() * 2 - 1
                // const w = Math.random() * 2 - 1

                // x === x position
                data[index] = x

                // y === y position
                data[index + 1] = y

                // z === x velocity
                data[index + 2] = 0

                // w === y velocity
                data[index + 3] = 0
            }
        }
    },
    fillLifeTexture(texture){
        const {data, width, height} = texture.image

        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                data[index] = 0.0

                data[index + 1] = 0

                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    }
}
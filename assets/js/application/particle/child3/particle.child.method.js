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
    fillPosTexture(texture){
        const {data, width, height} = texture.image

        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                const x = 0
                const y = 0
                // const x = Math.random() * 1000 - 500
                // const y = Math.random() * 1000 - 500
                const z = Math.random() * 2 - 1
                const w = Math.random() * 2 - 1

                // x === x position
                data[index] = x

                // y === y position
                data[index + 1] = y

                // z === x velocity
                data[index + 2] = z

                // w === y velocity
                data[index + 3] = w
            }
        }
    },
    fillLifeTexture(texture){
        const {data, width, height} = texture.image

        for(let j = 0; j < width; j++){
            for(let i = 0; i < height; i++){
                const index = (i * width + j) * 4

                // x === life === opacity
                data[index] = 0.0

                // y === acc
                data[index + 1] = 0.2

                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    }
}
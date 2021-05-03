import APP from '../application/app/app.build.js'
import PARTICLE from '../application/particle/particle.build.js'

new Vue({
    el: '#wrap',
    data(){
        return{
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.initThree()
            this.animate()

            window.addEventListener('resize', this.onWindowResize, false)
        },


        // three
        initThree(){
            OBJECT.app = new APP()

            this.createObject(OBJECT.app)
        },
        resizeThree(){
            const {app} = OBJECT

            for(let i in OBJECT) OBJECT[i].resize({app})
        },
        renderThree(){
            const {app} = OBJECT
            
            for(let i in OBJECT) OBJECT[i].animate({app})
        },
        createObject(app){
            this.createParticle(app)
        },
        createParticle(app){
            OBJECT.particle = new PARTICLE(app)
        },


        // event
        onWindowResize(){
            this.resizeThree()
        },


        // render
        render(){
            this.renderThree()
        },
        animate(){
            this.render()
            requestAnimationFrame(this.animate)
        }
    }
})
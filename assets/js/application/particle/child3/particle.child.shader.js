export default {
    draw: {
        vertex: `
            uniform float u_size;
            uniform sampler2D u_pos;
            uniform sampler2D u_life;
            
            attribute vec2 coord;
            
            varying float opacity;

            void main(){
                vec3 newPosition = position; 

                vec4 m = texture(u_pos, coord);
                vec4 l = texture(u_life, coord);

                newPosition.xy = m.xy;
                opacity = l.x;

                gl_PointSize = u_size;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 u_color;

            varying float opacity;

            void main(){
                gl_FragColor = vec4(u_color, opacity);
            }
        `
    },


    // pos
    pos: {
        fragment: `
            uniform float time;
            uniform float random;
            uniform float height;
            // uniform float x;
            // uniform float y;

            const float PI = 3.1415926535897932384626433832795;
            const float RADIAN = PI / 180.0;

            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                ivec2 xy = ivec2(gl_FragCoord.xy);

                vec4 m = texelFetch(pos, xy, 0);
                vec4 l = texelFetch(life, xy, 0);
                
                if(l.x > 0.0){
                    m.x += m.z;
                    m.y += m.w;
                    m.z += m.z * 0.04;
                    m.w += m.w * 0.04;
                }else{ 
                    m.x = 0.0;
                    m.y = 0.0;
                    m.z = rand(uv * random * .3) * 2.0 - 1.0;
                    m.w = rand(uv * random * .4) * 2.0 - 1.0;
                }

                gl_FragColor = m;
            }
        `
    },


    // life
    life: {
        fragment: `
            uniform float lifeVel;
            uniform float random;
            uniform float height;

            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                ivec2 xy = ivec2(gl_FragCoord.xy);

                vec4 m = texelFetch(pos, xy, 0);
                vec4 l = texelFetch(life, xy, 0);
                float chance = rand(uv * random);

                if(chance > 0.99 && l.x <= 0.0){
                    l.x = 1.0;
                }

                if(l.x > 0.0){
                    l.x -= lifeVel;
                }

                gl_FragColor = l;
            }
        `
    }
}
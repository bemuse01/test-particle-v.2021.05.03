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

            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            void main(){
                ivec2 xy = ivec2(gl_FragCoord.xy);

                vec4 m = texelFetch(pos, xy, 0);
                vec4 l = texelFetch(life, xy, 0);
                
                if(l.x > 0.0){
                    m.x += m.z;
                    m.y += m.w;
                    m.w += l.y;
                }
                // need to modify hear
                else{ 
                    m.x = rand(vec2(m.x, time * 0.1)) * 2.0 - 1.0;
                    m.y = rand(vec2(m.y, time * 0.2)) * 2.0 - 1.0;
                    m.z = rand(vec2(m.z, time * 0.3)) * 2.0 - 1.0;
                    m.w = rand(vec2(m.w, time * 0.4)) * -1.0;
                }

                gl_FragColor = m;
            }
        `
    },


    // life
    life: {
        fragment: `
            uniform float lifeVel;
            uniform int randX;
            uniform int randY;
            uniform float height;

            void main(){
                ivec2 xy = ivec2(gl_FragCoord.xy);

                vec4 m = texelFetch(pos, xy, 0);
                vec4 l = texelFetch(life, xy, 0);

                if(xy.x == randX && xy.y == randY && l.x <= 0.0){
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
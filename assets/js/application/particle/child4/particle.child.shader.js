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
                gl_FragColor = vec4(u_color, 1.0);
            }
        `
    },


    // pos
    pos: {
        fragment: `
            uniform float time;
            uniform float random;
            uniform float width;
            uniform float height;
            uniform float col;
            uniform float row;
            // uniform float x;
            // uniform float y;

            const float PI = 3.1415926535897932384626433832795;
            const float RADIAN = PI / 180.0;

            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            float normalize(float x, float a, float b, float min, float max){
                return (b - a) * (x - min) / (max - min) + a; 
            }

            void main(){
                ivec2 xy = ivec2(gl_FragCoord.xy);

                vec4 m = texelFetch(pos, xy, 0);

                float nu = normalize(m.x, 0.0, col, width * -0.5, width * 0.5);
                float nv = normalize(m.y, 0.0, row, height * -0.5, height * 0.5);

                int u = int(nu);
                int v = int(nv);

                vec4 l = texelFetch(life, ivec2(u, v), 0);

                m.x += l.x;
                m.y += l.y;
                
                if(m.x > width * 0.5) m.x += -width;
                if(m.x < width * -0.5) m.x += width;
                
                if(m.y > height * 0.5) m.y += -height;
                if(m.y < height * -0.5) m.y += height;

                gl_FragColor = m;
            }
        `
    },


    // life
    life: {
        fragment: `
            uniform float time;
            uniform float random;
            uniform float height;

            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

            float snoise(vec3 v){ 
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

                // First corner
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 =   v - i + dot(i, C.xxx) ;

                // Other corners
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );

                //  x0 = x0 - 0. + 0.0 * C 
                vec3 x1 = x0 - i1 + 1.0 * C.xxx;
                vec3 x2 = x0 - i2 + 2.0 * C.xxx;
                vec3 x3 = x0 - 1. + 3.0 * C.xxx;

                // Permutations
                i = mod(i, 289.0 ); 
                vec4 p = permute( permute( permute( 
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

                // Gradients
                // ( N*N points uniformly over a square, mapped onto an octahedron.)
                float n_ = 1.0/7.0; // N=7
                vec3  ns = n_ * D.wyz - D.xzx;

                vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);

                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );

                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));

                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);

                //Normalise gradients
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;

                // Mix final noise value
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                                dot(p2,x2), dot(p3,x3) ) );
            }

            void main(){
                vec2 pixel = 1.0 / resolution.xy;
                vec2 uv = gl_FragCoord.xy / resolution.xy;

                ivec2 xy = ivec2(gl_FragCoord.xy);
                vec2 fxy = vec2(gl_FragCoord.xy);

                vec4 m = texelFetch(pos, xy, 0);
                vec4 l = texelFetch(life, xy, 0);

                float n = snoise(vec3(fxy, time * 0.0001));
                float x = cos(n) * 4.0;
                float y = sin(n) * 4.0;

                l.x = x;
                l.y = y;

                gl_FragColor = l;
            }
        `
    }
}
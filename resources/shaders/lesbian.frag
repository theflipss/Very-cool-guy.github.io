precision mediump float;

varying vec2 v_texcoord;

uniform vec2 iResolution;
uniform float iTime;

void mainImage()
{
    vec2 fragCoord = v_texcoord * iResolution;
    vec2 uv = fragCoord.xy / iResolution.xy;

    float pattern =
        sin(uv.x * 10. - iTime * .35            ) * .06 +
        sin(uv.y * 18. + iTime * .50 + uv.x * 9.) * .03;

    uv.y += pattern;

    uv.y = (uv.y * 20. - (fract(uv.y * 20.) * 2.5)) / 20.;

    vec3 c0 = vec3(0.71, 0.34, 0.56);
    vec3 c1 = vec3(0.92, 0.73, 0.85);
    vec3 c2 = vec3(1.00, 1.00, 1.00);
    vec3 c3 = vec3(1.00, 0.81, 0.69);
    vec3 c4 = vec3(0.98, 0.57, 0.29);

    vec3 col;

    if      (uv.y < 0.20)
        col = mix(c0, c1, smoothstep(0.00, 0.20, uv.y));
    else if (uv.y < 0.45)
        col = mix(c1, c2, smoothstep(0.20, 0.45, uv.y));
    else if (uv.y < 0.70)
        col = mix(c2, c3, smoothstep(0.45, 0.70, uv.y));
    else
        col = mix(c3, c4, smoothstep(0.70, 1.00, uv.y));

    gl_FragColor = vec4(col, 1.0);
}
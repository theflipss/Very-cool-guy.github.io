// This is compiled code from ts hence ugly
"use strict";

const SHADER_CANVAS_SHADERS = {
    "main.vert": `
        attribute vec2 a_position;
        varying vec2 v_texcoord;

        void main() {
            v_texcoord = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `,
    "lesbian.frag": `
        precision mediump float;

        varying vec2 v_texcoord;

        uniform vec2 iResolution;
        uniform float iTime;

        void main()
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
    `
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Failed to create shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Shader compilation failed: " + info);
    }
    return shader;
}
function initShaderCanvas() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.getElementById("shader-canvas");
        if (!canvas) {
            throw new Error("Canvas element not found");
        }
        const gl = canvas.getContext("webgl");
        if (!gl) {
            throw new Error("WebGL not supported");
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        function getShaderSource(name, type) {
            const key = `${name}.${type}`;
            const source = SHADER_CANVAS_SHADERS[key];

            if (!source) {
                throw new Error(`Shader not found in constants: ${key}`);
            }

            return source;
        }
        const vertexShaderName = canvas.dataset.vert || "main";
        const vertexShaderSource = getShaderSource(vertexShaderName, "vert");
        const fragmentShaderName = canvas.dataset.frag || "main";
        const fragmentShaderSource = getShaderSource(fragmentShaderName, "frag");
        const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            throw new Error("Failed to create shader program");
        }
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
        const vertices = new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, 1.0,
            1.0, -1.0,
        ]);
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            throw new Error("Failed to create buffer");
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);
        const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "iResolution");
        const timeUniformLocation = gl.getUniformLocation(shaderProgram, "iTime");
        animateShaderCanvas(canvas, gl, resolutionUniformLocation, timeUniformLocation);
    });
}
function animateShaderCanvas(canvas, gl, resolutionUniformLocation, timeUniformLocation) {
    canvas.width = window.innerWidth * window.devicePixelRatio * 1.0;
    canvas.height = window.innerHeight * window.devicePixelRatio * 1.0;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const time = performance.now() / 1000;
    if (resolutionUniformLocation)
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    if (timeUniformLocation)
        gl.uniform1f(timeUniformLocation, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(() => animateShaderCanvas(canvas, gl, resolutionUniformLocation, timeUniformLocation));
}
initShaderCanvas();
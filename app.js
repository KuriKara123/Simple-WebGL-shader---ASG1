window.onload = function() {
    
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    let fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    let shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);

    gl.uniform4f(colorUniform, 1.0, 0.0, 0.0, 1.0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.changeColor = function(colorIndex) {
        if (colorIndex === 1) {
            gl.uniform4f(colorUniform, 1.0, 0.0, 0.0, 1.0);
        } else if (colorIndex === 2) {
            gl.uniform4f(colorUniform, 0.0, 1.0, 0.0, 1.0);
        } else if (colorIndex === 3) {
            gl.uniform4f(colorUniform, 0.0, 0.0, 1.0, 1.0);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    window.resetColor = function() {
        gl.uniform4f(colorUniform, 1.0, 0.0, 0.0, 1.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
};

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

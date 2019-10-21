var vertexShaderText =
    [
        'precision mediump float;', // use medium precision on floating parameters
        '',
        'attribute vec3 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        '',
        'void main()',
        '{',
        ' fragColor = vertColor;',
        ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);', // vertPosition has already  got 2 position units so we use them for 4 vec positions
        '}' // vertPosition * mWorld matrix * mView * mProj
    ].join('\n');

var fragmentShaderText =
    [
        'precision mediump float;', // use medium precision on floating parameters
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        ' gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');

var InitDemo = function () {

// WebGl get Context Preparation

    console.log('This is working'); /* The text is in the browser's console */

    var canvas = document.getElementById('game-surface'); /* Pass the name of any id element from HTML
    and the 'document.getElementById is gonna transform the tag's id into a JS class */

    var gl = canvas.getContext('webgl'); /* Gets the context */

    if(!gl) { // If our browser doesn't support webgl format as InternetExplorer then run this code
        console.log('WebGl not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if(!gl) { // If the browser doesn't support webgl this message appeares in console
        alert('Your browser does not support WebGl!');
    }


// Initialization

    // Preparation of the plate

    gl.clearColor(0.75, 0.8, 0.85, 1.0); /* In order to set-up the color of the plate use gl.clear(R, G, B, A)*/
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); /* In order to use the plate use gl.clear() */
    gl.enable(gl.DEPTH_TEST); // Checking the depth of our composition
    gl.enable(gl.CULL_FACE); // Done in order to save some extra memory space
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    /*
    gl.COLOR_BUFFER_BIT =>
    gl.DEPTH_BUFFER_BIT =>
    */

    // Drawing the triangle

    /*Create Shaders*/
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    /*compile the fragment and shader source*/
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    /*compile shaders and shaders*/
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) { // Check if the shader is compilable
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader)); // Show the error and get info about the error of the shader
        return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { // Check if the fragment is compilable
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    /*Use fragmentShader and vertexShader simultaniously when we open the program, attach the programs*/
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    /*Link programs together*/
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) { // check for link errors
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    /*validating program done in debuging only*/
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program', gl.getProgramInfoLog(program));
        return;
    }

    /*Create buffer*/
    var boxVertices = // This runs on CPU
        [ // X, Y, Z       R, G, B
            // Top
            -1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
            1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
            1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

            // Left
            -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

            // Right
            1.0, 1.0, 1.0,     0.25, 0.25, 0.75,
            1.0, -1.0, 1.0,    0.25, 0.25, 0.75,
            1.0, -1.0, -1.0,   0.25, 0.25, 0.75,
            1.0, 1.0, -1.0,    0.25, 0.25, 0.75,

            // Front
            1.0, 1.0, 1.0,     1.0, 0.0, 0.15,
            1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0,   1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

            // Back
            1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
            1.0, -1.0, -1.0,   0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0,  0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0,   0.0, 1.0, 0.15,

            // Bottom
            -1.0, -1.0, -1.0,  0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0,   0.5, 0.5, 1.0,
            1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
            1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
        ];

    var boxIndices = // We comunicate here which vertices form a face of the cube
        [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Botton
            21, 20, 22,
            22, 20, 23
        ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject); // active buffer is an array one that is passsed  to GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offest from the begenning od a single vertex to this attribute
    );

    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offest from the begenning od a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Tell OpenGl state machine which program should be active.
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld'); // Location for matrixes in GPU memory
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    // Creat identity matrix to connect all dots
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]); // Setting up a camera
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    /* Now we got 3 var on our CPU and RAM */

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); // Sending our matrixes over the shaders
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16); // Done in order to make the object rotate arond X axes
    var yRotationMatrix = new Float32Array(16); // Done in order to make the object rotate arond Y axes

    /*Main render loop*/

    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function() { // create a function loop that will  give animation to our object
        angle = performance.now() / 1000 / 6 * 2 * Math.PI; // get the number of seconds when the window is opened
        mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop); // whaterver function is inside, it calls the animation
    };
    requestAnimationFrame(loop);

};
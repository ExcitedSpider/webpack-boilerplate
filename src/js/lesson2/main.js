import vertexShaderSrc from './vertex-basic.glsl'
import fragmentShaderSrc from './fragment-basic.glsl'

export const main = () => {
  const canvas = document.querySelector('#canvas-webgl2')

  const gl = canvas.getContext('webgl2')
  if (!gl) {
    return
  }

  resizeCanvasToDisplaySize(gl.canvas)

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  const program = createProgram(gl, vertexShader, fragmentShader)

  bufferPositions(gl, program)

  bufferColors(gl, program)

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.useProgram(program)
  
  // set uniforms
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionUniformLocation, 100, 100);

  const colorUniformLocation = gl.getUniformLocation(program, "u_color");
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function bufferColors(gl, program) {
  const colorLocation = gl.getAttribLocation(program, "a_color");

   // Create a buffer for the colors.
   const buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
   // Set the colors.
   // Pick 2 random colors.
  const r1 = Math.random() * 256;
  const b1 = Math.random() * 256;
  const g1 = Math.random() * 256;
 
  const r2 = Math.random() * 256;
  const b2 = Math.random() * 256;
  const g2 = Math.random() * 256;
 
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array(
        [ r1, b1, g1, 255,
          r1, b1, g1, 255,
          r1, b1, g1, 255,
          r2, b2, g2, 255,
          r2, b2, g2, 255,
          r2, b2, g2, 255]),
      gl.STATIC_DRAW);

  gl.enableVertexAttribArray(colorLocation);
  const size = 4;
  const type = gl.UNSIGNED_BYTE;
  const normalize = true;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
}


function bufferPositions(gl, program) {
  const positionBuffer = gl.createBuffer()

  // Tell gpu which buffer is the data transfer target 
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  
  // Transfer data to gpu buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
  ]), gl.STATIC_DRAW)

  // Tell gpu which variable is used in shader program to bind the buffer
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  let size = 2 // 2 components per iteration
  let type = gl.FLOAT // the data is 32bit floats
  let normalize = false // don't normalize the data
  let stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0 // start at the beginning of the buffer
  
  // Transfer data to vao
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

  // Enable VAO
  gl.enableVertexAttribArray(positionAttributeLocation)
}



function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const dpr = window.devicePixelRatio;
  const displayWidth  = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  != displayWidth || 
                     canvas.height != displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}
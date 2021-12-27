'use strict'

import vertexShaderSource from './vs.glsl'
import fragmentShaderSource from './fs.glsl'

export function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  let canvas = document.querySelector('#canvas-webgl2')
  let gl = canvas.getContext('webgl2')
  if (!gl) {
    return
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource])

  // look up where the vertex data needs to go.
  let positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

  // look up uniform locations
  let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
  let colorLocation = gl.getUniformLocation(program, 'u_color')
  let translationLocation = gl.getUniformLocation(program, 'u_translation')

  // Create a buffer
  let positionBuffer = gl.createBuffer()

  // Create a vertex array object (attribute state)
  let vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // Set Geometry.
  setGeometry(gl)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  let size = 2 // 2 components per iteration
  let type = gl.FLOAT // the data is 32bit floats
  let normalize = false // don't normalize the data
  let stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

  // First let's make some variables
  // to hold the translation,
  let translation = [0, 0]
  let color = [Math.random(), Math.random(), Math.random(), 1]

  drawScene()

  // Setup a ui.
  setupUI()

  function setupUI() {
    const uiContainer = document.querySelector('.ui-container')

    if(uiContainer){
      const xSlide = document.createElement('div')
      xSlide.id = 'x'
      uiContainer.appendChild(xSlide)

      const ySlide = document.createElement('div')
      ySlide.id = 'y'
      uiContainer.appendChild(ySlide)
    }


    webglLessonsUI.setupSlider('#x', { slide: updatePosition(0), max: gl.canvas.width })
    webglLessonsUI.setupSlider('#y', { slide: updatePosition(1), max: gl.canvas.height })

    function updatePosition(index) {
      return function (event, ui) {
        translation[index] = ui.value
        drawScene()
      }
    }
  }

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas)

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // Clear the canvas
    gl.clearColor(1, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao)

    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    // Set the color.
    gl.uniform4fv(colorLocation, color)

    // Set the translation.
    gl.uniform2fv(translationLocation, translation)

    // Draw the geometry.
    let primitiveType = gl.TRIANGLES
    let offset = 0
    let count = 18
    gl.drawArrays(primitiveType, offset, count)
  }
}

// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

      // top rung
      30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

      // middle rung
      30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
    ]),
    gl.STATIC_DRAW
  )
}

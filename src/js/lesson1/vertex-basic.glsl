#version 300 es

in vec2 a_position;
out vec4 v_color;

uniform vec2 u_resolution;

// all shaders have a main function
void main() {
    // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clip space)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_color = gl_Position * 0.8 + 0.2;
}
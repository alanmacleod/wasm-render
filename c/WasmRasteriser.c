

// WasmRasteriser.c
//        Triangle texture mapper with correct perspective and simple lighting
//        Alan MacLeod, 2017
//        alanmacleod.eu
//        github.com/alanmacleod
//
//       Inspired by portions of Dmitry V. Sokolov' course work: https://github.com/ssloy
//

#include <stdio.h>
#include <stdbool.h>

#include "WasmRasteriser.h"

#define BYTES_PER_PIXEL 4
#define BIT_SHIFT_PER_PIXEL 2


/* IMPORTANT NOTE: printf() from here (to browser console) *ONLY WORKS IF* you
                include a newline escape char '\n' in the string otherwise
                it's ignored! */

/* NOTE:  Some guides insisted I need this typedef declaration:
          EMSCRIPTEN_KEEPALIVE; on all my exported functions but that
          doesn't seem to be the case upon testing
          #include <emscripten/emscripten.h> */

/* Function declarations, just to see at a glance what's in here */
void init( unsigned int *, float *,unsigned int, unsigned int );
void tri( int, int, float, float,float, int, int,float, float, float,
                int, int,float,float, float, unsigned char*, unsigned int, float );
void fill( unsigned int );
int pset( int, int, unsigned int val );
void vline( int, int, int, unsigned int );
void barycentric( int Px, int Py, int ax, int ay, int bx, int by,
                              int cx, int cy, float *o0, float *o1, float* o2);

bool initialised = false;

unsigned int *heap_ptr = NULL;
float *heap_zbuffer_ptr = NULL; // 32-bit float

unsigned int buffer_width       = 0;
unsigned int buffer_height      = 0;
unsigned int buffer_num_pixels  = 0;
unsigned int buffer_num_bytes   = 0;


void init(unsigned int *buffer, float *zbuffer, unsigned int width, unsigned int height)
{
  heap_ptr = buffer;
  heap_zbuffer_ptr = zbuffer;

  buffer_width = width;
  buffer_height = height;
  buffer_num_pixels = width * height;
  buffer_num_bytes = buffer_num_pixels * BYTES_PER_PIXEL;

  initialised = true;
}


// No longer used, now expanded inline inside tri() function
void barycentric( int Px, int Py, int ax, int ay, int bx, int by,
                              int cx, int cy, float *o0, float *o1, float* o2)
{
  // Cache per triangle
  int va0 = cx - ax;
  int va1 = bx - ax;

  // Recalculate per pixel
  int va2 = ax - Px;

  // Cache per triangle
  int vb0 = cy - ay;
  int vb1 = by - ay;

  // Recalculate per pixel
  int vb2 = ay - Py;

  // Vector2.ts: Vector3.cross( va, vb, bc );
  // vec/cross product of two vectors
  // Recalculate
  int bc0 = va1 * vb2 - va2 * vb1;
  int bc1 = va2 * vb0 - va0 * vb2;

  // bc2 = (cx - ax) * (by - ay) - (bx - ax) * (cy - ay);

  // Cache
  int bc2 = va0 * vb1 - va1 * vb0;

  // outside
  if (Math_abs(bc2) < 1)
  {
    *o0 = -1;
    *o1 = -1;
    *o2 = -1;
    return;
  }

  float iz = 1 / (float)bc2;

  *o0 = 1.0 - ((float)(bc0 + bc1)) * iz;
  *o1 = ((float)bc1) * iz;
  *o2 = ((float)bc0) * iz;
}

// Uses a barycentric coord technique of rasterisation I found here
// in this excellent course/repo: https://github.com/ssloy/tinyrenderer

// Shaded, perspective-correct, textured triangle
void tri( int p0x, int p0y, float p0z, float u0, float v0,
          int p1x, int p1y, float p1z, float u1, float v1,
          int p2x, int p2y, float p2z, float u2, float v2,
                      unsigned char*texels, unsigned int texwid, float light)
{
  //BBOX
  int minx = Math_min(p0x, Math_min(p1x, p2x));
  int maxx = Math_max(p0x, Math_max(p1x, p2x));
  int miny = Math_min(p0y, Math_min(p1y, p2y));
  int maxy = Math_max(p0y, Math_max(p1y, p2y));

  // Cheating here, assumes square
  int texmaxu = texwid-1, texmaxv = texwid-1;

  // Clipping
  minx = Math_max(0, minx);
  miny = Math_max(0, miny);
  maxx = Math_min(buffer_width-1, maxx);
  maxy = Math_min(buffer_height-1, maxy);

  if (maxx < 0) return;
  if (maxy < 0) return;
  if (minx >= buffer_width) return;
  if (miny >= buffer_height) return;

  // float o0=0, o1=0, o2=0;
  int tu, tv;
  float u, v;
  int to, bo;

  int x, y;

  // Perspective correct shizz
  float inv_p0z = 1 / p0z;
  float inv_p1z = 1 / p1z;
  float inv_p2z = 1 / p2z;

  float inv_p0u = u0 * inv_p0z;
  float inv_p1u = u1 * inv_p1z;
  float inv_p2u = u2 * inv_p2z;

  float inv_p0v = v0 * inv_p0z;
  float inv_p1v = v1 * inv_p1z;
  float inv_p2v = v2 * inv_p2z;

  float inv_Pz, inv_Pu, inv_Pv;

  int r, g, b;

  // Barycentre setup, cache vectors
  int va0 = p2x - p0x;
  int va1 = p1x - p0x;
  int va2;

  int vb0 = p2y - p0y;
  int vb1 = p1y - p0y;
  int vb2;

  int bc0;
  int bc1;
  int bc2 = va0 * vb1 - va1 * vb0;

  if (Math_abs(bc2) < 1) // TODO: move this test before the inv_p0z calcs
    return;

  float oiz = 1 / (float)bc2;

  float o0, o1, o2;

  // Two divides per pixel, about as good as we can get with persp correct barycentres
  for (y=miny; y<=maxy; y++)
  {
    for (x=minx; x<=maxx; x++)
    {
      va2 = p0x - x;
      vb2 = p0y - y;

      bc0 = va1 * vb2 - va2 * vb1;
      bc1 = va2 * vb0 - va0 * vb2;

      o0 = 1.0 - ((float)(bc0 + bc1)) * oiz;
      o1 = ((float)bc1) * oiz;
      o2 = ((float)bc0) * oiz;

      if (o0 < 0 || o1 < 0 || o2 < 0)
        continue;

      inv_Pz =  inv_p0z * o0 +
                inv_p1z * o1 +
                inv_p2z * o2;

      // Buffer offset on the screen and z-buffer
      bo = y * buffer_width + x;

      // Z-buffer test rejection, updating
      if (heap_zbuffer_ptr[bo] > inv_Pz) continue;
      heap_zbuffer_ptr[bo] = inv_Pz;

      // Definitely going to draw something now, so finish the remaining calcs
      inv_Pu =  inv_p0u * o0 +
                inv_p1u * o1 +
                inv_p2u * o2;

      inv_Pv =  inv_p0v * o0 +
                inv_p1v * o1 +
                inv_p2v * o2;

      u = ( (inv_Pu / inv_Pz) * texmaxu );
      v = ( (inv_Pv / inv_Pz) * texmaxv );

      // Texture offset
      to = ((int)v * texwid << BIT_SHIFT_PER_PIXEL) + ((int)u << BIT_SHIFT_PER_PIXEL);

      r = Math_min( 255, (int)(((float)texels[ to + 0 ]) * light) );
      g = Math_min( 255, (int)(((float)texels[ to + 1 ]) * light) );
      b = Math_min( 255, (int)(((float)texels[ to + 2 ]) * light) );

      // Magic number = Alpha = (255 << 24)
      heap_ptr[ bo ] = 4278190080 + (b << 16) + (g << 8) + r; // bytepack colour expression
    }
  }

}

// Horribly inefficient fill routine for testing
void fill(unsigned int val)
{
  if (!initialised) return;

  for (int t=0; t<buffer_num_pixels; t++)
    heap_ptr[t] = val;
}

// More test code, not used in the program
inline int pset(int x, int y, unsigned int val)
{
  // Quick reject test
  if (x < 0) return 0;
  if (y < 0) return 0;
  if (x >= buffer_width) return 0;
  if (y >= buffer_height) return 0;

  heap_ptr[ y * buffer_width + x ] = val;

  return 29;
}

// Yet more test code, not used in the program
void vline(int x, int y1, int y2, unsigned int val)
{
  if (!initialised) return;

  // completely off the buffer
  if (x < 0) return;
  if (x >= buffer_width) return;

  // clip negative Y
  if (y1 < 0) y1 = 0;
  // return if start is off bottom of viewport
  if (y1 >= buffer_height) return;
  // clip overflow Y
  if (y2 >= buffer_height) y2 = buffer_height -1;
  // return if end is before start of viewport
  if (y2 < 0) return;

  // Draw the line, coords should be valid here
  for (int y=y1; y<=y2; y++)
  {
    int o = y * buffer_width + x;
    heap_ptr[o] = val;
  }
}

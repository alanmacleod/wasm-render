
// WasmRasteriser.c
//        Alan MacLeod, 2017
//        alanmacleod.eu
//        github.com/alanmacleod

#include <stdio.h>
#include <stdbool.h>
// #include "vec3.h"
#include "WasmRasteriser.h"

#define BYTES_PER_PIXEL 4

/* IMPORTANT NOTE: printf() from here (to browser console) *ONLY WORKS IF* you
                include a newline escape char '\n' in the string otherwise
                it's ignored! */

/* NOTE:  Some guides insisted I need this typedef declaration:
          EMSCRIPTEN_KEEPALIVE; on all my exported functions but that
          doesn't seem to be the case upon testing
          #include <emscripten/emscripten.h> */

/* Function declarations, just to see at a glance what's in here */
void init( unsigned int *, unsigned int, unsigned int, unsigned int * );
void exec_jobs ( unsigned int );
void tri( int, int, float, float,float, int, int,float, float, float,
                int, int,float,float, float, unsigned char*, unsigned int );
void fill( unsigned int );
int pset( int, int, unsigned int val );
void vline( int, int, int, unsigned int );
void barycentric( int Px, int Py, int ax, int ay, int bx, int by,
                              int cx, int cy, float *o0, float *o1, float* o2);

bool initialised = false;

unsigned int *heap_ptr = NULL;

unsigned int buffer_width       = 0;
unsigned int buffer_height      = 0;
unsigned int buffer_num_pixels  = 0;
unsigned int buffer_num_bytes   = 0;

unsigned int *job_ptr = NULL;

// void testExtern()
// {
//   vec3 v0, v1, out;
//
//   v0.x = 1;
//   v0.y = 2;
//   v0.z = 3;
//
//   v1.x = 2;
//   v1.y = 3;
//   v1.z = 4;
//
//   vec3_add(v0, v1, out);
// }

void init(unsigned int *buffer, unsigned int width, unsigned int height, unsigned int *jobs)
{
  heap_ptr = buffer;
  job_ptr = jobs;

  buffer_width = width;
  buffer_height = height;
  buffer_num_pixels = width * height;
  buffer_num_bytes = buffer_num_pixels * BYTES_PER_PIXEL;

  initialised = true;
}

// Execute all jobs in the task buffer one by one
void exec_jobs(unsigned int num)
{
  int o = 0;
  int x = 0, y = 0;
  int p0x,  p0y,  p1x,  p1y,  p2x,  p2y;
  unsigned char *texture_ptr;
  unsigned int texture_wid;

  float u0, v0, u1, v1, u2, v2;

  // float o0, o1, o2;
  //
  // // barycentric(
  // //   10, 10,
  // //   0, 0,
  // //   100, 0,
  // //   0, 100,
  // //   &o0, &o1, &o2
  // // );
  // //
  // // // printf("%f, %f, %f \n", o0, o1, o2);
  // //
  // // return;
  // //

  //
  // for (y=0; y<buffer_width; y++)
  // {
  //   pset(y, y, 4278190080);
  // }

  // no "job type" header for now. Assume triangles in coord pairs (six int32s)
  for (int i = 0; i< num; i++)
  {
    p0x = job_ptr[o++];
    p0y = job_ptr[o++];
    u0  = ((float)(job_ptr[o++])) / 65536;
    v0  = ((float)(job_ptr[o++])) / 65536;

    p1x = job_ptr[o++];
    p1y = job_ptr[o++];
    u1  = ((float)(job_ptr[o++])) / 65536;
    v1  = ((float)(job_ptr[o++])) / 65536;

    p2x = job_ptr[o++];
    p2y = job_ptr[o++];
    u2  = ((float)(job_ptr[o++])) / 65536;
    v2  = ((float)(job_ptr[o++])) / 65536;

    texture_ptr = (unsigned char *)job_ptr[o++];
    texture_wid = (unsigned int)job_ptr[o++];

    // tri(p0x, p0y, u0, v0, p1x, p1y, u1, v1, p2x, p2y, u2, v2, texture_ptr, texture_wid);

    // pset(p0x, p0y, 4278190080);
    // pset(p1x, p1y, 4278190080);
    // pset(p2x, p2y, 4278190080);

    // for (int p = 0; p<3; p++)
    // {
    //   x = job_ptr[o++];
    //   y = job_ptr[o++];
    //   pset(x, y, 4278190080);
    // }
  }

}

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
  int bc0 = va1 * vb2 - va2 * vb1;
  int bc1 = va2 * vb0 - va0 * vb2;
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

void tri( int p0x, int p0y, float p0z, float u0, float v0,
          int p1x, int p1y, float p1z, float u1, float v1,
          int p2x, int p2y, float p2z, float u2, float v2,
                      unsigned char*texels, unsigned int texwid)
{
  //BBOX
  int minx = Math_min(p0x, Math_min(p1x, p2x));
  int maxx = Math_max(p0x, Math_max(p1x, p2x));
  int miny = Math_min(p0y, Math_min(p1y, p2y));
  int maxy = Math_max(p0y, Math_max(p1y, p2y));

  int texmaxu = 511, texmaxv = 511;

  // Clipping
  minx = Math_max(0, minx);
  miny = Math_max(0, miny);
  maxx = Math_min(buffer_width-1, maxx);
  maxy = Math_min(buffer_height-1, maxy);

  if (maxx < 0) return;
  if (maxy < 0) return;
  if (minx >= buffer_width) return;
  if (miny >= buffer_height) return;

  float o0=0, o1=0, o2=0;
  int tu, tv;
  float u, v;
  int to;

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

  for (y=miny; y<=maxy; y++)
  {
    for (x=minx; x<=maxx; x++)
    {

      barycentric(x, y, p0x, p0y, p1x, p1y, p2x, p2y, &o0, &o1, &o2);

      if (o0 < 0 || o1 < 0 || o2 < 0)
        continue;

      inv_Pz =  inv_p0z * o0 +
                inv_p1z * o1 +
                inv_p2z * o2;

      inv_Pu =  inv_p0u * o0 +
                inv_p1u * o1 +
                inv_p2u * o2;

      inv_Pv =  inv_p0v * o0 +
                inv_p1v * o1 +
                inv_p2v * o2;

      u = ((inv_Pu / inv_Pz) * texmaxu);
      v = ((inv_Pv / inv_Pz) * texmaxv);

      to = ((int)v * texwid << 2) + ((int)u << 2);

      r = texels[ to + 0 ];
      g = texels[ to + 1 ];
      b = texels[ to + 2 ];

      // Magic number = Alpha = (255 << 24)
      heap_ptr[ y * buffer_width + x ] = 4278190080 + (b << 16) + (g << 8) + r;

    }
  }

}

/* Horribly inefficient fill routine */
void fill(unsigned int val)
{
  if (!initialised) return;

  for (int t=0; t<buffer_num_pixels; t++)
    heap_ptr[t] = val;
}

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

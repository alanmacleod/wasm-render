
// WasmRasteriser.c
//        Alan MacLeod, 2017
//        alanmacleod.eu
//        github.com/alanmacleod

#include <stdio.h>
#include <stdbool.h>
// #include "vec3.h"
#include "WasmRasteriser.h"

#define BYTES_PER_PIXEL 4

/* NOTE:  Some guides insisted I need this declaration:
          EMSCRIPTEN_KEEPALIVE; for all my exported functions but that
          doesn't seem to be the case upon testing
          #include <emscripten/emscripten.h> */

/* Function declarations, just to see at a glance what's in here */
void init( unsigned int *, unsigned int, unsigned int, unsigned int * );
void exec_jobs ( unsigned int );
void fill( unsigned int );
int pset( int, int, unsigned int val );
void vline( int, int, int, unsigned int );

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

void exec_jobs(unsigned int num)
{
  int o = 0;
  int x = 0, y = 0;
  //
  // for (y=0; y<buffer_width; y++)
  // {
  //   pset(y, y, 4278190080);
  // }

  // no "job type" header for now. Assume triangles in coord pairs (six int32s)
  for (int i = 0; i< num; i++)
  {
    for (int p = 0; p<3; p++)
    {
      x = job_ptr[o++];
      y = job_ptr[o++];
      pset(x, y, 4278190080);
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

int pset(int x, int y, unsigned int val)
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

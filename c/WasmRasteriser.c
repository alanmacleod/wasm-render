
#include <stdio.h>
#include <stdbool.h>

#define BYTES_PER_PIXEL 4

/* NOTE:  Some guides insisted I need this declaration:
          EMSCRIPTEN_KEEPALIVE; for all my exported functions but that
          doesn't seem to be the case upon testing
          #include <emscripten/emscripten.h> */

/* Function declarations, just to see at a glance what's in here */
void init( unsigned int *, unsigned int, unsigned int );
void fill( unsigned int );
void pset( int, int, unsigned int val );
void vline( int, int, int, unsigned int );

bool initialised = false;

unsigned int *heap_ptr = NULL;

unsigned int buffer_width       = 0;
unsigned int buffer_height      = 0;
unsigned int buffer_num_pixels  = 0;
unsigned int buffer_num_bytes   = 0;

void init(unsigned int *buffer, unsigned int width, unsigned int height)
{
  heap_ptr = buffer;

  buffer_width = width;
  buffer_height = height;
  buffer_num_pixels = width * height;
  buffer_num_bytes = buffer_num_pixels * BYTES_PER_PIXEL;

  initialised = true;
}

/* Horribly inefficient fill routine */
void fill(unsigned int val)
{
  if (!initialised) return;

  for (int t=0; t<buffer_num_pixels; t++)
    heap_ptr[t] = val;
}

void pset(int x, int y, unsigned int val)
{
  // Quick reject test
  if (x < 0) return;
  if (y < 0) return;
  if (x >= buffer_width) return;
  if (y >= buffer_height) return;

  heap_ptr[ y * buffer_width + x ] = val;
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


/*
void addOne(unsigned char val, unsigned char *heap, int len)
{
  // printf("buffer_num_pixels: %i\n", buffer_num_pixels);
  // // printf("addOne() called");
  // return;

  // fprintf(stdout, "Hello");
  // return;
  //
  // int internal_val = 0;
  //
  // //std::cout << "Hello Alan, from WASM!" << std::endl;
  // // EM_ASM(
  // //   // Shows a Javascript window.alert() ... literally wtf !
  // //   //NOTE: this is blocking, as per usual js behaviour, execution halts
  // //   //      here until dialog closed
  // //   alert('wtf');
  // // );
  //
  // // NOTE: I did not see this mentioned anywhere, but it seems
  // //       by default stdout is not defined for `printf()` so this does nothing!
  // //    printf("Hello from WASM in *C* !!");
  // // However specifying stdout manually works via `fprintf()`
  // //fprintf(stdout, "t = %i !!\n", val);
  //
  // fprintf(stdout, "internal_val = %i", internal_val);
  //
  // internal_val = (int)val;
  //
  // // int t = 0;//, val = 0;
  int t = 0;
  for (t=0; t<len; t+=4)
  {
    //val = heap[t];

    heap[t+0] = val;
    heap[t+1] = val;
    heap[t+2] = 0;
    heap[t+3] = 255;
  }
  //
  // return;
}
*/

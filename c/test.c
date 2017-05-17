

//#include <iostream>
#include <stdio.h>
// #include <emscripten/emscripten.h>

// NOTE: Some guides insisted I need this declaration:
//       EMSCRIPTEN_KEEPALIVE; for all my exported functions but that
//       doesn't seem to be the case upon testing
//      #include <emscripten/emscripten.h>

#ifdef __cplusplus
  extern "C" {
#endif


void addOne(unsigned char val, unsigned char *heap, int len) {
  //std::cout << "Hello Alan, from WASM!" << std::endl;
  // EM_ASM(
  //   // Shows a Javascript window.alert() ... literally wtf !
  //   //NOTE: this is blocking, as per usual js behaviour, execution halts
  //   //      here until dialog closed
  //   alert('wtf');
  // );

  // NOTE: I did not see this mentioned anywhere, but it seems
  //       by default stdout is not defined for `printf()` so this does nothing!
  //    printf("Hello from WASM in *C* !!");

  // However specifying stdout manually works via `fprintf()`
  int t = 0;//, val = 0;
  for (t=0; t<len; t+=4)
  {
    //val = heap[t];
    //fprintf(stdout, "t = %i !!\n", val);
    heap[t+0] = 0;
    heap[t+1] = val;
    heap[t+2] = 0;
    heap[t+3] = 255;
  }

  return;
}







#ifdef __cplusplus
}
#endif

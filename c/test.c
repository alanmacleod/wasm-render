

//#include <iostream>
#include <stdio.h>
// #include <emscripten/emscripten.h>

// NOTE: Some guides insisted I need this declaration:
//       EMSCRIPTEN_KEEPALIVE for all my exported functions but that
//       doesn't seem to be the case upon testing
//      #include <emscripten/emscripten.h>

#ifdef __cplusplus
  extern "C" {
#endif


void addOne(int *heap) {
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
  int t = 0, val = 0;
  for (t=0; t<5; t++)
  {
    val = heap[t];
    fprintf(stdout, "t = %i !!\n", val);
  }

  return;
}







#ifdef __cplusplus
}
#endif

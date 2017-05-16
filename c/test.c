

//#include <iostream>
#include <stdio.h>

// NOTE: Some guides insisted I need this declaration:
//       EMSCRIPTEN_KEEPALIVE for all my exported functions but that
//       doesn't seem to be the case upon testing
//      #include <emscripten/emscripten.h>

#ifdef __cplusplus
  extern "C" {
#endif


int addOne(int val) {
  //std::cout << "Hello Alan, from WASM!" << std::endl;

  // NOTE: I did not see this mentioned anywhere, but it seems
  //       the default stdout is not defined for `printf()` so this does nothing!
  //    printf("Hello from WASM in *C* !!");

  // However specifying stdout manually works via `fprintf()``
  fprintf(stdout, "Hello Alan, from WASM in *C* !!\n");

  return val + 1;
}







#ifdef __cplusplus
}
#endif

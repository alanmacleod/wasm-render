

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


int addOne(int val) {
  //std::cout << "Hello Alan, from WASM!" << std::endl;

  int src = 1;
  int dst;

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
  fprintf(stdout, "Hello hello hello, from WASM in *C*, it works etc !!\n");

  return val + 1;
}







#ifdef __cplusplus
}
#endif

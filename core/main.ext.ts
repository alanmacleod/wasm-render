
// Define interfaces for external js contracts



// Global mess made by Emscripten's boilerplate
export interface WasmInstance
{
  // stdlib
  _malloc(size: number): number;

  // exports
 _init( heap_ptr:number, width:number, height:number, job_ptr: number ): void;
 _exec_jobs( num_jobs:number ):void;
 _fill( val:number ): void;
 _vline( x:number, y1:number, y2:number, val:number ): void;
 _pset( x:number, y:number, val:number ): number;

  // heap
  buffer: ArrayBuffer;
}


// Unexported stats.min.js from ThreeJS
export interface ThreeStats
{
  showPanel(which: number): void;
  begin():  void;
  end():    void;
  dom:      HTMLElement;
}

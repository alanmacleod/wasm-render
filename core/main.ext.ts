

// Define interfaces for external js objects

// Global mess made by Emscripten's boilerplate
export interface WasmInstance
{
  _malloc(size: number): number;
  buffer:   any;
  _addOne:  any;
}


// Unexported stats.min.js from ThreeJS
export interface ThreeStats
{
  showPanel(which: number): void;
  begin():  void;
  end():    void;
  dom:      HTMLElement;
}

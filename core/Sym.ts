
export const BYTES_PER_PIXEL:number = 4;
export const BIT_SHIFT_PER_PIXEL:number = 2; // e.g. texelU << 2
export const ALPHA_MAGIC_NUMBER:number = 4278190080;
export const MAX_WASM_TASKS_PER_FRAME = 1000; // arbitrary really;

// Byte sizes, should probably be machine words but whatevz
export const INT32 = 4, PTR32 = 4, FLOAT32 = 4, FLOAT64 = 8;

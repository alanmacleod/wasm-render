
#define BYTES_PER_PIXEL 4
#define BIT_SHIFT_PER_PIXEL 2
#define PERSPECTIVE_CORRECT_MODE

//  macros
#define Math_min(a,b) (((a) < (b)) ? (a) : (b))
#define Math_max(a,b) (((a) > (b)) ? (a) : (b))
#define Math_clamp(a, mi, ma) Math_min(Math_max(a, mi), ma)
#define Math_abs(a) ((a) < 0 ? -(a) : (a))
#define Math_sign(v) (((v) > 0) - ((v) < 0))

// // Define external funcs
// extern void vec3_add(vec3, vec3, vec3);
// extern void vec3_sub(vec3, vec3, vec3);
// extern void vec3_mul(vec3, float, vec3);
// extern void vec3_div(vec3, float, vec3);

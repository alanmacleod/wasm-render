

// NOTE: Not used, abandoned plans



#include "vec3.h"
#include "vec2.h"
#include <math.h>

void vec3_add(vec3 va, vec3 vb, vec3 out)
{
  out.x = va.x + vb.x;
  out.y = va.y + vb.y;
  out.z = va.z + vb.z;
}

void vec3_sub(vec3 va, vec3 vb, vec3 out)
{
  out.x = va.x - vb.x;
  out.y = va.y - vb.y;
  out.z = va.z - vb.z;
}

void vec3_mul(vec3 va, float scalar, vec3 out)
{
  out.x = va.x * scalar;
  out.y = va.y * scalar;
  out.z = va.z * scalar;
}

void vec3_div(vec3 va, float scalar, vec3 out)
{
  out.x = va.x / scalar;
  out.y = va.y / scalar;
  out.z = va.z / scalar;
}

vec3 vec3_cross(vec3 v1, vec3 v2)
{
  vec3 out;

  out.x = v1.y * v2.z - v1.z * v2.y;
  out.y = v1.z * v2.x - v1.x * v2.z;
  out.z = v1.x * v2.y - v1.y * v2.x;

  return out;
}

void vec3_barycentric(vec2 p0, vec2 p1, vec2 p2, vec2 P)
{
  //vec3 r = {.x = -1, .y = 1, .z = 1};
  //vec3 r; r.x = -1;
  // vec3 a = {.x = p2.x - p0.x, .y = p1.x - p0.x, .z = p0.x - P.x};
  // vec3 b = {.x = p2.y - p0.y, .y = p1.y - p0.y, .z = p0.y - P.y)};
  // vec3 u = vec3_cross(a,b);
  //
  // if (fabs(u.z) < 1)
  //  return r;
  //
  // r.x = 1.0f - (u.x + u.y) / u.z;
  // r.y = u.y / u.z;
  // r.z = u.x / u.z;

}

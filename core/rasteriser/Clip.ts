

// Crusty old JS line routine I had lying around, cba to port to TS properly
// Therein lies a strength/weakness with TS ... I don't have to.

export default class Clip
{
  constructor() {}

  public static line(x1, y1, x2, y2, x_min, y_min, x_max, y_max):any
  {
    let [u1, u2] = [ 0.0, 1.0 ];
    let line_out = { x0: 0, y0: 0, x1: 0, y1:0, visible: false};

    let delta_x = x2 - x1;
    let delta_y = y2 - y1;

    let p_part = [ -1.0 * delta_x, delta_x, -1 * delta_y, delta_y ];
    let q_part = [ x1 - x_min, x_max - x1, y1 - y_min, y_max - y1 ];

    let accept = true;

    for (let i=0; i<4; i++)
    {
        let p = p_part[i];
        let q = q_part[i];

        if (p == 0.0 && q < 0.0)
        {
            accept = false;
            break;
        }

        let r = q / p;
        if (p < 0) u1 = Math.max(u1, r);
        if (p > 0) u2 = Math.min(u2, r);

        if (u1 > u2)
        {
            accept = false;
            break;
        }
    }

    if (accept)
    {
        if (u2 < 1)
        {
            x2 = x1 + u2 * delta_x;
            y2 = y1 + u2 * delta_y;
        }

        if (u1 > 0)
        {
            x1 += u1 * delta_x;
            y1 += u1 * delta_y;
        }

        line_out.visible = true;
        line_out.x0 = x1;
        line_out.y0 = y1;
        line_out.x1 = x2;
        line_out.y1 = y2;
    } else {
        line_out.visible = false;
        line_out.x0 = -1.0;
        line_out.y0 = -1.0;
        line_out.x1 = -1.0;
        line_out.y1 = -1.0;
    }

    return line_out;
  }

}

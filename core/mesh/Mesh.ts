

export default class Mesh
{
  public vertices:number[][];
  public faces:number[][];
  public uvs:number[][][];

  constructor(){}

  //public loadobj(url):void {}

  public boxgeometry(width:number, height:number, depth:number):void
  {
    // Test object.
    // I used THREE's CubeGeometry class to create a cube, then
    // just dumped the vertices and faces arrays to this:
    this.vertices = [
      [0.5,0.5,0.5],
      [0.5,0.5,-0.5],
      [0.5,-0.5,0.5],
      [0.5,-0.5,-0.5],
      [-0.5,0.5,-0.5],
      [-0.5,0.5,0.5],
      [-0.5,-0.5,-0.5],
      [-0.5,-0.5,0.5]
    ];

    this.faces = [
      [0,2,1],
      [2,3,1],
      [4,6,5],
      [6,7,5],
      [4,5,1],
      [5,0,1],
      [7,6,2],
      [6,3,2],
      [5,7,0],
      [7,2,0],
      [1,3,4],
      [3,6,4]
    ];

    for (let v of this.vertices)
    {
      v[0] *= width;
      v[1] *= height;
      v[2] *= depth;
    }

  }

}

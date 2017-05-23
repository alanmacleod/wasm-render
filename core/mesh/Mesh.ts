
import Matrix from  '../Matrix';

export default class Mesh
{
  public vertices:number[][];
  public faces:number[][];
  public uvs:number[][][];

  public matrix:number[][];

  public position:number[];
  public rotation:number[];

  private mrotation:number[][];
  private mtranslation: number[][];

  constructor()
  {
    this.matrix = Matrix.create();
    this.mrotation = Matrix.create();
    this.mtranslation = Matrix.create();

    this.position = [0,0,0];
    this.rotation = [0,0,0];
  }

  public updatematrix():void
  {
    // Y only
    Matrix.rotationy(this.rotation[1], this.mrotation);
    Matrix.translate(this.position, this.mtranslation);

    Matrix.concat([this.mrotation, this.mtranslation], this.matrix);
  }

  public set(position:number[], rotation?:number[])
  {
    this.position = position;
    this.rotation = (rotation) ? rotation : this.rotation;
    this.updatematrix();
  }

  public setrotation(rotation:number[])
  {
    this.rotation = rotation;
    this.updatematrix();
  }


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
      [5,7,0], // 'front'
      [7,2,0],
      [1,3,4], // 'rear'
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

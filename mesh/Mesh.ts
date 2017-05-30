
import Matrix   from  '../math/Matrix';
import Texture  from  '../memory/Texture';

// Mesh.ts
//        Represents a simple 3d model with a texture(s)
//        Just using a box for now, but can handle arbitrary 3d models easily.
//

export default class Mesh
{
  public vertices:number[][];
  public vertexnormals: number[][];
  public faces:number[][];
  public uvs:number[][][];

  public textures:Texture[];
  public uvtextures:number[];
  public istextured:boolean;

  public matrix:number[][];

  public position:number[];
  public rotation:number[];

  private mrotation:number[][];
  private mtranslation: number[][];

  public wireframe: boolean;
  public ready: boolean;

  constructor(options?:any)
  {
    this.matrix = Matrix.create();
    this.mrotation = Matrix.create();
    this.mtranslation = Matrix.create();

    this.position = [0,0,0];
    this.rotation = [0,0,0];

    this.ready = false;

    this.textures = [];

    if (options)
    {
      this.wireframe = options.wireframe || false;
    }


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

  public load(url):void
  {
    fetch(url)
      .then( res => res.json() )
      .then( json => {

        this.vertices = json.vertices;
        this.faces = json.faces;

        this.uvs = json.uvs;

        this.uvtextures = [];

        for (let f=0; f<json.faces.length; f++)
          this.uvtextures.push(0);

        console.info("Model loaded: "+ this.faces.length +" polygons");

        this.ready = true;

      });

  }

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


    this.uvs = [
      [[0,1],[0,0],[1,1]], // each face, three elements one for each vertex
      [[0,0],[1,0],[1,1]],
      [[0,1],[0,0],[1,1]],
      [[0,0],[1,0],[1,1]],
      [[0,1],[0,0],[1,1]],
      [[0,0],[1,0],[1,1]],
      [[0,1],[0,0],[1,1]],
      [[0,0],[1,0],[1,1]],
      [[0,1],[0,0],[1,1]],
      [[0,0],[1,0],[1,1]],
      [[0,1],[0,0],[1,1]],
      [[0,0],[1,0],[1,1]]
    ];

    // For each face, specify
    this.uvtextures = [ 0,0,0,0,0,0,0,0,0,0,0,0 ];

    for (let v of this.vertices)
    {
      v[0] *= width;
      v[1] *= height;
      v[2] *= depth;
    }

    this.ready = true;

  }

}

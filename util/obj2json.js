
// Used this parse-obj library for brevity but it's a bit weak
// Tripped over on extra whitespace in my .obj file which I had to remove
// manually to get it to work
// obj parser is trivial to implement, will just do that next time
var parseObj = require('parse-obj');
var fs = require('fs');


var file = "../obj/african_head.obj";
var file_out = "../pub/obj/african_head.json";

parseObj(fs.createReadStream(file), function (err, result) {
    //
    // console.log(result);

    var uvs = [];

    for (var f=0; f<result.faceUVs.length; f++)
    {
      // For this tri, get the three index numbers
      // that point to the exact UV coords for each corner of the tri
      var v0 = result.faceUVs[f][0];
      var v1 = result.faceUVs[f][1];
      var v2 = result.faceUVs[f][2];

      // Get the exact UV coords and stuff these into a uv face array
      uvs.push([
        result.vertexUVs[v0],
        result.vertexUVs[v1],
        result.vertexUVs[v2]
      ]);
    }


    var mesh = {
      vertices: result.vertexPositions,
      faces: result.facePositions,
      uvs: uvs
    };

    //console.log(result);

    fs.writeFileSync(file_out, JSON.stringify(mesh));
    console.log("Wrote " + file_out);
    //
    // public vertices:number[][];
    // public vertexnormals: number[][];
    // public faces:number[][];
    // public uvs:number[][][];
    //
});

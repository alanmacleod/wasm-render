
var parseObj = require('parse-obj');
var fs = require('fs');


var file = "../obj/african_head.obj";
var file_out = "../pub/african_head.json";

parseObj(fs.createReadStream(file), function (err, result) {
    //
    // console.log(result);

    var mesh = {
      vertices: result.vertexPositions,
      faces: result.facePositions,
      uvs: result.faceUVs
    };

    fs.writeFileSync(file_out, JSON.stringify(mesh));
    console.log("Wrote " + file_out);
    //
    // public vertices:number[][];
    // public vertexnormals: number[][];
    // public faces:number[][];
    // public uvs:number[][][];
    //
});

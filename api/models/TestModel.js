'use strict';
var redis = require('redis');
var redisclient = redis.createClient();

var data =  {
      "id": "photo-id-1",
      "face_feature": "base64 encoded data",
      "face_attributes": {
        "face_pan": -5.98303174972534,
        "face_roll": -2.5142810344696,
        "face_score": 0.997684359550476,
        "face_tilt": -6.70020532608032,
        "frontal_face_score": 0.53271484375,
        "quality": 0.870845258235931,
        "head_rect": {
          "bottom": 449,
          "left": 1187,
          "right": 1365,
          "top": 228
        },
        "left_eye": {
          "x": 1312,
          "y": 320
        },
        "right_eye": {
          "x": 1239,
          "y": 321
        }
      }
    };


module.exports = function(key , value){
    redisclient.set(key, value, redis.print);
}
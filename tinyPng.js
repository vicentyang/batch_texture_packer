/*
* @Author: vicent
* @Date:   2016-07-27 06:09:00
* @Last Modified by:   vicent
* @Last Modified time: 2016-07-27 06:24:52
*/

'use strict';

//npm install --save tinify

let api_key = "wB4u9ktQf_vzFI8ckb0-Bv8JS3LpWemx";

var tinify = require("tinify");
tinify.key = api_key;

var source = tinify.fromFile("201105091604272723.png");
source.toFile("3.png");

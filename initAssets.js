/// <reference path="../node.d.ts" />
/*
 * @Author: vicent
 * @Date:   2016-07-26 22:45:33
 * @Last Modified by:   vicent
 * @Last Modified time: 2017-07-26 10:31:32
 */


'use strict';
let Path = require('path');
let fs = require('fs');
let Exec = require('child_process');

let guiExec = false;

let rootPath = process.cwd();

//step 1 配置目标资源路径
let assetsPath = '/Users/vicent/Desktop/assets';

//step 2 配置目的资源放置路径，默认和 assetsPath 相同
let targetPath = '';

let sheetName = 'main.png';
let jsonName = 'main.json';

let formatType = 0;


 // 输出json
let format = {
}

var typeListConfig = {
    // json
    '1': {
        '--format': 'json',
        '--texture-format': 'png',
        '--size-constraints': 'AnySize',
        '--trim-mode': 'Trim',
        '--disable-rotation': '',
        '--sheet': 'sheetName',
        '--data': 'dataName',
        '--trim-sprite-names': '',
        '--max-height':4096
    },
    // xml
    '2': {
        '--format': 'xml',
        '--texture-format': 'png',
        '--size-constraints': 'AnySize',
        '--trim-mode': 'None',
        '--disable-rotation': '',
        '--sheet': 'sheetName',
        '--data': 'dataName',
        '--trim-sprite-names': '',
        '--max-height':4096,
        '--max-width':4096
    },
    // egret jsom
    '3': {
        '--format': 'json',
        '--texture-format': 'png',
        '--size-constraints': 'AnySize',
        '--trim-mode': 'Trim',
        '--disable-rotation': '',
        '--sheet': 'sheetName',
        '--data': 'dataName',
        '--trim-sprite-names': '',
        '--max-height':4096
    }
}

//输出xml
// let format = {
//     '--format': 'xml',
//     '--texture-format': 'png',
//     '--size-constraints': 'AnySize',
//     '--trim-mode': 'None',
//     '--disable-rotation': '',
//     '--sheet': 'sheetName',
//     '--data': 'dataName',
//     '--trim-sprite-names': ''
// }

function readDirs(assetsPath, type) {
    console.log('readDirs', '');

    formatType = type
    format = typeListConfig[type]
    targetPath = targetPath ? targetPath : assetsPath;

    //所选择的目录下包含 目录和文件 先将文件合并
    //在遍历文件夹 若文件夹里包含子文件夹 则会一起合并
    let assetsPathStats = fs.statSync(assetsPath);
    if (assetsPathStats.isDirectory()) {
        packTexuture(assetsPath);
        return;
    }

    let contentArr = fs.readdirSync(assetsPath) //拿到文件目录下的所有文件名


    contentArr.forEach((content, index) => {
        console.log('showData', content, '');
        if (content === '.DS_Store') {
            return
        }
        // let subPath = Path.resolve(path, content) //拼接为绝对路径
        console.log('showData', Path.resolve(assetsPath, content), '');
        let subPath = `${assetsPath}/${content}` //拼接为绝对路径

        let stats = fs.statSync(subPath);

        //输出以文件夹名命名
        if (stats.isDirectory()) {
            packTexuture(subPath)
        } else {
            //其他文件直接复制
            //判断文件夹存在与否
            let isTargetForder = fs.existsSync(targetPath);

            if (isTargetForder) {
                Exec.exec('cp -R ' + subPath + ' ' + targetPath);
            } else {
                Exec.exec('mkdir -p ' + targetPath, (err, out) => {
                    console.log(out);
                    err && console.log(err);
                    Exec.exec('cp -R ' + subPath + ' ' + targetPath);
                });
            }
        }

    })
}

/*
    TODO: '多重文件夹的递归遍历';
*/
function packTexuture(folder) {
    let command = '/usr/local/bin/TexturePacker';

    let fileName = Path.basename(folder);
    // let fileName = 'currency';
    //设置输出的sprite格式
    format['--sheet'] = `${targetPath}/${fileName}.${format['--texture-format']}`;
    format['--data'] = `${targetPath}/${fileName}.${format['--format']}`;
    // console.log('showData', sheetName, '');
    for (let i in format) {
        command += ' ' + i + ' ' + format[i];
    }
    command += ' ' + folder;
    Exec.exec(command, (err, out) => {
        console.log(out);
        err && console.log(err);

        // 转换生成的数据格式 转换成白鹭使用的数据  不需要可全部注释

        if (formatType === '3') {
            // converToEgretWingFormat
            let origitnData = require(`${targetPath}/${fileName}.${format['--format']}`);

            let targetFormat = converToEgretWingFormat(origitnData, fileName);
            console.log('initAssets.js>>>11', origitnData);

            fs.writeFileSync(`${targetPath}/${fileName}.${format['--format']}`, JSON.stringify(targetFormat));
        }
    });
}

/**
 * 将json格式转换成egret wing可识别的格式
 *
 * @return {[type]} [description]
 */
function converToEgretWingFormat(originData, fileName) {
    let targetFormat = {
        file: originData.meta.image,
        frames: {}
    }

    let frames = originData.frames;
    for (var frame in frames) {
        let originFrameData = frames[frame];
        let frameData = {
            x: originFrameData.frame.x,
            y: originFrameData.frame.y,
            w: originFrameData.frame.w,
            h: originFrameData.frame.h,
            offX: originFrameData.spriteSourceSize.x,
            offY: originFrameData.spriteSourceSize.y,
            sourceW: originFrameData.sourceSize.w,
            sourceH: originFrameData.sourceSize.h,
            trimmed: originFrameData.trimmed

        }
        targetFormat.frames[frame] = frameData;
    }

    return targetFormat;
}


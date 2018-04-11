const Canvas = require('canvas')
const Image = Canvas.Image

/**
 * Method drawAuthorizeLetter
 * @param {
 *      realName : string,
 *      yearlyRank : string,
 *      number : string,
 *      startTime: '2014-04-04',
 *      endTime: '2019-09-09',
 *      brands: [{name:'TestTest',desc:''}...],
 *  }
 */

const drawAuthorizeLetter = (config) => {
  return new Promise((resolve, reject) => {
    const {
      realName,
      yearlyRank,
      number,
      startTime,
      endTime,
      brands,
      backImgUrl = './img/book.jpg',
    } = config

    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;

    let startTimeArr = [], endTimeArr = [];
    if (startTime) {
      startTimeArr = startTime.split('-');
    }
    if (endTime) {
      endTimeArr = endTime.split('-');
    }

    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      ctx.fillText(realName, 1060, 2426);
      ctx.fillText(yearlyRank, 1060, 2574);
      ctx.fillText(startTimeArr[0], leftWidth+133, timeTop);
      ctx.fillText(startTimeArr[1], leftWidth+395, timeTop);
      ctx.fillText(startTimeArr[2], leftWidth+580, timeTop);
      ctx.fillText(endTimeArr[0], leftWidth+997, timeTop);
      ctx.fillText(endTimeArr[1], leftWidth+1259, timeTop);
      ctx.fillText(endTimeArr[2], leftWidth+1448, timeTop);

      let newbrands = [];
      if (brands) {
          for (let i = 0; i < brands.length; i++) {
              newbrands.push({text: ' '+brands[i]['name'], font: font, line: true});
              newbrands.push({text: `（${brands[i]['desc']}）`, font: sFont, line: true});
          }
      }
      
      let txtArr = [
        {text: realName, font: font, line: true},
        {text: '为我司旗下', font: sFont}
      ].concat(newbrands);
      txtArr.push({text: '品牌在微商渠道的正规经销商，授权编号为', font: sFont});
      txtArr.push({text: number, font: font, line: true});
      txtArr.push({text: '，特此授权。', font: sFont});

      _fillText(txtArr);

      imgIcon.onload = () => {
        ctx.drawImage(imgIcon, 1760, 2200);
      }
    }
    img.src = `${__dirname}/img/book.jpg`;
    imgIcon.src = `${__dirname}${_getLevelImage(yearlyRank)}`;

    canvas.toDataURL('image/jpeg', {
      bufsize: 4096,
      quality: 80,
      progressive: false
    }, (err, jpeg) => {
      if(err) { reject(err) }
      resolve (jpeg)
    })
  })
}

const _fillText = (arr) => { //授权信息
    let lang = 0;
    for (let i = 0; i < arr.length; i++) {
        let font = arr[i]['font']
            , _fontSize = parseInt(font)
            , Lines = _breakLinesForCanvas({text: arr[i]['text'], width: cWidth, fistLineWidth: cWidth - lang%cWidth, font});
        for (let j = 0; j < Lines.length; j++) {
            let LWidth = ctx.measureText(Lines[j]).width;
            if (lang%cWidth + _fontSize >= cWidth) {
                lang = cWidth*Math.ceil(lang/cWidth)
            }
            if (arr[i]['line']) {
                _fillLine(leftWidth + lang%cWidth,leftWidth + lang%cWidth + LWidth,cTop + lineHeight*Math.floor(lang/cWidth) + fontSize/2 +20)
            }
            ctx.font = font;
            ctx.fillText(Lines[j], leftWidth + lang%cWidth + LWidth/2, cTop + lineHeight*Math.floor(lang/cWidth));
            lang += LWidth
        }
    }
}
const _fillLine = (startPoint, endPoint, y) => { //划线
    ctx.beginPath();
    ctx.moveTo(startPoint, y);
    ctx.lineTo(endPoint, y);
    ctx.stroke();
}

const _breakLinesForCanvas = (props) => {
    let {text, width, fistLineWidth, font} = props
    let result = [];
    let breakPoint = 0;
    
    if (font) {
        ctx.font = font
    }
    
    while(1){
        if () {}
    }
    for (let i = 0; i < 99; i++) {
        if (i === 0 && (breakPoint = __findBreakPoint(text, fistLineWidth)) !== -1) {
            result.push(text.substr(0, breakPoint));
            text = text.substr(breakPoint);
            continue;
        }
        if ((breakPoint = __findBreakPoint(text, width)) !== -1) {
            result.push(text.substr(0, breakPoint));
            text = text.substr(breakPoint);
            continue;
        }
        break;
    }
    
    if (text) {
        result.push(text);
    }
    
    return result
}

const __findBreakPoint = (text, width) => {
    let min = 0;
    let max = text.length - 1;
    
    // 获取分行断点思路
    // 1. 
    while (min <= max) {
        let middle = Math.floor((min + max) / 2);
        let middleWidth = ctx.measureText(text.substr(0, middle)).width;
        let oneCharWiderThanMiddleWidth = ctx.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
            return middle;
        }
        if (middleWidth < width) {
            min = middle + 1;
        } else {
            max = middle - 1;
        }
    }
    
    return -1;
}

const _breakLines = (text, width) => {
    let result
    // 换行思路2
    //
    for
    return result
}

const RANK_ICON_MAP = {
    "年度白晶": '/img/white.png',
    "年度粉晶": '/img/pink.png',
    "年度红晶": '/img/red.png',
    "年度紫晶": '/img/purple.png',
    "年度黑晶": '/img/black.png',
    "年度皇后": '/img/gold.png',
}
const _getLevelImage = (key) => {
    if (RANK_ICON_MAP[key]) {
        return RANK_ICON_MAP[key]
    }
    return '/img/normal.png'
}

const canvas = new Canvas(2480, 3508);
const ctx = canvas.getContext('2d');
const img = new Image;
const imgIcon = new Image;

const fontSize = 80
    , sFontSize = 72
    , lineHeight = 144
    , leftWidth = 215
    , cWidth = 2045
    , cTop = 1290
    , timeTop = 2060
    , font = fontSize + 'px Arial'
    , sFont = sFontSize + 'px Arial';

module.exports = drawAuthorizeLetter;

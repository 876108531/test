const Canvas = require('canvas')
    , Image = Canvas.Image
  	, fs = require('fs')

bookCanvas({
    realName : '名字名字',
    nianrankName : '测试文字',
    number : '20141113116',
    startTime: '2014-04-04',
    endTime: '2019-09-09',
    imgUrl: './book.jpg',
    brands: '  Test (测试文字) TestTest Test (测试文字)  Test（测试文字）  Test (测试文字) Test Test (测试文字)  TestTest（测试文字）',
});

function bookCanvas (config) {
    const canvas = new Canvas(2480, 3508)
        , ctx = canvas.getContext('2d')
        , img = new Image()
    
    const {
    	realName,
		nianrankName,
		startTime,
		number,
		endTime,
		brands,
		imgUrl = './book.jpg',
    } = config
    
    const fontSize = 80
        , fixFontSize = 72
        , lineHeight = 144
        , leftWidth = 215
        , cWidth = 2045
        , timeTop = 2060
        , font = fontSize + 'px PingFangSC-Regular'
        , fixFont = fixFontSize + 'px SimSun'
    
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    
    let startTimeArr = [], endTimeArr = [], nameWidth, numberWidth;
    if (startTime) {
        startTimeArr = startTime.split('-')
    }
    if (endTime) {
        endTimeArr = endTime.split('-')
    }
    if (realName) {
        nameWidth = ctx.measureText("  "+realName+"  ").width
    }
    if (number) {
        numberWidth = ctx.measureText("  "+number+"  ").width
    }
    console.log(nameWidth)
	
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        
        ctx.fillText(realName, leftWidth+nameWidth/2, 1290);
        _fillLine(leftWidth,leftWidth+nameWidth,1290+fontSize)
        ctx.fillText(realName, 1060, 2426);
        ctx.fillText(nianrankName, 1060, 2574);
        ctx.fillText(startTimeArr[0], leftWidth+133, timeTop);
        ctx.fillText(startTimeArr[1], leftWidth+395, timeTop);
        ctx.fillText(startTimeArr[2], leftWidth+580, timeTop);
        ctx.fillText(endTimeArr[0], leftWidth+997, timeTop);
        ctx.fillText(endTimeArr[1], leftWidth+1259, timeTop);
        ctx.fillText(endTimeArr[2], leftWidth+1448, timeTop);
        
        let Text0Lines = _breakLinesForCanvas({text: '为我司旗下', width: cWidth, fistLineWidth: cWidth-nameWidth, font: fixFont})
            , brandLines = _breakLinesForCanvas({text: brands, width: cWidth, fistLineWidth: cWidth-Text0Lines['endWidth']-nameWidth, font})
            , Text1Lines = _breakLinesForCanvas({text: '品牌在微商渠道的正规经销商，授权编号为', width: cWidth, fistLineWidth: cWidth-brandLines['endWidth'], font: fixFont})
			, numberLines = _breakLinesForCanvas({text: number, width: cWidth, fistLineWidth: 1163, font})
            , Text2Lines = _breakLinesForCanvas({text: '，特此授权。', width: cWidth, fistLineWidth: cWidth-numberLines['endWidth'], font: fixFont})
        
        console.log(cWidth-brandLines['endWidth'])//950  2048
    
        Text0Lines['data'].forEach(function (line, index) {
            const {width} = ctx.measureText(line)
            let x = leftWidth;
            if (index === 0 && nameWidth < cWidth - fixFontSize) {
                x = leftWidth+nameWidth;
            }
            ctx.font = fixFont;
            ctx.fillText(line, x + width/2, lineHeight * index + 1290 + 40);
        });
        
        brandLines['data'].forEach(function (line, index) {
            const {width} = ctx.measureText(line)
			let x = leftWidth;
            if (index === 0 && Text0Lines['endWidth'] < cWidth - fontSize) {
                x = leftWidth+nameWidth+Text0Lines['endWidth'];
                Text0Lines['length'] -= 1;
            }
            ctx.font = font;
            ctx.fillText(line, x + width/2, lineHeight * (index+Text0Lines['length']) + 1290);
            _fillLine(x,x + width,lineHeight * index + 1372)
        });
    
        // ctx.font = '72px PingFangSC-Medium';
        Text1Lines['data'].forEach(function (line, index) {
            const {width} = ctx.measureText(line)
            console.log('999:'+width)
			let x = leftWidth;
            if (index === 0 && brandLines['endWidth'] < cWidth - fontSize) {
                x = leftWidth+brandLines['endWidth'];
                brandLines['length'] -= 1;
            }
            ctx.font = fixFont;
            ctx.fillText(line, x + width/2, lineHeight * (index+brandLines['length']) + 1290 + 40);
        });
    
        numberLines['data'].forEach(function (line, index) {
            const {width} = ctx.measureText(line)
            let x = leftWidth;
            if (index === 0 && Text1Lines['endWidth'] < cWidth - fontSize) {
                x = leftWidth+Text1Lines['endWidth'];
                Text1Lines['length'] -= 1;
            }
            console.log(x);
            // todo test
            ctx.font = font;
            ctx.fillText(line, x + numberWidth/2, lineHeight * (index+brandLines['length']+Text1Lines['length']) + 1290 + 40);
            _fillLine(x,x + numberWidth,lineHeight * (index+brandLines['length']+Text1Lines['length']) + 1372)
        });
    
        Text2Lines['data'].forEach(function (line, index) {
            const {width} = ctx.measureText(line)
            let x = leftWidth;
            if (index === 0 && numberWidth < cWidth - fontSize) {
                x = leftWidth+Text1Lines['endWidth']+numberWidth;
                numberLines['length'] -= 1;
            }
            ctx.font = fixFont;
            ctx.fillText(line, x + width/2, lineHeight * (index+brandLines['length']+Text1Lines['length']+numberLines['length']) + 1290 + 40);
        });
        
        
    }
    img.src = imgUrl;
    
    // arr = ["Yufit"," (脂老虎) ","Bulgarian Rose"," (保加利亚玫瑰) ", "Yoryu","（悠语）"] //^[\(,\（].*[\),\）]$
    function _fillText(arr) {
        let endWidth = 0
            , fistLineWidth = cWidth - endWidth
        for (var i = 0; i < arr.length; i++) {
            let Lines = _breakLinesForCanvas({text: arr[i], width: cWidth, fistLineWidth, font})
            
        }
    }
    
    function _fillLine(startPoint,endPoint,y) {
        ctx.beginPath();
        ctx.moveTo(startPoint, y);
        ctx.lineTo(endPoint, y);
        ctx.stroke();
    }
    
    function _breakLinesForCanvas (props) {
        let {text, width, fistLineWidth = width, font} = props
        let result = [];
        let breakPoint = 0;
        
        if (font) {
            ctx.font = font
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
        
        return {
            data:result,
            length:result.length,
            endWidth:ctx.measureText(result[result.length-1]).width};
    }
    function __findBreakPoint (text, width) {
        let min = 0;
        let max = text.length - 1;
        
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
    
    
    let file = fs.createWriteStream('./img2.jpg')
    file.write(canvas.toBuffer())
	// todo test
}
// const Canvas = require('canvas')
//     , Image = Canvas.Image
//   	, fs = require('fs')

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
    const 
        // canvas = new Canvas(2480, 3508)
        canvas=document.getElementById("canvas")
        // todo test
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
        , cTop = 1290
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
        
        ctx.fillText(realName, 1060, 2426);
        ctx.fillText(nianrankName, 1060, 2574);
        ctx.fillText(startTimeArr[0], leftWidth+133, timeTop);
        ctx.fillText(startTimeArr[1], leftWidth+395, timeTop);
        ctx.fillText(startTimeArr[2], leftWidth+580, timeTop);
        ctx.fillText(endTimeArr[0], leftWidth+997, timeTop);
        ctx.fillText(endTimeArr[1], leftWidth+1259, timeTop);
        ctx.fillText(endTimeArr[2], leftWidth+1448, timeTop);

        _fillText([{text:realName,font:font,line:true}
            ,{text:"为我司旗下",font:fixFont}
            ,{text:brands,font:font,line:true}
            ,{text:'品牌在微商渠道的正规经销商，授权编号为',font:fixFont}
            ,{text:number,font:font,line:true}
            ,{text:'，特此授权。',font:fixFont}
        ])
    }
    img.src = imgUrl;

    //^[\(,\（].*[\),\）]$
    // ([\(,\（]{1,}[\u4e00-\u9fa5]{0,}[\),\）]{0,})|([\(,\（]{0,}[\u4e00-\u9fa5]{0,}[\),\）]{1,})
    // ((?:[\),\）]{0,})[^\(,\（,\),\）]*(?:[\(,\（]{1,}))|((?:[\),\）]{1,})[^\(,\（,\),\）]*(?:[\(,\（]{0,}))
    // let s = '  Test (测试文字) TestTest Test (测试文字)  Test（测试文字）  Test (测试文字) Test Test (测试文字)  TestTest（测试文字）'
    // let regex = "\\/([\(,\（]{1,}[\u4e00-\u9fa5]{0,}[\),\）]{0,})|([\(,\（]{0,}[\u4e00-\u9fa5]{0,}[\),\）]{1,})\\/g"
    //     , c = s.replace(regex, "$1");
    // s.indexOf(c);
    function _fillText(arr) {
        let lang = 0
        for (var i = 0; i < arr.length; i++) {
            let font = arr[i]['font']
                , _fontSize = parseInt(font)
                , Lines = _breakLinesForCanvas({text: arr[i]['text'], width: cWidth, fistLineWidth: cWidth - lang%cWidth, font})
            for (var j = 0; j < Lines.length; j++) {
                let LWidth = ctx.measureText(Lines[j]).width
                if (lang%cWidth + _fontSize >= cWidth) {
                    lang = cWidth*Math.ceil(lang/cWidth)
                }
                ctx.font = font
                ctx.fillText(Lines[j], leftWidth + lang%cWidth + LWidth/2, cTop + lineHeight*Math.floor(lang/cWidth))
                if (arr[i]['line']) {
                    _fillLine(leftWidth + lang%cWidth,leftWidth + lang%cWidth + LWidth,cTop + lineHeight*Math.floor(lang/cWidth) + fontSize/2)
                }
                lang += LWidth
            }
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
        
        return result
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
    
    // let file = fs.createWriteStream('./img2.jpg')
    // file.write(canvas.toBuffer())
	// todo test
}
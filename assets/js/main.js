var url= ["https://script.google.com/macros/s/AKfycbzzxeNclfL39dpKD3rPKFNHZz5zCLnwXLuTBr1jbaYmwDBcrbSa/exec", "https://script.google.com/macros/s/AKfycbwNjytDQVAaGOYKescVPRpXH5K3R1WYKJuxJoqX-8iLzrDBYOv_/exec"];

function readCookie(){
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    var cookie;
    for (var i=0, l=cookieAry.length; i<l; ++i) {
        cookie = cookieAry[i].trim();
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    return cookieObj;
}

function setCookie(freq){
    var time= new Date();
    var hh= time.getHours();
    var mm= time.getMinutes();
    var ss= time.getSeconds();
    var now= (hh*60+mm)*60+ss;
    var curCookie= "submitTimes=" + freq + ";  max-age="+ (86400-now) + ";";
    document.cookie= curCookie;
}

function Confirm(){
    var murderer= $("input[name='suspect']:checked").val();
    $("input[name='suspect']:checked").prop('checked', false);
    var color=[];
    $("#selected input[type='button']").each(function(){
        color.push(this.value);
    });
    
    var cookieCon= readCookie();
    var submitTime= cookieCon["submitTimes"];
    if(submitTime){                                 //確認是否送過資料
        alert("很抱歉，已超過回報次數");
        return;
    }
    
    if(typeof(murderer)=="undefined"||!(color.length)){   //確認是否兩格都有填
        alert("兩個條件皆填寫才能回報喔！");
        return;
    }
                                                    //確認是否送出資料
    var timeCheck= confirm("因事態緊急，此系統只限回報一次，確定要送出資料嗎？");
    if(!timeCheck)
        return;
    
    setCookie(1);
    Send(murderer, color, 0);
}

function Send(murderer, color, index){
    $.ajax({
        type:'get',
        cache: false,
        timeout: 5000,
        url: url[index%2],
        data:  {
            'murderer': murderer,
            'color': color
        },
        datatype:'json',
        success: function(respond){
            if(respond=="murdererError")                    //解出錯誤的兇手
                alert("這段時間，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n結果很抱歉，兇手的推論錯誤，但顏色順序正確。\n謝謝你的協助。");
            else if(respond=="orderError")                  //解出錯誤的顏色順序
                alert("這段時間，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n結果很抱歉，顏色順序的推論錯誤，但兇手正確。\n謝謝你的協助。");
            else if(respond=="murdererErrororderError")     //兇手、顏色順序皆錯誤
                alert("這段時間，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n結果很抱歉，兇手與顏色順序的推論皆錯誤\n謝謝你的協助。");
            else{                                           //解出正確的答案
                alert("這段時間中，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n恭喜，你的推論正確，很感謝你的協助。");
                document.cookie= "submitTimes=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            Send(murderer, color, 1);
        }
    });
}
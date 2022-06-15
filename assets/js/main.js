var url= ["https://script.google.com/macros/s/AKfycbzzxeNclfL39dpKD3rPKFNHZz5zCLnwXLuTBr1jbaYmwDBcrbSa/exec", "https://script.google.com/macros/s/AKfycbwNjytDQVAaGOYKescVPRpXH5K3R1WYKJuxJoqX-8iLzrDBYOv_/exec"];

function Confirm(){
    var murderer= document.getElementById("murderer").value;
    var color= document.getElementById("color").value;
    document.getElementById("murderer").value= "";
    document.getElementById("color").value= "";
                                                    //確認是否送出資料
    var timeCheck= confirm("因事態緊急，此系統只限回報一次，確定要送出資料嗎？");
    if(!timeCheck)
        return;
    
    var submitTime= document.getElementById("submitTime").value;
    if(submitTime){                                 //確認是否送過資料
        alert("很抱歉，已超過回報次數");
        return;
    }
    
    if(murderer==""||color==""){                    //確認是否兩格都有填
        alert("兩個條件皆填寫才能回報喔");
        return;
    }
    
    var message= murderer + "," + color;
    Send(message, 0);
}

function Send(message, index){
    document.getElementById("submitTime").value= 1;
    $.ajax({
        type:'get',
        cache: false,
        timeout: 5000,
        url: url[index%2],
        data:  {
            'message' : message
        },
        datatype:'json',
        success: function(respond){
            if(respond=="murdererError")                    //解出錯誤的兇手
                alert("這段時間，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n結果很抱歉，兇手的推論錯誤，但顏色順序正確。\n謝謝你的協助。");
            else if(respond=="orderError")                  //解出錯誤的顏色順序
                alert("這段時間，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n結果很抱歉，顏色順序的推論錯誤，但兇手正確。\n謝謝你的協助。");
            else if(respond=="murdererErrororderError")     //兇手、顏色順序皆錯誤
                alert("這段時間，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n結果很抱歉，兇手與顏色順序的推論皆錯誤\n謝謝你的協助。");
            else                                            //解出正確的答案
                alert("這段時間中，總部已經找出真正的兇手及拆除炸彈的顏色順序。\n恭喜，你的推論正確，很感謝你的協助。");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            Send(data, index+1);
        }
    });
}
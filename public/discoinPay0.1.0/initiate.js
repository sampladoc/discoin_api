function generateCode (ob) {
    
    $j("#"+ob.id).setStyle("display","none")
    
    function BUTTON_HOVER_3(b){
        b.animate({type:"size", time:200, tween:{0:"1",50:"1.05",100:"0.95"}})
    }
    function BUTTON_HOVER_4(b){
        b.animate({type:"size", time:200, tween:{0:"0.95",50:"1.05",100:"1"}})
    }
   
    const productId = document.getElementById(ob.id).getAttribute("data-dc-productId")
    const publicKey = ob.data || document.getElementById(ob.id).getAttribute("data-dc-publicKey") || ''
    

    const obj = {
            amount: amount,
            number: number,
            productId: productId,
            publicKey: publicKey,
            description: description,
    }

    const stringObj = JSON.stringify(obj);
    let qrCount = 0
    console.log(stringObj+" - ",qrCount)
    
    console.log('id',$j("#"+ob.id).id())
    
    $j("@data-dc-button=true")
    .setStyle("height","35px")
    .setStyle("text-align","center")
    .setStyle("padding","5px")
    .setStyle("cursor","pointer")
    .setStyle("font-size","12px")
    .setStyle("background","#0f2028")
    .setStyle("color","#1de9b6")
    .setStyle("font-family","san serif")
    .setStyle("font-weight","900")
    
    $j("@data-dc-button=true").embed("<div style='float:left; width:100%; height:100%; padding-top:3px;' id='qrbtn'>Pay with YAPSI</div>")
    
    $j("#qrbtn")
    .setStyle("background","url(https://discoinpay-api.firebaseapp.com/discoinPay/IconoDiscoin.png)")
    .setStyle("background-size","29px 20px")
    .setStyle("background-position","5px 2px")
    .setStyle("float","left")
    .setStyle("background-repeat","no-repeat")
    
    $j("@data-dc-button=true").enhance({reflect:true, shadow:40, border:10, percent:5, radius:5, rest:"darker+"})

    $j("@data-dc-button=true")
    .setStyle("height","35px")
    .setStyle("width","180px")
    .after("mouseenter",function(){
        BUTTON_HOVER_3($j(this))
    }).after("mouseleave",function(){
        BUTTON_HOVER_4($j(this))
    }).after("click",function(){
        if(qrCount == 0){
            var qrcode = new QRCode(ob.id, {
                text: productId+'+'+publicKey,
                width: 150,
                height: 150,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
        
        //*
        $j("#"+ob.id).OVERLAY({
            time:600,
            secondary:{
                count: qrCount,
                color: "255, 255, 255, ",
                opacity: "1",
                height: 500,
                titles:["PAGAR CON YAPSI"],
                subtitles:[productName, description,'Cantidad: '+number,'$'+amount*.01],
                subFontSize:[18,12,12,22],
                subFontWeight:[900,12,700,500],
                subFloat:['left','left','left','left'],
            }
        })
        qrCount++
        
        //*/
    })
    
}

function discoinPayLoader(url, fn){
	var xmlhttp; 
	if(window.XMLHttpRequest){
	  xmlhttp=new XMLHttpRequest();
	}else{
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
		   fn(xmlhttp.responseText)
		}
	}
	xmlhttp.open("POST",url+".php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("file_index=0");
}


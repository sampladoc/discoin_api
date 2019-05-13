/*
The MIT License (MIT)

Copyright (c) 2015 - 2018 [Lorenzo Oliver]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

Array.prototype.unique = function() {
		var a = this.concat();
		for(var i=0; i<a.length; ++i) {
				for(var j=i+1; j<a.length; ++j) {
						if(a[i] === a[j])
								a.splice(j--, 1);
				}
		}
		return a;
};



(function() {
GLOBALS = {};
GLOBALS["loop_time"] = {};
GLOBALS["toggle"] = {};
GLOBALS["loop_logic"] = {};
GLOBALS["animation_counter"] = 0;
GLOBALS["animation_library"] = {};
GLOBALS["progressBar"] = {};
var GLOBAL_STYLE = document.createElement('style');
GLOBAL_STYLE.type = 'text/css';
	function _$j(els) {
		this.elements = [];
		function filtr(ele,fil){
			//alert(ele+" = "+fil)
				var tempA = [];
			var elementAll = document.querySelectorAll("*");
			var elementRef = [];
			var elent = elementAll.length;
			if(elent > 0){
				for ( var ii = 0; ii < elent; ii++ ) {
					var elementt = elementAll[ii].getAttribute(fil);
					if(elementAll[ii].tagName.toLocaleLowerCase() != "script" && elementAll[ii].tagName.toLocaleLowerCase() != "title"){
						//alert(elementt+" != "+ele.substr(1, ele.length - 2))
						if(elementt != ele.substr(1, ele.length - 2)){
						 tempA.push(elementAll[ii]);
						}
					}
				}
			}
			return tempA;
		}

		function parents(ele,fil,t){
			 var tempA = [], ELEMP = [];
			 var spli = ele.split("<")
			 function pnode(pn){
				 return pn.parentNode
			 }
			 var tag = spli[0].substr(1, spli[0].length);
			 if(spli[0].search("=") >= 0){
				fil =  spli[0].substr(1, spli[0].indexOf("=") - 1);
				tag = spli[0].substr(spli[0].indexOf("=")+1, spli[0].length);
			 }

			 var elemparent = document.querySelectorAll("*");
			 var parlen = elemparent.length;
			 if(spli[1].indexOf("|") > 0){
				 var upto = spli[1].split("|");
				 var psuedo = upto[1].split(":");
			 }

			 for(var i = 0; i < parlen; i++){
				var logic = (t == false) ? elemparent[i].getAttribute(fil) == tag : elemparent[i].tagName.toLocaleLowerCase() == tag.toLocaleLowerCase();
				if(logic == true){
					var elemp = elemparent[i]

					if(spli[1] == "a"){
						//$j("@id=john<a)
						while(elemp.tagName != "BODY" || elemp.tagName != "BODY"){
							elemp = pnode(elemp)
							ELEMP.push(elemp);
						}
						tempA = ELEMP;
					}else if(spli[1].indexOf("|") > 0){
						var n = parseInt(upto[1])*1
						var sto = false;
						if(isNaN(n)){
							 //$j("#id<a|TAG) $j("@id=john<a|TAG)
						 while(sto == false){
							elemp = pnode(elemp)
							ELEMP.push(elemp);
							var nfil = upto[1].substr(1, upto[1].indexOf("=")-1);
							var ntag = upto[1].substr(upto[1].indexOf("=")+1, upto[1].length);

							var minilogic = (upto[1].indexOf("@") == 0) ? elemp.getAttribute(nfil) == ntag : elemp.tagName.toLocaleLowerCase() == upto[1].toLocaleLowerCase()
							if(minilogic){
								sto = true;
							}
							 }
							 tempA = ELEMP;
						}else{
							//$j("#id<a|2) $j("@id=john<a|2) etc...
							for(var j = 0; j < n; j++){
								elemp = pnode(elemp)
								ELEMP.push(elemp);
							}
							tempA = ELEMP;
						}

					}else if(spli[1].indexOf("{") >= 0){
						var n = parseInt(spli[1])*1
						var sto = false;
						if(isNaN(n)){
							 //$j("#id<{style_attribute=style}) $j("@id=john<{style_attribute=style})
						 while(elemp.tagName != "BODY"){
							elemp = pnode(elemp)
							var attr = spli[1].substr(1, spli[1].indexOf("=")-1);
							var style = spli[1].substring(spli[1].indexOf("=")+1, spli[1].indexOf("}"));
							//alert(attr+" : "+$j(elemp).trueStyle(attr)+"=="+style)
							var minilogic = $j(elemp).trueStyle(attr) == style
							if(minilogic){
								ELEMP.push(elemp);
								//sto = true;
							}
							 }
							 tempA = ELEMP;
						}else{
							//$j("#id<a|2) $j("@id=john<a|2) etc...
							for(var j = 0; j < n; j++){
								elemp = pnode(elemp)
								ELEMP.push(elemp);
							}
							tempA = ELEMP;
						}

					}else{
						var n = parseInt(spli[1])*1
						var sto = false;
						if(isNaN(n)){
							//$j("#id<tag) $j("@id=john<tag) etc ... OR $j("#id<@attribute=attribute_name) $j("@id=john<@attribute=attribute_name) etc ...
							while(sto == false){
							elemp = pnode(elemp)
							var nfil = spli[1].substr(1, spli[1].indexOf("=")-1);
							var ntag = spli[1].substr(spli[1].indexOf("=")+1, spli[1].length);
							var minilogic = (spli[1].indexOf("@") == 0) ? elemp.getAttribute(nfil) == ntag : elemp.tagName.toLocaleLowerCase() == spli[1].toLocaleLowerCase()
							if(minilogic){
								sto = true;
							}
								}
							tempA.push(elemp);
						}else{
							//$j("#id<2) $j("@id=john<2) etc ...
							for(var j = 0; j < parseInt(spli[1]); j++){
								elemp = pnode(elemp)
							}
							tempA.push(elemp);
						}
					}
				}
			 }
			 return tempA;
		}

		function style(ele,fil,t){
			 var tempA = [];
			 var tag = ele.substr(1, ele.indexOf("{") - 1), spli = ele.split("{")
			 var elemparent = document.querySelectorAll("*");
			 var parlen = elemparent.length;
			 for(var i = 0; i < parlen; i++){
				var elementt = elemparent[i].getAttribute(fil), elementx = elemparent[i].tagName.toLocaleLowerCase();
				var logic = (t == false) ? elementt == tag : elementx == tag.toLocaleLowerCase();
				if(logic == true){
					var elemkid = elemparent[i].children, kidlen = elemkid.length
					for(var ii = 0; ii < kidlen; ii++){
					var attr = spli[1].substr(0, spli[1].indexOf("="));
					var sty = spli[1].substring(spli[1].indexOf("=")+1, spli[1].indexOf("}"));
					var minilogic = $j(elemkid[ii]).trueStyle(attr) == sty
					if(minilogic){
						tempA.push(elemkid[ii]);
					}
				 }
				}
			 }
			 return tempA;
		}

		function kid(ele,fil,t){
			 var tempA = [];
			 var Del = [];
			 var Fin = [], Don = [];
			 var del = {};
			 var stype = -1;
			 if(t == false){
				 if(ele.search("@") >= 0){
					var allk = true;
							var tag = ele.substring(ele.indexOf("=")+1, ele.indexOf("["))
					fil = ele.substring(ele.indexOf("@")+1, ele.indexOf("="));
					//$j("@id=%john") everything that ends with john
					if(tag.indexOf("%") == 0 && tag.lastIndexOf("%") == 0){
					 var res = tag.replace("%", "");
					 tag = res, stype = 0;
					}else
					//$j("@id=john%") everything that begins with john
					if(tag.indexOf("%") == (tag.length-1) && tag.lastIndexOf("%") == (tag.length-1)){
					 var res = tag.replace("%", "");
					 tag = res, stype = 1;
					}else
					//$j("@id=%john%") everything that john with in it
					if(tag.indexOf("%") == 0 && tag.lastIndexOf("%") == (tag.length-1)){
					 var res = tag.replace("%", "");
					 res = res.replace("%", "");
					 tag = res, stype = 2;
					}
				 }else{
					var tag = ele.substr(1, ele.indexOf("[") - 1)
					var allk = false;
				 }
			 }else{
				var tag = ele.substr(0, ele.indexOf("["))
			 }
			 if(ele.indexOf(",") == -1){
				var nu = ele.substring(ele.indexOf("[")+1, ele.indexOf("]"));
				if(nu.length == 1){
					if(nu == "a"){
						 var num = ["a"];
					}else
					if(nu == "e"){
						 var num = ["e"];
					}else
					if(nu == "o"){
						 var num = ["o"];
					}else
					if(nu == "l"){
						 var num = ["l"];
					}else{
						 var num = [parseInt(nu)];
					}
				}else if(nu.length > 1){
					var num = [nu];
				}
			 }else{
				 if(ele.indexOf("|") == -1){
					if(t == false){
					var num = ele.substr(ele.indexOf("[")+1, ele.indexOf("]")).split(",");
					}else{
					var num = ele.substr(ele.indexOf("["), ele.indexOf("]")).split(",");
					}
				 }else{
					var nu = ele.substring(ele.indexOf("[")+1, ele.indexOf("]"));
					var num = [nu];
				 }
			 }
			 var elemparent = document.querySelectorAll("*");
			 var parlen = elemparent.length;
			 for(var i = 0; i < parlen; i++){
				var elementt = elemparent[i].getAttribute(fil), elementx = elemparent[i].tagName.toLocaleLowerCase();
				if(stype == -1){
					var logic = (t == false) ? elementt == tag : elementx == tag.toLocaleLowerCase();
				}else if(stype == 0 && elementt != null){
					var logic = (t == false) ? elementt.length == (elementt.indexOf(tag)+tag.length) && elementt.indexOf(tag) != -1 : elementx == tag;
				}else if(stype == 1 && elementt != null){
					var logic = (t == false) ? elementt.indexOf(tag) == 0 : elementx == tag;
				}else if(stype == 2 && elementt != null){
					var logic = (t == false) ? elementt.indexOf(tag) >= 0 : elementx == tag;
				}

				if(logic == true){
					var elemkid = elemparent[i].children
					var elemkid2 = elemparent[i].children
					var kidlen = elemkid.length
					for(var yy = 0; yy <= elemkid2.length; yy++){
						if(Del.length < elemkid2.length){
							Del.push(elemkid2[yy]);
						}
					}
					var cnt = 0;
					for(var ii = 0; ii < kidlen; ii++){
						if(num[0].toString().search("=") >= 0){
						 var styp = -1;
						 var tempel = num[0].split("=")

						 if(tempel[1].indexOf("|") >= 0){
							 var ntel = tempel[1].split("|")
							 var newtempel = ntel[1].split(",")
							 var elementk = elemkid[ii].getAttribute(tempel[0])
							 //$j("@id=john[class=%susan|1,3]") every id that is john and has children that end in susan but only the 2nd and 4th child
							 if(ntel[0].indexOf("%") == 0 && ntel[0].lastIndexOf("%") == 0 && elementk != null){
								 var res = ntel[0].replace("%", "");
									 ntel[0] = res;
								 var Logic = elementk.length == (elementk.indexOf(ntel[0])+ntel[0].length) && elementk.indexOf(ntel[0]) != -1;
							 }else
							 //$j("@id=john[class=susan%|1,3]") every id that is john and has children that begin with susan but only the 2nd and 4th child
							 if(ntel[0].indexOf("%") == (ntel[0].length-1) && ntel[0].lastIndexOf("%") == (ntel[0].length-1) && elementk != null){
								 var res = ntel[0].replace("%", "");
									 ntel[0] = res;
								 var Logic = elementk.indexOf(ntel[0]) == 0;
							 }else
							 //$j("@id=john[class=%susan%|1,3]") every id that is john and has children that has susan but only the 2nd and 4th child
							 if(ntel[0].indexOf("%") == 0 && ntel[0].lastIndexOf("%") == (ntel[0].length-1) && elementk != null){
								 var res = ntel[0].replace("%", "");
								 res = res.replace("%", "");
								 ntel[0] = res;
								 var Logic = elementk.indexOf(ntel[0]) >= 0;
							 }else{

								 var Logic = elementk == ntel[0];
							 }
							 if(Logic){
								 var tempchild = elemkid[ii].querySelectorAll("*")
								 for(var nt = 0; nt < newtempel.length; nt++){
									 //****revist this for grandchildren code****
									 //for(var tl = 0; tl < tempchild.length; tl++){
										 //alert(newtempel[nt]+" == "+tl+" ("+nt+")")
										 if(newtempel[nt] == cnt){
											//tempA.push(tempchild[tl])
											tempA.push(elemkid[ii])
										 }
									 //}
								 }
								 cnt++
							 }
						 }else{
							 var elementk = elemkid[ii].getAttribute(tempel[0])
							 //$j("@id=john[class=%susan]") every id that is john and has children that end in susan
							 if(tempel[1].indexOf("%") == 0 && tempel[1].lastIndexOf("%") == 0 && elementk != null){
								 var res = tempel[1].replace("%", "");
									 tempel[1] = res;
								 var Logic = elementk.length == (elementk.indexOf(tempel[1])+tempel[1].length) && elementk.indexOf(tempel[1]) != -1;
							 }else
							 //$j("@id=john[class=susan%]") every id that is john and has children that begin with susan
							 if(tempel[1].indexOf("%")==(tempel[1].length-1) && tempel[1].lastIndexOf("%") == (tempel[1].length-1) && elementk != null){
								 var res = tempel[1].replace("%", "");
									 tempel[1] = res;
								 var Logic = elementk.indexOf(tempel[1]) == 0;
							 }else
							 //$j("@id=john[class=%susan%]") every id that is john and has children that has susan
							 if(tempel[1].indexOf("%") == 0 && tempel[1].lastIndexOf("%") == (tempel[1].length-1) && elementk != null){
								 var res = tempel[1].replace("%", "");
								 res = res.replace("%", "");
								 tempel[1] = res;
								 var Logic = elementk.indexOf(tempel[1]) >= 0;
							 }else{
								 var Logic = elementk == tempel[1];
							 }
							 if(Logic){
								 tempA.push(elemkid[ii])
							 }
						 }
						}else
						if(num[0] == 'a'){
							tempA.push(elemkid[ii]);
						}else
						if(num[0] == 'e'){
							if(ii % 2 == 0){
								tempA.push(elemkid[ii]);
							}
						}else
						if(num[0] == 'o'){
							if(ii % 2 == 1){
								tempA.push(elemkid[ii]);
							}
						}else
						if(num[0] == 'l'){
							if(kidlen - 1 == ii){
								tempA.push(elemkid[ii]);
							}
						}else
						if(num[num.length - 1] == '/]'){
							if (isNaN(parseInt(num[0])) == true) {
									if(elemkid[ii].tagName.toLocaleLowerCase() != num[0].toLocaleLowerCase()){
									tempA.push(elemkid[ii]);
								}
							}else{
								for(var y = 0; y < elemkid2.length; y++){
									if(y != parseInt(num[ii]) && num[ii] !== undefined && num[ii] != '/]'/* && $j().count(Fin,y) < 1*/){
										Fin.push(y)
									}
									if($j().count(Fin,y) > num.length - 2 && Don.indexOf(y) < 0){
										tempA.push(elemkid[y])
										Don.push(y)
										}

								}
							}
						}else
						if(num[num.length - 1] == 'a]'){
							if (isNaN(parseInt(num[0])) == true) {
									if(elemkid[ii].tagName.toLocaleLowerCase() == num[0].toLocaleLowerCase()){
									tempA.push(elemkid[ii]);
								}
							}
						}else
						if(typeof num[ii] !== 'undefined'){
							tempA.push(elemkid[parseInt(num[ii])]);
						}

					}

				}
			 }

			 return tempA;
		}

		function gtext(ele,fil,t){
			var tempA = [];
			if(t == false){
				 if(ele.search("@") >= 0){
							var tag = ele.substring(ele.indexOf("=")+1, ele.indexOf("("))
					fil = ele.substring(ele.indexOf("@")+1, ele.indexOf("="));

				 }else{
					var tag = ele.substr(1, ele.indexOf("(") - 1)
				 }
			}else{
				var tag = ele.substr(0, ele.indexOf("("))
			}
			var el = ele.indexOf(")");
			var nu = ele.substring(ele.indexOf("(")+1, ele.indexOf(")"));
			var elemparent = document.querySelectorAll("*");
				var parlen = elemparent.length;

				for(var i = 0; i < parlen; i++){
				if(fil != "all"){
					 var logic = (t == false) ? elemparent[i].getAttribute(fil) == tag : elemparent[i].tagName.toLocaleLowerCase() == tag.toLocaleLowerCase();
					 if(logic == true){
						var text = elemparent[i].value || elemparent[i].innerText || elemparent[i].textContent;
						if(text == nu){
							tempA.push(elemparent[i]);
						}
					 }
				}else{
						var text = elemparent[i].value || elemparent[i].innerText || elemparent[i].textContent;
						if(text == nu){
							tempA.push(elemparent[i]);
						}
				}
			}
			return tempA;
		}

		function content_filter(jtype,value,stype){
			var tempA = [];
			var elementAll = document.querySelectorAll("*");
			var elementRef = [];
			var elent = elementAll.length;
			if(elent > 0){
				if(value.indexOf("%") == 0 && value.lastIndexOf("%") == 0){
					 var res = value.replace("%", "");
					 value = res, stype = 0;

				}else
				if(value.indexOf("%") == (value.length-1) && value.lastIndexOf("%") == (value.length-1)){
					 var res = value.replace("%", "");
					 value = res, stype = 1;
				}else
				if(value.indexOf("%") == 0 && value.lastIndexOf("%") == (value.length-1)){
					 var res = value.replace("%", "");
					 res = res.replace("%", "");
					 value = res, stype = 2;
				}
				for ( var ii = 0; ii < elent; ii++ ) {
					var elementt = elementAll[ii].getAttribute(jtype);
					if(elementAll[ii].tagName.toLocaleLowerCase() != "script" && elementAll[ii].tagName.toLocaleLowerCase() != "title"){
						if(stype == -1){
							if(elementt == value){
								 tempA.push(elementAll[ii]);
							}
						}else if(stype == 0 && elementt != null){
							if(elementt.length == (elementt.indexOf(value)+value.length) && elementt.indexOf(value) != -1){
								 tempA.push(elementAll[ii]);
							}
						}else if(stype == 1 && elementt != null){
							if(elementt.indexOf(value) == 0){
								 tempA.push(elementAll[ii]);
							}
						}else if(stype == 2 && elementt != null){
							if(elementt.indexOf(value) >= 0){
								 tempA.push(elementAll[ii]);
							}
						}

					}
				}
			}
			return tempA;
		}

		for (var i = 0, len = els.length; i < len; ++i) {
			var element = els[i];

			if (typeof element === 'string') {
				 if(element.charAt(0) == "@"){
					//$j.("@id=john[1,3,5]")
					if(element.charAt(element.length - 1) == "]"){
						var tem = kid(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("@id=john/")
					if(element.charAt(element.length - 1) == "/"){
						var tempel = element.split("=")
						tempel[0] = element.substring(element.indexOf("@")+1, element.indexOf("="));
						tempel[1] = element.substring(element.indexOf("="), element.indexOf("/")+1);
						var tem = filtr(tempel[1],tempel[0])

						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.(@id=john<1)  $j.("#id<2") $j.("#id<3")
					if(element.search("<") >= 0){
						var tem = parents(element,"i",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("@id=john{float=left}")
					if(element.search("{") >= 0){
						var tem = style(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("@id=john(text)")
					if(element.charAt(element.length - 1) == ")"){
						var tem = gtext(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else{
					 //$j.("@id=john")
					 if(element.search("=") >= 0){

							var stype = -1;
							var tempel = element.split("=")
							tempel[0] = element.substring(element.indexOf("@")+1, element.indexOf("="));
							var tem = content_filter(tempel[0],tempel[1],stype)
							this.elements = this.elements.concat(tem).unique();
					 }
						 //element = document.getElementById(element.substr(1, element.length - 1));
					}
				 }else
				 if(element.charAt(0) == "#"){
					//$j.("#id[1,3,5]")
					if(element.charAt(element.length - 1) == "]"){
						var tem = kid(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("#id/")
					if(element.charAt(element.length - 1) == "/"){
						var tem = filtr(element,"id")
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("#id<1")  $j.("#id<2") $j.("#id<3")
					if(element.search("<") >= 0){
						var tem = parents(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("#id{float=left}")
					if(element.search("{") >= 0){
						var tem = style(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("#id(text)")
					if(element.charAt(element.length - 1) == ")"){
						var tem = gtext(element,"id",false)
						this.elements = this.elements.concat(tem).unique();
					}else{
					 //$j.("#id")
						 element = document.getElementById(element.substr(1, element.length - 1));
					}
				 }else
				 if(element.charAt(0) == "."){
					//$j.(".class[1,3,5]")
					if(element.charAt(element.length - 1) == "]"){
						var tem = kid(element,"class",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.(".class/")
					if(element.charAt(element.length - 1) == "/"){
						var tem = filtr(element,"class")
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.(".class<")
					if(element.search("<") >= 0){
						var tem = parents(element,"class",false)
						this.elements = this.elements.concat(tem).unique();
					}
					//$j.(".class=john{float=left}")
					if(element.search("{") >= 0){
						var tem = style(element,"class",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.(".class(text)")
					if(element.charAt(element.length - 1) == ")"){
						var tem = gtext(element,"class",false)
						this.elements = this.elements.concat(tem).unique();
					}else{
						//$j.(".class")
						var elent = document.getElementsByClassName(element.substr(1, element.length - 1)).length;
						var elementt = document.getElementsByClassName(element.substr(1, element.length - 1));
						if(elent > 0){
							for ( var ii = 0; ii < elent; ii++ ) {
								this.elements.push(elementt[ii]);
							}
						}
					}
				 }else
				 if(element.charAt(0) == "?"){
					//$j.("?name[1,3,5]") children with the following index of the parent name
					if(element.charAt(element.length - 1) == "]"){
						var tem = kid(element,"name",false)
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("?name/) everything except name
					if(element.charAt(element.length - 1) == "/"){
						var tem = filtr(element,"name")
						this.elements = this.elements.concat(tem).unique();
					}else
					//$j.("#id<")  $j.("#id<<") $j.("#id<<<")
					if(element.search("<") >= 0){
						var tem = parents(element,"name",false)
						this.elements = this.elements.concat(tem).unique();
					}
					//$j.("?name(text)")
					if(element.charAt(element.length - 1) == ")"){
						var tem = gtext(element,"name",false)
						this.elements = this.elements.concat(tem).unique();
					}else{
						//$j.("?name) all name
						var elementtn = document.querySelectorAll("*");
						var elent = elementtn.length;
						if(elent > 0){
							for ( var ii = 0; ii < elent; ii++ ) {
								var elementt = elementtn[ii].getAttribute("name");
								//alert(".string "+elementt)
								if(elementtn[ii].tagName.toLocaleLowerCase() != "script" && elementtn[ii].tagName.toLocaleLowerCase() != "title"){
									if(elementt == element.substr(1, element.length - 1)){
									 this.elements.push(elementtn[ii]);
									}
								}
							}
						}
					}
				 }else
				 if(element.charAt(0) == "("){
					if(element.charAt(element.length - 1) == ")"){
						var tem = gtext(element,"all",false)
						this.elements = this.elements.concat(tem).unique();
					}
				 }else{
					//$j.("tag[1,3,5])
					if(element.charAt(element.length - 1) == "]"){
					 var tag = element.substr(0, element.indexOf("["))
					 //alert(tag)
					 if(element.charAt(element.length - 1) == "]"){
						var tem = kid(element,tag,true)
						this.elements = this.elements.concat(tem).unique();
						 }
					}else
					//$j.("tag/")
					if(element.charAt(element.length - 1) == "/"){
						var tag = element.substr(0, element.length - 1)
						var elementtn = document.querySelectorAll(":not("+tag+")");
						var elent = elementtn.length;

						if(elent > 0){
							for ( var ii = 0; ii < elent; ii++ ) {
								if(elementtn[ii].tagName.toLocaleLowerCase() != "script" && elementtn[ii].tagName.toLocaleLowerCase() != "title"){
								 //alert(element+" : "+elent+" - "+elementtn[ii].tagName.toLocaleLowerCase())
									 this.elements.push(elementtn[ii]);
								}
							}
						}
					}else
					//$j.("tag(text)")
					if(element.charAt(element.length - 1) == ")"){
						var tem = gtext(element,tag,true)
						this.elements = this.elements.concat(tem).unique();
					}else{
							//$j.("tag")
						//$j.("@id=john{float=left}")
						if(element.search("{") >= 0){
							var tem = style(element,"id",false)
							this.elements = this.elements.concat(tem).unique();
						}else{
							var elementtn = document.getElementsByTagName(element);
							var elent = elementtn.length;
							if(elent > 0){
								for ( var ii = 0; ii < elent; ii++ ) {
									this.elements.push(elementtn[ii]);
								}
							}
						}
					}
				 }

			}

			if (typeof element !== 'string' && element != null) {
				 this.elements.push(element);
			}
		}
	}


GLOBAL_STYLE.innerHTML +=".block{width:300px;height:300px;position:fixed;top:100px;left:500px;z-index:3;background:#ababab;}";
GLOBAL_STYLE.innerHTML +=".hblock{float:left;width:100%;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".bblock{float:left;width:%;height:%;padding:5px;font-family:arial;overflow-x:hidden;overflow-y:visible;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".htblock{float:left;padding-top:5px;font-family:arial;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".icblock{float:left;width:25px;border-radius:5px 5px 5px 5px;margin:2px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".radius-5{border-radius:5px 5px 5px 5px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".radius-top-5{border-radius:10px 10px 0px 0px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".radius-10{border-radius:10px 10x 10px 10px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".border-1{border-style:solid;border:thin;border-color:#000;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".window_controls{float:right;height:20px;width:50px;margin:2px;padding:3px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".clickable{cursor:pointer;}";
GLOBAL_STYLE.innerHTML +=".hide_icon{width:40px;height:40px;position:fixed;top:0px;left:0px;z-index:3;background:#333;display:none;padding:5px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".nav_icon{width:30px;height:30px;position:fixed;top:0px;left:0px;z-index:3;background:#333;padding:5px;border-style:none;}";
GLOBAL_STYLE.innerHTML +=".nav_count{position:fixed;top:0px;left:0px;z-index:3;padding:5px;border-style:solid; border-width:thin;}";

document.getElementsByTagName("head")[0].appendChild(GLOBAL_STYLE);
	_$j.prototype = {
		each: function(fn) {
			for ( var i = 0, len = this.elements.length; i < len; ++i ) {
						 fn.call(this, this.elements[i]);
			}
			return this;
		},
		kids: function(fil){
			var tempA = [];
			this.each(function(el) {
					var ele = el;
					var Del = [];
					var Fin = [];
					var del = {};
					var stype = -1;
				if(fil.indexOf(",") == -1){
						var nu = fil.substring(fil.indexOf("[")+1, fil.indexOf("]"));
						if(nu.length == 1){
							if(nu == "a"){
							 var num = ["a"];
							}else
							if(nu == "e"){
							 var num = ["e"];
							}else
							if(nu == "o"){
							 var num = ["o"];
							}else
							if(nu == "l"){
							 var num = ["l"];
							}else{
							 var num = [parseInt(nu)];
							}
						}else if(nu.length > 1){
							var num = [nu];
						}
				 }else{
					 if(fil.indexOf("|") == -1){
						if(t == false){
							var num = fil.substr(fil.indexOf("[")+1, fil.indexOf("]")).split(",");
						}else{
							var num = fil.substr(fil.indexOf("["), fil.indexOf("]")).split(",");
						}
					 }else{
						var nu = fil.substring(fil.indexOf("[")+1, fil.indexOf("]"));
						var num = [nu];
					 }
				 }

				var elemkid = el.children
				var elemkid2 = el.children
				var kidlen = elemkid.length

				var cnt = 0;
				for(var ii = 0; ii < kidlen; ii++){
					if(num[0].toString().search("=") >= 0){
						 var styp = -1;
						 var tempel = num[0].split("=")

						 if(tempel[1].indexOf("|") >= 0){
							 var ntel = tempel[1].split("|")
							 var newtempel = ntel[1].split(",")
							 var elementk = elemkid[ii].getAttribute(tempel[0])
							 //$j("@id=john[class=%susan|1,3]") every id that is john and has children that end in susan but only the 2nd and 4th child
							 if(ntel[0].indexOf("%") == 0 && ntel[0].lastIndexOf("%") == 0 && elementk != null){
								 var res = ntel[0].replace("%", "");
								 ntel[0] = res;
								 var Logic = elementk.length == (elementk.indexOf(ntel[0])+ntel[0].length) && elementk.indexOf(ntel[0]) != -1;
							 }else
							 //$j("@id=john[class=susan%|1,3]") every id that is john and has children that begin with susan but only the 2nd and 4th child
							 if(ntel[0].indexOf("%") == (ntel[0].length-1) && ntel[0].lastIndexOf("%") == (ntel[0].length-1) && elementk != null){
								 var res = ntel[0].replace("%", "");
								 ntel[0] = res;
								 var Logic = elementk.indexOf(ntel[0]) == 0;
							 }else
							 //$j("@id=john[class=%susan%|1,3]") every id that is john and has children that has susan but only the 2nd and 4th child
							 if(ntel[0].indexOf("%") == 0 && ntel[0].lastIndexOf("%") == (ntel[0].length-1) && elementk != null){
								 var res = ntel[0].replace("%", "");
								 res = res.replace("%", "");
								 ntel[0] = res;
								 var Logic = elementk.indexOf(ntel[0]) >= 0;
							 }else{

								 var Logic = elementk == ntel[0];
							 }
							 if(Logic){
								 var tempchild = elemkid[ii].querySelectorAll("*")
								 for(var nt = 0; nt < newtempel.length; nt++){
									 //****revist this for grandchildren code****
									 //for(var tl = 0; tl < tempchild.length; tl++){
										 //alert(newtempel[nt]+" == "+tl+" ("+nt+")")
										 if(newtempel[nt] == cnt){
											//tempA.push(tempchild[tl])
											tempA.push(elemkid[ii])
										 }
									 //}
								 }
								 cnt++
							 }
						 }else{
							 var elementk = elemkid[ii].getAttribute(tempel[0])
							 //$j("@id=john[class=%susan]") every id that is john and has children that end in susan
							 if(tempel[1].indexOf("%") == 0 && tempel[1].lastIndexOf("%") == 0 && elementk != null){
								 var res = tempel[1].replace("%", "");
								 tempel[1] = res;
								 var Logic = elementk.length == (elementk.indexOf(tempel[1])+tempel[1].length) && elementk.indexOf(tempel[1]) != -1;
							 }else
							 //$j("@id=john[class=susan%]") every id that is john and has children that begin with susan
							 if(tempel[1].indexOf("%")==(tempel[1].length-1) && tempel[1].lastIndexOf("%") == (tempel[1].length-1) && elementk != null){
								 var res = tempel[1].replace("%", "");
								 tempel[1] = res;
								 var Logic = elementk.indexOf(tempel[1]) == 0;
							 }else
							 //$j("@id=john[class=%susan%]") every id that is john and has children that has susan
							 if(tempel[1].indexOf("%") == 0 && tempel[1].lastIndexOf("%") == (tempel[1].length-1) && elementk != null){
								 var res = tempel[1].replace("%", "");
								 res = res.replace("%", "");
								 tempel[1] = res;
								 var Logic = elementk.indexOf(tempel[1]) >= 0;
							 }else{
								 var Logic = elementk == tempel[1];
							 }
							 if(Logic){
								 tempA.push(elemkid[ii])
							 }
						 }
					}else
					if(num[0] == 'a'){
						tempA.push(elemkid[ii]);
					}else
					if(num[0] == 'e'){
						if(ii % 2 == 0){
							tempA.push(elemkid[ii]);
						}
					}else
					if(num[0] == 'o'){
						if(ii % 2 == 1){
							tempA.push(elemkid[ii]);
						}
					}else
					if(num[0] == 'l'){
						if(kidlen - 1 == ii){
							tempA.push(elemkid[ii]);
						}
					}else
					if(num[num.length - 1] == '/]'){
						if (isNaN(parseInt(num[0])) == true) {
							if(elemkid[ii].tagName.toLocaleLowerCase() != num[0].toLocaleLowerCase()){
								tempA.push(elemkid[ii]);
							}
						}else{
							//edited 7-1-15
							for(var y = 0; y < elemkid2.length; y++){
								if(y == parseInt(num[ii]) && num[ii] !== undefined && num[ii] != '/]'){
									Fin.push(num[ii])
								}
								if(y != parseInt(num[ii]) && num[ii] !== undefined && num[ii] != '/]'){
									if(Fin.indexOf(parseInt(num[ii])) < 0){
										tempA.push(elemkid[y])
									}
								}
							}
						}
					}else
					if(num[num.length - 1] == 'a]'){
						if (isNaN(parseInt(num[0])) == true) {
							if(elemkid[ii].tagName.toLocaleLowerCase() == num[0].toLocaleLowerCase()){
								tempA.push(elemkid[ii]);
							}
						}
					}else
					if(typeof num[ii] !== 'undefined'){
						tempA.push(elemkid[parseInt(num[ii])]);
					}

				}
			})

			var K = [];
			return tempA.unique();
		},
		PAGE: function(ob,fn){
			var P = [], index = 0
			var x, y, coor, W = document.body.clientWidth + 50
			var out = "hide", inn = "show", time = 300, mouse = false, page = 0, start = 0
			if(typeof ob === "object"){
			   if("out" in ob){
				   out = ob["out"]   
			   }
			   if("inn" in ob){
				   inn = ob["inn"]   
			   }
			   if("page" in ob){
				   page = ob["page"]   
			   }
			   if("start" in ob){
				   start = ob["start"]   
			   }
			}
			if(ob["setup"] == true){
				if($j("@data-jlib-type=page").attribute("data-jlib-pageStarted") != "yes"){
				   $j("@data-jlib-type=page["+start+",/]").setStyle("display","none").setStyle("left",(W*-1)+"px")
				   $j("@data-jlib-type=page["+start+"]").attribute("data-jlib-pageSelected","1")
				   $j("@data-jlib-type=page").attribute("data-jlib-pageStarted","yes")	
				}
			}else{
				if(mouse == true){
					
					var L = $j("@data-jlib-type=page[l]").index()
				
					//*
					$j("@data-jlib-type=page[a]").after("mousemove",function(e){
						x = e.clientX;
						y = e.clientY;
						P.push(x)
						var coor = "Coordinates: (" + x + "," + y + ")";
						$j("#e0").embed(coor)
					})
					
					$j("@data-jlib-type=page[a]").after("click",function(){
							
							if(mouse == true){
								$j("#e1").embed(coor+" | "+index)
								if(P[P.length - 1] > P[P.length - 2]){					
									if(index < L){
									   $j(this).play("slideoutRight",300)
									   index++
									   setTimeout(function(){
										   $j("@data-jlib-type=page["+index+"]").play("slideinLeft",300)
									   },150)
									}
										
								}
								if(P[P.length - 1] < P[P.length - 2]){					
									if(index > 0){
									   $j(this).play("slideoutLeft",300)
									   index--
									   setTimeout(function(){
										   $j("@data-jlib-type=page["+index+"]").play("slideinRight",300)
									   },300)
									}
									
								}
							}		
					})
				}
				if(mouse == false){
					$j("@data-jlib-pageSelected=1").play(out,time)
					$j("@data-jlib-pageSelected=1").attribute("data-jlib-pageSelected","0")
					setTimeout(function(){
					   $j("@data-jlib-type=page["+page+"]").play(inn,time)
					   $j("@data-jlib-type=page["+page+"]").attribute("data-jlib-pageSelected","1")
					},time*.9)
				}
			}
		},
		colorBrightness: function(hex, percent){
			 var hash;
			 var hex = hex.replace("#", "", "gi");
			 var split_hex = hex.split("");
			 hash = '#';
			 percent = percent / 100;
			 var rgb = [parseInt(split_hex[0]+split_hex[1], 16), parseInt(split_hex[2]+split_hex[3], 16), parseInt(split_hex[4]+split_hex[5], 16)];
			 for(var i = 0; i < 3;  i++){
				rgb[i] = Math.round(rgb[i] + (255 * percent))
				if (rgb[i] > 255){
					rgb[i] = 255;
				}
				if (rgb[i] < 0){
					rgb[i] = 0;
				}
			 }

			 var hex2 = '';
			 for(i = 0; i < 3; i++) {
				rgb[i] = parseInt(rgb[i])
				var hexDigit = rgb[i].toString(16);
				if(hexDigit.length == 1) {
				 hexDigit = "0"+hexDigit;
				}
				hex2 = hex2 + hexDigit;
			 }
			 return [hash+hex,hash+hex2];
		},
		gradient: function(hex,revert,reflected){
			var bg, prefix = "";
			if($j().browser() == "Safari"){
				prefix = "-webkit-"
			}
			//this.each(function(el) {
				h1 = hex[0];
				h2 = hex[1];
				if(reflected == false){
					if(revert != true){
						 bg = prefix+"linear-gradient("+h1+","+h2+")";
					}else{
						bg = prefix+"linear-gradient("+h2+","+h1+")";
					}
				}else{
					if(revert != true){
						 bg = prefix+"linear-gradient("+h1+","+h2+","+h1+")";
					}else{
						bg = prefix+"linear-gradient("+h2+","+h1+","+h2+")";
					}
				}
			//});
			return bg;
		},
		setStyle: function(prop, val) {
			this.each(function(el) {
				 el.style[prop] = val;
			});
			return this;
		},
		toggle: function(a,b,fn){
			var tog = false;
			this.each(function(el) {
				$j(el).after("click",function(){
					var dran = $j(el).attribute("data-jlib-toggle")
					//alert(dran)
					if(dran == null || dran == "null"){
						dran = $j().randomized(8)
						$j(el).attribute("data-jlib-toggle",dran)
						tog = true
						fn(a, el)
					}else{
						$j(el).attribute("data-jlib-toggle",null)
						tog = false
						fn(b, el)
					}
				})
			})
			return this
		},
		appendStyle: function(ob){
			this.each(function(el) {
				if("style" in ob){
					if(typeof ob["style"] !== "undefined"){
						var key = Object.keys(ob["style"])
						//alert(color)
						for(var j = 0; j < key.length; j++){
							el.style[key[j]] = ob["style"][key[j]];
						}
					}
				}
			})
			return this;
		},
		class: function(type,name) {
			var that = this;
			var cl;
			this.each(function(el) {
			 if(type == "add"){
					cl = el.classList.add(name);
			 }else if(type == "remove"){
					cl = el.classList.remove(name);
			 }else if(type == "return"){
					cl = el.classList;
			 }else if(type == "contain"){
					cl = el.classList.contains(name)
				 }
			});
			if(type == "add"){
				return this
			}else if(type == "remove"){
				return this
			}else if(type == "return"){
				cl = el.classList;
			}else if(type == "contain"){
				cl = el.classList.contains(name)
			}

		},
		attribute: function(u,v) {
			var that = this;
			var cl;
			this.each(function(el) {
				if(v === undefined){
					if(u == "tag"){
						cl = el.tagName.toLocaleLowerCase()
					}else{
							 cl = el.getAttribute(u)
						 //alert(cl)
					}
				}else{
					el.setAttribute(u,v)
				}
			});
			if(v === undefined){
				return cl;
			}else if(typeof v === "string"){
				return this;
			}
		},
		id: function(v) {
			var that = this;
			var cl;
			this.each(function(el) {
				if(v === undefined){
					cl = el.getAttribute("id")
				}else{
					el.setAttribute("id",v)
				}
			});
			if(v === undefined){
				return cl;
			}else if(typeof v === "string"){
				return this;
			}
		},
		src: function(v) {
			var that = this;
			var cl;
			this.each(function(el) {
				if(v === undefined){
					cl = el.getAttribute("src")
				}else{
					el.setAttribute("src",v)
				}
			});
			if(v === undefined){
				return cl;
			}else if(typeof v === "string"){
				return this;
			}

		},
		disabled: function(v) {
			var that = this;
			var cl;
			this.each(function(el) {
				if(v === undefined){
					cl = el.getAttribute("disabled")
				}else{
					if(v != false){
							 el.setAttribute("disabled","disabled")
					}else{
						el.removeAttribute("disabled")
					}
				}
			});
			if(v === undefined){
				return cl;
			}else{
				return this;
			}

		},
		after: function(type, fn, val) {
			var add = function(el) {
				if(val != false){
					if (window.addEventListener) {
						if(type == "focusout" || type == "focusin" && $j().browser() == "Firefox"){
							if(type == "focusout"){
								 el.addEventListener("blur", fn, false);
							}
							if(type == "focusin"){
								 el.addEventListener("blur", fn, false);
							}
						}else{
						 el.addEventListener(type, fn, false);
						}
					}
					else if (window.attachEvent) {
					el.attachEvent('on'+type, fn);
					}
				}else{
					if (window.removeEventListener) {
					 el.removeEventListener(type, fn);
					}
					else if (window.attachEvent) {
					el.detachEvent('on'+type, fn);
					}
				}
			};
			this.each(function(el) {
				 add(el);
			});
			return this;
		},
		removeAfter: function(type, fn){
			var add = function(el) {
				alert(type)
				el.removeEventListener(type, fn, false);
			}
			this.each(function(el) {
				 add(el);
			});
			return this;
		},
		pageSet: function(fn) {
			if (window.addEventListener) {
				 window.addEventListener("load", fn, false);
			}
			else if (window.attachEvent) {
				window.attachEvent("onload", fn);
			}
			return this;
		},
		TAB: function(ob,fn){
		
			var w = "100%", h = "100px", bg = "#fff", data = "", id = "", overflow = true
			if(typeof ob === "object"){
				if("width" in ob){
					w = ob["width"]
				}
				if("height" in ob){
					h = ob["height"]
				}
				if("background" in ob){
					bg = ob["background"]
				}
				if("data" in ob){
					data = ob["data"]
				}
				if("id" in ob){
					id = ob["id"]
				}
				if("overflow" in ob){
					overflow = ob["overflow"]
				}
			}
			this.each(function(el) {
				var ran = $j(el).attribute("id"), o = "auto"
				if(overflow != true){
				   o = "hidden"	
				}
				//GLOBALS["toggle"] = ran
				var sty = "float:left; width:"+w+"; height:"+h+"; padding:5px 0px 5px 0px; background:"+bg+"; display:none; overflow-y:"+o+";"
				var div = "<div style='"+sty+"' data-jlib-tab='"+ran+"' class='jlib_tab' id='"+id+"'></div>"
				$j("@data-jlib-toggle=1").play("slideup",150).attribute("data-jlib-toggle",0)
				
				if($j().exist("@data-jlib-tab="+ran) == 0){
				    $j(el).affix("after",div)
					$j("@data-jlib-tab="+ran).attribute("data-jlib-toggle",0)					
				}
				$j("@data-jlib-tab="+ran).embed("").embed(data)
				setTimeout(function(){
					//$j(el).embed(" "+ran+" : "+$j("@data-jlib-tab="+ran).attribute("data-jlib-toggle"))
					if($j("@data-jlib-tab="+ran).attribute("data-jlib-toggle") == 0){
				       $j("@data-jlib-tab="+ran).play("slidedown",300)
					   $j("@data-jlib-tab="+ran).attribute("data-jlib-toggle",1)
					}else if($j("@data-jlib-tab="+ran).attribute("data-jlib-toggle") == 1){
					   $j("@data-jlib-tab="+ran).attribute("data-jlib-toggle",0)
					}					
				},200)
				
				
			})
		},
		WARNING: function(ob,fn){
			var mes, confirm = false, btn_color = "#00E676", mes_color = "", btn_text = "Ok", can_text = "Cancel"
			if(typeof ob === "object"){
				if("message" in ob){
					mes = ob["message"]
				}
				if("confirm" in ob){
					confirm = ob["confirm"]
				}
				if("buttonColor" in ob){
					btn_color = ob["buttonColor"]
				}
				if("messageColor" in ob){
					mes_color = ob["messageColor"]
				}
				if("buttonText" in ob){
					btn_text = ob["buttonText"]
				}
				if("cancelText" in ob){
					can_text = ob["cancelText"]
				}
			}
			this.each(function(el) {
				ran = $j(el).embed("").attribute("id")
				$j(el).affix("end","<div style='float:left; width:100%; padding:5px 0px 5px 0px; text-align:center; background:"+mes_color+";' data-jlib-mes='"+ran+"'></div>")
				if(confirm == false){
					$j(el).affix("end","<div style='float:left; color:#fff; width:96%; padding:5px 0px 5px 0px; font-weight:500; font-size:1.2em; text-align:center; background:"+btn_color+"; cursor:pointer; margin:10px 2% 0px 2%;' data-jlib-btn='"+ran+"'>"+btn_text+"</div>") 
					$j("@data-jlib-mes="+ran).embed(mes)
					$j(el).OVERLAY({time:300})
					$j("@data-jlib-btn="+ran).after("click",function(){
						$j(el).OVERLAY("close")
					}).enhance({reflect:false, shadow:"spread2d", border:30, percent:5, radius:1, rest:"darker+", inset:false})
				}else{
					$j(el).affix("end","<div style='float:left; color:#fff; width:46%; padding:5px 0px 5px 0px; font-weight:500; font-size:1.2em; text-align:center; background:"+btn_color+"; cursor:pointer; margin:10px 2% 0px 2%;' data-jlib-btn='"+ran+"'>"+btn_text+"</div>")
					$j(el).affix("end","<div style='float:left; color:#fff; width:46%; padding:5px 0px 5px 0px; font-weight:500; font-size:1.2em; text-align:center; background:#d50000; cursor:pointer; margin:10px 2% 0px 2%;' data-jlib-can='"+ran+"'>"+can_text+"</div>") 
					$j("@data-jlib-mes="+ran).embed(mes)
					$j(el).OVERLAY({time:300})
					$j("@data-jlib-btn="+ran).after("click",function(){
						$j(el).OVERLAY("close")
						fn(true)
					}).enhance({reflect:false, shadow:"spread2d", border:30, percent:5, radius:1, rest:"darker+", inset:false})
					$j("@data-jlib-can="+ran).after("click",function(){
						$j(el).OVERLAY("close")
						fn(false)
					}).enhance({reflect:false, shadow:"spread2d", border:30, percent:5, radius:1, rest:"darker+", inset:false})
				}
			})
		},
		unique: function(o){
			var l = o.length, nar = [], c = [];
			for(var i = 0; i < o.length; i++){
				if($j().count(c,o[i]) < 1){
					 if(o[i] !== undefined || o[i] !== "undefined" || o[i] != "" || o[i] != " "){
							c[i] = o[i]
					 }
				}
			}
			A = []
			for(var i = 0; i < c.length; i++){
				if(c[i] !== undefined){
					 A.push(c[i])
				}
			}
			return A;

		},
		Reverse: function(ar) {
				var l = ar.length, nar = [], x;
			for(var i = 0; i < ar.length; i++){
				x = l - i - 1;
				nar[x] = ar[i]
			}
			return nar;
		},
		Sort: function(ar){
			var ob = {}, N = []
			for(var i = 0; i < ar.length; i++){
				d = 0;
				for(var x = 0; x < ar.length; x++){
					if(ar[i] > ar[x]){
						d++;
					}
				}
				ob[d] = ar[i];
			}
			for(var i = 0; i < ar.length; i++){
				N[i] = ob[i]
			}
			return N
		},
		index: function(){
			var ind;
			this.each(function(el) {
				var par = el.parentNode;
				var nodeList = Array.prototype.slice.call( par.children );
				ind = nodeList.indexOf(el);
			});
			return ind;
		},
		roundup: function(num,po,v){
			//rounds off to the nearest whole number designated by po
			var nt = num
			var res, des = 10, power = 0.1, sto = false, poo = po, cnt = 1;
			if(po < 1 && po > 0){

				while(!sto){
					 if(po < (des/10) && po >= (des/100)){
						sto = true
					 }else{
						power = power / 10
						des = des / 10
						cnt++
					 }
				}
				var flr = $j().roundoff(num,cnt);
					var rnd = $j().roundoff(num,cnt);
				num = $j().roundoff(num,cnt);
				po = parseInt(po / power)
				rnd = parseInt(rnd / power)
				flr = parseInt(flr / power)
				num = parseInt(num / power)
			}else{
				var flr = Math.floor(num);
					var rnd = Math.round(num);
			}

			if(po > 0){
				if(typeof rnd === "number" && isNaN(rnd) == false){
					//alert(rnd)
					var rn = rnd % po
					while(rn != 0){
							rnd++
							rn = rnd % po
					}
					while((flr % po) != 0){
							flr--
					}
					if(v === undefined){
						if((rnd - num) < (num - flr)){
							res = rnd
						}else if((rnd - num) >= (num - flr)){
							res = flr
						}
					}else if(v == "up"){
						res = rnd
					}else if(v == "down"){
						res = flr
					}
				}else{
					res = parseFloat(num)
				}
				//alert(num+" : "+flr+" : "+rnd+" | "+(rnd - num)+" | "+(num - flr)+" == "+res)
			}else{
				 res = parseInt(num)
			}
			if(poo < 1){
				 res = res * power
				 res = $j().roundoff(res,cnt);
			}
			return res
		},
		roundoff: function(num,po){
			var str = num.toString().split("."), sem ="";
			//alert(str[1]+" : "+typeof str[1])
			if(typeof str[1] !== "undefined"){
				 var rem = str[1].substring(0,po)
			}else{
				if(typeof po !== "undefined"){
					 var rem = "0";
				}
			}
			//alert(rem.charAt(0))
			for(var i = 0; i < rem.length; i++){
					if(rem.charAt(i) == "0"){
					sem = sem+"0";
				}
			}

			if(sem.charAt(i) == "0"){
				 var ne = parseInt(str[0])+"."+sem+parseInt(rem);
			}else
			if(sem.charAt(i) != "0"){
				 var ne = parseInt(str[0])+"."+parseInt(rem);
			}
			//alert(typeof ne)
			//ne = parseFloat(ne)
			//alert(typeof ne)

			return ne;
		},
		parseDate: function(dob){
			var ds = dob.split(" ")
			alert(ds[3])
		},
		intDate: function(type){
			var dt0 = new Date();
			var mnts = ["January","February","March","April","May","June","July","August","September","October","November","December"]
			var ly = parseInt(dt0.getMonth()), days = 0;
			for(var i = 0; i < ly; i++){
				var dt1 = new Date(mnts[i]+" 31, "+dt0.getFullYear())
				//alert(dt1.getDate()+"="+parseInt(dt1.getDate()))
				var off = 31 - parseInt(dt1.getDate());
				if(off == 0){
					off = 31;
				}
				if(i == ly){
					off = parseInt(dt0.getDate())
					//alert(days+" = "+off)
				}
				//alert(days+"-"+off+":"+ly)
				days = days + off
				//alert(days+" : "+mnts[i]+": "+off)
			}
			var dt = new Date();
						var m = parseInt(dt.getMonth())+1;
			var y = parseInt(dt.getFullYear());
			var d = parseInt(dt.getDate());

			var indate, ds = days.toString();
			if(ds.length == 1){
				ds = "00"+ds
			}else if(ds.length == 2){
				ds = "0"+ds
			}
			ds = parseInt(ds)
			if(type == true){
				intdate = y+""+ds
			}else{
				intdate = ds
			}
			//alert(intdate+"-"+m+"-"+y+"-"+d+"-"+ds)
			intdate = parseInt(intdate);
			//alert(intdate)
			return intdate
		},
		intTime: function(type){
			var dt = new Date();
						var m = parseInt(dt.getMinutes());
			var y = parseInt(dt.getHours());
			var d = parseInt(dt.getSeconds());
			var indate, ms = m.toString(), ds = d.toString(), ys = y.toString();
			if(ms.length == 1){
				ms = "0"+ms
			}
			if(ds.length == 1){
				ds = "0"+ds
			}
			if(type == "seconds"){
				var hs = parseInt(ys) * 60 * 60;
				var mts = parseInt(ms) * 60;
				var s = parseInt(ds)
				intdate = hs + mts + s;
				//alert(intdate+" = "+hs+" + "+mts+" + "+s);
			}
			if(type == "minutes"){
				var hs = parseInt(ys) * 60;
				var mts = parseInt(ms);
				var s = parseInt(ds) / 60;
				intdate = hs + mts + s;
				//alert(intdate+" = "+hs+" + "+mts+" + "+s);
			}
			if(type == "hours"){
				var hs = parseInt(ys);
				var mts = parseInt(ms) / 60;
				var s = parseInt(ds) / 3600;
				intdate = hs + mts + s;
				//alert(intdate+" = "+hs+" + "+mts+" + "+s);
			}
			//alert(typeof intdate)
			intdate = parseFloat(intdate);
			//alert(typeof intdate)
			return intdate
		},
		Day: function(typ){
			var Days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
			var date = new Date();
			date.setFullYear(14, 0, 1);

			var date = new Date();

			if(typeof typ === "object" && "type" in typ){
				if("month" in typ){
					m = typ["month"];
				}
				if("year" in typ){
					y = typ["year"];
				}
				var firstDay = new Date(y, m, 1);
					var lastDay = new Date(y, m + 1, 0);
				if("dayType" in typ && typ["dayType"] == "day"){
					if(typ["type"] == "first"){
						 return Days[firstDay.getDay()]
					}else{
						return Days[lastDay.getDay()]
					}
				}else{
					if(typ["type"] == "first"){
						 return firstDay.getDay()
					}else{
						return lastDay.getDay()
					}
				}
			}
		},
		CALENDAR: function(ob,fn){
			this.each(function(el) {
				$j(el).embed(" ")
				if($j(el).trueStyle("display") == "none"){
					$j(el).setStyle("display","block")
				}
				var dt0 = new Date(), ret = "digit", DATE_dig, DATE_str, ins, Tm, wind = false, ID = $j(el).id(), month_ = true, year_ = true, hour_ = true, info_;
				var mnts = ["January","February","March","April","May","June","July","August","September","October","November","December"]
				var Days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
				var ly = parseInt(dt0.getMonth()), days = 0;
				var mcolor = "#000", mbackground = "#ffffff", mfont ="arial", mgradient = 10, mshadow = "spread3", mradius = 0, mfs = "20px"
				var dcolor = "#000", dbackground = "#ffffff", dfont ="arial", dgradient = 10, dshadow = "spread5", dradius = 0, dfs = "20px"
				var bcolor = "#000", bbackground = "#666666", bfont ="arial", bgradient = 10, bshadow = "spread3d", bradius = 0, bfs = "20px", range = [30,0]
				if(typeof ob === "object"){
					if("monthSelector" in ob){
						 if("color" in ob["monthSelector"]){
							 mcolor = ob["monthSelector"]["color"]
						 }
						 if("background" in ob["monthSelector"]){
							 mbackground = ob["monthSelector"]["background"]
						 }
						 if("font" in ob["monthSelector"]){
							 mfont = ob["monthSelector"]["font"]
						 }
						 if("gradient" in ob["monthSelector"]){
							 mgradient = ob["monthSelector"]["gradient"]
						 }
						 if("shadow" in ob["monthSelector"]){
							 mshadow = ob["monthSelector"]["shadow"]
						 }
						 if("radius" in ob["monthSelector"]){
							 mradius = ob["monthSelector"]["radius"]
						 }
						 if("fsize" in ob["monthSelector"]){
							 mfs = ob["monthSelector"]["fsize"]
						 }
					}
					if("daysHeader" in ob){
						 if("color" in ob["daysHeader"]){
							 dcolor = ob["daysHeader"]["color"]
						 }
						 if("background" in ob["daysHeader"]){
							dbackground = ob["daysHeader"]["background"]
						 }
						 if("font" in ob["daysHeader"]){
							 dfont = ob["daysHeader"]["font"]
						 }
						 if("gradient" in ob["daysHeader"]){
							 dgradient = ob["daysHeader"]["gradient"]
						 }
						 if("shadow" in ob["daysHeader"]){
							 dshadow = ob["daysHeader"]["shadow"]
						 }
						 if("radius" in ob["daysHeader"]){
							 dradius = ob["daysHeader"]["radius"]
						 }
						 if("fsize" in ob["daysHeader"]){
							 dfs = ob["daysHeader"]["fsize"]
						 }
					}
					if("daysBody" in ob){
						 if("color" in ob["daysBody"]){
							 bcolor = ob["daysBody"]["color"]
						 }
						 if("background" in ob["daysBody"]){
							 bbackground = ob["daysBody"]["background"]
						 }
						 if("font" in ob["daysBody"]){
							 bfont = ob["daysBody"]["font"]
						 }
						 if("gradient" in ob["daysBody"]){
							 bgradient = ob["daysBody"]["gradient"]
						 }
						 if("shadow" in ob["daysBody"]){
							 bshadow = ob["daysBody"]["shadow"]
						 }
						 if("radius" in ob["daysBody"]){
							 bradius = ob["daysBody"]["radius"]
						 }
						 if("fsize" in ob["daysBody"]){
							 bfs = ob["daysBody"]["fsize"]
						 }

					}
					if("wind" in ob){
							 wind = ob["wind"]
					}
					if("range" in ob){
							 range = ob["range"]
					}
					if("return" in ob){
							 ret = ob["return"]
					}
					if("insert_at" in ob){
							 ins = ob["insert_at"]
					}
					if("openAt" in ob){
							 oa = ob["openAt"]
					}
					if("year" in ob){
							 year_ = true
					}
					if("month" in ob){
							 month_ = ob["month"]
					}
					if("hour" in ob){
							 hour_ = ob["hour"]
					}
					if("info" in ob){
							 info_ = ob["info"]
					}
				}

				function BUTTON_HOVER_1(b){
					b.animate({type:"size", time:200, tween:{0:"1",50:"1.02",100:"0.95"}})
				}
				function BUTTON_HOVER_2(b){
					b.animate({type:"size", time:200, tween:{0:"0.98",50:"1.02",100:"1"}})
				}


				for(var i = 0; i < ly; i++){
					 var dt1 = new Date(mnts[i]+" 31, "+dt0.getFullYear())
					 //alert(dt1.getDate()+"="+parseInt(dt1.getDate()))
				}

				var day = parseInt(dt0.getDate()), x = day, w = 0
				while(x >= 7){
					x -= 7
					w++
				}
				var xx = x, f = 0;
				while(xx > 1){
						xx -= 1
					f++
				}

				var td = dt0.getDate() - f


				var date = new Date(), DD, MM;
				date.setFullYear(14, 0, 1);
				var date = new Date();
				var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				//alert(firstDay.getDay()+" "+lastDay.getDay())

				Tm = dt0.getHours()+":00";
				var ht = parseInt($j(el).trueStyle("height"))
				var mht = ht / 10;
				var pht = ht / 40;
				var pht2 = ht / 50;
				var pht3 = ht / 70;
				var fht = ht / 20;
				var fht2 = ht / 25;
				var dd = 0;
				$j(el).setStyle("height",(ht+20)+"px")
				$j(el).affix("end","<div style='float:left; width:100%; padding:"+pht2+"px 0px "+pht2+"px 0px; background:#; font-size:"+fht+"px;'"+
				" id='monthS"+ID+"'></div>")

				$j("#monthS"+ID+"").affix("end","<div style='float:left; width:28%; padding:1%; margin:1%; text-align:center;' id=''>"
				+mnts[date.getMonth()]+"</div>")
				$j("#monthS"+ID+"").affix("end","<div style='float:left; width:20%; padding:1%; margin:1%; text-align:center;' id=''>"
				+date.getFullYear()+"</div>")
				$j("#monthS"+ID+"").affix("end","<div style='float:left; width:20%; padding:1%; margin:1%; text-align:center;' id='jlibhour'>"
				+date.getHours()+":00</div>")
				$j("#monthS"+ID+"").affix("end","<div style='float:right; width:10%; padding:1%; margin:1%; text-align:center;' id=''>></div>")
				$j("#monthS"+ID+"").affix("end","<div style='float:right; width:10%; padding:1%; margin:1%; text-align:center;' id=''><</div>")

				$j(el).affix("end","<div style='float:left; width:100%; padding-bottom:"+pht+"px 0px "+pht+"px 0px; background:; font-size:"+
				fht+"px; margin-bottom:1%;' class='jlib-days"+ID+"'></div>")
				$j(el).affix("end","<div style='float:left; width:100%; background:#;' id='jlib_db"+ID+"'></div>")
				setTimeout(function(){
					if(month_ == false){
						$j("#monthS"+ID+"[0]").play("hide")
					}
					if(year_ == false){
						$j("#monthS"+ID+"[1]").play("hide")
					}
					//alert(hour_)
					if(hour_ == false){
						$j("#monthS"+ID+"[2]").play("hide")
						Tm = ""
					}
				},50)
				$j(".jlib-days"+ID+"").embed("")
				for(var i = 0; i <= 6; i++){
					$j(".jlib-days"+ID+"").affix("end","<div style='float:left; width:13.75%; margin:0.25%;"+
					"text-align:center;' class='dayS"+ID+"'>"+Days[i]+"</div>")
				}
				function leave(){
					if(ins !== undefined){
						if(ret == "digit"){
							 $j(ins).embed(DATE_dig)
							 fn(DATE_dig)
						}else{
							$j(ins).embed(DATE_str)
							fn(DATE_str)
						}
						if(wind == true){
							$j(el).WINDOWL("close")
						}
					}else{
						if(ret == "digit"){
							 fn(DATE_dig)
						}else{
							fn(DATE_str)
						}
						if(wind == true){
							 $j(el).WINDOWL("close")
						}
					}
				}

				var Dd = dt0.getDate(), Mm = dt0.getMonth(), Yy = dt0.getFullYear();

				MM = Mm
				DATE_str = mnts[Mm]+" "+Dd+", "+Yy+", "+Tm
				DATE_dig = parseInt(MM)+"-"+Dd+"-"+Yy+"-"+Tm

				function populate(D,M,Y){
					if(mnts[M - 1] === undefined){
						mnts[M - 1] = "December"
					}

					var dtx = new Date(mnts[M - 1]+" 31, "+Y), lmep = dtx.getDate()
					if(lmep == 1){
						lmep = 30;
					}
					var bn = (lmep - $j().Day({type:"first", dayType:"date", month:M, year:Y})) + 1, an = 1;

					//alert($j().Day({type:"last", dayType:"date", month:M, year:Y}))
					for(var i = 0; i < 42; i++){
						if(i < 7 && $j().Day({type:"first", dayType:"day", month:M, year:Y}) == Days[i]){
							dd = 1
						}
						var dt1 = new Date(mnts[M]+" "+dd+", "+Y)
						if(isNaN(dt1.getDate()) && i < 7){
							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:13.75%; margin:0.25%;"+
							"text-align:center; font-size:"+fht+"px;' class='jlib-d1"+ID+"' data-jlib-day"+ID+"='d' data-jlib-d"+ID+"='b'>"+bn+"</div>")
							//alert("#jlib_db"+ID)
							bn++
						}else if(isNaN(dt1.getDate()) && i > 7){
							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:13.75%; margin:0.25%;"+
							"text-align:center; font-size:"+fht+"px;' class='jlib-d1"+ID+"' data-jlib-day"+ID+"='d' data-jlib-d"+ID+"='a'>"+an+"</div>")
							//alert(1)
							an++
						}else if(D == dt1.getDate()){
							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:13.75%; margin:0.25%;"+
							"text-align:center; font-size:"+fht+"px;' id='today"+ID+"' data-jlib-day"+ID+"='d'>"+dt1.getDate()+"</div>")
							//alert(2)
						}else if(dd == dt1.getDate()){
							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:13.75%; margin:0.25%;"+
							"text-align:center; font-size:"+fht+"px;' class='jlib-d"+ID+"' data-jlib-day"+ID+"='d'>"+dt1.getDate()+"</div>")
							//alert(3)
						}
						if(dd > 0 && dd < 31){
							 dd++
						}else{
							dd = 0
						}
					}

										setTimeout(function(){
						if(info_ !== undefined){
							var JLIB_WOH = {hide:false, minimize:false, cancel:false, hover:true, shadow:true, header:false}
							$j("#jlib_db"+ID+"[a]").after("click", function(){
								$j(info_).WINDOWL(JLIB_WOH,$j(this))
							})
						}

						$j("#monthS"+ID+"").setStyle("background",mbackground).setStyle("color",mcolor).setStyle("font-family",mfont)
						$j("#monthS"+ID+"").enhance({rest:"darker+", radius:mradius, border:20, shadow:mshadow, reflect:false, percent:mgradient})
						$j("#monthS"+ID+"[a]").setStyle("background",mbackground).setStyle("cursor","pointer")
						$j("#monthS"+ID+"[a]").enhance({rest:"darker+", radius:mradius, border:20, shadow:mshadow, reflect:false, percent:mgradient+20})

						$j(".jlib-days"+ID+"").setStyle("background",dbackground).setStyle("color",dcolor).setStyle("font-family",dfont)
						$j(".jlib-days"+ID+"").enhance({rest:"darker+", radius:dradius, border:20, shadow:dshadow, reflect:false, percent:dgradient})
						$j(".dayS"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")

						$j(".jlib-d"+ID+"").setStyle("background",bbackground).setStyle("color",bcolor).setStyle("font-family",bfont)
						.setStyle("cursor","pointer")
						$j(".jlib-d"+ID+"").enhance({rest:"darker-", radius:5, border:20, shadow:0, reflect:false, percent:40})
						$j(".jlib-d"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px").after("mouseenter",function(){
							BUTTON_HOVER_1($j(this))
						}).after("mouseleave",function(){
							BUTTON_HOVER_2($j(this))
						}).after("click",function(){
							$j("@data-jlib-dsel"+ID+"=1").setStyle("background",mbackground).setStyle("color",bcolor).setStyle("font-family",bfont).
							setStyle("cursor","pointer")
							$j("@data-jlib-dsel"+ID+"=1").enhance({rest:"darker+", radius:5, border:20, shadow:0, reflect:false, percent:20})
							$j("@data-jlib-dsel"+ID+"=1").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							.attribute("data-jlib-dsel"+ID+"",0)

							$j("@data-jlib-dsell"+ID+"=1").setStyle("background",bbackground).setStyle("color",bcolor).setStyle("font-family",bfont).
							setStyle("cursor","pointer")
							$j("@data-jlib-dsell"+ID+"=1").enhance({rest:"darker-", radius:5, border:20, shadow:0, reflect:false, percent:40})
							$j("@data-jlib-dsell"+ID+"=1").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							.attribute("data-jlib-dsell"+ID+"",0)

							$j(this).setStyle("background",bbackground).setStyle("color","#ffffff").setStyle("font-family",bfont)
							.attribute("data-jlib-dsell"+ID+"",1)
							$j(this).enhance({rest:"darker+", radius:15, border:50, shadow:0, reflect:false, percent:60})
							$j(this).setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")

							$j("#today"+ID+"").setStyle("background",bbackground).setStyle("color","#f2f2f2").setStyle("font-family",bfont)
							$j("#today"+ID+"").enhance({rest:"darker-", radius:5, border:50, shadow:0, reflect:false, percent:20})
							$j("#today"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							DATE_str = mnts[Mm]+" "+$j(this).embedded()+", "+Yy+", "+Tm
							DATE_dig = parseInt(MM)+1+"-"+$j(this).embedded()+"-"+Yy+"-"+Tm
							leave()
						})

						$j(".jlib-d1"+ID+"").setStyle("background",mbackground).setStyle("color",bcolor).setStyle("font-family",bfont)
						.setStyle("cursor","pointer")
						$j(".jlib-d1"+ID+"").enhance({rest:"darker+", radius:5, border:20, shadow:0, reflect:false, percent:20})
						$j(".jlib-d1"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px").after("mouseenter",function(){
							BUTTON_HOVER_1($j(this))
						}).after("mouseleave",function(){
							BUTTON_HOVER_2($j(this))
						}).after("click",function(){
							var m;
							if($j(this).attribute("data-jlib-d"+ID+"") == "a"){
								m = parseInt(Mm) + 1;
								if(Mm == 11){
									Yy = Yy + 1
									m = 0;
								}
							}else{
								m = parseInt(Mm) - 1;
								if(Mm == 0){
									Yy = Yy - 1
									m = 11;
								}
							}
							Mm = m, MM = m, Dd = $j(this).embedded()
							$j("@data-jlib-dsell"+ID+"=1").setStyle("background",bbackground).setStyle("color",bcolor).setStyle("font-family",bfont).
							setStyle("cursor","pointer")
							$j("@data-jlib-dsell"+ID+"=1").enhance({rest:"darker-", radius:5, border:20, shadow:0, reflect:false, percent:40})
							$j("@data-jlib-dsell"+ID+"=1").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							.attribute("data-jlib-dsell"+ID+"",0)

							$j("@data-jlib-dsel"+ID+"=1").setStyle("background",mbackground).setStyle("color",bcolor).setStyle("font-family",bfont).
							setStyle("cursor","pointer")
							$j("@data-jlib-dsel"+ID+"=1").enhance({rest:"darker+", radius:5, border:20, shadow:0, reflect:false, percent:20})
							$j("@data-jlib-dsel"+ID+"=1").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							.attribute("data-jlib-dsel"+ID+"",0)

							$j(this).setStyle("background",bbackground).setStyle("color","#ffffff").setStyle("font-family",bfont)
							.attribute("data-jlib-dsel"+ID+"",1)
							$j(this).enhance({rest:"darker+", radius:15, border:50, shadow:0, reflect:false, percent:60})
							$j(this).setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")

							$j("#today"+ID+"").setStyle("background",bbackground).setStyle("color","#f2f2f2").setStyle("font-family",bfont)
							$j("#today"+ID+"").enhance({rest:"darker-", radius:5, border:50, shadow:0, reflect:false, percent:20})
							$j("#today"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")

							DATE_str = mnts[m]+" "+$j(this).embedded()+", "+Yy+", "+Tm
							DATE_dig = parseInt(MM)+1+"-"+$j(this).embedded()+"-"+Yy+"-"+Tm
							leave()
						})

						$j("#today"+ID+"").setStyle("background",bbackground).setStyle("color","#ffffff").setStyle("font-family",bfont)
						.setStyle("cursor","pointer")
						$j("#today"+ID+"").enhance({rest:"darker+", radius:15, border:50, shadow:0, reflect:false, percent:60})
						$j("#today"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px").after("click",function(){

							$j("@data-jlib-dsel"+ID+"=1").setStyle("background",mbackground).setStyle("color",bcolor).setStyle("font-family",bfont).
							setStyle("cursor","pointer")
							$j("@data-jlib-dsel"+ID+"=1").enhance({rest:"darker+", radius:5, border:20, shadow:0, reflect:false, percent:20})
							$j("@data-jlib-dsel"+ID+"=1").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							.attribute("data-jlib-dsel"+ID+"",0)

							$j("@data-jlib-dsell"+ID+"=1").setStyle("background",bbackground).setStyle("color",bcolor).setStyle("font-family",bfont).
							setStyle("cursor","pointer")
							$j("@data-jlib-dsell"+ID+"=1").enhance({rest:"darker-", radius:5, border:20, shadow:0, reflect:false, percent:40})
							$j("@data-jlib-dsell"+ID+"=1").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							.attribute("data-jlib-dsell"+ID+"",0)

							$j(this).setStyle("background",bbackground).setStyle("color","#ffffff").setStyle("font-family",bfont)
							.attribute("data-jlib-dsell"+ID+"",1)
							$j(this).enhance({rest:"darker+", radius:15, border:50, shadow:0, reflect:false, percent:60})
							$j(this).setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")

							$j("#today"+ID+"").setStyle("background",bbackground).setStyle("color","#ffffff").setStyle("font-family",bfont)
							$j("#today"+ID+"").enhance({rest:"darker+", radius:15, border:50, shadow:0, reflect:false, percent:60})
							$j("#today"+ID+"").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px")
							DATE_str = mnts[Mm]+" "+$j(this).embedded()+", "+Yy+", "+Tm
							DATE_dig = parseInt(MM)+1+"-"+$j(this).embedded()+"-"+Yy+"-"+Tm
							leave()

						})

					},20)
				}
				populate(dt0.getDate(),dt0.getMonth(),dt0.getFullYear())
				//alert(ID)
				//$j("#monthS"+ID+"[a]").setStyle("background","red")
				setTimeout(function(){
				$j("#monthS"+ID+"[a]").buttonize({},function(t){
						if($j(t).index() == 0){
							if($j().exist("#jlib-months-list"+ID+"") > 0){
								 $j("#jlib-months-list"+ID+"").detach()
							}
							if($j().exist("#jlib-years-list"+ID+"") > 0){
								 $j("#jlib-years-list"+ID+"").detach()
							}

							$j(".jlib-days"+ID+"").play("hide",200)
							$j("#jlib_db"+ID).embed("")

							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:100%; padding-bottom:"+pht+"px 0px "+pht+
							"px 0px; background:#fff; font-size:"+fht+"px; margin-bottom:1%;' id='jlib-months-list"+ID+"'></div>")

							for(var i = 0; i < 12; i++){
								$j("#jlib-months-list"+ID+"").affix("end","<div style='float:left; width:48%; padding-bottom:"+pht+"px 0px "+pht+
								"px 0px; font-size:"+fht+"px; margin-bottom:1%;' class='jlib-months-all' data-jlib-index"+ID+"='"+i+"'>"+
								mnts[i]+"</div>")
							}
							//alert($j(this).index())

							$j("#jlib-months-list"+ID+"[a]").setStyle("background",dbackground).setStyle("color",dcolor).setStyle("font-family",dfont)
							$j("#jlib-months-list"+ID+"[a]").enhance({rest:"darker+", radius:5, border:20, shadow:dshadow, reflect:false, percent:dgradient})
							$j("#jlib-months-list"+ID+"[a]").setStyle("text-align","center").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px").
							setStyle("margin-left","1.4%").setStyle("margin-top","0.4%").setStyle("cursor","pointer").buttonize({type:[1,7]},function(te){

								$j("#monthS"+ID+"[0]").embed($j(te).embedded())
								$j("#jlib-months-list"+ID+"").play("slideup",300)
								$j(".jlib-days"+ID+"").play("slidedown",200)
								Mm = $j(this).attribute("data-jlib-index"+ID+"")
								MM = Mm
								setTimeout(function(){
									DATE_str = mnts[Mm]+" "+Dd+", "+Yy+", "+Tm
									DATE_dig = parseInt(MM)+1+"-"+Dd+"-"+Yy+"-"+Tm
										populate(Dd,Mm,Yy)
								},200)

							})
						}

						if($j(t).index() == 1){
							if($j().exist("#jlib-months-list"+ID+"") > 0){
								 $j("#jlib-months-list"+ID+"").detach()
							}
							if($j().exist("#jlib-years-list"+ID+"") > 0){
								 $j("#jlib-years-list"+ID+"").detach()
							}
							$j(".jlib-days"+ID+"").play("hide",200)
							$j("#jlib_db"+ID).embed("")

							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:100%; padding-bottom:"+
							pht+"px; background:#fff; font-size:"+
							fht+"px; margin-bottom:1%;' id='jlib-years-list"+ID+"'></div>")
							var ww = "18%";
							if(range[0]+range[1] > 20){
								 $j("#jlib-years-list"+ID+"").setStyle("overflow-y","auto").setStyle("overflow-x","hidden")
								 ww = "17%";
								 $j("#jlib-years-list"+ID+"").enhance({rest:"darker+", radius:5, border:20,
								 shadow:dshadow, reflect:true, percent:dgradient/2})
								 //alert(range[0]+range[1])
							}
						var by = parseInt(date.getFullYear())-range[0], ay = parseInt(date.getFullYear())+range[1]
							for(var i = by; i <= ay; i++){
								$j("#jlib-years-list"+ID+"").affix("end","<div style='float:left; width:12%;"+
								"padding-bottom:"+pht3+"px 0px "+pht3+"px 0px; font-size:"+
								(2+fht2)+"px; margin-bottom:0.3%; font-weight:bold;' class='jlib-years-all"+ID+"'>"+i+"</div>")
							}



							$j("#jlib-years-list"+ID+"[a]").setStyle("background",dbackground).setStyle("color",dcolor).setStyle("font-family",dfont)
							$j("#jlib-years-list"+ID+"[a]").enhance({rest:"darker+", radius:5, border:20, shadow:dshadow, reflect:false, percent:dgradient})
							$j("#jlib-years-list"+ID+"[a]").setStyle("text-align","center").setStyle("padding-top",pht3+"px").setStyle("padding-bottom",pht3+"px").
							setStyle("margin-left","1.4%").setStyle("margin-top","1.4%").setStyle("cursor","pointer").after("mouseenter",function(){
								BUTTON_HOVER_1($j(this))
							}).after("mouseleave",function(){
								BUTTON_HOVER_2($j(this))
							}).after("click",function(){
								$j("#monthS"+ID+"[1]").embed($j(this).embedded())
								$j("#jlib-years-list"+ID+"").play("slideup",300)
								$j(".jlib-days"+ID+"").play("slidedown",200)
								Yy = $j(this).embedded()
								setTimeout(function(){
										DATE_str = mnts[Mm]+" "+Dd+", "+Yy+", "+Tm
									DATE_dig = parseInt(MM)+1+"-"+Dd+"-"+Yy+"-"+Tm
										populate(Dd,Mm,Yy)
								},200)

							})

						}

						if($j(t).index() == 2){
							if($j().exist("#jlib-months-list"+ID+"") > 0){
								 $j("#jlib-months-list"+ID+"").detach()
							}
							if($j().exist("#jlib-years-list"+ID+"") > 0){
								 $j("#jlib-years-list"+ID+"").detach()
							}
							$j(".jlib-days"+ID+"").play("hide",200)
							$j("#jlib_db"+ID).embed("")

							$j("#jlib_db"+ID).affix("end","<div style='float:left; width:100%; padding-bottom:"+pht+"px 0px "+pht+
							"px 0px; background:; font-size:"+fht+"px; margin-bottom:1%;' id='jlib-months-list"+ID+"'></div>")

							for(var i = 0; i < 24; i++){
								$j("#jlib-months-list"+ID+"").affix("end","<div style='float:left; width:23.2%; padding-bottom:"+pht+"px 0px "+pht+
								"px 0px; font-size:"+fht+"px; margin-bottom:0.5%;' class='jlib-months-all' data-jlib-index"+ID+"='"+i+"'>"+i+":00</div>")
							}

							$j("#jlib-months-list"+ID+"[a]").setStyle("background",dbackground).setStyle("color",dcolor).setStyle("font-family",dfont)
							$j("#jlib-months-list"+ID+"[a]").enhance({rest:"darker+", radius:5, border:20, shadow:dshadow, reflect:false, percent:dgradient})
							$j("#jlib-months-list"+ID+"[a]").setStyle("text-align","center").setStyle("padding-top",pht+"px").setStyle("padding-bottom",pht+"px").
							setStyle("margin-left","1.4%").setStyle("margin-top","0.5%").setStyle("cursor","pointer").after("mouseenter",function(){
								BUTTON_HOVER_1($j(this))
							}).after("mouseleave",function(){
								BUTTON_HOVER_2($j(this))
							}).after("click",function(){
								$j("#monthS"+ID+"[2]").embed($j(this).embedded())
								$j("#jlib-months-list"+ID+"").play("slideup",300)
								$j(".jlib-days"+ID+"").play("slidedown",200)
								Tm = $j(this).attribute("data-jlib-index"+ID+"")+":00";
								//MM = Mm
								setTimeout(function(){
									DATE_str = mnts[Mm]+" "+Dd+", "+Yy+", "+Tm
									DATE_dig = parseInt(MM)+1+"-"+Dd+"-"+Yy+", "+Tm
										populate(Dd,Mm,Yy)
								},200)

							})
						}

						if($j(t).index() == 4){
							if($j().exist("#jlib-months-list"+ID+"") > 0){
								 $j("#jlib-months-list"+ID+"").detach()
							}
							if($j().exist("#jlib-years-list"+ID+"") > 0){
								 $j("#jlib-years-list"+ID+"").detach()
							}
							//$j(".jlib-days").play("hide",200)
							$j("#jlib_db"+ID).embed("")

							var m = parseInt(Mm) - 1;
							if(Mm == 0){
								Yy = Yy - 1
								m = 11;

							}
							$j("#monthS"+ID+"[0]").embed(mnts[m])
							$j("#monthS"+ID+"[1]").embed(Yy)

							setTimeout(function(){
								$j(".jlib-days"+ID).play("slidedown",200)
								Mm = m
								MM = m
								setTimeout(function(){
									DATE_str = mnts[Mm]+" "+Dd+", "+Yy+", "+Tm
									DATE_dig = parseInt(MM)+"-"+Dd+"-"+Yy+"-"+Tm
										populate(Dd,Mm,Yy)
								},200)
							},200)
						}

						if($j(t).index() == 3){
							if($j().exist("#jlib-months-list"+ID+"") > 0){
								 $j("#jlib-months-list"+ID+"").detach()
							}
							if($j().exist("#jlib-years-list"+ID+"") > 0){
								 $j("#jlib-years-list"+ID+"").detach()
							}
							//$j(".jlib-days").play("hide",200)
							$j("#jlib_db"+ID).embed("")

							var m = parseInt(Mm) + 1;
							if(Mm == 11){
								Yy = Yy + 1
								m = 0;

							}
							$j("#monthS"+ID+"[0]").embed(mnts[m])
							$j("#monthS"+ID+"[1]").embed(Yy)

							setTimeout(function(){
								$j(".jlib-days"+ID).play("slidedown",200)
								Mm = m
								MM = m
								setTimeout(function(){
									DATE_str = mnts[Mm]+" "+Dd+", "+Yy+", "+Tm
									DATE_dig = parseInt(MM)+"-"+DD+"-"+Yy+"-"+Tm
										populate(Dd,Mm,Yy)
								},200)
							},200)

						}

				})
				},100)
				//setTimeout(function(){

				//},250)
				if(oa !== undefined && oa.indexOf("px") > 0){
					if(wind == true){
						 $j(el).WINDOWL({hide:false, minimize:false, background:mbackground, cancel:false, shadow:true, radius:5, header:false, openAt:oa, closeevent:true})
					}
				}else if(oa !== undefined){
					var spoa = oa.split(",")
					oa = spoa[1]+","+spoa[2]
					var e = $j(spoa[0]);

					if(wind == true){
						 $j(el).WINDOWL({hide:false, minimize:false, background:mbackground, cancel:false, shadow:true, radius:5, header:false, openAt:oa, closeevent:true},e)
					}
				}else{
					if(wind == true){
						 $j(el).WINDOWL({hide:false, minimize:false, background:mbackground, cancel:false, shadow:true, radius:5, header:false, openAt:oa, closeevent:true})
					}
				}

				if(ret == "digit"){
					 return DATE_dig
				}else{
					return DATE_str
				}
			})
		},
		LOADING: function(t,mv){
			//alert(0)
			this.each(function(el) {
				//alert(1)
				$j(el).enhance({rest:"darker+", radius:10, border:20, shadow:20, reflect:false, percent:7}).embed(t)
				//alert(2)
				function move(m){
					if(m == true){
						$j(el).animate({type:["alpha","size"], time:1500, tween:[{0:"1",100:"0"},{0:"1",100:"1.5"}],refresh:true},function(){
							move(m)
						})
					}
				}
				move(mv)
			})
			return this
		},
		select: function(col){
			if(col === undefined){
				col = "#50dc73";
			}
			//alert(col)
			this.each(function(el) {
				var at = $j(el).attribute("data-jlib-menuid");
				var spat = at.split("_");
				$j("@data-jlib-menuid-connector="+at+"[0]").setStyle("background",col).
				enhance({reflect:false, shadow:"#8ce7a2", rest:"darker-", percent:30,radius:20, border:{percent:20, color:col, width:"5px"}})
				$j("@data-jlib-menuid-connector="+at).attribute("data-jlib-selected",1)
			})
		},
		selected: function(){
			var sel;
			this.each(function(el) {
				var at = $j(el).attribute("data-jlib-menuid");
				sel = $j("@data-jlib-menuid-connector="+at).attribute("data-jlib-selected")
				if(sel != 1){
					sel = false;
				}else{
					sel = true;
				}
			})
			return sel
		},
		unselect: function(){
			this.each(function(el) {
				var at = $j(el).attribute("data-jlib-menuid");
				$j("@data-jlib-menuid-connector="+at+"[0]").unenhance()
				$j("@data-jlib-menuid-connector="+at).attribute("data-jlib-selected",0)
			})
		},
		WINDOW: function(ob, bo, fn){
			if(fn === undefined){
				if($j().function_(bo)){
					fn = bo
				}
			}
			var ran = $j().randomized(8), ww, wh, pww, pwh, suf = "px", th = 25, tp, title, www = parseInt(screen.width),
			wwh = $j().windowHeight("window"), drag = true, revsize = "1", revtop = "0", bg = "#fff", headB = "#fff", titleC = "#000", titleF = "arial",
			head = true, shadow = true, rad = "0px", bgc, hg = 0, micon = 0, hide = true, mini = true, cls = true
			//alert(www+" "+wwh)
			this.each(function(el) {
				//========================>    "close"
				var tempran = $j(el).attribute("data-jlib-windowId")
				if(tempran != null){
					if(ob == "close"){
						$j("@data-jlib-window="+tempran).play("slidedownBottom",500)
						setTimeout(function(){
							$j("@data-jlib-window="+tempran).detach()
						},500)
					}
				}
				$j("body").attribute("data-jlib-bodyId","window")
				$j(el).setStyle("display","block")
				$j(el).attribute("data-jlib-windowId",ran)
				var par = $j("@data-jlib-windowId="+ran+"<0")
				ww = $j(el).trueStyle("width")
				wh = $j(el).trueStyle("height")
				bgc = $j(el).trueStyle("background-color")

				var ncol = bgc.substring(bgc.indexOf("(")+1, bgc.indexOf(")")).split(",");
					bgc = $j().rgbHex(ncol,true);
				var bgg = $j().gradient($j().colorBrightness(bgc,50),true,false);
				var bdc = $j().colorBrightness(bgc,50)
				var bc = bdc[0]

				var thh = wwh - 60, T = thh+"px", L = "-30px"

				if(wh.indexOf("%") > 0){
						suf = "%"
					var c = $j().convert("25px",wh)
					th = parseInt(c.height)
				}
				pww = parseInt(ww), pwh = parseInt(wh) + th
				if("shadow" in ob){
						shadow = ob["shadow"]
					if(shadow !== undefined && shadow == true){
						 shadow = "0px 0px 8px #313131 "
					}else if(shadow !== undefined){
						shadow = ob["shadow"]
					}else{

					}
				}
				if("radius" in ob){
						rad = ob["radius"]
					if(shadow !== undefined){
							rad = ob["radius"]+"px"
					}
				}
				if("icon" in ob){
						icon = ob["icon"]
					bg = "url("+icon+")"
				}

				if("head" in ob){
						head = ob["head"]
				}
					if("type" in ob){
						tp = ob["type"]
				}
				if("title" in ob){
						title = ob["title"]
				}
				if("delete" in ob){
						cls = ob["close"]
				}
				if("mini" in ob){
						mini = ob["mini"]
				}
				if("headColor" in ob){
						headB = ob["headColor"]
				}
				if("titleFont" in ob){
						var temp = ob["titleFont"].split("-")
					titleC = temp[0], titleF = temp[1]
				}
				if("headGradient" in ob){
					var tempf = false
					if(ob["headGradient"] < 0){
						 tempf = true
					}
					hg = $j().gradient($j().colorBrightness(headB,ob["headGradient"]*-1),tempf,false);
				}


				function internalDrag(o){
					var dragObj = null,obj = o; obj.setStyle("cursor","pointer"); obj.setStyle("position","absolute");
					var offw = 0
					var offh = 0

					obj.after("mousedown",function(e){
							if(obj.attribute("data-jlib-mini") == "1"){
								offw = (parseInt(ww) * 0.25)
								offh = (parseInt(wh) * 0.25)
							}
							dragObj = obj; cx = e.pageX; cy = e.pageY;
							var O = dragObj.borders();
							ox = parseInt(O.left) - offw;
							oy = parseInt(O.top) - offh;
							offw = 0
									offh = 0
					})

					var cx;var cy;var ox;var oy;
					$j("html").after("mousemove",function(e){

						var x = e.pageX - (cx - ox)// + dragObj.clientWidth;
						var y = e.pageY - (cy - oy)// + dragObj.clientWidth;
						if(dragObj == null){
							return;
						}
						dragObj.setStyle("left",x +"px");
						dragObj.setStyle("top", y +"px");
						revtop = y+"px"
						offw = 0
							offh = 0
					});
					$j("html").after("mouseup",function(e){
						dragObj = null;
						offw = 0
							offh = 0
					});
				}

				function hide(e){
					var h = e.attribute("data-jlib-hide")
					if(h == "1"){
						micon = $j().exist(".jlib-micon","implicit")
						//alert(micon)
						var templ = (micon * 55) + 10
						$j("body").affix("end","<div data-jlib-hidden='"+ran+"' style='display:none' class='jlib-micon'><div data-jlib-micon='"+ran+"'>"+
						"</div></div>")

						$j("@data-jlib-micon="+ran).setStyle("height","100%").setStyle("width","100%").setStyle("background",bg)
						.setStyle("background-size","90% 90%").setStyle("background-position","center").setStyle("float","left")
						.setStyle("background-repeat","no-repeat")
						$j("@data-jlib-hidden="+ran).play("hide",0)
						$j("@data-jlib-hidden="+ran).setStyle("height","50px").setStyle("width","50px").setStyle("top",thh+"px").setStyle("left",templ+"px")
						.setStyle("position","fixed").setStyle("background",headB).enhance({
										reflect:false,shadow:"spread5d",
											border:40, percent:10, radius:5, rest:"darker+"
						})
						setTimeout(function(){
							$j("@data-jlib-hidden="+ran).play("show",400).buttonize({},function(){
								$j("@data-jlib-hidden="+ran).detach()
								$j("@data-jlib-window="+ran).animate({
										type:["top","size"],
										time:400,
										tween:[{0:T,100:"0"},{0:"0",100:revsize}]
								},function(){

								}).attribute("data-jlib-hide","1")
							})
						},200)

					}
				}
				var c = $j().convert("25px",pwh+suf)
				var cw = 100-parseFloat(c.height), cww = 72/3
				var cenx = www * 0.5 - (parseInt(ww) * 0.5)
				var ceny = (wwh * 0.5) - (parseInt(wh) * 0.5) - 25

				if("openAt" in ob){
					if(typeof ob["openAt"] === "string"){
						 var posi = ob["openAt"].split(",")
							if(typeof ob["openAt"] === "string" && typeof bo !== "object"){
								cenx = parseInt(posi[0])
								ceny = parseInt(posi[1])
							}else if(typeof ob["openAt"] === "string" && typeof bo === "object"){
								var re = bo.borders()
								ceny = re.top+parseFloat(bo.trueStyle("height")) - 20
								cenx = re.left+parseFloat(bo.trueStyle("width")) - 20
								wwnW = cenx + parseInt($j(el).trueStyle("width"))
								wwnH = ceny + parseInt($j(el).trueStyle("height"))
								if(wwnW > parseInt($j("body").trueStyle("width"))){
								 cenx = re.left-(parseInt($j(el).trueStyle("width"))) + 20
								}
								if(wwnH > wwh){
								 ceny = re.top-(parseInt($j(el).calHeight())) + 20
								 if(ceny < 0){
									 ceny = 20
								 }
								}

								if(posi[1] == "bottom"){
								ceny = re.top+parseFloat(bo.calHeight())
								}
								if(posi[1] == "top"){
								ceny = re.top-parseFloat($j(el).calHeight())-parseFloat(bo.calHeight())
								}
								if(posi[0] == "left"){
								cenx = re.left-parseFloat($j(el).calWidth())
								}
								if(posi[0] == "right"){
								cenx = re.left+parseFloat(bo.calWidth())
								}
								if(parseInt(posi[1]) == 0){
								ceny = re.top
								}
								if(parseInt(posi[0]) == 0){
								cenx = re.left
								}
							}
					}
				}
				//alert(cenx+" "+ceny)
				$j("body").affix("end","<div data-jlib-window='"+ran+"' style='display:none'></div>")
				$j("@data-jlib-window="+ran).affix("end","<div data-jlib-window-head='"+ran+"'></div>")
				$j("@data-jlib-window-head="+ran).affix("end","<div data-jlib-window-icon='"+ran+"'></div>")
				$j("@data-jlib-window-head="+ran).affix("end","<div data-jlib-window-title='"+ran+"'>"+title+"</div>")
				$j("@data-jlib-window-head="+ran).affix("end","<div data-jlib-window-controls='"+ran+"'></div>")
				$j("@data-jlib-window-controls="+ran).affix("end","<div data-jlib-window-mini-H='"+ran+"'><div data-jlib-window-mini='"+ran+"'></div></div>")
				$j("@data-jlib-window-controls="+ran).affix("end","<div data-jlib-window-hide-H='"+ran+"'><div data-jlib-window-hide='"+ran+"'></div></div>")
				$j("@data-jlib-window-controls="+ran).affix("end","<div data-jlib-window-close-H='"+ran+"'><div data-jlib-window-close='"+ran+"'></div></div>")

				$j("@data-jlib-window-icon="+ran).setStyle("width","19px").setStyle("height","19px").setStyle("margin","3px").setStyle("background",bg)
				.setStyle("background-size","cover").setStyle("background-position","center").setStyle("float","left")

				$j("@data-jlib-window-title="+ran).setStyle("width","px").setStyle("height","17px").setStyle("float","left")
				.setStyle("margin","4px 0px 0px 5px").setStyle("color",titleC).setStyle("font-family",titleF)


				$j("@data-jlib-window="+ran).affix("end","<div data-jlib-window-body='"+ran+"'></div>")
				$j("@data-jlib-window-body="+ran).append(el)
				$j(el).setStyle("display","none")
				$j(el).setStyle("hide",0)

				$j("@data-jlib-window-head="+ran).setStyle("height",th+suf).setStyle("background",headB).setStyle("float","left")
				.setStyle("width","100%")
				$j("@data-jlib-window-controls="+ran).setStyle("height","100%").setStyle("width","70px").setStyle("float","right")

				//===============================================>  Mini
				$j("@data-jlib-window-mini="+ran).setStyle("width","12px").setStyle("background","#000")
				.setStyle("cursor","pointer").setStyle("float","left").setStyle("margin","8px 3px 0% 3px").setStyle("height","5px")

				$j("@data-jlib-window-mini-H="+ran).setStyle("height","19px").setStyle("background","#").setStyle("float","left")
				.setStyle("margin-top","3px").buttonize({},function(){
					if($j("@data-jlib-window="+ran).attribute("data-jlib-mini") == "1"){
						$j("@data-jlib-window="+ran).animate({type:"size", time:200, tween:{0:"0.5",100:"1"}},function(){
							revsize = "1"
							$j("@data-jlib-window="+ran)
						}).attribute("data-jlib-mini","0")

					}else{
						$j("@data-jlib-window="+ran).animate({type:"size", time:200, tween:{0:"1",100:"0.5"}},function(){
							revsize = "0.5"
							$j("@data-jlib-window="+ran)
						}).attribute("data-jlib-mini","1")
					}
				})

				//===============================================>  Hide
				$j("@data-jlib-window-hide="+ran).setStyle("float","left").setStyle("cursor","pointer").setStyle("margin","5px 5px 0% 3px")
				.setStyle("border-right","12px solid transparent").setStyle("border-bottom","10px solid black")
				.setStyle("width","0").setStyle("height","0")

				$j("@data-jlib-window-hide-H="+ran).setStyle("height","19px").setStyle("background","#").setStyle("float","left")
				.setStyle("margin","3px").buttonize({},function(){
					$j("@data-jlib-window="+ran).animate({
							type:["top","size"],
							time:300,
							tween:[{0:revtop,100:T},{0:"1",100:"0"}]
					},function(){

					}).attribute("data-jlib-hide","1")
					hide($j("@data-jlib-window="+ran))
				})

				//===============================================>  Close
				$j("@data-jlib-window-close="+ran).setStyle("float","left").setStyle("width","15px").setStyle("height","15px")
				.setStyle("margin","3px 2px 0% 5px").setStyle("cursor","pointer").affix("end","<div class='jlib-close-a'></div>")
				$j("@data-jlib-window-close="+ran).affix("end","<div class='jlib-close-b'></div>")

				$j(".jlib-close-a").setStyle("height","3px").setStyle("width","12px").setStyle("background","#fff").setStyle("margin-top","6px")
				.setStyle("position","absolute").animate({time:100, type:"rotate", tween:{0:"0",100:"45"}})
				$j(".jlib-close-b").setStyle("height","3px").setStyle("width","12px").setStyle("background","#fff").setStyle("margin-top","6px")
				.setStyle("position","absolute").animate({time:100, type:"rotate", tween:{0:"0",100:"-45"}})

				$j("@data-jlib-window-close-H="+ran).setStyle("height","19px").setStyle("background","#c93838").setStyle("float","left")
				.setStyle("margin-top","3px").buttonize({},function(){
					$j("@data-jlib-window="+ran).animate({
							type:["top","size"],
							time:200,
							tween:[{0:revtop,100:T},{0:revsize,100:"0"}]
					},function(){

					})
				})

							//===============================================>  Window
				$j("@data-jlib-window="+ran).setStyle("background","#").setStyle("position","absolute").setStyle("width",ww).setStyle("height",pwh+suf)
				.setStyle("left",cenx+"px").setStyle("top",ceny+"px")
				.play("hide")

				$j("@data-jlib-window-body="+ran).setStyle("height",wh)


				if(mini == false){
					 $j("@data-jlib-window-mini="+ran).play("hide")
				}
				if(hide == false){
					 $j("@data-jlib-window-hide="+ran).play("hide")
				}
				if(cls == false){
					 $j("@data-jlib-window-close="+ran).play("hide")
				}
				if(head == false){
					$j("@data-jlib-window-head="+ran).play("hide")
					$j("@data-jlib-window="+ran).setStyle("height",(pwh-25)+suf).setStyle("box-shadow",shadow).setStyle("border","1px solid "+bdc[0])
					.setStyle("border-bottom-left-radius",rad).setStyle("border-bottom-right-radius",rad)

					$j("@data-jlib-window-body="+ran).setStyle("border-bottom-left-radius",rad).setStyle("border-bottom-right-radius",rad)
				}else{
					$j("@data-jlib-window-head="+ran).setStyle("border-top-left-radius",rad).setStyle("border-top-right-radius",rad)
					.setStyle("background",hg)
					$j("@data-jlib-window="+ran).setStyle("box-shadow",shadow).setStyle("border","1px solid "+bc).setStyle("border-radius",rad)

					$j("@data-jlib-window-body="+ran).setStyle("border-bottom-left-radius",rad).setStyle("border-bottom-right-radius",rad)
				}
				$j(el).setStyle("width","100%").setStyle("height","100%")

				if(ob["hover"] == true){
					var re = bo.borders()
					ceny = re.top+parseFloat(bo.trueStyle("height")) - 20
					cenx = re.left+parseFloat(bo.trueStyle("width")) - 20
					wwnW = cenx + parseInt($j(el).trueStyle("width"))
					wwnH = ceny + parseInt($j(el).trueStyle("height"))
					if(wwnW > parseInt($j("body").trueStyle("width"))){
						 cenx = re.left-(parseInt($j(el).trueStyle("width"))) + 20
						 if(cenx < 0){
							 cenx = 50
						 }
					}
					if(wwnH > wwh){
						 ceny = re.top-(parseInt($j(el).trueStyle("height"))) + 20
					}

					$j("@data-jlib-window="+ran).setStyle("left",cenx+"px").setStyle("top",ceny+"px")
				}

				setTimeout(function(){
					$j("@data-jlib-window="+ran).play("show",200).setStyle("cursor","default")
					if(drag == true){
						$j("@data-jlib-window="+ran).setStyle("cursor","pointer")
						internalDrag($j("@data-jlib-window="+ran))
					}
					setTimeout(function(){
							$j(el).play("show",400)
					},300)
				},300)

			})
		},
		MENU: function(ob, fn) {
			var grid, icons, sel, X, Y, w, h, pw, ph, num = 0, xw, ran = $j().randomized(8), tp = [6], iw, ih, mt, sel = false, fs, ARR = [], bk = "#fff"
			var dg = 0.1, sel_ref = false

			this.each(function(el) {
				$j(el).attribute("data-jlib-menuId",ran)
				var h = $j(el).trueStyle("height"),	w = $j(el).trueStyle("width")
				//alert(w)
				var pw = parseInt(w), ph = parseInt(h), tm, txt = [], fs = parseInt($j(el).trueStyle("font-size")),
				obg = $j(el).trueStyle("height")

				if("grid" in ob){
						grid = ob["grid"]

					var sep = grid.split("x")
					Y = parseInt(sep[0]), X = parseInt(sep[1])

					num = Y * X
					xw = (100 / X) - (100 * (2 / pw))
					yh = (100 / Y) - (100 * (2 / ph))
					var tw = (xw/100) * pw
					var th = (yh/100) * ph
					ih = ((th - (.30 * th)) / th) * 100
					iw = ((th - (.30 * th)) / tw) * 100
					mt = .15 * th
					tm = Math.round((th - fs) * .5) - 2


				}
				if("icons" in ob){
						icons = ob["icons"]
				}
					if("type" in ob){
						tp = ob["type"]
				}
				if("degree" in ob){
						dg = ob["degree"]
				}
				if("select" in ob){
						sel = ob["select"]
				}
				if("refresh" in ob){
						sel_ref = ob["refresh"]
				}
				if("text" in ob){
						txt = ob["text"]
				}
				if("background" in ob){
						bk = ob["background"]
				}
				for(var i = 0; i < num; i++){
					var bg = "#", tx = ""
					if(icons[i] !== undefined){
							bg = "url("+icons[i]+")"
					}
					if(txt[i] !== undefined){
							tx = txt[i]
					}
					//alert(bg)
					$j(el).affix("end","<div class='jlib-grid"+ran+"' data-jlib-menu='"+ran+"' id='jlib-menu-id-"+ran+"-"+i+"'></div>")
					$j("#jlib-menu-id-"+ran+"-"+i).affix("end","<div data-jlib-menu-icon='"+ran+"' id='jlib-menu-icon-"+ran+"-"+i+"'></div>")
					$j("#jlib-menu-id-"+ran+"-"+i).affix("end","<div data-jlib-menu-text='"+ran+"' id='jlib-menu-text-"+ran+"-"+i+"'>"+tx+"</div>")
					$j("#jlib-menu-icon-"+ran+"-"+i).affix("end","<div data-jlib-menu-sel='"+ran+"' id='jlib-menu-sel-"+ran+"-"+i+"'></div>")
					$j("#jlib-menu-icon-"+ran+"-"+i).setStyle("background",bg).setStyle("background-size","cover")
					.setStyle("background-position","center")
				}
				$j("@data-jlib-menu-icon="+ran).setStyle("width",iw+"%").setStyle("height",ih+"%").setStyle("margin",mt+"px")
				.setStyle("float","left")

				$j("@data-jlib-menu-text="+ran).setStyle("width",(90-iw)+"%").setStyle("margin-top",tm+"px")
				.setStyle("float","left").setStyle("background","")

				$j("@data-jlib-menu-sel="+ran).setStyle("width","50%").setStyle("height","50%").setStyle("margin","25%")
				.setStyle("float","left").setStyle("border-radius","50%")

				$j(".jlib-grid"+ran).setStyle("width",xw+"%").setStyle("height",yh+"%").setStyle("margin","1px").setStyle("background",bk)
				.setStyle("float","left")
				$j("@data-jlib-menuId="+ran+"[a]").buttonize({type:tp, degree:dg},function(e){
					if(sel != false){
						if(sel_ref == false){
							$j(e).setStyle("background",sel)
							ARR.push(($j("#jlib-menu-text-"+ran+"-"+$j(e).index()).text()))
							if("select" in ob){
								fn(ARR)
							}else{
								fn($j("#jlib-menu-text-"+ran+"-"+$j(e).index()).text())
							}
						}else{
							$j("@data-jlib-menuId="+ran+"[a]").setStyle("background",bk)
							$j(e).setStyle("background",sel)
							fn($j(e).index())
						}
					}else{
						fn($j(e).index())
					}
				})
			})
			return this
		},
		DROPDOWN: function(ob, fn) {
			var num = 2, mw, mh, mfs, mml, subtext = [], mtext, ran = $j().randomized(8), st_h, ts = "12px", mtx, pw, mmt, si, si0, kw, u = 0, en = false,
			color = "#414141", nam, ff = "arial", lm = 5

			if("subtext" in ob){
					subtext = ob["subtext"]
				num = subtext.length
			}
			if("textsize" in ob){
					ts = ob["textsize"]
			}
			if("enhance" in ob){
					en = ob["enhance"]
			}
			if("color" in ob){
					color = ob["color"]
			}
			if("icons" in ob){
					icons = ob["icons"]
			}
			if("font" in ob){
					ff = ob["font"]
			}
			if("limit" in ob){
					lm = ob["limit"]
			}

			this.each(function(el) {
				mw = $j(el).trueStyle("width")
				mh = $j(el).trueStyle("height")
				mml = $j(el).trueStyle("margin-left")
				mfs = $j(el).trueStyle("font-size")
				mtx = $j(el).text()
				pw = parseInt(mw) * 0.88
				si0 = parseInt(mfs)
				si = parseInt(mw) * 0.15
				mmt = (parseInt(mh) - parseInt(mfs)) / 2
				kw = parseInt(mw) - 30
				var ow = (lm+1) * (parseInt(ts)+8)
				$j(el).attribute("data-jlib-iwantthis",ran)
				setTimeout(function(){
					//alert($j("@data-jlib-iwantthis="+ran+"<{position=absolute}").trueStyle("position"))
					$j(el).affix("after","<div class='jlib-dropdown' data-jlib-drop='"+ran+"'></div>").setStyle("cursor","pointer")
					if($j("@data-jlib-iwantthis="+ran+"<{position=absolute}").trueStyle("position") == "absolute"){
						$j(".jlib-dropdown").setStyle("background","#c1c1c1").setStyle("width",mw).setStyle("height",ow+"px").
							setStyle("margin-top",mh).setStyle("margin-left",mml).setStyle("display","none").setStyle("position","absolute")
					}else{
							$j(".jlib-dropdown").setStyle("background","#c1c1c1").setStyle("width",mw).setStyle("height",ow+"px").
							setStyle("margin-top","0px").setStyle("margin-left",mml).setStyle("display","none").setStyle("float","left")
						.setStyle("z-index","3000")
					}

					$j(".jlib-dropdown").setStyle("background","#c1c1c1").setStyle("width",mw).setStyle("height",ow+"px")
					.setStyle("margin-left",mml).setStyle("display","none").setStyle("overflow-y","auto")
					.setStyle("overflow-x","hidden").setStyle("padding-bottom","5px")
					.setStyle("box-sizing","border-box").setStyle("-moz-box-sizing","border-box").setStyle("-webkit-box-sizing","border-box")
					.setStyle("border-right","1px solid #919191").setStyle("border-bottom","1px solid #919191").setStyle("border-left","1px solid #919191")
					.setStyle("border-bottom-left-radius","5px").setStyle("border-bottom-right-radius","5px").setStyle("box-shadow","1px 1px 5px #888888")
					$j(".data-jlib-drop-"+ran).attribute("data-jlib-iwantthis",ran).play("slideup",200)

					for(var i = 0; i < num; i++){
						$j(".jlib-dropdown").affix("end","<div class='jlib-dropkids' id='jlib-kids-"+ran+"-"+i+"'></div>")
						$j("#jlib-kids-"+ran+"-"+i).affix("end","<div class='jlib-dropicon' id='jlib-dicon-"+ran+"-"+i+"'></div>")
						$j("#jlib-kids-"+ran+"-"+i).affix("end","<div class='jlib-droptext' id='jlib-dtext-"+ran+"-"+i+"'></div>")
						$j("#jlib-dtext-"+ran+"-"+i).embed(subtext[i])
						if(typeof icons === "string"){
							var bg = "url("+icons+")"
						}else
						if(icons[i] !== undefined){
							var bg = "url("+icons[i]+")"
						}else{
							var bg = "#212121"
						}
						$j("#jlib-dicon-"+ran+"-"+i).setStyle("background",bg).setStyle("background-size","cover")
						.setStyle("background-position","center")
					}
					$j(el).embed("")
					var nam = $j(el).attribute("data-jlib-name")
					$j(el).affix("end","<div class='jlib-dropdown-main' data-jlib-dropmain='"+ran+"'>1</div>")
					$j(el).affix("end","<div class='jlib-dropdown-but' data-jlib-dropbut='"+ran+"'></div>")
					$j(el).affix("end","<input class='jlib-dropdown-input' data-jlib-dropinput='"+ran+"' type='hidden' name='"+nam+"'>")

					$j(".jlib-dropkids").setStyle("background","#f6f6f6").setStyle("width",kw+"px").setStyle("padding","3px 2px 0px 2px")
					.setStyle("margin","1px 1px 1px 2px").setStyle("float","left").setStyle("height",(parseInt(ts)+3)+"px")
					.attribute("data-jlib-iwantthis",ran)
					//icons
					$j(".jlib-dropicon").setStyle("width",ts).setStyle("height",ts)
					.setStyle("margin","0px 1% 0px 1%").setStyle("float","left").attribute("data-jlib-iwantthis",ran)
					//sub text
					$j(".jlib-droptext").setStyle("background","#").setStyle("width","5px").setStyle("float","left")
					.setStyle("margin","0px 1% 0px 1%").setStyle("font-size",ts).setStyle("color",color).setStyle("font-family",ff)
					.attribute("data-jlib-iwantthis",ran)
					//main text
					$j("@data-jlib-dropmain="+ran).setStyle("background","#").setStyle("width",pw+"px").setStyle("float","left")
					.setStyle("margin",(mmt/2)+"px 1% 0px 1%").embed(mtx).attribute("data-jlib-iwantthis",ran)
					//select icon

					$j("@data-jlib-dropbut="+ran).setStyle("background","#").setStyle("width","0").setStyle("float","right")
					.setStyle("margin",(mmt*1.4)+"px 1% 0px 1%").setStyle("height","0").setStyle("border-left",(si0*0.4)+"px solid transparent")
					.setStyle("border-right",(si0*0.4)+"px solid transparent")
					.setStyle("border-top",(si0*0.6)+"px solid #313131").attribute("data-jlib-iwantthis",ran)


					$j(el).toggle(0,1,function(t){
						//alert(t)
						if(u == 1){
							t = 0
						}
						if(t == 0){
							$j("@data-jlib-drop="+ran).play("slidedown",500)
						}else{
							$j("@data-jlib-drop="+ran).play("slideup",500)
						}
					})

					$j("@data-jlib-dropbut="+ran).buttonize({type:[0,7], degree:0.08},function(){

					})

					$j(".jlib-dropkids").buttonize({type:[0,7], degree:0.03, time:500},function(b){
						$j(b).index()
						var tx = $j("#jlib-dtext-"+ran+"-"+$j(b).index()).text()
						$j("@data-jlib-dropmain="+ran).embed(tx)
						$j("@data-jlib-dropinput="+ran).embed(tx)
						//alert()
						$j("@data-jlib-drop="+ran).play("slideup",500)
						u = 1
					})

					if(en == true){
						$j(".jlib-dropkids").enhance({reflect:false, shadow:"spread3", border:25, percent:10, radius:3, rest:"darker+"})
						.setStyle("height",(parseInt(ts)+8)+"px")

					}

					$j("html").after("click",function(e){
						if($j(e.target).attribute("data-jlib-iwantthis") != ran){
							$j("@data-jlib-drop="+ran).play("slideup",500)
							u = 1
						}
					})
				},500)
			})
			return this
		},
		DROPDOWN2: function(ob, fn) {
			var alt1 = false;
				if(window.getComputedStyle(document.getElementById(ob["position"]),null).getPropertyValue("display") == "none"){
					 document.getElementById(ob["position"]).style["display"] = "block";
					 alt1 = true;
				}
				var that = this;
				var el = document.createElement("div");
				var button = document.createElement("div");
				var biconDiv = document.createElement("div");
				var textDiv = document.createElement("div");
				var inputDiv = document.createElement("input");
				var pw = $j("#"+ob["position"]).trueStyle("width")

				$j(inputDiv).attribute("type","hidden").attribute("name",$j("#"+ob["position"]).attribute("data-jlib-name"))

				el.style["width"] = ob["width"];
				el.style["padding"] =  "0px 3px 0px 3px";
				el.style["box-shadow"] = "1px 1px 5px 1px #888888";
				el.style["border-style"] = "solid";
				el.style["border-width"] = "thin";
				el.style["border-radius"] = "5px";
				button.style["width"] = pw

				if(ob["rest"] == "lighter-"){
					var r = false, b = ob["percent"];
				}
				if(ob["rest"] == "lighter+"){
					var r = true, b = ob["percent"] * -1;
				}
				if(ob["rest"] == "darker-"){
					var r = true, b = ob["percent"];
				}
				if(ob["rest"] == "darker+"){
					var r = false, b = ob["percent"] * -1;
				}
				if(ob["hover"] == "lighter-"){
					var rr = false, bb = ob["percent"];
				}
				if(ob["hover"] == "lighter+"){
					var rr = true, bb = ob["percent"] * -1;
				}
				if(ob["hover"] == "darker-"){
					var rr = true, bb = ob["percent"];
				}
				if(ob["hover"] == "darker+"){
					var rr = false, bb = ob["percent"] * -1;
				}
				if(ob["mainhover"] == "lighter-"){
					var mrr = false, mbb = ob["percent"];
				}
				if(ob["mainhover"] == "lighter+"){
					var mrr = true, mbb = ob["percent"] * -1;
				}
				if(ob["mainhover"] == "darker-"){
					var mrr = true, mbb = ob["percent"];
				}
				if(ob["mainhover"] == "darker+"){
					var mrr = false, mbb = ob["percent"] * -1;
				}
				var ref = ob["reflect"]
				var r2 = this.colorBrightness("#FFFFFF",-20)

				var rest2 = this.gradient(this.colorBrightness("#ffffff",-7),r,ref);
				var rest = this.gradient(this.colorBrightness(ob["style"]["background"],b),r,ref);
				var hover = this.gradient(this.colorBrightness(ob["style"]["background"],bb),rr,ref);
				var mhover = this.gradient(this.colorBrightness(ob["style"]["background"],mbb),mrr,ref);
				var col = this.colorBrightness(ob["style"]["background"],(ob["percent"] * -2))
				el.style["border-color"] = col[1];
				if("position" in ob){
					if(ob["position"].search("px") > 0){
					 var posi = ob["position"].split(",")
					 document.getElementsByTagName('body')[0].appendChild(el);
					}else{
					 var rect = document.getElementById(ob["position"]).getBoundingClientRect();
					 var bmnw = parseInt(ob["width"])
					 var biw = (bmnw/4)
					 var bht = window.getComputedStyle(document.getElementById(ob["position"]),null).getPropertyValue("height")
					 button.style["height"] = bht;
					 button.style["font-family"] = ob["style"]["font-family"]
					 button.style["border-radius"] = "5px"
					 button.style["border-style"] = "solid";
					 button.style["border-width"] = "thin";
					 button.style["border-color"] = col[1];
					 button.style["cursor"] = "pointer";
					 biconDiv.style["padding-top"] = (parseInt(bht)/8)+"px";
					 biconDiv.style["height"] = ""
					 biconDiv.style["float"] = "right";
					 biconDiv.style["font-size"] = (parseInt(bht)/1.5)+"px";
					 biconDiv.style["width"] = (parseInt(bht)/3)+"px";
					 biconDiv.style["margin-left"] = "5px";
					 biconDiv.style["margin-right"] = "10px";
					 biconDiv.innerHTML = "+"
					 biconDiv.style["cursor"] = "pointer";
					 textDiv.style["float"] = "left";
					 textDiv.style["margin-left"] = "5px"
					 textDiv.style["margin-top"] = (parseInt(bht)/5)+"px";
					 textDiv.style["font-size"] = (parseInt(bht)/2)+"px";
					 textDiv.innerHTML = ob["maintext"]
					 textDiv.style["font-family"] = ob["style"]["font-family"]
					 button.style["background"] = rest;
					 if("mainhover" in ob){
						 button.setAttribute("data-jlib-id", "dropdown");
					 }
					 var flt = $j("#"+ob["position"]+"<1").trueStyle("float")
					 var bds = $j("#"+ob["position"]+"<1").borders()
					 //alert(bds.top+" "+flt+" 4+"+rect.top+"-"+bds.top+"+"+parseInt(bht)+" : "+(4+rect.top-bds.top+parseInt(bht)))
					 el.style["position"] = "absolute";
					 el.style["top"] = (4+rect.top+parseInt(bht))+"px";
					 el.style["left"] = rect.left+"px";
					 el.style["background"] = "#eeeeee";


					 $j(el).after("click", function(event){
						 event.stopPropagation();
					 })
					 $j(button).after("click", function(event){
						 event.stopPropagation();
					 })
					 var clic = false;
					 $j("html").after("click",function(){
						if(clic == true){
							 //$j(el).animate({type:"height",time:400,pivot:"0 0",tween:{0:"",100:"0px"}});
							 $j(el).play("slideup",400)
							 clic = false;
						}
					 })

					 document.getElementsByTagName('body')[0].appendChild(el);
					 document.getElementById(ob["position"]).appendChild(button);
					 button.appendChild(textDiv)
					 button.appendChild(biconDiv)
					 button.appendChild(inputDiv)

					 /*
					 if (window.addEventListener) {
							button.addEventListener("mouseover", mov, false);
							button.addEventListener("mouseout", mot, false);
							button.addEventListener("click", bcl, false);

					 }
					 else if (window.attachEvent) {
							button.attachEvent("onmouseover", mov, false);
							button.attachEvent("onmouseout", mot, false);
							//button.attachEvent("onclick", bcl);
					 }
					 //*/




					}
				}

				$j(el).play("slideup",400)
				function bcl(){
				 var tempht = window.getComputedStyle(el,null).getPropertyValue("height")

				 //$j(el).animate({type:"height",time:400,pivot:"0 0",tween:{0:"0px",100:tempht}});
				 $j(el).play("slidedown",400)
				 clic = true;
				}
				function fn0(){
					$j(el).animate({type:"height",time:400,pivot:"0 0",tween:{0:"",100:"0px"}});
					$j(el).play("slideup",400)
					clic = false;
					textDiv.innerHTML = $j(this).text()
					$j(inputDiv).embed($j(this).text())
					fn($j(this).index(),$j(this).text())
				}
				function add(el,n,f1,f2) {
					if (window.addEventListener) {
						el.addEventListener("mouseover", f1, false);
						el.addEventListener("mouseout", f2, false);
						el.addEventListener("click", fn0, false);
					}
					else if (window.attachEvent) {
						el.attachEvent("onmouseover", f1, false);
						el.attachEvent("onmouseout", f2, false);
						el.attachEvent("onclick", fn0);
					}
				};

				ob["tag"] = "div";
				if(window.getComputedStyle(el,null).getPropertyValue("display") == "none"){
					 el.style["display"] = "block";
				}
				var innerDiv = [], tempDiv = [], iconDiv = [];
				var wd = parseInt(el.offsetWidth);
				var ww = wd // ob["number"];
				var w = (ww/wd)*100;
				w = this.roundoff(w,3);
				el.innerHTML="";
				var i;
				for(var ii = 0; ii < ob["number"]+10; ii++){
					if(ii > 9){
						i = ii - 10;

						if("tag" in ob)
						 if(typeof ob["tag"] === "object"){
							innerDiv[i] = document.createElement(ob["tag"][i]);
						 }else{
							innerDiv[i] = document.createElement(ob["tag"]);
							tempDiv[i] = document.createElement(ob["tag"]);
						 }
						if("class" in ob)
						 if(typeof ob["class"] === "object"){
							innerDiv[i].setAttribute('class',ob["class"][i]);
						 }else{
							innerDiv[i].setAttribute('class',ob["class"]);
							tempDiv[i].setAttribute('class',ob["class"]);
						 }
						if("name" in ob)
						 if(typeof ob["name"] === "object"){
							innerDiv[i].setAttribute('name',ob["name"][i]);
						 }else{
							innerDiv[i].setAttribute('name',ob["name"]);
						 }
						if("id" in ob){
						 if(typeof ob["id"] === "object"){
							innerDiv[i].setAttribute('id',ob["id"][i]);
						 }else{
							innerDiv[i].setAttribute('id',ob["id"]);
						 }
						}
						if("text" in ob){
							if(typeof ob["text"] === "object"){
							 innerDiv[i].innerHTML = ob["text"][i];
							}else if(typeof ob["text"] === "string"){
							 innerDiv[i].innerHTML = ob["text"];
							}
						}
						innerDiv[i].style['border-width'] = "1px";

						if("style" in ob){
							if(typeof ob["style"][i] !== "undefined"){
								var key = Object.keys(ob["style"][i])
								for(var j = 0; j < key.length; j++){
									if("width" in ob["style"][i]){
									if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][i][key[j]])/wd)*100),3);
										 var  nw = w - m
										 //innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
									}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style[key[j]] = ob["style"][i][key[j]];
									}else if(key[j] != "width"){
										 innerDiv[i].style[key[j]] = ob["style"][i][key[j]];
									}
									}else{
										if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][i][key[j]])/wd)*100),3);
										 var  nw = w - m
										 innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
										}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style['width'] = w+"%";
										}else if(key[j] != "width"){
										 innerDiv[i].style['width'] = w+"%";
										 innerDiv[i].style[key[j]] = ob["style"][i][key[j]];
										}
									}
								}
							}else{
								var key = Object.keys(ob["style"])
								for(var j = 0; j < key.length; j++){
									if("width" in ob["style"]){
									if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][key[j]])/wd)*100),3);
										 var  nw = w - m
										 //innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
									}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style[key[j]] = ob["style"][key[j]];
									}else if(key[j] != "width"){
										 innerDiv[i].style[key[j]] = ob["style"][key[j]];
									}
									}else{
										if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][key[j]])/wd)*100),3);
										 var  nw = w - m
										 innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
										}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style['width'] = ob["style"][key[j]];
										}else if(key[j] != "width"){
										 //alert(w+"%")
										 innerDiv[i].style['width'] = w+"%";

										 if(key[j] == "background"){
											 innerDiv[i].style["background"] = rest2;

											 //innerDiv[i].style["box-sizing"] = "border-box"
											 //innerDiv[i].style["-moz-box-sizing"] = "border-box"
											 //innerDiv[i].style["-webkit-box-sizing"] = "border-box"
											 innerDiv[i].style["border-style"] = "solid"
											 innerDiv[i].style["border-width"] = "thin"
											 innerDiv[i].style["border-color"] = r2[1];
										 }else{
											 if(key[j] == "color"){

												 innerDiv[i].style["color"] = ob["style"]["background"]
											 }else{
													innerDiv[i].style[key[j]] = ob["style"][key[j]];
											 }
										 }
										}
									}

								}
							}
						}else{
							innerDiv[i].style['width'] = w+"%";
						}

						if("icon" in ob){
						 iconDiv[i] = document.createElement("img");
						 textDiv[i] = document.createElement(ob["tag"]);
						}else{
						 innerDiv[i].style["text-align"] = "center";
						}

						if("font-size" in ob["style"]){
							 var fs = parseInt(ob["style"]["font-size"])
						}else{
							 var fs = 15;
							 ob["style"]["font-size"] = "15px";
							 innerDiv[i].style["font-size"] = "15px";
						}

						if("height" in ob["style"]){
							 var ht = parseInt(ob["style"]["height"])
						}else{
							 var ht = 50;
						}
						var pad = Math.floor((ht - fs)/2)
						var nht = pad + fs - 2;
						var npad = Math.round(pad/2) + 1;
						innerDiv[i].style["height"] = nht+"px";
						innerDiv[i].style["padding-top"] = npad+"px";
											innerDiv[i].style["cursor"] = "pointer";
						innerDiv[i].style["border-radius"] = "5px";
						if("width" in ob["style"]){
						 var mnw = parseInt(ob["style"]["width"])
						}else{
						 var mnw = w
						}
						var iw = (mnw/4)
						iconDiv[i].style["height"] = (nht-npad)+"px";
						iconDiv[i].style["float"] = "left";
						iconDiv[i].style["width"] = (nht-npad)+"px";
						iconDiv[i].style["margin-left"] = "5px";
						iconDiv[i].style["margin-right"] = "5px";
						if(ob["icon"][i] === undefined){
							iconDiv[i].setAttribute('src',ob["icon"][0]);
						}else{
							 iconDiv[i].setAttribute('src',ob["icon"][i]);
						}
											iconDiv[i].style["cursor"] = "pointer";
						//alert(ob["icon"][i])

						if(i > -1){
							var that = this;
							var shtw = {0:"actual",100:"0.85"}
							var shtw2 = {0:"0.85",100:"1"}
							var rntw = {0:"actual",100:(nht/3)+"px"}
							var rntw2 = {0:(nht/3)+"px",100:"0px"}
							var fctw = {0:ob["style"]["color"],100:ob["hoverfontcolor"]}
							var fctw2 = {0:ob["hoverfontcolor"],100:ob["style"]["background"]}
							var bctw = {0:ob["style"]["background"],100:ob["hoverbgcolor"]}
							var bctw2 = {0:ob["hoverbgcolor"],100:ob["style"]["background"]}
							var fltw = {0:ob["hoverbgcolor"],100:ob["style"]["background"]}
							var fltw2 = {0:ob["hoverbgcolor"],100:ob["style"]["background"]}
							var tltw = {0:"0",100:"-10"}
							var tltw2 = {0:"-10",100:"0"}
							var trtw = {0:"0",100:"10"}
							var trtw2 = {0:"10",100:"0"}
							var putw = {0:"0px",100:(nht/-3)+"px"}
							var putw2 = {0:(nht/-3)+"px",100:"0px"}
							var pdtw = {0:"0px",100:(nht/3)+"px"}
							var pdtw2 = {0:(nht/3)+"px",100:"0px"}
							var pltw = {0:"0px",100:(nht/-3)+"px"}
							var pltw2 = {0:(nht/-3)+"px",100:"0px"}
							var prtw = {0:"0px",100:(nht/3)+"px"}
							var prtw2 = {0:(nht/3)+"px",100:"0px"}
							var MTYP = ["size","radius","color","background","background","rotate","rotate","top","top","left","left"]
							var TTYP = {0:shtw,1:rntw,2:fctw,3:bctw,4:fltw,5:tltw,6:trtw,7:putw,8:pdtw,9:pltw,10:prtw}
							var TTYP2 = {0:shtw2,1:rntw2,2:fctw2,3:bctw2,4:fltw2,5:tltw2,6:trtw2,7:putw2,8:pdtw2,9:pltw2,10:prtw2}

							function mov(){
								if(this.getAttribute("data-jlib-id") == "dropdown"){
								 this.style["background"] = mhover;
								}else{
									var hov = "hover"
									if(typeof ob[hov] !== "object"){
										if(ob[hov].search("darker") < 0 && ob[hov].search("lighter") < 0){
										 if(ob[hov] == "shrink"){
											$j(this).animate({type:"size",time:400,tween:shtw});
										 }
										 if(ob[hov] == "round"){
											$j(this).animate({type:"radius",time:400,tween:rntw});
										 }
										 if(ob[hov] == "fontColor"){
											$j(this).animate({type:"color",time:400,tween:fctw});
										 }
										 if(ob[hov] == "bgColor"){
											$j(this).animate({type:"background",time:700,tween:bctw});
										 }
										 if(ob[hov] == "flash"){
											$j(this).animate({type:"background",time:700,tween:fltw});
										 }
										 if(ob[hov] == "tiltLeft"){
											$j(this).animate({type:"rotate",time:300,tween:tltw});
										 }
										 if(ob[hov] == "tiltRight"){
											$j(this).animate({type:"rotate",time:300,tween:trtw});
										 }
										 if(ob[hov] == "pushUp"){
											$j(this).animate({type:"top",time:300,tween:putw});
										 }
										 if(ob[hov] == "pushDown"){
											$j(this).animate({type:"top",time:300,tween:pdtw});
										 }
										 if(ob[hov] == "pushLeft"){
											$j(this).animate({type:"left",time:300,tween:pltw});
										 }
										 if(ob[hov] == "pushRight"){
											$j(this).animate({type:"left",time:300,tween:prtw});
										 }
										}else{
											this.style["background"] = hover;
											el.style["height"] = (nht+npad)+"px";
										}
									}else{
										var TYP = [], TWE = []
										for(var ii = 0; ii < ob[hov].length; ii++){
											TYP.push(MTYP[ob[hov][ii]])
											TWE.push(TTYP[ob[hov][ii]])
										}
										$j(this).animate({type:TYP,time:300,tween:TWE});
									}
								}
							}
							function mot(){
								if(this.getAttribute("data-jlib-id") == "dropdown"){
								 this.style["background"] = rest;
								}else{
									var hov = "hover"
									if(typeof ob[hov] !== "object"){
										if(ob[hov].search("darker") < 0 && ob[hov].search("lighter") < 0){
										 if(ob[hov] == "shrink"){
											$j(this).animate({type:"size",time:400,tween:shtw2});
										 }
										 if(ob[hov] == "round"){
											$j(this).animate({type:"radius",time:400,tween:rntw2});
										 }
										 if(ob[hov] == "fontColor"){
											$j(this).animate({type:"color",time:400,tween:fctw2});
										 }
										 if(ob[hov] == "bgColor"){
											$j(this).animate({type:"background",time:700,tween:bctw2});
										 }
										 if(ob[hov] == "tiltLeft"){
											$j(this).animate({type:"rotate",time:300,tween:tltw2});
										 }
										 if(ob[hov] == "tiltRight"){
											$j(this).animate({type:"rotate",time:300,tween:trtw2});
										 }
										 if(ob[hov] == "pushUp"){
											$j(this).animate({type:"top",time:300,tween:putw2});
										 }
										 if(ob[hov] == "pushDown"){
											$j(this).animate({type:"top",time:300,tween:pdtw2});
										 }
										 if(ob[hov] == "pushLeft"){
											$j(this).animate({type:"left",time:300,tween:pltw2});
										 }
										 if(ob[hov] == "pushRight"){
											$j(this).animate({type:"left",time:300,tween:prtw2});
										 }
										}else{
										this.style["background"] = rest;
										}
									}else{
										var TYP = [], TWE = []
										for(var ii = 0; ii < ob[hov].length; ii++){
											TYP.push(MTYP[ob[hov][ii]])
											TWE.push(TTYP2[ob[hov][ii]])
										}
										$j(this).animate({type:TYP,time:300,tween:TWE});

									}
								}
							}
							if("position" in ob){
								if (window.addEventListener) {
										button.addEventListener("mouseover", mov, false);
										button.addEventListener("mouseout", mot, false);
										button.addEventListener("click", bcl, false);

								 }
								 else if (window.attachEvent) {
										button.attachEvent("onmouseover", mov, false);
										button.attachEvent("onmouseout", mot, false);
										//button.attachEvent("onclick", bcl);
								 }

							}
							add(innerDiv[i],i,mov,mot);
							innerDiv[i].appendChild(iconDiv[i]);
							el.appendChild(innerDiv[i]);

						}
					}
				}
				if("visible" in ob){
					if(ob["visible"] < ob["number"]){
						var vh = ob["visible"] * (nht + npad)
						$j(el).setStyle("height", vh+"px")
					}
				}
				$j(el).attribute("data-jlib-scrollId",ob["position"])
				setTimeout(function(){
					 $j("@data-jlib-scrollId="+ob["position"]).SCROLL({reflect:true, shadow:80, rest:"darker+", percent:20,radius:7, border:30, width:0.8})
				},1000)
				$j(el).animate({type:"height",time:0,tween:{0:"20px",10:"0px"}});
				if(alt1 == true){
				 document.getElementById(ob["position"]).style["display"] = "none";
				}
			return this;
		},
		cells: function(ob, fn) {
		 var that = this;
			var add = function(el,n) {
			if (window.addEventListener) {
				if(typeof ob["event"] === "object"){
						 el.addEventListener(ob["event"][n], fn, false);
				}else{
					el.addEventListener(ob["event"], fn, false);
				}
			}
			else if (window.attachEvent) {
				if(typeof ob["event"] === "object"){
						 el.attachEvent('on'+ob["event"][n], fn);
				}else{
					el.attachEvent('on'+ob["event"], fn);
				}
			}
			};
			this.each(function(el) {
				var alt = false;
				$j(el+"<{display=none}").setStyle("display","block")
				if(window.getComputedStyle(el,null).getPropertyValue("display") == "none"){
					 el.style["display"] = "block";
				 alt = true;
				}
				var innerDiv = [];
				var wd = parseInt(el.offsetWidth) - 2;
				if(wd < 0){
				 var fwd = parseFloat($j(el).trueStyle("width"));
				 var docW = parseInt($j().windowWidth())
				 wd = (docW * 100) / fwd

				 //alert(parseFloat($j(el).trueStyle("width"))+" "+wd)
				}
				if("horizontal" in ob){
					 var ww = (wd - (2*ob["horizontal"])) / ob["horizontal"];
				 var hv = ob["horizontal"]*ob["vertical"]
				}else{
				 var ww = (wd - (2*ob["number"])) / ob["number"];
				 var hv = ob["number"]
				}
				if(ww > 0){
					 var w = (ww/wd)*100;
					 w = this.roundoff(w,3);
				}else{
					var w = 100;
				}
				//alert(w+" = "+ww+"/"+wd)
				el.innerHTML="";
				//alert(window.getComputedStyle(el,null).getPropertyValue("height"))
				var i;
				for(var ii = 0; ii < hv+10; ii++){
					if(ii > 9){
						i = ii - 10;

						if("tag" in ob)
						 if(typeof ob["tag"] === "object"){
							innerDiv[i] = document.createElement(ob["tag"][i]);
						 }else{
							innerDiv[i] = document.createElement(ob["tag"]);
						 }
						if("class" in ob)
						 if(typeof ob["class"] === "object"){
							innerDiv[i].setAttribute('class',ob["class"][i]);
						 }else{
							innerDiv[i].setAttribute('class',ob["class"]);
						 }
						if("name" in ob)
						 if(typeof ob["name"] === "object"){
							innerDiv[i].setAttribute('name',ob["name"][i]);
						 }else{
							innerDiv[i].setAttribute('name',ob["name"]);
						 }
						if("id" in ob){
						 if(typeof ob["id"] === "object"){
							innerDiv[i].setAttribute('id',ob["id"][i]);
						 }else{
							innerDiv[i].setAttribute('id',ob["id"]);
						 }
						}
						if("src" in ob){
							if(typeof ob["src"] === "object"){
							 innerDiv[i].setAttribute('src',ob["src"][i]);
							}else if(typeof ob["src"] === "string"){
							 innerDiv[i].setAttribute('src',ob["src"]);
							}
						}
						if("placeholder" in ob){
							if(typeof ob["placeholder"] === "object"){
							 innerDiv[i].setAttribute('placeholder',ob["placeholder"][i]);
							}else if(typeof ob["placeholder"] === "string"){
							 innerDiv[i].setAttribute('placeholder',ob["placeholder"]);
							}
						}
						if("type" in ob){
							if(typeof ob["type"] === "object"){
							 innerDiv[i].setAttribute('type',ob["type"][i]);
							}else if(typeof ob["type"] === "string"){
							 innerDiv[i].setAttribute('type',ob["type"]);
							}
						}
						if("value" in ob){
							if(typeof ob["value"] === "object"){
							 innerDiv[i].setAttribute('value',ob["value"][i]);
							}else if(typeof ob["value"] === "string"){
							 innerDiv[i].setAttribute('value',ob["value"]);
							}
						}
						if("text" in ob){
							//alert(typeof ob["text"])
							if(typeof ob["text"] === "object"){
							 if(ob["text"][i] !== undefined){
									innerDiv[i].innerHTML = ob["text"][i];
							 }
							}else if(typeof ob["text"] === "string"){
							 innerDiv[i].innerHTML = ob["text"];
							}
						}
						innerDiv[i].style['border-width'] = "1px";


						if("style" in ob){
							if(typeof ob["style"][i] !== "undefined"){
								var key = Object.keys(ob["style"][i])
								for(var j = 0; j < key.length; j++){
									if("width" in ob["style"][i]){
									if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][i][key[j]])/wd)*100),3)
										 if(key[j] == "margin"){m = m * 2}
										 var  nw = w - m
										 var body_width = $j("body").trueStyle("width")
										 var con_width = $j(el).trueStyle("width")
										 var child_margin = ob["style"][i][key[j]]
										 if("margin-left" in ob["style"][i] && "margin-right" in ob["style"][i]){
											 if(child_margin.search("%") > 0){
												 nw = 100 - (parseFloat(child_margin)*2)
												 m = parseFloat(child_margin)
											 }else{
												 if(con_width.search("%") > 0){
													 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
													 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
													 m = child_marginPer;
													 nw = 100 - (m*2);
												 }else{
													 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
													 m = child_marginPer;
													 nw = (100 / ob["horizontal"]) - m;
												 }
											 }
											 if("padding-left" in ob["style"][i]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-left"])*mer)/100),3);
												 nw = nw - pm
											 }
											 if("padding-right" in ob["style"][i]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-right"])*mer)/100),3);
												 nw = nw - pm
											 }
										 }

										 if(!("margin-left" in ob["style"][i]) && "margin-right" in ob["style"][i]){
											 if(child_margin.search("%") > 0){
												 nw = 100 - parseFloat(child_margin)
												 m = parseFloat(child_margin)
											 }else{
												 if(con_width.search("%") > 0){
													 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
													 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
													 m = child_marginPer;
													 nw = 100 - m;
												 }else{
													 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
													 m = child_marginPer;
													 nw = (100 / ob["horizontal"]) - m;
												 }
											 }
											 if("padding-left" in ob["style"][i]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-left"])*mer)/100),3);
												 nw = nw - pm
											 }
											 if("padding-right" in ob["style"][i]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-right"])*mer)/100),3);
												 nw = nw - pm
											 }
										 }
										 if("margin-left" in ob["style"][i] && !("margin-right" in ob["style"][i])){
											 if(child_margin.search("%") > 0){
												 nw = 100 - parseFloat(child_margin)
												 m = parseFloat(child_margin)
											 }else{
												 if(con_width.search("%") > 0){
													 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
													 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
													 m = child_marginPer;
													 nw = 100 - m;
												 }else{
													 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
													 m = child_marginPer;
													 nw = (100 / ob["horizontal"]) - m;
												 }
											 }
											 if("padding-left" in ob["style"][i]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-left"])*mer)/100),3);
												 nw = nw - pm
											 }
											 if("padding-right" in ob["style"][i]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-right"])*mer)/100),3);
												 nw = nw - pm
											 }
										 }
										 innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
									}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style[key[j]] = ob["style"][i][key[j]];
									}else if(key[j] != "width"){
										 innerDiv[i].style[key[j]] = ob["style"][i][key[j]];
									}
									}else{
										if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][i][key[j]])/wd)*100),3);
										 var  nw = w - m
										 //if(ob["tag"] == "input" || ob["tag"][i] == "input"){
											 var body_width = $j("body").trueStyle("width")
											 var con_width = $j(el).trueStyle("width")
											 var child_margin = ob["style"][key[j]]
											 if("margin-left" in ob["style"][i] && "margin-right" in ob["style"][i]){
												 if(child_margin.search("%") > 0){
													 nw = 100 - (parseFloat(child_margin)*2)
													 m = parseFloat(child_margin)
												 }else{
													 if(con_width.search("%") > 0){
														 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
														 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
														 m = child_marginPer;
														 nw = 100 - (m*2);
													 }else{
														 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
														 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
														 m = child_marginPer;
														 nw = (100 / ob["horizontal"]) - m;
													 }
												 }
												 if("padding-left" in ob["style"][i]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-left"])*mer)/100),3);
													 nw = nw - pm
												 }
												 if("padding-right" in ob["style"][i]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-right"])*mer)/100),3);
													 nw = nw - pm
												 }
											 }

											 if(!("margin-left" in ob["style"][i]) && "margin-right" in ob["style"][i]){
												 if(child_margin.search("%") > 0){
													 nw = 100 - parseFloat(child_margin)
													 m = parseFloat(child_margin)
												 }else{
													 if(con_width.search("%") > 0){
														 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
														 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
														 m = child_marginPer;
														 nw = 100 - m;
													 }else{
														 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
														 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
														 m = child_marginPer;
														 nw = (100 / ob["horizontal"]) - m;
													 }
												 }
												 if("padding-left" in ob["style"][i]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-left"])*mer)/100),3);
													 nw = nw - pm
												 }
												 if("padding-right" in ob["style"][i]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-right"])*mer)/100),3);
													 nw = nw - pm
												 }
											 }
											 if("margin-left" in ob["style"][i] && !("margin-right" in ob["style"][i])){
												 if(child_margin.search("%") > 0){
													 nw = 100 - parseFloat(child_margin)
													 m = parseFloat(child_margin)
												 }else{
													 if(con_width.search("%") > 0){
														 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
														 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
														 m = child_marginPer;
														 nw = 100 - m;
													 }else{
														 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
														 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
														 m = child_marginPer;
														 nw = (100 / ob["horizontal"]) - m;
													 }
												 }
												 if("padding-left" in ob["style"][i]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-left"])*mer)/100),3);
													 nw = nw - pm
												 }
												 if("padding-right" in ob["style"][i]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"][i]["padding-right"])*mer)/100),3);
													 nw = nw - pm
												 }
											 }
											 //var of = this.roundoff(((4/wd)*100),3);
											 //nw = nw - of
										// }

										 innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
										}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style['width'] = w+"%";
										}else if(key[j] != "width"){
										 innerDiv[i].style[key[j]] = ob["style"][i][key[j]];
										}
									}
								}
							}else{
								var key = Object.keys(ob["style"])
								for(var j = 0; j < key.length; j++){
									if("width" in ob["style"]){
									if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][key[j]])/wd)*100),3);
										 if(key[j] == "margin"){m = m * 2}
										 var  nw = w - m
										 var body_width = $j("body").trueStyle("width")
										 var con_width = $j(el).trueStyle("width")
										 var child_margin = ob["style"][key[j]]
										 if("margin-left" in ob["style"] && "margin-right" in ob["style"]){
											 if(child_margin.search("%") > 0){
												 nw = 100 - (parseFloat(child_margin)*2)
												 m = parseFloat(child_margin)
											 }else{
												 if(con_width.search("%") > 0){
													 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
													 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
													 m = child_marginPer;
													 nw = 100 - (m*2);
												 }else{
													 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
													 m = child_marginPer;
													 nw = (100 / ob["horizontal"]) - m;
												 }
											 }
											 if("padding-left" in ob["style"]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"]["padding-left"])*mer)/100),3);
												 nw = nw - (pm/3)
											 }
											 if("padding-right" in ob["style"]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"]["padding-right"])*mer)/100),3);
												 nw = nw - (pm/3)
											 }
										 }

										 if(!("margin-left" in ob["style"]) && "margin-right" in ob["style"]){
											 if(child_margin.search("%") > 0){
												 nw = 100 - parseFloat(child_margin)
												 m = parseFloat(child_margin)
											 }else{
												 if(con_width.search("%") > 0){
													 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
													 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
													 m = child_marginPer;
													 nw = 100 - m;
												 }else{
													 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
													 m = child_marginPer;
													 nw = (100 / ob["horizontal"]) - m;
												 }
											 }
											 if("padding-left" in ob["style"]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"]["padding-left"])*mer)/100),3);
												 nw = nw - pm
											 }
											 if("padding-right" in ob["style"]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"]["padding-right"])*mer)/100),3);
												 nw = nw - pm
											 }
										 }
										 if("margin-left" in ob["style"] && !("margin-right" in ob["style"])){
											 if(child_margin.search("%") > 0){
												 nw = 100 - parseFloat(child_margin)
												 m = parseFloat(child_margin)
											 }else{
												 if(con_width.search("%") > 0){
													 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
													 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
													 m = child_marginPer;
													 nw = 100 - m;
												 }else{
													 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
													 m = child_marginPer;
													 nw = (100 / ob["horizontal"]) - m;
												 }
											 }
											 if("padding-left" in ob["style"]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"]["padding-left"])*mer)/100),3);
												 //nw = nw - (pm/2)
											 }
											 if("padding-right" in ob["style"]){
												 if(con_width.search("%") > 0){
													 var mer = parseFloat(con_width)
												 }else{
													 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
												 }
												 var  pm = this.roundoff(((parseInt(ob["style"]["padding-right"])*mer)/100),3);
												 nw = nw - pm
											 }

										 }

										 innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
									}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style[key[j]] = ob["style"][key[j]];
									}else if(key[j] != "width"){
										 innerDiv[i].style[key[j]] = ob["style"][key[j]];
									}
									}else{

										//alert($j(el).trueStyle("width")+" "+ob["style"][key[j]]+" "+nw+" / "+m+" "+w+"%")
										if(key[j] == "margin" || key[j] == "margin-left" || key[j] == "margin-right"){
										 var  m = this.roundoff(((parseInt(ob["style"][key[j]])/wd)*100),3);
										 var  nw = w - m
										 //if(ob["tag"] == "input" || ob["tag"][i] == "input"){
											 var body_width = $j("body").trueStyle("width")
											 var con_width = $j(el).trueStyle("width")
											 var child_margin = ob["style"][key[j]]
											 if("margin-left" in ob["style"] && "margin-right" in ob["style"]){
												 if(child_margin.search("%") > 0){
													 nw = 100 - (parseFloat(child_margin)*2)
													 m = parseFloat(child_margin)
												 }else{
													 if(con_width.search("%") > 0){
														 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
														 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
														 m = child_marginPer;
														 nw = 100 - (m*2);
													 }else{
														 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
														 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
														 m = child_marginPer;
														 nw = (100 / ob["horizontal"]) - m;
													 }
												 }
												 if("padding-left" in ob["style"]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"]["padding-left"])*mer)/100),3);
													 nw = nw - (pm/3)
												 }
												 if("padding-right" in ob["style"]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"]["padding-right"])*mer)/100),3);
													 nw = nw - (pm/3)
												 }
											 }

											 if(!("margin-left" in ob["style"]) && "margin-right" in ob["style"]){
												 if(child_margin.search("%") > 0){
													 nw = 100 - parseFloat(child_margin)
													 m = parseFloat(child_margin)
												 }else{
													 if(con_width.search("%") > 0){
														 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
														 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
														 m = child_marginPer;
														 nw = 100 - m;
													 }else{
														 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
														 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
														 m = child_marginPer;
														 nw = (100 / ob["horizontal"]) - m;
													 }
												 }
												 if("padding-left" in ob["style"]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"]["padding-left"])*mer)/100),3);
													 nw = nw - pm
												 }
												 if("padding-right" in ob["style"]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"]["padding-right"])*mer)/100),3);
													 nw = nw - pm
												 }
											 }
											 if("margin-left" in ob["style"] && !("margin-right" in ob["style"])){
												 if(child_margin.search("%") > 0){
													 nw = 100 - parseFloat(child_margin)
													 m = parseFloat(child_margin)
												 }else{
													 if(con_width.search("%") > 0){
														 con_widthPix = (parseFloat(body_width) * parseFloat(con_width)) / 100
														 child_marginPer = (parseFloat(child_margin) / con_widthPix) * 100
														 m = child_marginPer;
														 nw = 100 - m;
													 }else{
														 con_widthPer = (parseFloat(con_width) / parseFloat(body_width)) * 100
														 child_marginPer = (parseFloat(child_margin) * con_widthPer) / (ob["horizontal"] * 100)
														 m = child_marginPer;
														 nw = (100 / (ob["horizontal"])) - m;
													 }
												 }
												 if("padding-left" in ob["style"]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"]["padding-left"])*mer)/100),3);
													 //nw = nw - (pm/2)
												 }
												 if("padding-right" in ob["style"]){
													 if(con_width.search("%") > 0){
														 var mer = parseFloat(con_width)
													 }else{
														 var mer = (parseFloat(con_width) / parseFloat(body_width)) * 100
													 }
													 var  pm = this.roundoff(((parseInt(ob["style"]["padding-right"])*mer)/100),3);
													 nw = nw - pm
												 }

											 }
											 //var of = this.roundoff(((4/wd)*100),3);
											 //nw = nw - of
										 //}

										 innerDiv[i].style['width'] = nw+"%";
										 innerDiv[i].style[key[j]] = m+"%";
										}else if(key[j] != "margin" && key[j] != "margin-left" && key[j] != "margin-right" && key[j] == "width"){
										 innerDiv[i].style['width'] = ob["style"][key[j]];
										}else if(key[j] != "width"){
										 if("margin-left" in ob["style"] || "margin-right" in ob["style"]){
											 innerDiv[i].style[key[j]] = ob["style"][key[j]];
										 }else{
												 innerDiv[i].style['width'] = w+"%";
												 innerDiv[i].style[key[j]] = ob["style"][key[j]];
										 }
										}
									}
								}
							}
						}else{
							innerDiv[i].style['width'] = w+"%";
						}

						if(i > -1){
							var ran = this.randomized(8)
							innerDiv[i].setAttribute("data-jlib-cellid",ran)
							if("event" in ob){
							 add(innerDiv[i],i);
							}
							el.appendChild(innerDiv[i]);
							//alert($j("@data-jlib-cellid="+ran).trueStyle("width"))
						}
					}
				}
				if(alt == true){
					 el.style["display"] = "none";
				}
			});

			return this;
		},
		embed: function(html){
			this.each(function(el) {
				if(el.tagName != "INPUT" && el.tagName != "TEXTAREA"){
						 el.innerHTML = html;
				}else{
					el.value = html;
				}
			})
			return this
		},
		embedded: function(){
			var em;
			this.each(function(el) {
				 if(el.tagName != "INPUT" && el.tagName != "TEXTAREA"){
						 em = el.innerHTML;
				 }else{
						 em = el.value;
				 }
			})
			return em;
		},
		setCookie: function(cookie, value, expire, domain, path) {
			var d = new Date();
			d.setTime(d.getTime() + (expire*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			if(domain !== undefined){
				 var domainn = "domain=."+domain+";path=/"+path
			}else{
				 var domainn = "";
			}
			document.cookie = cookie + "=" + value + "; " + expires + "; " + domainn;
			//alert(document.cookie.split(';'));
		},
		getCookie: function(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
			}
			return null;
		},
		deleteCookie: function(cookie){
			document.cookie = cookie+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		},
		loop: function (property,time,times,ob){
			var id, data, res

			if(ob !== undefined && typeof ob === "object"){
				if("data" in ob){
					var data = ob["data"]
				}
				if("reset" in ob){
					var res = ob["reset"]
				}
				if("id" in ob){
					var id = ob["id"]
				}
			}

			if(id === undefined){
				 var fn = $j().functionName(property)
			}else{
				 var fn = id
				 //GLOBALS["loop_time"][fn] = 0;
			}
			//alert(GLOBALS["loop_time"][fn]+"-"+fn)
			if(GLOBALS["loop_time"][fn] === undefined || res == true){
				GLOBALS["loop_time"][fn] = 0;
			}

			GLOBALS["loop_logic"][fn] = true

			if(typeof property === "function"){
				if(data !== "undefined"){
					 property(data)
				}else{
					property()
				}
				setTimeout(function(){
					 GLOBALS["loop_time"][fn]++

					 var logic = (times == "infinite") ? times == "infinite" : GLOBALS["loop_time"][fn] <= times;
					 if(logic == true && GLOBALS["loop_logic"][fn] == true){
						$j().loop(property,time,times,ob)
					 }else{
						 GLOBALS["loop_time"][fn] = 0;
					 }
				},time);
			}
		},
		killLoop: function (property){
			var fn = $j().functionName(property)
			GLOBALS["loop_logic"][fn] = false
		},
		random: function(f,s){
			var ran = Math.floor((Math.random() * s))
			while(ran < f){
				ran = Math.floor((Math.random() * s))
			}
			return ran;
		},
		text: function(){
			var em;
			this.each(function(el) {
				 em = el.textContent;
			})
			return em;
		},
		affix: function(pos,html){
			this.each(function(el) {
				 if(pos == "before")
						el.insertAdjacentHTML('beforebegin', html);
				 if(pos == "begin")
						el.insertAdjacentHTML('afterbegin', html);
				 if(pos == "end")
						el.insertAdjacentHTML('beforeend', html);
				 if(pos == "after")
						el.insertAdjacentHTML('afterend', html);
			})
			return this
		},
		hitTest: function(ht,fn){
			var that = this
			var hit = false;
			var logi;
			function lop(){
				that.each(function(el) {
					 hit = false;
					 //alert()
					 var T = $j(el).borders("top")
					 var L = $j(el).borders("left")
					 var H = parseInt($j(el).calHeight())
					 var W = parseInt($j(el).calWidth())

					 var T1 = ht.borders("top")
					 var L1 = ht.borders("left")
					 var H1 = parseInt(ht.calHeight())
					 var W1 = parseInt(ht.calWidth())
					 var X = L + W;
					 var Y = T + H;
					 var X1 = L1 + W1;
					 var Y1 = T1 + H1;
					 if(isNaN(X1)){

					 }else{
						 if(L < L1 && X > L1 && T < T1 && Y > T1){
							 hit = true
							 logi = L+" < "+L1+" && "+X+" > "+L1+" && "+T+" < "+T1+" && "+Y+" > "+T1
						 }else if(L1 < L && X1 > L && T1 < T && Y1 > T){
							hit = true
							logi = L+" < "+L1+" && "+X+" > "+L1+" && "+T+" < "+T1+" && "+Y+" > "+T1
						 }else if(L < X1 && L > L1 && T < T1 && Y > T1){
							hit = true
							logi = 3
						 }else if(L < X1 && X > X1 && T < T1 && Y > T1){
							hit = true
							logi = 4
						 }else if(L1 < L && X1 > X && T1 < T && Y1 > T){
							hit = true
							logi = 5
						 }else if(L > L1 && X < X1 && T > T1 && Y < Y1){
							hit = true
							logi = 6
						 }else if(X > L1 && L < X1){
							 logi = 7
							 hit = true
						 }
					 }
					 //$j("#t2").embed(logi)
					 fn(hit,el)

				})
				window.requestAnimationFrame(lop)
			}
			lop()

		},
		sanitize: function(){
			var EM = []
			this.each(function(el) {
					 var a = $j().sequence("array",$j(el))
				 var inp = a[1]
				 EM.push(inp[0][0])
			})
			return EM
		},
		//=================revisit==================
		append: function(ob){
			this.each(function(el) {
				 var a = $j().sequence("array",ob)
				 var sob = ob.toString()
				 var o = a[1]

				 if(sob.indexOf("HTMLDivElement") > 0){
					//alert(button+" : "+el+" : "+a[1]+" : "+document.getElementById("demo"))
					el.appendChild(ob)
				 }else{
						el.appendChild(a[1])
				 }
			})
			return this
		},
		//=================revisit===================
		detach: function(ob){
			var par, nods = [], n = 0;
			this.each(function(el) {
				//alert(el.parentNode.hasChildNodes()+"number: "+el.parentNode)
				 par = el.parentNode
				 if (par.hasChildNodes()) {
					 var len = par.childNodes.length
					 for(var i = 0; i < len; i++){
						//alert($j(par.childNodes[i]).id())
						if(par.childNodes[i].nodeName != "#text"){
							//alert($j(par.childNodes[i]).id())
							//alert()
							//alert(par.childNodes[i]+" == "+el)
							if(par.childNodes[i] == el){
								//alert("yes")
								//alert($j(el).id()+" : "+par.childNodes.length+" : "+len)
								nods[n] = par.childNodes[i];
								n++;

								//alert("yes")
							}
						}
							//alert(el.childNodes[0]+" : "+el.childNodes[0].tagName)
					 }
					//ms.removeChild(ms.childNodes);
				 }
			})
			//alert(par)
			for(var i = 0; i < nods.length; i++){
				par.removeChild(nods[i]);

			}
			//par.removeChild(par.childNodes[i]);
			return this
		},
		rgbHex: function(rgb,v) {
			var r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2])
			var R = r.toString(16), G = g.toString(16), B = b.toString(16);
			//alert(R+":"+G+":"+B+" = "+R.length+":"+G.length+":"+B.length)
			if(R.length == 1){R = "0"+R}
			if(G.length == 1){G = "0"+G}
			if(B.length == 1){B = "0"+B}
			var hex = "#"+R+G+B;
			//alert(R+":"+G+":"+B+" = "+R.length+":"+G.length+":"+B.length)
			if(hex == "#000"){hex = hex+"000";}
			if(v == true && hex == "#000000"){
					hex = "#"
			}
			return hex;
		},
		hexRgb: function(hex,v) {
			var h1,h2,h3;
			if(hex.indexOf("#" == 0)){
				 hex = hex.substr(1, 6);
			}
			var temp = hex.split("")
			h1 = temp[0]+""+temp[1]
			h2 = temp[2]+""+temp[3]
			h3 = temp[4]+""+temp[5]

			var RGB = parseInt(h1, 16)+", "+parseInt(h2, 16)+", "+parseInt(h3, 16);
			//alert(RGB)
			return RGB;
		},
		enhance: function(ob){
			this.each(function(el) {
				var col = window.getComputedStyle(el,null).getPropertyValue("background-color");
				var ncol = col.substring(col.indexOf("(")+1, col.indexOf(")")).split(",");
				col = $j().rgbHex(ncol,true);
				var ht = $j(el).trueStyle("height")

				if(ob["rest"] == "lighter-"){
					var r = false, b = ob["percent"];
				}
				if(ob["rest"] == "lighter+"){
					var r = true, b = ob["percent"] * -1;
				}
				if(ob["rest"] == "darker-"){
					var r = true, b = ob["percent"];
				}
				if(ob["rest"] == "darker+"){
					var r = false, b = ob["percent"] * -1;
				}

				var ref = ob["reflect"]
				if("rest" in ob){
					 var rest = this.gradient(this.colorBrightness(col,b),r,ref);
				 //alert(rest)
				 el.style["background-image"] = rest;
					 el.style["background"] = rest;
				}

				var inset =" ";
				if(ob["inset"] == true){
				inset = "inset";
				}
				if(ob['shadow'] == "spread5d"){
					 el.style["box-shadow"] = "0px 0px 5px #111111 "+inset;
				}else
				if(ob['shadow'] == "spread5"){
					 el.style["box-shadow"] = "0px 0px 5px #888888 "+inset;
				}else
				if(ob['shadow'] == "spread3"){
					 el.style["box-shadow"] = "0px 0px 3px #cccccc "+inset;
				}else
				if(ob['shadow'] == "spread3d"){
					 el.style["box-shadow"] = "0px 0px 3px #222222 "+inset;
				}else
				if(ob['shadow'] == "spread2"){
					 el.style["box-shadow"] = "0px 0px 2px #cccccc "+inset;
				}else
				if(ob['shadow'] == "spread2d"){
					 el.style["box-shadow"] = "0px 0px 3px #222222 "+inset;
				}else
						if(ob['shadow'] == "spread10"){
					 el.style["box-shadow"] = "0px 0px 10px #888888 "+inset;
				}else
				if(ob['shadow'] == "light+"){
					 el.style["box-shadow"] = "4px 4px 1px #888888 "+inset;
				}else
				if(ob['shadow'] == "dark+"){
					 el.style["box-shadow"] = "4px 4px 2px #000000 "+inset;
				}else
				if(ob['shadow'] == "light-"){
					 el.style["box-shadow"] = "2px 2px 2px #888888 "+inset;
				}else
				if(ob['shadow'] == "dark-"){
					 el.style["box-shadow"] = "2px 2px 2px #000000 "+inset;
				}else
				if(ob['shadow'] == "slight+"){
					 el.style["box-shadow"] = "1px 1px 1px #555555 "+inset;
				}else
				if(ob['shadow'] == "slight-"){
					 el.style["box-shadow"] = "1px 1px 1px #000000 "+inset;
				}else
				if(typeof ob['shadow'] === "number"){
					var s = this.colorBrightness("#ffffff",-1*ob['shadow'])
					el.style["box-shadow"] = "1px 1px 1px "+s[1]+" "+inset;
				}else{

				}


				if('border' in ob && ob["border"] != false){
				 //*
				 var colb = -20, brw = "thin";
				 if(typeof ob["border"] === "object"){
					 //alert(ob["border"]["color"])
					 if("color" in ob["border"] && "percent" in ob["border"]){
						 colb = ob["border"]["percent"]
						 var c = this.colorBrightness(ob["border"]["color"],colb*-1)
					 }else if("color" in ob["border"] && ob["border"]["color"] != "inherit"){

						 var c = []
						 c[1] = ob["border"]["color"]
					 }else if("color" in ob["border"] && ob["border"]["color"] == "inherit"){
						 var c = this.colorBrightness(col,colb)
					 }
					 if("width" in ob["border"]){
						 brw = ob["border"]["width"]+"px"
					 }
				 }else{
					 if(typeof ob["border"] === "number"){
						 var c = this.colorBrightness(col,-1*ob["border"])
					 }else if(ob["border"] != true){
						 var c = []
						 c[1] = ob["border"]
					 }else{
						 var c = this.colorBrightness(col,-20)
					 }
				 }
					 el.style["box-sizing"] = "border-box"
				 el.style["-moz-box-sizing"] = "border-box"
				 el.style["-webkit-box-sizing"] = "border-box"
				 el.style["border-style"] = "solid"
				 el.style["border-width"] = brw
				 el.style["border-color"] = c[1];
				 //*/
				}
				if('radius' in ob){
						 el.style["border-radius"] = ob["radius"]+"px";
				}

			});
			return this
		},
		unenhance: function(ob){
			this.each(function(el) {
				var originalStyle = el.getAttribute('style');
				var regex = new RegExp(/(background:|box-shadow:|border:).+?(;[\s]?|$)/g);
				var modStyle = originalStyle.replace(regex, "");
				el.setAttribute('style', modStyle);
				$j(el).setStyle("border","");
				//alert($j(el).trueStyle("border-color"))

			});
			return this
		},
		emulate: function(ob){
			this.each(function(el) {
				var oStyle = el.getAttribute('style');
				var eStyle = ob.attribute('style');
				//var regex = new RegExp(/(-webkit-animation:).+?(;[\s]?|$)/g);
				//var modStyle = originalStyle.replace(regex, "");
				//alert(newstyle)
				el.setAttribute('style', "");
				el.setAttribute('style', eStyle);
			});
			return this
		},
		buttonize: function(ob, fn){
			//if you want to get the index of the button just pass a value through the function parameter of the bottonize initiator
			this.each(function(el) {
				var tim = 300, typ = [0], reflect = true, degree = 0.15, action = "mouseenter";
				if("type" in ob){
					typ = ob["type"]
				}
				if("degree" in ob){
					degree = parseFloat(ob["degree"])
				}
				if("action" in ob){
					action = ob["action"]
				}

				var bdc = $j(el).trueStyle("background");
				var ncol = bdc.substring(bdc.indexOf("(")+1, bdc.indexOf(")")).split(",");
				bdc = $j().rgbHex(ncol,false);
				var bc = $j().colorBrightness(bdc,50)

				var w = parseInt($j(el).trueStyle("width"));
				var h = parseInt($j(el).trueStyle("height"));
				var ph = w * degree
				var pv = h * degree
				var sg = 1 + degree
				var ss = 1 - degree
				var dg  = 100 * degree
				sg = sg.toString()
				ss = ss.toString()
				dg = dg.toString()
				//alert(bdc+" : "+bc+" : "+w+" : "+h+" : "+ph+" : "+pv+" : ")
				var grow = {0:"actual",100:sg}, grow2 = {0:sg,100:"1"}
				var shrink = {0:"actual",100:ss}, shrink2 = {0:ss,100:"1"}
				var radius = {0:"actual",100:pv+"px"}, radius2 = {0:pv+"px",100:"0px"}
				var background = {0:bdc,100:bc[1]}, background2 = {0:bc[1],100:bdc}
				var tiltleft = {0:"0",100:"-"+dg}, tiltleft2 = {0:"-"+dg,100:"0"}
				var tiltright = {0:"0",100:dg}, tiltright2 = {0:dg,100:"0"}
				var pushup = {0:"0px",100:(pv*-1)+"px"}, pushup2 = {0:(pv*-1)+"px",100:"0px"}
				var pushdown = {0:"0px",100:pv+"px"}, pushdown2 = {0:pv+"px",100:"0px"}
				var pushleft = {0:"0px",100:(ph*-1)+"px"}, pushleft2 = {0:(ph*-1)+"px",100:"0px"}
				var pushright = {0:"0px",100:(ph)+"px"}, pushright2 = {0:(ph)+"px",100:"0px"}
				var MTYP = ["size","size","radius","background","rotate","rotate","top","top","left","left"]

				var TTYP = {0:grow,1:shrink,2:radius,3:background,4:tiltleft,5:tiltright,6:pushup,7:pushdown,8:pushleft,9:pushright}
				var TTYP2 = {0:grow2,1:shrink2,2:radius2,3:background2,4:tiltleft2,5:tiltright2,6:pushup2,7:pushdown2,8:pushleft2,9:pushright2}

				$j(el).after(action,function(e){
					var TYP = [], TWE = [], TW = false;
					for(var ii = 0; ii < typ.length; ii++){
						TYP.push(MTYP[typ[ii]])
						TWE.push(TTYP[typ[ii]])
					}
					$j(el).animate({type:TYP,time:tim,tween:TWE});
					if(action == "click"){
							fn(el,e)
					}
				}).after("mouseleave",function(){
					var TYP = [], TWE = [], TW = false;
					for(var ii = 0; ii < typ.length; ii++){
						TYP.push(MTYP[typ[ii]])
						TWE.push(TTYP2[typ[ii]])
					}
					$j(el).animate({type:TYP,time:tim,tween:TWE});
				}).after("click",function(e){
					fn(el,e)
				}).setStyle("cursor","pointer")
			})

			return this;
		},
		imageSize: function(){
			var w, h, b, sb
			this.each(function(el) {
				b = $j(el).trueStyle("background-image")
				//alert(b)
				if(b.indexOf("url(") >= 0){
						b.trim(), b = b.replace('"',''), b = b.replace('"','')
						var is = b.split(")")
						var isrc = is[0].substr(is[0].indexOf("(")+1, is[0].length-1)
						//alert(isrc)
						var image = new Image();
						image.src = isrc;
						w = image.width, h = image.height;
				}
			})
			return [w, h]

		},
		responsive: function(baseH, baseW, bg){
			this.each(function(el) {
				var img = $j(el).imageSize()
				//alert(img)
				//alert($j(el).trueStyle("height"))
				var parH = $j(el.parentNode).trueStyle("height"), parW = $j(el.parentNode).trueStyle("width")
				var width = $j(el).trueStyle("width"), height = $j(el).trueStyle("height"), font = $j(el).trueStyle("font-size")
				,margin = $j(el).trueStyle("margin"), padding = $j(el).trueStyle("padding"), bgsz = $j(el).trueStyle("background-size")
				//alert(width+" - "+height+" - "+font+" - "+margin+" - "+padding+" : "+bgsz)
				var mars = margin.split(" "), pads = padding.split(" ")
				if(pads[0] === undefined){	pads[0] = "0px"; }
				if(pads[1] === undefined){	pads[1] = "0px"; }
				if(pads[2] === undefined){	pads[2] = "0px"; }
				if(pads[3] === undefined){	pads[3] = "0px"; }
				if(mars[0] === undefined){	mars[0] = "0px"; }
				if(mars[1] === undefined){	mars[1] = "0px"; }
				if(mars[2] === undefined){	mars[2] = "0px"; }
				if(mars[3] === undefined){	mars[3] = "0px"; }

				var reselem = [width,height,font,mars[0],mars[1],mars[2],mars[3],pads[0],pads[1],pads[2],pads[3],width,height], results = []
var styles = ["width","height","font-size","margin","margin","margin","margin","padding","padding","padding","padding","background-size","background-size"]
				var ma = "", pa = "", ba = ""

				function resp(v,t){
					if(t != "height"){
						 return (parseFloat($j().windowWidth()) / baseW) * parseFloat(v)
					}else{
						return (parseFloat($j().windowHeight()) / baseH) * parseFloat(v)
					}
				}
				var b = 0;
				for(var i = 0; i < reselem.length; i++){
					if(styles[i] == "background-size"){
						if(bg == true){
							if(b == 0){
								 results[i] = resp(img[0])
							}else{
								results[i] = resp(img[1])
								$j(el).setStyle("background-repeat","no-repeat")
							}
							ba = ba + " "+results[i]+"px"
							//alert(ba)
							$j(el).setStyle(styles[i],ba)
							b++
						}else{

						}
					}else
					if(styles[i] == "height"){
						results[i] = resp(reselem[i],styles[i])
						//alert(styles[i]+" : "+results[i]+" : "+i)
						$j(el).setStyle(styles[i],results[i]+"px")
					}else
					if(styles[i] == "font-size"){
						results[i] = resp(reselem[i])
						//alert(styles[i]+" : "+results[i]+" : "+i)
						$j(el).setStyle(styles[i],results[i]+"px")
					}else{
						//alert(styles[i]+" : "+results[i]+" : "+i)
						results[i] = resp(reselem[i])
						//alert(styles[i]+" : "+results[i]+" : "+i)
						if(styles[i] == "padding"){
							pa = pa + " "+results[i]+"px"
							//alert(pa)
							$j(el).setStyle(styles[i],pa)
						}else
						if(styles[i] == "margin"){
							//ma = ma + results[i]
							ma = ma + " "+results[i]+"px"
							//alert(ma)
							$j(el).setStyle(styles[i],ma)
						}else{
							//alert(results[i])
							$j(el).setStyle(styles[i],results[i]+"px")
						}

					}

				}
				//alert($j(el).trueStyle("height"))

					//$j().convert("150px",$j("#p"+ind+"[a]").trueStyle("width"))
			})
		},
		convert: function(p,r){
			ob = {}
			P = parseFloat(p)
			R = parseFloat(r)
			var body = document.body, htmlv = document.documentElement;
			var windowH = Math.max( body.scrollHeight, body.offsetHeight, htmlv.clientHeight, htmlv.scrollHeight, htmlv.offsetHeight );
			W = parseInt($j("body").trueStyle("width"))
			H = htmlv.clientHeight
			if(typeof r === "undefined"){
				W = parseInt($j("body").trueStyle("width"))
				H = htmlv.clientHeight
			}else{
				if(r.indexOf("%") > 0){
					H = ((H * R) / 100);
					W = ((W * R) / 100);
				}
				if(r.indexOf("px") > 0){
					H = R;
					W = R;
				}
			}

			if(p.indexOf("%") > 0){
				nH = ((H * P) / 100)+"px";
				nW = ((W * P) / 100)+"px";
			}
			if(p.indexOf("px") > 0){
				nH = ((P / H) * 100)+"%";
				nW = ((P / W) * 100)+"%";
			}
			return {height:nH,width:nW}
		},
		remove: function(ob,val){
			if(ob.constructor === Array && ob.indexOf(val) >= 0){
				 ob.splice(ob.indexOf(val),1);
			}else if(typeof ob === "object"){
				var key = Object.keys(ob)
				for(var j = 0; j < key.length; j++){
					if (ob[key[j]] == val){
						delete ob[key[j]];
						}
				}

			}
			return ob;
		},
		objectCount: function(obj) {
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},
		copy: function(ob){
			if(ob.constructor === Array){
				var Obj = []
				for(var j = 0; j < ob.length; j++){
					Obj[j] = ob[j];
				}
				return Obj;
			}else if(typeof ob === "object"){
				var Obj = {}
				var key = Object.keys(ob)
				for(var j = 0; j < key.length; j++){
					Obj[key[j]] = ob[key[j]];
				}
				return Obj;
			}

		},
		purify: function(ob,ar){
			var key = Object.keys(ob)
			for(var j = 0; j < ar.length; j++){
				delete ob[ar[j]]
			}
			return ob
		},
		functionName: function(fun) {
			var ret = fun.toString();
			ret = ret.substr('function '.length);
			ret = ret.substr(0, ret.indexOf('('));
			return ret;
		},
		function_: function(fun) {
			var getType = {};
						return fun && getType.toString.call(fun) === '[object Function]';
		},
		autocheck: function(ob, fn){
			this.each(function(el) {
				$j(el).after(ob["action"],function(){
					 var val = $j(el).embedded()
					 if("asynch" in ob && ob["asynch"] == true){
						 $j().ASYNCPOST(ob["url"], ob["data"], function send0(a0){
							 if("search" in ob && ob["search"] == true){
								 fn(a0[1],el)
							 }else{
								if(a0[1].trim() == val){
									fn(true,el)
								}else{
									fn(false,el)
								}
							 }
						 }, [{value:val}])
					 }else{
						 fn(val)
					 }
				})
			})
			return this;
		},
		sequence: function(type, add){
			var obj = {};
			var pos ="";
			var arv = [];
			var ark = [];
			var ad = false;
			var elv = false;
			this.each(function(el) {
				if(typeof el === "object"){
					elv = true
					var nds = el.querySelectorAll("*")
					for(var i = 0; i < nds.length; i++){
						if(nds[i].tagName == "INPUT" || nds[i].tagName == "SELECT" || nds[i].tagName == "TEXTAREA" || nds[i].tagName == "OUTPUT"){
							var name = nds[i].getAttribute("name");
							var val = nds[i].value;
							obj[name] = val;
							pos = name+"="+val+"&"+pos;
						}
					}
					if(typeof add === "object" || typeof type === "object"){
						if(typeof type === "object"){
							 add = type;
							 ad = true
						}

						var key = Object.keys(add)
						for(var j = 0; j < key.length; j++){
							obj[key[j]] = add[key[j]];
							pos = key[j]+"="+add[key[j]]+"&"+pos;
						}
					}
				}
			})
			if(typeof add === "object" && typeof type === "object" && ad == false){
				var key = Object.keys(add)
				//alert(key)
				for(var j = 0; j < key.length; j++){
					type[key[j]] = add[key[j]];
				}
				return type;
			}else if(type == "string"){
				var key = Object.keys(add)
				for(var j = 0; j < key.length; j++){
					pos = key[j]+"="+add[key[j]]+"&"+pos;
				}
				return pos;
			}else if(type == "array"){
				if(typeof add === "object"){
					var key = Object.keys(add)
					for(var j = 0; j < key.length; j++){
						ark[j] = key[j];
						arv[j] = add[key[j]];
					}
				}else{
					var key = Object.keys(obj)
					for(var j = 0; j < key.length; j++){
						ark[j] = key[j];
						arv[j] = obj[key[j]];
					}
				}
				return [ark,arv];
			}else if(type == "object"){
				if(elv == true){

				}else{
					for(var j = 0; j < add.length; j++){
						obj[j] = add[j];
						//alert(add[j])
					}
				}

				return obj;
			}else{
				return pos;
			}
		},
		ASYNCLOADJS: function(src,pos,fn){
				var s, r, t;
				r = false;
				s = document.createElement('script');
				s.type = 'text/javascript';
				s.src = src;
				s.onload = s.onreadystatechange = function(){
					if ( !r && (!this.readyState || this.readyState == 'complete') ){
					r = true;
					fn(s);
					}
				}
				t = document.getElementsByTagName('script')[pos];
				t.parentNode.insertBefore(s, t);

		},
		ASYNCPOST: function(url, data, fn, fd){
			var res;
			var xmlhttp;
			var pos;
			var pc

			if(fd === undefined){
				fd = []
			}

			if(typeof data === "object"){
					var key = Object.keys(data)

				for(var j = 0; j < key.length; j++){
					pos =key[j]+"="+data[key[j]]+"&"+pos;
				}

				if(fd[0] !== undefined){
					key = Object.keys(fd[0])
					for(var j = 0; j < key.length; j++){
						pos =key[j]+"="+fd[0][key[j]]+"&"+pos;
					}
				}
			}else{
				pos = data;
				if(typeof fd[0] === "object"){
					var key = Object.keys(fd[0])
					for(var j = 0; j < key.length; j++){
						pos =key[j]+"="+fd[0][key[j]]+"&"+pos;
					}
				}else if(typeof fd[0] === "string"){
					 pos = fd[0]+pos
				}

			}
			//XMLHttpRequest.withCredentials = true ;

			//*
			if (window.XMLHttpRequest){
				xmlhttp=new XMLHttpRequest();
			}else{
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}



			xmlhttp.onreadystatechange=function(){

				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					 fd.push(xmlhttp.responseText)
					 fn(fd)
				}
			}
			xmlhttp.open("POST",url,true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send(pos);
			//*/
		},
		ASYNCUPLOAD: function(url, data, fn, f, mt, s, un){
			var res;
			var xmlhttp;
			var pos;
			var pc;
			var formData = new FormData();
			var error = -1;
			//alert(f+" - "+mt+" - "+s)
			if(mt === undefined){
				 mt = "image"
			}
			if(s === undefined){
				 s = 2000000;
			}
			if(un === undefined){
				 un = "uploads[]"
			}

			for (var i = 0; i < f.length; i++) {
				var file = f[i];
				//alert(file.type+" "+mt)
				formData.append(un, file, file.name);
				if (file.type.match(mt+'.*')) {
					if(parseInt(file.size) > s){
						error = -3;
					}
				}else if (!file.type.match(mt+'.*')) {
					 error = -2;
				}
			}
			//if there is an error in file type or size then we return -2, -3
			if(error >= -1){
				if(typeof data === "object"){
					var key = Object.keys(data)
					for(var j = 0; j < key.length; j++){
						formData.append(key[j], data[key[j]]);
					}
				}
				//*
				if (window.XMLHttpRequest){
					xmlhttp=new XMLHttpRequest();
				}else{
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}

				xmlhttp.upload.addEventListener("progress", function(e) {
					pc = parseInt(100 - (e.loaded / e.total * 100));
					fn("",pc)

				}, false);

				xmlhttp.onreadystatechange=function(){
					if (xmlhttp.readyState==4 && xmlhttp.status==200){
						 if(error >= -1){
							fn(xmlhttp.responseText,pc)
						 }else{
							fn(xmlhttp.responseText,error)
						 }
					}
				}
				xmlhttp.open("POST",url,true);
				xmlhttp.send(formData);
			}else{
				fn("",error)
			}
			//*/
		},
		ASYNCGET: function(url, data, fn, fd){
			var res;
			var xmlhttp;
			var pos;
			var pc

			if(fd === undefined){
				fd = []
			}

			if(typeof data === "object"){
					var key = Object.keys(data)

				for(var j = 0; j < key.length; j++){
					pos =key[j]+"="+data[key[j]]+"&"+pos;
				}

				if(fd[0] !== undefined){
					key = Object.keys(fd[0])
					for(var j = 0; j < key.length; j++){
						pos =key[j]+"="+fd[0][key[j]]+"&"+pos;
					}
				}
			}else{
				pos = data;
				if(typeof fd[0] === "object"){
					var key = Object.keys(fd[0])
					for(var j = 0; j < key.length; j++){
						pos =key[j]+"="+fd[0][key[j]]+"&"+pos;
					}
				}else if(typeof fd[0] === "string"){
					 pos = fd[0]+pos
				}
			}

			//*
			if (window.XMLHttpRequest){
				xmlhttp=new XMLHttpRequest();
			}else{
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}


			xmlhttp.onreadystatechange=function(){
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					 fd.push(xmlhttp.responseText)
					 fn(fd)
				}
			}
			//xmlhttp.open("POST",url,true);
			//xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			//xmlhttp.send(pos);
			xmlhttp.open("GET",url+"?"+pos,true);
			xmlhttp.send();
			//*/
		},
		ASYNCJSON: function (url, fn) {
			var r;
			var xob = new XMLHttpRequest();
			xob.overrideMimeType("application/json");
			xob.open('GET', url, true);
			xob.onreadystatechange = function () {
				if (xob.readyState == 4 && xob.status == "200") {
					if(typeof fn === "function"){
							 fn(eval ("(" + xob.responseText + ")"))
					}
				}

			};
			xob.send(null);

		 },
		 FILES: function(){
			 var F;
			 this.each(function(el) {
				 F = el.files
			 })
			 return F

		 },
		 sound: function(url){
			var snd = new Audio(url);
						snd.play();
		 },
		 loadSound: function(url){
			var snd = new Audio(url);
						return snd
		 },
		 playSound: function(snd){
			snd.play();
		 },
		 hover: function(ob){
			 if(ob === undefined){
				 ob = {"color1":"#fff", "color2":"#000","hovercolor1":"#fff", "hovercolor2":"#000", hover:[0,9], time:200}
			 }
			 this.each(function(el) {
						var ht = parseInt($j(el).trueStyle("height"));
				var fht = parseInt($j(el).trueStyle("font-size"));

				if (isNaN(ht) == true){
					ht = fht + 7;
				}
				var nht = ht - fht;

						if(ob["color1"] === undefined){
					ob["color1"] = "#ffffff"
				}
				if(ob["color2"] === undefined){
					ob["color2"] = "#000000"
				}
				if(ob["hovercolor1"] === undefined){
					ob["hovercolor1"] = "#ffffff"
				}
				if(ob["hovercolor2"] === undefined){
					ob["hovercolor2"] = "#000000"
				}
				if(ob["hover"] === undefined){
					ob["hover"] = [1]
				}
				if(ob["time"] === undefined){
					ob["time"] = 200
				}
				var col = $j(el).trueStyle("color")
				var n = (nht/2)
				var rad = "3px"
					var shtw = {0:"actual",50:"0.75",100:"0.8"}
				var shtw2 = {0:"0.8",50:"0.75",100:"1"}
				var rntw = {0:"actual",50:(nht/2.2)+"px",100:n+"px"}
				var rntw2 = {0:n+"px",50:(nht/2.2)+"px",100:rad}
				var fctw = {0:col,50:ob["color1"],100:ob["color2"]}
				var fctw2 = {0:ob["color2"],50:ob["color1"],100:col}
				var bctw = {0:ob["hovercolor1"],50:ob["hovercolor1"],100:ob["hovercolor2"]}
				var bctw2 = {0:ob["hovercolor2"],50:ob["hovercolor1"],100:ob["hovercolor1"]}
				var fltw = {0:ob["hovercolor1"],50:ob["hovercolor2"],100:ob["hovercolor1"]}
				var fltw2 = {0:ob["hovercolor1"],50:ob["hovercolor2"],100:ob["hovercolor1"]}
				var tltw = {0:"0",50:"-12",100:"-10"}
				var tltw2 = {0:"-10",50:"-12",100:"0"}
				var trtw = {0:"0",50:"12",100:"10"}
				var trtw2 = {0:"10",50:"12",100:"0"}
				var putw = {0:"0px",50:(nht/-3.2)+"px",100:(nht/-3)+"px"}
				var putw2 = {0:(nht/-3)+"px",50:(nht/-3.2)+"px",100:"0px"}
				var pdtw = {0:"0px",50:(nht/3.2)+"px",100:(nht/3)+"px"}
				var pdtw2 = {0:(nht/3)+"px",50:(nht/3.2)+"px",100:"0px"}
				var pltw = {0:"0px",50:(nht/3.2)+"px",100:(nht/-3)+"px"}
				var pltw2 = {0:(nht/-3)+"px",50:(nht/-3.2)+"px",100:"0px"}
				var prtw = {0:"0px",50:(nht/3.2)+"px",100:(nht/3)+"px"}
				var prtw2 = {0:(nht/3)+"px",50:(nht/3.2)+"px",100:"0px"}
				var vib = {0:"1",50:"0.95",100:"1.05"}
				var vib2 = {0:"1.05",50:"0.95",100:"1"}
				var MTYP = ["size","radius","color","background","background","rotate","rotate","top","top","left","left","size"]
				var TTYP = {0:shtw,1:rntw,2:fctw,3:bctw,4:fltw,5:tltw,6:trtw,7:putw,8:pdtw,9:pltw,10:prtw,11:vib}
				var TTYP2 = {0:shtw2,1:rntw2,2:fctw2,3:bctw2,4:fltw2,5:tltw2,6:trtw2,7:putw2,8:pdtw2,9:pltw2,10:prtw2,11:vib2}

				function mov(e){
						var TYP = [], TWE = []
						for(var ii = 0; ii < ob["hover"].length; ii++){
							TYP.push(MTYP[ob["hover"][ii]])
							TWE.push(TTYP[ob["hover"][ii]])
						}

						//alert(ob["time"])
						//$j(el.parentNode).attribute("data-jlib-buttonid",ran)
								//el2.setAttribute("data-jlib-buttonid","jlib"+$j(el).index()+"_"+ran);
						//alert($j(this).attribute("data-jlib-buttonid"))
								$j(el).animate({type:TYP,time:ob["time"],tween:TWE});
						//alert()
						//$j(this).animate({type:TYP,time:300,tween:TWE});
				 }
				 function mot(){
						var TYP = [], TWE = []
						for(var ii = 0; ii < ob["hover"].length; ii++){
							TYP.push(MTYP[ob["hover"][ii]])
							TWE.push(TTYP2[ob["hover"][ii]])
						}
						$j(el).animate({type:TYP,time:ob["time"],tween:TWE});
						//$j(this).animate({type:TYP,time:300,tween:TWE});

				}
				$j(el).after("mouseenter",function(){
					mov($j(this))
				}).after("mouseleave",function(){
					mot()
				})
			 })

		 },
		 play: function(type,time){
				var cssAnimation = GLOBAL_STYLE;


			var GBC = 0;
			this.each(function(el) {
				var ran = "jlib"+$j().randomized(8);
				ran = ran+GBC
				var cla = "."+ran;
				GBC++
				var height = window.getComputedStyle(el,null).getPropertyValue("height");
				var width = window.getComputedStyle(el,null).getPropertyValue("width");
				var rect = el.getBoundingClientRect();
				var left = rect.left;
				var top = rect.top;
				var opacity = window.getComputedStyle(el,null).getPropertyValue("opacity");
				var windowW = window.getComputedStyle(document.getElementsByTagName("body")[0],null).getPropertyValue("width")
				var left2 = parseInt(windowW) + 50
				var body = document.body, htmlv = document.documentElement;
				var windowH = Math.max( body.scrollHeight, body.offsetHeight, htmlv.clientHeight, htmlv.scrollHeight, htmlv.offsetHeight );
				el.classList.add(ran);
				var cl = el.classList;
				function findKeyframesRule(rule,del,ob){
						var ss = document.styleSheets;
						if(rule == "@keyframes"){
							if($j().browser() == "Chrome" || $j().browser() == "Firefox" || $j().browser() == "Opera"){
								 ss[ss.length - 1].insertRule(del,0)
							}else{
								ss[ss.length - 1].insertRule(del,0)
							}
						}else{
							for (var i = 0; i < ss.length; ++i){
								for (var j = 0; j < ss[i].cssRules.length; ++j){
									if(del == true){
										if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
											ss[i].deleteRule(j)
										}
										if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
											ss[i].deleteRule(j)
										}
									}else if (ss[i].cssRules[j].selectorText == rule && del == false){
											var key = Object.keys(ob)
											for(var k = 0; k < key.length; k++){
												 ss[i].cssRules[j].style[key[k]] = ob[key[k]];
											}
									}else if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
										return ss[i].cssRules[j];
									}else if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
										return ss[i].cssRules[j];
									}
								}
							}
						}
						return null;
				}

				//alert(GLOBAL_STYLE)
				//GLOBAL_STYLE.innerHTML +="@keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}"
				if($j().browser() == "Opera" || $j().browser() == "Safari" || $j().browser() == "Chrome-Android"){
						findKeyframesRule("@keyframes", "@-webkit-keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}");
				}else{
					findKeyframesRule("@keyframes", "@keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}");
				}
				//findKeyframesRule("@keyframes", "@-webkit-keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}");
				setTimeout(function(){
					for(var i = 0; i < cl.length; i++){
						change(cl[i])
					}
				},10)

				function dissapate(el,t){
					if (el.hasChildNodes()) {
						var children = el.childNodes;

						for (var i = 0; i < children.length; i++) {
							if(children[i].nodeName != "#text"){
								if(t == "down"){var op = 1;}else{var op = 0;}
								var K = 0;
								function setop(c){
									 setTimeout(function() {
										 if(t == "down"){op = op - 0.1;}else{op = op + 0.1;}
										 c.style["opacity"] = op
										 if(K == 10){return}else{K++;setop(c)}
									 },time/15)
								}
								setop(children[i])
							}
						}
					}
				}
				/*
				function findKeyframesRule(rule,del){
						var ss = document.styleSheets;
						for (var i = 0; i < ss.length; ++i){
							for (var j = 0; j < ss[i].cssRules.length; ++j){
															if(del == true){
									if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
											ss[i].deleteRule(j)
	//alert(ss[i].cssRules[j].type +"=="+ window.CSSRule.WEBKIT_KEYFRAMES_RULE+" && "+ss[i].cssRules[j].name+"="+rule+" : "+ss[i].cssRules[j].selectorText)
									}
								}else if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
									return ss[i].cssRules[j];
								}else if (ss[i].cssRules[j].type == window.CSSRule.MOZ_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
									//alert(ss[i].cssRules[j])
									return ss[i].cssRules[j];
								}else if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
									//alert(ss[i].cssRules[j])
									return ss[i].cssRules[j];
								}
							}
						}
						return null;
				}
				*/

				function change(anim){
						var keyframes = findKeyframesRule(anim);

						if(keyframes != null){
							if($j().browser() != "IE"){
								 keyframes.deleteRule("0%");
									 keyframes.deleteRule("100%");
							}else{
								keyframes.deleteRule(0);
								keyframes.deleteRule(1);
							}
							var prefix = "";
							if(keyframes.cssText.search("webkit") > 0){
								prefix = "-webkit-";
							}

							function switchType(val,val2){

								if(val2 === undefined){
									//alert(val2+" "+val)
									if(keyframes.cssText.search("webkit") > 0){
										if (keyframes.insertRule) {
													keyframes.insertRule(val);
											} else {
													keyframes.appendRule(val);
											}
									}else{
										keyframes.appendRule(val);
									}
								}else{
									if(keyframes.cssText.search("webkit") > 0){
											if (keyframes.insertRule) {
													keyframes.insertRule(val);
											} else {
													keyframes.appendRule(val);
											}

											if (keyframes.insertRule) {
													keyframes.insertRule(val2);
											} else {
													keyframes.appendRule(val2);
											}
									}else{
										 keyframes.appendRule(val);
										 keyframes.appendRule(val2);
									}
								}
							}

							var ww = parseInt(windowW) + 150; //+ parseInt(width))*-1;
							ww = ww+"px";
							var wh = parseInt(windowH) + 50;

							var wh2 = (-1*wh)+"px";
							var wh = wh+"px"
							var temp = {"left":left,"rightout":ww,"height":height,"width":width,"top":top, "topout":wh}

							GLOBALS[el] = temp;
							if(type == "rotate"){
								switchType("0% { "+prefix+"transform: rotate(0deg); }","100% { "+prefix+"transform: rotate(360deg); }")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);

							}
							if(type == "slideup"){
								el.style.webkitTransformOrigin = "0 0";
								//dissapate(el,"down")


								switchType("0% { "+prefix+"transform: scale(1,1);}","100% { "+prefix+"transform:scale(1,0);}")
								switchType("0%{}");
								switchType("100%{height:0px;}");
								//addToKids()
								setTimeout(function() {
									 el.style.webkitTransformOrigin = "50% 50%";
									 el.style["display"] = "none"
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "slidedown"){
								el.style.webkitTransformOrigin = "0 0";
								el.style["display"] = "block"
								var th;
								if(typeof ob === "object" && "height" in ob){
									th = ob["height"]
								}else{
									th = GLOBALS[el]["height"];
								}
								switchType("0% { "+prefix+"transform: scale(1,0);}","100% { "+prefix+"transform:scale(1,1);}")
								switchType("0%{height:0px;}");
								switchType("100%{height:"+GLOBALS[el]["height"]+"}");
								//addToKids()
								setTimeout(function() {
									 el.style.webkitTransformOrigin = "50% 50%";
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "slideout"){

								switchType("0% { "+prefix+"transform: scale(1,1);}","100% { "+prefix+"transform:scale(0,1);}")
								switchType("0%{}");
								switchType("100%{width:0px;}");
								setTimeout(function() {
									 el.style["display"] = "none"
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "slidein"){
								el.style["display"] = "block"
								switchType("0% { "+prefix+"transform: scale(0,1);}","100% { "+prefix+"transform:scale(1,1);}")
								switchType("0%{width:0px;}");
								switchType("100%{width:"+GLOBALS[el]["width"]+"}");
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "hide"){

								switchType("0% { "+prefix+"transform: scale(1,1);}","100% { "+prefix+"transform:scale(0,0);}")
								switchType("0%{}");
								switchType("100%{height:0px; width:0px;}");
								switchType("100%{opacity:1; opacity:0;}");
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "show"){
								el.style["display"] = "block";
								switchType("0% { "+prefix+"transform: scale(0,0);}","100% { "+prefix+"transform:scale(1,1);}")
								switchType("0%{height:0px; width:0px;}");
								switchType("100%{height:"+GLOBALS[el]["height"]+"; width:"+GLOBALS[el]["width"]+";}");
								switchType("100%{opacity:0; opacity:1;}");
								//addToKids()
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "fadeout"){
								switchType("0%{opacity:1;}");
								switchType("100%{opacity:0;}");
								//addToKids()
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "fadein"){
								el.style["display"] = "block";
								switchType("0%{opacity:0;}");
								switchType("100%{opacity:1;}");
								//addToKids()
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "spiralout"){

								switchType("0% { "+prefix+"transform: rotate(0deg) scale(1,1);}","100% { "+prefix+"transform: rotate(360deg) scale(0,0);}")
								switchType("0%{}");
								switchType("100%{height:0px; width:0px;}");
								//addToKids()
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "spiralin"){
								el.style["display"] = "block";
								switchType("0% { "+prefix+"transform: rotate(0deg) scale(0,0);}","100% { "+prefix+"transform: rotate(-360deg) scale(1,1);}")
								switchType("0%{height:0px; width:0px;}");
								switchType("100%{height:"+GLOBALS[el]["height"]+"; width:"+GLOBALS[el]["width"]+";}");
								//addToKids()
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "opendoor"){
								var par = el.parentNode;
								el.style.webkitTransformOrigin = "0 0";
								var pw = window.getComputedStyle(par,null).getPropertyValue("width")
								par.style.webkitPerspective = pw;
								switchType("0% { "+prefix+"transform: rotateY(0deg);}","100% { "+prefix+"transform: rotateY(-65deg)}")
								setTimeout(function() {
									 el.style.webkitTransformOrigin = "50% 50%";
									 par.style.webkitPerspective = "0em";
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "closedoor"){
								el.style["display"] = "block"
								var par = el.parentNode;
								el.style.webkitTransformOrigin = "0 0";
								var pw = window.getComputedStyle(par,null).getPropertyValue("width")
								par.style.webkitPerspective = pw;
								//var temp = {"height":height, "width":width}
									GLOBALS[el] = temp3;
								switchType("0% { "+prefix+"transform: rotateY(-65deg);}","100% { "+prefix+"transform: rotateY(0deg)}")

								setTimeout(function() {
									 el.style.webkitTransformOrigin = "50% 50%";
									 par.style.webkitPerspective = "0em";
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)

									},time);
							}
							if(type == "slideoutRight"){
								switchType("0% {}","100% { "+prefix+"transform: translate("+ww+",0px);}")

								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "slideinRight"){
								el.style["display"] = "block";

								var rw = parseInt(GLOBALS[el]["left"])+"px"
								switchType("0% {"+prefix+"transform: translate("+ww+",0px);}","100% { "+prefix+"transform: translate("+rw+",0px);}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "slideoutLeft"){
								var tempw = $j(el).trueStyle("margin-left")
								if(tempw == "auto"){
									 tempw = $j().windowWidth()
								}
								tempw = ((parseInt(tempw)*2)+parseInt($j(el).trueStyle("width")))*-1

								switchType("0% {"+prefix+"transform: translate("+temp["left"]+",0px);}","100% { "+prefix+"transform: translate("+tempw+"px,0px);}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "slideinLeft"){
								el.style["display"] = "block";
								var rw = parseInt(GLOBALS[el]["left"]) - (10 * parseInt($j(el).trueStyle("width")))+"px"

								switchType("0% {"+prefix+"transform: translate("+rw+",0px);}","100% { "+prefix+"transform: translate("+GLOBALS[el]["left"]+",0px);}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "slidedownBottom"){

								var wh = parseInt(windowH) + 50;
								wh = wh+"px";
								switchType("0% {}","100% { "+prefix+"transform: translate(0px,"+wh+");}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "slideupBottom"){
								el.style["display"] = "block";
								var rh = parseInt(GLOBALS[el]["top"]) + parseInt(height)+"px;"
								switchType("0% {"+prefix+"transform: translate(0px,"+wh+");}","100% { "+prefix+"transform: translate(0px"+rh+");}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "slideupTop"){
									if($j(el).trueStyle("height") != "auto"){
									var vt = parseInt($j(el).trueStyle("height"))
								}else{
									var vt = 0;
								}
								wh = (parseInt(top) + 50 + vt)*-2;
								wh = wh+"px";
								switchType("0% {}","100% { "+prefix+"transform: translate(0px,"+wh+");}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "slidedownTop"){
								el.style["display"] = "block";
								var rh = parseInt(GLOBALS[el]["top"])+"px"
								var trh = parseInt($j(el).trueStyle("height")) * -10;
								switchType("0% {"+prefix+"transform: translate(0px,"+trh+"px);}","100% { "+prefix+"transform: translate(0px,"+rh+");}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							//===================================================================================================================
							if(type == "spiraloutRight"){
								el.style.webkitTransformOrigin = "50% 50%";
								switchType("0% {"+prefix+"transform:translate("+left+","+top+") rotate(0deg) ;}","100% {"+prefix+"transform:translate("+ww+",0px) rotate(720deg) ;}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "spiralinRight"){
								el.style["display"] = "block";
								var rw = parseInt(GLOBALS[el]["left"])+"px"
								//alert(ww+" "+rw)
								switchType("0% {"+prefix+"transform: translate("+ww+",0px) rotate(-720deg) ;}","100% { "+prefix+"transform: translate("+rw+",0px) rotate(0deg) ;}")

								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "spiraloutLeft"){
								var tempw = $j(el).trueStyle("margin-left")
								if(tempw == "auto"){
									 tempw = $j().windowWidth()
								}
								tempw = ((parseInt(tempw)*2)+parseInt($j(el).trueStyle("width")))*-1

								switchType("0% {"+prefix+"transform: translate("+temp["left"]+",0px) rotate(0deg) ;}","100% { "+prefix+"transform: translate("+tempw+"px,0px) rotate(720deg) ;}")
							setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "spiralinLeft"){
								el.style["display"] = "block";

								var rw = parseInt(GLOBALS[el]["left"]) - (3 * parseInt($j(el).trueStyle("width")))+"px"
								//alert(GLOBALS[el]["left"]+" "+rw)
								var rws = rw.toString()
								//alert(rws)
								switchType("0% {"+prefix+"transform: translate("+rws+",0px) rotate(-720deg) ;}","100% { "+prefix+"transform: translate("+GLOBALS[el]["left"]+",0px) rotate(0deg) ;}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "spiraldownBottom"){
								switchType("0% {"+prefix+"transform: translate(0px, 0px) rotate(0deg) ;}","100% { "+prefix+"transform: translate(0px,"+wh+") rotate(720deg) ;}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "spiralupBottom"){
								el.style["display"] = "block";
								var rh = parseInt(GLOBALS[el]["top"]) + parseInt($j(el).trueStyle("height"))+"px"
								//alert(wh+" "+rh)
								switchType("0% {"+prefix+"transform: translate(0px,"+wh+") rotate(-720deg) ;}","100% { "+prefix+"transform: translate(0px"+rh+") rotate(0deg) ;}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							if(type == "spiralupTop"){
								if($j(el).trueStyle("height") != "auto"){
									var vt = parseInt($j(el).trueStyle("height"))
								}else{
									var vt = 0;
								}
								wh = (parseInt(top) + 50 + vt)*-2;
								wh = wh+"px";
								temp = {"left":left,"rightout":ww,"height":height,"width":width,"top":top, "topout":wh}

									GLOBALS[el] = temp;
								switchType("0% {"+prefix+"transform: translate(0px, 0px) rotate(0deg) ;}","100% { "+prefix+"transform: translate(0px,"+wh+") rotate(720deg) ;}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									 el.style["display"] = "none"
									},time);
							}
							if(type == "spiraldownTop"){
								el.style["display"] = "block";
								var rh = parseInt(GLOBALS[el]["top"]) + parseInt(top)+"px"
								var trh = parseInt($j(el).trueStyle("height")) * -20;

								var temph = $j(el).trueStyle("margin-top")
								//alert($j().windowHeight()+" "+temph)
								if(temph == "auto"){
									 temph = $j().windowHeight()
								}
								temph = $j().windowHeight()*-1.1//((parseInt(temph)*3)+parseInt($j(el).trueStyle("height")))*-2
								switchType("0% {"+prefix+"transform: translate(0px,"+temph+"px) rotate(-720deg) ;}","100% { "+prefix+"transform: translate(0px,"+rh+") rotate(0deg) ;}")
								setTimeout(function() {
									 el.classList.remove(ran);
									 findKeyframesRule(ran,true)
									},time);
							}
							//*/
							//el.style.webkitAnimationName = anim;
							 el.style.webkitAnimation = anim+" "+time+"ms forwards";
							 el.style.mozAnimation = anim+" "+time+"ms forwards";
							 el.style.animation = anim+" "+time+"ms forwards";

							 function addToKids(){
							 var children = el.childNodes;
								 for (var i = 0; i < children.length; i++) {
									 if(children[i].nodeName != "#text"){
										children[i].style.webkitAnimation = anim+" "+time+"ms forwards";
									 }
								 }
							 }
						}

				}
			})


			return this

		 },
		 aniText: function(series,ob,fn){
			this.each(function(el) {
				var stx = $j(el).text()
				var sp = stx.split(" ")
				var SP = []
				var sl = series.length;
				var spl = sp.length;

				var Time = 1500, Delay = 2000, Alt = "alternate", step = 500, invert = false
				if(typeof ob === "object"){
					if("time" in ob){
						Time = ob["time"]
					}
					if("delay" in ob){
						Delay = ob["delay"]
					}
					if("type" in ob){
						Alt = ob["type"]
					}
					if("step" in ob){
						step = ob["step"]
					}
					if("invert" in ob){
						invert = ob["invert"]
					}
				}
				if(invert != true){
					var SER0 = [
								"slideup","slideout","hide","fadeout","spiralout","spiraloutLeft","spiraloutRight","spiraldownBottom","spiralupTop",
								"slideoutLeft","slideoutRight","slideupTop","slidedownBottom"
								]
					var SER1 = [
								"slidedown","slidein","show","fadein","spiralin","spiralinLeft","spiralinRight","spiralupBottom","spiraldownTop",
								"slideinLeft","slideinRight","slidedownTop","slideupBottom"
								]
				}else{
					var SER1 = [
								"slideup","slideout","hide","fadeout","spiralout","spiraloutLeft","spiraloutRight","spiraldownBottom","spiralupTop",
								"slideoutLeft","slideoutRight","slideupTop","slidedownBottom"
								]
					var SER0 = [
								"slidedown","slidein","show","fadein","spiralin","spiralinLeft","spiralinRight","spiralupBottom","spiraldownTop",
								"slideinLeft","slideinRight","slidedownTop","slideupBottom"
								]

				}

				var ran = $j().randomized(8)
				$j(el).embed("").attribute("data-jlib-animate-text",ran)
				var tp = $j(el).trueStyle("font-size")
				if(tp != "auto"){
					 var tpd = parseInt(tp) * (20/70)
				}
				spl = 0;
				for(var i = 0; i < sp.length; i++){
					//alert(sp[i].trim())
					if(sp[i].trim() !== "undefined" && sp[i] != " " && sp[i] != ""){
						 //alert(sp[i].trim())
						 SP.push(sp[i].trim())
						 $j(el).affix("end","<div style='float:left; padding-left:"+tpd+"px; background:#;'>"+sp[i].trim()+"</div>")
						 spl++
					}
				}
				var deg = Math.round((spl / sl));
				//alert(deg+" "+spl)
				if(series !== undefined){
					function Psanin(A,T,ARR){
						var s = 0, ss = 0, SL;
						if(T == 0){
							$j("@data-jlib-animate-text="+ran+"[a]").setStyle("display","none")
							if(A != "alternate"){
								 for(var i = 0; i < sl; i++){
									 for(var j = 0; j < deg; j++){
										if(s < spl){
											 $j("@data-jlib-animate-text="+ran+"["+s+"]").play(ARR[series[i]],T)
											 s++;
										}
									 }
								 }
							}else{
								for(var i = 0; i < deg; i++){
									 for(var j = 0; j < sl; j++){
										if(s < spl){
											 $j("@data-jlib-animate-text="+ran+"["+s+"]").play(ARR[series[j]],T)
											 s++;
										}
									 }
								}

							}
						}else{
							 var i = 0, x = 0;
							 function doa(){
								 if(A == "alternate"){
									if(i == sl){
										 i = 0
									}
									if(s < spl){
										 //alert(s+" "+SP.length)
										 $j("@data-jlib-animate-text="+ran+"["+s+"]").play(ARR[series[i]],T)
										 s++;
									}
									i++
								 }else{
									if(s < spl){
										 $j("@data-jlib-animate-text="+ran+"["+s+"]").play(ARR[series[i]],T)
										 s++;
									}
									if(x == deg){
										 x = 0;
										 i++
									}
									x++;
								 }
							 }
							 $j().loop(doa,step,spl,{id:ran})
						}
					}

					Psanin(Alt,0,SER0)
					setTimeout(function(){
						Psanin(Alt,Time,SER1)
					},Delay)
				}
			})
			return this
		 },
		 hash: function(str){
			var hash = 0, i, chr, len;
			if (str.length == 0) return hash;
			for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
			}
			return hash;
		 },
		 specialChar: function(str,C){
			 var temp;
			 for(var i = 0; i < str.length; i++){
				 for(var j = 0; j < C.length; j++){
							if(str[i] == C[j]){
						var n = str.charCodeAt(i);
						str = str.replace(str[i], "[jl]"+n+"[/jl]");
					}
					 }
			 }
			 return str;
		 },
		 specialCharRevert: function(str){
			 var temp = str.split("[jl]");
			 for(var i = 0; i < temp.length; i++){
				 var temp2 = temp[i].split("[/jl]")
				 for(var j = 0; j < temp2.length; j++){
							if(j == 0){
						str = str.replace("[jl]"+temp2[j]+"[/jl]", String.fromCharCode(temp2[j]));
					}
					 }
			 }
			 return str
		 },
		 textInsert: function(str,ins,num,dir){
			 str = str.toString()
			 if(dir = "left"){
				 var rs = $j().textReverse(str.trim())
				 var sp = rs.split("")
			 }else{
				 str = str.trim()
				 var sp = str.split("")
			 }
			 var ns = "";
			 for(var i = 0; i < sp.length; i++){
				 if(i % num == 0 && i > 0){
						ns = ns+ins+sp[i]
				 }else{
					ns = ns+sp[i]
				 }
			 }
			 s = $j().textReverse(ns)
			 return s
		 },
		 textReverse: function(str){
			 var sp = str.split("")
			 var ns = "";
			 for(var i = sp.length - 1; i >= 0; i--){
				 ns = ns+sp[i]
			 }
			 return ns
		 },
		 textPad: function(str,x,p){
			 if(str.length <= x){
					x = str.length
			 }
			 var res = str.substr(0, x);
			 return res+p;
		 },
		 GET: function(g){
			 var result = "Not found", tmp = [];
			 var val = window.location.search.replace("?", "")
			 //alert(val)
			 var vals = val.split("&")
					 for(var i = 0; i < vals.length; i++){
				tmp = vals[i].split("=");
				if (tmp[0] === g){
					result = decodeURIComponent(tmp[1]);
				}
			 }
			 return result;
		 },
		 randomized: function(comp){
			 function doIt(){
				var s= '';
				if(typeof comp === "string"){
					L = comp.length;
				}else{
					L = comp;
				}
				function char(){
					if(comp != s){
						var n = Math.floor(Math.random()*62);
						if(s.length > 1){
							 if(n < 10) return n; //1-10
							 if(n < 36) return String.fromCharCode(n + 55); //A-Z
							 if(n < 62) return String.fromCharCode(n + 61); //a-z
						}else{
							if(n < 26) return String.fromCharCode(n + 65); //A-Z
								if(n < 32) return String.fromCharCode(n + 59); //a-z
							if(n < 58) return String.fromCharCode(n + 65); //a-z
						}
					}else{
						s = "";
						char()
					}
				}
				while(s.length < L && s !== undefined){
					s += char();
				}
				if(s.search("undefined") < 0 && s !== undefined){
					return s;
				}else{
					return false;
				}
			 }
			 var s = doIt()
			 while(s == false){
				s = doIt()
			 }
			 //alert(s)
			 return s;
		 },
		 shuffle: function(o){
			// This code came from these guys I get how it works but I have never seen anything like it and it would be ridiculous to pass it of as my own
			//+ Jonas Raoni Soares Silva
			//@ http://jsfromhell.com/array/shuffle [v1.0]
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		 },
		 calWidth: function(){
			 var w, ext, tw;
			 this.each(function(el) {
				 w = $j(el).trueStyle("width")
				 ext = "px"
				 if(w.indexOf("px") > 0){
					 ext = "px";
				 }else if(w.indexOf("%") > 0){
					 ext = "%";
				 }
				 w = parseInt(w)
				 //alert($j(el).trueStyle("box-sizing"))
				 var pdl = parseInt($j(el).trueStyle("padding-left"))
				 var pdr = parseInt($j(el).trueStyle("padding-right"))
				 var pdt = parseInt($j(el).trueStyle("padding-top"))
				 var pdb = parseInt($j(el).trueStyle("padding-bottom"))
				 var pd = parseInt($j(el).trueStyle("padding"))
				 var bd = parseInt($j(el).trueStyle("border-width"))
				 var bdl = parseInt($j(el).trueStyle("border-width-left"))
				 var bdr = parseInt($j(el).trueStyle("border-width-right"))
				 var bdt = parseInt($j(el).trueStyle("border-width-top"))
				 var bdb = parseInt($j(el).trueStyle("border-width-bottom"))
				 if($j(el).trueStyle("border-width-left") == null && $j(el).trueStyle("border-width-left") == null && $j(el).trueStyle("border-width") != null){
					 bdl = bd
					 bdr = bd
				 }else{
					 bdl = 0
					 bdr = 0
				 }

				 //alert($j(el).trueStyle("border-width")+" "+pd+"-"+pdl+"-"+pdr+"-"+bdl+"-"+bdr)
				 if($j(el).trueStyle("box-sizing") != "border-box"){
						tw = w+pdl+pdr+bdl+bdr;
				 }else{
					tw = w+pdl+pdr;
				 }
				 //alert(w+" = "+tw)
			 })
			 //alert(w)
			 return(tw+ext)
		 },
		 calHeight: function(){
			 var w, ext, tw;
			 this.each(function(el) {
				 w = $j(el).trueStyle("height")
				 ext = "px"
				 if(w.indexOf("px") > 0){
					 ext = "px";
				 }else if(w.indexOf("%") > 0){
					 ext = "%";
				 }
				 w = parseInt(w)
				 var pdl = parseInt($j(el).trueStyle("padding-left"))
				 var pdr = parseInt($j(el).trueStyle("padding-right"))
				 var pdt = parseInt($j(el).trueStyle("padding-top"))
				 var pdb = parseInt($j(el).trueStyle("padding-bottom"))
				 var pd = parseInt($j(el).trueStyle("padding"))
				 var bd = parseInt($j(el).trueStyle("border-width"))
				 var bdl = parseInt($j(el).trueStyle("border-width-left"))
				 var bdr = parseInt($j(el).trueStyle("border-width-right"))
				 var bdt = parseInt($j(el).trueStyle("border-width-top"))
				 var bdb = parseInt($j(el).trueStyle("border-width-bottom"))
				 if($j(el).trueStyle("border-width-top") ==null && $j(el).trueStyle("border-width-bottom") == null && $j(el).trueStyle("border-width") != null){
					 bdt = bd
					 bdb = bd
				 }else{
					 bdt = 0
					 bdb = 0
				 }
				 if($j(el).trueStyle("box-sizing") != "border-box"){
						tw = w+pdt+pdb+bdt+bdb;
				 }else{
					tw = w+pdt+pdb;
				 }
				 //alert(w+" = "+tw)
			 })
			 return(tw+ext)
		 },
		 IDLE: function(ob,fn){
			 this.each(function(el) {
				var animation = ["size","rotate"], duration = 1500, properties = [{0:"1",100:"0.4"},{0:"0",100:"360"}], close = false, overlay = false
				if(typeof ob === "object"){
					 if("animation" in ob){
						 index = ob["animation"]
					 }
					 if("duration" in ob){
						 animate = ob["duration"]
					 }
					 if("properties" in ob){
						 color = ob["properties"]
					 }
					 if("close" in ob){
						 close = ob["close"]
					 }
					 if("overlay" in ob){
						 overlay = ob["overlay"]
					 }
				}
				function pulse(){
					if(close == false){
						$j(el).animate({pivot:"50% 50%",time:duration,type:animation,tween:properties},function(){
							 pulse()
						})
					}
				}
				if(overlay == true){
					if(close == false){
						 $j(el).OVERLAY({locked:true, time:100})
					}else{
						$j(el).OVERLAY("close")
					}
				}else{
					if(close == false){
						 $j(el).setStyle("display","block")
					}else{
						$j(el).setStyle("display","none")
					}
				}
				setTimeout(function(){
					pulse()
				},500)
			 })
		 },
		 OVERLAY: function(ob,fn){
			 this.each(function(el) {
				var wh = (parseInt(screen.height) - parseInt($j(el).trueStyle("height"))) / 2;
				let secondary, sheight, swidth;
				var index = 10000, color = "0, 0, 0, ", animate = "show", time = 800, opacity = "0.5", locked = false, time2 = 400;
				 if(typeof ob === "string" && ob == "close"){
					$j("@data-jlib-overlayId="+$j(el).id()).play("slideup",time2)
				 }else{
					 if(typeof ob === "object"){
						if("index" in ob){
							index = ob["index"]
						}
						if("animate" in ob){
							animate = ob["animate"]
						}
						if("color" in ob){
							color = $j().hexRgb(ob["color"])
						}
						if("opacity" in ob){
							opacity = ob["opacity"]
						}
						if("time" in ob){
							time = ob["time"]
						}
						if("locked" in ob){
							locked = ob["locked"]
						}
						if("secondary" in ob){
							console.log("test -----")
							secondary = ob.secondary
							var x = document.createElement('div');
							$j(x).setStyle("background-color", "rgba("+secondary.color+secondary.opacity+")")
							$j(x).setStyle("width",secondary.height+"px").setStyle("height",secondary.height+"px")
							.setStyle("margin-left","auto").setStyle("margin-right","auto").setStyle("float","none")
							.setStyle("margin-top",(wh*0.25)+"px").setStyle("position","")
							.attribute("data-jlib-overlaySubId",$j(el).id())                            
						}
					 }
					 
					wh = wh - 50
					var WOHe = {icon:"", hide:false, minimize:false, cancel:false, hover:true, header:false, openAt:"right,top"}
					var Div = document.createElement('div')
					var el2 = document.createElement('div')
					var el0 = document.createElement('div')
					var el1 = document.createElement('div')
					var el3 = document.createElement('div')
					$j(Div).setStyle("width","100%").setStyle("height",$j().windowHeight()+"px")
					$j(Div).setStyle("background-color", "rgba("+color+opacity+")").setStyle("z-index",index)
					$j(Div).setStyle("top","0").setStyle("left","0").setStyle("position","fixed")
					$j(Div).setStyle("display","none").attribute("data-jlib-overlayId",$j(el).id())
					$j(Div).play("hide")
					if(wh < 0){
					wh = 0 
					}
					 
					if(secondary){
						$j(el0).setStyle("width",(0.9*secondary.height)+"px").setStyle("height","35px").setStyle("float","left").setStyle("margin-top","10px")
						.setStyle("margin-left",(0.05*secondary.height)+"px").setStyle("border-bottom","1px solid #e9ecf0").setStyle("text-align","center")
						.setStyle("font-size","20px").setStyle("font-weight","800")

						$j(el1).setStyle("width",(0.9*secondary.height)+"px").setStyle("height","45px").setStyle("float","left").setStyle("margin-top","10px")
						.setStyle("margin-left",(0.05*secondary.height)+"px").setStyle("border","1px solid #f6eaac").setStyle("background","#fcf8e3").setStyle("text-align","center")

						$j(el).setStyle("margin-left",((175/secondary.height)*secondary.height)+"px").setStyle("margin-right",((150/secondary.height)*secondary.height)+"px").setStyle("float","left").setStyle("margin-top","15px").
						setStyle("position","")
						
						$j(el2).setStyle("width",(0.9*secondary.height)+"px").setStyle("float","left").setStyle("margin-top","15px").setStyle("padding","3px 0% 10px 0%")
						.setStyle("margin-left",(0.05*secondary.height)+"px").setStyle("position","").setStyle("background","#e9ecf0")
					}

					
					
					document.getElementsByTagName('body')[0].appendChild(Div);

					if(secondary){
						console.log("sels")
						//$j(x).detach()
						Div.appendChild(x);
						$j(x).enhance({reflect:true, shadow:40, border:10, percent:5, radius:5, rest:"darker+"})
						$j(el).detach()
						x.appendChild(el0);
						console.log("XXXXX",secondary.count)
						x.appendChild(el);
						x.appendChild(el1);
						x.appendChild(el2);
						x.appendChild(el3);

						if("titles" in secondary && secondary.count >= 0){
							$j(el3).setStyle("width","150px").setStyle("height","80px").setStyle("float","left").setStyle("display","none")
							.affix("end","<div style='float:left; width:140px; margin:5px; text-align:center;'>En la app YAPSI, presiona el botón floatante '+' despues 'pagar' y escanear</div>")
							.setStyle("font-size","12px")
							.setStyle("color","#1de9b6").setStyle("background","#0f2028").attribute("data-jlib-tooltip",$j(el).id())
					
							console.log(secondary.titles.length,"-",secondary.titles[0])
							for(var i = 0; i < secondary.titles.length; i++){
								if(i == 0){
									$j(el0).embed(secondary.titles[i]).setStyle("background","url(https://discoinpay-api.firebaseapp.com/discoinPay/IconoDiscoinG.png)")
									.setStyle("background-size","29px 20px").setStyle("background-position","105px 5px").setStyle("float","left")
									.setStyle("background-repeat","no-repeat")
								
									$j(el1).affix("end","<div data-jlib-title='"+i+"' style='color:#c1a514'>"+
									"<a style='text-decoration:underline; color:#337ac1'>Escanea el código QR</a>"+
									" desde tu Smartphone con la app de YAPSI"+
									"</div>")
									$j("@data-jlib-title="+i).setStyle("float","left").setStyle("width","100%").setStyle("padding","3px 0% 0px 0%")
									.setStyle("text-align","center").setStyle("font-size","13px").setStyle("font-weight","100")
									.setStyle("margin","3px 0px 30px 0%").after("mouseenter",function(){
										$j(this).setStyle("display","block")
										console.log('enter')
										$j("@data-jlib-tooltip="+$j(el).id()).POPUP(WOHe,$j(this))
										console.log('enters')
									}).after("mouseleave",function(){
										$j("@data-jlib-tooltip="+$j(el).id()).POPUP("close")
									})
								}
								
								//.affix("end","<div data-jlib-title='"+i+"' style='float:left; width:100%;'>"+secondary.titles[i]+"</div>")
								//$j("@data-jlib-title="+i).setStyle("padding","3px 0% 0px 0%").setStyle("font-size","20px").setStyle("font-weight","800")
								//.setStyle("margin","3px 0px 0px 0%").setStyle("background","#fcf0e3")

								
							}
						}else{
							//$j(el0).embed(secondary.titles[0])
							//$j("@data-jlib-title=0").embed("<a style='text-decoration:underline; color:#337ac1'>Escanea el código QR</a>"+
							//" desde tu Smartphone con la app de YAPSI")
						}
						if("subtitles" in secondary){
							for(var i = 0; i < secondary.subtitles.length; i++){
								$j(el2).affix("end","<div data-jlib-subtitle='s"+i+"'>"+secondary.subtitles[i]+"</div>")
								$j("@data-jlib-subtitle=s"+i).setStyle("float",secondary.subFloat[i]).setStyle("width","96%").setStyle("padding","0px 2% 0px 2%")
								.setStyle("font-size",secondary.subFontSize[i]+"px").setStyle("font-weight",secondary.subFontWeight[i])//.setStyle("background","#22ff22")
								.setStyle("margin","3px 0px 5px 0px")
							}
						}
						
					}else{
						Div.appendChild(el);
					}
					 
					 setTimeout(function(){
						$j(Div).play(animate,time)
						$j(el).play(animate,time)
					 },300)
					 //alert($j(Div).attribute("data-jlib-overlayId"))
					 $j(el).after("click",function(e){
						 $j(el).attribute("data-jlib-clicked","yes")
						 e.stopPropagation();
					 })

					 $j(Div).after("click",function(e){
						 //if($j(el).attribute("data-jlib-clicked") != "yes"){
							 if(locked == false){
								$j(Div).play("hide",time)
							 }
							 fn()
						 //}
					 })
				 }

			 })
			 return this;
		 },
		 POPUP: function(ob,bo,fn){
				//GLOBAL_STYLE.innerHTML +="@-webkit-keyframes "+ran+" {0%{opacity:"+opacity+";}100%{opacity:0;}}"
			if(fn === undefined){
				if($j().function_(bo)){
					fn = bo
				}
			}
			this.each(function(el) {
				//alert(typeof el.parentNode.getAttribute("data-jlib-linker"))
				if(typeof ob === "object"){

					el.style["display"] = "block";
					var bg, drag, icon, title, hidecon, cancelcon, minicon, bdc, header, hover, tween = {};
					var that = this;
					if("background" in ob){
						bdc = ob["background"]; var b = that.colorBrightness(ob["background"],-7); bg = b[1]
						//alert(b)
					}else{
						bdc = $j(el).trueStyle("background");
						var ncol = bdc.substring(bdc.indexOf("(")+1, bdc.indexOf(")")).split(",");
						bdc = ncol
						bdc = $j().rgbHex(bdc,true);
						var b = that.colorBrightness(bdc,-7); bg = b[1]
					}

					if("drag" in ob){ drag = ob["drag"];}else{drag = false}

					if("icon" in ob){ icon = ob["icon"]; }else{icon = false}
					if("title" in ob){ title = ob["title"];}else{title = false}
					if("hide" in ob){ hidecon = ob["hide"];}else{hidecon = true}
					if("cancel" in ob){ cancelcon = ob["cancel"];}else{ cancelcon = true}
					if("minimize" in ob){ minicon = ob["minimize"];}else{minicon = true}
					if("header" in ob){ header = ob["header"];}else{header = true}
					if("hover" in ob){
						if(ob["hover"] == true){
								 hover = "alpha";
						}else{
							hover = ob["hover"];
						}
					}else{
						 hover = "alpha";
					}

					var windowW = window.getComputedStyle(document.getElementsByTagName("body")[0],null).getPropertyValue("width")
					var body = document.body, htmlv = document.documentElement;
					var windowH = screen.height

					function internalDrag(){
						var dragObj = null;	var obj = el.parentNode;obj.style.cursor = "pointer";obj.style.position = "absolute";obj.onmousedown = function(e){
								dragObj = obj; cx = e.pageX; cy = e.pageY;var o = dragObj.getBoundingClientRect();ox = parseInt(o.left);oy = parseInt(o.top);
						}
						document.onmouseup = function(e){
							dragObj = null;
						};
						var cx;var cy;var ox;var oy;
						document.onmousemove = function(e){
							var x = e.pageX - (cx - ox)// + dragObj.clientWidth;
							var y = e.pageY - (cy - oy)// + dragObj.clientWidth;
							if(dragObj == null){
								return;
							}
							dragObj.style.left = x +"px";
							dragObj.style.top= y +"px";
							var gob = {"DivL":x+"px","DivT":y+"px"}
							GLOBALS[el.parentNode.getAttribute("data-jlib-linker")] = gob;
						};
					}
					//alert(el.parentNode.tagName+" == "+el.parentNode.getAttribute("data-jlib-linker")+" == "+el.getAttribute("data-jlib-linker"))
					if(el.parentNode.getAttribute("data-jlib-linker") == null && el.getAttribute("data-jlib-linker") == null){

							/*alert(window.getComputedStyle(el,null).getPropertyValue("padding"))
							el.style["display"] = "block";
							alert(window.getComputedStyle(el,null).getPropertyValue("padding"))
							*/
							var Div = document.createElement('div');
							var hDiv = document.createElement('div');
							var bDiv = document.createElement('div');
							var htDiv = document.createElement('div');
							var icDiv = document.createElement('div');
							var wcDiv = document.createElement('div');
							var hide_icon = document.createElement('div');
							var img_min = document.createElement('div');
							var img_hide = document.createElement('div');
							var img_kill = document.createElement('div');
							var img_rest = document.createElement('div');
							//===========add classes====================
							Div.className = 'block';
							Div.style["z-index"] = '10006';
							hDiv.className = 'hblock radius-top-5';
							bDiv.className = 'bblock';
							htDiv.className = 'htblock';
							$j(htDiv).attribute("data-jlib-window-headerId",$j(el).id())
							icDiv.className = 'icblock';
							wcDiv.className = 'window_controls';
							img_min.className = 'clickable min';
							img_hide.className = 'clickable hide';
							img_kill.className = 'clickable kill';
							img_rest.className = 'clickable res';
							hide_icon.className = 'hide_icon radius-5';
							//===========add styles========================
							el.style.borderRadius = "0px 0px 5px 5px";
							Div.style.borderRadius = "5px 5px 5px 5px";
							Div.style.borderColor = bg;
							if(header == true){
									hDiv.style.borderColor = bg;
								hDiv.style["box-sizing"] = "border-box"
								hDiv.style["-moz-box-sizing"] = "border-box"
								hDiv.style["-webkit-box-sizing"] = "border-box"
								hDiv.style["border-bottom-style"] = "solid"
								hDiv.style["border-bottom-width"] = "thin"
								hDiv.style.height = "25px";
							}else{
								el.style.borderRadius = "5px 5px 5px 5px";
								hDiv.style.height = "10px";
							}

							Div.style.borderStyle = "solid";
							Div.style.borderWidth = "1px";


							//$j(Div).setStyle("background",ob["background"]).enhance({reflect:false, shadow:"light-", rest:"darker-", percent:40,radius:10})
							//Div.style.boxShadow = "5px 5px 6px -1px #888888";
							hide_icon.style["background"] = "#888888"//that.gradient(that.colorBrightness(bdc,50),true,false);
							hide_icon.style.boxShadow = "5px 5px 6px -1px #888888";

							//hDiv.style.background = "#666";

							img_min.style.float = "right";
							img_min.style.margin = "3px";
							img_min.src = "images/minimize.png";
							img_min.width = "10";
							img_min.height = "10";
							img_hide.style.float = "right";
							img_hide.style.margin = "3px";
							img_hide.src = "images/hide.png";
							img_hide.width = "10";
							img_hide.height = "10";
							img_kill.style.float = "right";
							img_kill.style.margin = "3px";
							img_kill.src = "images/kill.png";
							img_kill.width = "10";
							img_kill.height = "10";
							img_rest.style.float = "right";
							img_rest.style.margin = "3px";
							img_rest.src = "images/restore.png";
							img_rest.width = "10";
							img_rest.height = "10";
							img_rest.style.display = "none";
							//=============================GLOBAL VALUES
							if(header == true){
								 Div.style["height"] = el.clientHeight+28+"px"
							}else{
							 Div.style["height"] = el.clientHeight+17.5+"px"
							}
							//alert(el.clientWidth+" "+$j(el).trueStyle("width"))
							Div.style["width"] = el.clientWidth+"px"

							var doch = htmlv.clientHeight - 60, dochh = doch;
							var wnW = (parseInt(windowW)/2) - parseInt(el.clientWidth)/2;
							var wnH = (parseInt(htmlv.clientHeight)/2) - parseInt(el.clientHeight+28)/2;
							var ran = this.randomized(8);
							if("openAt" in ob){
								if(typeof ob["openAt"] === "string"){
										 var posi = ob["openAt"].split(",")
									if(typeof ob["openAt"] === "string" && typeof bo !== "object"){
										wnW = parseInt(posi[0])
										wnH = parseInt(posi[1])
									}else if(typeof ob["openAt"] === "string" && typeof bo === "object"){
										var re = bo.borders()
										wnH = re.top+parseFloat(bo.trueStyle("height")) - 20
										wnW = re.left+parseFloat(bo.trueStyle("width")) - 20
										wwnW = wnW + parseInt($j(el).trueStyle("width"))
										wwnH = wnH + parseInt($j(el).trueStyle("height"))
										if(wwnW > parseInt($j("body").trueStyle("width"))){
											 wnW = re.left-(parseInt($j(el).trueStyle("width"))) + 20
										}
										if(wwnH > htmlv.clientHeight){
											 wnH = re.top-(parseInt($j(el).calHeight())) + 20
										}

										if(posi[1] == "bottom"){
											wnH = re.top+parseFloat(bo.calHeight())
										}
										if(posi[1] == "top"){
											wnH = re.top-parseFloat($j(el).calHeight())-parseFloat(bo.calHeight())
										}
										if(posi[0] == "left"){
											wnW = re.left-parseFloat($j(el).calWidth())
										}
										if(posi[0] == "right"){
											wnW = re.left+parseFloat(bo.calWidth())
										}
										if(parseInt(posi[1]) == 0){
											wnH = re.top
										}
										if(parseInt(posi[0]) == 0){
											wnW = re.left
										}

									}
								}
							}
							$j(el).attribute("data-jlib-widnowOpenAtX",wnW)
							$j(el).attribute("data-jlib-widnowOpenAtY",wnH)
							$j(Div).attribute("data-jlib-linker", ran);
							$j(el).attribute("data-jlib-linker", ran);
							//el.parentNode.setAttribute("data-jlib-linker", ran);
							//Div.setAttribute("data-jlib-linker", ran);

							if(ob["hover"] != true){
								Div.style.top = wnH+"px";
								Div.style.left = wnW+"px";
							}else{

								var re = bo.borders()
								wnH = re.top+parseFloat(bo.trueStyle("height")) - 20
								wnW = re.left+parseFloat(bo.trueStyle("width")) - 20
								wwnW = wnW + parseInt($j(el).trueStyle("width"))
								wwnH = wnH + parseInt($j(el).trueStyle("height"))
								if(wwnW > parseInt($j("body").trueStyle("width"))){
								 wnW = re.left-(parseInt($j(el).trueStyle("width"))) + 20
								 if(wnW < 0){
									 wnW = 50
								 }
								}
								if(wwnH > htmlv.clientHeight){
								 wnH = re.top-(parseInt($j(el).trueStyle("height"))) + 20
								 if(wnH < 0){
									 wnH = 20
								 }
								}

								bo.attribute("data-jlib-hoverid2",ran).attribute("data-jlib-hover","visited")
								//bo.animate({type:"alpha", time:200, tween:{0:"actual",100:0.5}})
								Div.style.top = wnH+"px";
								Div.style.left = wnW+"px";
								//alert(wnW+" "+wnH+" "+wwnH+" "+htmlv.clientHeight)
							}

							hide_icon.style.top = (htmlv.clientHeight - 40)+"px";
							hide_icon.style.left = "5px";
							var ln = parseInt(document.getElementsByClassName("hide_icon").length);
							var dis = (55 * ln) + 5;
							//diss = dis;

							hide_icon.style.left = dis + "px";
							var gob = {"DivH":el.clientHeight+28+"px","DivW":el.clientWidth+"px","DivL":wnW+"px","DivT":wnH+"px", DISS:dis,DOCH:doch}
							GLOBALS[ran] = gob;
							//alert($j(el).attribute("data-jlib-linker")+GLOBALS[ran]["DivH"])
							//============ minimal functionality =============
							var dh = Div.style.height;
							img_min.onclick=function(){
								img_min.style.display = "none";
								img_rest.style.display = "block";
								var gob = {"DivH":el.clientHeight+28+"px","DivW":el.clientWidth+"px"}
								GLOBALS[ran] = gob;
								var oh = {0:el.clientHeight+28+"px",100:(el.clientHeight+28)/2+"px"}
								var ow = {0:el.clientWidth+"px",100:(el.clientWidth)/2+"px"}
								$j(el.parentNode).animate({type:["height","width"],time:700,tween:[oh,ow]})
								setTimeout(function(){

								},700)
							}
							img_rest.onclick=function(){
								el.parentNode.style.display = "block";
								img_min.style.display = "block";
								img_rest.style.display = "none";
								var oh = {0:(el.clientHeight+28)/2+"px",100:(el.clientHeight+28)+"px"}
								var ow = {0:(el.clientWidth)/2+"px",100:(el.clientWidth)+"px"}
								$j(el.parentNode).animate({type:["height","width"],time:500,tween:[oh,ow]})
							}
							img_kill.onclick=function(){
								var os = {0:"actual",100:"0px"}
								var gob = {"DivH":$j(el.parentNode).trueStyle("height"),"DivW":$j(el.parentNode).trueStyle("width")}
								GLOBALS[ran] = gob;
								$j(el.parentNode).animate({type:"size",time:400,tween:os})
								setTimeout(function(){
									 el.parentNode.style.display = "none";
								},350)
								if("closeevent" in ob){
									if(typeof ob["closeevent"] === "function"){
										var f = ob["closeevent"];
										f()
									}
								}
							}
							img_hide.onclick=function(){
								var rect = el.parentNode.getBoundingClientRect();
								var disl = (parseInt(rect.left) - dis) * -1;
								//alert(rect.left+" "+disl+" "+doch)
								//var om = {0:"actual",100:dis+"px,"+doch+"px"}
								var om = {0:"actual",100:disl+"px,"+doch+"px"}
								var os = {0:"actual",100:"40px"}
								var gob = {"DivH":$j(el.parentNode).trueStyle("height"),"DivW":$j(el.parentNode).trueStyle("width")}
								GLOBALS[ran] = gob;
								$j(el.parentNode).animate({type:["moveTo","size","width"],time:500,tween:[om,os,os]})
								setTimeout(function(){
								 hide_icon.style.display = "block";
								 //alert($j(hide_icon).trueStyle("top"))
								 //alert( body.scrollHeight+", "+body.offsetHeight+", "+htmlv.clientHeight+", "+htmlv.scrollHeight+", "+htmlv.offsetHeight )
								 el.parentNode.style.display = "none";
								},400)
							}
							hide_icon.onclick=function(){
								var rect = el.parentNode.getBoundingClientRect();
								var disl = (parseInt(rect.left) - dis) * -1;
								var wnw = (parseInt(windowW)/2) - parseInt(GLOBALS[el.parentNode.getAttribute("data-jlib-linker")]["DivW"])/2;
								var wnh = (parseInt(htmlv.clientHeight)/2) - parseInt(GLOBALS[el.parentNode.getAttribute("data-jlib-linker")]["DivH"])/2;
								var om = {0:dis+"px,"+htmlv.clientHeight+"px",100:wnw+"px,"+wnh+"px"}
								var oh = {0:"40px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"]}
								var ow = {0:"40px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"]}
								$j(el.parentNode).animate({type:["moveTo","height","width"],time:500,tween:[om,oh,ow]})
								setTimeout(function(){
								 el.parentNode.style.display = "block";
								},50)

								hide_icon.style.display = "none";
								var gob = {"DivL":wnw+"px","DivT":wnh+"px"}
								GLOBALS[$j(el).attribute("data-jlib-linker")] = gob;
								img_min.style.display = "block";
								img_rest.style.display = "none";
								//alert($j(hide_icon).trueStyle("background"))
							}
							//alert(bcords["cordX"]+" "+pcords["cordX"])
							//============================Adding elements======//

							document.getElementsByTagName('body')[0].appendChild(Div);
							document.getElementsByTagName('body')[0].appendChild(hide_icon);

							Div.appendChild(hDiv);
							Div.appendChild(el);
							hDiv.appendChild(icDiv);
							if(header == true){
								 hDiv.appendChild(htDiv);
							 hDiv.appendChild(wcDiv);
							}
							$j(el).setStyle("width","100%");
							//alert($j(Div).trueStyle("width")+" "+$j(Div).trueStyle("width"))
							//$j(el.parentNode).attribute("data-jlib-linker", ran);
							$j(Div).setStyle("background",bdc).enhance({reflect:false, shadow:"spread2d", rest:"darker-", percent:30,radius:10})
							$j(hide_icon).setStyle("background",bdc).enhance({reflect:false, shadow:false, rest:"darker-", percent:20, border:40})
							$j(hide_icon).setStyle("cursor","pointer").setStyle("width","53px").setStyle("height","53px")
							if(header == true){
								$j(hDiv).setStyle("background",bdc).enhance({reflect:false, shadow:false, rest:"darker+", percent:20})
							}
							//*
							$j(el.parentNode).after("click", function(event){
							 event.stopPropagation();
							})
							$j(Div).after("click", function(event){
							 event.stopPropagation();
							})
							//*/
							var clic = false;
							if(!("closeevent" in ob) && hidecon != true && minicon != true){
								//*
								var os = {0:"actual",100:"0px"}
								gob = {"DivH":$j(el.parentNode).trueStyle("height"),"DivW":$j(el.parentNode).trueStyle("width"),DISS:dis,DOCH:doch}
								GLOBALS[$j(el).attribute("data-jlib-linker")] = gob;

								$j("html").after("click",function(){
									if(clic == true){
										$j(el.parentNode).animate({type:"size",time:300,tween:os})
										setTimeout(function(){
											 el.parentNode.style.display = "none";
										},250)
										$j(el).attribute("data-jlib-widnowOpen",0)
										fn()
									}
								})
								//*/

								setTimeout(function(){
									clic = true;
								},500)
							}
							el.parentNode.style.display = "none";
							$j(Div).play("slidedownBottom",50)
							setTimeout(function(){
								$j(Div).play("show",300)
								setTimeout(function(){
									$j(Div).setStyle("display","block");
								},100)
							},100)


							if(cancelcon == true){
							 wcDiv.appendChild(img_kill);
							}
							if(minicon == true){
							 wcDiv.appendChild(img_min);
							 wcDiv.appendChild(img_rest);
							}
							if(hidecon == true){
							 wcDiv.appendChild(img_hide);
							}

							if(title != false && header == true) {
								//alert(title)
								var x = parseInt($j(Div).trueStyle("width")) - 100;
								htDiv.innerHTML = title;
								var xx = title.length * 6;
								var rx = parseInt(x/6);
								var newTitle = title.substr(0, rx)
								//alert(GLOBALS["DivW"]+" : "+x+" < "+xx+" / "+rx+" / "+$j(hDiv).trueStyle("width")+ " : "+title+" : "+newTitle)
								if(xx > x){
								 htDiv.innerHTML = newTitle+"..";
								}

							}

							if(icon != false && header == true){
								var iconz = document.createElement('img');
								var big_icon = document.createElement('img');
								iconz.width = "20"; iconz.height = "20"; iconz.src = icon; big_icon.width = "40"; big_icon.height = "40"; big_icon.src = icon;
								icDiv.appendChild(iconz);
								hide_icon.appendChild(big_icon);
								//return;
							};

							//

							if(drag == true){
							 internalDrag()
							}


					}else{
							var clic = true;
						if(drag == true){
							 internalDrag()
						}
						if(title != false) {
								var x = parseInt($j(el).trueStyle("width")) - 100;
								$j("data-jlib-window-headerId="+$j(el).id()).embed(title)
								var xx = title.length * 6;
								var rx = parseInt(x/6);
								var newTitle = title.substr(0, rx)
								if(xx > x){
								 $j("data-jlib-window-headerId="+$j(el).id()).embed(newTitle+"..")
								}

						}
						function oat(){

							var wnw = $j(el).attribute("data-jlib-widnowOpenAtX")
							var wnh = $j(el).attribute("data-jlib-widnowOpenAtY")
							var dis = parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DISS"])
							var doch = parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DOCH"])
							var om = {0:dis+"px,"+doch+"px",100:wnw+"px,"+wnh+"px"}
							var oh = {0:"40px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"]}
							var ow = {0:"40px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"]}
							$j(el.parentNode).animate({type:["moveTo","height","width"],time:500,tween:[om,oh,ow]})
							setTimeout(function(){
								 el.parentNode.style.display = "block";

							},100)
						}
						if(typeof ob == "object"){
								if(el.parentNode.getAttribute("data-jlib-windowState") != "button_close"){
									if(ob["hover"] != true){

										oat()

									}else{
										var that = this;
										var os = {0:"actual",100:"0px"}
										var gob = {"DivH":$j(el.parentNode).trueStyle("height"),"DivW":$j(el.parentNode).trueStyle("width")}
										GLOBALS[$j(el).attribute("data-jlib-linker")] = gob;
										$j(el.parentNode).animate({type:"size",time:100,tween:os})
										setTimeout(function(){
											 el.parentNode.style.display = "none";
										},150)
										//alert()
										setTimeout(function(){

											var re = bo.borders()
											//alert(re.left+" "+$j("body").trueStyle("width")+" "+bo.trueStyle("width"))
											wnH = re.top+parseFloat(bo.trueStyle("height")) - 20
											wnW = re.left+parseFloat(bo.trueStyle("width")) - 20
											wwnW = wnW + parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"])
											wwnH = wnH + parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"])
											//alert(wwnW+" "+$j("body").trueStyle("width")+" "+$j(el).trueStyle("width"))
											if(wwnW > parseInt($j("body").trueStyle("width"))){
											 wnW = re.left-(parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"])) + 20
											 if(wnW < 0){
												 wnW = 50;
											 }
											}
											if(wwnH > htmlv.clientHeight){
											 wnH = re.top-(parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"])) + 20
											 if(wnH < 0){
												 wnH = 20
											 }
											}
											//alert(wnH+" "+wnW)
											el.parentNode.style["top"] = wnH+"px";
											el.parentNode.style["left"] = wnW+"px";
											//alert(8)
											//alert(bo.attribute("data-jlib-hover"))
											//$j("@data-jlib-hover2=visited").animate({type:"alpha", time:200, tween:{0:"actual",100:1}})
											var rann = that.randomized(7);
											//alert(8)
											//bo.animate({type:"alpha", time:200, tween:{0:0.5,100:1}})
											if(bo.attribute("data-jlib-hoverid2") == null){
											 bo.attribute("data-jlib-hoverid2",rann).attribute("data-jlib-hover","visited")
											}
											setTimeout(function(){
											 el.parentNode.style.display = "block";
											},100)
											//alert($j(el).attribute("data-jlib-linker")+GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"])
											var oh = {0:"0px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"]}
											var ow = {0:"0px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"]}
											$j(el.parentNode).animate({type:["height","width"],time:200,tween:[oh,ow]})
											//alert(0)
											$j(el).attribute("data-jlib-widnowOpen",1)
										},200)
									 }
								}else{
									if(ob["hover"] != true){
										if("openAt" in ob){
											oat()
										}else{
											var wnw = (parseInt(windowW)/2) - parseInt(GLOBALS[el.parentNode.getAttribute("data-jlib-linker")]["DivW"])/2;
											var wnh = (parseInt(windowH - 60)/2) - parseInt(GLOBALS[el.parentNode.getAttribute("data-jlib-linker")]["DivH"])/2;
											var dis = parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DISS"])
											var doch = parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DOCH"])
											if(isNaN(dis)){
											 //dis = 0
											}
											if(isNaN(doch)){
											 //doch = 0
											}
											//alert(dis+"px,"+doch+"px, "+wnw+"px, "+wnh+"px")
											var om = {0:dis+"px,"+doch+"px",100:wnw+"px,"+wnh+"px"}
											var oh = {0:"40px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"]}
											var ow = {0:"40px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"]}
											$j(el.parentNode).animate({type:["moveTo","height","width"],time:500,tween:[om,oh,ow]})
											setTimeout(function(){
											 el.parentNode.style.display = "block";
											},100)
											$j(el).attribute("data-jlib-widnowOpen",1)
										}
										//alert()
									}else{
										var re = bo.borders()
										wnH = re.top+parseFloat(bo.trueStyle("height")) - 20
										wnW = re.left+parseFloat(bo.trueStyle("width")) - 20
										wwnW = wnW + parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"])
										wwnH = wnH + parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"])
										if(wwnW > parseInt($j("body").trueStyle("width"))){
										 wnW = re.left-(parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"])) + 20
										 if(wnW < 0){
											 wnW = 50;
										 }
										}
										if(wwnH > htmlv.clientHeight){
										 wnH = re.top-(parseInt(GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"])) + 20
										 if(wnH < 0){
											 wnH = 20
										 }
										}

										el.parentNode.style["top"] = wnH+"px";
										el.parentNode.style["left"] = wnW+"px";

										var rann = this.randomized(7);
										if(bo.attribute("data-jlib-hoverid2") == null){
										 bo.attribute("data-jlib-hoverid2",rann).attribute("data-jlib-hover","visited")

										}

										setTimeout(function(){
										 el.parentNode.style.display = "block";
										},100)
										//alert($j(el).attribute("data-jlib-linker")+GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"])
										var oh = {0:"0px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivH"]}
										var ow = {0:"0px",100:GLOBALS[$j(el).attribute("data-jlib-linker")]["DivW"]}
										$j(el.parentNode).animate({type:["height","width"],time:200,tween:[oh,ow]})
										//alert(0)
										$j(el).attribute("data-jlib-widnowOpen",1)
									}
								}
						}

					}
				}else if(typeof ob === "string"){
					if(ob == "close"){
						if(bo !== undefined){
							 bo.animate({type:"alpha", time:200, tween:{0:"actual",100:1}})
						}
						if(el.parentNode.tagName != "BODY"){
							el.parentNode.setAttribute("data-jlib-windowState","button_close")
							var os = {0:"actual",100:"0px"}
							//alert($j(el.parentNode).trueStyle("height"))
							var gob = {"DivH":$j(el.parentNode).trueStyle("height"),"DivW":$j(el.parentNode).trueStyle("width")}
							GLOBALS[$j(el).attribute("data-jlib-linker")] = gob;
							$j(el.parentNode).animate({type:"size",time:300,tween:os})
							setTimeout(function(){
								 el.parentNode.style.display = "none";
							},250)
						}
						$j(el).attribute("data-jlib-widnowOpen",0)
					}
				}
			})
			return this;

		 },
		 animate: function(ob,fn){
				var cssAnimation = GLOBAL_STYLE;

			var alt;
			this.each(function(el) {
				var ran = "jlib"+this.randomized(9);
					var cla = "."+ran;
				if(window.getComputedStyle(el,null).getPropertyValue("display") == "none"){
					 el.style["display"] = "block";
					 alt = true;
				}
				var color = el.style.color;
				var background = el.style.background;
				var radius = window.getComputedStyle(el,null).getPropertyValue("border-radius");
				var height = window.getComputedStyle(el,null).getPropertyValue("height");
				var width = window.getComputedStyle(el,null).getPropertyValue("width");
				var rect = el.getBoundingClientRect();
				var lefti = rect.left;
				var topi = rect.top;
				var left = window.getComputedStyle(el,null).getPropertyValue("left");
				var top = window.getComputedStyle(el,null).getPropertyValue("top");
				var opacity = window.getComputedStyle(el,null).getPropertyValue("opacity");

				//alert(left+" - "+radius+" - "+top)



				function findKeyframesRule(rule,del,ob){
						var ss = document.styleSheets;
						if(rule == "@keyframes"){

							if("insertRule" in ss[0]) {
								//ss[ss.length - 1].insertRule(del,0)
							}else if("addRule" in ss[0]) {
								//ss[ss.length - 1].addRule(del,0)
							}
							//alert(ss[ss.length - 1].cssRules[j].type)
							ss[ss.length - 1].insertRule(del,0)
							for (var j = 0; j < ss[ss.length - 1].cssRules.length; ++j){
							//alert(ss[ss.length - 1].cssRules[j].type+" : "+window.CSSRule.WEBKIT_KEYFRAMES_RULE)
//alert(ss[ss.length - 1].cssRules[j].name+" | "+ss[ss.length - 1].cssRules[ss.length - 1].selectorText+" | "+ss[ss.length - 1].cssRules[j].cssText)
							}
						}else{
							for (var i = 0; i < ss.length; ++i){
								for (var j = 0; j < ss[i].cssRules.length; ++j){

									if(del == true){
										if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
											ss[i].deleteRule(j)
										}
										if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
											ss[i].deleteRule(j)

										}
									}else if (ss[i].cssRules[j].selectorText == rule && del == false){
											var key = Object.keys(ob)
											for(var k = 0; k < key.length; k++){
												 ss[i].cssRules[j].style[key[k]] = ob[key[k]];
											}
									}else if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
										//alert(ss[i].cssRules[j].cssText)
										return ss[i].cssRules[j];
									}else if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule){
										//alert(ss[i].cssRules[j].cssText)
										return ss[i].cssRules[j];
									}
								}
							}
						}
						return null;
				}

				var loop, dir, curve;
				if("loop" in ob){
					 loop = ob["loop"]
				}else{
					loop = 1;
				}

				if("reverse" in ob){
					 dir = "reverse"
				}else if("alternate" in ob){
					 dir = "alternate"
				}else{
					dir = "normal"
				}

				if("curve" in ob){
					 curve = ob["curve"]
				}else{
					curve = "linear"
				}

				if("time" in ob){
					 var time = ob["time"]
				}
				if("pivot" in ob){
					 var pivot = ob["pivot"]
				}else{
					 var pivot = "50% 50%";
				}

				if("refresh" in ob){
					 var refresh = ob["refresh"]
				}

				//alert(GLOBAL_STYLE)
				//GLOBAL_STYLE.innerHTML +="@keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}"
				if($j().browser() == "Opera" || $j().browser() == "Safari"  || $j().browser() == "Chrome-Android" ){
						findKeyframesRule("@keyframes", "@-webkit-keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}");
				}else{

					findKeyframesRule("@keyframes", "@keyframes "+ran+" {0%{opacity:1}100%{opacity:1}}");

				}

				el.classList.add(ran);
				//el.classList.add(rano);
				var cl = el.classList;
				//alert(window.CSSRule.WEBKIT_KEYFRAMES_RULE)
				//cssAnimation.innerHTML +="@-webkit-keyframes "+ran+" {0%{opacity:"+opacity+";}100%{opacity:1;}}"
								//cssAnimation.innerHTML +="@keyframes "+rano+" {0%{}100%{}}"
				//document.getElementsByTagName("head")[0].appendChild(cssAnimation);

				setTimeout(function(){
					for(var i = 0; i < cl.length; i++){
						var n = cl[i].indexOf("jlib");

						if(n == 0 && cl[i] == ran){
							 change(cl[i])
						}else if(n == 0){
							//alert(n+" "+cl[i])
							//findKeyframesRule(cl[i],true)
						}
					}
				},10)

				function change(anim){
						var Ttypes = {"rotate":"t","rotateX":"t","rotateY":"t","left":"t","top":"t","height":"t","width":"t","size":"t","scew":"t","opacity":"n","radius":"n","color":"n","background":"n","position":"n","moveTo":"n",gradient:"n"}
						var keyframes = findKeyframesRule(anim);
						//alert(keyframes)
						var type;
						var TS = [""], AS = [];
						var NS = [""];
						var Ct = [""]
						if(keyframes != null){
							if($j().browser() != "IE"){
								 keyframes.deleteRule("0%");
									 keyframes.deleteRule("100%");
							}else{
								keyframes.deleteRule(0);
								keyframes.deleteRule(1);
							}
							var prefix = "";
							if(keyframes.cssText.search("webkit") > 0){
								prefix = "-webkit-";
							}
							//
							//alert(keyframes.cssText)
							function switchType(val){
								if(keyframes.cssText.search("webkit") > 0){
									 if (keyframes.insertRule) {
										keyframes.insertRule(val);
									 } else {
										keyframes.appendRule(val);
									 }
								}else{
									 //alert(val)
									 keyframes.appendRule(val);
								}
							}

							for(var ti = 0; ti <= 100; ti++){
								Ct[ti] = 0;
							}

							if("type" in ob){
								 var lent;
								 if(typeof ob["type"] === "object"){
									 lent = ob["type"].length;
								 }else{
									lent = 1;
								 }
								 function value(tp,twn){
									 //alert("okk")
									 var tw;
									 var twa = [];
									 //alert("okm")
										if(tp == "rotate"){
										el.style.webkitTransformOrigin = pivot; el.style.TransformOrigin = pivot;
										if(twn == "actual"){tw = 0}else{tw = twn }
										return " rotate("+tw+"deg)";
										}else if(tp == "rotateX"){
											el.style.webkitTransformOrigin = pivot; el.style.TransformOrigin = pivot;
										if(twn == "actual"){ tw = 0}else{tw = twn }
										return " rotateX("+tw+"deg)";
										}else if(tp == "rotateY"){
											el.style.webkitTransformOrigin = pivot; el.style.TransformOrigin = pivot;
										if(twn == "actual"){ tw = 0}else{tw = twn }
										return " rotateY("+tw+"deg)";
										}else if(tp == "alpha" || tp == "opacity"){
										if(twn == "actual"){ tw = opacity}else{tw = twn }
										return " opacity:"+tw+"";
										}else if(tp == "color"){
										if(twn == "actual"){ tw = color}else{tw = twn }
										return " color:"+tw+"";
										}else if(tp == "background"){
											var l = $j(el).trueStyle("background-color")
										if(twn == "actual"){ tw = l}else{tw = twn }

										return " background:"+tw+"";
										}else if(tp == "position"){
											var l = $j(el).trueStyle("background-position")
										if(twn == "actual"){ tw = l}else{tw = twn }
										return " background-position:"+tw+"";
										}else if(tp == "gradient"){
										if(twn == "actual"){ tw = ""}else{tw = twn; }
										//alert("linear-gradient("+tw+")")
										return " linear-gradient("+tw+")";
										}else if(tp == "radius"){
										if(twn == "actual"){ tw = radius}else{tw = twn }
										//alert(tw)
										return " border-radius:"+tw+"";
										}else if(tp == "height"){
										el.style.webkitTransformOrigin = pivot; el.style.TransformOrigin = pivot;
										if(twn.search("px") >= 0){
											 if(twn == "actual"){ tw = 1}else{tw = parseInt(twn)/parseInt($j(el).trueStyle("height"));}
										}else{
											if(twn == "actual"){ tw = 1}else{tw = twn}
										}
										return " scaleY("+tw+")";
										//*/
										}else if(tp == "width"){
										el.style.webkitTransformOrigin = pivot; el.style.TransformOrigin = pivot;
										if(twn.search("px") >= 0){
											 if(twn == "actual"){ tw = 1}else{tw = parseInt(twn)/parseInt($j(el).trueStyle("width")); }
										}else{
											if(twn == "actual"){ tw = 1}else{tw = twn}
										}
										return " scaleX("+tw+")";
										//*/
										}else if(tp == "size"){
										el.style.webkitTransformOrigin = pivot; el.style.TransformOrigin = pivot;
										if(twn.search("px") >= 0){
											if(parseInt(width) > parseInt(height)){
												var dv = parseInt(height);
											}else if(parseInt(width) <= parseInt(height)){
												var dv = parseInt(height);
											}
											if(twn == "actual"){ tw = 1}else{tw = parseInt(twn)/parseInt($j(el).trueStyle("height")) }
											if(dv == 50 || dv == 30){
											//alert(twn+":"+dv+":"+tw)
											}
										}else{
											if(twn == "actual"){ tw = 1}else{tw = twn}
										}
										return " scale("+tw+","+tw+")";
										}else if(tp == "left"){
										var l = $j(el).borders("left")
										if(twn == "actual"){ tw = l+"px"}else{tw = twn }
										//alert(tw)
										return " translate("+tw+",0px)";
										}else if(tp == "top"){
											var l = $j(el).borders("top")
										if(twn == "actual"){ tw = l+"px"}else{tw = twn }
										return " translate(0px,"+tw+")";
										}else if(tp == "moveTo"){
										if(twn == "actual"){ twa[0] = ""; twa[1] = ""}else{twa = twn.split(",");}

										return "left:"+twa[0]+"; top:"+twa[1]+"";
										}else if(tp == "scew"){
										if(twn == "actual"){ tw = 0}else{tw = twn }
										return " scew("+tw+"deg,"+tw+"deg)";
										}else
										 return "nothing";
								 }
								 var br = $j().browser(), ast = 0, MEM = [];

								 for(var i = 0; i < lent; i++){
									 if("tween" in ob){
										//if the data sent in is in object form separate in into ...
										if(typeof ob["tween"][i] === "object"){
											var key = Object.keys(ob["tween"][i])
											for(var j = 0; j < key.length; j++){
												for(var t = 0; t <= 100; t++){
													if(key[j] == t){
														if(br != "IE"){
															//transform types
															if(Ttypes[ob["type"][i]] == "t"){
																TS[t] = TS[t]+value(ob["type"][i],ob["tween"][i][key[j]])
															}
															//and normal types
															if(Ttypes[ob["type"][i]] == "n"){
																NS[t] = NS[t]+value(ob["type"][i],ob["tween"][i][key[j]])+";"
															}
														}else
														if(br == "IE"){
															//transform types
															if(Ttypes[ob["type"][i]] == "t"){
																if(MEM[j] != t){
																		AS[t] = AS[t]+" transform:"+value(ob["type"][i],ob["tween"][i][key[j]])+""
																	MEM[j] = t
																}else{
																	AS[t] = AS[t]+value(ob["type"][i],ob["tween"][i][key[j]])+""
																}

															}
															//and normal types
															if(Ttypes[ob["type"][i]] == "n"){
																AS[t] = AS[t]+";"+value(ob["type"][i],ob["tween"][i][key[j]])+";"
															}
														}

														Ct[t]++;
													}
												}
											}
										//if just string form ...
										}else if(typeof ob["tween"][i] !== "object"){
											var key = Object.keys(ob["tween"])
											for(var j = 0; j < key.length; j++){
												if(br != "IE"){
													if(Ttypes[ob["type"]] == "t"){
														//alert(ob["type"]+","+ob["tween"][key[j]])
														TS[key[j]] = value(ob["type"],ob["tween"][key[j]])
														//alert("ok..")
													}
													if(Ttypes[ob["type"]] == "n"){
														NS[key[j]] = NS[key[j]]+value(ob["type"],ob["tween"][key[j]])+";"
													}
												}else
												if(br == "IE"){
													//transform types
													if(Ttypes[ob["type"]] == "t"){
															AS[key[j]] = " transform:"+value(ob["type"],ob["tween"][key[j]])+""

													}
													//and normal types
													if(Ttypes[ob["type"]] == "n"){
														AS[key[j]] = ";"+value(ob["type"],ob["tween"][key[j]])+""
													}
												}
											}
										}

									 }

								 }
								 //alert(AS)
								 for(var t = 0; t <= 102; t++){
									 //parse tranform data
									if(typeof TS[t] !== "undefined" && TS[t] !== undefined && TS[t] !== ""){
										if(typeof ob["type"] === "object"){
											if(ob["type"].length == Ct[t]){
												//alert(t+"% { "+prefix+"transform:"+res+"; }")
												var res = TS[t].replace("undefined", " ");
												//alert(t+"% { "+prefix+"transform:"+res+"; }")
												switchType(t+"% { "+prefix+"transform:"+res+"; }")
											}
										}else if(typeof ob["type"] !== "object"){
											//alert(t+"% { "+prefix+"transform:"+res+"; }  = "+TS[t])
											var res = TS[t].replace("undefined", " ");
											//alert(t+"% { "+prefix+"transform:"+res+"; }")
											switchType(t+"% { "+prefix+"transform:"+res+"; }")
										}
										//parse normal data
									}
									if(typeof NS[t] !== "undefined" && NS[t] !== ""){
										if(typeof ob["type"] === "object"){
											if(ob["type"].length == Ct[t]){
												 var res2 = NS[t].replace("undefined", " ");
												 switchType(t+"% {"+res2+" }")
												 //alert(t+"% {"+res2+" }")
											}
										}else if(typeof ob["type"] !== "object"){
												 var res2 = NS[t].replace("undefined", " ");
												 switchType(t+"% {"+res2+"; }")
												 //alert(t+"% {"+res2+"; }")
										}
									}
									if(typeof AS[t] !== "undefined" && AS[t] !== undefined && AS[t] != ""){
										//alert(AS[t])
										if(typeof ob["type"] === "object"){
											if(ob["type"].length == Ct[t]){
												 var res3 = AS[t].replace("undefined", " ");
												 switchType(t+"% {"+res3+" }")
												 //alert(t+"% {"+res3+" }")
											}
										}else if(typeof ob["type"] !== "object"){
												 var res3 = AS[t].replace("undefined", " ");
												 var tm = 100
												 if(t > 100){
														 switchType(100+"% {"+res3+"; }")
												 }else{
													switchType(t+"% {"+res3+"; }")
												 }
												 //alert(t+"% {"+res3+"; }")

										}
									}
								 }
								 setTimeout(function() {
									 //el.style.webkitAnimation = ran+" forwards";
										 //el.style.animation = ran+" forwards";
									 el.classList.remove(ran);
									 if(refresh == true){
											findKeyframesRule(ran,true)
									 }
									 fn(el)
								 },(time));


							}
							//keyframes.deleteRule("0%",0);
							//alert(keyframes.cssText)
							//findKeyframesRule(ran);
							//alert(el.classList)


							 el.style.webkitAnimation = anim+" "+time+"ms forwards "+loop+" "+dir+" "+curve;
							 el.style.animation = anim+" "+time+"ms forwards "+loop+" "+dir+" "+curve;
							//alert(window.getComputedStyle(el,null).getPropertyValue("animation"));
						}

				}
				if(alt == true){
					el.style["display"] = "none";
				}
			})
			return this;
		 },
		 pause: function(){
			 this.each(function(el) {
					 el.style.webkitAnimationPlayState = "paused"
					 el.style.animationPlayState = "paused"
			 })
			 return ;
		 },
		 start: function(){
			 this.each(function(el) {
					 el.style.webkitAnimationPlayState = "running"
					 el.style.animationPlayState = "running"
			 })
			 return ;
		 },
		 Stop: function(){
			 this.each(function(el) {
					 el.style.webkitAnimation = " ";
				 el.style.animation = " ";
			 })
			 return ;
		 },
		 browser: function() {
					var bw;
			//alert(navigator.userAgent)
			if(navigator.userAgent.indexOf("OPR") != -1 ){
					 bw = 'Opera';
			}else if(navigator.userAgent.indexOf("Chrome") != -1 ){
					 bw = 'Chrome';
				 if(navigator.userAgent.indexOf("Android") != -1 ){
					 bw = 'Chrome-Android';
				 }
			}else if(navigator.userAgent.indexOf("Opera") != -1 ){
					 bw = 'Opera';
			}else if(navigator.userAgent.indexOf("Firefox") != -1 ){
				 bw = 'Firefox';
			}else if(navigator.userAgent.indexOf("Safari") != -1 ){
				 bw = 'Safari';
			}else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
					 bw = 'IE';
			}else{
					 bw = 'Unknown';
			}
			//alert(bw)
			return bw;
		 },
		 PROGRESSBAR: function(p,ob,fn){
			 this.each(function(el) {
				 var ran;
				 var PF;
				 W = $j(el).trueStyle("width")
				 if(W == null){
					W == "100px";
				 }
				 H = $j(el).trueStyle("height")
				 if(H == null){
					H == "100px";
				 }
				 pH = parseInt(H) / 1.5;
				 pD = ((parseInt(H) - pH) / 2) - 2;
				 H = parseInt(H) - (pD * 1.5)+"px";
				 W = parseInt(W) - (pD * 1.5)+"px";
				 if($j(el).attribute("data-jlib-progressBarId") == null){
					 var rad = 10, grad = 50, ref = true, bord = 30, shad = 50, rest = "darker+", col = "#000000"
					 if(typeof ob !== "undefined"){
						if("radius" in ob){
							 rad = ob["radius"]
						}
						if("gradient" in ob){
							 grad = ob["gradient"]
						}
						if("reflect" in ob){
							 ref = ob["reflect"]
						}
						if("border" in ob){
							 rad = ob["border"]
						}
						if("shadow" in ob){
							 shad = ob["radius"]
						}
						if("color" in ob){
							 col = ob["color"]
						}
						if("rest" in ob){
							 shad = ob["rest"]
						}
					 }

					 C = ob["background"];
					 var pp = 100 - p;
					 var pro = document.createElement('div')
					 var per = document.createElement('div')
					 $j(pro).setStyle("width",W).setStyle("height",H).setStyle("background",C).setStyle("float","left")
					 $j(per).setStyle("height","100%").setStyle("float","none").setStyle("position","absolute").embed(pp+"%")
					 $j(per).setStyle("font-size",pH+"px").setStyle("padding",pD+"px").setStyle("color",col)
					 el.appendChild(pro);
					 el.appendChild(per);
					 $j(pro).enhance({reflect:ref, shadow:shad, rest:rest, percent:grad,radius:rad, border:bord})
						 P = (parseInt(W) * (100 - p)) / 100;
					 PF = "actual"
					 $j(pro).animate({type:"width",time:200,tween:{0:PF, 100:P+"px"},pivot:"0% 0%"})
					 ran = this.randomized(8)
					 $j(el).attribute("data-jlib-progressBarId",ran)
					 $j(pro).attribute("data-jlib-progressBarConnector",ran)
					 $j(per).attribute("data-jlib-progressBarMenu",ran)
				 }else{
					 ran = $j(el).attribute("data-jlib-progressBarId")
					 var pp = 100 - p;
					 $j("@data-jlib-progressBarMenu="+ran).embed(pp+"%")
					 P = (parseInt(W) * (100 - p)) / 100;
					 PF = (parseInt(W) * (100 - GLOBALS["progressBar"][ran]["last"])) / 100;
					 $j("@data-jlib-progressBarConnector="+ran).animate({type:"width",time:200,tween:{0:PF+"px", 100:P+"px"},pivot:"0% 0%"})
				 }

				 GLOBALS["progressBar"][$j(el).attribute("data-jlib-progressBarId")] = {"last":p}
				 //alert(P+" - "+PF + " - "+GLOBALS["progressBar"][ran]["last"])
			 })

		 },
		 SCROLL: function(ob){
			 this.each(function(el) {
				var alt1 = false;
				//alert($j(el).trueStyle("display"))
				if($j(el).trueStyle("display") == "none"){
					//alert()
					 $j(el).setStyle("display","block")
					 alt1 = true;
				}
				//alert($j(el).trueStyle("display"))
				var em = $j(el).embedded()

				$j(el).setStyle("overflow-y","auto")
				$j(el).setStyle("overflow-x","hidden")
				$j(el).setStyle("padding","5px")
				var c = $j(el).trueStyle("background")
				var cc = c.replace("rgb(","")
				var spc = cc.split(",")
				var sc = []
				for(var i = 0; i < spc.length; i++){
					sc[i] = parseInt(spc[i])
				}
				//c = $j().rgbHex([sc)
				//alert($j(el).trueStyle("width")+" "+el.scrollHeight)
				var w = parseInt($j(el).trueStyle("width"))+5
				var h = parseInt($j(el).trueStyle("height"))+10
				var sh = h * 0.4;
				var t = $j(el).borders("top")
				var hin = h / el.scrollHeight;
				sh = h * hin;

				var scrollbody = document.createElement('div'), scroller = document.createElement('div')
				scroller.style.width = "18px",scroller.style.height = sh+"px",scroller.style.background = "#f299ff",scroller.style.top = "0px",
				scrollbody.style.width = "18px",scrollbody.style.height = h+"px",scrollbody.style.background = c,scrollbody.style.position = "absolute";              scrollbody.style.float = "none", $j(scrollbody).setStyle("margin-left",w+"px"),
				$j(scrollbody).setStyle("z-index","30"), $j(scrollbody).setStyle("top","px")
				scroller.setAttribute("data-jlib-uiId","scroll")


				var rad = 10, grad = 50, ref = true, bord = 30, shad = 50, rest = "darker+"
				if(typeof ob !== "undefined"){
					if("radius" in ob){
					 rad = ob["radius"]
					}
					if("gradient" in ob){
					 grad = ob["gradient"]
					}
					if("reflect" in ob){
					 ref = ob["reflect"]
					}
					if("border" in ob){
					 rad = ob["border"]
					}
					if("shadow" in ob){
					 shad = ob["radius"]
					}
					if("color" in ob){
					 $j(scroller).setStyle("background",ob["color"])
					}
					if("width" in ob){
					 var wd = (18*ob["width"])
					 $j(scroller).setStyle("width",wd+"px")
					 var mg = 9 * (1 - ob["width"])
					 $j(scroller).setStyle("margin-left",mg+"px")
					}
					if("rest" in ob){
					 shad = ob["rest"]
					}

				}

				//document.getElementsByTagName('body')[0].appendChild(scrollbody);

				//$j(el).embed(em)
				el.appendChild(scrollbody);
				scrollbody.appendChild(scroller);


				//alert($j(el).scrollHeight)
				$j(scroller).enhance({reflect:ref, shadow:shad, rest:rest, percent:grad,radius:rad, border:bord})
				$j(scroller).drag($j(scrollbody),function(x,y){
					el.scrollTop = y / hin;
				})
				$j(el).after("scroll",function(){
					_y = this.scrollTop * hin;
					$j("#e").embed(_y)
					$j(scroller).setStyle("top",_y+"px")
				})
				if(alt1 == true){
					 $j(el).setStyle("display","none")
				}
			 })
		 },
		 drag: function(X,Y,X1,Y1,fn){

			 this.each(function(el) {
				var dragObj = null;
				var obj = el;
				obj.style.cursor = "pointer";
				obj.style.position = "absolute";
				$j(obj).after("mousedown",function(e){
						dragObj = obj;
						cx = e.pageX;
						cy = e.pageY;
						var o = dragObj.getBoundingClientRect();
						ox = parseInt(o.left);
						oy = parseInt(o.top);
				})

				$j(obj).after("mouseup",function(){
					dragObj = null;
				})
				var cx, cy, ox, oy;
				if(typeof X === "function"){
					fn = X
				}else if(typeof Y === "function"){
					fn = Y
				}else if(typeof X1 === "function"){
					fn = X1
				}else if(typeof Y === "function"){
					fn = Y1
				}else if(typeof X === "string"){
					dragObj = null;
				}
				if(typeof fn === "undefined"){
					function fn(xi,yi){

					}
				}
				if(typeof X === "object"){

					var tempt = 0, templ = 0, coet = 0, coel = 0
					tempt = parseInt(X.trueStyle("margin-top"))
					templ = parseInt(X.trueStyle("margin-left"))
					if(tempt > 0){
						coet = parseInt(X.trueStyle("margin-top")) - (.5*parseInt($j(el).trueStyle("height")))
					}
					if(templ > 0){
						coel = parseInt(X.trueStyle("margin-left")) - (.5*parseInt($j(el).trueStyle("width")))
					}
					Y1 = parseInt(X.trueStyle("height")) - 10 + coet
					X1 = parseInt(X.trueStyle("width")) - 20 + coel
					var xx = 0;
					if($j(el).attribute("data-jlib-uiId") == "scroll"){
						xx = 0;
						Y = 0;
					}else{
						Y = X.borders("top")
					}
					X = X.borders("left")

				}else{
					if(isNaN(Y1)){
						 Y1 = parseInt($j().windowHeight()) - parseInt($j(el).trueStyle("height"))
					}
					if(isNaN(X1)){
						 X1 = parseInt($j().windowWidth())
					}
					var xx = 0;
					if($j(el).attribute("data-jlib-uiId") == "scroll"){
						xx = 0;
						Y = 0;
					}else{
						if(isNaN(Y)){
						 X = $j("body")
							 Y = X.borders("top")
						}
					}
					if(isNaN(X)){
					 X = $j("body")
						 X = X.borders("left")
					}
					//$j("#t1").embed(X+" "+Y)
				}
				$j(obj).after("mousedown",function(){
					move()
				})
				$j(obj).after("mouseup",function(){
					dragObj = null;
				})

				var yA = []
				function move(){
					$j("html").after("mousemove",function(e){
						//e.preventDefault();
						var x = e.pageX - (cx - ox) - xx// + dragObj.clientWidth;
						var y = e.pageY - (cy - oy) - xx// + dragObj.clientWidth;

						if(typeof X === "undefined" && typeof Y === "undefined" && typeof X1 === "undefined" && typeof Y1 === "undefined"){
							dragObj.style.left = x +"px";
							dragObj.style.top= y +"px";
							fn(dragObj.style.left,dragObj.style.top)
						}else if(typeof X !== "undefined" && typeof Y === "undefined" && typeof X1 === "undefined" && typeof Y1 === "undefined"){
							if(x >= X){
							 dragObj.style.left = x +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
							dragObj.style.top= y +"px";
						}else if(typeof X === "undefined"  && typeof X1 === "undefined" && typeof Y1 === "undefined" && typeof Y !== "undefined"){
							if(y >= Y){
							 dragObj.style.top= y +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
							dragObj.style.left = x +"px";
						}else if(typeof X !== "undefined" && typeof Y !== "undefined" && typeof X1 === "undefined" && typeof Y1 === "undefined"){
							if(x >= X){
							 dragObj.style.left = x +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
							if(y >= Y){
							 dragObj.style.top= y +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
						}else if(typeof X !== "undefined" && typeof Y !== "undefined" && typeof X1 !== "undefined" && typeof Y1 !== "undefined"){

							if(x >= X && x <= X1){
							 dragObj.style.left = x +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
							if(y >= Y && y <= Y1){
							 dragObj.style.top= y +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}

						}else if(typeof X !== "undefined" && typeof Y !== "undefined" && typeof X1 !== "undefined" && typeof Y1 === "undefined"){

							if(x >= X && x <= X1){
							 dragObj.style.left = x +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
							if(y >= Y){
							 dragObj.style.top= y +"px";
							 fn(dragObj.style.left,dragObj.style.top)
							}
						}

					})
				};
			 })

		 return this;
		 },
		 count: function(array,c){
		v = 0;
			for(var i = 0; i < array.length; i++){
			if(array[i] == c){
				 v++;
			}
		}
		return v;
		 },
		 borders: function(type){
			 var rect;
			 this.each(function(el) {
					rect = el.getBoundingClientRect()
			 })
			 if(type == "top"){
				 return rect.top;
			 }else
			 if(type == "left"){
				 return rect.left;
			 }else
			 if(type == "right"){
				 return rect.right;
			 }else
			 if(type == "bottom"){
				 return rect.bottom;
			 }else{
			 return rect;
			 }
		 },
		 trueStyle: function(get){
			 var val;
			 this.each(function(el) {
					val = window.getComputedStyle(el,null).getPropertyValue(get)
			 })
			 return val
		 },
		 PAGE2: function(index,num,action){
			 var begin,end,type;
			 if(typeof index == "object"){
				 if("end" in ob){
					 end = parseInt(ob["end"])
				 }
				 if("begin" in ob){
					 begin = parseInt(ob["begin"])
				 }
				 if("type" in ob){
					 type = ob["type"]
					 if(type == "scroll"){
						 index = "scroll"
						 num = end
					 }
					 if(type == "lazy"){
						 index = "lazy"
						 num = end
					 }
					 if(type == "controls"){
						 index = "controls"
					 }
				 }
			 }
			 document.getElementsByTagName("body")[0].style["margin"] = "0px";
			 var windowW = window.getComputedStyle(document.getElementsByTagName("body")[0],null).getPropertyValue("width")
			 var bodyH = window.getComputedStyle(document.getElementsByTagName("body")[0],null).getPropertyValue("height")
			 var body = document.body, htmlv = document.documentElement;
			 bodyH = window.getComputedStyle(htmlv,null).getPropertyValue("height")
			 var windowH = Math.max( body.scrollHeight, body.offsetHeight, htmlv.clientHeight, htmlv.scrollHeight, htmlv.offsetHeight );
			 var ob = {style:{margin:"0px"}}
			 var pageElements = $j().exist("body|data-jlib-type:page");
			 if(num > 0){
				pageElements = num
			 }
			 if(num === undefined){
				num = pageElements;
			 }
			 if(index != "scroll" && index != "lazy"){
				 if(index != "controls"){
					 //$j("@data-jlib-type=page").appendStyle(ob)
					 //$j("@data-jlib-type=page").animate({type:"size",time:200,tween:{0:"1", 100:"0"}})
					 //$j("@data-jlib-type=page").setStyle("display","none")
					 if($j().browswer != "Chrome-Android"){
						 for(var i = 0; i < pageElements; i++){
							 if(i != index){
								$j("body[data-jlib-type=page|"+i+"]").animate({type:"size",time:400,tween:{0:"1", 100:"0"}})
							 }
						 }
					 }else{
						 $j("@data-jlib-type=page["+index+",/]").animate({type:"size",time:400,tween:{0:"1", 100:"0"}})
					 }
					 setTimeout(function(){
						$j("@data-jlib-type=page").setStyle("display","none")
					 },500)
					 setTimeout(function(){
						$j("body[data-jlib-type=page|"+index+"]").setStyle("display","block")
					 },850)
					 setTimeout(function(){
						$j("body[data-jlib-type=page|"+index+"]").animate({type:"size",time:350,tween:{0:"0",100:"1"}})
					 },750)
				 }else{
					 index = 0;


					 var nav_icon = document.createElement('div'), nav_icon2 = document.createElement('div'), nav_count = document.createElement('div');
					 nav_icon.className = 'nav_icon radius-5';
					 nav_icon2.className = 'nav_icon radius-5';
					 nav_count.className = 'nav_count radius-5';
					 nav_icon.style["top"] = (windowH - 50)+"px";
					 nav_icon.style["left"] = (parseInt(windowW) - 70)+"px";
					 nav_icon.style["cursor"] = "pointer";
					 nav_icon2.style["cursor"] = "pointer";
					 nav_icon2.style["top"] = (windowH - 50)+"px";
					 nav_icon2.style["left"] = (parseInt(windowW) - 120)+"px";
					 nav_count.style["top"] = (windowH - 45)+"px";
					 nav_count.style["left"] = (parseInt(windowW) - 180)+"px";
					 document.getElementsByTagName('body')[0].appendChild(nav_icon);
					 document.getElementsByTagName('body')[0].appendChild(nav_icon2);
					 document.getElementsByTagName('body')[0].appendChild(nav_count);
					 $j(nav_icon).cells({id:"jlibforward",horizontal:1, vertical:1,tag:"img", src:"images/forward.png", style:{float:"left"}})
					 $j(nav_icon).setStyle("background","#ffffff").enhance({reflect:false, shadow:"light-", rest:"darker+", percent:20,radius:10})
					 $j(nav_icon2).cells({id:"jlibback",horizontal:1, vertical:1,tag:"img", src:"images/back.png", style:{float:"left"}})
					 $j(nav_icon2).setStyle("background","#ffffff").enhance({reflect:false, shadow:"light-", rest:"darker+", percent:20,radius:10})

					 if(action === undefined){
						action = "click"
					 }
					 $j(nav_count).embed("page:"+1)
					 $j("#jlibforward").after(action,function(){
						 index++
						 if(index < pageElements){
							 $j("body[data-jlib-type=page|"+(index-1)+"]").animate({type:"size",time:600,tween:{0:"1", 100:"0"}})
							 setTimeout(function(){
								$j("@data-jlib-type=page").setStyle("display","none")
							 },700)
							 setTimeout(function(){
								$j("body[data-jlib-type=page|"+index+"]").setStyle("display","block")
							 },850)
							 setTimeout(function(){
								$j("body[data-jlib-type=page|"+index+"]").animate({type:"size",time:550,tween:{0:"0",100:"1"}})
							 },750)
						 }
						 if(index == pageElements){index = pageElements - 1;}
						 $j(nav_count).embed("page:"+(index+1))
					 })
					 $j("#jlibback").after(action,function(){
						 index--;
						 if(index >= 0 && index <= num){
							 $j("body[data-jlib-type=page|"+(index+1)+"]").animate({type:"size",time:600,tween:{0:"1", 100:"0"}})
							 setTimeout(function(){
								$j("@data-jlib-type=page").setStyle("display","none")
							 },700)
							 setTimeout(function(){
								$j("body[data-jlib-type=page|"+index+"]").setStyle("display","block")
							 },850)
							 setTimeout(function(){
								$j("body[data-jlib-type=page|"+index+"]").animate({type:"size",time:550,tween:{0:"0",100:"1"}})
							 },750)
						 }
						 if(index < 0){index = 0}
						 $j(nav_count).embed("page:"+(index+1))
					 })
				 }

			 }else if(index != "scroll" && index == "lazy"){
					 if(end === undefined){
						index = 0;
				 }else{
					 index = begin;
				 }
				 var reversescroll = false;
				 var REV = [], FOR = [];
				 var pageElements = $j().exist("body|data-jlib-type:page");

				 if(num > 0){
					pageElements = num
				 }else{
					num = pageElements;
				 }
				 for(var n = 1; n < num; n++){
					 //$j("body[data-jlib-type=page|"+n+"]").setStyle("display","block")
					 //$j("body[data-jlib-type=page|"+n+"]").animate({type:"size",time:700,tween:{0:"1", 100:"0"}})
				 }
				 doscroll = false;
				 setTimeout(function(){
					doscroll = true;
				 },1000)

				 $j(document).after("scroll",function(){
					 if(doscroll == true){
							if(action === undefined){action = 0}
						if($j("body[data-jlib-type=page|"+(index)+"]").borders("top") < action){
							 reversescroll = false;
							 doscroll = false;
							 index++;
							 if(index < pageElements){
								 setTimeout(function(){
									$j("body[data-jlib-type=page|"+index+"]").setStyle("display","block")
								 },250)
								 setTimeout(function(){
									$j("body[data-jlib-type=page|"+index+"]").animate({type:"size",time:450,tween:{0:"0",100:"1"}})
									setTimeout(function(){
									 doscroll = true;
									},700)

								 },150)
							 }
							 if(index == pageElements){index = pageElements - 1; doscroll = true; /*window.scrollTo(0,5)*/}
						}
					 }
				 })
			 }else if(index == "scroll" && index != "lazy"){
				 index = 0;
				 var reversescroll = false;
				 var REV = [], FOR = [];
				 var pageElements = $j().exist("body|data-jlib-type:page");

				 if(num > 0){
					pageElements = num
				 }
				 if(num === undefined){
					num = pageElements;
				 }
				 doscroll = false;
				 setTimeout(function(){
					doscroll = true;
				 },1000)

				 $j(document).after("scroll",function(){
					 if(doscroll == true){
						var _bHeight = $j("body").trueStyle("height")
						var trueH = $j("body[data-jlib-type=page|"+index+"]").trueStyle("height")
						var _calcuHeight = $j("body[data-jlib-type=page|"+index+"]").trueStyle("height")
						var scrolbar = (parseInt(_calcuHeight) - htmlv.clientHeight);
						var supportPageOffset = window.pageXOffset !== undefined;
						var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
						var _x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
						var _y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
						var _pageOb2 = htmlv.clientHeight + _y

						if($j("body[data-jlib-type=page|"+(index)+"]").borders("top") < 0){
							 reversescroll = false;
							 doscroll = false;
							 index++;
							 if(index < pageElements){
								 window.scrollTo(0,5)
								 $j("body[data-jlib-type=page|"+(index-1)+"]").animate({type:"size",time:700,tween:{0:"1", 100:"0"}})
								 setTimeout(function(){
									$j("@data-jlib-type=page").setStyle("display","none")
								 },800)
								 setTimeout(function(){
									$j("body[data-jlib-type=page|"+index+"]").setStyle("display","block")
								 },950)
								 setTimeout(function(){
									$j("body[data-jlib-type=page|"+index+"]").animate({type:"size",time:650,tween:{0:"0",100:"1"}})
									setTimeout(function(){
									 doscroll = true;
									},1500)

								 },850)
							 }
							 if(index == pageElements){index = pageElements - 1; doscroll = true; window.scrollTo(0,5)}
						}
						_y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

						if(_y == 5){
							reversescroll = true;
						}

						if(_y == 0 && reversescroll == true){
							 reversescroll = false;
							 index--;
							 if(index >= 0 && index <= num){
								 $j("body[data-jlib-type=page|"+(index+1)+"]").animate({type:"size",time:700,tween:{0:"1", 100:"0"}})
								 setTimeout(function(){
									$j("@data-jlib-type=page").setStyle("display","none")
								 },800)
								 setTimeout(function(){
									$j("body[data-jlib-type=page|"+index+"]").setStyle("display","block")
								 },950)
								 setTimeout(function(){
									$j("body[data-jlib-type=page|"+index+"]").animate({type:"size",time:650,tween:{0:"0",100:"1"}})
									setTimeout(function(){
									 window.scrollTo(0,5)
									 reversescroll = false;
									},650)
								 },850)
							 }
							 if(index < 0){index = 0}
						}
					 }
				 })
			 }
		 },
		 exist: function(sel,ex){
			 var L = 0, LL = 0;
			 var splitsel = sel.split(":")
			 var selector = splitsel[0].split("|")
			 var elemparent = document.querySelectorAll("*");
			 var parlen = elemparent.length;
			 var tag = selector[0].substr(1, selector[0].length)
			 var fil
			 if(selector[0].charAt(0) == "#"){
				 var fil = "id";
				 var t = false;
			 }else if(selector[0].charAt(0) == "."){
				 var fil = "class";
				 var t = false;
			 }else if(selector[0].charAt(0) == "?"){
				 var fil = "name";
				 var t = false;
			 }else if(selector[0].charAt(0) == "@"){
				 var spatr = tag.split("=")
				 var fil = spatr[0];
				 tag = spatr[1];
				 var t = false;
			 }else{
				var t = true;
				tag = selector[0]
			 }


			 if(tag.indexOf("[") > 0){
				 var ex = tag.split("[")
				 tag = ex[0]
				 var kdx = ex[1].split("]"), kd = kdx[0]

			 }
			 //alert(tag+" -- "+fil+" "+kd);

			 for(var i = 0; i < parlen; i++){
				var logic = (t == false) ? elemparent[i].getAttribute(fil) == tag : elemparent[i].tagName.toLocaleLowerCase() == tag.toLocaleLowerCase();
				if(logic == true){
					if(ex == "implicit"){
						 var elemkid = elemparent[i].querySelectorAll("*")
					}else{
						 var elemkid = elemparent[i].children
					}

					for(var x = 0; x < elemkid.length; x++){
						if(selector[1] !== undefined){
							 var elementk = elemkid[x].getAttribute(selector[1]);
							 if(splitsel[1].indexOf("%") == 0 && splitsel[1].lastIndexOf("%") == 0 && elementk != null){
								 var res = splitsel[1].replace("%", "");
								 splitsel[1] = res;
								 var Logic = elementk.length == (elementk.indexOf(splitsel[1])+splitsel[1].length) && elementk.indexOf(splitsel[1]) != -1;
							 }else
							 //$j("@id=john[class=susan%]") every id that is john and has children that begin with susan
							 if(splitsel[1].indexOf("%")==(splitsel[1].length-1) && splitsel[1].lastIndexOf("%") == (splitsel[1].length-1) && elementk != null){
								 var res = splitsel[1].replace("%", "");
								 splitsel[1] = res;
								 var Logic = elementk.indexOf(splitsel[1]) == 0;
							 }else
							 //$j("@id=john[class=%susan%]") every id that is john and has children that has susan
							 if(splitsel[1].indexOf("%") == 0 && splitsel[1].lastIndexOf("%") == (splitsel[1].length-1) && elementk != null){
								 var res = splitsel[1].replace("%", "");
								 res = res.replace("%", "");
								 splitsel[1] = res;
								 var Logic = elementk.indexOf(splitsel[1]) >= 0;
							 }else{
								 if(selector[1] == "class" && elemkid[x].classList.contains(splitsel[1])){
									 var Logic = true;
								 }else if(elemkid[x].getAttribute(selector[1]) == splitsel[1]){
									 var Logic = true;
								 }else{
									 var Logic = false;
								 }
							 }
						}else{
							if(parseInt(kd) == x){
								var Logic = true;
							}else{
								var Logic = false;
							}
						}
						if(Logic){
						L++
						}

					}

					if(logic == true){
					LL++
					}
				}
			 }
			 if(selector[1] === undefined && LL > 0 && kd === undefined){
				 return LL
			 }else{
					return L;
			 }
		 },
		 navTo: function(url){
			 window.location.href = url;
		 },
		 windowHeight: function(t){
			 var body = document.body, _htmlv = document.documentElement;
			 if(t === undefined){
					return Math.max( body.scrollHeight, body.offsetHeight, _htmlv.clientHeight, _htmlv.scrollHeight, _htmlv.offsetHeight );
			 }else if(t == "screen"){
				return screen.height
			 }else if(t == "window"){
				return  _htmlv.clientHeight
			 }
		 },
		 windowWidth: function(){
			 return parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0],null).getPropertyValue("width"))
		 },
		 STAGE: function(s,fn){
			 var canvas = document.createElement('canvas')
			 this.each(function(el) {
				//$j(el).emulate()
					W = $j(el).trueStyle("width");
				H = $j(el).trueStyle("height");
				cW = parseInt(W);
				cH = parseInt(H);
				$j(el).append(canvas);
				$j(canvas).attribute("height",cH)
				$j(canvas).attribute("width",cW)
				$j(canvas).id(s)
				$j(canvas).emulate($j(el))
				var ctx = canvas.getContext("2d");
				fn(ctx)
				//alert(canvas.getContext("2d"))
			 })
		 },
		 draw: function(ob,fn){
			var id, type = "div", color = "#2299ff", can, height = 50, width = 50, top = 0, left = 0, text, border
			var can_object = false, color_object = false, top_object = false, left_object = false, width_object = false, height_object = false
			if(typeof ob === "object"){
				if("id" in ob){
					id = ob["id"]
				}
				if("canvas" in ob){
					can = ob["canvas"]
				}
				if("type" in ob){
					type = ob["type"]
				}
				if("left" in ob){
					left = ob["left"]
				}
				if("top" in ob){
					top = ob["top"]
				}
				if("width" in ob){
					width = ob["width"]
				}
				if("height" in ob){
					height = ob["height"]
				}
				if("border" in ob){
					border = ob["border"]
				}
				if("text" in ob){
					text = ob["text"]
				}

			}
			if(typeof ob["canvas"] === "object"){
				var canvas = []
				can_object = true
				for(var i = 0; i < can.length; i++){
					canvas[i] = document.getElementById(can[i]);
				}
			}else{
			  var canvas = document.getElementById(can);
		    }

			if(typeof ob["color"] === "object"){
				var colors = []
				color_object = true
			}

			if(typeof ob["type"] === "object"){
				var types = []
				for(var i = 0; i < ob["type"].length; i++){
					if(ob["type"][i] == "div"){
						if(can_object == true){
							canvas[i] = document.getElementById(can[i]);
							if(canvas[i].getContext) {
		 						var ctx = canvas[i].getContext('2d');
								if(typeof ob["color"] === "object"){
		 						   ctx.fillStyle = color[i];
							    }else{
								   ctx.fillStyle = color;
							    }
								if(typeof ob["width"] === "object"){
		 						   ctx.fillRect (ob["top"][i], ob["left"][i], ob["width"][i], ob["height"][i]);
							    }else{
								   ctx.fillRect (0, 0, 50, 50);
								}
	 					    }
						}else{
							canvas = document.getElementById(can);
							if(canvas.getContext){
								var ctx = canvas.getContext('2d');
								if(typeof ob["color"] === "object"){
		 						   ctx.fillStyle = color[i];
							    }else{
								   ctx.fillStyle = color;
							    }
								if(typeof ob["width"] === "object" && typeof ob["height"] === "object" && typeof ob["top"] === "object" && typeof ob["left"] === "object"){
		 						   ctx.fillRect (ob["top"][i], ob["left"][i], ob["width"][i], ob["height"][i]);
							    }else if(typeof ob["width"] === "object" && typeof ob["height"] === "object" && typeof ob["top"] === "object"){
								   ctx.fillRect (ob["top"][i], left, ob["width"][i], ob["height"][i]);
								}else if(typeof ob["width"] === "object" && typeof ob["height"] === "object" && typeof ob["left"] === "object"){
								   ctx.fillRect (top, ob["left"][i], ob["width"][i], ob["height"][i]);
								}else if(typeof ob["width"] === "object" && typeof ob["left"] === "object" && typeof ob["top"] === "object"){
								   ctx.fillRect (ob["top"][i], ob["left"][i], ob["width"][i], height);
								}else if(typeof ob["height"] === "object" && typeof ob["left"] === "object" && typeof ob["top"] === "object"){
								   ctx.fillRect (ob["top"][i], ob["left"][i], width, ob["height"][i]);
								}else if(typeof ob["width"] === "object" && typeof ob["height"] === "object"){
								   ctx.fillRect (top, left, ob["width"][i], ob["height"][i]);
								}else if(typeof ob["left"] === "object" && typeof ob["top"] === "object"){
								   ctx.fillRect (ob["top"][i], ob["left"][i], width, height);
								}else if(typeof ob["left"] === "object"){
								   ctx.fillRect (top, ob["left"][i], width, height);
								}else if(typeof ob["top"] === "object"){
								   ctx.fillRect (ob["top"][i], left, width, height);
								}else if(typeof ob["width"] === "object"){
								   ctx.fillRect (top, left, ob["width"][i], height);
								}else if(typeof ob["height"] === "object"){
								   ctx.fillRect (top, left, width, ob["height"][i]);
								}
							}
						}
					}
				}
			}else{
				if(type == "div"){
				   if (canvas.getContext) {
					  var ctx = canvas.getContext('2d');
					  ctx.fillStyle = color;
					  ctx.fillRect (left, top, width, height);
					  fn()
				   }
				}
			}
		 },
		 draw2: function(t,c,ob){
			var x = ob["x"];
			var y = ob["y"];
			var L = ob["length"];
			if("imgWidth" in ob){var iW = ob["imgWidth"];}
			if("imgHeight" in ob){var iH = ob["imgHeight"];}
			if("width" in ob){var W = ob["width"];}
			if("height" in ob){var H = ob["height"];}
			if("image" in ob){var Im = ob["image"];}
			function degtorad(d){
				rad = (d * Math.PI)/180
				return rad;
			}
			var a90 = degtorad(90)
			var a = degtorad(ob["angle"])
			var a2 = degtorad(ob["angle2"])
			//alert(a2)
			var x1 = x + (L * Math.sin(a))
			var y1 = y - (L * Math.cos(a))
			//alert(x+"="+x1+" - "+y+"="+y1)

			if(t == "line"){
				c.beginPath();
				c.moveTo(x, y);
				c.lineTo(x1, y1);
				if("cap" in ob){
				c.lineCap = ob["cap"];
				}
			}
			if(t == "arc"){
				c.beginPath();
				if("radius" in ob){
					 var radius = ob["radius"];
				}
				c.arc(x, y, radius, a - a90, a2 - a90, false);
			}
			if(t == "rect"){
				c.beginPath();
				c.rect(x, y, W, H);
				c.fill();
			}
			if(t == "image"){
				var imageObj = new Image();
							imageObj.onload = function() {
				c.drawImage(imageObj, x, y, iW, iH);
				}
				imageObj.src = Im;
			}
			if("rotate" in ob){c.rotate(a)}
			if("lineColor" in ob){c.strokeStyle = ob["lineColor"];}
			if("lineColor" in ob){c.fillStyle = ob["color"];}
			if("lineWidth" in ob){c.lineWidth = ob["lineWidth"];}
			if("blur" in ob){c.shadowBlur = ob["blur"];}
			if("shadow" in ob){c.shadowColor = ob["shadow"];}
			if("shadowX" in ob){c.shadowOffsetX = ob["shadowX"];}
			if("shadowY" in ob){c.shadowOffsetX = ob["shadowY"];}
			c.stroke();
			c.save()

		 },
		 isoAnimate: function(c,fn,cn){
			 function ani(){
				var time = new Date();
				var s = time.getSeconds()
				fn()

				window.requestAnimationFrame(ani);
				//alert(1)
			 }
			 ani()

		 },
		 init: function(fn){
			var audioContext;
			try {
				window.AudioContext = window.AudioContext||window.webkitAudioContext;
				audioContext = new AudioContext();
				fn(audioContext)
			}
			catch(e) {
				alert('Web Audio API is not supported in this browser');
			}

		},
		loadAudio: function(url,audioContext,fn) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
				audioContext.decodeAudioData(request.response).then(function(decodedData) {
					fn(decodedData);
				});

			}
			request.send();
		},
		playAudio: function(audioContext,buffer) {
			var source = audioContext.createBufferSource();
			source.buffer = buffer;
			source.connect(audioContext.destination);
			source.start(0);
			return source;
		},
		playMic: function(fn) {
			var audioContext = new AudioContext();
			var BUFF_SIZE = 16384, channel = []
			var audioInput = null, microphone_stream = null, gain_node = null, script_processor_node = null, script_processor_fft_node = null,
			analyserNode = null;
			if (!navigator.getUserMedia){
					navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			}

			if (navigator.getUserMedia){
				navigator.getUserMedia(
				  {audio:true},
				  function(stream) {
					  start_microphone(stream);
				  },
				  function(e) {
					alert('Error capturing audio.');
				  }
				);

			} else { alert('getUserMedia not supported in this browser.'); }

			function start_microphone(stream){
				gain_node = audioContext.createGain();
				gain_node.connect( audioContext.destination );

				microphone_stream = audioContext.createMediaStreamSource(stream);
				microphone_stream.connect(gain_node);

				//script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
				//script_processor_node.onaudioprocess = process_microphone_buffer;

				//microphone_stream.connect(script_processor_node);

				// --- enable volume control for output speakers
		          //*
				document.getElementById('volume').addEventListener('change', function() {

					var curr_volume = this.value;
					gain_node.gain.value = curr_volume;
					console.log("curr_volume ", curr_volume);
				});
		    //*/
				// --- setup FFT

				script_processor_fft_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
				script_processor_fft_node.connect(gain_node);

				analyserNode = audioContext.createAnalyser();
				analyserNode.smoothingTimeConstant = 0;
				analyserNode.fftSize = 2048;

				microphone_stream.connect(analyserNode);

				analyserNode.connect(script_processor_fft_node);
           var ccnt = 0, start = false
				script_processor_fft_node.onaudioprocess = function(event) {
					// get the average for the first channel
					var array = new Uint8Array(analyserNode.frequencyBinCount);
					analyserNode.getByteFrequencyData(array);
					var leftChannel = event.inputBuffer.getChannelData(0)
					//fn(leftChannel[leftChannel.length - 1])
					if(leftChannel[leftChannel.length - 1] > 0.03 && ccnt == 0 && start == false){
						   $j("#test1").embed(ccnt)
               start = true
							 ccnt = 10
					}
					if(start == true && ccnt < 50){
						ccnt++
						 channel = event.inputBuffer.getChannelData(0)
					   //$j("#test").embed(event.inputBuffer.getChannelData(0))
					   $j("#test").embed(leftChannel[leftChannel.length - 1])
						 $j("#test1").embed(ccnt)
						 if(ccnt == 50){
							   $j("#test2").embed(ccnt)
						     fn(leftChannel,audioContext,event.inputBuffer,array)
								 ccnt = 0
								 start = false
					   }

					}
					// draw the spectrogram
					if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

						//show_some_data(array, 5, "from fft");
					}
				};
			}
		}


	}


	window.$j = function() {
		 return new _$j(arguments);
	};
	/*
	$j().pageSet(function(){
		document.getElementsByTagName("body")[0].style["margin"] = "0px";
		var _jlib_windowW = (parseInt($j("body").trueStyle("width")))+"px"
		var _pageOb = $j("body[data-jlib-type=page|0]").borders("top")
		var body = document.body, _jlib_htmlv = document.documentElement;
		var _jlib_windowH = Math.max( body.scrollHeight, body.offsetHeight, _jlib_htmlv.clientHeight, _jlib_htmlv.scrollHeight, _jlib_htmlv.offsetHeight );
		//_jlib_windowH = _jlib_windowH - _pageOb - _jlib_htmlv.offsetHeight;
		var _calcuHeight = $j("body[data-jlib-type=page|0]").trueStyle("height")
		var _calcuWidth = $j("body[data-jlib-type=page|0]").trueStyle("width")
		var _jlib_ob = {style:{width:_jlib_windowW,height:_jlib_windowH+"px",margin:"0px"}}
		var scrolbar = (parseInt(_calcuHeight) - _jlib_htmlv.clientHeight);
		if(_calcuWidth != "0px"){
			_jlib_windowW = _calcuWidth
		}
		if(_calcuHeight != "0px"){
			//_jlib_windowH = parseInt(_calcuHeight)
			_jlib_ob = {style:{width:_jlib_windowW,margin:"0px"}}
		}else{
			//_jlib_windowH = body.scrollHeight
			_jlib_ob = {style:{width:_jlib_windowW,height:_jlib_windowH+"px",margin:"0px"}}
		}
		//alert(_jlib_windowW)
		//alert("("+_jlib_windowH+")"+body.scrollHeight+", "+body.offsetHeight+", "+_jlib_htmlv.clientHeight+", "+_jlib_htmlv.scrollHeight+", "+_jlib_htmlv.offsetHeight)

		//alert(_jlib_windowH+" "+scrolbar+" "+_jlib_htmlv.clientHeight)

		var _jlib_obsw = {0:"actual", 100:_jlib_windowW+""}
		var _jlib_obsh = {0:"actual", 100:_jlib_windowH+"px"}
		var _jlib_obswr = {100:"0px", 0:""}
		var _jlib_obshr = {100:"0px", 0:""}
		var _jlib_w = parseInt(_jlib_windowW)+100;

		function SET_JLIB_PAGES(){
			$j("@data-jlib-type=page").appendStyle(_jlib_ob)
			$j("@data-jlib-type=page").animate({type:"size",time:100,tween:{0:"1", 100:"0"}})
			$j("@data-jlib-type=page").setStyle("display","none")
				$j("body[data-jlib-type=page|0]").setStyle("opacity","0")
			setTimeout(function(){
					$j("body[data-jlib-type=page|0]").setStyle("display","block")
			},600)
			setTimeout(function(){
				 $j("body[data-jlib-type=page|0]").animate({type:"size",time:750,tween:{0:"0",100:"1"}})
			},550)
			setTimeout(function(){
					$j("body[data-jlib-type=page|0]").setStyle("opacity","1")
			},600)

			return true;
		}
		var jlib_pages =  SET_JLIB_PAGES();


		});
	//*/


})();// JavaScript Document

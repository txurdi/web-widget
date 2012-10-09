
// Widget EuskalMeteo v1.0 [2010-03-16]
// Autor: Igor Ormaetxebarria Cantera (txurdi) [http://txurdi.net]
// Empresa: SocSoft S.L. [http://facebook.com/SocSoft]
// Licencia: http://creativecommons.org/licenses/by-sa/3.0/
// Basado en "Content Syndication with Case-Hardened JavaScript" (http://kentbrewster.com/case-hardened-javascript/) [http://kentbrewster.com/rights-and-permissions]

( function() {
	var nombreOfuscado = '';
	for (var i = 0; i < 16; i++) {
		nombreOfuscado += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
	}
	window[nombreOfuscado] = {};
	var $ = window[nombreOfuscado];
	$.f = function() {
		return {
			URL_base_script : 'http://txurdi.ath.cx/euskalmet/', //cambiar también en las últimas líneas (inicio de script)

			URL_datos_hoy_es : 'http://opendata.euskadi.net/contenidos/prevision_tiempo/met_forecast/es_today/data/es_r01dpd012799bb16c031e35f299aa1dacece450c9',
			URL_datos_manana_es : 'http://opendata.euskadi.net/contenidos/prevision_tiempo/met_forecast/es_tomorrow/data/es_r01dpd0012799bb16c031e35f28440a7eb2d59e59',
			URL_datos_pasado_es : 'http://opendata.euskadi.net/contenidos/prevision_tiempo/met_forecast/es_next/data/es_r01dpd012799bb16c131e35f2a6b98702e0298ffc',
			
			URL_datos_hoy_eu : 'http://opendata.euskadi.net/contenidos/prevision_tiempo/met_forecast/es_today/data/es_r01dpd012799bb16c031e35f299aa1dacece450c9',
			URL_datos_manana_eu : 'http://opendata.euskadi.net/contenidos/prevision_tiempo/met_forecast/es_tomorrow/data/es_r01dpd0012799bb16c031e35f28440a7eb2d59e59',
			URL_datos_pasado_eu : 'http://opendata.euskadi.net/contenidos/prevision_tiempo/met_forecast/es_next/data/es_r01dpd012799bb16c131e35f2a6b98702e0298ffc',

			runFunction : [],
			init : function(target) {
				var theScripts = document.getElementsByTagName('SCRIPT');
				for (var i = 0; i < theScripts.length; i++) {
					if (theScripts[i].src.match(target)) {
						$.a = {};
						if (theScripts[i].innerHTML) {
							$.a = $.f.parseJson(theScripts[i].innerHTML);
						}
						if ($.a.err) {
							alert($.f.traducir('param_mal'));//bad json!
						}
						$.f.cargarVariables();
						$.f.cargarCSS();
						$.f.cargarTraducciones();
						$.f.crearEstructuraGeneral();
// 						if ($.a.mi_CSS==false) {$.f.crearEstructuraGeneral();}
						$.f.crearPresentacion();
						theScripts[i].parentNode.insertBefore($.w, theScripts[i]);
						theScripts[i].parentNode.removeChild(theScripts[i]);
						break;
					}
				}
			},
			parseJson : function(json) {
				this.parseJson.data = json;
				if ( typeof json !== 'string') {
					return {"err":"Parametrización del widget mal formada."};//trying to parse a non-string JSON object
				}
				try {
					var f = Function(['var document,top,self,window,parent,Number,Date,Object,Function,',
						'Array,String,Math,RegExp,Image,ActiveXObject;',
						'return (' , json.replace(/<\!--.+-->/gim,'').replace(/\bfunction\b/g,'function&shy;') , ');'].join(''));
					return f();
				} catch (e) {
					return {"err":"ERROR parametrizando"};//trouble parsing JSON object
				}
			},
			crearPresentacion : function () {
				var ns = document.createElement('style');
				document.getElementsByTagName('head')[0].appendChild(ns);
				if (!window.createPopup) {
					ns.appendChild(document.createTextNode(''));
					ns.setAttribute("type", "text/css");
				}
				var s = document.styleSheets[document.styleSheets.length - 1];
				var ieRules = "";
				for (r in $.css) {
					var selector = '.' + nombreOfuscado + ' ' + r;
					if (!window.createPopup) {
						var theRule = document.createTextNode(selector + $.css[r]);
						ns.appendChild(theRule);
					} else {
						ieRules += selector + $.css[r];
					}
				}
				if (window.createPopup) { s.cssText = ieRules; }
			},
			cargarXML : function(urlXML,dia) {
				$.w.h.className = 'mw_cargando';
// 				$.w.r.innerHTML = '';
				if (!$.f.runFunction) { $.f.runFunction = []; }
				var n = $.f.runFunction.length;
				var id = nombreOfuscado + '.f.runFunction[' + n + ']';
				$.f.runFunction[n] = function(r) {
					delete($.f.runFunction[n]);
					$.f.removeScript(id);
					$.f.crearEstructuraBusqueda(r.query.results,dia);
				};
				var url = 'http://query.yahooapis.com/v1/public/yql?'+'q=select%20*%20from%20xml%20where%20url%3D%22'+
						encodeURIComponent(urlXML)+'%22&format=json'+'&callback=' + id;
						//alert (url);
				$.f.cargarScriptDatos(url, id);
			},
			cargarScriptDatos : function(url, id) {
				var s = document.createElement('script');
				s.id = id;
				s.type ='text/javascript';
				s.src = url;
				document.getElementsByTagName('body')[0].appendChild(s);
			},
			removeScript : function(id) {
				if (document.getElementById(id)) {
					var s = document.getElementById(id);
					s.parentNode.removeChild(s);
				}
			},
			cargarVariables : function() {
				$.d = {
					"base_url_img" : $.f.URL_base_script+'img/',
					"base_url_img_tiempo" : 'http://www.euskadi.net',
					"idioma" : "es",
					"localidad" : "2", //2 = Bilbao
					"hoy" : true,
					"manana" : true,
					"pasado" : true,
					"temperatura" : true,
					"temperaturaMAXMIN" : true,
					"tam_icono" : "40",
					"tam_texto_desc" : "100",
					"color_fondo":"#eee",
					"color_letra" : "#222",
					"alto" : "220",
					"ancho" : "500",
					"borde" : "1px solid #666",
					"mi_CSS" : false
					};
				for (var k in $.d) { if ($.a[k] === undefined) { $.a[k] = $.d[k]; } }
			},
			cargarCSS : function() {
				var num_dias = 0;
				if ($.a.hoy==true) num_dias += 1;
				if ($.a.manana==true) num_dias += 1;
				if ($.a.pasado==true) num_dias += 1;
				var tam_dia = 95 / num_dias;
				if ($.a.mi_CSS==true) {$.css = {"":"{}"}}
				else {
				$.css = {
					"" : "{margin:0;padding:0;width:" + ($.a.ancho) + "px;height:" + ($.a.alto) + "px;overflow:auto;background:" + $.a.color_fondo + ";color:" + $.a.color_letra + ";border:" + $.a.borde + ";font:13px/1.2em tahoma, veranda, arial, helvetica, clean, sans-serif;}",
					"div#mw_localidad" : "{margin:0!important;padding:2px;font-weight: bold;text-align:center;}",
					"div.mw_cargando" : "{background:url('" + ($.a.base_url_img) + "cargando.gif') no-repeat top right}",
					"p" : "{margin:0!important; padding:0!important; }",
					"#mw_hoy" : "{display:block;float:left;width:" + tam_dia + "%;border: 1px solid #ddd;padding:2px;margin:auto;}",
					"#mw_manana" : "{display:block;float:left;width:" + tam_dia + "%;border: 1px solid #ddd;padding:2px;margin:auto;}",
					"#mw_pasado" : "{display:block;float:left;width:" + tam_dia + "%;border: 1px solid #ddd;padding:2px;margin:auto;}",
					".mw_fecha" : "{display:block;font-weight: bold;}",
					".mw_temp_max_min" : "{font-weight: bold;}",
					".mw_temp_act" : "{display:block;}",
					".mw_ico" : "{display:block;width:" + ($.a.tam_icono) + "px;margin:auto;}",
					".mw_descripcion" : "{display:block;}",
// 					"" : "{}",
// 					"" : "{}",
// 					"" : "{}",
// 					"#mw_hoy" : "{background: red;}",
// 					"#mw_manana" : "{background: blue;}",
// 					"#mw_pasado" : "{background: green;}"
					};
				}
			},
			crearEstructuraGeneral : function() {
				$.w = document.createElement('div');
				$.w.className = nombreOfuscado;
				$.w.id = "meteoWidget";
				$.w.h = document.createElement('div');
				$.w.h.id = 'mw_localidad';
				$.w.h.className = 'mw_cargando';
				$.w.h.innerHTML = $.f.traducir('titulo_cargando');
				$.w.appendChild($.w.h);
				if (($.a.hoy==true) || ($.a.hoy=="true")) {
					$.w.hoy = document.createElement('div');
					$.w.hoy.id = 'mw_hoy';
					$.w.appendChild($.w.hoy);
					$.f.crearDia('hoy');
				}
				if (($.a.manana==true) || ($.a.manana=="true")) {
					$.w.manana = document.createElement('div');
					$.w.manana.id = 'mw_manana';
					$.w.appendChild($.w.manana);
					$.f.crearDia('manana');
				}
				if (($.a.pasado==true) || ($.a.pasado=="true")) {
					$.w.pasado = document.createElement('div');
					$.w.pasado.id = 'mw_pasado';
					$.w.appendChild($.w.pasado);
					$.f.crearDia('pasado');
				}
			},
			crearDia: function(dia) {
				eval ('var urlXML = $.f.URL_datos_'+dia+'_'+$.a.idioma);
				$.f.cargarXML(urlXML,dia);
			},
			crearEstructuraBusqueda: function(r,dia) {
				$.w.h.className = '';
				$.w.h.innerHTML += r.periodData.periodDate;
				if (dia=='hoy') var div_dia=$.w.hoy;
				else if (dia=='manana') var div_dia=$.w.manana;
				else if (dia=='pasado') var div_dia=$.w.pasado;
				for (var i = 0; i < r.periodData.cityForecastDataList.cityForecastData.length; i++) {
					if (r.periodData.cityForecastDataList.cityForecastData[i].cityCode == $.a.localidad) {
						$.w.h.innerHTML = r.periodData.cityForecastDataList.cityForecastData[i].cityName;
						
						var fecha = document.createElement('span');
						fecha.innerHTML = $.f.traducir(dia) + ' [' + r.periodData.periodDate + '] ';
						fecha.className = 'mw_fecha';
						div_dia.appendChild(fecha);

						if (($.a.temperatura==true) || ($.a.temperatura=="true")) {
							var tempAct = document.createElement('span');
							tempAct.innerHTML = r.periodData.cityForecastDataList.cityForecastData[i].currentTemp;
							tempAct.className = 'mw_temp_act';
							div_dia.appendChild(tempAct);
						}

						var imagen = document.createElement('img');
						imagen.src = $.a.base_url_img_tiempo+r.periodData.cityForecastDataList.cityForecastData[i].symbol;
						imagen.className = 'mw_ico';
						div_dia.appendChild(imagen);
						
						if (($.a.temperaturaMAXMIN==true) || ($.a.temperaturaMAXMIN=="true")) {
							var tempMaxMin = document.createElement('span');
							tempMaxMin.innerHTML = $.f.traducir('temperatura')+': ';
							tempMaxMin.className = 'mw_temp_max_min';
							div_dia.appendChild(tempMaxMin);
							var tempMax = document.createElement('span');
							tempMax.innerHTML = r.periodData.cityForecastDataList.cityForecastData[i].tempMax;
							tempMax.className = 'mw_temp_max';
							div_dia.appendChild(tempMax);
							var tempMaxMin2 = document.createElement('span');
							tempMaxMin2.innerHTML = ' - ';
							tempMaxMin2.className = 'mw_temp_max_min2';
							div_dia.appendChild(tempMaxMin2);

							var tempMin = document.createElement('span');
							tempMin.innerHTML = r.periodData.cityForecastDataList.cityForecastData[i].tempMin;
							tempMin.className = 'mw_temp_min';
							div_dia.appendChild(tempMin);
						}

						var pDesc = document.createElement('span');
						pDesc.innerHTML = $.f.cortar_cadena(r.periodData.descriptionPeriodData,$.a.tam_texto_desc);
						pDesc.alt = r.periodData.descriptionPeriodData;
						pDesc.title = r.periodData.descriptionPeriodData;
						pDesc.className = 'mw_descripcion';
						div_dia.appendChild(pDesc);
						
						break;
					}
				}
			},
			cortar_cadena: function (txt,numLetras) {
				palabras = txt.split(' ');
				texto_acortado = '';
				i=0;
				tot=0;
				while (tot + palabras[i].length <= numLetras) {
					texto_acortado += palabras[i] + ' ';
					tot += palabras[i].length;
					i++;
					if (i > palabras.length-1) break;
				}
				if (txt.length > numLetras) return texto_acortado+'[...]';
				else return texto_acortado;
			},
			traducir: function (cadena) {
				if ($.a.idioma=='eu') {
					return $.traducciones_eu[cadena];
				} else {
					return $.traducciones_es[cadena];
				}
			},
			cargarTraducciones : function() {
				$.traducciones_es = {
					"hoy" : 'Hoy',
					"manana" : 'Mañana',
					"pasado" : 'Pasado',
					'param_mal' : 'Parametrización del widget mal formada.',
					'titulo_cargando' : 'Cargando...',
					'temperatura' : 'Temp'
					};
				$.traducciones_eu = {
					"hoy" : 'Gaur',
					"manana" : 'Bihar',
					"pasado" : 'Etzi',
					'param_mal' : 'Parametrización del widget mal formada.',
					'titulo_cargando' : 'Cargando...',
					'temperatura' : 'Temp'
					};
			},
		};
	}();
	var thisScript = /^https?:\/\/[^\/]*txurdi.ath.cx\/euskalmet\/final.js$/;
	if(typeof window.addEventListener !== 'undefined') {
		window.addEventListener('load', function() { $.f.init(thisScript); }, false);
	} else if(typeof window.attachEvent !== 'undefined') {
		window.attachEvent('onload', function() { $.f.init(thisScript); });
	}
	if ((document.getElementById('probar')) && (document.getElementById('actualizar'))) {
		if(typeof window.addEventListener !== 'undefined') {
			document.getElementById('probar').addEventListener('click', function() { $.f.init(thisScript); }, false);
			document.getElementById('actualizar').click();
		} else if(typeof window.attachEvent !== 'undefined') {
			document.getElementById('probar').attachEvent('onclick', function() { $.f.init(thisScript); });
			document.getElementById('actualizar').click();
		}
	}
} )();


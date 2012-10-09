
// Configurador Widget EuskalMeteo v1.0 [2010-03-16]
// Autor: Igor Ormaetxebarria Cantera (txurdi) [http://txurdi.net]
// Empresa: SocSoft S.L. [http://facebook.com/SocSoft]
// Licencia: http://creativecommons.org/licenses/by-sa/3.0/

C = {
	txt_codigo_variables: '',
	txt_codigo_final: '',
	variables: {},
	variables_defecto: {},
	idioma:'',
	iniciar: function() {
		//Cargamos las variables por defecto.
		C.cargar_variables_defecto();
		//Cogemos los valores elegidos por URL.
		C.coger_variables_URL();

		//Cargamos las variables en nuestras variables.
		eval ('C.variables = '+C.txt_codigo_variables);
		for (var k in C.variables) { if (C.variables_defecto[k]) { C.variables_defecto[k] = C.variables[k]; } }

		//rellenamos los inputs con los valores que queremos.
		document.getElementById('color_fondo').value = C.variables_defecto['color_fondo'];
		document.getElementById('color_letra').value = C.variables_defecto['color_letra'];
		document.getElementById('alto').value = C.variables_defecto['alto'];
		document.getElementById('ancho').value = C.variables_defecto['ancho'];
		document.getElementById('borde').value = C.variables_defecto['borde'];
		document.getElementById('mi_CSS').checked = C.variables_defecto['mi_CSS'];

		document.getElementById('idioma').value = C.variables_defecto['idioma'];
		document.getElementById('localidad').value = C.variables_defecto['localidad'];
		document.getElementById('hoy').checked = C.variables_defecto['hoy'];
		document.getElementById('manana').checked = C.variables_defecto['manana'];
		document.getElementById('pasado').checked = C.variables_defecto['pasado'];
		document.getElementById('temperatura').value = C.variables_defecto['temperatura'];
		document.getElementById('temperaturaMAXMIN').value = C.variables_defecto['temperaturaMAXMIN'];
		document.getElementById('tam_icono').value = C.variables_defecto['tam_icono'];
		document.getElementById('tam_texto_desc').value = C.variables_defecto['tam_texto_desc'];

		//Añadimos el disparador para que actualice el widget cada vez que cambiamos un parametro
		document.getElementById('probar').style.visibility = 'hidden';
		document.getElementById('actualizar').style.visibility = 'hidden';
		addEvent(document.getElementById('actualizar'), 'click', C.disparar);

		//Añadimos eventos a los inputs:
// 		addEvent(document.getElementById('color_fondo'), 'Blur', C.cambiar_color_fondo);
// 		addEvent(document.getElementById('color_letra'), 'change', C.cambiar_color_letra);
		var f = $.farbtastic('#picker');
		var p = $('#picker').css('opacity', 0.25);
		var selected;
		$('.colorwell')
			.each(function () { f.linkTo(this); $(this).css('opacity', 0.75); })
			.focus(function() {
				if (selected) {
					$(selected).css('opacity', 0.75).removeClass('colorwell-selected');
					if ($(selected).hasClass('color_fondo')) {C.cambiar_color_fondo();}
					if ($(selected).hasClass('color_letra')) {C.cambiar_color_letra();}
				}
				f.linkTo(this);
				p.css('opacity', 1);
				$(selected = this).css('opacity', 1).addClass('colorwell-selected');
			});

		addEvent(document.getElementById('alto'), 'change', C.cambiar_alto);
		addEvent(document.getElementById('ancho'), 'change', C.cambiar_ancho);
		addEvent(document.getElementById('borde'), 'change', C.cambiar_borde);
		addEvent(document.getElementById('mi_CSS'), 'change', C.cambiar_mi_CSS);
		addEvent(document.getElementById('CSS_def'), 'change', C.cambiar_CSS_def);

		addEvent(document.getElementById('idioma'), 'change', C.cambiar_idioma);
		addEvent(document.getElementById('localidad'), 'change', C.cambiar_localidad);
		addEvent(document.getElementById('hoy'), 'change', C.cambiar_hoy);
		addEvent(document.getElementById('manana'), 'change', C.cambiar_manana);
		addEvent(document.getElementById('pasado'), 'change', C.cambiar_pasado);
		addEvent(document.getElementById('temperatura'), 'change', C.cambiar_temperatura);
		addEvent(document.getElementById('temperaturaMAXMIN'), 'change', C.cambiar_temperatura_max_min);
		addEvent(document.getElementById('tam_icono'), 'change', C.cambiar_tam_icono);
		addEvent(document.getElementById('tam_texto_desc'), 'change', C.cambiar_tam_texto_desc);

		//cargamos el widget y rellenamos el text del código
		C.carga_widget();
		C.rellena_codigo_final();
	},
	cambiar_alto: function() {
		document.getElementById('meteoWidget').style.height = document.getElementById('alto').value+'px';
		C.variables['alto'] = document.getElementById('alto').value;
		C.actualizar_configurador(false);
	},
	cambiar_ancho: function() {
		document.getElementById('meteoWidget').style.width = document.getElementById('ancho').value+'px';
		C.variables['ancho'] = document.getElementById('ancho').value;
		C.actualizar_configurador(false);
	},
	cambiar_color_fondo: function() {	
		document.getElementById('meteoWidget').style.background = document.getElementById('color_fondo').value;
		C.variables['color_fondo'] = document.getElementById('color_fondo').value;
		C.actualizar_configurador(false);
	},
	cambiar_color_letra: function() {
		document.getElementById('meteoWidget').style.color = document.getElementById('color_letra').value;
		C.variables['color_letra'] = document.getElementById('color_letra').value;
		C.actualizar_configurador(false);
	},
	cambiar_borde: function() {
		document.getElementById('meteoWidget').style.border = document.getElementById('borde').value;
		C.variables['borde'] = document.getElementById('borde').value;
		C.actualizar_configurador(false);
	},
	cambiar_mi_CSS: function() {
		C.variables['mi_CSS'] = document.getElementById('mi_CSS').value;
		C.actualizar_configurador(false);
		if (document.getElementById('mi_CSS').value==true) {
			document.getElementById('div_CSS_def').style.color = '#ddd';
			document.getElementById('picker').style.visibility = 'hidden';
			document.getElementById('color_fondo').disabled=true;
			document.getElementById('color_letra').disabled=true;
			document.getElementById('alto').disabled=true;
			document.getElementById('ancho').disabled=true;
			document.getElementById('borde').disabled=true;

			C.variables['mi_CSS'] = document.getElementById('mi_CSS').checked;
			C.actualizar_configurador(true);
		}
	},
	cambiar_CSS_def: function() {
		C.variables['CSS_def'] = document.getElementById('CSS_def').value;
		C.actualizar_configurador(false);
		if (document.getElementById('CSS_def').value==true) {
			document.getElementById('div_CSS_def').style.color = '#000';
			document.getElementById('picker').style.visibility = 'visible';
			document.getElementById('color_fondo').disabled=false;
			document.getElementById('color_letra').disabled=false;
			document.getElementById('alto').disabled=false;
			document.getElementById('ancho').disabled=false;
			document.getElementById('borde').disabled=false;
			
			C.variables['mi_CSS'] = document.getElementById('mi_CSS').checked;
			C.actualizar_configurador(true);
		}
	},
	cambiar_idioma: function() {
		C.variables['idioma'] = document.getElementById('idioma').value;
		C.actualizar_configurador(true);
	},
	cambiar_localidad: function() {
		C.variables['localidad'] = document.getElementById('localidad').value;
		C.actualizar_configurador(true);
	},
	cambiar_hoy: function() {
		C.variables['hoy'] = document.getElementById('hoy').checked;
		C.actualizar_configurador(true);
	},
	cambiar_manana: function() {
		C.variables['manana'] = document.getElementById('manana').checked;
		C.actualizar_configurador(true);
	},
	cambiar_pasado: function() {
		C.variables['pasado'] = document.getElementById('pasado').checked;
		C.actualizar_configurador(true);
	},
	cambiar_temperatura: function() {
		C.variables['temperatura'] = document.getElementById('temperatura').checked;
		C.actualizar_configurador(true);
	},
	cambiar_temperatura_max_min: function() {
		C.variables['temperaturaMAXMIN'] = document.getElementById('temperaturaMAXMIN').checked;
		C.actualizar_configurador(true);
	},
	cambiar_tam_icono: function() {
		C.variables['tam_icono'] = document.getElementById('tam_icono').value;
		C.actualizar_configurador(true);
	},
	cambiar_tam_texto_desc: function() {
		C.variables['tam_texto_desc'] = document.getElementById('tam_texto_desc').value;
		C.actualizar_configurador(true);
	},
	actualizar_configurador: function(bl_carga_widget) {
		C.genera_codigo_variables(C.variables);
		if (bl_carga_widget) {C.carga_widget()};
		C.rellena_codigo_final();
	},
	genera_codigo_variables: function(obj_variables) {
		C.txt_codigo_variables = '{\n';
		for (var k in obj_variables) {
			var ultima = false;
			if (ultima==true) {
				C.txt_codigo_variables += '\t'+'"'+k+'"'+' : '+'"'+obj_variables[k]+'"'+'\n';
			} else {
				C.txt_codigo_variables += '\t'+'"'+k+'"'+' : '+'"'+obj_variables[k]+'"'+','+'\n';
			}
		}
		C.txt_codigo_variables += '}\n';
	},
	genera_codigo_final: function() {
		C.txt_codigo_final = '<script src="http://txurdi.ath.cx/euskalmet/final.js" type="text/javascript">\n';
		C.txt_codigo_final += C.txt_codigo_variables;
		C.txt_codigo_final += '</script>\n';
	},
	carga_widget: function() {
		document.getElementById('jswidget').removeChild(document.getElementById('jswidget').childNodes[0]);
		var j = document.createElement("script");
		j.type = "text/javascript";
		j.src = 'http://txurdi.ath.cx/euskalmet/final.js';
		j.innerHTML = C.txt_codigo_variables;
		document.getElementById('jswidget').appendChild(j);
	},
	rellena_codigo_final: function() {
		document.getElementById('codigo_generado').innerHTML = '<script src="http://txurdi.ath.cx/euskalmet/final.js" type="text/javascript">\n';
		document.getElementById('codigo_generado').innerHTML += C.txt_codigo_variables;
		document.getElementById('codigo_generado').innerHTML += '</script>\n';
	},
	coger_variables_URL: function () {
		var Url = location.href;
		Url = Url.replace(/.*\?(.*?)/,"$1");
		ar_variables = Url.split ("&");
		if (ar_variables.length>0) {
			var txt_codigo_variables = '{\n';
			for (i = 0; i < ar_variables.length; i++) {
				Separ = ar_variables[i].split("=");
				if ((C.variables_defecto[Separ[0]]) && (C.variables_defecto[Separ[0]] != Separ[1])) {
					var ultima = (i==(ar_variables.length-1));
					if (ultima==true) {
						txt_codigo_variables += '\t'+'"'+Separ[0]+'"'+' : '+'"'+Separ[1]+'"'+'\n';
					} else {
						txt_codigo_variables += '\t'+'"'+Separ[0]+'"'+' : '+'"'+Separ[1]+'"'+','+'\n';
					}
				}
			}
			txt_codigo_variables += '}\n';
			C.txt_codigo_variables = txt_codigo_variables;
		}
	},
	disparar: function () {
		document.getElementById('probar').click();
	},
	cargar_variables_defecto : function() {
		C.variables_defecto = {
			"base_url_img" : C.URL_base_script+'img/',
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
	}
}

function addEvent(obj, evType, fn){
 if (obj.addEventListener){
   obj.addEventListener(evType, fn, false);
   return true;
 } else if (obj.attachEvent){
   var r = obj.attachEvent("on"+evType, fn);
   return r;
 } else {
   return false;
 }
}
addEvent(window, 'load', C.iniciar);


/// La escena que tendrá todo lo que se tiene en cuenta al hacer un render
//  Lo que no esté incluido en la escena no será procesado por el renderer
/*
La librería stats.js te permite controlar el uso de memoria de tu proyecto 
en three.js, muy importante para no consumir excesivamente la memoria 
mientras se ejecuta la animación.
*/
scene = null;
comenzar_juego=false;
/// La variable que referenciará al renderer
renderer = null;

/// El objeto que referencia a la interfaz gráfica de usuario
gui = null;

//contenido del menu
var cMenu = null;
//array parta el menu
var menuArray = [];
//estado del juego
var menuActual = null;
//primera vez que se ejecuta la funcion jugar
var firstTime = true;
//estado pantalla
var showStatus = true;
//menu anterior
var menuprevio = null;
savedTime = null;
requestID = null;
/**
*@enum - posibilidades del menu
*/
const Menus = {
	PRINCIPAL: 0,
	INSTRUCIONES: 1,
	OPCIONES: 2,
};
/**
*@enum - posibilidades al jugat
*/
const estadoJuego = {
	INICIAR: 0,
	MENU_PRINCIPAL: 1,
	PAUSA: 2,
	JUGANDO: 3,
	FIN: 4,
	
};

//VARIABLE PARA CONTROLAR EL ESTADO DEL JUEGO
var estadoActualJuego = null;

Speed = 100;

var keys = {arriba: false, abajo:false, derecha:false, izquierda:false, espacio:false }; 
limiteDerecho=null;
limiteIzquierdo=null;
limiteSuperior=null;
limiteInferior=null;

DespDerecho=0.0;
DespIzquierdo=0.0;
DespSuperior=0.0;
DespInferior=0.0;


//metodos necesarios para el procesamiento de estadisticas con stats
//Crea GUI, agrega informacion estadisticas
/**
*@param widthStats -booleano ara mostrar las estadisticas
*/
function createGUI(widthStats){
	var gui = new dat.GUI();
	//listener
	if(widthStats)
		stats = initStats();
}
//añade estadisticas despues de crer el div
/**
*@return The statistics object
*/

function initStats(){
	var stats = new Stats();
	stats.setMode(0); //0:fps, 1:ms
	
	//Aling top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
		$("#Stats-output").append(stats.domElement);
		
	return stats;
}
/// Se crea y configura un renderer WebGL
/**
 * El renderer recorrerá el grafo de escena para procesarlo y crear la imagen resultante. 
 * Debe hacer este trabajo para cada frame.
 * Si se cambia el grafo de escena después de visualizar un frame, los cambios se verán en el siguiente frame.
 * 
 * @return El renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  // Se establece un color de fondo en las imágenes que genera el render
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  
  // Se establece el tamaño, se aprovoche la totalidad de la ventana del navegador
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;  
}

/// Función que se encarga de renderizar un frame
/**
 * Se renderiza la escena, captada por una cámara.
 */
function render() {
  // Se solicita que La próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
  // La propia función render es la que indica que quiere ejecutarse la proxima vez
  // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
  requestAnimationFrame(render);
  
  // Se le pide a la escena que se actualice antes de ser renderizada
  scene.update();
  
  // Por último, se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
  renderer.render(scene, scene.getCamera());
}

/// Función que actualiza la razón de aspecto de la cámara y el tamaño de la imagen que genera el renderer en función del tamaño que tenga la ventana
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
  
}

function onDocumentKeyUp(event){
  var keyCode = event.which || event.keyCode;
  //PONEMOS A FALSE LAS TECLAS LEVANTADAS DE NUESTRO ARRAY
  if(keyCode == 87){
    keys["arriba"] = false;
  }
  else if(keyCode == 83){
    keys["abajo"] = false;
  }
  else if(keyCode == 65){
    keys["derecha"] = false;
  }
  else if(keyCode == 68){
    keys["izquierda"] = false;
  }
  else if(keyCode == 32){
    keys["espacio"] = false;
  }
}

function onDocumentKeyPress(event){
  var keyCode = event.which ||event.keyCode;
  if(keyCode == 32){
        scene.naveProta.disparar(scene);
  }
}

//Añadimos un listener al script para desplazar nuestra nave por el mapa
function onDocumentKeyDown(event) {

    var keyCode = event.which || event.keyCode;

    //PONEMOS A TRUE LAS TECLAS PULSADAS EN NUESTRO ARRAY
    if(keyCode == 87){
    keys["arriba"] = true;
    }
    else if(keyCode == 83){
      keys["abajo"] = true;
    }
    else if(keyCode == 65){
      keys["derecha"] = true;
    }
    else if(keyCode == 68){
      keys["izquierda"] = true;
    }
    else if(keyCode == 32){
      keys["espacio"] = true;
    }

//DOS TELCAS PULSADAS
    //ARRIBA E IZQDA
    
    if (keys["arriba"] == true && keys["derecha"] == true) {
      if(DespSuperior < limiteSuperior){
        DespSuperior+=Speed;
        scene.naveProta.position.y += Speed;
        DespInferior+=Speed;
      }
      if(DespDerecho < limiteDerecho){
        DespDerecho+=Speed;
        scene.naveProta.position.x += Speed;
        DespIzquierdo+=Speed;
      }
    //ARRIBA Y DERECHA  
    }
    else if (keys["arriba"] == true && keys["izquierda"] == true) {

      if(DespSuperior < limiteSuperior){
        DespSuperior+=Speed;
        scene.naveProta.position.y += Speed;
        DespInferior+=Speed;
      }
      if(DespIzquierdo > limiteIzquierdo){ 
          DespIzquierdo-=Speed; 
          scene.naveProta.position.x -= Speed;
          DespDerecho-=Speed;
        }
    //MOVERSE HACIA ABAJO Y DERECHA    
    } 
    else if (keys["abajo"] == true && keys["derecha"] == true) {

      if(DespInferior > limiteInferior){
        DespInferior-=Speed;
        scene.naveProta.position.y -= Speed;
        DespSuperior-=Speed;
      }
      if(DespDerecho < limiteDerecho){
        DespDerecho+=Speed;
        scene.naveProta.position.x += Speed;
        DespIzquierdo+=Speed;
      }
    //MOVERSE HACIA ABAJO E IZQDA    
    }
    else if (keys["abajo"] == true && keys["izquierda"] == true) {
      if(DespInferior > limiteInferior){
        DespInferior-=Speed;
        scene.naveProta.position.y -= Speed;
        DespSuperior-=Speed;
      }
      if(DespIzquierdo > limiteIzquierdo){ 
          DespIzquierdo-=Speed; 
          scene.naveProta.position.x -= Speed;
          DespDerecho-=Speed;
      }
    }
    
    //MOVERSE HACIA ARRIBA
    else if (keys["arriba"] == true) {
      if(DespSuperior < limiteSuperior){
        DespSuperior+=Speed;
        scene.naveProta.position.y += Speed;
        DespInferior+=Speed;
      }
    //MOVERSE HACIA ABAJO    
    } else if (keys["abajo"] == true) {
      if(DespInferior > limiteInferior){
        DespInferior-=Speed;
        scene.naveProta.position.y -= Speed;
        DespSuperior-=Speed;
      }
    //MOVERSE HACIA LA DERECHA 65
    } else if (keys["derecha"] == true) {
      if(DespDerecho < limiteDerecho){
        DespDerecho+=Speed;
        scene.naveProta.position.x += Speed;
        DespIzquierdo+=Speed;
      }
    //MOVERSE HACIA LA IZQDA 68
    } else if (keys["izquierda"] == true) {
        if(DespIzquierdo > limiteIzquierdo){ 
          DespIzquierdo-=Speed; 
          scene.naveProta.position.x -= Speed;
          DespDerecho-=Speed;
        }
    //SI PULSAMOS EL ESPACIO NUESTRA NAVE DISPARA
    }

/*
    if (keys["espacio"] == true) {
        scene.naveProta.disparar(scene);
    }*/
    //SI PULSAMOS LA T OBTENEMOS EL TIEMPO TRANSCURRIDO
    else if(keyCode == 84){
        scene.reloj.getTiempo();
    }
    //PRUEBA PARA VER COMO SE ELIMINA UNA FIGURA DE LA ESCENA 
    //LO USAREMOS PARA DESTRUIR LAS NAVES
    else if(keyCode == 88){
        scene.remove(scene.naveProta);
		createGUI(true);
        render();
    }

}

//funcion iniciar juego
function jugar(){
  console.log("JUGAAAAR");
	requestAnimationFrame(render);
	
}


/**
 * @param {Menu} menuId - id's del array del menu
 */
//mostrar menú del juego
function opcionesMenu(menuId = Menus.PRINCIPAL){
	//ocultar menuActual
	if(menuId === cMenu){
		menuArray[menuId].hide();
			$('#contenedorPantallaCompleta').show();
			//actualizar
		menuprevio = cMenu;
		cMenu = null;
	//mostrar el menu seleccionado y ocultar el anterior
	//si el menuID está contenido dentrlo del enumerado Menus...
	} else if ( menuId != 0 || menuId < menuArray.length){ 
	//si el menuActual no es null, ocurlatrlo
	if(menuActual != null)
		menuArray[menuActual].hide();
	//muestra el menú con id....
		$('#contenedorPantallaCompleta').show();
		menuArray[menuId].show();
		//actualiza menu actual y anterior(para volver volver atras)
		menuprevio = menuActual;
		menuActual = menuId;
	}
	if(cMenu === Menus.PRINCIPAL)
		estadoActualJuego = estadoJuego.INICIAR;
	
}

//CREACIÓN DE EL MENÚ DEL JUEGO

function crearMenu() {
	//crear cuadrado (div) que será el menú donde estan las distintas opciones
	var contenedorPantallaCompleta = $ ('#contenedorPantallaCompleta')
	//añadimos color y transparencia
	.addClass('w3-contenedor w3-blue')
	//pantalla completa!
	.css ({
		'height': '100vh',
		'width': '100vw',
		/*
		Un elemento fixed (fijo) se posiciona a la ventana 
		del navegador de manera relativa, lo que significa que se 
		mantendrá en el mismo lugar incluso después de hacer 
		scroll en la página.
		*/
		'position': 'fixed',
		'z-index': '10',
		'top': '0',
		'opacity': '0.85'
	}).hide();
	
	//titulo y botones
	var menu =[{
		headingText: 'Space WAR',
		buttonsArray: [
		/*hay que añadir, y la funcion que realice el botn*/
		{text: 'Jugar', func:'jugar()'},
		{text:'Instrucciones', func: 'opcionesMenu(Menus.INSTRUCIONES)'},
		{text:'Opciones'},
		],
	},
	{
		headingText: 'Instrucciones',
		image: {
			src: './imgs/instrucciones.png',
			title: 'Instrucciones',
			alt: 'Instrucciones',
		},
		buttonsArray: [{
			text: 'Atrás', func: 'opcionesMenu(menuprevio)'
		}]
	}
	/*añadir el heading text de cada accion*/
	];
	
	//para cada menu, agregar al html
	menu.forEach(function(contenidoMenu){
		//cuadrado menú
		var cMenu = $('<form>').addClass(
			'menu w3-contenedor w3-text-light-grey w3-center w3-display-middle w3-quarter'
			);
		contenedorPantallaCompleta.append(cMenu);
	//Añadir las etiquetas del menu
	cMenu.append(
		$('<label>').text(contenidoMenu.headingText)
		.addClass(
			'w3-xxlarge w3-margin-bottom w3-panel w3-block w3-round-large w3-teal'
		)
	);
	//añadir los botones al menu
	contenidoMenu.buttonsArray.forEach(function(boton){
		cMenu.append(
			$('<input>').attr({
				'id': (boton.id == undefined? '': boton.id),
				'value': boton.text,
				'onmouseup': boton.func,
				'type': 'button'
			}).addClass('mybutton')
		);
	});
	//para que se vea la imagen de instrucciones
	if(contenidoMenu.image !== undefined)
		cMenu.append(
			$('<img>').attr({
				'src': contenidoMenu.image.src,
				'title': contenidoMenu.image.title,
				'alt': contenidoMenu.image.alt,
			}).width('100%').addClass('w3-margin-bottom w3-round-large')
	);
	
	menuArray.push(cMenu.hide());
	
	});
		
	
}


/// La función principal
$(function () {
  // Se crea el renderer
  renderer = createRenderer();
  
  // La salida del renderer se muestra en un DIV de la página index.html
  $("#WebGL-output").append(renderer.domElement);
  
  //IGUALAMOS LOS LIMITES DESPUES DE CREAR LA VENTANA

  //limiteSuperior=window.screen.height;
  limiteSuperior=Math.tan(22.5 * Math.PI/180)*5000;
  limiteInferior=-limiteSuperior;
  /*var h = limiteSuperior*Math.tan(22.5 * Math.PI/180);
  var b = Math.sqrt(Math.pow(limiteSuperior,2) + Math.pow(5000,2));
  var a =  Math.sqrt( Math.pow(limiteSuperior,2)+Math.pow(h,2));*/
  limiteDerecho= limiteSuperior * (window.innerWidth/window.innerHeight);
  limiteIzquierdo=-limiteDerecho;
  // listeners
  // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener("keydown", onDocumentKeyDown, false);
  window.addEventListener("keyup", onDocumentKeyUp, false);
  window.addEventListener("keypress", onDocumentKeyPress, false);

  // Se crea una interfaz gráfica de usuario vacia
  gui = new dat.GUI();
  
  // Se crea la escena. La escena es una instancia de nuestra propia clase encargada de crear y gestionar todos los elementos que intervienen en la escena.
  scene = new MyScene (renderer.domElement, limiteSuperior, limiteDerecho);
  
  //agregamos el menú de inicio
  crearMenu();
  opcionesMenu(Menus.PRINCIPAL);
  // Finalmente, realizamos el primer renderizado.
  if(comenzar_juego){  
      menuArray.forEach(function(contenidoMenu){
        contenidoMenu.hide();
      });

    render();
     }
  //console.log("VALORES SCREEN : "+ window.screen.width+" "+window.screen.height);
});


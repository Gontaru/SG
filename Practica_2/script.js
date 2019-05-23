
/// La escena que tendrá todo lo que se tiene en cuenta al hacer un render
//  Lo que no esté incluido en la escena no será procesado por el renderer
scene = null;

/// La variable que referenciará al renderer
renderer = null;

/// El objeto que referencia a la interfaz gráfica de usuario
gui = null;

Speed = 100;

limiteDerecho=null;
limiteIzquierdo=null;
limiteSuperior=null;
limiteInferior=null;

DespDerecho=0.0;
DespIzquierdo=0.0;
DespSuperior=0.0;
DespInferior=0.0;
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
//Añadimos un listener al script para desplazar nuestra nave por el mapa
function onDocumentKeyDown(event) {

    var keyCode = event.which || event.keyCode;
    //MOVERSE HACIA ARRIBA
    if (keyCode == 87) {
      if(DespSuperior < limiteSuperior){
        console.log("Valores de desp y limS: "+DespSuperior+" "+limiteSuperior);
        DespSuperior+=Speed;
        scene.model.position.y += Speed;
        DespInferior+=Speed;
      }
    //MOVERSE HACIA ABAJO    
    } else if (keyCode == 83) {
      if(DespInferior > limiteInferior){
        console.log("Valores de desp y limS: "+DespInferior+" "+limiteInferior);
        DespInferior-=Speed;
        scene.model.position.y -= Speed;
        DespSuperior-=Speed;
      }
    //MOVERSE HACIA LA DERECHA
    } else if (keyCode == 65) {
      if(DespDerecho < limiteDerecho){
        DespDerecho+=Speed;
        scene.model.position.x += Speed;
        DespIzquierdo+=Speed;
      }
    //MOVERSE HACIA LA IZQDA
    } else if (keyCode == 68) {
        if(DespIzquierdo > limiteIzquierdo){ 
          DespIzquierdo-=Speed; 
          scene.model.position.x -= Speed;
          DespDerecho-=Speed;
        }
    //SI PULSAMOS EL ESPACIO NUESTRA NAVE DISPARA
    }
     else if (keyCode == 32) {
        scene.model.disparar(scene);
    }
    //SI PULSAMOS LA T OBTENEMOS EL TIEMPO TRANSCURRIDO
    else if(keyCode == 84){
        scene.reloj.getTiempo();
    }
    //PRUEBA PARA VER COMO SE ELIMINA UNA FIGURA DE LA ESCENA 
    //LO USAREMOS PARA DESTRUIR LAS NAVES
    else if(keyCode == 88){
        scene.remove(scene.model);
    }

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

  // Se crea una interfaz gráfica de usuario vacia
  gui = new dat.GUI();
  
  // Se crea la escena. La escena es una instancia de nuestra propia clase encargada de crear y gestionar todos los elementos que intervienen en la escena.
  scene = new MyScene (renderer.domElement);
  
  // Finalmente, realizamos el primer renderizado.
  render();
  //console.log("VALORES SCREEN : "+ window.screen.width+" "+window.screen.height);
});

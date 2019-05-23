 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */
fin_partida = false;

class MyScene extends THREE.Scene {
  constructor (unRenderer) {
    super();

    //crear array para generar naves enemigas
    this.navesEnemigasArray = Array();
    //limite naves enemigas al mismo tiempo
    this.limiteNavesEnemigas = 3;
    //minimo naves enemigas
    this.minimoNavesEnemigas = 0;
    //limites mapa
    this.anchoMapa = 5000;
    this.altoMapa = 5000;
	
    var path = "../Practica_2/imgs/";
	var format = '.jpg';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];
	
	var textureCube = new THREE.CubeTextureLoader().load(urls);

	//MANERA DE HACERLO COMO EN LAS DIAPOSITIVAS
	/*
	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = textureCube;
	
	var material = new THREE.ShaderMaterial ( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});
	
	this.environmentMesh = new THREE.Mesh (new THREE.BoxGeometry( 10000, 10000, 10000), material );
	

	this.add(this.environmentMesh);
	*/
	//MANERA DE HACERLO COMO EN LAS DIAPOSITIVAS
	//FIN

	textureCube.format = THREE.RGBFormat;
	this.background = textureCube;
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.createGUI ();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights();
    
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (500);
    this.add (this.axis);

    this.model = new NuestraNave('naves/naveRebelde/nave_adapted/Arc170.mtl', 'naves/naveRebelde/nave_adapted/Arc170.obj');
    this.nave = new THREE.Object3D();
    this.nave.add(this.model);
    this.nave.rotation.y = -1.60;
    this.add(this.model);
    this.createCamera (unRenderer);

    //MIENTRAS SIGA LA PARTIDA SE GENERAN NAVES ENEMIGAS
    /*while(!fin_partida){
        
    }*/

    this.naveEnemiga = new Modelo('naves/naveImperio/TIE-fighter.mtl', 'naves/naveImperio/TIE-fighter.obj');
    
    //poner más grande modelo nave enemigal
    this.naveEnemiga.scale.y = 10;
    this.naveEnemiga.scale.x = 10;
    this.naveEnemiga.scale.z = 10;    
    this.naveEnemiga.position.x = 0.0;
    this.naveEnemiga.position.z = 0.0;
    this.naveEnemiga.position.y = 0.0;
   // this.add(this.naveEnemiga);
    this.add(this.navesEnemigasArray);

    //AÑADIMOS UN RELOJ PARA VER CUANTO TIEMPO LLEVAMOS DE PARTIDA
    this.reloj = new Reloj();

    }
  
  createCamera (unRenderer) {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    // También se indica dónde se coloca
    this.camera.position.set (this.nave.position.x,this.nave.position.y,/*-4 * ((window.innerWidth/2)/Math.tan(22.5 * Math.PI/180))*/-5000);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (this.nave.position.x,this.nave.position.y,this.nave.position.z);
//    this.camera.getWorldPosition(look);
    this.camera.lookAt(look);
    
    /*this.camera.position.set (this.nave.position.x+750, this.nave.position.y+750, this.nave.position.z);
    // Y hacia dónde mira
    var target = new THREE.Vector3 (this.nave.position.x, this.nave.position.y, this.nave.position.z);

    this.camera.getWorldPosition(target);
    this.camera.lookAt(target);*/
    this.add (this.camera);
    
    //ESTO LUEGO LO QUITAREMOS, YA QUE NUESTRA CAMARA SERA FIJA
    this.cameraControl = new THREE.TrackballControls (this.camera, unRenderer);
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createGUI () {
    // Se definen los controles que se modificarán desde la GUI
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = new function() {
      // En el contexto de una función   this   alude a la función
      this.lightIntensity = 0.5;
      this.axisOnOff = true;
    }

    // Accedemos a la variable global   gui   declarada en   script.js   para añadirle la parte de interfaz que corresponde a los elementos de esta clase
    
    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');
    
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff').name ('Mostrar ejes : ');
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  animate() {
      this.model.animateBullets(this.navesEnemigasArray);
   //   this.crearNavesEnemigas();
      this.navesEnemigasArray.forEach(function(naves) {
          naves.animateEnemiga();
    });
  }

  sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
   }

  crearNavesEnemigas() {

    this.sleep(10000);
      if( this.navesEnemigasArray.length < this.limiteNavesEnemigas && this.minimoNavesEnemigas <= 0 ) {
          var naves = new NaveEnemiga({
              anchoMapa: this.anchoMapa,
              x: randNum(500) - 250,
              z: randNum(500) - 250,
              rotY: randNum(360)
          },);
         // this.add(naves);
          this.navesEnemigasArray.push(naves);
          
         // this.model2.add(this.navesEnemigasArray[this.navesEnemigasArray.length-1].nave);
          this.minimoNavesEnemigas = 200;
          //meter sonido por cada salida de una nave nueva
        }
        this.minimoNavesEnemigas--;
  }
  
  update () {
    // Se actualizan los elementos de la escena para cada frame
    // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
    this.spotLight.intensity = this.guiControls.lightIntensity;
    
    // Se muestran o no los ejes según lo que idique la GUI
    this.axis.visible = this.guiControls.axisOnOff;
    
    // ESTO AL FINAL SE QUITARA
	this.cameraControl.update();
	//UPDATE DE NUESTRA NAVE
    this.model.update();
  	//EL RELOJ TENDRA QUE IR ACTUALIZANDO EL TIEMPO, SI PASAMOS FALSE SE PARA
    this.reloj.update(true);
    // Se actualiza el resto del modelo
    //this.crearNavesEnemigas();
    
    this.navesEnemigasArray.forEach(function(element){
        element.update();
    });
  }
}
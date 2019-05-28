 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */
frecuencia_naves = 10;

class MyScene extends THREE.Scene {
  constructor (unRenderer, limiteV, limiteH) {
    super();

    //Limites de movimiento
    this.limiteVert = limiteV;
    this.limiteHori = limiteH;
    //Controladores de tiempo para la generacion de naves
    this.time = new Date();
    this.cronometro = new Date();

    
    //crear array para generar naves enemigas
    this.navesEscena = Array();
    //limite naves enemigas al mismo tiempo
    this.limiteNavesEnemigas = 10;
    //minimo naves enemigas
	this.navesEnemigasCreadas=0;


    this.audioListener = new THREE.AudioListener();
    this.add(this.audioListener);

    this.sound = new THREE.Audio( this.audioListener);
    this.audioLoader = new THREE.AudioLoader();
    var self = this;
    this.audioLoader.load(
    	'sounds/Ether_Oar.mp3', function(buffer){
    		self.sound.setBuffer(buffer);
    		self.sound.setLoop(true);
    		self.sound.setVolume(0.5);
    		self.sound.play();
    	}
    );

    var path = "../Practica_2/imgs/";
	var format = '.jpg';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];
	
	var textureCube = new THREE.CubeTextureLoader().load(urls);

	textureCube.format = THREE.RGBFormat;
	this.background = textureCube;
    
    this.createLights();
    
    this.naveProta = new NuestraNave('naves/naveRebelde/nave_adapted/Arc170.mtl', 'naves/naveRebelde/nave_adapted/Arc170.obj');
    this.nave = new THREE.Object3D();
    this.nave.add(this.naveProta);
    this.nave.rotation.y = -1.60;
    this.add(this.naveProta);

    this.createCamera (unRenderer);

    }
  
  createCamera (unRenderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
    // También se indica dónde se coloca
    this.camera.position.set (this.nave.position.x,this.nave.position.y,/*-4 * ((window.innerWidth/2)/Math.tan(22.5 * Math.PI/180))*/-5000);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (this.nave.position.x,this.nave.position.y,this.nave.position.z);
//    this.camera.getWorldPosition(look);
    this.camera.lookAt(look);
    
      this.add (this.camera);
   /* 
    //ESTO LUEGO LO QUITAREMOS, YA QUE NUESTRA CAMARA SERA FIJA
    this.cameraControl = new THREE.TrackballControls (this.camera, unRenderer);
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;*/
  }
  
  createLights () {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.65);
    // La añadimos a la escena
    this.add (ambientLight);
    
    this.spotLight = new THREE.SpotLight( 0xffffff, 1.0 );
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

 crearNavesEnemigas() {
      if( this.navesEscena.length < this.limiteNavesEnemigas) {
        	var naves = new NaveEnemiga('naves/naveImperio/naveImperio.mtl', 'naves/naveImperio/naveImperio.obj', this.limiteVert, this.limiteHori); 
          	naves.scale.x = 4;  
	    	naves.scale.y = 4;  
	    	naves.scale.z = 4;
	    	naves.position.x = Math.floor(2*(Math.random() * this.limiteHori) + 1) -this.limiteHori;
			naves.position.z = 40000;
			naves.position.y = Math.floor(2*(Math.random() * this.limiteVert) + 1) -this.limiteVert;

        	this.navesEscena.push(naves);
        	this.add(naves);
        	this.navesEnemigasCreadas++;
        }
  	}

	distancia(x1,y1,z1, x2,y2,z2){
	  	return Math.abs(Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2) + Math.pow(z1-z2, 2)));
  	}

  	detectarImpactoEnemigo(nave){
    	for (var x=0; x<this.navesEscena.length;x++){  			
    		
    		if(this.navesEscena[x] != nave){
    	   		var balas = this.navesEscena[x].getBalas();
    		
    			for (var i=0; i<balas.length; i++){
    				if(this.distancia(nave.position.x, nave.position.y, nave.position.z, balas[i].position.x, balas[i].position.y, balas[i].position.z) 
    					<= this.distancia(nave.position.x+nave.radio, nave.position.y+nave.radio, nave.position.z+nave.radio, nave.position.x, nave.position.y, nave.position.z)){
    					this.remove(balas[i]);
    					if(nave.impacto(this)){
    						this.remove(nave);
    						this.navesEscena.splice(i,1);
    						this.naveProta.navesDestruidas++;
    					}
    				}  			
    			}
    		} 
    	}

  	}

  update () {
        if(this.naveProta.vidas>0){
            
            this.cronometro = new Date();

        	if((this.cronometro.getTime() - this.time.getTime())/1000 > frecuencia_naves){
           		this.time = new Date();
           		this.crearNavesEnemigas();
         	}
            this.naveProta.update(scene);
            this.detectarImpactoEnemigo(this.naveProta);
           

            for (var x=0;x<this.navesEscena.length;x++){
            	if(this.navesEscena[x] != null && this.navesEscena[x].vidas >0){  
                    this.detectarImpactoEnemigo(this.navesEscena[x]);
                    this.navesEscena[x].update(this.naveProta,this);
                }
            }
        }    
    }
        
}

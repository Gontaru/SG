frecuencia_disparo=1;
class Modelo extends THREE.Object3D {
	constructor(mtl, obj){
	super();
	
	this.vidas = 1;
	this.radio = 800;
	
	//CARGADOR Y RELOJ PARA LIMITAR TIEMPO DE DISPARO
	this.reloj = new Date();
	this.reloj2 = new Date();
	this.misBalas = [];

    this.listener = new THREE.AudioListener();
	this.sound = new THREE.Audio( this.listener );
    this.audioLoader = new THREE.AudioLoader();
    this.add( this.listener );
	
	var that = this;
	var loader = new THREE.OBJLoader2();

	loader.loadMtl(mtl , null ,
		function(materials){
			loader.setMaterials( materials);
			loader.setLogging( true , true );
			loader.load( obj  ,
				function(object) {
					var modelo = object.detail.loaderRootNode ; that.add ( modelo ) ;
					} , null , null , null , false );
		});

		this.modelo = new THREE.Mesh(this.object, this.materials);
		this.add(this.modelo);		
	}


	playDisparo(){
		var self = this;
		self.audioLoader.load(
			'sounds/disparo.mp3', function(buffer){
				self.sound.setBuffer(buffer);
				self.sound.isPlaying=false;
				self.sound.setLoop(false);
				self.sound.setVolume(1.0);
				self.sound.play();
			});
	}
	//Creamos la bala que será añadida a la escena, sino seguirá el movimiento de nuestra nave
	disparar(scene){
		if((this.reloj.getTime()-this.reloj2.getTime())/1000 > frecuencia_disparo){
			
			this.reloj2 = new Date();
			this.playDisparo();

			var cilindro = new THREE.CylinderGeometry( 7, 6, 40, 32);
			var material = new THREE.MeshBasicMaterial( {color: 0xF8FF00 } );
			var bala = new THREE.Mesh( cilindro, material );

			bala.position.x = this.position.x;
			bala.position.y = this.position.y;
			bala.position.z = this.position.z;
			bala.rotation.x = 1.505;

			scene.add(bala);
			
			this.misBalas.push(bala);
		}

	}
	//La desplazamos por la escena
	desplazarBalas(balas, sentido){
		if(sentido){
			balas.forEach(function(element){
				element.position.z+=50;
			});
		}
		else{
			balas.forEach(function(element){
				element.position.z-=55;
			});
		}
	}
	getBalas(){
		return this.misBalas;
	}



	//Borramos las que se pierden ya que no queremos acumular figuras por la escena
	balasPerdidas(balas, scene){
		var pos;
		var elementoEliminado;
		balas.forEach(function(element){
			if(element.position.z > 20500 || element.position.z <= 0.0){
				pos = balas.indexOf(element);
				balas.splice(pos, 1);
				element.visible = false;
				scene.remove(element);
			}
		});
	}

	impacto(scene){
		
		this.vidas--;
		if(this.vidas == 0){
			delete this;
			this.visible = false;
			return true;
		}
		return false;
	}
	update(scene, sentido){
		this.desplazarBalas(this.misBalas, sentido);
		this.balasPerdidas(this.misBalas, scene);
 		this.reloj = new Date();

	}
}
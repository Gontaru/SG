
class Modelo extends THREE.Object3D {
	constructor(mtl, obj){
	super();
	this.vidas = 1;
	this.misBalas = [];
	this.radio = 500;
	this.navesDestruidas = 0;

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
	//Creamos la bala que será añadida a la escena, sino seguirá el movimiento de nuestra nave
	disparar(scene){
		var cilindro = new THREE.CylinderGeometry( 7, 6, 40, 32);
		var material = new THREE.MeshBasicMaterial( {color: 0xF8FF00 } );
		var bala = new THREE.Mesh( cilindro, material );
	//	var light = new THREE.PointLight( 0xFE9303, 1, 100 );
		bala.position.x = this.position.x;
		bala.position.y = this.position.y;
		bala.rotation.x = 1.505;
	//	bala.add(light);

		scene.add(bala);
		
		this.misBalas.push(bala);
		

	}
	//La desplazamos por la escena
	desplazarBalas(balas){
		balas.forEach(function(element){
			element.position.z+=50;
		});
	}
	getBalas(){
		return this.misBalas;
	}
	//Borramos las que se pierden ya que no queremos acumular figuras por la escena
	balasPerdidas(balas){
		var pos;
		var elementoEliminado;
		//RECORREMOS EL ARRAY
		/*for(var i=0; i<this.misBalas.length; i++){
			if(this.misBalas[i].position.z > 12000){
				this.misBalas[i].visible(false);
				elementoEliminado = this.misBalas.splice(i, 1); 
			}
		}*/
		balas.forEach(function(element){
			if(element.position.z > 20500){
				pos = balas.indexOf(element);
				balas.splice(pos, 1);
				element.visible = false;
			}
		});
	}

	impacto(scene){
		console.log("IMPACTO!!!");
		this.vidas--;
		if(this.vidas == 0){
			console.log("NAVE DESTRUIDA!!");
			this.visible = false;
			return true;
		}
		return false;
	}
	getX(){
		return this.position.x;
	}
	getY(){
		return this.position.y;
	}
	getZ(){
		return this.position.z;
	}
	
	update(){
		this.desplazarBalas(this.misBalas);
		this.balasPerdidas(this.misBalas);


	}
}
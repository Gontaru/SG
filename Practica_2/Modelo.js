
class Modelo extends THREE.Object3D {
	constructor(mtl, obj){
	super();
	this.vidas = 1;
	this.misBalas = [];
	var that = this;
	var loader = new THREE.OBJLoader2();
	this.radio = 500;
	loader.loadMtl(mtl , null ,
		function(materials){
			loader.setMaterials( materials);
			loader.setLogging( true , true );
			loader.load( obj  ,
				function(object) {
					var modelo = object.detail.loaderRootNode ; that.add ( modelo ) ;
					} , null , null , null , false );
		});

		this.porche = new THREE.Mesh(this.object, this.materials);
		this.add(this.porche);
		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		var material = new THREE.MeshBasicMaterial( {color: 0x03FE2F} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = 500;
		this.add(cube);
	}
	//Creamos la bala que será añadida a la escena, sino seguirá el movimiento de nuestra nave
	disparar(scene){
		var cilindro = new THREE.CylinderGeometry( 7, 6, 40, 32);
		var material = new THREE.MeshBasicMaterial( {color: 0xF8FF00 } );
		var bala = new THREE.Mesh( cilindro, material );
		var light = new THREE.PointLight( 0xFE9303, 1, 100 );
		bala.position.x = this.position.x;
		bala.position.y = this.position.y;
		bala.rotation.x = 1.505;
		bala.add(light);

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
		balas.forEach(function(element){
			if(element.position.z > 10000){
				pos = balas.indexOf(element);
				elementoEliminado = balas.splice(pos, 1); 
			}
		});
	}

	impacto(scene){
		this.vidas--;
		if(this.vidas == 0){
			scene.remove.this;
		}
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
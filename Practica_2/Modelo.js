misBalas=[];
class Modelo extends THREE.Object3D {
	constructor(mtl, obj){
	super();
//	this.misBalas = [];
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

		this.porche = new THREE.Mesh(this.object, this.materials);
		this.add(this.porche);
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
		
		misBalas.push(bala);
		

	}
	//La desplazamos por la escena
	desplazarBalas(){
		misBalas.forEach(function(element){
			element.position.z+=50;
		});
	}
	//Borramos las que se pierden ya que no queremos acumular figuras por la escena
	balasPerdidas(){
		var pos;
		var elementoEliminado;
		//RECORREMOS EL ARRAY
		misBalas.forEach(function(element){
			if(element.position.z > 10000){
				pos = misBalas.indexOf(element);
				elementoEliminado = misBalas.splice(pos, 1); 
			}
		});
	}
	
	update(){
		this.desplazarBalas();
		this.balasPerdidas();


	}
}
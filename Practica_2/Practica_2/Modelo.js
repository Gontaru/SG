
class Modelo extends THREE.Object3D {
	constructor(mtl, obj){
	super();

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
	update(){}
}
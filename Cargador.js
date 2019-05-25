
class Cargador extends THREE.Object3D {
	constructor(){
	super();
	this.misBalas = [];
	this.add(this.porche);
	}
	disparar(){
		var cilindro = new THREE.CylinderGeometry( 7, 6, 40, 32);

		var material = new THREE.MeshBasicMaterial( {color: 0xF8FF00 } );
		var bala = new THREE.Mesh( cilindro, material );
		var light = new THREE.PointLight( 0xFE9303, 1, 100 );
		bala.rotation.x = 1.505;
		bala.add(light);
		this.add(bala);
		this.misBalas.add(bala);
		bala.position.z+=100;
		

	}
	desplazarBalas(){
		this.misBalas.forEach(function(element){
			element.position.z+=100;
		});
	}
	
	update(){
		this.desplazarBalas();

	}
}

class NuestraNave extends Modelo{
	constructor(mtl,obj){
	super(mtl,obj);
	this.vidas=5;
	this.sentido = true;
	this.radio = 500;
	this.navesDestruidas = 0;

	var light = new THREE.PointLight( 0xff0000, 1, 100 );
	light.position.set( this.position.x, this.position.y+20, this.position.z );
	var light_red = new THREE.PointLight( 0xfc4a00, 1, 100 );
	light_red.position.set( this.position.x-5, this.position.y+1, this.position.z );
	var ambientLight = new THREE.AmbientLight(0x0c0c0c);
	this.add( light );
	
	}
	
	update(scene){
		super.update(scene, this.sentido);
	}
}
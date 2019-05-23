//El propósito de "use strict"es indicar que el código debe ejecutarse en "modo estricto".
//Con el modo estricto, no puede, por ejemplo, usar variables no declaradas.
'use strict';
/**
 * parametros nave enemiga
 *
 * @param {Object} parametros 
 * @param {Number} rotationY
 * @param {Number} x - position inicial x
 * @param {Number} z - position inicial z
 * @param {Number} anchoMapa - limite movimientos
 */
 
class NaveEnemiga extends THREE.Object3D {
 constructor(parametros){
	super();

	//atributos
	this.movimiento = true;
	this.contador = 0;
	this.limitemov = randNum(100) + 50;
	this.fadeCont = 0;
	this.tiempoParaVolver = false;
	//limite
	this.widthLimit = parametros.anchoMapa;
	
	var that = this;
	var loader = new THREE.OBJLoader2();
	loader.loadMtl ('naves/naveImperio/TIE-fighter.mtl', null,
		function (materials) {
			loader.setMaterials (materials);
			loader.setLogging (true, true);
			loader.load ('naves/naveImperio/TIE-fighter.obj',
				function (object) {
					var modelo = object.detail.loaderRootNode;
					that.add ( modelo );
				}, null, null, null, false );
		});
		
		this.naveEnemiga = new THREE.Mesh(this.object, this.materials);

		  //poner más grande modelo nave enemigal

		this.naveEnemiga.scale.set (100, 100, 100);
		this.naveEnemiga.position.z = 3000.0;
		
		this.add(this.naveEnemiga);
	}
	
	 /**
		 *
		 * @param {Number} speed
		 */
		moverNave(speed){
			speed *= gameSpeed;
			var newPosX = naveEnemiga.position.x ;
			var newPosZ = naveEnemiga.position.z ;
			var finDeRango = false;
			if(newPosX < this.widthLimit/2 && newPosX > -this.widthLimit/2)
				this.naveEnemiga.position.x = newPosX;
			else
				finDeRango = true;
			if(newPosZ < this.widthLimit/2 && newPosZ > -this.widthLimit/2)
				this.naveEnemiga.position.z = newPosZ;
			else
				finDeRango = true;
			return finDeRango;
		}
		animateEnemiga(){
			if(this.movimiento) {
				this.contador++;
				if(this.moverNave(this.speed)) {
					this.contador = this.limitemov;
				}
				if(this.contador >= limitemov){
					this.movimiento = false;
					this.movimiento = 0;
					this.limitemov = randNum(100) + 50;
				}
				//meter giro
			}
				if(this.tiempoParaVolver){
					this.fadeCont += 2;
					this.naveEnemiga.position.y = this.fadeCont;
				}
		}
		
		goHome() {
			return this.fadeCont;
		}
	
    
  
 
 update(){
 	//this.animateEnemiga();
	 //this.naveEnemiga.update();
 }
 
 }
  
 

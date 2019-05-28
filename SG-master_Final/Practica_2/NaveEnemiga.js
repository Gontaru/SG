
 
class NaveEnemiga extends Modelo {
 constructor(mtl, obj, limiteVert, limiteHori){
	super(mtl, obj);
	this.sentido = false;
	//atributos
	this.limiteVertical = limiteVert;
	this.limiteHorizontal = limiteHori;
	
	}
	
	cazar(objetivo, scene){

			if(Math.abs(objetivo.position.x - this.position.x) < 500 && 
				Math.abs(objetivo.position.y - this.position.y) < 500){
				this.disparar(scene);
			}
			if(Math.abs(this.position.x - objetivo.position.x)>Math.abs(this.position.y - objetivo.position.y)){
				if(this.position.x - objetivo.position.x < 0.0 && this.position.x < this.limiteHorizontal){
					this.position.x+=10;
				}
				if(this.position.x - objetivo.position.x > 0.0 && this.position.x > -this.limiteHorizontal){
					this.position.x-=10;
				}
			}
			else{
				if(objetivo.position.y > this.position.y && this.position.y < this.limiteVertical){
					this.position.y+=10;
				}
				if(objetivo.position.y < this.position.y && this.position.y > this.limiteVertical){
					this.position.y-=10;
				}
			}
			
			
			
	}

	avanzar(){
		this.position.z-=20;
	}

	meta(scene){
		if(this.position.z == 0.0){
			this.position.z-=20;
			scene.remove(this);
			delete this;
			scene.navesEnemigasCreadas--;
		}
	}
	
    
  
 
	 update(objetivo, scene){
	 	this.avanzar();
		this.cazar(objetivo, scene);
	 	this.meta(scene);
	 	super.update(scene, this.sentido);

	 }
	 
 }
  
 


class NuestraNave extends Modelo{
	constructor(mtl,obj){
	super(mtl,obj);

	var light = new THREE.PointLight( 0xff0000, 1, 100 );
	light.position.set( this.position.x, this.position.y+20, this.position.z );
	var light_red = new THREE.PointLight( 0xfc4a00, 1, 100 );
	light_red.position.set( this.position.x-5, this.position.y+1, this.position.z );
	//this.add(light_red);
	var ambientLight = new THREE.AmbientLight(0x0c0c0c);
	//this.add( ambientLight);
	this.add( light );
	
	}
	/*createGUI () {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
     
      this.pos = t;
      this.posX;
      this.posY;
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        
        this.pos = t;
     	this.posX = 0.0;
      	this.posY = 0.0;
      
       
      }
    } 
     var folder = gui.addFolder ('Controles de la nave');
    // Se crea una sección para los controles de la caja
		function onDocumentKeyDown(event) {
		    var keyCode = event.which;
		    if (keyCode == 87) {
		        cube.position.y += ySpeed;
		    } else if (keyCode == 83) {
		        cube.position.y -= ySpeed;
		    } else if (keyCode == 65) {
		        cube.position.x -= xSpeed;
		    } else if (keyCode == 68) {
		        cube.position.x += xSpeed;
		    } else if (keyCode == 32) {
		        cube.position.set(0, 0, 0);
		    }
		};
		
  }*/
  
	update(){
		super.update();
		//Si pulsamos una tecla, nuestra nave procesará el evento
		//folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.1).name ('Posición X : ').listen();
   		//folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.1).name ('Posición Y : ').listen();
   
	//	this.addEventListener("keydown", onDocumentKeyDown(), false);
	}
}

class NuestraNave extends Modelo{
	constructor(){
	super();

	
	}
	createGUI () {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
     
      this.pos = t;
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        
        this.pos = t;
     
       
      }
    } 
    
    // Se crea una sección para los controles de la caja


    
/*
    	folder.addEventListener("keydown", onDocumentKeyDown, false);
		
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
		};*/
  }
	update(){
	}
}
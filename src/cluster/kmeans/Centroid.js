class Centroid{
	constructor (ocean, pos=false){
		this.ocean = ocean;
		// Reset Caching
		for (let a of ocean.agents) {
			a.resetClusterCache();
		}
		this.color = JsUtils.getColor();
		this.assignedAgents = [];
		this.label = "";
		this.initialFontsize = 18;
		this.fontsize = 18;
		this.initialDimension = 26;
		this.dimension = this.initialDimension;
		if(pos){
			//If position is given in options, spawn centroid at that point
			this.pos = new Vect(pos.x,pos.y);
		}else{
			this.pos = new Vect(0, 0);
		}
	}

	/*
	* Calculate new median point between all assigned Agents @assignedAgents
	*/

	rename(){
		// Simply get the middle of array
		var pos = Math.floor(this.assignedAgents.length / 2);
		this.label = this.assignedAgents[pos].__label;
	}

	rearrange(){
		// If no agent is assigned remove myself from list
		//JsUtils.removeObjectIf(this.ocean.clustering.centroids, centr => centr.assignedAgents.length === 0);
		this.rename();
		var x = 0, y = 0;

		for(var i = 0; i < this.assignedAgents.length; i++){
			x+=this.assignedAgents[i].pos.x;
			y+=this.assignedAgents[i].pos.y;
		}
		if(this.assignedAgents.length > 0){
			this.pos.x = x/this.assignedAgents.length;
			this.pos.y = y/this.assignedAgents.length;
		} else {
			this.pos.x = x;
			this.pos.y = y;
		}
	}

	draw() {
	      this.ocean.context.fillStyle = this.color;	
	      this.ocean.context.beginPath();
	      this.ocean.context.arc(this.pos.x, this.pos.y, this.dimension, 0, Math.PI*2, true);
	      this.ocean.context.closePath();
	      this.ocean.context.fill();
	  	  
	  	  this.ocean.context.lineWidth = 1;
          this.ocean.context.strokeStyle = '#000000';
          this.ocean.context.stroke();
          
	      this.ocean.context.textAlign = 'center';
	      this.ocean.context.fillStyle = "#000";
	      this.ocean.context.font = this.fontsize+"px Verdana";
	      this.ocean.context.fillText(this.assignedAgents.length,  this.pos.x,this.pos.y+this.fontsize + 2 + this.dimension);

	}
}

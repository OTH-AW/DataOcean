class InfoView{
	constructor(agent){
		this.agent = agent;
		this.title = this.agent.__label;
		this.visible = false;
		this.pos = new Vect(0,0);
		this.vel = new Vect(0,0);
		this.acc = new Vect(0,0);
		this.padding_left = 20;
		this.padding_top = 20;
		this.initialLineheight = 20;
		this.lineheight = 20;
		this.boxHeight = 0;
		this.boxWidth = 0;
	}


	toggleView(){
		this.visible = !this.visible;
	}

	update(){
		this.checkCorners();
		this.pos.x = this.agent.pos.x;
		this.pos.y = this.agent.pos.y;
		//TODO: spring physics for infoview so it follows the agent in a smooth way
	}

	checkCorners(){
		if(this.pos.x < 0 || this.pos.x > this.agent.agentController.ocean.width){
			this.vel.x*=(-1);
		}
		if(this.pos.y < 0 || this.pos.y > this.agent.agentController.ocean.height){
			this.vel.y*=(-1);
		}
	}

	getTextWidth(){
		//TODO:: Determine the width the infopopup needs to display everything correctly
		var noop = true;
	}

	generateText(){		
		var result = "";
		var context = this.agent.agentController.ocean.ctx;
		var count = 0; //needed because 'i' are keys, not index-values
		this.boxHeight = this.padding_top;
		for(var i in this.agent.props){
			context.fillText(i+": "+this.agent.props[i], this.pos.x+this.padding_left, this.pos.y+this.padding_top+(count++*this.lineheight));
			this.boxHeight+=this.lineheight;
		}
		this.boxHeight+= this.padding_top;
		return result;
	}

	calcWidth(){
		var min = 0;
		var context = this.agent.agentController.ocean.ctx;
		for(var i in this.agent.props){
			var w = context.measureText(i+": "+this.agent.props[i]).width + 2*this.padding_left;
			if(w > min){
				this.boxWidth = w;
				min = w;
			} 
		}
	}

	draw(){
		this.calcWidth();
		var context = this.agent.agentController.ocean.ctx;
		context.beginPath();
		context.rect(this.pos.x, this.pos.y, this.boxWidth, this.boxHeight);
		context.fillStyle = '#eee';
		context.fill();
		context.fillStyle = 'black';
		this.generateText();
		
	}
}
/* ========================================
 *          D A T A  O C E A N
 *        2015-2021 by DIETER MEILLER
 * ======================================== */
 
 class DataOcean {

 	constructor (id) {
 		this.canvas = document.getElementById(id);
 		this.width = window.innerWidth;
 		this.height = window.innerHeight;
		//Agents
		this.agent_id = -1;
		this.agents=[];

		//Schooling values
		this.seperate = 0.1;
		this.align = 0.7;
		this.cohesion = 0.1;
		this.scale=0.6;
		this.animation = true;
		this.clickMode = "info";
		this.clickBuffer = 2; //factor in which range a click/touch can differ from the actual agent's position
		this.wasClicked = false; //for click-enqueuing
		this.clickInfo = {};
		this.chart = new Chart(this);
		//only calculate schooling every "skipSteps"th frame
		this.skipSteps = 2;
		this.currentStep = 0;

		//Using a lattice, so that the agent's forces are only affected by neighboring cells
		//e.g. latticeSize=20 each cell is 20%*20%
		//not using fixed values here to cover responsiveness 
		this.latticeSize = 20;
		this.setLattice();

		this.baits = [];
		
		if (this.canvas && this.canvas.getContext) {
			this.context = this.canvas.getContext("2d");
			this.intervalID = this.intervalID || window.setInterval( () => this.draw(),15);
		} else {
			this.canvas.innerHTML="No Canvas Support.";
		}

		//Clustering
		this.clustering = new KModes(this);
		this.agentController = new AgentController(this);
		return this;
	}

	//since clicks can be done between frames it's not ensured that the lattice has a content
	//this function will enqueue the click handler at the end of the draw function
	prepareClickHandler(event){
		this.clickInfo.x = event.clientX;
		this.clickInfo.y = event.clientY;
		//first get lattice-cell
		this.clickInfo.row = Math.ceil(event.clientX/this.canvas.clientWidth*(100/this.latticeSize))-1;
		this.clickInfo.column = Math.ceil(event.clientY/this.canvas.clientHeight*(100/this.latticeSize))-1;
		this.wasClicked = true;
	}

	toggleCentroid(){
		this.clickMode == "info" ? this.clickMode = "addCentroid" : this.clickMode = "info";
	}
	rescale(val){
		this.scale = val;
		this.agentController.dimension = this.agentController.initialDimension*(parseFloat(val));
		this.agentController.fontSize = this.agentController.initialFontSize*(parseFloat(val));
		for(let i = 0; i < this.agents.length; i++){
			this.agents[i].infoView.lineheight = this.agents[i].infoView.initialLineheight*(parseFloat(val));
		}
		this.clustering.rescale(val);
	}

	getClickedAgent(){
		var cell = this.lattice[this.clickInfo.row][this.clickInfo.column];

		//get clicked agent in that cell
		for(var i = 0; i < cell.length; i++){
			//check if x and y offset is in range of agents dimension with regards to the percentual clickBuffer
			if(Math.abs(this.clickInfo.x - cell[i].pos.x) < this.agentController.dimension*this.clickBuffer
				&& Math.abs(this.clickInfo.y - cell[i].pos.y) < this.agentController.dimension*this.clickBuffer)
			{
				return cell[i];

			}
		}
	
		return null;
	}

	clickHandler(){
		var clicked = this.getClickedAgent();
		if (this.clickMode === "info"){
			clicked.clickHandler();
		}else if(clicked  && this.clickMode === "addCentroid"){
				this.clustering.addCentroid(clicked);
		}
		
	}

	//creating the lattice with the correct number of cells
	setLattice(){
		var cellNumber = Math.ceil(100/this.latticeSize);
		this.lattice = new Array(cellNumber);
		//creating the two-dimensional lattice-array
		for(var i = 0; i < cellNumber; i++){
			this.lattice[i] = new Array(cellNumber);
			for(var j = 0; j < cellNumber; j++){
				//an empty list of agents for each cell
				this.lattice[i][j] = [];
			}
		}
	}

	add(obj) {
		this.agents.push(this.clustering.getAgent(++this.agent_id,this.agentController,this.clustering, Math.random()*this.context.canvas.clientWidth, Math.random()*this.context.canvas.clientHeight,obj));
	}
	removeAll() {
		this.agents = [];
   		this.clustering.centroids = [];
	}
	resizeCanvas (w,h) {
		if (!w) {
			 w =
			document.documentElement.clientWidth
			|| document.body.clientWidth
			|| window.innerWidth;
		}
		if (!h) {
			 h =
			document.documentElement.clientHeight
			|| document.body.clientHeight
			|| window.innerHeight;
		}
		this.canvas.width = w;
		this.canvas.height = h;
		//Move all Agents to Center
		var deltax_half = (this.canvas.width - this.width) / 2;
		var deltay_half = (this.canvas.height - this.height) / 2;
		this.agents.forEach(
			(a) => { a.pos.x += deltax_half; a.pos.y += deltay_half;}
			);
		this.clustering.centroids.forEach(
			(a) => { a.pos.x += deltax_half; a.pos.y += deltay_half;}
			);
		//Remember new Values
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.draw();
	}

	setFullScreen (full) {
		if (full) {
			window.addEventListener('resize', () => this.resizeCanvas() );
			this.resizeCanvas();
		}
		return this;
	}

	draw (){
		this.setLattice();

		this.context.fillStyle = "#ffffff";
		this.context.fillRect(0,0,this.context.canvas.width, this.context.canvas.height);


		//loop over all baits and add force
		for(var i = 0; i < this.baits.length; i++){
			this.baits[i].attract();
		}

		//Draw Agents

		//only calculate new forces every skipSteps'th frame

		//TODO: Lastverteilung der skipSteps auf agents.length/skipSteps-Blöcke
		if(this.currentStep == this.skipSteps){
			this.agents.forEach(
				(a) => {
					a.register();
					if (this.animation) {
						
						if(a.destination){
							//if the agent has a destination, go to that destination
							a.goToDestination();
						}else{
							a.school(this.agents);
						}
						a.update();
						
						this.currentStep = 0;
						this.currentStep++;

					}
					a.draw();
				}
				);
			if(this.animation){
				this.currentStep=0;
			}
		}else{
			//otherwise, only update and draw the agents
			this.agents.forEach(
				(a) => {		
					a.register();
					if(this.animation){
						if(a.destination){
							a.goToDestination();
						}
						a.update();
					}
					a.draw();
				}
				);
			if(this.animation){
				this.currentStep++;
			}
		}
		//drawing info-popups after drawing agents to prevent overlapping
		this.agents.forEach(
			(a) => {
				if (a.infoView.visible) {
					a.drawInfo();
				}
			}
		);
		//Draw Cluster Centroids
		this.clustering.draw();

		if(this.wasClicked){
			this.clickHandler();
			this.wasClicked = false;
		}
	}
}

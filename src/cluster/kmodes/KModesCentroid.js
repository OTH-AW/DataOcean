class KModesCentroid extends Centroid {

	constructor (id, ocean, agent) {
		
		super(ocean, agent.pos);
		this.agent = agent;
		this.totalDistance = this.getTotalDistance(this);
	}

	getTotalDistance(centroid) {
		var total = 0;
		for(var i = 0; i < this.assignedAgents.length; i++){
			total += this.assignedAgents[i].getDistanceToCentroid(centroid);
		}
		return total;
	}
	
	/*
	rearrange() {	
		var rnd = Math.floor(Math.random()*this.assignedAgents.length);
		var rand = { agent: this.assignedAgents[rnd] };
		var total = this.getTotalDistance(rand);
		
		
		if (rand !== undefined && total < this.totalDistance) {
			this.totalDistance = total;
			this.agent = rand.agent;
			this.pos = this.agent.pos;		
		}
	}
	*/
}

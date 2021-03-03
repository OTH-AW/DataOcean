class KModes extends KMeans {
	
	constructor(ocean) {
		super(ocean);
	}		

	/**
	@Override
	**/
	getCentroid(agent) {
		return new KModesCentroid(this.centroids.length, this.ocean, agent);
	}
	getAgent(id, agentController, clustering, x, y, obj){
		return new KModesAgent(id, agentController, clustering, x, y, obj);
	}
}

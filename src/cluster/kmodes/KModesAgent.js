class KModesAgent extends KMeansAgent {
	
 	constructor(id, agentController, clustering, x, y, obj) {
 		super(id, agentController, clustering, x, y, obj);
	}

	/**
	@Override
	*/
	getDistanceToCentroid(centroid) {
		return 1.0 - this.similarTo(centroid.agent, true);
	}
}

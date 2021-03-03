class KMeansAgent extends ForceAgent {
	
 	constructor(id, agentController, clustering, x, y, obj) {
 		super(id, agentController, x, y, obj);
		this.clustering = clustering;
		this.assignedCentroid = null;
	}
	/**
	@overrride
	**/
	draw() {
		this.assignToCentroid();
		super.draw();
	}
	/**
	@override
	**/
	howSimilarIs(other) {
		if (this !== other && this.assignedCentroid !== null 
	         && this.assignedCentroid === other.assignedCentroid) {
			return 3;
		} else {
			return this.similarTo(other, true);
		}
	}	
	getDistanceToCentroid(centroid) {
		 return VectMath.getLengthSq(VectMath.subtract(this.pos, centroid.pos));

	}
	getNearestCentroid() {
		    var nearestCentroid = null;
		    var minDistance = Infinity;
		    for(var i = 0; i < this.clustering.centroids.length; i++){
		      var dist = this.getDistanceToCentroid(this.clustering.centroids[i]);
			if(dist < minDistance){
			minDistance = dist;
			nearestCentroid = this.clustering.centroids[i];
		      }
		    }
		   return nearestCentroid;
	}

	//Assigns itself to the nearest Centroid and deletes itself from a centroid, if it was assigned beforehand
	assignToCentroid(){
        var nearestCentroid = this.getNearestCentroid();
	    //only reassign if the selected centroid isnt the assigned anyway
	    if(this.assignedCentroid != nearestCentroid){
	      if(!this.assignedCentroid){
			this.assignedCentroid = nearestCentroid;
			if(nearestCentroid) {
				nearestCentroid.assignedAgents.push(this);
			}
	      }else{
			JsUtils.removeObject(this.assignedCentroid.assignedAgents,this);
			this.assignedCentroid = nearestCentroid;
			if(nearestCentroid) {
				nearestCentroid.assignedAgents.push(this);
			}
	      }
	    }
	  }
}

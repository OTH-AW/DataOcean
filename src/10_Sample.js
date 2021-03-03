class Sample {
	constructor(id, obj) {
	    //Copy all properties
	    this.props = {};
	    this.props.__id = id;
	    for (var p in obj) {
	      if (p === 'label') {
			this.__label = obj[p];
	      } else {
	      	this.props[p] = obj[p];
	  	  }
	    }
	    // Caching similarity;
	    this.similarity = {};	
	    this.cluster_similarity = {};		
	}
	resetClusterCache() {
		 this.cluster_similarity = {};
	}
  	//Compare properties of two agents without caching
	  _similarTo(other, isClustering = false) {
	  	var not_similar = 1;	
	    for (var p in this.props) {
	    	if (!isClustering) {
				if (p.charAt(0) === "_") {
					continue;
				} 
			} else { // check cluster similarity
				if (p.charAt(p.length - 1) !== "_") {
					continue;
				}
				if (this.cluster_similarity[other.props.__id] !== undefined) {
					return this.cluster_similarity[other.props.__id];
				}
			} 
		if (this.props[p] !== other.props[p]) {
			
				var not_sim = 0;
				var _this = parseFloat(this.props[p]);
				var _other = parseFloat(other.props[p]);

				if (!isNaN(_this) && !isNaN(_other)) {
					not_sim = Math.abs(_this - _other)	
				} else {
					not_sim = StringMetrics.levenshteinDistanceFast(String(this.props[p]),  String(other.props[p]));
					//not_sim = not_sim / 10;
				}
				not_similar += not_sim;
			}
		}
		var value = 1 / not_similar;
		if (isClustering) {
			this.cluster_similarity[other.props.__id] = value;
		}
		return value;
	  }
	//Compare properties of two agents with caching
	  similarTo(other, isClustering = false) {
		if (isClustering) {
			return this._similarTo(other, true);
		} else {
			// global caching
			if (this.similarity[other.props.__id] === undefined) {
			    this.similarity[other.props.__id] = this._similarTo(other, false);
			}

			return  this.similarity[other.props.__id];
		}
	  }

	  howSimilarIs(other) {
		return this.similarTo(other);  
	  }

}


 class Bait {
 	constructor (options) {
 		this.toAttract = options.toAttract;
 		this.ocean = options.ocean;
 		this.position = new Vect(options.x, options.y);
 		/*
			example toAttract-object
			toAttract:[
				{
					propertyName: label,
					propertyValue: 'Nr.:1',
					propertyWeight: 1
				},{
					propertyName: height,
					propertyValue: 50,
					propertyWeight: 1,
					propertyTolerance:.25 //+-25% from 50
				}

			]
 		*/
 		this.strength = 3; //number of times it sums up forces on the agents
 	}

 	attract(){
 		//searches for agents with matching criteria and tells them to arrive at own position
 		for(var agentIndex in this.ocean.agents){
 			var agent = this.ocean.agents[agentIndex];
 			for(var criteriaIndex in this.toAttract){
 				var criteria = this.toAttract[criteriaIndex];
 				//check each criteria
 				if(agent.props[criteria.propertyName] === criteria.propertyValue){
 					agent.arrive(this.position);
 				}
 			}
 		}
 	}


 }
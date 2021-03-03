class Chart{
	constructor(ocean){
		this.ocean = ocean;
	}

	alignMedian(){
		//set destination for all agents
		var w = window.innerWidth;
		var h = window.innerHeight;

		var maxX=0, maxY=0;
		//get maximum values, for mapping
		this.ocean.agents.forEach(
			(a)=>{
				if(a.props['prop'] > maxX) maxX = a.props['prop'];
				if(a.props['prop2'] > maxY) maxY = a.props['prop2'];
			}
			)
		//x-axis = prop1, y = prop2
		this.ocean.agents.forEach(
			(a)=>{
				var x = MathUtils.map(a.props['prop'], 0, maxX, 0, w);
				var y = MathUtils.map(a.props['prop2'], 0, maxY, 0, h);
				
				a.destination = new Vect(x,y);
			}
			);

		//TODO: if > 2 properties, median of halfs, rounding up/down if odd amoung
	}
}
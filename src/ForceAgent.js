class ForceAgent extends DrawableSample {

 constructor(id, agentController, x, y, obj) {
    super(id, agentController, x, y, obj) ;
  this.fSpring=3000.0;
  this.fRep=600.0;
    this.dir=new Vect(0,0); //Initial Speed
    this.destination = null;
  }


  setDestination(destination){
    this.destination = destination;
  }
  removeDestination(){
    this.destination = null;
  }

  //going to a destination, but still add separation, so agents don't overap
  goToDestination(){
    if(!this.destination) return;
    return true;
  }

  // Applys Spring Algo
  school(agents) {
    //var neighbors = this.getNeighbors(this.column, this.row);
    var neighbors = this.agentController.ocean.agents;
    this.cohesion(neighbors);
    this.separate(neighbors);
    this.pos = VectMath.add(this.pos, this.dir);
    this.dir = new Vect(0,0);
  }

  cohesion(agents) { // Spring
    var size = agents.length;
    var strength =  ( 1 / Math.sqrt(size + 1)) * 0.8 ;
    agents.forEach( (other) => {
      var simi = this.similarTo(other);
      if (other.props.__id !== this.props.__id ){
       var diff = VectMath.subtract(this.pos,other.pos);
        var lensq = VectMath.getLengthSq(diff);
        var force= Math.log(lensq/this.fSpring ) * simi * strength;
        var normal = VectMath.normalize(diff);
        var f = VectMath.scalarMultiply(normal, force);
        this.dir = VectMath.subtract(this.dir, f);
        other.dir = VectMath.add(other.dir, f);
      
  }
    });
 }

  separate(agents) { //Repulsion

    agents.forEach( (other) => {
      if (other !== this){
       var dist = VectMath.subtract(this.pos,other.pos);
       var diff = dist;
       var lensq = VectMath.getLengthSq(diff);
       var force =  lensq > 0 ? 16 * this.fRep/lensq : 0.0;
       force = force > 10 ? 10 : force;
       var normal = VectMath.normalize(dist);
       var f = VectMath.scalarMultiply(normal, force);

       this.dir = VectMath.add(this.dir, f);
    }
  });
  }

update() {
    //super.update();

  }

}

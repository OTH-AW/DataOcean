class Agent extends DrawableSample {

 constructor(id, agentController, x, y, obj) {
    super(id, agentController, x, y, obj) ;

    this.dir=new Vect(2,0); //Initial Speed
    this.dir = VectMath.rotate(this.dir,Math.random()*360);
    this.acceleration = new Vect(0,0);
    //if destination is set, agent will seek/arrive at that position
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
    var neighbors = this.getNeighbors(this.column,this.row);

    this.arrive(this.destination);
    var separation = this.separate(neighbors);
    separation = VectMath.scalarMultiply(separation, this.agentController.ocean.seperate);
    this.acceleration = VectMath.add(this.acceleration, separation);
    return true;
  }

  // Applys Schooling Algo
  //Like Shiffman Nature of Code
  school(agents) {
    var neighbors = this.getNeighbors(this.column,this.row);

    var s = this.separate(neighbors);
    s = VectMath.scalarMultiply(s,this.agentController.ocean.seperate);
    var a = this.align(neighbors);
    a = VectMath.scalarMultiply(a,this.agentController.ocean.align);
    var c = this.cohesion(neighbors);
    c = VectMath.scalarMultiply(c,this.agentController.ocean.cohesion);
    this.acceleration = VectMath.add(this.acceleration, s);
    this.acceleration = VectMath.add(this.acceleration, a);
    this.acceleration = VectMath.add(this.acceleration, c);
  }

  separate(agents) {
    var desiredseparationSq = 625.0;
    var count = 0;
    var steer = new Vect(0,0);
    agents.forEach( (other) => {
      if (other !== this){
        var diff = VectMath.subtract(this.pos,other.pos);
        var dist = VectMath.getLengthSq(diff);
        if ((dist > 0) && (dist < desiredseparationSq)) {
          diff = VectMath.normalize(diff);
	  // if not similar they ignore each other
          steer = VectMath.add(steer,VectMath.scalarMultiply(diff,this._howSimilarIs(other)));
          count++;
        }
      }
    });
    if (count > 0) {
      VectMath.scalarMultiply(steer,1/count);
    }
    if (VectMath.getLengthSq(steer) > 0) {
      steer = VectMath.normalize(steer);
      steer = VectMath.scalarMultiply(steer,this.agentController.maxspeed);
      steer = VectMath.subtract(steer,this.dir);
      //steer = VectMath.limit(steer, this.maxforce);
    }
    return steer;
  }


  alignColorTo(other) {
    //TODO: Label color?
  }
  _howSimilarIs(other) {
    if (this.assignedCentroid === other.assignedCentroid && this.assignedCentroid!== undefined && this.assignedCentroid != null) {
      return 100;
    } else {
      return super.howSimilarIs(other);
    }
  }
  align(agents) {
    var neighbordistSq = 2500;
    var sum = new Vect(0,0);
    var count = 0;
    agents.forEach( (other) => {
      var diff = VectMath.subtract(this.pos,other.pos);
      var dist = VectMath.getLengthSq(diff);
      if ((dist > 0) && (dist < neighbordistSq) ) {
        sum = VectMath.add(sum, VectMath.scalarMultiply(other.dir,this._howSimilarIs(other)));
        //sum = VectMath.add(sum, other.dir);
        this.alignColorTo(other);
        count++;
      }
    });
    if (count > 0 && !(sum.x == 0 && sum.y == 0)) {
      sum = VectMath.normalize(sum);
      sum = VectMath.scalarMultiply(sum, this.agentController.maxspeed);
      var steer = VectMath.subtract(sum, this.dir);
      //steer = VectMath.limit(steer, this.maxforce);
      return steer;
    } else {
      return new Vect(0,0);
    }
  }
  //support method
  seek(target) {
    var desired = VectMath.subtract(target,this.pos);
    desired = VectMath.normalize(desired);
    desired = VectMath.scalarMultiply(desired, this.agentController.maxspeed);
    desired = VectMath.subtract(desired, this.dir);
    desired = VectMath.limit(desired, this.agentController.maxforce);
    return desired;
  }

  arrive(target){
    var desired = VectMath.subtract(target,this.pos);
    var diff = VectMath.getLength(desired);
    desired = VectMath.normalize(desired);

      //100 als Kennzeichner zum langsamer werden
      if (diff < 100) {
        var m = MathUtils.map(diff,0,100,0,this.agentController.maxspeed);
        desired = VectMath.scalarMultiply(desired,m);
      } else {
        desired = VectMath.scalarMultiply(desired,this.agentController.maxspeed);
      }
      desired = VectMath.subtract(desired,this.dir);
      desired = VectMath.limit(desired,this.agentController.maxforce);

      this.acceleration = VectMath.add(this.acceleration, desired);
    }

    cohesion(agents) {
      var neighbordistSq = 2500;
      var sum = new Vect(0,0);
      var count = 0;
      agents.forEach( (other) => {
       var diff = VectMath.subtract(this.pos,other.pos);
       var dist = VectMath.getLengthSq(diff);
       if (dist > 0 && dist < neighbordistSq && this._howSimilarIs(other) > 0.5 ) {
          sum = VectMath.add(sum, other.pos);
        //sum = VectMath.add(sum, VectMath.scalarMultiply(other.dir,this._howSimilarIs(other)));
        count++;
      }
    });
      if (count > 0) {
       sum = VectMath.scalarMultiply(sum,1/count);
       return this.seek(sum);
     } else {
       return new Vect(0,0);
     }
   }

  update() {
      super.update();
      //Move
      this.dir = VectMath.add(this.dir, this.acceleration);
      this.dir = VectMath.limit(this.dir, this.agentController.maxspeed);
      this.acceleration = new Vect(0,0);
      this.pos = VectMath.add(this.pos, this.dir);
    }

  }

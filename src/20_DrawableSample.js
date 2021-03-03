class DrawableSample extends Sample {

 constructor(id, agentController, x, y, obj) {
    super(id, obj);
    //column and row of the lattice-grid
    this.agentController = agentController;
    this.context = agentController.ocean.context;
    this.column = undefined;
    this.row = undefined;
    this.infoView = new InfoView(this);
    this.context.font = "11px Verdana";

    this.pos=new Vect(x,y);
  }

  clickHandler(){
    //toggle infoview
    //this.infoView.toggleView();
    //log.clear();
    //log.println(this.similarity);	
    log.println(this.props);	
  }


  //Agent registers itself in the right cell from the lattice
  register(){
    var column = Math.ceil(this.pos.x/this.context.canvas.clientWidth*(100/this.agentController.ocean.latticeSize))-1;
    var row = Math.ceil(this.pos.y/this.context.canvas.clientHeight*(100/this.agentController.ocean.latticeSize))-1;
    if(column >=0 && row >= 0 && column < 100/this.agentController.ocean.latticeSize && row < 100/this.agentController.ocean.latticeSize){
      //only update the column and row for valid values
      this.column = column;
      this.row = row;
      this.agentController.ocean.lattice[column][row].push(this);
    }
  }

  //A function which returns an array of agents, which are in neighboring lattice-cells
  getNeighbors(col, row){
    var res = [];
    //left border
    if(col > 0){
      this.agentController.ocean.lattice[col-1][row].forEach( (agent) =>{
        res.push(agent);
      });
    }
    //right border
    if(col < (100/ocean.latticeSize)-1){
      this.agentController.ocean.lattice[col+1][row].forEach( (agent) =>{
        res.push(agent);
      });
    }
    //upper border
    if(row > 0){
      this.agentController.ocean.lattice[col][row-1].forEach( (agent) => {
        res.push(agent);
      });
    }
    //lower border
    if(row < (100/ocean.latticeSize)-1){
      this.agentController.ocean.lattice[col][row+1].forEach( (agent) =>{
        res.push(agent);
      });
    }
    //upper left corner
    if(row > 0 && col > 0){
      this.agentController.ocean.lattice[col-1][row-1].forEach( (agent) => {
        res.push(agent);
      });
    }
    //upper right corner
    if(row > 0 && col < (100/ocean.latticeSize)-1){
      this.agentController.ocean.lattice[col+1][row-1].forEach( (agent) => {
        res.push(agent);
      });
    }
    //lower left corner
    if(row < (100/ocean.latticeSize)-1 && col > 0){
      this.agentController.ocean.lattice[col-1][row+1].forEach( (agent) => {
        res.push(agent);
      });
    }
    //lower right corner
    if(row < (100/ocean.latticeSize)-1 && col < (100/ocean.latticeSize)-1){
      this.agentController.ocean.lattice[col+1][row+1].forEach( (agent) => {
        res.push(agent);
      });
    }
    //own cell
    this.agentController.ocean.lattice[col][row].forEach( (agent) => {
      res.push(agent);
    });
    return res;
  }


   draw(){
    this.context.fillStyle = "#333333";
    this.context.font = this.agentController.fontSize+"px Verdana";
    this.context.textAlign = 'center';
      //If Agent is assigned to a centroid, use its color
      if(this.assignedCentroid){
        this.context.fillStyle = this.assignedCentroid.color;
      }
      //Circle
      this.context.beginPath();
      this.context.arc(this.pos.x, this.pos.y, this.agentController.dimension, 0, Math.PI*2, true);
      this.context.closePath();
      this.context.fill();
      //Text
      this.context.fillText(this.__label, this.pos.x,this.pos.y+this.agentController.dimension+this.agentController.fontSize);
      this.context.beginPath();
      this.context.moveTo(this.pos.x,this.pos.y);
    }

    drawInfo(){
     //draw infoview if visible
     this.context.font = this.agentController.fontSize+"px Verdana";
     this.context.textAlign = 'left';
     if(this.infoView.visible){
        this.infoView.update();
        this.infoView.draw();
      }
    }
  update() {
      //Out of Bounds?
      if (this.pos.x > this.context.canvas.width+10) this.pos.x = -30;
      if (this.pos.y > this.context.canvas.height+10) this.pos.y = -30;
      if (this.pos.x < -30) this.pos.x = this.context.canvas.width+10;
      if (this.pos.y < -30) this.pos.y = this.context.canvas.height+10;
    }

  }

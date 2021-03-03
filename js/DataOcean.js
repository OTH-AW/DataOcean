"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sample = function () {
	function Sample(id, obj) {
		_classCallCheck(this, Sample);

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

	_createClass(Sample, [{
		key: "resetClusterCache",
		value: function resetClusterCache() {
			this.cluster_similarity = {};
		}
		//Compare properties of two agents without caching

	}, {
		key: "_similarTo",
		value: function _similarTo(other) {
			var isClustering = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var not_similar = 1;
			for (var p in this.props) {
				if (!isClustering) {
					if (p.charAt(0) === "_") {
						continue;
					}
				} else {
					// check cluster similarity
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
						not_sim = Math.abs(_this - _other);
					} else {
						not_sim = StringMetrics.levenshteinDistanceFast(String(this.props[p]), String(other.props[p]));
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

	}, {
		key: "similarTo",
		value: function similarTo(other) {
			var isClustering = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (isClustering) {
				return this._similarTo(other, true);
			} else {
				// global caching
				if (this.similarity[other.props.__id] === undefined) {
					this.similarity[other.props.__id] = this._similarTo(other, false);
				}

				return this.similarity[other.props.__id];
			}
		}
	}, {
		key: "howSimilarIs",
		value: function howSimilarIs(other) {
			return this.similarTo(other);
		}
	}]);

	return Sample;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawableSample = function (_Sample) {
  _inherits(DrawableSample, _Sample);

  function DrawableSample(id, agentController, x, y, obj) {
    _classCallCheck(this, DrawableSample);

    //column and row of the lattice-grid
    var _this = _possibleConstructorReturn(this, (DrawableSample.__proto__ || Object.getPrototypeOf(DrawableSample)).call(this, id, obj));

    _this.agentController = agentController;
    _this.context = agentController.ocean.context;
    _this.column = undefined;
    _this.row = undefined;
    _this.infoView = new InfoView(_this);
    _this.context.font = "11px Verdana";

    _this.pos = new Vect(x, y);
    return _this;
  }

  _createClass(DrawableSample, [{
    key: "clickHandler",
    value: function clickHandler() {
      //toggle infoview
      //this.infoView.toggleView();
      //log.clear();
      //log.println(this.similarity);	
      log.println(this.props);
    }

    //Agent registers itself in the right cell from the lattice

  }, {
    key: "register",
    value: function register() {
      var column = Math.ceil(this.pos.x / this.context.canvas.clientWidth * (100 / this.agentController.ocean.latticeSize)) - 1;
      var row = Math.ceil(this.pos.y / this.context.canvas.clientHeight * (100 / this.agentController.ocean.latticeSize)) - 1;
      if (column >= 0 && row >= 0 && column < 100 / this.agentController.ocean.latticeSize && row < 100 / this.agentController.ocean.latticeSize) {
        //only update the column and row for valid values
        this.column = column;
        this.row = row;
        this.agentController.ocean.lattice[column][row].push(this);
      }
    }

    //A function which returns an array of agents, which are in neighboring lattice-cells

  }, {
    key: "getNeighbors",
    value: function getNeighbors(col, row) {
      var res = [];
      //left border
      if (col > 0) {
        this.agentController.ocean.lattice[col - 1][row].forEach(function (agent) {
          res.push(agent);
        });
      }
      //right border
      if (col < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col + 1][row].forEach(function (agent) {
          res.push(agent);
        });
      }
      //upper border
      if (row > 0) {
        this.agentController.ocean.lattice[col][row - 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //lower border
      if (row < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col][row + 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //upper left corner
      if (row > 0 && col > 0) {
        this.agentController.ocean.lattice[col - 1][row - 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //upper right corner
      if (row > 0 && col < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col + 1][row - 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //lower left corner
      if (row < 100 / ocean.latticeSize - 1 && col > 0) {
        this.agentController.ocean.lattice[col - 1][row + 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //lower right corner
      if (row < 100 / ocean.latticeSize - 1 && col < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col + 1][row + 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //own cell
      this.agentController.ocean.lattice[col][row].forEach(function (agent) {
        res.push(agent);
      });
      return res;
    }
  }, {
    key: "draw",
    value: function draw() {
      this.context.fillStyle = "#333333";
      this.context.font = this.agentController.fontSize + "px Verdana";
      this.context.textAlign = 'center';
      //If Agent is assigned to a centroid, use its color
      if (this.assignedCentroid) {
        this.context.fillStyle = this.assignedCentroid.color;
      }
      //Circle
      this.context.beginPath();
      this.context.arc(this.pos.x, this.pos.y, this.agentController.dimension, 0, Math.PI * 2, true);
      this.context.closePath();
      this.context.fill();
      //Text
      this.context.fillText(this.__label, this.pos.x, this.pos.y + this.agentController.dimension + this.agentController.fontSize);
      this.context.beginPath();
      this.context.moveTo(this.pos.x, this.pos.y);
    }
  }, {
    key: "drawInfo",
    value: function drawInfo() {
      //draw infoview if visible
      this.context.font = this.agentController.fontSize + "px Verdana";
      this.context.textAlign = 'left';
      if (this.infoView.visible) {
        this.infoView.update();
        this.infoView.draw();
      }
    }
  }, {
    key: "update",
    value: function update() {
      //Out of Bounds?
      if (this.pos.x > this.context.canvas.width + 10) this.pos.x = -30;
      if (this.pos.y > this.context.canvas.height + 10) this.pos.y = -30;
      if (this.pos.x < -30) this.pos.x = this.context.canvas.width + 10;
      if (this.pos.y < -30) this.pos.y = this.context.canvas.height + 10;
    }
  }]);

  return DrawableSample;
}(Sample);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Agent = function (_DrawableSample) {
  _inherits(Agent, _DrawableSample);

  function Agent(id, agentController, x, y, obj) {
    _classCallCheck(this, Agent);

    var _this = _possibleConstructorReturn(this, (Agent.__proto__ || Object.getPrototypeOf(Agent)).call(this, id, agentController, x, y, obj));

    _this.dir = new Vect(2, 0); //Initial Speed
    _this.dir = VectMath.rotate(_this.dir, Math.random() * 360);
    _this.acceleration = new Vect(0, 0);
    //if destination is set, agent will seek/arrive at that position
    _this.destination = null;
    return _this;
  }

  _createClass(Agent, [{
    key: "setDestination",
    value: function setDestination(destination) {
      this.destination = destination;
    }
  }, {
    key: "removeDestination",
    value: function removeDestination() {
      this.destination = null;
    }

    //going to a destination, but still add separation, so agents don't overap

  }, {
    key: "goToDestination",
    value: function goToDestination() {
      if (!this.destination) return;
      var neighbors = this.getNeighbors(this.column, this.row);

      this.arrive(this.destination);
      var separation = this.separate(neighbors);
      separation = VectMath.scalarMultiply(separation, this.agentController.ocean.seperate);
      this.acceleration = VectMath.add(this.acceleration, separation);
      return true;
    }

    // Applys Schooling Algo
    //Like Shiffman Nature of Code

  }, {
    key: "school",
    value: function school(agents) {
      var neighbors = this.getNeighbors(this.column, this.row);

      var s = this.separate(neighbors);
      s = VectMath.scalarMultiply(s, this.agentController.ocean.seperate);
      var a = this.align(neighbors);
      a = VectMath.scalarMultiply(a, this.agentController.ocean.align);
      var c = this.cohesion(neighbors);
      c = VectMath.scalarMultiply(c, this.agentController.ocean.cohesion);
      this.acceleration = VectMath.add(this.acceleration, s);
      this.acceleration = VectMath.add(this.acceleration, a);
      this.acceleration = VectMath.add(this.acceleration, c);
    }
  }, {
    key: "separate",
    value: function separate(agents) {
      var _this2 = this;

      var desiredseparationSq = 625.0;
      var count = 0;
      var steer = new Vect(0, 0);
      agents.forEach(function (other) {
        if (other !== _this2) {
          var diff = VectMath.subtract(_this2.pos, other.pos);
          var dist = VectMath.getLengthSq(diff);
          if (dist > 0 && dist < desiredseparationSq) {
            diff = VectMath.normalize(diff);
            // if not similar they ignore each other
            steer = VectMath.add(steer, VectMath.scalarMultiply(diff, _this2._howSimilarIs(other)));
            count++;
          }
        }
      });
      if (count > 0) {
        VectMath.scalarMultiply(steer, 1 / count);
      }
      if (VectMath.getLengthSq(steer) > 0) {
        steer = VectMath.normalize(steer);
        steer = VectMath.scalarMultiply(steer, this.agentController.maxspeed);
        steer = VectMath.subtract(steer, this.dir);
        //steer = VectMath.limit(steer, this.maxforce);
      }
      return steer;
    }
  }, {
    key: "alignColorTo",
    value: function alignColorTo(other) {
      //TODO: Label color?
    }
  }, {
    key: "_howSimilarIs",
    value: function _howSimilarIs(other) {
      if (this.assignedCentroid === other.assignedCentroid && this.assignedCentroid !== undefined && this.assignedCentroid != null) {
        return 100;
      } else {
        return _get(Agent.prototype.__proto__ || Object.getPrototypeOf(Agent.prototype), "howSimilarIs", this).call(this, other);
      }
    }
  }, {
    key: "align",
    value: function align(agents) {
      var _this3 = this;

      var neighbordistSq = 2500;
      var sum = new Vect(0, 0);
      var count = 0;
      agents.forEach(function (other) {
        var diff = VectMath.subtract(_this3.pos, other.pos);
        var dist = VectMath.getLengthSq(diff);
        if (dist > 0 && dist < neighbordistSq) {
          sum = VectMath.add(sum, VectMath.scalarMultiply(other.dir, _this3._howSimilarIs(other)));
          //sum = VectMath.add(sum, other.dir);
          _this3.alignColorTo(other);
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
        return new Vect(0, 0);
      }
    }
    //support method

  }, {
    key: "seek",
    value: function seek(target) {
      var desired = VectMath.subtract(target, this.pos);
      desired = VectMath.normalize(desired);
      desired = VectMath.scalarMultiply(desired, this.agentController.maxspeed);
      desired = VectMath.subtract(desired, this.dir);
      desired = VectMath.limit(desired, this.agentController.maxforce);
      return desired;
    }
  }, {
    key: "arrive",
    value: function arrive(target) {
      var desired = VectMath.subtract(target, this.pos);
      var diff = VectMath.getLength(desired);
      desired = VectMath.normalize(desired);

      //100 als Kennzeichner zum langsamer werden
      if (diff < 100) {
        var m = MathUtils.map(diff, 0, 100, 0, this.agentController.maxspeed);
        desired = VectMath.scalarMultiply(desired, m);
      } else {
        desired = VectMath.scalarMultiply(desired, this.agentController.maxspeed);
      }
      desired = VectMath.subtract(desired, this.dir);
      desired = VectMath.limit(desired, this.agentController.maxforce);

      this.acceleration = VectMath.add(this.acceleration, desired);
    }
  }, {
    key: "cohesion",
    value: function cohesion(agents) {
      var _this4 = this;

      var neighbordistSq = 2500;
      var sum = new Vect(0, 0);
      var count = 0;
      agents.forEach(function (other) {
        var diff = VectMath.subtract(_this4.pos, other.pos);
        var dist = VectMath.getLengthSq(diff);
        if (dist > 0 && dist < neighbordistSq && _this4._howSimilarIs(other) > 0.5) {
          sum = VectMath.add(sum, other.pos);
          //sum = VectMath.add(sum, VectMath.scalarMultiply(other.dir,this._howSimilarIs(other)));
          count++;
        }
      });
      if (count > 0) {
        sum = VectMath.scalarMultiply(sum, 1 / count);
        return this.seek(sum);
      } else {
        return new Vect(0, 0);
      }
    }
  }, {
    key: "update",
    value: function update() {
      _get(Agent.prototype.__proto__ || Object.getPrototypeOf(Agent.prototype), "update", this).call(this);
      //Move
      this.dir = VectMath.add(this.dir, this.acceleration);
      this.dir = VectMath.limit(this.dir, this.agentController.maxspeed);
      this.acceleration = new Vect(0, 0);
      this.pos = VectMath.add(this.pos, this.dir);
    }
  }]);

  return Agent;
}(DrawableSample);
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//This class is used for globally equal agent-attributes/functions
var AgentController = function AgentController(ocean) {
	_classCallCheck(this, AgentController);

	this.ocean = ocean;
	this.maxspeed = 4;
	this.maxforce = 4;
	this.initialDimension = 10;
	this.dimension = 10;
	this.initialFontSize = 11;
	this.fontSize = 11;
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bait = function () {
  function Bait(options) {
    _classCallCheck(this, Bait);

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

  _createClass(Bait, [{
    key: "attract",
    value: function attract() {
      //searches for agents with matching criteria and tells them to arrive at own position
      for (var agentIndex in this.ocean.agents) {
        var agent = this.ocean.agents[agentIndex];
        for (var criteriaIndex in this.toAttract) {
          var criteria = this.toAttract[criteriaIndex];
          //check each criteria
          if (agent.props[criteria.propertyName] === criteria.propertyValue) {
            agent.arrive(this.position);
          }
        }
      }
    }
  }]);

  return Bait;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chart = function () {
	function Chart(ocean) {
		_classCallCheck(this, Chart);

		this.ocean = ocean;
	}

	_createClass(Chart, [{
		key: 'alignMedian',
		value: function alignMedian() {
			//set destination for all agents
			var w = window.innerWidth;
			var h = window.innerHeight;

			var maxX = 0,
			    maxY = 0;
			//get maximum values, for mapping
			this.ocean.agents.forEach(function (a) {
				if (a.props['prop'] > maxX) maxX = a.props['prop'];
				if (a.props['prop2'] > maxY) maxY = a.props['prop2'];
			});
			//x-axis = prop1, y = prop2
			this.ocean.agents.forEach(function (a) {
				var x = MathUtils.map(a.props['prop'], 0, maxX, 0, w);
				var y = MathUtils.map(a.props['prop2'], 0, maxY, 0, h);

				a.destination = new Vect(x, y);
			});

			//TODO: if > 2 properties, median of halfs, rounding up/down if odd amoung
		}
	}]);

	return Chart;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* ========================================
 *          D A T A  O C E A N
 *        2015-2021 by DIETER MEILLER
 * ======================================== */

var DataOcean = function () {
	function DataOcean(id) {
		var _this = this;

		_classCallCheck(this, DataOcean);

		this.canvas = document.getElementById(id);
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		//Agents
		this.agent_id = -1;
		this.agents = [];

		//Schooling values
		this.seperate = 0.1;
		this.align = 0.7;
		this.cohesion = 0.1;
		this.scale = 0.6;
		this.animation = true;
		this.clickMode = "info";
		this.clickBuffer = 2; //factor in which range a click/touch can differ from the actual agent's position
		this.wasClicked = false; //for click-enqueuing
		this.clickInfo = {};
		this.chart = new Chart(this);
		//only calculate schooling every "skipSteps"th frame
		this.skipSteps = 2;
		this.currentStep = 0;

		//Using a lattice, so that the agent's forces are only affected by neighboring cells
		//e.g. latticeSize=20 each cell is 20%*20%
		//not using fixed values here to cover responsiveness 
		this.latticeSize = 20;
		this.setLattice();

		this.baits = [];

		if (this.canvas && this.canvas.getContext) {
			this.context = this.canvas.getContext("2d");
			this.intervalID = this.intervalID || window.setInterval(function () {
				return _this.draw();
			}, 15);
		} else {
			this.canvas.innerHTML = "No Canvas Support.";
		}

		//Clustering
		this.clustering = new KModes(this);
		this.agentController = new AgentController(this);
		return this;
	}

	//since clicks can be done between frames it's not ensured that the lattice has a content
	//this function will enqueue the click handler at the end of the draw function


	_createClass(DataOcean, [{
		key: "prepareClickHandler",
		value: function prepareClickHandler(event) {
			this.clickInfo.x = event.clientX;
			this.clickInfo.y = event.clientY;
			//first get lattice-cell
			this.clickInfo.row = Math.ceil(event.clientX / this.canvas.clientWidth * (100 / this.latticeSize)) - 1;
			this.clickInfo.column = Math.ceil(event.clientY / this.canvas.clientHeight * (100 / this.latticeSize)) - 1;
			this.wasClicked = true;
		}
	}, {
		key: "toggleCentroid",
		value: function toggleCentroid() {
			this.clickMode == "info" ? this.clickMode = "addCentroid" : this.clickMode = "info";
		}
	}, {
		key: "rescale",
		value: function rescale(val) {
			this.scale = val;
			this.agentController.dimension = this.agentController.initialDimension * parseFloat(val);
			this.agentController.fontSize = this.agentController.initialFontSize * parseFloat(val);
			for (var i = 0; i < this.agents.length; i++) {
				this.agents[i].infoView.lineheight = this.agents[i].infoView.initialLineheight * parseFloat(val);
			}
			this.clustering.rescale(val);
		}
	}, {
		key: "getClickedAgent",
		value: function getClickedAgent() {
			var cell = this.lattice[this.clickInfo.row][this.clickInfo.column];

			//get clicked agent in that cell
			for (var i = 0; i < cell.length; i++) {
				//check if x and y offset is in range of agents dimension with regards to the percentual clickBuffer
				if (Math.abs(this.clickInfo.x - cell[i].pos.x) < this.agentController.dimension * this.clickBuffer && Math.abs(this.clickInfo.y - cell[i].pos.y) < this.agentController.dimension * this.clickBuffer) {
					return cell[i];
				}
			}

			return null;
		}
	}, {
		key: "clickHandler",
		value: function clickHandler() {
			var clicked = this.getClickedAgent();
			if (this.clickMode === "info") {
				clicked.clickHandler();
			} else if (clicked && this.clickMode === "addCentroid") {
				this.clustering.addCentroid(clicked);
			}
		}

		//creating the lattice with the correct number of cells

	}, {
		key: "setLattice",
		value: function setLattice() {
			var cellNumber = Math.ceil(100 / this.latticeSize);
			this.lattice = new Array(cellNumber);
			//creating the two-dimensional lattice-array
			for (var i = 0; i < cellNumber; i++) {
				this.lattice[i] = new Array(cellNumber);
				for (var j = 0; j < cellNumber; j++) {
					//an empty list of agents for each cell
					this.lattice[i][j] = [];
				}
			}
		}
	}, {
		key: "add",
		value: function add(obj) {
			this.agents.push(this.clustering.getAgent(++this.agent_id, this.agentController, this.clustering, Math.random() * this.context.canvas.clientWidth, Math.random() * this.context.canvas.clientHeight, obj));
		}
	}, {
		key: "removeAll",
		value: function removeAll() {
			this.agents = [];
			this.clustering.centroids = [];
		}
	}, {
		key: "resizeCanvas",
		value: function resizeCanvas(w, h) {
			if (!w) {
				w = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
			}
			if (!h) {
				h = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
			}
			this.canvas.width = w;
			this.canvas.height = h;
			//Move all Agents to Center
			var deltax_half = (this.canvas.width - this.width) / 2;
			var deltay_half = (this.canvas.height - this.height) / 2;
			this.agents.forEach(function (a) {
				a.pos.x += deltax_half;a.pos.y += deltay_half;
			});
			this.clustering.centroids.forEach(function (a) {
				a.pos.x += deltax_half;a.pos.y += deltay_half;
			});
			//Remember new Values
			this.width = this.canvas.width;
			this.height = this.canvas.height;
			this.draw();
		}
	}, {
		key: "setFullScreen",
		value: function setFullScreen(full) {
			var _this2 = this;

			if (full) {
				window.addEventListener('resize', function () {
					return _this2.resizeCanvas();
				});
				this.resizeCanvas();
			}
			return this;
		}
	}, {
		key: "draw",
		value: function draw() {
			var _this3 = this;

			this.setLattice();

			this.context.fillStyle = "#ffffff";
			this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

			//loop over all baits and add force
			for (var i = 0; i < this.baits.length; i++) {
				this.baits[i].attract();
			}

			//Draw Agents

			//only calculate new forces every skipSteps'th frame

			//TODO: Lastverteilung der skipSteps auf agents.length/skipSteps-Blöcke
			if (this.currentStep == this.skipSteps) {
				this.agents.forEach(function (a) {
					a.register();
					if (_this3.animation) {

						if (a.destination) {
							//if the agent has a destination, go to that destination
							a.goToDestination();
						} else {
							a.school(_this3.agents);
						}
						a.update();

						_this3.currentStep = 0;
						_this3.currentStep++;
					}
					a.draw();
				});
				if (this.animation) {
					this.currentStep = 0;
				}
			} else {
				//otherwise, only update and draw the agents
				this.agents.forEach(function (a) {
					a.register();
					if (_this3.animation) {
						if (a.destination) {
							a.goToDestination();
						}
						a.update();
					}
					a.draw();
				});
				if (this.animation) {
					this.currentStep++;
				}
			}
			//drawing info-popups after drawing agents to prevent overlapping
			this.agents.forEach(function (a) {
				if (a.infoView.visible) {
					a.drawInfo();
				}
			});
			//Draw Cluster Centroids
			this.clustering.draw();

			if (this.wasClicked) {
				this.clickHandler();
				this.wasClicked = false;
			}
		}
	}]);

	return DataOcean;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawableSample = function (_Sample) {
  _inherits(DrawableSample, _Sample);

  function DrawableSample(id, agentController, x, y, obj) {
    _classCallCheck(this, DrawableSample);

    //column and row of the lattice-grid
    var _this = _possibleConstructorReturn(this, (DrawableSample.__proto__ || Object.getPrototypeOf(DrawableSample)).call(this, id, obj));

    _this.agentController = agentController;
    _this.context = agentController.ocean.context;
    _this.column = undefined;
    _this.row = undefined;
    _this.infoView = new InfoView(_this);
    _this.context.font = "11px Verdana";

    _this.pos = new Vect(x, y);
    return _this;
  }

  _createClass(DrawableSample, [{
    key: "clickHandler",
    value: function clickHandler() {
      //toggle infoview
      //this.infoView.toggleView();
      //log.clear();
      //log.println(this.similarity);	
      log.println(this.props);
    }

    //Agent registers itself in the right cell from the lattice

  }, {
    key: "register",
    value: function register() {
      var column = Math.ceil(this.pos.x / this.context.canvas.clientWidth * (100 / this.agentController.ocean.latticeSize)) - 1;
      var row = Math.ceil(this.pos.y / this.context.canvas.clientHeight * (100 / this.agentController.ocean.latticeSize)) - 1;
      if (column >= 0 && row >= 0 && column < 100 / this.agentController.ocean.latticeSize && row < 100 / this.agentController.ocean.latticeSize) {
        //only update the column and row for valid values
        this.column = column;
        this.row = row;
        this.agentController.ocean.lattice[column][row].push(this);
      }
    }

    //A function which returns an array of agents, which are in neighboring lattice-cells

  }, {
    key: "getNeighbors",
    value: function getNeighbors(col, row) {
      var res = [];
      //left border
      if (col > 0) {
        this.agentController.ocean.lattice[col - 1][row].forEach(function (agent) {
          res.push(agent);
        });
      }
      //right border
      if (col < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col + 1][row].forEach(function (agent) {
          res.push(agent);
        });
      }
      //upper border
      if (row > 0) {
        this.agentController.ocean.lattice[col][row - 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //lower border
      if (row < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col][row + 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //upper left corner
      if (row > 0 && col > 0) {
        this.agentController.ocean.lattice[col - 1][row - 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //upper right corner
      if (row > 0 && col < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col + 1][row - 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //lower left corner
      if (row < 100 / ocean.latticeSize - 1 && col > 0) {
        this.agentController.ocean.lattice[col - 1][row + 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //lower right corner
      if (row < 100 / ocean.latticeSize - 1 && col < 100 / ocean.latticeSize - 1) {
        this.agentController.ocean.lattice[col + 1][row + 1].forEach(function (agent) {
          res.push(agent);
        });
      }
      //own cell
      this.agentController.ocean.lattice[col][row].forEach(function (agent) {
        res.push(agent);
      });
      return res;
    }
  }, {
    key: "draw",
    value: function draw() {
      this.context.fillStyle = "#333333";
      this.context.font = this.agentController.fontSize + "px Verdana";
      this.context.textAlign = 'center';
      //If Agent is assigned to a centroid, use its color
      //Text
      this.context.fillText(this.__label, this.pos.x, this.pos.y + this.agentController.dimension + 1 + this.agentController.fontSize);
      if (this.assignedCentroid) {
        this.context.fillStyle = this.assignedCentroid.color;
      }
      //Circle
      this.context.beginPath();
      this.context.arc(this.pos.x, this.pos.y, this.agentController.dimension, 0, Math.PI * 2, true);
      this.context.closePath();
      this.context.fill();
      this.context.lineWidth = 1;
      this.context.strokeStyle = '#000000';
      this.context.stroke();
    }
  }, {
    key: "drawInfo",
    value: function drawInfo() {
      //draw infoview if visible
      this.context.font = this.agentController.fontSize + "px Verdana";
      this.context.textAlign = 'left';
      if (this.infoView.visible) {
        this.infoView.update();
        this.infoView.draw();
      }
    }
  }, {
    key: "update",
    value: function update() {
      //Out of Bounds?
      if (this.pos.x > this.context.canvas.width + 10) this.pos.x = -30;
      if (this.pos.y > this.context.canvas.height + 10) this.pos.y = -30;
      if (this.pos.x < -30) this.pos.x = this.context.canvas.width + 10;
      if (this.pos.y < -30) this.pos.y = this.context.canvas.height + 10;
    }
  }]);

  return DrawableSample;
}(Sample);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ForceAgent = function (_DrawableSample) {
  _inherits(ForceAgent, _DrawableSample);

  function ForceAgent(id, agentController, x, y, obj) {
    _classCallCheck(this, ForceAgent);

    var _this = _possibleConstructorReturn(this, (ForceAgent.__proto__ || Object.getPrototypeOf(ForceAgent)).call(this, id, agentController, x, y, obj));

    _this.fSpring = 3000.0;
    _this.fRep = 600.0;
    _this.dir = new Vect(0, 0); //Initial Speed
    _this.destination = null;
    return _this;
  }

  _createClass(ForceAgent, [{
    key: "setDestination",
    value: function setDestination(destination) {
      this.destination = destination;
    }
  }, {
    key: "removeDestination",
    value: function removeDestination() {
      this.destination = null;
    }

    //going to a destination, but still add separation, so agents don't overap

  }, {
    key: "goToDestination",
    value: function goToDestination() {
      if (!this.destination) return;
      return true;
    }

    // Applys Spring Algo

  }, {
    key: "school",
    value: function school(agents) {
      //var neighbors = this.getNeighbors(this.column, this.row);
      var neighbors = this.agentController.ocean.agents;
      this.cohesion(neighbors);
      this.separate(neighbors);
      this.pos = VectMath.add(this.pos, this.dir);
      this.dir = new Vect(0, 0);
    }
  }, {
    key: "cohesion",
    value: function cohesion(agents) {
      var _this2 = this;

      // Spring
      var size = agents.length;
      var strength = 1 / Math.sqrt(size + 1) * 0.8;
      agents.forEach(function (other) {
        var simi = _this2.similarTo(other);
        if (other.props.__id !== _this2.props.__id) {
          var diff = VectMath.subtract(_this2.pos, other.pos);
          var lensq = VectMath.getLengthSq(diff);
          var force = Math.log(lensq / _this2.fSpring) * simi * strength;
          var normal = VectMath.normalize(diff);
          var f = VectMath.scalarMultiply(normal, force);
          _this2.dir = VectMath.subtract(_this2.dir, f);
          other.dir = VectMath.add(other.dir, f);
        }
      });
    }
  }, {
    key: "separate",
    value: function separate(agents) {
      var _this3 = this;

      //Repulsion

      agents.forEach(function (other) {
        if (other !== _this3) {
          var dist = VectMath.subtract(_this3.pos, other.pos);
          var diff = dist;
          var lensq = VectMath.getLengthSq(diff);
          var force = lensq > 0 ? 16 * _this3.fRep / lensq : 0.0;
          force = force > 10 ? 10 : force;
          var normal = VectMath.normalize(dist);
          var f = VectMath.scalarMultiply(normal, force);

          _this3.dir = VectMath.add(_this3.dir, f);
        }
      });
    }
  }, {
    key: "update",
    value: function update() {
      //super.update();

    }
  }]);

  return ForceAgent;
}(DrawableSample);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InfoView = function () {
	function InfoView(agent) {
		_classCallCheck(this, InfoView);

		this.agent = agent;
		this.title = this.agent.__label;
		this.visible = false;
		this.pos = new Vect(0, 0);
		this.vel = new Vect(0, 0);
		this.acc = new Vect(0, 0);
		this.padding_left = 20;
		this.padding_top = 20;
		this.initialLineheight = 20;
		this.lineheight = 20;
		this.boxHeight = 0;
		this.boxWidth = 0;
	}

	_createClass(InfoView, [{
		key: "toggleView",
		value: function toggleView() {
			this.visible = !this.visible;
		}
	}, {
		key: "update",
		value: function update() {
			this.checkCorners();
			this.pos.x = this.agent.pos.x;
			this.pos.y = this.agent.pos.y;
			//TODO: spring physics for infoview so it follows the agent in a smooth way
		}
	}, {
		key: "checkCorners",
		value: function checkCorners() {
			if (this.pos.x < 0 || this.pos.x > this.agent.agentController.ocean.width) {
				this.vel.x *= -1;
			}
			if (this.pos.y < 0 || this.pos.y > this.agent.agentController.ocean.height) {
				this.vel.y *= -1;
			}
		}
	}, {
		key: "getTextWidth",
		value: function getTextWidth() {
			//TODO:: Determine the width the infopopup needs to display everything correctly
			var noop = true;
		}
	}, {
		key: "generateText",
		value: function generateText() {
			var result = "";
			var context = this.agent.agentController.ocean.ctx;
			var count = 0; //needed because 'i' are keys, not index-values
			this.boxHeight = this.padding_top;
			for (var i in this.agent.props) {
				context.fillText(i + ": " + this.agent.props[i], this.pos.x + this.padding_left, this.pos.y + this.padding_top + count++ * this.lineheight);
				this.boxHeight += this.lineheight;
			}
			this.boxHeight += this.padding_top;
			return result;
		}
	}, {
		key: "calcWidth",
		value: function calcWidth() {
			var min = 0;
			var context = this.agent.agentController.ocean.ctx;
			for (var i in this.agent.props) {
				var w = context.measureText(i + ": " + this.agent.props[i]).width + 2 * this.padding_left;
				if (w > min) {
					this.boxWidth = w;
					min = w;
				}
			}
		}
	}, {
		key: "draw",
		value: function draw() {
			this.calcWidth();
			var context = this.agent.agentController.ocean.ctx;
			context.beginPath();
			context.rect(this.pos.x, this.pos.y, this.boxWidth, this.boxHeight);
			context.fillStyle = '#eee';
			context.fill();
			context.fillStyle = 'black';
			this.generateText();
		}
	}]);

	return InfoView;
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Console = function () {
	function Console(elem) {
		_classCallCheck(this, Console);

		this.console = elem;
	}

	_createClass(Console, [{
		key: "setVisible",
		value: function setVisible(visible) {
			if (visible) {
				this.console.style.display = "block";
			} else {
				this.console.style.display = "none";
			}
		}
	}, {
		key: "clear",
		value: function clear() {
			this.console.innerHTML = "";
		}
	}, {
		key: "print",
		value: function print(text) {
			text = (typeof text === "undefined" ? "undefined" : _typeof(text)) === 'object' || typeof text === 'array' ? JSON.stringify(text) : text;
			this.console.innerHTML += text;
		}
	}, {
		key: "println",
		value: function println(text) {
			this.print(text);
			this.print("<br>");
			this.console.scrollTop = this.console.scrollHeight;
		}
	}]);

	return Console;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringMetrics = function () {
	function StringMetrics() {
		_classCallCheck(this, StringMetrics);
	}

	_createClass(StringMetrics, null, [{
		key: "levenshteinDistance",

		/**
  @see: https://en.wikipedia.org/wiki/Levenshtein_distance
  **/
		value: function levenshteinDistance(s, t) {
			// degenerate cases
			if (s == t) return 0;
			if (s.length == 0) return t.length;
			if (t.length == 0) return s.length;

			// create two work vectors of vareger distances
			// var[] v0 = new var[t.length + 1];
			// var[] v1 = new var[t.length + 1];
			var v0 = [];
			var v1 = [];
			v0.length = t.length + 1;
			v1.length = t.length + 1;
			// initialize v0 (the previous row of distances)
			// this row is A[0][i]: edit distance for an empty s
			// the distance is just the number of characters to delete from t
			for (var i = 0; i < v0.length; i++) {
				v0[i] = i;
			}
			for (var i = 0; i < s.length; i++) {
				// calculate v1 (current row distances) from the previous row v0

				// first element of v1 is A[i+1][0]
				//   edit distance is delete (i+1) chars from s to match empty t
				v1[0] = i + 1;

				// use formula to fill in the rest of the row
				for (var j = 0; j < t.length; j++) {
					var cost = s[i] == t[j] ? 0 : 1;
					v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
				}

				// copy v1 (current row) to v0 (previous row) for next iteration
				for (var j = 0; j < v0.length; j++) {
					v0[j] = v1[j];
				}
			}

			return v1[t.length];
		}
		/**
  @see: http://stackoverflow.com/questions/18516942/fastest-general-purpose-levenshtein-javascript-implementation
  **/

	}, {
		key: "levenshteinDistanceFast",
		value: function levenshteinDistanceFast(s, t) {
			if (s === t) {
				return 0;
			}
			var n = s.length,
			    m = t.length;
			if (n === 0 || m === 0) {
				return n + m;
			}
			var x = 0,
			    y,
			    a,
			    b,
			    c,
			    d,
			    g,
			    h;
			var p = new Uint16Array(n);
			var u = new Uint32Array(n);
			for (y = 0; y < n;) {
				u[y] = s.charCodeAt(y);
				p[y] = ++y;
			}

			for (; x + 3 < m; x += 4) {
				var e1 = t.charCodeAt(x);
				var e2 = t.charCodeAt(x + 1);
				var e3 = t.charCodeAt(x + 2);
				var e4 = t.charCodeAt(x + 3);
				c = x;
				b = x + 1;
				d = x + 2;
				g = x + 3;
				h = x + 4;
				for (y = 0; y < n; y++) {
					a = p[y];
					if (a < c || b < c) {
						c = a > b ? b + 1 : a + 1;
					} else {
						if (e1 !== u[y]) {
							c++;
						}
					}

					if (c < b || d < b) {
						b = c > d ? d + 1 : c + 1;
					} else {
						if (e2 !== u[y]) {
							b++;
						}
					}

					if (b < d || g < d) {
						d = b > g ? g + 1 : b + 1;
					} else {
						if (e3 !== u[y]) {
							d++;
						}
					}

					if (d < g || h < g) {
						g = d > h ? h + 1 : d + 1;
					} else {
						if (e4 !== u[y]) {
							g++;
						}
					}
					p[y] = h = g;
					g = d;
					d = b;
					b = c;
					c = a;
				}
			}

			for (; x < m;) {
				var e = t.charCodeAt(x);
				c = x;
				d = ++x;
				for (y = 0; y < n; y++) {
					a = p[y];
					if (a < c || d < c) {
						d = a > d ? d + 1 : a + 1;
					} else {
						if (e !== u[y]) {
							d = c + 1;
						} else {
							d = c;
						}
					}
					p[y] = d;
					c = a;
				}
				h = d;
			}

			return h;
		}
	}]);

	return StringMetrics;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsUtils = function () {
	function JsUtils() {
		_classCallCheck(this, JsUtils);
	}

	_createClass(JsUtils, null, [{
		key: "removeIndex",
		value: function removeIndex(arr, i) {
			if (arr[i]) arr.splice(i, 1);
		}
	}, {
		key: "removeObject",
		value: function removeObject(arr, obj) {
			if (arr.indexOf(obj) > -1) {
				arr.splice(arr.indexOf(obj), 1);
			}
		}
	}, {
		key: "removeObjectIf",
		value: function removeObjectIf(arr, fn) {
			var toRemove = [];
			for (var i in arr) {
				if (fn(arr[i])) {
					toRemove.push(i);
				}
			}
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = toRemove[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _i = _step.value;

					arr.splice(_i, 1);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (toRemove.length === 0) {
				return false;
			} else {
				return true;
			}
		}
	}, {
		key: "getColor",
		value: function getColor() {

			if (this.colors === undefined) {
				this.index = 0;
				this.colors = ["#ec4863", "#673c4f", "#e1df2a", "#90fcf9", "#190933"];
			}
			var value = this.colors[this.index];
			this.index++;
			if (this.index >= this.colors.length) {
				var r = parseInt(Math.random() * 24 * 10 + 15);
				var g = parseInt(Math.random() * 24 * 10 + 15);
				var b = parseInt(Math.random() * 24 * 10 + 15);
				value = "rgb(" + r + "," + g + "," + b + ")";
			}
			return value;
		}
	}]);

	return JsUtils;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vect = function () {
	function Vect(x, y) {
		_classCallCheck(this, Vect);

		this.x = x;
		this.y = y;
	}

	_createClass(Vect, [{
		key: "equals",
		value: function equals(other) {
			return this.x === other.x && this.y === other.y;
		}
	}]);

	return Vect;
}();

var MathUtils = function () {
	function MathUtils() {
		_classCallCheck(this, MathUtils);
	}

	_createClass(MathUtils, null, [{
		key: "map",
		value: function map(value, low1, high1, low2, high2) {
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		}
	}]);

	return MathUtils;
}();

var VectMath = function () {
	function VectMath() {
		_classCallCheck(this, VectMath);
	}

	_createClass(VectMath, null, [{
		key: "add",


		//Arithmetic operation:+
		value: function add(p, q) {
			return new Vect(p.x + q.x, p.y + q.y);
		}
		//Arithmetic operation:-

	}, {
		key: "subtract",
		value: function subtract(p, q) {
			return new Vect(p.x - q.x, p.y - q.y);
		}
		//AArithmetic operation:*

	}, {
		key: "scalarMultiply",
		value: function scalarMultiply(p, q) {
			var u = p.x * q;
			var v = p.y * q;
			return new Vect(!u ? 0 : u, !v ? 0 : v);
		}
		//Arithmetic operation:*

	}, {
		key: "scalarProduct",
		value: function scalarProduct(p, q) {
			return p.x * q.x + p.y * q.y;
		}
	}, {
		key: "getLength",
		value: function getLength(p) {
			return Math.sqrt(p.x * p.x + p.y * p.y);
		}
		//avoid using sqrt-function and Math.pow for optimization

	}, {
		key: "getLengthSq",
		value: function getLengthSq(p) {
			return p.x * p.x + p.y * p.y;
		}
	}, {
		key: "normalize",
		value: function normalize(p) {
			var len = this.getLength(p);
			if (len === 0) {
				return new Vect(0, 0);
			} else {
				return new Vect(p.x / len, p.y / len);
			}
		}
	}, {
		key: "copy",
		value: function copy(p) {
			return new Vect(p.x, p.y);
		}
	}, {
		key: "getAngle",
		value: function getAngle(delta) {
			return delta.x == 0 ? delta.y <= 0 ? Math.PI / 2 : -Math.PI / 2 : Math.atan(delta.y / delta.x);
		}
	}, {
		key: "getAngleDegree",
		value: function getAngleDegree(delta) {
			return this.getAngle(delta) * 180 / Math.PI;
		}
	}, {
		key: "offset",
		value: function offset(delta, _offset) {
			var wink = getAngle(delta);
			var ny2 = Math.sin(wink) * _offset;
			var nx2 = Math.cos(wink) * _offset;
			ny2 = delta.x > 0 ? ny2 : -ny2;
			nx2 = delta.x > 0 ? nx2 : -nx2;
			return new Vect(nx2, ny2);
		}
	}, {
		key: "rotate",
		value: function rotate(vect, angle) {
			var x = vect.y * Math.sin(angle) + vect.x * Math.cos(angle);
			var y = vect.y * Math.cos(angle) - vect.x * Math.sin(angle);
			return new Vect(x, y);
		}
	}, {
		key: "limit",
		value: function limit(vect, max) {
			if (vect.x * vect.x + vect.y * vect.y > max * max) {
				vect = this.normalize(vect);
				vect = this.scalarMultiply(vect, max);
			}
			return vect;
		}
	}]);

	return VectMath;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Centroid = function () {
	function Centroid(ocean) {
		var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		_classCallCheck(this, Centroid);

		this.ocean = ocean;
		// Reset Caching
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = ocean.agents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var a = _step.value;

				a.resetClusterCache();
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		this.color = JsUtils.getColor();
		this.assignedAgents = [];
		this.label = "";
		this.initialFontsize = 18;
		this.fontsize = 18;
		this.initialDimension = 26;
		this.dimension = this.initialDimension;
		if (pos) {
			//If position is given in options, spawn centroid at that point
			this.pos = new Vect(pos.x, pos.y);
		} else {
			this.pos = new Vect(0, 0);
		}
	}

	/*
 * Calculate new median point between all assigned Agents @assignedAgents
 */

	_createClass(Centroid, [{
		key: 'rename',
		value: function rename() {
			// Simply get the middle of array
			var pos = Math.floor(this.assignedAgents.length / 2);
			this.label = this.assignedAgents[pos].__label;
		}
	}, {
		key: 'rearrange',
		value: function rearrange() {
			// If no agent is assigned remove myself from list
			//JsUtils.removeObjectIf(this.ocean.clustering.centroids, centr => centr.assignedAgents.length === 0);
			this.rename();
			var x = 0,
			    y = 0;

			for (var i = 0; i < this.assignedAgents.length; i++) {
				x += this.assignedAgents[i].pos.x;
				y += this.assignedAgents[i].pos.y;
			}
			if (this.assignedAgents.length > 0) {
				this.pos.x = x / this.assignedAgents.length;
				this.pos.y = y / this.assignedAgents.length;
			} else {
				this.pos.x = x;
				this.pos.y = y;
			}
		}
	}, {
		key: 'draw',
		value: function draw() {
			this.ocean.context.fillStyle = this.color;
			this.ocean.context.beginPath();
			this.ocean.context.arc(this.pos.x, this.pos.y, this.dimension, 0, Math.PI * 2, true);
			this.ocean.context.closePath();
			this.ocean.context.fill();

			this.ocean.context.lineWidth = 1;
			this.ocean.context.strokeStyle = '#000000';
			this.ocean.context.stroke();

			this.ocean.context.textAlign = 'center';
			this.ocean.context.fillStyle = "#000";
			this.ocean.context.font = this.fontsize + "px Verdana";
			this.ocean.context.fillText(this.assignedAgents.length, this.pos.x, this.pos.y + this.fontsize + 2 + this.dimension);
		}
	}]);

	return Centroid;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KMeans = function () {
	function KMeans(ocean) {
		_classCallCheck(this, KMeans);

		this.ocean = ocean;
		this.centroids = [];
	}

	_createClass(KMeans, [{
		key: "rescale",
		value: function rescale(val) {
			for (var i = 0; i < this.centroids.length; i++) {
				this.centroids[i].fontsize = this.centroids[i].initialFontsize * parseFloat(val);
				this.centroids[i].dimension = this.centroids[i].initialDimension * parseFloat(val);
			}
		}
	}, {
		key: "addCentroid",
		value: function addCentroid(agent) {
			var _this = this;

			//check if centroid is there
			var foundCentroidAtClick = JsUtils.removeObjectIf(this.centroids, function (centr) {
				return Math.abs(_this.ocean.clickInfo.x - centr.pos.x) < centr.dimension && Math.abs(_this.ocean.clickInfo.y - centr.pos.y) < centr.dimension;
			});

			//remove all traces of centroids on agents if none is left
			if (this.centroids.length === 0) {
				for (var j = 0; j < this.ocean.agents.length; j++) {
					this.ocean.agents[j].assignedCentroid = null;
				}
			}

			if (!foundCentroidAtClick) {
				this.centroids.push(this.getCentroid(agent));
				this.ocean.rescale(this.ocean.scale);
				//Assign initially agents to centroid
				for (var j = 0; j < this.ocean.agents.length; j++) {
					this.ocean.agents[j].assignToCentroid();
				}
			}
			// If no agent is assigned remove centroid from list
			JsUtils.removeObjectIf(this.centroids, function (centr) {
				return centr.assignedAgents.length === 0;
			});
		}
		// For common usage together with KModes

	}, {
		key: "getCentroid",
		value: function getCentroid(agent) {
			return new Centroid(this.ocean, new Vect(this.ocean.clickInfo.x, this.ocean.clickInfo.y));
		}
	}, {
		key: "getAgent",
		value: function getAgent(id, agentController, clustering, x, y, obj) {
			return new KMeansAgent(id, agentController, clustering, x, y, obj);
		}
	}, {
		key: "draw",
		value: function draw() {
			//Loop over centroids, rearrange and draw them
			for (var i = 0; i < this.centroids.length; i++) {
				this.centroids[i].rearrange();
				this.centroids[i].draw();
			}
		}
	}]);

	return KMeans;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KMeansAgent = function (_ForceAgent) {
	_inherits(KMeansAgent, _ForceAgent);

	function KMeansAgent(id, agentController, clustering, x, y, obj) {
		_classCallCheck(this, KMeansAgent);

		var _this = _possibleConstructorReturn(this, (KMeansAgent.__proto__ || Object.getPrototypeOf(KMeansAgent)).call(this, id, agentController, x, y, obj));

		_this.clustering = clustering;
		_this.assignedCentroid = null;
		return _this;
	}
	/**
 @overrride
 **/


	_createClass(KMeansAgent, [{
		key: "draw",
		value: function draw() {
			this.assignToCentroid();
			_get(KMeansAgent.prototype.__proto__ || Object.getPrototypeOf(KMeansAgent.prototype), "draw", this).call(this);
		}
		/**
  @override
  **/

	}, {
		key: "howSimilarIs",
		value: function howSimilarIs(other) {
			if (this !== other && this.assignedCentroid !== null && this.assignedCentroid === other.assignedCentroid) {
				return 3;
			} else {
				return this.similarTo(other, true);
			}
		}
	}, {
		key: "getDistanceToCentroid",
		value: function getDistanceToCentroid(centroid) {
			return VectMath.getLengthSq(VectMath.subtract(this.pos, centroid.pos));
		}
	}, {
		key: "getNearestCentroid",
		value: function getNearestCentroid() {
			var nearestCentroid = null;
			var minDistance = Infinity;
			for (var i = 0; i < this.clustering.centroids.length; i++) {
				var dist = this.getDistanceToCentroid(this.clustering.centroids[i]);
				if (dist < minDistance) {
					minDistance = dist;
					nearestCentroid = this.clustering.centroids[i];
				}
			}
			return nearestCentroid;
		}

		//Assigns itself to the nearest Centroid and deletes itself from a centroid, if it was assigned beforehand

	}, {
		key: "assignToCentroid",
		value: function assignToCentroid() {
			var nearestCentroid = this.getNearestCentroid();
			//only reassign if the selected centroid isnt the assigned anyway
			if (this.assignedCentroid != nearestCentroid) {
				if (!this.assignedCentroid) {
					this.assignedCentroid = nearestCentroid;
					if (nearestCentroid) {
						nearestCentroid.assignedAgents.push(this);
					}
				} else {
					JsUtils.removeObject(this.assignedCentroid.assignedAgents, this);
					this.assignedCentroid = nearestCentroid;
					if (nearestCentroid) {
						nearestCentroid.assignedAgents.push(this);
					}
				}
			}
		}
	}]);

	return KMeansAgent;
}(ForceAgent);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KModes = function (_KMeans) {
	_inherits(KModes, _KMeans);

	function KModes(ocean) {
		_classCallCheck(this, KModes);

		return _possibleConstructorReturn(this, (KModes.__proto__ || Object.getPrototypeOf(KModes)).call(this, ocean));
	}

	/**
 @Override
 **/


	_createClass(KModes, [{
		key: "getCentroid",
		value: function getCentroid(agent) {
			return new KModesCentroid(this.centroids.length, this.ocean, agent);
		}
	}, {
		key: "getAgent",
		value: function getAgent(id, agentController, clustering, x, y, obj) {
			return new KModesAgent(id, agentController, clustering, x, y, obj);
		}
	}]);

	return KModes;
}(KMeans);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KModesAgent = function (_KMeansAgent) {
	_inherits(KModesAgent, _KMeansAgent);

	function KModesAgent(id, agentController, clustering, x, y, obj) {
		_classCallCheck(this, KModesAgent);

		return _possibleConstructorReturn(this, (KModesAgent.__proto__ || Object.getPrototypeOf(KModesAgent)).call(this, id, agentController, clustering, x, y, obj));
	}

	/**
 @Override
 */


	_createClass(KModesAgent, [{
		key: "getDistanceToCentroid",
		value: function getDistanceToCentroid(centroid) {
			return 1.0 - this.similarTo(centroid.agent, true);
		}
	}]);

	return KModesAgent;
}(KMeansAgent);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KModesCentroid = function (_Centroid) {
	_inherits(KModesCentroid, _Centroid);

	function KModesCentroid(id, ocean, agent) {
		_classCallCheck(this, KModesCentroid);

		var _this = _possibleConstructorReturn(this, (KModesCentroid.__proto__ || Object.getPrototypeOf(KModesCentroid)).call(this, ocean, agent.pos));

		_this.agent = agent;
		_this.totalDistance = _this.getTotalDistance(_this);
		return _this;
	}

	_createClass(KModesCentroid, [{
		key: "getTotalDistance",
		value: function getTotalDistance(centroid) {
			var total = 0;
			for (var i = 0; i < this.assignedAgents.length; i++) {
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

	}]);

	return KModesCentroid;
}(Centroid);
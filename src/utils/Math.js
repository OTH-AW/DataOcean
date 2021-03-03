class Vect {
	constructor(x, y) {
		this.x=x;
		this.y=y;
	}
	equals(other){
		return this.x === other.x && this.y === other.y;
	}
}

class MathUtils {
	static map(value, low1, high1, low2, high2) {
    	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
}

class VectMath {

	//Arithmetic operation:+
static add(p, q){
		return new Vect(p.x+q.x,p.y+q.y);
	}
	//Arithmetic operation:-
static subtract(p, q){
		return new Vect(p.x-q.x,p.y-q.y);
	}
	//AArithmetic operation:*
static scalarMultiply(p, q){
		var u = p.x * q;
		var v = p.y * q;
		return new Vect(!u ? 0 : u, !v ? 0 : v);
	}
	//Arithmetic operation:*
static scalarProduct(p, q){
		return p.x*q.x+p.y*q.y;
	}
static getLength(p) {
		return  Math.sqrt( p.x*p.x + p.y*p.y );
	}
//avoid using sqrt-function and Math.pow for optimization
static getLengthSq(p){
		return p.x*p.x + p.y*p.y;
	}	

static normalize(p) {
		var len=this.getLength(p);
		if (len === 0) {
			return new Vect(0,0);
		} else {
			return new Vect(p.x/len,p.y/len);
		}
	}
static copy(p){
		return new Vect(p.x,p.y);
	}
static getAngle(delta) {
		return delta.x==0?(delta.y<=0 ? Math.PI/2 : -Math.PI/2):Math.atan(delta.y/delta.x);
	}
static getAngleDegree(delta){
		return this.getAngle(delta)*180/Math.PI;
	}

static offset(delta, offset) {
			var wink=getAngle(delta);
			var ny2=Math.sin(wink)*offset;
			var nx2=Math.cos(wink)*offset;
			ny2=delta.x>0?ny2:-ny2;
			nx2=delta.x>0?nx2:-nx2;
			return new Vect(nx2,ny2);
		}
	static rotate(vect, angle) {
			var x= vect.y*Math.sin(angle)+vect.x*Math.cos(angle);
			var y= vect.y*Math.cos(angle)-vect.x*Math.sin(angle);
			return new Vect(x,y);
		}
	static limit(vect, max) {
	    if (vect.x * vect.x + vect.y * vect.y > max*max) {
	      vect = this.normalize(vect);
	      vect = this.scalarMultiply(vect,max);
	    }
	    return vect;
	  }

}

class JsUtils{
	static removeIndex(arr, i){
		if(arr[i]) arr.splice(i,1);
	}
	static removeObject(arr, obj){
		if(arr.indexOf(obj) > -1){
			arr.splice(arr.indexOf(obj),1);
		}
	}
	static removeObjectIf(arr, fn){
		var toRemove = [];
		for (let i in arr) {
			if(fn(arr[i])) {
				toRemove.push(i)
			}
		}
		for (let i of toRemove) {
			arr.splice(i,1);
		}
		if (toRemove.length === 0) {
			return false;
		} else {
			return true;
		}
	}
	
	static getColor() {

		if (this.colors === undefined) {
			this.index = 0;
			this. colors = [
		"#ec4863", "#673c4f", "#e1df2a", "#90fcf9", "#190933"
	];
		}
		var value = this.colors[this.index];
		this.index++;
		if (this.index >= this.colors.length) {
			var r = parseInt((Math.random()*24)*10+15);
			var g = parseInt((Math.random()*24)*10+15);
			var b = parseInt((Math.random()*24)*10+15);
			value = "rgb("+r+","+g+","+b+")";
		}
		return value;
	} 

	
}
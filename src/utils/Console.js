class Console {
	constructor(elem) {
		this.console = elem;
	}	
	setVisible(visible) {
		if (visible) {
			this.console.style.display="block";
		} else {	
			this.console.style.display="none";
		}
	}
	clear() {
		this.console.innerHTML = "";
	}
	print(text) {
		text = typeof text === 'object' || typeof text === 'array' ? JSON.stringify(text) : text;
		this.console.innerHTML += text;
	}
	println(text) {
		this.print(text);
		this.print("<br>");
		this.console.scrollTop = this.console.scrollHeight;	
	}
}

	

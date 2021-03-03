class StringMetrics {
	/**
	@see: https://en.wikipedia.org/wiki/Levenshtein_distance
	**/
	static  levenshteinDistance(s, t) {
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
		    var cost = (s[i] == t[j]) ? 0 : 1;
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
	static levenshteinDistanceFast(s, t) {
	    if (s === t) {
		return 0;
	    }
	    var n = s.length, m = t.length;
	    if (n === 0 || m === 0) {
		return n + m;
	    }
	    var x = 0, y, a, b, c, d, g, h;
	    var p = new Uint16Array(n);
	    var u = new Uint32Array(n);
	    for (y = 0; y < n;) {
		u[y] = s.charCodeAt(y);
		p[y] = ++y;
	    }

	    for (; (x + 3) < m; x += 4) {
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
			c = (a > b ? b + 1 : a + 1);
		    }
		    else {
			if (e1 !== u[y]) {
			    c++;
			}
		    }

		    if (c < b || d < b) {
			b = (c > d ? d + 1 : c + 1);
		    }
		    else {
			if (e2 !== u[y]) {
			    b++;
			}
		    }

		    if (b < d || g < d) {
			d = (b > g ? g + 1 : b + 1);
		    }
		    else {
			if (e3 !== u[y]) {
			    d++;
			}
		    }

		    if (d < g || h < g) {
			g = (d > h ? h + 1 : d + 1);
		    }
		    else {
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
			d = (a > d ? d + 1 : a + 1);
		    }
		    else {
			if (e !== u[y]) {
			    d = c + 1;
			}
			else {
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


}

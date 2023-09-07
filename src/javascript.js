function getElementUrl(url, pathChap, pathDate, pathLink, idChap, idDate, idLink){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "document";

	xhr.onload = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			var web = xhr.responseXML;
			document.getElementById(idDate).innerHTML = web.querySelector(pathDate).innerHTML;
			document.getElementById(idChap).innerHTML = web.querySelector(pathChap).innerHTML;
			document.getElementById(idLink).href = "read.html?web=" + web.querySelector(pathLink).href;
		}
	};

	xhr.onerror = function(){
		console.error(xhr.status, xhr.statusText);
		return 0;
	};

	xhr.send();
}

function main(){
	var _pathChap, _pathDate, _url, _pathLink;

	_pathChap = '#chapters-list > div.chapter-list-wrapper > ul > li:nth-child(1) > a';
	_pathDate = '#chapters-list > div.chapter-list-wrapper > ul > li:nth-child(1) > span';
	_pathLink = '#chapters-list > div.chapter-list-wrapper > ul > li:nth-child(1) > a';

	_url = "https://www.mangatigre.net/manga/one-piece";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "op-chap", "op-date", "op-link");

	_url = "https://www.mangatigre.net/manga/jujutsu-kaisen";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "jk-chap", "jk-date", "jk-link");

	_url = "https://www.mangatigre.net/manga/one-punch-man";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "opm-chap", "opm-date", "opm-link");

	_url = "https://www.mangatigre.net/manga/made-in-abyss";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "ma-chap", "ma-date", "ma-link");

	_url = "https://www.mangatigre.net/manga/dandadan";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "dd-chap", "dd-date", "dd-link");

	_url = "https://www.mangatigre.net/manga/berserk";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "be-chap", "be-date", "be-link");

	_url = "https://www.mangatigre.net/manga/chainsaw-man";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "cs-chap", "cs-date", "cs-link");

	_url = "https://www.mangatigre.net/manga/vinland-saga";
	getElementUrl(_url, _pathChap, _pathDate, _pathLink, "vs-chap", "vs-date", "vs-link");
}

function read(){
	const url = window.location.search;
	const urlParams = new URLSearchParams(url);
	const webUrl = urlParams.get('web');

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.mangatigre.net/manga/jujutsu-kaisen/235", true);
	xhr.responseType = "document";

	xhr.onload = function(){
		var index = 1;
		var web = xhr.responseXML;
		console.log(web);
		return;
		var src = "a";
		while(src){
			var selector = "#Blog1 > div.blog-posts > div > div > div > div.post.bar.hentry > div.post-body.entry-content > center > div.item_Description > div > div:nth-child(" + index + ") > a";
			var img = document.createElement("img");
			src = web.querySelector(selector).href;
			img.src = src;
			img.classList.add("page");
			index++;
			document.body.appendChild(img);
		}
	};

	xhr.onerror = function(){
		console.error(xhr.status, xhr.statusText);
		return 0;
	};

	xhr.send();
}

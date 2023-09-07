var json = [];
var one_page = true;

function main(){
	for(let i = 0; i < json.length; i++){
		document.getElementById(`chap-${i}`).innerHTML = json[i].chapter;
		document.getElementById(`date-${i}`).innerHTML = json[i].date;
	}
}

function read(){
	const url = window.location.search;
	const urlParams = new URLSearchParams(url);
	const id = urlParams.get('id');

	for(let i = 0; i < json[id].images.length; i++){
		let img = document.createElement('img');
		img.classList.add('page');
		img.src = json[id].images[i];
		document.body.appendChild(img);
	}
}

function switch_page_mode(){
	if(one_page){
		document.querySelector('.fa-copy').style.display = 'none';
		document.querySelector('.fa-file').style.display = 'inline';

		document.body.classList.remove('one-page');
		document.body.classList.add('two-page');
	}else{
		document.querySelector('.fa-copy').style.display = 'inline';
		document.querySelector('.fa-file').style.display = 'none';

		document.body.classList.remove('two-page');
		document.body.classList.add('one-page');
	}

	one_page = !one_page;
}

var one_page = true;
var add = false;

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

function add_manga(){
	let name = document.querySelector('#name-input').value;
	let id = document.querySelector('#id-input').value;

	document.querySelector('#name-input').value = '';
	document.querySelector('#id-input').value = '';

	fetch('http://localhost:8000', {
		method: 'POST',
		body: `add,${name},${id}`
	});
}

function toggle_add(){
	if(add){
		document.querySelector('#add-page').style.visibility = 'hidden';
	}else{
		document.querySelector('#add-page').style.visibility = 'visible';
	}

	add = !add;
}

function delete_manga(element){
	let data = element.previousElementSibling.dataset;

	fetch('http://localhost:8000', {
		method: 'POST',
		body: `delete,${data['name']},${data['id']}`
	});

	element.parentElement.style.display = 'none';
}

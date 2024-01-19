var one_page = true;

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

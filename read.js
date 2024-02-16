const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function write(name, array, url){
	fs.mkdirSync(`mangas/${name}`, { recursive: true }, (error) => {});

	fs.readFile('read.html', (error, data) => {
		const $ = cheerio.load(data);

		array.forEach((image, i) => {
			$('body').append(`<img class = 'page' src = ${i}.webp></img>`);

			https.get(image, {
				headers: {
					Referer: url
				}
			}, (resp) => {
				let file = fs.createWriteStream(`mangas/${name}/${i}.webp`);
				resp.pipe(file);

				file.on('finish', () => {
					file.close();
				});
			});
		});

		fs.writeFile(`mangas/${name}/${name}.html`, $.html(), (error) => {});
	});
}

function get_images(id, name, url){
	https.get(url, {
		headers: {
			Referer: `https://visortmo.com/library/manga/${id}/${name}`
		}
	}, (resp) => {
		var data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			const $ = cheerio.load(data);

			let href = $('a').attr('href');

			if(href == undefined){
				console.log(`Failed ${name}`);
				get_images(id, name, url);
				return;
			}

			let images_url = href.slice(0, -9) + 'cascade';

			https.get(images_url, (resp) => {
				var data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					const $ = cheerio.load(data);

					var images = [];

					$(".img-container > img").each((i, obj) => {
						images.push($(obj).attr('data-src'));
					});

					write(name, images, images_url);
				});
			});
		});
	});
}

function update_web(chapter, date, index, image){
	let time = Date.now() - Date.parse(date);

	let days = Math.floor(time / (24 * 3600 * 1000));
	let time_text = `Hace ${days} días`;

	if(days == 1)
		time_text = time_text.slice(0, -1);
	else if (days == 0)
		time_text = 'Hoy';

	let name = mangas[index];

	let readable_name = name.replaceAll('-', ' ');
	readable_name = readable_name.charAt(0).toUpperCase() + readable_name.slice(1);

	fs.readFile('index.html', (error, data) => {
		const $ = cheerio.load(data);

		$('body').append(
			`
			<div class="container" style="order: ${time}">
				<a href="mangas/${name}/${name}.html" data-name="${name}" data-id="${ids[index]}">
					<div class="shadow"></div>
					<img src="${image}">
					<div class="text">
						<h1>${readable_name}</h1>
						<h4>${chapter}</h4>
						<p>${time_text}</p>
					</div>
				</a>
				<button id="delete" onclick="delete_manga(this)">
					<i class="fa-solid fa-trash"></i>
				</button>
			</div>
			`
		);

		fs.writeFile('index.html', $.html(), (error) => {});
	});
}

function manga(i){
	https.get(`https://visortmo.com/library/manga/${ids[i]}/${mangas[i]}`, (resp) => {
		var data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			const $ = cheerio.load(data);

			let date = $('#chapters > ul > li:nth-child(1) > div > div > ul > li > div > div.col-4.col-md-2.text-center > span').first().text().slice(1);
			let chapter = $('#chapters > ul > li:nth-child(1) > h4 > div > div.col-10 > a').first().text();
			let image = $('.book-thumbnail').attr('src');

			update_web(chapter, date, i, image);

			let url = $('#chapters > ul > li:nth-child(1) > div > div > ul > li > div > div.col-2.col-sm-1.text-right > a').attr('href');
			get_images(ids[i], mangas[i], url);
		});
		if(i < mangas.length - 1){
			setTimeout(() => {manga(i + 1)}, 1000);
		}
	});
}

fs.readFile('index_template.html', (error, data) => {
	fs.writeFile('index.html', data, (error) => {});
});

let mangas = [];
let ids = [];

let json_obj = {};

fs.readFile('mangas.json', (error, data) => {
	if(data == undefined){
		return;
	}

	json_obj = JSON.parse(data);

	mangas = Object.keys(json_obj);
	ids = Object.values(json_obj);

	manga(0);
});

const requestListener = function (req, res) {
	res.writeHead(200);

	let buffer = '';

	req.on('data', (data) => {
		buffer += data;
	});

	req.on('end', () => {
		let new_manga = buffer.split(',');

		if(new_manga[0] == 'add'){
			mangas.push(new_manga[1]);
			ids.push(new_manga[2]);
			json_obj[new_manga[1]] = new_manga[2];

			fs.writeFile('mangas.json', JSON.stringify(json_obj), (error) => {});

			manga(mangas.length - 1);
		}
		if(new_manga[0] == 'delete'){
			console.log(mangas);
			mangas = mangas.filter((manga) => manga != new_manga[1]);
			console.log(mangas);
			ids = ids.filter((id) => id != new_manga[2]);
			console.log(json_obj);
			delete json_obj[new_manga[1]];
			console.log(json_obj);

			fs.writeFile('mangas.json', JSON.stringify(json_obj), (error) => {});
		}
	});
}

const server = http.createServer(requestListener);
server.listen(8000, 'localhost', () => {});


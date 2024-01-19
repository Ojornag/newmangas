const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const mangas = [
	'one-piece',
	'jujutsu-kaisen',
	'one-punch-man',
	'houseki-no-kuni',
	'chainsaw-man',
	'berserk',
	'vinland-saga',
	'made-in-abyss',
	'kagurabachi'
];

const ids = [
	624,
	2979,
	2985,
	20201,
	336,
	8399,
	145,
	26904,
	79643
];

function write(name, array, url){
	fs.readFile('read.html', (error, data) => {
		const $ = cheerio.load(data);

		array.forEach((image, i) => {
			$('body').append(`<img class = 'page' src = ${name}/${i}.webp></img>`);

			https.get(image, {
				headers: {
					Referer: url
				}
			}, (resp) => {
				let file = fs.createWriteStream(`${name}/${i}.webp`);
				resp.pipe(file);

				file.on('finish', () => {
					file.close();
				});
			});
		});

		fs.writeFile(`${name}.html`, $.html(), (error) => {});
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

function update_web(chapter, date, name){
	let time = Date.now() - Date.parse(date);

	let days = Math.floor(time / (24 * 3600 * 1000));
	let time_text = `Hace ${days} días`;

	if(days == 1)
		time_text = time_text.slice(0, -1);
	else if (days == 0)
		time_text = 'Hoy';

	fs.readFile('index.html', (error, data) => {
		const $ = cheerio.load(data);

		$(`#${name}-chap`).text(chapter);
		$(`#${name}-date`).text(time_text);

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

			update_web(chapter, date, mangas[i]);

			let url = $('#chapters > ul > li:nth-child(1) > div > div > ul > li > div > div.col-2.col-sm-1.text-right > a').attr('href');
			get_images(ids[i], mangas[i], url);
		});
		if(i < mangas.length - 1){
			setTimeout(() => {manga(i + 1)}, 1000);
		}
	});
}

manga(0);

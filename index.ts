const puppeteer = require('puppeteer');
const fs = require('fs');
import { Browser } from 'puppeteer';

const main = async (url: string, index: number) => {
	const browser: Browser = await puppeteer.launch({
		headless: 'new',
		args: ['--no-sandbox']
	});
	const page = await browser.newPage();
	await page.goto(url);

	// Get chapter link and data
	const {chapter, date} = await page.evaluate(() => {
		let link: HTMLAnchorElement = document.querySelector('#chapters-list > div.chapter-list-wrapper > ul > li:nth-child(1) > a')!;
		let chapter = link.innerHTML;
		let span: HTMLSpanElement = document.querySelector('#chapters-list > div.chapter-list-wrapper > ul > li:nth-child(1) > span')!;
		let date = span.innerHTML;
		link.click();
		return {chapter, date};
	});

	await page.waitForTimeout(1000);

	// Go on multipage mode
	await page.evaluate(() => {
		let button: HTMLButtonElement = document.querySelector('#reader > div.d-md-flex.mb-2.page-controls.justify-content-center.text-center > div.dropdown.custom-dropdown.mr-md-2.mb-2.w-sm-auto > div > button:nth-child(2)')!;
		button.click();
	});

	await page.waitForTimeout(10000);

	// Get images
	const images = await page.evaluate(() => {
		let index = 1;
		let array: string[] = [];
		while(document.querySelector(`#chapter-image-${index}`) != null){
			let image: HTMLImageElement = document.querySelector(`#chapter-image-${index}`)!;
			array.push(image.src);
			index++;
		}
		return array;
	});

	fs.writeFile(`data${index}.js`, `json[${index}] = ` + JSON.stringify({
		chapter: chapter,
		date: date,
		images: images
	}), (err: any) => {
		if(err) throw err
		console.log("Successfully saved");
	});

	await browser.close();
}

var urls: string[] = [
	'https://www.mangatigre.net/manga/one-piece',
	'https://www.mangatigre.net/manga/jujutsu-kaisen',
	'https://www.mangatigre.net/manga/one-punch-man',
	'https://www.mangatigre.net/manga/dandadan',
	'https://www.mangatigre.net/manga/chainsaw-man',
	'https://www.mangatigre.net/manga/berserk',
	'https://www.mangatigre.net/manga/vinland-saga',
	'https://www.mangatigre.net/manga/made-in-abyss'
];

for(let i = 0; i < urls.length; i++){
	main(urls[i], i);
}

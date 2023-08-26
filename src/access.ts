import * as cheerio from 'cheerio'
import { DMS, SignedDMS } from './locutils'
import fetch from 'node-fetch'

const defaultParams = {
	input_natal: 1,
	send_calculation: 1,
	narozeni_timezone_form: 'auto',
	narozeni_timezone_dst_form: 'auto',
	house_system: 'placidus',
	hid_fortune: '1',
	hid_fortune_check: 'on',
	hid_vertex: '1',
	hid_vertex_check: 'on',
	hid_chiron: '1',
	hid_chiron_check: 'on',
	hid_lilith: '1',
	hid_lilith_check: 'on',
	hid_uzel: '1',
	hid_uzel_check: 'on',
	tolerance: '1',
	aya: '',
	tolerance_paral: '1.2',
}

function collectURL(dateOfBirth: number[], timeOfBirth: string[], lat: SignedDMS, long: SignedDMS) {
	let obj: any = Object.assign({}, defaultParams)
	obj['narozeni_den'] = dateOfBirth[0]
	obj['narozeni_mesic'] = dateOfBirth[1]
	obj['narozeni_rok'] = dateOfBirth[2]
	if (timeOfBirth[0] !== '0') {
		obj['narozeni_hodina'] = timeOfBirth[0]
		obj['narozeni_minuta'] = timeOfBirth[1]
	} else {
		obj['narozeni_hodina'] = '00'
		obj['narozeni_minuta'] = '00'
		obj['narozeni_no_cas'] = 'on'
	}
	obj['narozeni_sekunda'] = '00'
	obj['narozeni_sirka_stupne'] = lat.deg
	obj['narozeni_sirka_minuty'] = lat.min
	obj['narozeni_sirka_smer'] = lat.dir == 'S' ? '1' : '0'
	obj['narozeni_delka_stupne'] = long.deg
	obj['narozeni_delka_minuty'] = long.min
	obj['narozeni_delka_smer'] = long.dir == 'W' ? '1' : '0'
	let params = new URLSearchParams(obj)
	return `https://horoscopes.astro-seek.com/calculate-birth-chart-horoscope-online/?${params.toString()}`
}

export type PlanetPosition = {
	planetName: string
	zodiacSign: string
	location: DMS
	house: number
	r: boolean
}

export type HousePosition = {
	house: number
	zodiacSign: string
	location: DMS
}

export type MainAspect = {
	planet1: string
	planet2: string
	aspect: string
	orb: DMS
}

export type AstroSeekAPIRespone = {
	planetPositions: PlanetPosition[]
	housePositions: HousePosition[]
	mainAspects: MainAspect[]
}

function loadPosition($: cheerio.CheerioAPI, locParts: cheerio.Cheerio<cheerio.Element>): DMS {
	const minSecParts = $(locParts[1]).text().split('’')
	return {
		deg: parseInt($(locParts[0]).text()),
		min: parseInt(minSecParts[0]),
		sec: parseInt(minSecParts[1] ?? '0'),
	}
}

function loadPlanetPositions($: cheerio.CheerioAPI): PlanetPosition[] {
	const result: PlanetPosition[] = []
	const ppDiv = $('#vypocty_toggle > .vypocet-planet')
	for (const ppLine of ppDiv.find('.horoskop-radek-kotva')) {
		if (!ppLine) {
			continue
		}
		const divs = $(ppLine).find('div')
		if (!divs.length) {
			continue
		}

		result.push({
			planetName: $(divs[0]).find('strong').text(),
			zodiacSign: $(divs[1]).text(),
			location: loadPosition($, $(divs[2]).find('span')),
			house: parseInt(
				$(divs[3])
					.text()
					.match(/[0-9]+/)?.[0] ?? '0'
			),
			r: $(divs[4]).text() === 'Retrograde',
		})
	}
	return result
}

function loadHousePositions($: cheerio.CheerioAPI): HousePosition[] {
	const result: HousePosition[] = []

	const hpDiv1s = $('#vypocty_toggle > div.cl.vypocet-planet > div')
	for (let i = 0; i < hpDiv1s.length; i += 3) {
		result.push({
			house: parseInt($(hpDiv1s[i]).find('strong').text()),
			zodiacSign:
				$(hpDiv1s[i + 1])
					.find('img')
					.attr('alt') ?? '',
			location: loadPosition(
				$,
				$(hpDiv1s[i + 1])
					.find('.dum-right')
					.find('span')
			),
		})
	}

	const hpDiv2s = $('#vypocty_toggle > div:nth-child(10) > div')
	for (let i = 0; i < hpDiv2s.length; i += 3) {
		result.push({
			house: parseInt($(hpDiv2s[i]).find('strong').text()),
			zodiacSign:
				$(hpDiv2s[i + 1])
					.find('img')
					.attr('alt') ?? '',
			location: loadPosition(
				$,
				$(hpDiv2s[i + 1])
					.find('.dum-right')
					.find('span')
			),
		})
	}

	return result
}

function loadMainAspects($: cheerio.CheerioAPI): MainAspect[] {
	const result: MainAspect[] = []

	const maDivs = $('#vypocty_toggle > div:nth-child(22) > div')
	console.log(maDivs.length)
	for (let i = 3; i < maDivs.length; i += 2) {
		const children = $(maDivs[i]).children()
		result.push({
			planet1: $(children[0]).text().trim(),
			aspect: $(children[1]).text().trim(),
			planet2: $(children[2]).text().trim(),
			orb: loadPosition($, $(children[3]).find('span.tenky > span')),
		})
	}

	return result
}

export async function requestInfo(dateOfBirth: number[], timeOfBirth: string[], lat: SignedDMS, long: SignedDMS): Promise<AstroSeekAPIRespone> {
	const response = await fetch(collectURL(dateOfBirth, timeOfBirth, lat, long))
	const html = await response.text()

	const $ = cheerio.load(html)
	return {
		planetPositions: loadPlanetPositions($),
		housePositions: loadHousePositions($),
		mainAspects: loadMainAspects($),
	}
}

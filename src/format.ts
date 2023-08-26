import { HousePosition, MainAspect, PlanetPosition } from './access'
import config from './config'
import { DMS } from './locutils'

function formatPlanet(eng: string): string {
	return config.lang.planetNames[eng] ?? eng
}

function formatZodiacSign(eng: string): string {
	return config.lang.zodiacSignNames[eng] ?? eng
}

function formatAspect(eng: string): string {
	return config.lang.aspects[eng] ?? eng
}

function formatPosition(position: DMS): string {
	return `${position.deg}°${String(position.min).padStart(2, '0')}’`
}

export function formatPlanetPositions(source: PlanetPosition[], prefix?: string): string {
	const lines = []
	if (prefix) {
		lines.push(prefix)
		lines.push('')
	}
	for (const pp of source) {
		lines.push(`${formatPlanet(pp.planetName)}: \`${formatZodiacSign(pp.zodiacSign)}\`, \`${formatPosition(pp.location)}\`, \`${pp.house} дом\`${pp.r ? ', `R`' : ''}`)
	}
	return lines.join('\n')
}

export function formatHousePositions(source: HousePosition[], prefix?: string): string {
	const lines = []
	if (prefix) {
		lines.push(prefix)
		lines.push('')
	}
	for (const hp of source) {
		lines.push(`${hp.house}: \`${formatZodiacSign(hp.zodiacSign)}\`, \`${formatPosition(hp.location)}\``)
	}
	return lines.join('\n')
}

export function formatMainAspects(source: MainAspect[], prefix?: string): string {
	const lines = []
	if (prefix) {
		lines.push(prefix)
		lines.push('')
	}
	for (const ma of source) {
		lines.push(`\`${formatPlanet(ma.planet1)}\` \`${formatAspect(ma.aspect)}\` \`${formatPlanet(ma.planet2)}\`, \`${formatPosition(ma.orb)}\``)
	}
	return lines.join('\n')
}

export type DMS = {
	deg: number
	min: number
	sec: number
}

export type SignedDMS = DMS & {
	dir: 'W' | 'S' | 'E' | 'N'
}

export function ConvertDDToSignedDMS(D: number, lng: boolean): SignedDMS {
	return {
		dir: D < 0 ? (lng ? 'W' : 'S') : lng ? 'E' : 'N',
		deg: 0 | (D < 0 ? (D = -D) : D),
		min: 0 | (((D += 1e-9) % 1) * 60),
		sec: (0 | (((D * 60) % 1) * 6000)) / 100,
	}
}

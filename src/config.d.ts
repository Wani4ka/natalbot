type Dictionary = { [eng: string]: string }

export type AppConfig = {
	lang: {
		askDateOfBirth: string
		askTimeOfBirth: string
		askBirthLocation: string
		loadingInfo: string
		planetNames: Dictionary
		zodiacSignNames: Dictionary
		aspects: Dictionary
		planetPositions?: {
			prefix?: string
		}
		housePositions?: {
			prefix?: string
		}
		mainAspects?: {
			prefix?: string
		}
	}
	botToken: string
}

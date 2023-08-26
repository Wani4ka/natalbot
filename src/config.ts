import { AppConfig } from './config.d'
import 'dotenv/config'

const config: AppConfig = {
	lang: {
		askDateOfBirth: 'Отправьте вашу дату рождения в формате ДД\\.ММ\\.ГГГГ',
		askTimeOfBirth: 'Отправьте ваше точное время рождения в формате ЧЧ:ММ\\. Если вы его не знаете, отправьте `0`',
		askBirthLocation: 'Отправьте геолокацию вашего места рождения',
		loadingInfo: 'Загружаю информацию\\.\\.\\.',
		planetNames: {
			Sun: 'Солнце',
			Moon: 'Луна',
			Mercury: 'Меркурий',
			Venus: 'Венера',
			Mars: 'Марс',
			Jupiter: 'Юпитер',
			Saturn: 'Сатурн',
			Uranus: 'Уран',
			Neptune: 'Нептун',
			Pluto: 'Плутон',
			Node: 'Узел',
			Lilith: 'Лилит',
			Chiron: 'Хирон',
		},
		zodiacSignNames: {
			Aries: 'Овен',
			Taurus: 'Телец',
			Gemini: 'Близнецы',
			Cancer: 'Рак',
			Leo: 'Лев',
			Virgo: 'Дева',
			Libra: 'Весы',
			Scorpio: 'Скорпион',
			Sagittarius: 'Стрелец',
			Capricorn: 'Козерог',
			Aquarius: 'Водолей',
			Pisces: 'Рыбы',
		},
		aspects: {
			Conjunction: 'соединение',
			Sextile: 'секстиль',
			Trine: 'трин',
			Square: 'квадратура',
			Opposition: 'оппозиция',
		},
		planetPositions: {
			prefix: '*Позиции планет:*',
		},
		housePositions: {
			prefix: '*Позиции домов:*',
		},
		mainAspects: {
			prefix: '*Основные аспекты:*',
		},
	},
	botToken: process.env.TELEGRAM_BOT_KEY || '',
}

export default config

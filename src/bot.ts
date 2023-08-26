import { Conversation, ConversationFlavor, conversations, createConversation } from '@grammyjs/conversations'
import dayjs from 'dayjs'
import { Bot, Context, session } from 'grammy'
import { ConvertDDToSignedDMS, SignedDMS } from './locutils'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { requestInfo } from './access'
import { formatHousePositions, formatMainAspects, formatPlanetPositions } from './format'
import { ParseMode } from 'grammy/types'
import config from './config'

dayjs.extend(customParseFormat)

const MODE_MARKDOWN: { [parse_mode: string]: ParseMode } = {
	parse_mode: 'MarkdownV2',
}

async function info(conversation: Conversation<Context & ConversationFlavor>, ctx: Context & ConversationFlavor) {
	let dateOfBirth: number[] = []
	while (dateOfBirth.length === 0) {
		await ctx.reply(config.lang.askDateOfBirth, MODE_MARKDOWN)
		const dobString = await conversation.form.text()
		if (dayjs(dobString, 'DD.MM.YYYY', true).isValid()) {
			dateOfBirth = dobString.split('.').map(x => parseInt(x))
		}
	}
	let timeOfBirth: string[] = []
	while (timeOfBirth.length === 0) {
		await ctx.reply(config.lang.askTimeOfBirth, MODE_MARKDOWN)
		const tobString = await conversation.form.text()
		if (tobString === '0' || dayjs(tobString, 'HH:mm', true).isValid()) {
			timeOfBirth = tobString.split(':')
		}
	}
	let birthLocationLat: SignedDMS | undefined = undefined
	let birthLocationLong: SignedDMS | undefined = undefined
	while (!(birthLocationLat && birthLocationLong)) {
		await ctx.reply(config.lang.askBirthLocation, MODE_MARKDOWN)
		const {
			message: { location },
		} = await conversation.waitFor('message:location')
		birthLocationLat = ConvertDDToSignedDMS(location.latitude, false)
		birthLocationLong = ConvertDDToSignedDMS(location.longitude, true)
	}
	await ctx.reply(config.lang.loadingInfo, MODE_MARKDOWN)
	const info = await requestInfo(dateOfBirth, timeOfBirth, birthLocationLat, birthLocationLong)
	await ctx.reply(formatPlanetPositions(info.planetPositions, config.lang.planetPositions?.prefix), MODE_MARKDOWN)
	await ctx.reply(formatHousePositions(info.housePositions, config.lang.housePositions?.prefix), MODE_MARKDOWN)
	await ctx.reply(formatMainAspects(info.mainAspects, config.lang.mainAspects?.prefix), MODE_MARKDOWN)
}

const bot = new Bot<Context & ConversationFlavor>(config.botToken)

bot.use(session({ initial: () => ({}) }))
bot.use(conversations())
bot.use(createConversation(info))

bot.command('start', async (ctx) => await ctx.conversation.enter('info'))

bot.start()
console.log('bot is starting')

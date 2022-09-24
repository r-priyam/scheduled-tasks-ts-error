import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';

const client = new SapphireClient({
	defaultPrefix: '!',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	],
	partials: ['CHANNEL'],
	loadMessageCommandListeners: true,
	tasks: {
		// Using bullmq (redis)
		strategy: new ScheduledTaskRedisStrategy({
			/* You can add your Bull options here, for example we can configure custom Redis connection options: */
			bull: {
				connection: {
					port: 8888, // Defaults to 6379, but if your Redis server runs on another port configure it here
					password: 'very-strong-password', // If your Redis server requires a password configure it here
					host: 'localhost', // The host at which the redis server is found
					db: 2 // Redis database number, defaults to 0 but can be any value between 0 and 15
				}
			}
		})
	}
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();

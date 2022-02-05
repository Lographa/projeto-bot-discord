const Discord = require("discord.js");
const config = require("./config.json");
const puppeteer = require('puppeteer');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.login(config.BOT_TOKEN);

const prefix = "!";

client.on("message", function (message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift();

	message.reply("Por favor, aguarde");

	const ola = puppeteer.launch().then(async function (browser) {
		const page = await browser.newPage();
		await page.goto(command);

		const parseNome = await page.$$eval('#main-table-0 tbody tr td:nth-child(2)  a', function (parses) {
			// Mapeia todos os nome 
			return parses.map(function (parse) {
				return parse.innerText;
			});
		});

		const parseNumber = await page.$$eval('#main-table-0 tbody tr td:nth-child(1)  a', function (parses) {
			// Mapei todos os parses
			return parses.map(function (parse) {
				return parse.innerText;
			});
		});

		// const resposta = await Promise.all(parseNumber.map(async function (k, i) {
		// 	const dataNome = parseNome;
		// 	return  `**${k}**` + ": " +  `${dataNome[i]} ` + ":grinning:" + '\n' ;

		// }));

		const resposta = await Promise.all(parseNumber.map(async function (k, i) {
			const dataNome = parseNome;
			if (k <= 50 ) {
				return  "```Diff" + ` + **${k}**` + "```" + ": " + `${dataNome[i]} ` + ":grinning:" + '\n' ;
			} else {
			return `**${k}**` + ": " + `${dataNome[i]} ` + ":grinning:" + '\n' ;	
			}
			

		}));

		const temparray = [];

		const embed = new Discord.MessageEmbed()
		// Set the title of the field
		.setTitle('A slick little embed')
		// Set the color of the embed
		.setColor(0xff0000)
		// Set the main content of the embed
		.setDescription(resposta.toString() )
		// temparray.forEach(function name(e, i) {
		// 	embed.addField(entry, `**${e}**` + `${parseNome[i]}\n`);
		//  } );

		message.channel.send({ embeds: [embed] })

		//retorna uma resposta da chamada GET contendo a string do parse com nome do player
		// message.reply(stringando.concat(resposta.toString(), '}'));
		await browser.close();
	});

});


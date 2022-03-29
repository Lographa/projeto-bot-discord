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

		//procura nome do boss
		const BossName = await page.$$eval('#filter-fight-boss-text ', function (parses) {
			return parses.map(function (parse) {
				return parse.innerText;
			});
		});
		const novoBoss = BossName.toString().substring(BossName.lastIndexOf("\n+"));

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

		const metodo = (parse) => {
			const numero = parseInt(parse);
		if (numero <= 50) {
			return ":confounded:"
		} else {
			return ":grinning:"
		}
		};

		const resposta = await Promise.all(parseNumber.map(async function (k, i) {
			const dataNome = parseNome;
			if (parseNumber.length == 9) {
				parseNumber.pop();

			}; 
				return `**${k}**` + ": " + `${dataNome[i]} ` + `${metodo(k)}` + '\n' ;	
			
			// return `**${k}**` + ": " + `${dataNome[i]} ` + `${metodo(k)} ` + '\n' ;	
		}));

		const embed = new Discord.MessageEmbed()
		// Set the title of the field
		.setTitle(novoBoss.substring(BossName.lastIndexOf("+")))
		// Set the color of the embed
		.setColor(0xff0000)
		// Set the main content of the embed
		.setDescription(resposta.toString() )
		// temparray.forEach(function name(e, i) {
		// 	embed.addField(entry, `**${e}**` + `${parseNome[i]}\n`);
		//  } );

		message.channel.send({ embeds: [embed] })

		//retorna uma resposta da chamada GET contendo a string do parse com nome do player
		await browser.close();
	});

});


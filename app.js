///SCRAPER DE CONSULTAS FEITO BY: PAULO , TODOS DIREITOS RESERVADOS, ESCRITO DIA 22/06/2K23 AS 09:38 AM

///MODOLUS
const express = require('express');
const app = express();
const input = require("input");
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.set('trust proxy', 2);
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");

///PORTA ONDE AS APIS VAI RODAR NA LOCALHOST
const PORT = process.env.PORT || 8080 ||3000;

///TELA INICIAL DAS APIS
app.get('/', async(req, res, next) => {
   return res.status(200).send({
    status: false,
    resultado: 'APIS ONLINE'
  });
  })

// ConsultasMkBuscas
// FAMILIACNXCONTINENCIAOFC

const Grupos = [
    { chat: "FAMILIACNXCONTINENCIAOFC", bot: "MkBuscasRobot" },

];

//COLOCA SEUS BAGULHO AQ

const apiId = "23362627"; //https://my.telegram.org/auth
const apiHash = "ec7e85ca66f45396dad98e1833bc52a6"; //https://my.telegram.org/auth
const stringSession = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNTkBuw1sRlzusxp25RDu1HcNYhZQa+/27R3hG+5a4zEOzt2xyGCndZlKf3+Zz1AX69GWn/NUPWr99maI2T4EZEhwzFhD49YOYADtfAIbsnfWeocoha+1vXudoL5W3ctn2Vn3tc6LlARHy5vu+S0hCXfXWJw52qaj4zKknRZ5FnRWufMWRFyOD7+leg7t31V8IrQsG5EvtLwXXg58/dlZhIMN/HSGmGCdVye1OFooNtlumTzm4RYi8LC7xe1K6ocpi+ZciWXQzXLamz01JcGy5gHtN3ohTTk57i+zSzwcUF5SSrzxj9d7FuARKmZb0vnVPWSEiobqfJLocF8sInVCIHk9Br0=")

//FIM

const telegram = new TelegramClient(stringSession, apiId, apiHash, {
	connectionRetries: 5
});

(async () => {
	await telegram.start({
		phoneNumber: "5511989926695", // SEU NUMERO DE TELEFONE AQUI DA CONTA DO TELEGRAM QUE DESEJA USAR!
		password: async () => await input.text("insira sua senha: "),
		phoneCode: async () =>
			await input.text("Insira o codigo recebido no seu telegram: "),
		onError: (err) => console.log(err)
	});
	console.log("TELEGRAM: Conectado com sucesso!");
	console.log(telegram.session.save());
	await telegram.sendMessage("me", { message: "To Online!" });
})();


// EXEMPLO DE COMO USAR A API

// HTTPS://LOCALHOST:8080/CPF1/O CPF AQUI

// TIPOS DE CONSULTAS DISPONÍVEIS:
// cpf1|cpf2|cpf3|cpf4|tel1|tel2|tel3|cnpj|score|nome|parentes|beneficios|placa1|vizinhos|site|ip|cep|bin|email

//FIM

app.get("/:type/:q/", async (req, res) => {
	var db = JSON.parse(fs.readFileSync("db.json"));
    var achou2 = false;
	const type = req.params.type.toLowerCase() || '';
	const query = req.params.q.toLowerCase() || '';
 if (!query) return res.json({
                 status: true,

               "resultado": {
               "str": "[❌] Ensira o tipo de consulta [❌]"
               }
             })
 if (type.search(/cpf1|cpf2|cpf3|cpf4|tel1|tel2|tel3|cnpj|score|nome|parentes|beneficios|placa1|vizinhos|site|ip|cep|bin|email/) === -1) return res.send('Tipo de consulta invalida');
	console.log(`[CONSULTA] : ${type} = ${query}`);
	if (db && db[type] && db[type][query]) return res.send(db[type][query]);

	const Consultar = {
		nego() {
			if (query.length != 11) return res.json({err:'O CPF deve conter 11 digitos!'})

			telegram.sendMessage(Grupos[0].chat, {
				message: `/cpf2 ${query}`
			})
				.catch((e) => res.json({
                 status: true,

               "resultado": {
               "str": "[❌] Não foi possível fazer consulta.[❌]"
               }
             })
				);
		}
	}
	if (Consultar[type]) Consultar[type]();
	else await telegram.sendMessage(Grupos[0].chat, {
		message: `/${type} ${query}`
	})
		.catch((e) =>{
			res.json({
                 status: true,

               "resultado": {
               "str": "[❌] Não foi possível fazer consulta.[❌]"
               }
             })

			console.log("DEBUG NO CÓDIGO:",e)
		});
	async function OnMsg(event) {
		const message = event.message;
		const textPure =
			message && message.text ?
			message.text :
			message && message.message ?
			message.message : '';
		const text =
			message && message.text ?
			message.text.toLowerCase() :
			message && message.message ?
			message.message.toLowerCase() : '';
		const msgMarked = await message.getReplyMessage();
		const msgMarkedText =
			msgMarked && msgMarked.text ?
			msgMarked.text.toLowerCase() :
			msgMarked && msgMarked.message ?
			msgMarked.message.toLowerCase() : '';
		const sender = await message.getSender();
		const senderId = sender && sender.username ? sender.username : '';
		const chat = await message.getChat();
		const chatId = chat && chat.username ? chat.username : '';
		msgggveri = msgMarkedText.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
				queryverii = query.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
				txtuuuveri = text.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
		for (let i of Grupos) {
			try {
				if ((chatId == i.chat && senderId == i.bot) && (msgggveri.includes(queryverii) || txtuuuveri.includes(queryverii) )) {
					achou2 = true;
					await telegram.markAsRead(chat);
					//console.log(`text: ${textPure}, msgMarked: ${msgMarkedText}`)
					if (text.includes("⚠️"))return res.json({
                 status: true,

               "resultado": {
               "str": "[⚠️] NÃO ENCONTRANDO! [⚠️]"
               }
             })
					if (text.includes("Inválido") || text.includes("INVÁLIDO"))
						res.json({
                 status: true,

               "resultado": {
               "str": "[⚠️] INVALIDO! [⚠️]"
               }
             })

				}

				if ((chatId == i.chat && senderId == i.bot) && (msgggveri.includes(queryverii) || txtuuuveri.includes(queryverii) )) {
					achou2 = true;
					await telegram.markAsRead(chat);
					let str = textPure;
					str = str.replace(/\*/gi, "");
					str = str.replace(/\`/gi, "");
					str = str.replace(/\+/gi, "");
					str = str.replace(/\[/gi, "");
					str = str.replace(/\]/gi, "");
					str = str.replace(/\(/gi, "");
					str = str.replace(/\)/gi, "");
					str = str.replace(/\•/gi, "");
					str = str.replace(/\n\n\n/gi, "\n\n");
					str = str.replace(/CONSULTA DE CPF 2 \n\n/gi, "CONSULTA DE CPF ");
					str = str.replace(/🔍 CONSULTA DE CPF1 COMPLETA 🔍/gi, "CONSULTA DE CPF ");
					str = str.replace(/🔍 CONSULTA DE CPF3 COMPLETA 🔍/gi, "CONSULTA DE CPF ");
					str = str.replace(/🔍 CONSULTA DE CPF 4 🔍/gi, "CONSULTA DE CPF ");
                    str = str.replace(/BY: @MkBuscasRobot/gi, "");
					str = str.replace(/\n\nUSUÁRIO: NT CONSULTA/gi, '');
					str = str.replace(/USUÁRIO: NT CONSULTA\n\n/gi, '');
					str = str.replace(/ USUÁRIO: NT CONSULTA/gi, '');
					str = str.replace(/🔍|V1|V2/gi, '');
					str = str.replace(/COMPLETA/gi, '');
					str = str.replace(/CONSULTA DE CPF 2/gi, 'CONSULTA DE CPF');
					str = str.replace(/\n\nBY: @MkBuscasRobot/gi, "");
					str = str.replace(/\n\nREF: @refmkbuscas/gi, '');
					str = str.replace(/\nREF: @refmkbuscas/gi, '');
					str = str.replace(/REF: @refmkbuscas/gi, '');
					str = str.replace(/EMPTY/gi, "");
					str = str.replace(/\n\n\n\n/gi, "\n\n");
					str = str.replace(/USUÁRIO: NT CONSULTA/gi, '');
					str = str.replace(/COMPLETA/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗖𝗣𝗙\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗣𝗟𝗔𝗖𝗔\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗧𝗘𝗟𝗘𝗙𝗢𝗡𝗘\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗡𝗢𝗠𝗘\n\n/gi, '');




					let json = {};
					const linhas = str.split("\n");
					for (const t of linhas) {
						const key = t.split(": ");
						key[0] = key[0]
							.replace(/\//g, " ")
							.toLowerCase()
							.replace(/(?:^|\s)\S/g, function (a) {
								return a.toUpperCase();
							})
							.replace(/ |•|-|•|/g, "");
						json[key[0]] = key[1];
					}
					if (db && db[type]) db[type][query] = str;
					else db[type] = {}, db[type][query] = str;
					fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));


					res.json({
                 status: true,

               "resultado": {
               str
               }
             })
				}
				return;
			} catch (e) {
				if (achou2) return;
				res.json({
                 status: true,

               "resultado": {
               "str": "[❌]error no servidor, não foi possivel fazer a consulta[❌]"
               }
             })
				console.log(e);
			}
		}
	}
	telegram.addEventHandler(OnMsg, new NewMessage({}));
	setTimeout(() => {
		if (achou2) return;
		res.json({
                 status: true,

               "resultado": {
               "str": "[⏳]servidor demorou muito para responder[⏳]"
               }
             })
	}, 10000);
});


app.listen(PORT, () => {
    console.log(`Aplicativo rodando na url: http://localhost:${PORT}`);
  });

const chalk = require('chalk')

  let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Atualizado = ${__filename}`)
	delete require.cache[file]
	require(file)
})

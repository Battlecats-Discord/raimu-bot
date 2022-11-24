const {
  Client,
  IntentsBitField,
  Collection,
  Colors,
  EmbedBuilder,
} = require("discord.js");
const { createServer } = require("http");
const { readdirSync } = require("fs");

const client = new Client({
  intents: [new IntentsBitField(131071)],
	// evveryoneメンションなどの暴走防止
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
});

// コマンドをロードしてくる場所
const commands = new Collection();
readdirSync("./commands").map((file) => {
  const cmd = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
});

// ログインした時にLogged in as なんとか#なんとか って出すやつ
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// メッセージに応じて返信するだけ
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content) return;
  if (message.content === "よろしく") {
    message.reply("よろしくやで");
    
  } else if ((/らいむ(しね|シネ|死ね)/).test(message.content)) {
    message.reply("お前タイムアウト確定な");
    
    } else if (message.content === "おやすみ") {
    message.reply("報告すんなカス");

    } else if (message.content === "おもんない") {
    message.reply("それ今言う必要ある？お前の方がおもんない");

    } else if (message.content === "しりとりしよ") {
    message.reply("いいよ！じゃあ俺からね、リボン！！！");

    } else if (message.content === "おはよう") {
    message.reply("飯作って待ってんぞ、早く顔洗ってこい");

    } else if (message.content === "おそよう") {
    message.reply("馬鹿野郎！今何時だと思ってる！！！");

    } else if (message.content === "Ryo") {
    message.reply("Ryoうるさい
                ！");
    
  } else if ((/(死ね|しね|シネ)(カス|かす)/).test(message.content)) {
    message.reply("お前が死ねや");
    
  } else if ((/(🤔|:thinking:)/).test(message.content)) {
    message.reply({
      content: "考えるな、感じろ",
      allowedMentions: {
        repliedUser: false
          
      },
    });
  }
});

// pinどめするメッセージ本体
// footer.tectがpinである以外は変えてもよし
const pin = {
  embeds: [
    new EmbedBuilder()
      .setAuthor({
        name: "らいむ",
        iconURL:
          "https://cdn.discordapp.com/avatars/757884690920112140/fdc58f3e19fe5542ca15b95d81117b99.png?size=2048",
      })
      .setDescription(
        `［自己紹介のテンプレート］\n①名前/呼び名\n②プレイ期間\n③入った理由\n④一言`
      )
      .setFooter({ text: "pin" })
      .setColor(Colors.Blue)
      .toJSON(),
  ],
};

// pinどめの処理
client.on("messageCreate", function (message) {
  if (message.author.id === client.user.id) return;
  if (message.channelId === process.env.PIN_CHANNEL) {
    const pinMessage = getPinMessage(message.channel);
    if (pinMessage) {
      return pinMessage
        .delete()
        .then(function () {
          return message.channel.send(pin);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
});

// コマンドハンドラ
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content?.startsWith(process.env.PREFIX)) return;
  const [command, ...args] = message.content
    .slice(process.env.PREFIX.length)
    .split(/ +/g);
  const cmd = commands.find(
    (cmd) => cmd.name === command ?? cmd.aliases?.includes(command)
  );
  if (!cmd) return message.reply("コマンドが見つかりませんでした");
  try {
    await new Promise((resolve) => resolve(cmd.exec(message, args)));
  } catch (error) {
    console.log(error);
  }
});

// ログインした時にpinどめのチャンネルを取得してメッセージが消えてたら送り直す
client.once("ready", async () => {
  const channel = client.channels.resolve(process.env.PIN_CHANNEL);
  if (channel) {
    await channel.messages.fetch();
    if (!getPinMessage(channel)) channel.send(pin);
  }
});

client.login(process.env.TOKEN);

// 常駐化のためのhttpサーバーを起動する部分
createServer((_, res) => res.end("k")).listen(3000);

// 全部ぐぐふぁんがやったようなもん
// チャンネルからpinどめするべきメッセージを取得
function getPinMessage(channel) {
  return channel.messages.cache.find(
    (message) =>
      message.embeds[0]?.footer?.text === "pin" &&
      message.author?.id === client.user.id
  );
}

// 基本的にどんなエラーでも落ちなくなる無敵の呪文。諸刃の剣
process.on("uncaughtException", (error) => console.error(error));
process.on("unhandledRejection", (error) => console.error(error));

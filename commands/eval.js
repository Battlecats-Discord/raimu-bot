const { Colors, EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  aliases: ["exec"],
  async exec(message, args) {
		// 権限ない人を除外
    if (!process.env.ADMIN.split(",").includes(message.author.id))
      return message.reply("お前にはコマンドを実行する権限はねーよ!!");
    try {
			// 内容を実行
      const result = await new Promise((resolve) =>
        resolve(eval(args.join(" ")))
      );
			// 内容を返信
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("成功")
            .setDescription(`\`\`\`js\n${inspect(result)}\n\`\`\``)
            .setColor(Colors.Blue)
            .toJSON(),
        ],
      });
    } catch (error) {
			// エラーが出たら
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("エラー")
            .setDescription(`\`\`\`js\n${inspect(error)}\n\`\`\``)
            .setColor(Colors.Red)
            .toJSON(),
        ],
      });
    }
  },
};

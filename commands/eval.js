const { Colors, EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  aliases: ["exec"],
  async exec(message, args) {
    if (!process.env.ADMIN.split(",").includes(message.author.id))
      return message.reply("お前にはコマンドを実行する権限はねーよ!!");
    try {
      const result = await new Promise((resolve) =>
        resolve(eval(args.join(" ")))
      );
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

const { Colors, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "purge",
  aliases: "bulk",
  async exec(message, args) {
    if (!message.member.permissions.has(8))
      return message.reply("お前にはコマンドを実行する権限はねーよ!!");
  },
};

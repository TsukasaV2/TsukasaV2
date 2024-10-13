import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Muestra información sobre el bot.'),
    async execute(interaction: ChatInputCommandInteraction) {
        // Obtener información del bot
        const botUser = interaction.client.user;
        const botName = botUser.username;
        const botId = botUser.id;
        const botAvatar = botUser.displayAvatarURL();
        const botBanner = botUser.bannerURL(); // Obtener URL del banner
        const creationDate = interaction.client.application?.createdAt.toLocaleDateString(); // Fecha de creación de la aplicación

        // Crear un embed con información del bot
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Color del embed
            .setTitle('Información del Bot')
            .setDescription('Aquí tienes algunos detalles sobre el bot.')
            .addFields(
                { name: 'Nombre', value: `\`${botName}\``, inline: true },
                { name: 'ID', value: `\`${botId}\``, inline: true },
                { name: 'Versión', value: '`1.0.0`', inline: true }, // Aquí puedes actualizar la versión manualmente si es necesario
                { name: 'Fecha de creación', value: `\`${creationDate}\``, inline: true } // Fecha de creación del bot
            )
            .setThumbnail(botAvatar) // Establecer la foto del bot como miniatura
            .setImage(botBanner ? botBanner : null) // Establecer el banner si existe
            .setFooter({ text: '¡Gracias por usar el bot!', iconURL: interaction.user.displayAvatarURL() }) // Pie de página con avatar del usuario
            .setTimestamp(); // Timestamp

        // Responder con el embed
        await interaction.reply({ embeds: [embed] });
    },
};

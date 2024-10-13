import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con Pong y muestra información adicional.'),
    async execute(interaction: ChatInputCommandInteraction) {
        // Obtener el tiempo de inicio
        const startTime = Date.now();

        // Calcular el ping
        const response = await interaction.reply({ content: '¡Pong!', fetchReply: true });

        // Calcular el tiempo de respuesta
        const ping = Date.now() - startTime;

        // Crear un embed con información del ping
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Color del embed
            .setTitle('🏓 Pong!')
            .setDescription('El comando ha sido procesado exitosamente.')
            .addFields(
                { name: 'Tiempo de respuesta', value: `\`${ping} ms\``, inline: true },
                { name: 'Hora de la respuesta', value: `\`${new Date().toLocaleTimeString()}\``, inline: true }
            )
            .setFooter({ text: '¡Gracias por usar el bot!', iconURL: interaction.user.displayAvatarURL() }) // Pie de página con avatar del usuario
            .setTimestamp(); // Timestamp

        // Responder con el embed
        await interaction.editReply({ embeds: [embed] });
    },
};

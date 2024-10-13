import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export const command = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Muestra una waifu aleatoria.'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // Hacer la solicitud a la API de waifu.pics usando axios
            const response = await axios.get('https://api.waifu.pics/sfw/waifu');
            const data = response.data;

            // Crear un embed para mostrar la waifu
            const embed = new EmbedBuilder()
                .setColor('#FF69B4') // Color del embed
                .setTitle('Aquí tienes una waifu aleatoria')
                .setImage(data.url) // URL de la imagen de la waifu
                .setFooter({ text: '¡Disfruta!', iconURL: interaction.user.displayAvatarURL() }) // Pie de página con avatar del usuario
                .setTimestamp(); // Timestamp

            // Responder con el embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener la waifu:', error);
            await interaction.reply('Ocurrió un error al obtener una waifu. Por favor, inténtalo de nuevo más tarde.');
        }
    },
};

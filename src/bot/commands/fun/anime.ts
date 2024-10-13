import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export const command = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca información de un anime.')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Título del anime que deseas buscar.')
                .setRequired(true)),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const query = interaction.options.getString('titulo');

        // Definir la consulta GraphQL
        const queryGraphQL = `
        query ($search: String) {
            Media(search: $search, type: ANIME) {
                title {
                    romaji
                    english
                    native
                }
                description
                episodes
                coverImage {
                    large
                }
                averageScore
                popularity
                status
            }
        }`;

        // Realizar la solicitud a la API de AniList
        try {
            const response = await axios.post('https://graphql.anilist.co', {
                query: queryGraphQL,
                variables: { search: query }
            });

            const anime = response.data.data.Media;

            // Crear un embed con la información del anime
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(anime.title.romaji || 'Anime no encontrado')
                .setDescription(anime.description ? anime.description.replace(/(<([^>]+)>)/gi, '') : 'Sin descripción disponible.')
                .setThumbnail(anime.coverImage.large)
                .addFields(
                    { name: 'Título en inglés', value: anime.title.english || 'No disponible', inline: true },
                    { name: 'Título nativo', value: anime.title.native || 'No disponible', inline: true },
                    { name: 'Episodios', value: `${anime.episodes || 'Desconocido'}`, inline: true },
                    { name: 'Puntuación', value: `${anime.averageScore || 'N/A'} / 100`, inline: true },
                    { name: 'Popularidad', value: `${anime.popularity}`, inline: true },
                    { name: 'Estado', value: anime.status || 'Desconocido', inline: true }
                )
                .setFooter({ text: 'Datos proporcionados por AniList', iconURL: 'https://anilist.co/img/icons/icon.svg' })
                .setTimestamp();

            // Responder con el embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener datos de AniList:', error);
            await interaction.reply({ content: 'Hubo un error al buscar el anime. Intenta nuevamente más tarde.', ephemeral: true });
        }
    },
};

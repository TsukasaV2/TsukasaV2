import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// Respuestas por categoría
const positiveResponses = [
    'Sí, definitivamente.',
    'Claro que sí.',
    'Sin duda.',
    'Es seguro.',
    '¡Por supuesto!'
];

const negativeResponses = [
    'No, no lo creo.',
    'Es poco probable.',
    'No cuentes con eso.',
    'No.',
    'Tal vez, pero es poco probable.'
];

const neutralResponses = [
    'Tal vez.',
    'No estoy seguro, pregúntame más tarde.',
    'La respuesta no es clara.',
    'Depende de muchos factores.',
    'Quizás, pero aún es incierto.'
];

// Almacén de preguntas recientes
const recentQuestions = new Set();

export const command = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Haz una pregunta y recibe una respuesta de la bola mágica.')
        .addStringOption(option => 
            option.setName('pregunta')
                .setDescription('La pregunta que deseas hacer.')
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const question = interaction.options.getString('pregunta');

        // Validación de la pregunta
        if (!question || question.length < 5) {
            return await interaction.reply({ 
                content: 'Por favor, formula una pregunta más detallada (mínimo 5 caracteres).', 
                ephemeral: true 
            });
        }

        // Evitar preguntas repetidas
        if (recentQuestions.has(question)) {
            return await interaction.reply({ 
                content: 'Ya has preguntado eso recientemente. ¡Intenta con otra pregunta!', 
                ephemeral: true 
            });
        }

        // Agregar la pregunta al conjunto de preguntas recientes
        recentQuestions.add(question);

        // Elegir la respuesta en función del tipo de pregunta
        let response;
        if (question.toLowerCase().includes('sí') || question.toLowerCase().includes('no')) {
            response = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
        } else {
            response = neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
        }

        // Crear un embed para mostrar la pregunta y la respuesta
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Color del embed
            .setTitle('🔮 Bola Mágica 8')
            .addFields(
                { name: 'Pregunta', value: `\`${question}\``, inline: true },
                { name: 'Respuesta', value: `\`${response}\``, inline: true }
            )
            .setFooter({ text: `Preguntado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Responder con el embed
        await interaction.reply({ embeds: [embed] });

        // Eliminar la pregunta del conjunto después de un tiempo
        setTimeout(() => {
            recentQuestions.delete(question);
        }, 60000); // 1 minuto
    },
};

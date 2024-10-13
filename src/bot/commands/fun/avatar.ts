import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar de un usuario.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Selecciona un usuario para ver su avatar.')
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        // Obtener el usuario del argumento o usar el autor del mensaje
        const user: User = interaction.options.getUser('usuario') || interaction.user;

        // Crear un embed para mostrar el avatar
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Color del embed
            .setTitle(`Avatar de ${user.username}`) // Título con el nombre del usuario
            .setDescription('Aquí está tu avatar, ¡disfrútalo!') // Descripción
            .setImage(user.displayAvatarURL({ size: 1024 })) // URL del avatar en calidad 1024
            .addFields(
                { name: 'ID del usuario', value: `\`${user.id}\``, inline: true },
                { name: 'Fecha de creación', value: `\`${user.createdAt.toDateString()}\``, inline: true }
            )
            .setFooter({ text: '¡Gracias por usar el bot!', iconURL: interaction.user.displayAvatarURL() }) // Pie de página con avatar del usuario
            .setTimestamp(); // Timestamp

        // Responder con el embed
        await interaction.reply({ embeds: [embed] });
    },
};

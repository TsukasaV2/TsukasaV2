import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Muestra la información detallada del perfil de un usuario.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario cuyo perfil deseas ver')
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        // Obtener el usuario objetivo o el que ejecuta el comando si no se selecciona ninguno
        const usuario: User = interaction.options.getUser('usuario') || interaction.user;
        
        // Obtener información adicional del usuario (incluyendo banner)
        const userWithBanner = await usuario.fetch();

        // Obtener el miembro del servidor
        const member = await interaction.guild?.members.fetch(usuario.id);
        
        // Obtener URL del avatar y el banner (si está disponible)
        const avatarUrl = userWithBanner.displayAvatarURL({ size: 2048 });
        const bannerUrl = userWithBanner.bannerURL({ size: 2048 });
        
        // Información adicional
        const createdAt = usuario.createdAt.toLocaleDateString();
        const joinedAt = member ? member.joinedAt?.toLocaleDateString() : 'N/A';
        const userTag = `${usuario.username}#${usuario.discriminator}`;

        // Crear un embed con la información del perfil
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Perfil de ${usuario.username}`)
            .setThumbnail(avatarUrl) // Imagen de perfil
            .addFields(
                { name: 'Usuario', value: userTag, inline: true },
                { name: 'ID de usuario', value: usuario.id, inline: true },
                { name: 'Fecha de creación de la cuenta', value: createdAt, inline: true },
                { name: 'Fecha de unión al servidor', value: joinedAt || 'No está en el servidor', inline: true }
            )
            .setImage(bannerUrl || avatarUrl) // Si tiene banner, lo muestra; si no, muestra el avatar en grande
            .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Responder con el embed
        await interaction.reply({ embeds: [embed] });
    },
};

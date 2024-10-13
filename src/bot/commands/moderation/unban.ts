import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbanea a un usuario del servidor.')
        .addStringOption(option => 
            option.setName('usuario')
                .setDescription('El ID del usuario que será desbaneado')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('motivo')
                .setDescription('La razón del unban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Solo los miembros con permiso pueden usar este comando
    async execute(interaction: ChatInputCommandInteraction) {
        const userId = interaction.options.getString('usuario')!;
        const reason = interaction.options.getString('motivo') || 'No se proporcionó motivo';

        try {
            // Obtener la lista de baneos desde la instancia del servidor
            const bans = await interaction.guild?.bans.fetch();
            const bannedUsers = bans?.map(ban => `${ban.user.tag} (ID: ${ban.user.id})`).join('\n') || 'No hay usuarios baneados.';

            // Intentar desbanear al usuario
            await interaction.guild?.members.unban(userId, reason);

            // Crear un embed de confirmación
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Usuario Desbaneado')
                .addFields(
                    { name: 'Usuario ID', value: userId, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Motivo', value: reason, inline: true },
                )
                .setTimestamp();

            // Enviar la respuesta en el canal donde se ejecutó el comando
            await interaction.reply({ embeds: [embed] });

            // Crear un embed para mostrar la lista de baneados
            const bansEmbed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle('🔒 Usuarios Baneados')
                .setDescription(bannedUsers)
                .setTimestamp();

            // Enviar la lista de baneados en el mismo canal donde se ejecutó el comando
            await interaction.followUp({ embeds: [bansEmbed] });

        } catch (error) {
            console.error('Error al intentar desbanear al usuario:', error);
            return interaction.reply({ content: 'Hubo un error al intentar desbanear al usuario. Verifica que el ID sea correcto y que tenga permisos.', ephemeral: true });
        }
    },
};

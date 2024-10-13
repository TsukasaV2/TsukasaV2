import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const command = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa a un usuario del servidor.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario que será expulsado')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('motivo')
                .setDescription('La razón de la expulsión')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // Solo los miembros con permiso pueden usar este comando
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'No se proporcionó motivo';
        const member = await interaction.guild?.members.fetch(targetUser!.id);

        if (!member) {
            return interaction.reply({ content: 'No se pudo encontrar al usuario en este servidor.', ephemeral: true });
        }

        if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: 'No tengo permisos para expulsar miembros.', ephemeral: true });
        }

        if (member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'No puedes expulsar a un administrador.', ephemeral: true });
        }

        try {
            // Intentar enviar un DM al usuario expulsado
            await targetUser?.send(`Has sido expulsado de **${interaction.guild?.name}** por la siguiente razón: ${reason}`);

            // Expulsar al usuario
            await member.kick(reason);

            // Crear un embed de confirmación
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🚫 Usuario Expulsado')
                .addFields(
                    { name: 'Usuario', value: `${targetUser?.tag}`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Motivo', value: reason, inline: true },
                )
                .setTimestamp();

            // Enviar la respuesta en el canal donde se ejecutó el comando
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al intentar expulsar al usuario:', error);
            return interaction.reply({ content: 'Hubo un error al intentar expulsar al usuario. Verifica que tengo los permisos correctos y que el usuario puede ser expulsado.', ephemeral: true });
        }
    },
};

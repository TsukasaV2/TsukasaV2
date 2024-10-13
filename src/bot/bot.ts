import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { commands, loadCommands } from './handlers/commandHandler';
import AdvancedPresence from './handlers/advancedPresence'; // Importar el sistema avanzado de presencia

config(); // Cargar variables de entorno desde .env

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const presenceManager = new AdvancedPresence(client); // Crear instancia del gestor de presencia

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // Iniciar la presencia avanzada cambiando cada 10 segundos (10000 ms)
    presenceManager.start(20000);
});

// Manejar las interacciones
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({ content: '¡Comando no encontrado!', ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
    }
});

// Cargar comandos y loguear el bot
(async () => {
    const clientId = process.env.CLIENT_ID as string;
    const token = process.env.TOKEN as string;
    const guildId = process.env.GUILD_ID;

    await loadCommands(clientId, token, guildId);
    await client.login(token);
})();

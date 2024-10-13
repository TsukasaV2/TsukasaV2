import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { REST, Routes, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { Command } from '../types/Command';

export const commands = new Collection<string, Command>();

// Función recursiva para cargar comandos desde subcarpetas
const loadCommandsFromDir = (dir: string) => {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = join(dir, file.name);
        if (file.isDirectory()) {
            // Si es un directorio, llamamos recursivamente
            loadCommandsFromDir(filePath);
        } else if (file.isFile() && file.name.endsWith('.ts')) {
            // Si es un archivo .ts, lo importamos
            import(filePath).then(({ command }) => {
                commands.set(command.data.name, command);
            }).catch(error => {
                console.error(`Error al cargar el comando desde ${filePath}:`, error);
            });
        }
    }
};

export const loadCommands = async (clientId: string, token: string, guildId?: string) => {
    const commandsPath = join(__dirname, '../commands');
    const commandData: RESTPostAPIApplicationCommandsJSONBody[] = []; // Definimos el tipo aquí

    // Cargamos los comandos desde la carpeta y subcarpetas
    loadCommandsFromDir(commandsPath);

    // Esperamos a que todos los comandos se hayan cargado antes de continuar
    await new Promise(resolve => {
        const interval = setInterval(() => {
            if (commands.size > 0) {
                clearInterval(interval);
                resolve(null);
            }
        }, 100);
    });

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        // Si se proporciona guildId, registra comandos para ese guild; de lo contrario, registra globalmente
        const route = guildId 
            ? Routes.applicationGuildCommands(clientId, guildId) 
            : Routes.applicationCommands(clientId);

        // Preparar los datos del comando para registrar
        commands.forEach(command => {
            commandData.push(command.data.toJSON());
        });

        await rest.put(route, {
            body: commandData,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};

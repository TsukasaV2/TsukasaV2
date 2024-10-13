// src/handlers/advancedPresence.ts
import { Client, ActivityType } from 'discord.js';

class AdvancedPresence {
    private client: Client;
    private activities: { name: string; type: ActivityType }[];
    private interval: NodeJS.Timeout | null = null;

    constructor(client: Client) {
        this.client = client;
        this.activities = [
            { name: '🌕 Mirando la luna', type: ActivityType.Watching },
            { name: '🎶 Escuchando música', type: ActivityType.Listening },
            { name: '💬 Chateando en Discord', type: ActivityType.Playing },
            { name: '🖥️ Programando un bot', type: ActivityType.Playing },
            { name: '🤖 Aprendiendo algo nuevo', type: ActivityType.Watching },
        ];
    }

    // Método para iniciar la presencia avanzada
    public start(intervalTime: number) {
        if (this.interval) return; // Evitar múltiples intervalos

        let index = 0;

        this.interval = setInterval(() => {
            const guildCount = this.client.guilds.cache.size; // Obtener la cantidad de servidores
            const activityToSet = this.activities[index];

            if (index === 0) {
                // Si es la primera actividad, establecer el estado con la cantidad de servidores
                this.setPresence({ name: `en ${guildCount} servidores`, type: ActivityType.Watching });
            } else {
                // Para otras actividades
                this.setPresence(activityToSet);
            }

            index = (index + 1) % this.activities.length; // Cambiar al siguiente índice
        }, intervalTime);
    }

    // Método para detener la presencia avanzada
    public stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // Método para establecer la presencia
    private setPresence(activity: { name: string; type: ActivityType }) {
        this.client.user?.setPresence({
            activities: [{
                name: activity.name,
                type: activity.type,
            }],
            status: 'online',
        });
    }
}

export default AdvancedPresence;

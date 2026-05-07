require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});
let activeVoiceChannel = null;
const playTime = new Map();
const commands = [
    new SlashCommandBuilder()
        .setName('rzw_join')
        .setDescription('Suruh Satpam Jaga Voice'),
    new SlashCommandBuilder()
        .setName('rzw_playtime')
        .setDescription('Minta Rekapan User Voice')
].map(command => command.toJSON());
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Slash command registered.');
    } catch (error) {
        console.error(error);
    }
})();

function FormatTime(milidetik) {
    const totalSeconds = Math.floor(milidetik / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
}

function FormatDate(date) {
    return date.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' WIB';
}

client.once('ready', () => {
    console.log(`${client.user.tag} Online!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'rzw_join') {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({
                content: 'Error: Kamu Harus Masuk Voice Channel Dulu!',
                ephemeral: true
            });
        }
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        activeVoiceChannel = voiceChannel;
        recordStartedAt = new Date();
        voiceChannel.members.forEach(member => {
            if (member.user.bot) return;
            playTime.set(member.id, {
                joinedAt: Date.now(),
                totalTime: 0
            });
        });
        await interaction.reply({
            content: `## Berhasil Join Ke Voice Channel: <#${voiceChannel.id}>`,
            ephemeral: true
        });
    }
    if (interaction.commandName === 'rzw_playtime') {
        if (!activeVoiceChannel) {
            return interaction.reply({
                content: '## Bot Sedang Tidak Berada Di Voice Channel.',
                ephemeral: true
            });
        }
        const results = [];
        playTime.forEach((data, userId) => {
            let totalTime = data.totalTime;
            if (activeVoiceChannel.members.has(userId)) {
                totalTime += Date.now() - data.joinedAt;
            }
            results.push({
                userId,
                totalTime
            });
        });
        results.sort((a, b) => b.totalTime - a.totalTime);
        if (results.length === 0) {
            return interaction.reply({
                content: 'Belum Ada Data Playtime.',
                ephemeral: true
            });
        }
        let description = '';
        results.forEach((user, index) => {
            description += `${index + 1}. <@${user.userId}> = ${FormatTime(user.totalTime)}\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle('🎧 Voice Playtime')
            .setDescription(description)
            .addFields(
                {
                    name: '📌 Started Record',
                    value: recordStartedAt ? FormatDate(recordStartedAt) : 'Unknown'
                }
            )
            .setColor('Blue')
            .setFooter({
                text: `Tracking ${results.length} User`
            })
            .setTimestamp();
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (!activeVoiceChannel) return;
    const trackedChannelId = activeVoiceChannel.id;
    if (
        newState.channelId === trackedChannelId &&
        oldState.channelId !== trackedChannelId
    ) {
        if (newState.member.user.bot) return;
        playTime.set(newState.member.id, {
            joinedAt: Date.now(),
            totalTime: 0
        });
    }
    if (oldState.channelId === trackedChannelId && newState.channelId !== trackedChannelId) {
        if (oldState.member.user.bot) return;
        const data = playTime.get(oldState.member.id);
        if (!data) return;
        const sessionTime = Date.now() - data.joinedAt;
        data.totalTime += sessionTime;
        playTime.set(oldState.member.id, data);
    }
});

client.login(process.env.TOKEN);
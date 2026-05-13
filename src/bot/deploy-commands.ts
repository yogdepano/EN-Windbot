import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const commands = [
  // Member Commands
  new SlashCommandBuilder()
    .setName('points')
    .setDescription('Show your current Guild Point balance'),
  
  new SlashCommandBuilder()
    .setName('checkin')
    .setDescription('Submit a check-in with screenshot proof')
    .addStringOption(option => 
      option.setName('activity')
        .setDescription('The activity you are checking in for')
        .setRequired(true)
        .addChoices(
          { name: 'Breaking Army (Sat)', value: 'Breaking Army (Saturday)' },
          { name: 'Breaking Army (Sun)', value: 'Breaking Army (Sunday)' },
          { name: 'Guild Heroes Realm', value: 'Guild Heroes Realm' },
          { name: 'Guild Party', value: 'Guild Party' },
          { name: 'Guild War (Sat)', value: 'Guild War (Saturday)' },
          { name: 'Guild War (Sun)', value: 'Guild War (Sunday)' },
          { name: 'Weekly Activity 2500', value: 'Reach 2,500 Weekly Activity' },
        ))
    .addAttachmentOption(option => 
      option.setName('screenshot')
        .setDescription('Upload your screenshot proof')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('rewards')
    .setDescription('View the reward catalog'),

  new SlashCommandBuilder()
    .setName('redeem')
    .setDescription('Submit a reward redemption request')
    .addStringOption(option => 
      option.setName('reward')
        .setDescription('The reward you want to redeem')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('notes')
        .setDescription('Optional notes for the admin')),

  new SlashCommandBuilder()
    .setName('history')
    .setDescription('Show your GP earning and redemption history'),

  // Admin Commands
  new SlashCommandBuilder()
    .setName('approve-checkin')
    .setDescription('Approve a pending check-in')
    .addStringOption(option => option.setName('id').setDescription('The check-in ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the pending check-in approval queue')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('approve-redeem')
    .setDescription('Approve a reward redemption')
    .addStringOption(option => option.setName('id').setDescription('The redemption ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('adjust-points')
    .setDescription('Manually adjust a member\'s GP')
    .addUserOption(option => option.setName('user').setDescription('The member').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('GP amount (can be negative)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for adjustment').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('suspend-member')
    .setDescription('Suspend or ban a member from the rewards program')
    .addUserOption(option => option.setName('user').setDescription('The member').setRequired(true))
    .addStringOption(option => 
      option.setName('status')
        .setDescription('The new status')
        .setRequired(true)
        .addChoices(
          { name: 'Active', value: 'active' },
          { name: 'Suspended', value: 'suspended' },
          { name: 'Banned', value: 'banned' },
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Configure guild-wide settings')
    .addStringOption(option => option.setName('key').setDescription('Setting key').setRequired(true))
    .addStringOption(option => option.setName('value').setDescription('Setting value').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data: any = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

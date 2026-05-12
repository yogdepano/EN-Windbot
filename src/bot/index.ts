import { Client, GatewayIntentBits, EmbedBuilder, Interaction, TextChannel } from 'discord.js';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { gpService } from '../services/gpService';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- HELPERS ---

async function getOrCreateProfile(discordId: string, username: string) {
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('discord_id', discordId)
    .single();

  if (existing) return existing;

  const { data: newUser, error: createError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: crypto.randomUUID(),
      discord_id: discordId,
      username: username,
      referral_code: `EN-${discordId.substring(0, 5)}`,
      role: 'member',
      status: 'active'
    })
    .select()
    .single();

  if (createError) console.error('Error creating user:', createError);
  return newUser;
}

const GOLD = 0xd4af37;
const PURPLE = 0x8b5cf6;

// --- BOT EVENTS ---

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;
  const profile = await getOrCreateProfile(user.id, user.username);

  if (profile.status === 'banned' || profile.status === 'suspended') {
    return interaction.reply({ content: `Your account is currently ${profile.status}. Contact an admin.`, ephemeral: true });
  }

  try {
    // --- MEMBER COMMANDS ---

    if (commandName === 'points') {
      const embed = new EmbedBuilder()
        .setTitle('🏆 Your Guild Points')
        .setColor(GOLD)
        .addFields(
          { name: 'Current Balance', value: `**${profile.gp_balance} GP**`, inline: true },
          { name: 'Lifetime Earned', value: `${profile.lifetime_earned} GP`, inline: true }
        )
        .setThumbnail(user.displayAvatarURL());
      
      await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'checkin') {
      const activityName = interaction.options.getString('activity', true);
      const screenshot = interaction.options.getAttachment('screenshot', true);

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
      const weekStr = weekStart.toISOString().split('T')[0];

      const { data: activity } = await supabaseAdmin.from('activities').select('id').eq('name', activityName).single();

      const { error } = await supabaseAdmin.from('check_ins').insert({
        user_id: profile.id,
        activity_id: activity?.id,
        screenshot_url: screenshot.url,
        week_start_date: weekStr,
        status: 'pending'
      });

      if (error) throw error;

      const embed = new EmbedBuilder()
        .setTitle('✅ Proof Submitted')
        .setDescription(`Submitted for **${activityName}**. Pending review.`)
        .setImage(screenshot.url)
        .setColor(PURPLE);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (commandName === 'rewards') {
      const { data: rewards } = await supabaseAdmin.from('rewards').select('*').eq('availability', true);
      
      const embed = new EmbedBuilder()
        .setTitle('🎁 Reward Catalog')
        .setColor(GOLD)
        .addFields((rewards || []).map(r => ({ name: `${r.name} (${r.cost} GP)`, value: r.description || 'Premium Reward' })));

      await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'redeem') {
      const rewardName = interaction.options.getString('reward', true);
      const notes = interaction.options.getString('notes');

      const { data: reward } = await supabaseAdmin.from('rewards').select('*').eq('name', rewardName).single();
      
      if (!reward) return interaction.reply({ content: 'Reward not found.', ephemeral: true });
      if (profile.gp_balance < reward.cost) return interaction.reply({ content: 'Insufficient GP.', ephemeral: true });

      await supabaseAdmin.from('redemption_requests').insert({
        user_id: profile.id,
        reward_id: reward.id,
        member_notes: notes
      });

      await interaction.reply({ content: `✅ Redemption for **${rewardName}** submitted!`, ephemeral: true });
    }

    else if (commandName === 'history') {
      const { data: history } = await supabaseAdmin.from('check_ins').select('*, activities(name, points)').eq('user_id', profile.id).limit(5).order('created_at', { ascending: false });
      
      const embed = new EmbedBuilder()
        .setTitle('📜 Recent Activity')
        .setColor(PURPLE)
        .addFields((history || []).map(h => ({ name: h.activities.name, value: `${h.status.toUpperCase()} • +${h.activities.points} GP` })));

      await interaction.reply({ embeds: [embed] });
    }

    // --- ADMIN COMMANDS ---

    else if (commandName === 'approve-checkin') {
      const subId = interaction.options.getString('id', true);
      const { data: sub } = await supabaseAdmin.from('check_ins').select('*, activities(name, points)').eq('id', subId).single();
      
      if (!sub) return interaction.reply({ content: 'Not found.', ephemeral: true });

      await supabaseAdmin.rpc('adjust_gp', { p_user_id: sub.user_id, p_amount: sub.activities.points });
      await supabaseAdmin.from('check_ins').update({ status: 'approved' }).eq('id', subId);

      await interaction.reply({ content: `Approved **${subId}**.`, ephemeral: true });
    }

    else if (commandName === 'adjust-points') {
      const targetUser = interaction.options.getUser('user', true);
      const amount = interaction.options.getInteger('amount', true);
      const targetProfile = await getOrCreateProfile(targetUser.id, targetUser.username);

      await supabaseAdmin.rpc('adjust_gp', { p_user_id: targetProfile.id, p_amount: amount });
      await interaction.reply({ content: `Adjusted **${targetUser.username}** by **${amount} GP**.`, ephemeral: true });
    }

  } catch (error: any) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'An error occurred.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

import { Client, GatewayIntentBits, EmbedBuilder, Interaction, TextChannel } from 'discord.js';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { gpService } from '../services/gpService';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- HELPERS ---

async function getProfile(discordId: string) {
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('discord_id', discordId)
    .single();

  if (!existing) {
    throw new Error('You must log in to the Every Nation Rewards website first to register your account! Please visit: https://en-windbots.vercel.app');
  }

  return existing;
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
  
  let profile;
  try {
    profile = await getProfile(user.id);
  } catch (error: any) {
    return interaction.reply({ content: error.message, ephemeral: true });
  }

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
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
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

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // --- ADMIN COMMANDS ---
    const isAdmin = profile.role === 'admin';

    if (commandName === 'queue') {
      if (!isAdmin) return interaction.reply({ content: '⛔ This command is for admins only.', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });
      console.log(`[Admin] /queue requested by ${user.tag}`);

      const { data: pending, error: queueError } = await supabaseAdmin
        .from('check_ins')
        .select('*, profiles:profiles!check_ins_user_id_fkey(username), activities(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (queueError) {
        console.error('[Admin] /queue error:', queueError);
        return interaction.editReply({ content: '❌ Failed to fetch the queue.' });
      }

      if (!pending || pending.length === 0) {
        return interaction.editReply({ content: '☕ The approval queue is empty! Great job.' });
      }

      const embed = new EmbedBuilder()
        .setTitle('📋 Pending Approval Queue')
        .setColor(PURPLE)
        .setDescription(`There are currently **${pending.length}** pending submissions.`)
        .addFields(
          pending.slice(0, 10).map((p: any) => ({
            name: `${p.profiles?.username || 'Unknown User'} - ${p.activities?.name || 'Unknown Activity'}`,
            value: `ID: \`${p.id}\`\n[View Screenshot](${p.screenshot_url})\nSubmitted: <t:${Math.floor(new Date(p.created_at).getTime() / 1000)}:R>`
          }))
        );

      if (pending.length > 10) {
        embed.setFooter({ text: `Showing first 10 items. Visit the admin dashboard for the full list.` });
      }

      await interaction.editReply({ embeds: [embed] });
    }

    else if (commandName === 'approve-checkin') {
      const subId = interaction.options.getString('id', true);
      await interaction.deferReply({ ephemeral: true });

      const { data: sub, error: fetchError } = await supabaseAdmin
        .from('check_ins')
        .select('*, activities(name, points)')
        .eq('id', subId)
        .single();
      
      if (fetchError || !sub) {
        return interaction.editReply({ content: `❌ Check-in not found: ${subId}` });
      }

      if (sub.status === 'approved') {
        return interaction.editReply({ content: 'ℹ️ This check-in has already been approved.' });
      }

      // Award Points
      const { error: rpcError } = await supabaseAdmin.rpc('adjust_gp', { 
        p_user_id: sub.user_id, 
        p_amount: sub.activities.points 
      });

      if (rpcError) {
        console.error('[Admin] RPC Error:', rpcError);
        return interaction.editReply({ content: `❌ Failed to award points: ${rpcError.message}` });
      }

      // Update Status
      const { error: updateError } = await supabaseAdmin
        .from('check_ins')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile.id
        })
        .eq('id', subId);

      if (updateError) {
        console.error('[Admin] Update Error:', updateError);
        return interaction.editReply({ content: `⚠️ Points awarded, but failed to update status: ${updateError.message}` });
      }

      await interaction.editReply({ content: `✅ Successfully approved **${sub.activities.name}** for **${subId}** (+${sub.activities.points} GP).` });
    }

    else if (commandName === 'adjust-points') {
      const targetUser = interaction.options.getUser('user', true);
      const amount = interaction.options.getInteger('amount', true);
      const reason = interaction.options.getString('reason', true);
      
      await interaction.deferReply({ ephemeral: true });

      let targetProfile;
      try {
        targetProfile = await getProfile(targetUser.id);
      } catch (e) {
        return interaction.editReply({ content: `❌ Cannot adjust points. **${targetUser.username}** has not logged into the website yet.` });
      }

      const { error: adjError } = await supabaseAdmin.rpc('adjust_gp', { 
        p_user_id: targetProfile.id, 
        p_amount: amount 
      });

      if (adjError) {
        console.error('[Admin] Adjust Error:', adjError);
        return interaction.editReply({ content: `❌ Failed to adjust points: ${adjError.message}` });
      }

      // Log the adjustment
      await supabaseAdmin.from('audit_logs').insert({
        user_id: profile.id,
        action: 'manual_gp_adjust',
        details: { target_id: targetProfile.id, amount, reason }
      });

      await interaction.editReply({ content: `✅ Adjusted **${targetUser.username}** by **${amount} GP**. Reason: ${reason}` });
    }

  } catch (error: any) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'An error occurred.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

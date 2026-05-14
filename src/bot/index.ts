import { Client, GatewayIntentBits, EmbedBuilder, Interaction, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { gpService } from '../services/gpService';
import { aiService } from '../services/aiService';
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
  const { user } = interaction;
  
  let profile;
  try {
    profile = await getProfile(user.id);
  } catch (error: any) {
    if (interaction.isChatInputCommand()) {
      return interaction.reply({ content: error.message, ephemeral: true });
    }
    return;
  }

  const { commandName } = (interaction as any);

  // --- BUTTON INTERACTIONS ---
  if (interaction.isButton()) {
    const isAdmin = profile.role === 'admin';
    if (!isAdmin) return interaction.reply({ content: '⛔ Admin only.', ephemeral: true });

    const [action, subId] = interaction.customId.split('_');
    await interaction.deferUpdate();

    if (action === 'approve') {
      const { data: sub } = await supabaseAdmin
        .from('check_ins')
        .select('*, activities(points)')
        .eq('id', subId)
        .single();

      if (sub && sub.status === 'pending') {
        await supabaseAdmin.rpc('adjust_gp', { p_user_id: sub.user_id, p_amount: sub.activities.points });
        await supabaseAdmin.from('check_ins').update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile.id
        }).eq('id', subId);
        
        await interaction.followUp({ content: `✅ Approved submission \`${subId.substring(0, 8)}\`.`, ephemeral: true });
      }
    } else if (action === 'reject') {
      await supabaseAdmin.from('check_ins').update({ 
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.id
      }).eq('id', subId);
      await interaction.followUp({ content: `❌ Rejected submission \`${subId.substring(0, 8)}\`.`, ephemeral: true });
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  if (profile.status === 'banned' || profile.status === 'suspended') {
    return interaction.reply({ content: `Your account is currently ${profile.status}. Contact an admin.`, ephemeral: true });
  }

  try {
    // --- MEMBER COMMANDS ---

    if (commandName === 'points') {
      const expLevel = Math.floor(Math.sqrt((profile.total_exp || 0) / 10)) + 1;
      const themeColor = profile.theme_color || GOLD;

      const embed = new EmbedBuilder()
        .setTitle(`${profile.title || 'Member'} | ${profile.username}`)
        .setColor(themeColor as any)
        .setDescription(profile.catchphrase || '_No catchphrase set_')
        .addFields(
          { name: '💰 GP Balance', value: `**${profile.gp_balance}**`, inline: true },
          { name: '⭐ Lifetime EXP', value: `**${profile.total_exp || 0}** (Lvl ${expLevel})`, inline: true },
          { name: '🏅 Badges', value: (profile.badges && profile.badges.length > 0) ? profile.badges.join(' ') : 'None yet!' }
        )
        .setThumbnail(user.displayAvatarURL());
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (commandName === 'top') {
      const { data: topUsers, error: topError } = await supabaseAdmin
        .from('profiles')
        .select('username, total_exp, title')
        .gt('total_exp', 0)
        .order('total_exp', { ascending: false })
        .limit(10);

      if (topError) throw topError;

      const embed = new EmbedBuilder()
        .setTitle('🏆 Every Nation Leaderboard')
        .setColor(GOLD)
        .setDescription('Top 10 members by Lifetime EXP')
        .addFields(
          (topUsers || []).map((u, i) => ({
            name: `${i + 1}. ${u.username}`,
            value: `${u.title || 'Member'} • **${u.total_exp || 0} EXP**`
          }))
        );

      await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'checkin') {
      const activityName = interaction.options.getString('activity', true);
      const screenshot = interaction.options.getAttachment('screenshot', true);

      await interaction.deferReply({ ephemeral: true });

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

      // --- AI VERIFICATION ---
      await interaction.editReply({ content: '✅ Proof Submitted. AI is analyzing your screenshot...' });
      const aiResult = await aiService.verifyScreenshot(screenshot.url, activityName);

      if (aiResult.detected) {
        await supabaseAdmin.from('check_ins').update({ 
          admin_notes: `🤖 AI: ${aiResult.reason}` 
        }).eq('user_id', profile.id).eq('screenshot_url', screenshot.url);
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ Proof Submitted')
        .setDescription(`Submitted for **${activityName}**. Pending review.\n\n${aiResult.detected ? `🤖 **AI Recommendation**: ${aiResult.meets_requirement ? 'PASS ✅' : 'FAIL ❌'}\n_${aiResult.reason}_` : ''}`)
        .setImage(screenshot.url)
        .setColor(PURPLE);

      await interaction.editReply({ content: '', embeds: [embed] });
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
          pending.slice(0, 5).map((p: any) => ({
            name: `${p.profiles?.username || 'Unknown User'} - ${p.activities?.name || 'Unknown Activity'}`,
            value: `ID: \`${p.id.substring(0, 8)}\`\n[View Screenshot](${p.screenshot_url})\nSubmitted: <t:${Math.floor(new Date(p.created_at).getTime() / 1000)}:R>`
          }))
        );

      // Create buttons for the first 5 items
      const rows = pending.slice(0, 5).map((p: any) => {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`approve_${p.id}`)
            .setLabel(`Approve ${p.profiles?.username?.substring(0, 10)}`)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`reject_${p.id}`)
            .setLabel('Reject')
            .setStyle(ButtonStyle.Danger)
        );
      });

      if (pending.length > 5) {
        embed.setFooter({ text: `Showing first 5 items with buttons. Visit the admin dashboard for the full list.` });
      }

      await interaction.editReply({ embeds: [embed], components: rows as any });
    }

    else if (commandName === 'approve-checkin') {
      const subId = interaction.options.getString('id', true).trim();
      await interaction.deferReply({ ephemeral: true });

      // Support partial ID matching (min 4 characters for safety)
      let query = supabaseAdmin.from('check_ins').select('*, activities(name, points)');
      
      if (subId.length >= 4 && subId.length < 36) {
        query = query.ilike('id', `${subId}%`);
      } else {
        query = query.eq('id', subId);
      }

      const { data: matches, error: fetchError } = await query.limit(2);
      
      if (fetchError || !matches || matches.length === 0) {
        return interaction.editReply({ content: `❌ No check-in found starting with: **${subId}**` });
      }

      if (matches.length > 1) {
        return interaction.editReply({ content: `⚠️ Multiple check-ins found starting with **${subId}**. Please provide more characters for a unique match.` });
      }

      const sub = matches[0];

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

import { Client, GatewayIntentBits, EmbedBuilder, Interaction, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { gpService } from '../services/gpService';
import * as dotenv from 'dotenv';
import cron from 'node-cron';
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
  setupReminders();
  setupAnnouncements();
});

function setupReminders() {
  const reminderChannelId = process.env.DISCORD_REMINDER_CHANNEL_ID;
  if (!reminderChannelId) {
    console.log('[Scheduler] No DISCORD_REMINDER_CHANNEL_ID configured in env.');
    return;
  }

  // Schedule task for 10:00 PM on Saturdays (6) and Sundays (0)
  // Pattern: "0 22 * * 6,0" (Minute 0, Hour 22, Day of month *, Month *, Day of week 6 & 0)
  cron.schedule('0 22 * * 6,0', async () => {
    console.log('[Scheduler] Running weekly check-in reminder job...');
    try {
      // 1. Calculate the start date of the current week (Monday)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
      const weekStr = weekStart.toISOString().split('T')[0];

      // 2. Fetch all active members from Supabase
      const { data: activeProfiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, discord_id, username')
        .eq('status', 'active')
        .eq('role', 'member');

      if (profilesError) throw profilesError;
      if (!activeProfiles || activeProfiles.length === 0) {
        console.log('[Scheduler] No active members found to remind.');
        return;
      }

      // 3. Fetch all check-ins for the current week
      const { data: weekCheckins, error: checkinsError } = await supabaseAdmin
        .from('check_ins')
        .select('user_id')
        .eq('week_start_date', weekStr);

      if (checkinsError) throw checkinsError;

      // 4. Determine who has not submitted a check-in this week
      const checkedInUserIds = new Set((weekCheckins || []).map(c => c.user_id));
      const missingMembers = (activeProfiles || []).filter(
        p => p.discord_id && !checkedInUserIds.has(p.id)
      );

      if (missingMembers.length === 0) {
        console.log('[Scheduler] All active members have submitted check-ins this week!');
        return;
      }

      // 5. Fetch the reminder text channel
      const channel = await client.channels.fetch(reminderChannelId);
      if (!channel || !channel.isTextBased()) {
        console.error(`[Scheduler] Channel with ID ${reminderChannelId} is not a valid text channel.`);
        return;
      }

      // 6. Build the reminder message pings and embed
      const pings = missingMembers.map(m => `<@${m.discord_id}>`).join(' ');
      
      const embed = new EmbedBuilder()
        .setTitle('⏰ Weekly Check-in Reminder')
        .setDescription(
          `Friendly reminder to submit your weekly activity proof screenshot!\n\nUse the **\`/checkin\`** command in Discord to claim your GP before the Monday reset.`
        )
        .setColor(PURPLE)
        .addFields({ 
          name: 'Outstanding Members', 
          value: missingMembers.map(m => `• ${m.username || 'Unknown User'}`).join('\n') 
        })
        .setFooter({ text: 'Every Nation Rewards Tracker' })
        .setTimestamp();

      // Send pings and embed
      // Discord messages have a 2000 character limit. If pings string is too long, we can chunk it.
      if (pings.length > 1900) {
        const chunks: string[] = [];
        let currentChunk = '';
        for (const member of missingMembers) {
          const ping = `<@${member.discord_id}> `;
          if (currentChunk.length + ping.length > 1900) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
          }
          currentChunk += ping;
        }
        if (currentChunk) chunks.push(currentChunk.trim());

        for (let i = 0; i < chunks.length; i++) {
          if (i === 0) {
            await (channel as TextChannel).send({ content: `Attention: ${chunks[i]}`, embeds: [embed] });
          } else {
            await (channel as TextChannel).send({ content: chunks[i] });
          }
        }
      } else {
        await (channel as TextChannel).send({ content: `Attention: ${pings}`, embeds: [embed] });
      }

      console.log(`[Scheduler] Sent reminders to ${missingMembers.length} members.`);
    } catch (err) {
      console.error('[Scheduler] Error running reminder job:', err);
    }
  });
}

function setupAnnouncements() {
  const reminderChannelId = process.env.DISCORD_REMINDER_CHANNEL_ID;
  const announcementRoleId = process.env.DISCORD_ANNOUNCEMENT_ROLE_ID;

  if (!reminderChannelId) {
    console.log('[Scheduler] No DISCORD_REMINDER_CHANNEL_ID configured in env.');
    return;
  }
  if (!announcementRoleId) {
    console.log('[Scheduler] No DISCORD_ANNOUNCEMENT_ROLE_ID configured in env.');
    return;
  }

  const roleMention = `<@&${announcementRoleId}>`;

  // 1. Breaking Army Announcement (7:20 PM / 19:20 on Saturday & Sunday)
  cron.schedule('20 19 * * 6,0', async () => {
    console.log('[Scheduler] Sending Breaking Army announcement...');
    try {
      const channel = await client.channels.fetch(reminderChannelId);
      if (channel && channel.isTextBased()) {
        await (channel as TextChannel).send({
          content: `${roleMention} It's 10 minutes before Breaking Army. Get Ready to earn rewards this week.`
        });
      }
    } catch (err) {
      console.error('[Scheduler] Error sending Breaking Army announcement:', err);
    }
  });

  // 2. Guild Party Announcement (7:50 PM / 19:50 on Saturday & Sunday)
  cron.schedule('50 19 * * 6,0', async () => {
    console.log('[Scheduler] Sending Guild Party announcement...');
    try {
      const channel = await client.channels.fetch(reminderChannelId);
      if (channel && channel.isTextBased()) {
        await (channel as TextChannel).send({
          content: `${roleMention} It's 10 minutes before the Guild Party! Time to take a bath!`
        });
      }
    } catch (err) {
      console.error('[Scheduler] Error sending Guild Party announcement:', err);
    }
  });

  // 3. Guild War Announcement (8:20 PM / 20:20 on Saturday & Sunday)
  cron.schedule('20 20 * * 6,0', async () => {
    console.log('[Scheduler] Sending Guild War announcement...');
    try {
      const channel = await client.channels.fetch(reminderChannelId);
      if (channel && channel.isTextBased()) {
        await (channel as TextChannel).send({
          content: `${roleMention} It's 10 minutes before Guild War. Time to earn Guild Contribution Points.`
        });
      }
    } catch (err) {
      console.error('[Scheduler] Error sending Guild War announcement:', err);
    }
  });
}

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
    const [action, subId] = interaction.customId.split('_');

    if (action === 'view-schedule') {
      await interaction.deferReply({ ephemeral: true });

      const { data: event } = await supabaseAdmin
        .from('scheduling_events')
        .select('*')
        .eq('id', subId)
        .single();

      if (!event) {
        return interaction.editReply({ content: 'Event not found.' });
      }

      const { data: list } = await supabaseAdmin
        .from('member_availabilities')
        .select('*')
        .eq('event_id', subId);

      if (!list || list.length === 0) {
        return interaction.editReply({ content: 'No availabilities submitted yet.' });
      }

      const uniqueUsers = new Set(list.map(item => item.discord_id));
      const totalParticipants = uniqueUsers.size;

      const timeSlots: { [timestamp: number]: Set<string> } = {};

      list.forEach(item => {
        const start = new Date(item.start_time).getTime();
        const end = new Date(item.end_time).getTime();

        for (let time = start; time < end; time += 1800000) {
          if (!timeSlots[time]) {
            timeSlots[time] = new Set();
          }
          timeSlots[time].add(item.discord_id);
        }
      });

      const sortedSlots = Object.keys(timeSlots)
        .map(ts => ({
          time: parseInt(ts),
          count: timeSlots[parseInt(ts)].size,
          users: Array.from(timeSlots[parseInt(ts)])
        }))
        .sort((a, b) => b.count - a.count || a.time - b.time);

      if (sortedSlots.length === 0) {
        return interaction.editReply({ content: 'No overlapping time slots found.' });
      }

      const durationMs = event.duration_minutes * 60 * 1000;
      const slotsPerBlock = durationMs / 1800000;

      const blockOptions: { startTime: number; count: number; users: string[] }[] = [];

      for (const slot of sortedSlots) {
        const startTime = slot.time;
        
        let minParticipantsInBlock = totalParticipants + 1;
        const usersInBlockSet = new Set<string>();

        let validBlock = true;
        for (let i = 0; i < slotsPerBlock; i++) {
          const currentSlotTime = startTime + i * 1800000;
          const slotData = sortedSlots.find(s => s.time === currentSlotTime);
          if (!slotData) {
            validBlock = false;
            break;
          }
          minParticipantsInBlock = Math.min(minParticipantsInBlock, slotData.count);
          slotData.users.forEach(u => usersInBlockSet.add(u));
        }

        if (validBlock) {
          blockOptions.push({
            startTime,
            count: minParticipantsInBlock,
            users: Array.from(usersInBlockSet)
          });
        }
      }

      blockOptions.sort((a, b) => b.count - a.count || a.startTime - b.startTime);

      if (blockOptions.length === 0) {
        return interaction.editReply({ content: 'Could not find any solid block of time matching the duration.' });
      }

      const topOptions = blockOptions.slice(0, 3);

      const embed = new EmbedBuilder()
        .setTitle(`📊 Optimal Times: ${event.title}`)
        .setDescription(`Calculated from **${totalParticipants}** participant(s).`)
        .setColor(PURPLE);

      topOptions.forEach((option, index) => {
        const startTimestamp = Math.floor(option.startTime / 1000);
        const endTimestamp = Math.floor((option.startTime + durationMs) / 1000);

        embed.addFields({
          name: `Option ${index + 1}: ${option.count}/${totalParticipants} Free`,
          value: `📅 **<t:${startTimestamp}:F>** to **<t:${endTimestamp}:t>** (<t:${startTimestamp}:R>)`
        });
      });

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const isAdmin = profile.role === 'admin';
    if (!isAdmin) return interaction.reply({ content: '⛔ Admin only.', ephemeral: true });

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

      await interaction.reply({ embeds: [embed], ephemeral: true });
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

      const embed = new EmbedBuilder()
        .setTitle('✅ Proof Submitted')
        .setDescription(`Submitted for **${activityName}**. Pending review.`)
        .setImage(screenshot.url)
        .setColor(PURPLE);

      await interaction.editReply({ embeds: [embed] });
    }

    else if (commandName === 'rewards') {
      const { data: rewards } = await supabaseAdmin.from('rewards').select('*').eq('availability', true);
      
      const embed = new EmbedBuilder()
        .setTitle('🎁 Reward Catalog')
        .setColor(GOLD)
        .addFields((rewards || []).map(r => ({ name: `${r.name} (${r.cost} GP)`, value: r.description || 'Premium Reward' })));

      await interaction.reply({ embeds: [embed], ephemeral: true });
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

    else if (commandName === 'schedule') {
      const title = interaction.options.getString('title', true);
      const duration = interaction.options.getInteger('duration') || 60;

      await interaction.deferReply();

      const { data: event, error: eventError } = await supabaseAdmin
        .from('scheduling_events')
        .insert({
          title,
          duration_minutes: duration,
          creator_id: profile.id,
          guild_id: interaction.guildId || '',
          channel_id: interaction.channelId || ''
        })
        .select()
        .single();

      if (eventError || !event) {
        console.error(eventError);
        return interaction.editReply({ content: '❌ Failed to create scheduling event.' });
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const scheduleUrl = `${appUrl}/schedule/${event.id}`;

      const embed = new EmbedBuilder()
        .setTitle(`📅 Event Scheduling: ${title}`)
        .setDescription(`Help us find the best time for **${title}** (${duration} mins)!\n\nClick the button below to select your availability.`)
        .setColor(PURPLE)
        .addFields({ name: 'Creator', value: `<@${user.id}>`, inline: true })
        .setFooter({ text: 'Timezone-aware scheduling' })
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Enter Availability')
          .setStyle(ButtonStyle.Link)
          .setURL(scheduleUrl),
        new ButtonBuilder()
          .setCustomId(`view-schedule_${event.id}`)
          .setLabel('View Best Time')
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.editReply({ embeds: [embed], components: [row] });
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

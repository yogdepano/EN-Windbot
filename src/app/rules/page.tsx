'use client';

export default function RulesPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      <div className="container py-12 md:py-16 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest gold-gradient mb-4">Every Nation</h1>
          <h2 className="text-xl md:text-2xl text-text-main font-bold">Rewards Program Rules</h2>
        </div>

        <div className="space-y-8">
          <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">1</span> Eligibility
            </h3>
            <p className="text-text-muted mb-4">To participate, a member must:</p>
            <ul className="list-disc pl-6 text-text-muted space-y-2">
              <li>Be an active member of Every Nation.</li>
              <li>Be a member of the Every Nation Discord server.</li>
              <li>Remain in good standing in both the guild and Discord.</li>
              <li>Follow all guild and community rules.</li>
            </ul>
          </div>

          <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">2</span> Exchange Rate
            </h3>
            <div className="bg-primary-10 border border-primary-20 rounded-lg p-4 mb-4 text-center">
              <p className="text-primary font-bold text-lg">1 Guild Point (GP) = 1 Echo Bead</p>
            </div>
            <p className="text-text-muted mb-4">Any in-game item can be redeemed based on its Echo Bead cost. Examples:</p>
            <ul className="list-disc pl-6 text-text-muted space-y-2">
              <li>Monthly Pass = 300 GP</li>
              <li>Battle Pass = 500 GP</li>
              <li>Premium Battle Pass = 1,000 GP</li>
            </ul>
          </div>

          <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">3</span> How to Earn Points
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-muted">
                <thead className="text-xs uppercase bg-white-5 text-text-main">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Activity</th>
                    <th className="px-4 py-3 rounded-tr-lg">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Breaking Army (Saturday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Breaking Army (Sunday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild Heroes Realm (once per week)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild Party (once per week)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild War (Saturday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Guild War (Sunday)</td><td className="px-4 py-3 font-bold text-primary">5 GP</td></tr>
                  <tr className="border-b border-white-5"><td className="px-4 py-3">Reach 2,500 Weekly Activity</td><td className="px-4 py-3 font-bold text-primary">10 GP</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-warning font-bold text-sm">Maximum Weekly Earnings: 40 GP</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">4</span> Check-In Rules
              </h3>
              <ul className="list-disc pl-6 text-text-muted space-y-2 text-sm">
                <li>Check-ins are available only after the relevant guild event has concluded.</li>
                <li>Check-ins are only accepted during designated time windows.</li>
                <li>Screenshot proof is required.</li>
                <li>Only one submission is allowed per eligible activity.</li>
                <li className="text-error">False or fraudulent submissions may result in disqualification.</li>
              </ul>
            </div>

            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">5</span> Redemption Rules
              </h3>
              <ul className="list-disc pl-6 text-text-muted space-y-2 text-sm">
                <li>Guild Points may be redeemed for any item purchasable with Echo Beads.</li>
                <li>Minimum redemption amount: 300 GP.</li>
                <li>Members must already have the full point balance required.</li>
                <li>Points cannot be reserved in advance.</li>
                <li>Approved requests are fulfilled within 14 days.</li>
                <li>Points are deducted upon approval.</li>
              </ul>
            </div>
          </div>

          <div className="card bg-error-10 border border-error p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            <h3 className="text-lg font-bold text-error mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-error flex-center text-xs text-white">6</span> Discord Forfeiture Rule
            </h3>
            <p className="text-text-main mb-2 font-medium">If a member:</p>
            <ul className="list-disc pl-6 text-text-muted mb-4 space-y-1">
              <li>Leaves the Every Nation Discord server, or</li>
              <li>Is removed from the server for violating guild or community rules,</li>
            </ul>
            <p className="text-text-main mb-2 font-medium">then the following are immediately forfeited:</p>
            <ul className="list-disc pl-6 text-error mb-4 space-y-1 font-medium">
              <li>All accumulated Guild Points</li>
              <li>All pending redemption requests</li>
              <li>Eligibility to participate in the rewards program</li>
            </ul>
            <p className="text-text-muted text-sm italic">If the member rejoins later, they start again from zero.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary-10 flex-center text-xs">7</span> Referral Bonus
              </h3>
              <p className="text-text-muted mb-4 text-sm">Members may earn bonus GP for recruiting active members. A referral qualifies only if the recruit:</p>
              <ul className="list-disc pl-6 text-text-muted space-y-1 mb-4 text-sm">
                <li>Joins Every Nation & the Discord server.</li>
                <li>Remains in good standing & becomes genuinely active.</li>
                <li>Earns at least 100 GP.</li>
              </ul>
              <div className="bg-secondary-10 border border-secondary p-3 rounded-lg text-center">
                <p className="text-secondary font-bold text-sm">Referral Reward: 50 GP per qualified recruit</p>
              </div>
            </div>

            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">8</span> Anti-Abuse Policy
              </h3>
              <p className="text-text-muted mb-4 text-sm">The guild reserves the right to deny, revoke, or adjust points for:</p>
              <ul className="list-disc pl-6 text-text-muted space-y-1 mb-4 text-sm">
                <li>False check-ins</li>
                <li>Alt accounts</li>
                <li>Referral abuse</li>
                <li>Exploiting the system</li>
                <li>Any dishonest conduct</li>
              </ul>
              <p className="text-warning font-bold text-sm">All leadership decisions are final.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">9</span> Program Changes
              </h3>
              <p className="text-text-muted mb-4 text-sm">Because rewards are funded by guild leadership and sponsors:</p>
              <ul className="list-disc pl-6 text-text-muted space-y-2 text-sm">
                <li>Point values may be changed.</li>
                <li>Reward prices may be adjusted.</li>
                <li>The program may be modified, paused, or discontinued at any time.</li>
              </ul>
            </div>

            <div className="card bg-surface-alt border-white/5 p-6 md:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-10 flex-center text-xs">10</span> Final Authority
              </h3>
              <p className="text-text-muted leading-relaxed text-sm">
                Guild leadership retains final authority over all decisions, interpretations, and disputes related to the rewards program.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

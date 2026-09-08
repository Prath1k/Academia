import React from 'react';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';

export type LegalPageType = 'privacy' | 'terms' | 'cookies' | 'refund';

interface Props {
  page: LegalPageType;
  onBack: () => void;
  onNavigate: (page: LegalPageType) => void;
}

const pageTitles: Record<LegalPageType, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms and Conditions',
  cookies: 'Cookie Policy',
  refund: 'Refund Policy'
};

const PolicyLink: React.FC<{ page: LegalPageType; label: string; onNavigate: Props['onNavigate'] }> = ({ page, label, onNavigate }) => (
  <button type="button" onClick={() => onNavigate(page)} className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-900">{label}</button>
);

export const LegalPage: React.FC<Props> = ({ page, onBack, onNavigate }) => {
  const title = pageTitles[page];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#legal-content" className="skip-link">Skip to policy content</a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" /> Back to AcademiaNexus
          </button>
          <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 sm:flex"><ShieldCheck className="h-4 w-4" /> Policy centre</span>
        </div>
      </header>

      <main id="legal-content" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">AcademiaNexus</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: 8 September 2026 · Prototype policy draft</p>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <strong>Launch requirement:</strong> This prototype does not yet publish a registered operator name, business address, privacy contact, or grievance officer. The operator must replace this notice with accurate legal details before accepting real users or paid transactions.
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm sm:p-8">
            {page === 'privacy' && <>
              <section><h2>1. Who operates this service</h2><p>AcademiaNexus is a prototype portal for students, academicians, industry partners, and institutions. The final operator name, registered address, privacy contact, and grievance contact must be inserted before production launch.</p></section>
              <section><h2>2. Information we collect</h2><p>We collect only information needed to provide the requested workspace: account identity and role, email address, institution or company, profile details you choose to provide, opportunity and application records, assessment answers and results, and technical authentication/session data.</p><p>Do not submit government identifiers, health information, financial information, passwords belonging to another person, or confidential employer or university records unless a reviewed production workflow expressly asks for them.</p></section>
              <section><h2>3. Why we use it</h2><p>We use information to authenticate accounts, provide role-based features, match skills to opportunities, process applications, support collaboration workflows, protect the service, and respond to support or legal requests. We do not currently run advertising or behavioural analytics.</p></section>
              <section><h2>4. Sharing and service providers</h2><p>Supabase may process authentication and database records when live credentials are configured. Google may process information when you choose Google sign-in. Images are loaded from Unsplash and fonts from Google Fonts on the public pages. Review the current terms and privacy notices of those providers before production launch and replace remote assets with approved, documented assets where appropriate.</p><p>We do not sell personal information. Access should be limited by role and database policies; the prototype still needs a production security and audit review.</p></section>
              <section><h2>5. Retention and your choices</h2><p>Keep information only for as long as needed for the stated purpose or a legal obligation. A production operator must publish deletion, correction, access, consent-withdrawal, and grievance procedures, together with response timelines and the correct contact channel.</p></section>
              <section><h2>6. Children and sensitive information</h2><p>This service is intended for adults and institutional users. Do not knowingly collect information from children or process sensitive personal data in this prototype. Obtain any required institutional, parental, or regulatory approvals before expanding the service.</p></section>
              <section><h2>7. Applicable law</h2><p>For India-facing operations, review the Digital Personal Data Protection Act, 2023 and rules or notifications in force at launch. If you target people in the European Economic Area, the United Kingdom, California, or another jurisdiction, obtain jurisdiction-specific advice and update the notice, rights, transfer, and consent language.</p></section>
            </>}

            {page === 'terms' && <>
              <section><h2>1. Acceptance and eligibility</h2><p>By using AcademiaNexus, you agree to these terms and the <PolicyLink page="privacy" label="Privacy Policy" onNavigate={onNavigate} />. You must provide accurate information, keep credentials secure, and have authority to act for any institution or company you represent.</p></section>
              <section><h2>2. Permitted use</h2><p>Use the service for legitimate education, recruitment, placement, learning, and collaboration activities. Do not impersonate another person, upload unlawful or confidential material, scrape the service, bypass access controls, manipulate assessments, discriminate, harass, or use opportunity data for spam.</p></section>
              <section><h2>3. User content and decisions</h2><p>You retain responsibility for content you submit and must have the rights to submit it. Matching scores, assessment results, profiles, and analytics are decision-support signals, not guarantees of employment, admission, placement, funding, or academic outcomes. Users must make and document their own fair, lawful decisions.</p></section>
              <section><h2>4. Prototype availability</h2><p>This is an evolving prototype. Features may change, mock data may appear when Supabase is not configured, and availability or accuracy is not guaranteed. Do not rely on the prototype for a safety-critical, legally binding, employment, medical, or financial decision.</p></section>
              <section><h2>5. Third-party services and intellectual property</h2><p>The service may rely on Supabase, Google sign-in, Google Fonts, and Unsplash-hosted imagery. Their terms apply to those services. The operator must maintain permission and attribution records for every production asset and remove assets when rights are unclear.</p></section>
              <section><h2>6. Suspension and contact</h2><p>Access may be restricted to protect users, the service, or legal rights. Publish the operator’s legal name, address, support contact, and grievance process here before launch. Nothing in these terms limits rights that cannot lawfully be excluded.</p></section>
            </>}

            {page === 'cookies' && <>
              <section><h2>1. What this prototype uses</h2><p>There is no analytics SDK, advertising pixel, embedded social feed, or marketing cookie in the current code. The app uses browser local storage to remember the necessary-cookie notice choice and may use authentication/session storage when Supabase or Google sign-in is enabled.</p></section>
              <section><h2>2. Necessary versus optional storage</h2><p>Necessary storage supports authentication, security, basic preferences, and the consent record. The prototype does not activate optional analytics or advertising storage. If optional tracking is added later, it must be disabled by default until valid consent is obtained, with a way to withdraw consent.</p></section>
              <section><h2>3. Third-party requests</h2><p>Public pages currently request fonts from Google Fonts and images from Unsplash. These requests can expose technical information such as IP address to those providers. Self-host approved assets before production if reducing third-party disclosure is required.</p></section>
              <section><h2>4. Managing storage</h2><p>You can clear local storage or block cookies in your browser, but sign-in and other necessary features may stop working. See the <PolicyLink page="privacy" label="Privacy Policy" onNavigate={onNavigate} /> for data handling and the <PolicyLink page="terms" label="Terms and Conditions" onNavigate={onNavigate} /> for service use.</p></section>
              <section><h2>5. Review before launch</h2><p>Confirm the final cookie inventory with a production scan of the deployed domain, including Supabase, OAuth redirects, error monitoring, payment providers, chat tools, and any future analytics. Update this policy whenever the inventory changes.</p></section>
            </>}

            {page === 'refund' && <>
              <section><h2>1. Current status</h2><p>AcademiaNexus is currently a prototype with no paid plans, checkout flow, subscription, or payment collection enabled. There are no current purchases to refund through this site.</p></section>
              <section><h2>2. Before paid launch</h2><p>Do not activate payments until the operator publishes accurate pricing, taxes, billing terms, cancellation rules, refund windows, support contact, and the consumer rights required in each target market. The policy must identify the legal seller and the payment processor.</p></section>
              <section><h2>3. Future requests</h2><p>When a paid service exists, refund requests should be submitted through the published support channel with the order reference. The operator must apply the policy shown at purchase and any mandatory statutory rights; this draft does not promise a refund for a future product.</p></section>
            </>}
          </article>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><FileText className="h-4 w-4" /> Other policies</p>
            <nav className="mt-4 space-y-2" aria-label="Legal policies">
              {(Object.keys(pageTitles) as LegalPageType[]).map(item => (
                <button key={item} type="button" onClick={() => onNavigate(item)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${item === page ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'}`}>
                  {pageTitles[item]}
                </button>
              ))}
            </nav>
            <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">This draft is implementation support, not legal advice. Have local counsel review it before public launch.</p>
          </aside>
        </div>
      </main>
    </div>
  );
};
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, CONTACT_EMAIL, pageMetadata, SITE_NAME } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMetadata({
	title: "Privacy Policy",
	description: `Learn how ${SITE_NAME} handles contact, application, donation, and merchandise information.`,
	path: "/privacy",
});

export default function PrivacyPage() {
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy policy", path: "/privacy" }])} />
			<section className="page-hero compact-hero">
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
					<p className="eyebrow">Your information</p>
					<h1 className="display">Privacy policy.</h1>
					<p>How information is handled when you contact, apply, donate, or purchase through this website.</p>
				</div>
			</section>
			<section className="section">
				<div className="container policy-copy">
					<p><strong>Last updated:</strong> August 9, 2026</p>
					<h2>Information you choose to provide</h2>
					<p>We receive information you submit through contact forms, program applications, volunteer or host applications, donations, and merchandise orders. The fields shown in each form determine what is collected.</p>
					<h2>How information is used</h2>
					<p>Information may be used to answer inquiries, review applications, coordinate outdoor experiences, process donations or purchases, provide order support, maintain records, and protect the website and its users.</p>
					<h2>Service providers</h2>
					<p>This website uses Jotform for applications, Zeffy for online donations, PayPal for commerce payments, Vercel for website hosting and file services, and Neon for application data storage. Those providers process information under their own privacy terms and security practices.</p>
					<h2>Applications and sensitive details</h2>
					<p>Program applications may request service history, contact details, participation needs, and other information needed to review or coordinate an experience. Please do not send sensitive information through general email or the contact form unless the team specifically requests it through an appropriate channel.</p>
					<h2>Retention and requests</h2>
					<p>Records are retained as needed for program coordination, transactions, organizational obligations, and legitimate operational purposes. You may contact the organization to ask about access, correction, or deletion of information, subject to records that must be retained.</p>
					<h2>External links and embedded services</h2>
					<p>Embedded forms, payment tools, social media links, and other external services may collect technical or account information under their own policies. Review the provider&apos;s terms before submitting information.</p>
					<h2>Contact</h2>
					<p>Privacy questions may be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through the <Link href="/contact">contact page</Link>.</p>
				</div>
			</section>
		</>
	);
}

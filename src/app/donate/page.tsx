import { ArrowDown, BedDouble, Fuel, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";

export const metadata = pageMetadata({
	title: "Donate to Veteran Outdoor Programs",
	description: "Support fully funded outdoor experiences for previously deployed Veterans and Gold Star families through a secure donation to Veteran's Outdoor Therapy.",
	path: "/donate",
});

const zeffyFormUrl =
	"https://www.zeffy.com/en-US/donation-form/make-an-impact-on-the-lives-of-our-american-heroes-and-gold-star-families";

const impact = [
	{
		icon: Fuel,
		amount: "$25",
		title: "Fuel the route",
		copy: "Helps move Veterans from the meeting point to open country.",
	},
	{
		icon: UtensilsCrossed,
		amount: "$100",
		title: "Share a meal",
		copy: "Provides meals and supplies during a fully funded adventure.",
	},
	{
		icon: BedDouble,
		amount: "$250",
		title: "Make camp possible",
		copy: "Supports lodging, field gear, and a participant's trip costs.",
	},
];

export default function DonatePage() {
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Donate", path: "/donate" }])} />
			<section className="donate-page">
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Donate" }]} />
					<p className="eyebrow">Every gift moves the mission</p>
					<h1 className="display">Help carry the next outdoor experience into the field.</h1>
					<p>
						From a warm meal on a hunt to fuel for a fishing trip, your contribution gives Veterans and Gold Star
						families space to reconnect and heal outside.
					</p>
					<div className="hero-actions">
						<Link className="button orange" href="#donation-form">
							Make a donation <ArrowDown size={18} />
						</Link>
						<Link className="button hero-secondary" href="/sponsorships">
							Explore sponsorships
						</Link>
					</div>
				</div>
			</section>
			<section className="section donation-form-section" id="donation-form">
				<div className="container donation-form-layout">
					<div>
						<p className="eyebrow">Secure online giving</p>
						<h2 className="display section-title">Make an impact today.</h2>
						<p className="prose">
							Choose an amount and complete your donation securely through Zeffy. Your contribution directly supports
							fully funded outdoor experiences for Veterans and Gold Star families.
						</p>
					</div>
					<div className="zeffy-shell">
						<iframe
							title="Donation form powered by Zeffy"
							src={zeffyFormUrl}
							allow="payment"
							loading="eager"
							referrerPolicy="strict-origin-when-cross-origin"
						/>
						<p className="embed-fallback">
							Having trouble with the embedded form?{" "}
							<a href={zeffyFormUrl} target="_blank" rel="noreferrer">
								Open Zeffy in a new tab.
							</a>
						</p>
					</div>
				</div>
			</section>
			<section className="section">
				<div className="container">
					<p className="eyebrow">Your impact in the field</p>
					<h2 className="display section-title">
						A gift becomes
						<br />
						an experience.
					</h2>
					<div className="donation-impact">
						{impact.map(({ icon: Icon, amount, title, copy }) => (
							<article key={title}>
								<Icon />
								<strong>{amount}</strong>
								<h3 className="display">{title}</h3>
								<p>{copy}</p>
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	);
}

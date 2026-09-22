import { ArrowDown, ForkKnife, GasPump, Tent } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";
import { EmbedFallback } from "@/components/embed-fallback";

export const metadata = pageMetadata({
	title: "Donate to Veteran Outdoor Programs",
	description: "Donate to Veteran's Outdoor Therapy and help cover the tags, lodging, meals, and gear behind outdoor experiences for previously deployed Veterans and Gold Star families.",
	path: "/donate",
});

const zeffyFormUrl =
	"https://www.zeffy.com/en-US/donation-form/make-an-impact-on-the-lives-of-our-american-heroes-and-gold-star-families";

const impact = [
	{
		icon: GasPump,
		amount: "$30",
		title: "Fuel the route",
		copy: "Keeps the trucks and boats running through a day in the field.",
	},
	{
		icon: ForkKnife,
		amount: "$125",
		title: "Share a meal",
		copy: "Feeds a Veteran and the crew through a full day in the field.",
	},
	{
		icon: Tent,
		amount: "$750",
		title: "Make camp possible",
		copy: "Covers lodging and the tags and licenses a hunt is built on.",
	},
];

export default function DonatePage() {
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Donate", path: "/donate" }])} />
			<section className="page-hero donate-hero">
				<HeroCollage seed={11} />
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
				<SectionEdge color="var(--paper)" variant="a" />
			</section>
			<section className="section donation-form-section" id="donation-form">
				<div className="container donation-form-layout">
					<div>
						<p className="eyebrow">Secure online giving</p>
						<h2 className="display section-title">Make an impact today.</h2>
						<p className="prose">
							Choose an amount and complete your donation securely through Zeffy. Every contribution goes directly
							into the experiences we put together for Veterans and Gold Star families.
						</p>
					</div>
					<div className="zeffy-shell">
						<EmbedFallback href={zeffyFormUrl} label="Open Zeffy in a new tab." position="above" />
						<iframe
							title="Donation form powered by Zeffy"
							src={zeffyFormUrl}
							allow="payment"
							loading="eager"
							referrerPolicy="strict-origin-when-cross-origin"
						/>
						<EmbedFallback href={zeffyFormUrl} label="Open Zeffy in a new tab." position="below" />
					</div>
				</div>
			</section>
			<section className="section impact-section">
				<div className="container">
					<div className="impact-head">
						<p className="eyebrow">Where your gift goes</p>
						<h2 className="display section-title">
							Every dollar puts a
							<br />
							Veteran in the field.
						</h2>
						<p className="prose">
							Veteran&apos;s Outdoor Therapy runs on donations. Landowners open their ground and our guides give their
							time, but an experience still has to be paid for long before anyone reaches the trailhead &mdash; and once
							it is committed, it is committed. Your gift is what holds that place in the field open for a previously
							deployed Veteran or a Gold Star family member.
						</p>
					</div>
					<div className="donation-impact">
						{impact.map(({ icon: Icon, amount, title, copy }) => (
							<Link className="impact-card" key={title} href="#donation-form">
								<span className="impact-icon">
									<Icon size={28} weight="duotone" />
								</span>
								<strong>{amount}</strong>
								<h3 className="display">{title}</h3>
								<p>{copy}</p>
								<span className="impact-cta">
									Give {amount} <ArrowDown size={15} />
								</span>
							</Link>
						))}
					</div>
					<p className="impact-footnote">
						Give what you can &mdash; every amount goes straight into the next experience.{" "}
						<Link className="text-link" href="#donation-form">
							Donate now
						</Link>
					</p>
				</div>
			</section>
		</>
	);
}

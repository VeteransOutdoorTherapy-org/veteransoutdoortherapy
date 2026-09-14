import { ArrowSquareOut, Envelope, Mountains } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { FACEBOOK_URL, SITE_NAME } from "@/lib/site";
import { SectionEdge } from "./section-edge";
export function Footer() {
	return (
		<footer className="footer">
			<SectionEdge color="var(--ink)" variant="b" above />
			<div className="container footer-grid">
				<div>
					<Mountains size={34} />
					<h2 className="display">
						The best therapy
						<br />
						is outside.
					</h2>
					<p>
						{SITE_NAME} is a nonprofit built on a simple belief: the outdoors reaches wounds that deployment leaves behind, seen and unseen.
					</p>
				</div>
				<div>
					<h3>Explore</h3>
					<Link href="/about">Our Mission</Link>
					<Link href="/programs">Programs</Link>
					<Link href="/gold-star-families">Gold Star Families</Link>
					<Link href="/field-stories">Field Notes</Link>
				</div>
				<div>
					<h3>Take action</h3>
					<Link href="/application">Apply</Link>
					<Link href="/sponsorships">Sponsor</Link>
					<Link href="/donate">Donate</Link>
					<Link href="/shop">Shop</Link>
				</div>
				<div>
					<h3>Connect</h3>
					<a href="mailto:contact@veteransoutdoortherapy.org">
						<Envelope size={16} /> Email Us
					</a>
					<a
						href={FACEBOOK_URL}
						target="_blank"
						rel="noreferrer">
						<ArrowSquareOut size={16} /> Facebook
					</a>
					<Link href="/contact">Contact</Link>
					<Link href="/privacy">Privacy</Link>
				</div>
			</div>
			<div className="container footer-bottom">
				<span>© {new Date().getFullYear()} {SITE_NAME}</span>
				<Link href="/admin">Admin</Link>
			</div>
		</footer>
	);
}

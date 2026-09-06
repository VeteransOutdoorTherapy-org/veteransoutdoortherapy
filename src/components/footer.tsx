import { ExternalLink, Mail, Mountain } from "lucide-react";
import Link from "next/link";
import { FACEBOOK_URL, SITE_NAME } from "@/lib/site";
export function Footer() {
	return (
		<footer className="footer">
			<div className="container footer-grid">
				<div>
					<Mountain size={34} />
					<h2 className="display">
						The best therapy
						<br />
						is outside.
					</h2>
					<p>
						{SITE_NAME} is a nonprofit creating fully funded outdoor experiences for previously deployed Veterans and Gold Star families.
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
						<Mail size={16} /> Email Us
					</a>
					<a
						href={FACEBOOK_URL}
						target="_blank"
						rel="noreferrer">
						<ExternalLink size={16} /> Facebook
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

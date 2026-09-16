"use client";
import { CaretDown, List, ShoppingBag, User, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";
import { useCart } from "./cart-provider";
import { SectionEdge } from "./section-edge";

const groups = [
	{
		label: "Programs",
		links: [
			["All Programs", "/programs"],
			["Veteran Hunting", "/programs/veteran-hunting"],
			["Gold Star Family Members", "/gold-star-families"],
		],
	},
	{
		label: "About",
		links: [
			["Our Mission", "/about"],
			["Gallery", "/gallery"],
			["Field Notes", "/field-stories"],
			["Testimonials", "/testimonials"],
			["Contact", "/contact"],
		],
	},
];

export function Header() {
	const pathname = usePathname();
	const [openPath, setOpenPath] = useState<string | null>(null);
	const [openGroup, setOpenGroup] = useState<string | null>(null);
	const [atTop, setAtTop] = useState(true);
	const [pinned, setPinned] = useState(true);
	const open = openPath === pathname;

	// The painted edge belongs to the top of the page. Once the header is stuck to the
	// viewport it becomes a plain bar: it slides away on the way down, back on the way up.
	useEffect(() => {
		let previous = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			setAtTop(y < 40);
			if (Math.abs(y - previous) < 6) return;
			setPinned(y < previous || y < 140);
			previous = y;
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const closeNavigation = () => {
		setOpenPath(null);
		setOpenGroup(null);
	};
	const supportsDesktopHover = () => window.matchMedia("(min-width: 921px) and (hover: hover)").matches;
	const { count } = useCart();
	return (
		<>
			<div className="notice">
				Outdoor experiences for previously deployed Veterans and Gold Star families <Link href="/application">Apply now</Link>
			</div>
			<header className={`site-header${atTop ? " at-top" : ""}${pinned || open ? "" : " header-away"}`}>
				<SectionEdge color="var(--paper)" variant="a" below />
				<Link className="brand" href="/" aria-label={`${SITE_NAME} home`} onClick={closeNavigation}>
					<Image
						className="brand-logo"
						src="/vot-logo-original.png"
						alt={SITE_NAME}
						width={799}
						height={550}
						priority
						unoptimized
					/>
				</Link>
				<nav key={pathname} className={open ? "nav open" : "nav"} aria-label="Main navigation">
					{groups.map((group) => (
						<details
							className="nav-group"
							key={group.label}
							open={openGroup === group.label}
							onMouseEnter={() => {
								if (supportsDesktopHover()) setOpenGroup(group.label);
							}}
							onMouseLeave={() => {
								if (supportsDesktopHover()) setOpenGroup(null);
							}}
						>
							<summary
								onClick={(event) => {
									event.preventDefault();
									setOpenGroup((current) => (current === group.label ? null : group.label));
								}}
							>
								{group.label}
								<CaretDown size={15} />
							</summary>
							<div className="nav-dropdown">
								<div className="nav-dropdown-panel">
									{group.links.map(([label, href]) => (
										<Link key={href} href={href} onClick={closeNavigation}>
											{label}
										</Link>
									))}
								</div>
							</div>
						</details>
					))}
					<Link href="/sponsorships" onClick={closeNavigation}>
						Sponsorships
					</Link>
					<Link href="/events" onClick={closeNavigation}>
						Events
					</Link>
					<Link href="/shop" onClick={closeNavigation}>
						Shop
					</Link>
					<Link href="/application" onClick={closeNavigation}>
						Apply
					</Link>
					<Link className="give" href="/donate" onClick={closeNavigation}>
						Donate
					</Link>
				</nav>
				<div className="header-tools">
					<Link className="account-link" href="/my-account" aria-label="My account" title="My account" onClick={closeNavigation}>
						<User size={20} />
					</Link>
					<Link className="cart-link" href="/cart" aria-label={`Cart with ${count} items`} title="Cart" onClick={closeNavigation}>
						<ShoppingBag size={21} />
						<span>{count}</span>
					</Link>
					<button
						className="menu"
						onClick={() => setOpenPath(open ? null : pathname)}
						aria-label="Toggle navigation"
						aria-expanded={open}
					>
						{open ? <X /> : <List size={30} />}
					</button>
				</div>
			</header>
		</>
	);
}

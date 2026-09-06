"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const uploads = "/wp-content/uploads";

type Opportunity = {
	title: string;
	month: number;
	monthLabel: string;
	image: string;
	copy: string;
	recapHref?: string;
	recapLabel?: string;
};

const opportunities: Opportunity[] = [
	{
		title: "Annual Benefit Dinner",
		month: 2,
		monthLabel: "March",
		image: `${uploads}/2025/09/photo-049.jpg`,
		copy: "Help underwrite the annual community gathering that introduces supporters to the mission and funds a new season outdoors.",
	},
	{
		title: "Missouri Spoonbill Fishing",
		month: 2,
		monthLabel: "March",
		image: `${uploads}/2025/09/photo-023.jpg`,
		copy: "Fund boats, lodging, meals, equipment, and time on the water for a recurring spring fishing experience with Veterans.",
	},
	{
		title: "Spring Turkey Hunts",
		month: 3,
		monthLabel: "April",
		image: `${uploads}/2026/01/turkey.jpg`,
		copy: "Support annual turkey hunts with travel, field access, guides, lodging, meals, and the gear participants need.",
	},
	{
		title: "Veteran's Outdoor Therapy Poker Run",
		month: 5,
		monthLabel: "June",
		image: `${uploads}/events/poker-run.webp`,
		copy: "Put your organization behind the annual community ride that raises awareness and funding for outdoor programs.",
	},
	{
		title: "Female Veteran Horseback Adventure",
		month: 6,
		monthLabel: "July",
		image: `${uploads}/2026/09/horseback/horseback-01.jpg`,
		copy: "Help provide ranch lodging, meals, riding support, and travel for an annual outdoor experience created for female Veterans.",
		recapHref: "/field-stories/coulter-lake-female-veteran-horseback-adventure-2026",
		recapLabel: "See last year's trip",
	},
	{
		title: "Archery Antelope Hunt",
		month: 8,
		monthLabel: "September",
		image: `${uploads}/2025/09/552626211_122157952436799810_562294068412297872_n-980x735.jpg`,
		copy: "Sponsor a recurring fall hunt built around ethical field practice, challenge, reflection, and connection in open country.",
	},
];

function nextCycle(month: number, monthLabel: string, now: Date | null) {
	if (!now) return `Annual ${monthLabel} cycle`;
	const year = now.getMonth() > month ? now.getFullYear() + 1 : now.getFullYear();
	return `Next cycle: ${monthLabel} ${year}`;
}

export function SponsorOpportunities() {
	const [currentDate, setCurrentDate] = useState<Date | null>(null);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		const updateAtNextMonth = () => {
			const now = new Date();
			setCurrentDate(now);
			const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
			const delay = Math.min(nextMonth.getTime() - now.getTime(), 2_147_000_000);
			timeout = setTimeout(updateAtNextMonth, delay);
		};
		updateAtNextMonth();
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className="sponsor-events">
			{opportunities.map((opportunity) => (
				<article key={opportunity.title}>
					<div className="sponsor-event-image">
						<Image src={opportunity.image} alt={`${opportunity.title} sponsorship opportunity`} fill sizes="(max-width: 800px) 100vw, 33vw" />
					</div>
					<span>{nextCycle(opportunity.month, opportunity.monthLabel, currentDate)}</span>
					<h3 className="display">{opportunity.title}</h3>
					<p>{opportunity.copy}</p>
					<Link className="text-link" href="/contact">
						Sponsor this cause <ArrowRight size={17} />
					</Link>
					{opportunity.recapHref && (
						<Link className="text-link" href={opportunity.recapHref}>
							{opportunity.recapLabel} <ArrowRight size={17} />
						</Link>
					)}
				</article>
			))}
		</div>
	);
}
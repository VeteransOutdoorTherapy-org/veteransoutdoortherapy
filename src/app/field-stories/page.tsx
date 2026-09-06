import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getPublishedFieldStories } from "@/lib/db";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
	title: "Stories from Veteran Outdoor Adventures",
	description:
		"Read field stories from Veteran horseback camps, community events, volunteers, and the partners who help make each outdoor experience possible.",
	path: "/field-stories",
});

export default async function FieldStoriesPage() {
	const fieldStories = await getPublishedFieldStories();
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Field stories", path: "/field-stories" }])} />
			<section className="page-hero">
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Field stories" }]} />
					<p className="eyebrow">Firsthand from the field</p>
					<h1 className="display">Stories from Veteran outdoor adventures.</h1>
					<p>
						Follow the experiences, hosts, volunteers, and mission partners behind Veteran&apos;s Outdoor Therapy in
						the field.
					</p>
				</div>
			</section>
			<section className="section">
				<div className="container story-list">
					{fieldStories.map((story) => (
						<article key={story.slug}>
							<Link className="story-list-image" href={`/field-stories/${story.slug}`}>
								<Image src={story.image} alt={story.imageAlt} fill sizes="(max-width: 800px) 100vw, 42vw" />
							</Link>
							<div>
								<p className="eyebrow">{story.date}</p>
								<h2 className="display"><Link href={`/field-stories/${story.slug}`}>{story.title}</Link></h2>
								<p className="story-location"><MapPin size={17} /> {story.location}</p>
								<p>{story.summary}</p>
								<Link className="text-link" href={`/field-stories/${story.slug}`}>Read the field story <ArrowRight size={17} /></Link>
							</div>
						</article>
					))}
				</div>
			</section>
		</>
	);
}

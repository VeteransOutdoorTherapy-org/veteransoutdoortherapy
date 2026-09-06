import { ArrowRight, CalendarDays, MapPin, Quote } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getPublishedTestimonials } from "@/lib/db";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";
import { fieldStories, getFieldStory } from "@/lib/stories";

export function generateStaticParams() {
	return fieldStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PageProps<"/field-stories/[slug]">): Promise<Metadata> {
	const { slug } = await params;
	const story = getFieldStory(slug);
	if (!story) return {};
	return pageMetadata({
		title: story.title,
		description: story.summary,
		path: `/field-stories/${story.slug}`,
		image: story.image,
	});
}

export default async function FieldStoryPage({ params }: PageProps<"/field-stories/[slug]">) {
	const { slug } = await params;
	const story = getFieldStory(slug);
	if (!story) notFound();
	const path = `/field-stories/${story.slug}`;
	const reviews = story.reviewCategory
		? (await getPublishedTestimonials()).filter((testimonial) => testimonial.category === story.reviewCategory)
		: [];
	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: story.title,
		description: story.summary,
		datePublished: story.datePublished,
		dateModified: story.datePublished,
		image: { "@type": "ImageObject", url: story.image, caption: story.imageAlt },
		mainEntityOfPage: absoluteUrl(path),
		author: { "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
		publisher: { "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
	};
	return (
		<>
			<JsonLd data={[
				breadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Field stories", path: "/field-stories" },
					{ name: story.title, path },
				]),
				articleSchema,
			]} />
			<article className="field-story">
				<header className="field-story-hero">
					<div className="field-story-image"><Image src={story.image} alt={story.imageAlt} fill priority sizes="100vw" /></div>
					<div className="container field-story-heading">
						<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Field stories", href: "/field-stories" }, { label: story.title }]} />
						<p className="eyebrow">Story from the field</p>
						<h1 className="display">{story.title}</h1>
						<div className="field-story-meta"><span><CalendarDays size={18} /> {story.date}</span><span><MapPin size={18} /> {story.location}</span></div>
					</div>
				</header>
				<div className="container field-story-body">
					<p className="field-story-lead">{story.summary}</p>
					{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
					{story.video && (
						<div className="giving-band-video">
							<iframe
								src={story.video.url}
								title={story.video.title}
								width="1280"
								height="720"
								loading="lazy"
								referrerPolicy="strict-origin-when-cross-origin"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
							/>
						</div>
					)}
					{story.facebookLinks && story.facebookLinks.length > 0 && (
						<div className="field-story-facebook">
							<p className="eyebrow">More from Facebook</p>
							{story.facebookLinks.map((link) => (
								<Link key={link.href} className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">
									{link.label} <ArrowRight size={15} />
								</Link>
							))}
						</div>
					)}
					{reviews.length > 0 && (
						<div className="field-story-reviews">
							<p className="eyebrow">What participants are saying</p>
							<div className="testimonials-masonry">
								{reviews.map((review) => (
									<article key={review.slug} className="testimonial-card">
										<div className="testimonial-quote">
											<Quote size={40} className="quote-icon" aria-hidden="true" />
											<blockquote><p>{review.quote}</p></blockquote>
										</div>
										<footer className="testimonial-author">
											<div className="author-info">
												<cite className="author-name">{review.author}</cite>
												<span className="author-service">{review.service}</span>
											</div>
										</footer>
									</article>
								))}
							</div>
						</div>
					)}
					<div className="hero-actions">
						<Link className="button orange" href={story.programHref}>{story.programLabel}</Link>
						<Link className="text-link" href="/field-stories">More field stories <ArrowRight size={17} /></Link>
					</div>
				</div>
			</article>
		</>
	);
}

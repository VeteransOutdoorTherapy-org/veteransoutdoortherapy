import { ArrowRight, CalendarDays, MapPin, Quote } from "lucide-react";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { cssImagePosition, type FieldStory } from "@/lib/data";
import { getFieldStories, getFieldStory, getPublishedGalleryImages, getPublishedTestimonials } from "@/lib/db";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

/** Exposes the admin-picked hero crop to CSS, desktop and mobile separately. */
function heroFocusStyle(story: FieldStory) {
	return {
		"--story-image-position": cssImagePosition(story.imagePosition),
		"--story-image-position-mobile": cssImagePosition(story.imagePositionMobile, cssImagePosition(story.imagePosition)),
	} as CSSProperties;
}

export async function generateStaticParams() {
	return (await getFieldStories()).map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PageProps<"/field-stories/[slug]">): Promise<Metadata> {
	const { slug } = await params;
	const story = await getFieldStory(slug);
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
	const story = await getFieldStory(slug);
	if (!story) notFound();
	const path = `/field-stories/${story.slug}`;
	const reviews = story.reviewCategory
		? (await getPublishedTestimonials()).filter((testimonial) => testimonial.category === story.reviewCategory)
		: [];
	const seenSrcs = new Set<string>([story.image]);
	const photoGalleries = (story.photoGalleries ?? [])
		.map((gallery) => ({
			title: gallery.title,
			photos: gallery.photos.filter((photo) => {
				if (seenSrcs.has(photo.src)) return false;
				seenSrcs.add(photo.src);
				return true;
			}),
		}))
		.filter((gallery) => gallery.photos.length > 0);
	if (story.galleryTag) {
		const taggedPhotos = (await getPublishedGalleryImages())
			.filter((image) => image.tags.some((tag) => tag.toLowerCase() === story.galleryTag!.toLowerCase()))
			.map((image) => ({ src: image.src, alt: image.alt }))
			.filter((photo) => {
				if (seenSrcs.has(photo.src)) return false;
				seenSrcs.add(photo.src);
				return true;
			});
		if (taggedPhotos.length > 0) photoGalleries.push({ title: "More from the gallery", photos: taggedPhotos });
	}
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
					<div className="field-story-image" style={heroFocusStyle(story)}><Image src={story.image} alt={story.imageAlt} fill priority sizes="100vw" /></div>
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
						<section className="field-story-section">
							<div className="field-story-section-head">
								<p className="eyebrow">Watch</p>
								<h2>{story.video.title}</h2>
							</div>
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
						</section>
					)}

					{reviews.length > 0 && (
						<section className="field-story-section field-story-reviews">
							<div className="field-story-section-head">
								<p className="eyebrow">In their words</p>
								<h2>What participants are saying</h2>
							</div>
							<div className="testimonials-masonry">
								{reviews.map((review) => (
									<article
										key={review.slug}
										className={review.quote.length > 500 ? "testimonial-card testimonial-card-wide" : "testimonial-card"}
									>
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
						</section>
					)}

					{photoGalleries.map((gallery, galleryIndex) => (
						<section className="field-story-section" key={gallery.title}>
							<div className="field-story-section-head">
								<p className="eyebrow">From the field</p>
								<h2>{gallery.title}</h2>
							</div>
							<div className="field-story-gallery">
								{gallery.photos.map((photo, index) => (
									<figure key={photo.src} className={galleryIndex === 0 && index === 0 ? "field-story-gallery-featured" : undefined}>
										<Image
											src={photo.src}
											alt={photo.alt}
											fill
											sizes={galleryIndex === 0 && index === 0 ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 50vw, 33vw"}
										/>
									</figure>
								))}
							</div>
						</section>
					))}

					{story.facebookLinks && story.facebookLinks.length > 0 && (
						<section className="field-story-section field-story-facebook">
							<div className="field-story-section-head">
								<p className="eyebrow">More from Facebook</p>
								<h2>Read the original posts</h2>
							</div>
							<div className="field-story-facebook-links">
								{story.facebookLinks.map((link) => (
									<Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
										{link.label} <ArrowRight size={17} />
									</Link>
								))}
							</div>
						</section>
					)}

					<div className="hero-actions field-story-cta">
						<Link className="button orange" href={story.programHref}>{story.programLabel}</Link>
						<Link className="text-link" href="/field-stories">More field stories <ArrowRight size={17} /></Link>
					</div>
				</div>
			</article>
		</>
	);
}

import { Copy, ExternalLink, Newspaper, Pencil } from "lucide-react";
import type { FieldStory } from "@/lib/data";
import { deleteFieldStoryAction, duplicateFieldStoryAction, saveFieldStoryAction } from "./actions";

export function FieldStoryAdmin({
	stories,
	selected,
	testimonialCategories,
	galleryTags,
}: {
	stories: FieldStory[];
	selected?: FieldStory;
	testimonialCategories: string[];
	galleryTags: string[];
}) {
	const facebookLinksValue = (selected?.facebookLinks || []).map((link) => `${link.label} | ${link.href}`).join("\n");
	return (
		<div className="admin-grid">
			<form className="product-form event-form" action={saveFieldStoryAction}>
				<h2>
					<Newspaper size={20} /> {selected ? "Edit field note" : "Add field note"}
				</h2>
				<input type="hidden" name="previousSlug" value={selected?.slug || ""} />
				<label>
					Title
					<input className="field" name="title" defaultValue={selected?.title} required />
				</label>
				<div className="form-row">
					<label>
						Slug
						<input className="field" name="slug" defaultValue={selected?.slug} placeholder="Generated from title" />
					</label>
					<label>
						Location
						<input className="field" name="location" defaultValue={selected?.location} required />
					</label>
				</div>
				<div className="form-row">
					<label>
						Display date
						<input className="field" name="date" defaultValue={selected?.date} placeholder="August 28-31, 2026" required />
					</label>
					<label>
						Date published
						<input className="field" name="datePublished" type="date" defaultValue={selected?.datePublished} required />
					</label>
				</div>
				<p className="admin-hint">Field notes are listed on /field-stories newest date published first.</p>
				<label>
					Summary (lead paragraph)
					<textarea className="field" name="summary" rows={2} defaultValue={selected?.summary} required />
				</label>
				<label>
					Story text — one paragraph per line
					<textarea className="field" name="body" rows={6} defaultValue={selected?.body.join("\n")} required />
				</label>
				<label>
					Existing image URL
					<input className="field" name="image" defaultValue={selected?.image} />
				</label>
				<input type="hidden" name="existingImage" value={selected?.image || ""} />
				<label>
					Or upload a new image
					<input className="field" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" />
				</label>
				<label>
					Image alt text
					<input className="field" name="imageAlt" defaultValue={selected?.imageAlt} required />
				</label>
				<label>
					Upload more photos from this trip (added to the Gallery automatically)
					<input className="field" name="photoFiles" type="file" accept="image/png,image/jpeg,image/webp" multiple />
				</label>
				<div className="form-row">
					<label>
						Video URL (YouTube embed, optional)
						<input
							className="field"
							name="videoUrl"
							type="url"
							defaultValue={selected?.video?.url}
							placeholder="https://www.youtube-nocookie.com/embed/..."
						/>
					</label>
					<label>
						Video title
						<input className="field" name="videoTitle" defaultValue={selected?.video?.title} />
					</label>
				</div>
				<label>
					Facebook links — one per line, as "Label | https://url"
					<textarea className="field" name="facebookLinks" rows={3} defaultValue={facebookLinksValue} placeholder="Read the recap on Facebook | https://www.facebook.com/share/p/..." />
				</label>
				<div className="form-row">
					<label>
						Testimonials category (pulls every published testimonial in this category)
						<input className="field" name="reviewCategory" list="field-story-review-categories" defaultValue={selected?.reviewCategory} />
					</label>
					<label>
						Gallery tag (defaults to the slug — pulls every published gallery photo with this tag)
						<input className="field" name="galleryTag" list="field-story-gallery-tags" defaultValue={selected?.galleryTag} placeholder={selected?.slug} />
					</label>
				</div>
				<datalist id="field-story-review-categories">
					{testimonialCategories.map((category) => (
						<option key={category} value={category} />
					))}
				</datalist>
				<datalist id="field-story-gallery-tags">
					{galleryTags.map((tag) => (
						<option key={tag} value={tag} />
					))}
				</datalist>
				<p className="admin-hint">
					The hero photo and any uploaded trip photos are saved to the Gallery under this tag automatically, and show up
					here under &quot;From the field&quot; too. Tag existing Gallery photos with the same word to pull them in as well.
				</p>
				<div className="form-row">
					<label>
						Button label
						<input className="field" name="programLabel" defaultValue={selected?.programLabel || "Explore outdoor programs"} required />
					</label>
					<label>
						Button URL
						<input className="field" name="programHref" defaultValue={selected?.programHref || "/programs"} required />
					</label>
				</div>
				<label className="consent">
					<input name="published" type="checkbox" defaultChecked={selected?.published ?? true} /> Published
				</label>
				<button className="button orange" type="submit">
					Save field note
				</button>
			</form>
			<div className="admin-list event-admin-list">
				<h2>Field notes · {stories.length}</h2>
				{stories.map((story) => (
					<article key={story.slug}>
						<div>
							<strong>{story.title}</strong>
							<span>
								{story.date} · {story.published ? "Published" : "Draft"}
							</span>
						</div>
						<a className="icon-button" href={`/field-stories/${story.slug}`} aria-label={`View ${story.title}`} target="_blank" rel="noreferrer">
							<ExternalLink size={16} />
						</a>
						<a className="icon-button" href={`/admin?view=field-stories&edit=${story.slug}`} aria-label={`Edit ${story.title}`}>
							<Pencil size={17} />
						</a>
						<form action={duplicateFieldStoryAction}>
							<input type="hidden" name="slug" value={story.slug} />
							<button className="icon-button" aria-label={`Duplicate ${story.title}`} type="submit">
								<Copy size={16} />
							</button>
						</form>
						<form action={deleteFieldStoryAction}>
							<input type="hidden" name="slug" value={story.slug} />
							<button className="icon-button danger" aria-label={`Delete ${story.title}`} type="submit">
								×
							</button>
						</form>
					</article>
				))}
			</div>
		</div>
	);
}

import { ArrowSquareOut, CalendarPlus, Copy, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import type { Event } from "@/lib/data";
import { deleteEventAction, duplicateEventAction, saveEventAction } from "./actions";
import { ImageFocusFields } from "@/components/admin/image-focus-fields";

export function EventAdmin({ events, selected }: { events: Event[]; selected?: Event }) {
	return (
		<div className="admin-grid">
			<form className="product-form event-form" action={saveEventAction}>
				<h2>
					<CalendarPlus size={20} /> {selected ? "Edit event" : "Add event"}
				</h2>
				<input type="hidden" name="previousSlug" value={selected?.slug || ""} />
				<label>
					Event title
					<input className="field" name="title" defaultValue={selected?.title} required />
				</label>
				<div className="form-row">
					<label>
						Slug
						<input className="field" name="slug" defaultValue={selected?.slug} placeholder="Generated from title" />
					</label>
					<label>
						Event type
						<input className="field" name="type" defaultValue={selected?.type} placeholder="Hunt, camp, fundraiser" required />
					</label>
				</div>
				<div className="form-row">
					<label>
						Display date
						<input className="field" name="date" defaultValue={selected?.date} placeholder="September 16 - 20, 2026" required />
					</label>
					<label>
						Location
						<input className="field" name="location" defaultValue={selected?.location} required />
					</label>
				</div>
				<div className="form-row">
					<label>
						Start date
						<input className="field" name="startDate" type="date" defaultValue={selected?.startDate} required />
					</label>
					<label>
						End date
						<input className="field" name="endDate" type="date" defaultValue={selected?.endDate} required />
					</label>
				</div>
				<label>
					Card and hero summary
					<textarea className="field" name="summary" rows={3} defaultValue={selected?.summary} required />
				</label>
				<label>
					Hero title
					<input className="field" name="heroTitle" defaultValue={selected?.heroTitle} required />
				</label>
				<div className="form-row">
					<label>
						Overview heading
						<input className="field" name="overviewTitle" defaultValue={selected?.overviewTitle} required />
					</label>
					<label>
						Details heading
						<input className="field" name="detailsTitle" defaultValue={selected?.detailsTitle} required />
					</label>
				</div>
				<label>
					Overview text
					<textarea className="field" name="overview" rows={5} defaultValue={selected?.overview} required />
				</label>
				<label>
					Details text
					<textarea className="field" name="details" rows={5} defaultValue={selected?.details} required />
				</label>
				<p className="admin-hint">
					Name the hosts only on an event that has already happened. Leave them out of anything upcoming or TBA &mdash;
					plans change, and a named host on a future trip is a commitment on their behalf.
				</p>
				<div className="form-row">
					<label>
						Button label
						<input className="field" name="ctaLabel" defaultValue={selected?.ctaLabel || "Apply for support"} required />
					</label>
					<label>
						Button URL
						<input className="field" name="ctaHref" defaultValue={selected?.ctaHref || "/apply"} required />
					</label>
				</div>
				<div className="form-row">
					<label>
						Page template
						<select className="field" name="template" defaultValue={selected?.template || "adventure"}>
							<option value="adventure">Outdoor adventure</option>
							<option value="fundraiser">Fundraiser</option>
						</select>
					</label>
					<label>
						Display order
						<input className="field" name="sortOrder" type="number" min="0" defaultValue={selected?.sortOrder ?? events.length + 1} required />
					</label>
				</div>
				<label>
					Existing image URL
					<input className="field" name="image" defaultValue={selected?.image} />
				</label>
				<label>
					Facebook recap URL
					<input className="field" name="recapUrl" type="url" defaultValue={selected?.recapUrl} placeholder="https://www.facebook.com/share/p/..." />
				</label>
				<input type="hidden" name="existingImage" value={selected?.image || ""} />
				<label>
					Or upload a new image
					<input className="field" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" />
				</label>
				<ImageFocusFields desktop={selected?.imagePosition} mobile={selected?.imagePositionMobile} />
				<div className="admin-checks">
					<label className="consent">
						<input name="published" type="checkbox" defaultChecked={selected?.published ?? true} /> Published
					</label>
					<label className="consent">
						<input name="featured" type="checkbox" defaultChecked={selected?.featured} /> Feature on home page
					</label>
					<label className="consent">
						<input name="over" type="checkbox" defaultChecked={selected?.over} /> Over (move to Past Events)
					</label>
				</div>
				<button className="button orange" type="submit">
					Save event
				</button>
			</form>
			<div className="admin-list event-admin-list">
				<h2>Events · {events.length}</h2>
				{events.map((event) => (
					<article key={event.slug}>
						<div>
							<strong>{event.title}</strong>
							<span>
								{event.date} · {event.published ? "Published" : "Draft"}
								{event.featured ? " · Home" : ""}
								{event.over ? " · Over" : ""}
							</span>
						</div>
						<a className="icon-button" href={`/events/${event.slug}`} aria-label={`View ${event.title}`} target="_blank" rel="noreferrer">
							<ArrowSquareOut size={16} />
						</a>
						<a className="icon-button" href={`/admin?view=events&edit=${event.slug}`} aria-label={`Edit ${event.title}`}>
							<PencilSimple size={17} />
						</a>
						<form action={duplicateEventAction}>
							<input type="hidden" name="slug" value={event.slug} />
							<button className="icon-button" aria-label={`Duplicate ${event.title}`} type="submit">
								<Copy size={16} />
							</button>
						</form>
						<form action={deleteEventAction}>
							<input type="hidden" name="slug" value={event.slug} />
							<button className="icon-button danger" aria-label={`Delete ${event.title}`} type="submit">
								×
							</button>
						</form>
					</article>
				))}
			</div>
		</div>
	);
}

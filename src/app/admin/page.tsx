import { Copy, LockKeyhole, LogOut, PackagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getEvents, getProducts, getTestimonials, getGalleryImages, getFieldStories, type Testimonial } from "@/lib/db";
import { pageMetadata } from "@/lib/site";
import { deleteProductAction, duplicateProductAction, loginAction, logoutAction, saveProductAction, saveTestimonialAction, duplicateTestimonialAction, deleteTestimonialAction } from "./actions";
import { EventAdmin } from "./event-admin";
import { FieldStoryAdmin } from "./field-story-admin";
import { GalleryAdmin } from "@/components/admin/gallery-admin";

export const metadata = pageMetadata({ title: "Content Admin", description: "Authorized content administration.", path: "/admin", noIndex: true });

function TestimonialAdmin({ testimonials, selected, categoryFilter, yearFilter }: { testimonials: Testimonial[]; selected?: Testimonial; categoryFilter?: string; yearFilter?: string }) {
	const categories = Array.from(new Set(testimonials.map((t) => t.category).filter(Boolean))).sort();
	const years = Array.from(new Set(testimonials.map((t) => t.createdAt.slice(0, 4)))).sort().reverse();
	const filtered = testimonials.filter((t) => (!categoryFilter || (t.category || "Uncategorized") === categoryFilter) && (!yearFilter || t.createdAt.startsWith(yearFilter)));
	const imagePositions = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "center"] as const;
	return (
		<div className="admin-grid">
			<form className="product-form" action={saveTestimonialAction}>
				<h2>
					<Plus size={20} /> {selected ? "Edit testimonial" : "Add testimonial"}
				</h2>
				<input type="hidden" name="previousSlug" value={selected?.slug || ""} />
				<label>
					Author name
					<input className="field" name="author" defaultValue={selected?.author} required />
				</label>
				<div className="form-row">
					<label>
						Slug
						<input className="field" name="slug" defaultValue={selected?.slug} />
					</label>
					<label>
						Service / Branch
						<input className="field" name="service" defaultValue={selected?.service} required />
					</label>
				</div>
				<label>
					Quote
					<textarea className="field" name="quote" rows={4} defaultValue={selected?.quote} required />
				</label>
				<label>
					Category
					<select className="field" name="category">
						<option value="">— Select category —</option>
						{categories.map((cat) => (
							<option key={cat} value={cat} selected={selected?.category === cat}>
								{cat}
							</option>
						))}
						<option value="Horseback">Horseback</option>
						<option value="General">General</option>
						<option value="Hunting">Hunting</option>
						<option value="Fishing">Fishing</option>
						<option value="Camping">Camping</option>
					</select>
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
					<input className="field" name="imageAlt" defaultValue={selected?.imageAlt} />
				</label>
				<label>
					Image position (for masonry layout)
					<select className="field" name="imagePosition">
						{imagePositions.map((pos) => (
							<option key={pos} value={pos} selected={selected?.imagePosition === pos}>
								{pos.charAt(0).toUpperCase() + pos.slice(1).replace("-", " ")}
							</option>
						))}
					</select>
				</label>
				<div className="form-row">
					<label>
						Display order
						<input className="field" name="sortOrder" type="number" min="0" defaultValue={selected?.sortOrder ?? 0} />
					</label>
				</div>
				<label className="consent">
					<input name="published" type="checkbox" defaultChecked={selected?.published ?? true} /> Published
				</label>
				<button className="button orange" type="submit">
					Save testimonial
				</button>
			</form>
			<div className="admin-list">
				<form className="admin-inline-filters" method="get"><input type="hidden" name="view" value="testimonials" /><select className="field" name="category" defaultValue={categoryFilter}><option value="">All categories</option>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select><select className="field" name="year" defaultValue={yearFilter}><option value="">All years</option>{years.map((year) => <option key={year}>{year}</option>)}</select><button className="button secondary" type="submit">Filter</button></form>
				<h2>Testimonials · {filtered.length} of {testimonials.length}</h2>
				{filtered.map((testimonial) => (
					<article key={testimonial.slug}>
						<div>
							<strong>{testimonial.author}</strong>
							<span>{testimonial.service} · {testimonial.category || "Uncategorized"} · {testimonial.published ? "Published" : "Draft"}</span>
							<p style={{ marginTop: 8, color: "var(--moss)", fontSize: "0.9rem" }}>{testimonial.quote.slice(0, 100)}…</p>
						</div>
						<a className="icon-button" href={`/admin?view=testimonials&edit=${testimonial.slug}`} aria-label={`Edit ${testimonial.author}`}>
							<Pencil size={17} />
						</a>
						<form action={duplicateTestimonialAction}>
							<input type="hidden" name="slug" value={testimonial.slug} />
							<button className="icon-button" aria-label={`Duplicate ${testimonial.author}`} type="submit">
								<Copy size={16} />
							</button>
						</form>
						<form action={deleteTestimonialAction}>
							<input type="hidden" name="slug" value={testimonial.slug} />
							<button className="icon-button danger" aria-label={`Delete ${testimonial.author}`} type="submit">
								<Trash2 size={16} />
							</button>
						</form>
					</article>
				))}
			</div>
		</div>
	);
}

export default async function AdminPage({
	searchParams,
}: {
 searchParams: Promise<{ view?: string; edit?: string; error?: string; saved?: string; deleted?: string; saveError?: string; category?: string; year?: string }>;
}) {
	const query = await searchParams;
	const authenticated = await isAdmin();
	if (!authenticated)
		return (
			<section className="admin-login">
				<form action={loginAction}>
					<LockKeyhole size={30} />
					<p className="eyebrow">Authorized access</p>
					<h1 className="display">Admin login</h1>
					{query.error && <p className="form-error">That username or password is incorrect.</p>}
					<label>
						Username
						<input className="field" name="username" autoComplete="username" required />
					</label>
					<label>
						Password
						<input className="field" name="password" type="password" autoComplete="current-password" required />
					</label>
					<button className="button" type="submit">
						Sign in
					</button>
				</form>
			</section>
		);
	const view =
		query.view === "events" ? "events"
		: query.view === "testimonials" ? "testimonials"
		: query.view === "gallery" ? "gallery"
		: query.view === "field-stories" ? "field-stories"
		: query.view === "wiki" ? "wiki"
		: "products";
	const [products, events, testimonials, gallery, fieldStories] = await Promise.all([
		getProducts(),
		getEvents(),
		getTestimonials(),
		getGalleryImages(),
		getFieldStories(),
	]);
	const categories = Array.from(
		new Set(products.map((product) => product.category.trim()).filter((category) => category.length > 0)),
	).sort((a, b) => a.localeCompare(b));
	const selectedProduct = products.find((product) => product.slug === query.edit);
	const selectedEvent = events.find((event) => event.slug === query.edit);
	const selectedTestimonial = testimonials.find((testimonial) => testimonial.slug === query.edit);
	const selectedFieldStory = fieldStories.find((story) => story.slug === query.edit);
	const testimonialCategories = Array.from(new Set(testimonials.map((t) => t.category).filter((c): c is string => Boolean(c)))).sort();
	const galleryTags = Array.from(new Set(gallery.flatMap((image) => image.tags))).sort();
	return (
		<section className="admin-page">
			<div className="container">
				<header>
					<div>
						<p className="eyebrow">Site operations</p>
						<h1 className="display">Content admin</h1>
					</div>
					<form action={logoutAction}>
						<button className="button secondary">
							<LogOut size={17} /> Sign out
						</button>
					</form>
				</header>
				<nav className="admin-tabs" aria-label="Admin sections">
					<a className={view === "products" ? "active" : ""} href="/admin">
						Products
					</a>
					<a className={view === "events" ? "active" : ""} href="/admin?view=events">
						Events
					</a>
					<a className={view === "testimonials" ? "active" : ""} href="/admin?view=testimonials">
						Testimonials
					</a>
					<a className={view === "field-stories" ? "active" : ""} href="/admin?view=field-stories">
						Field Notes
					</a>
					<Link href="/admin/orders">
						Orders
					</Link>
					<Link className={view === "gallery" ? "active" : ""} href="/admin?view=gallery">Gallery</Link>
					<Link href="/admin/wiki">Wiki</Link>
				</nav>
				{query.saved && <p className="success-note">Saved.</p>}
				{query.deleted && <p className="success-note">Deleted.</p>}
				{query.saveError === "upload-config" && (
					<p className="form-error">Image upload is not configured. Add BLOB_READ_WRITE_TOKEN to your environment.</p>
				)}
				{query.saveError === "upload-failed" && (
					<p className="form-error">Image upload failed. Please try again or use an existing image URL.</p>
				)}
				{query.saveError === "save-failed" && (
					<p className="form-error">Saving failed. Check required fields and make sure the slug is unique.</p>
				)}
				{view === "events" ? (
					<EventAdmin events={events} selected={selectedEvent} />
				) : view === "testimonials" ? (
					<TestimonialAdmin testimonials={testimonials} selected={selectedTestimonial} categoryFilter={query.category} yearFilter={query.year} />
				) : view === "gallery" ? (
					<GalleryAdmin images={gallery} />
				) : view === "field-stories" ? (
					<FieldStoryAdmin
						stories={fieldStories}
						selected={selectedFieldStory}
						testimonialCategories={testimonialCategories}
						galleryTags={galleryTags}
					/>
				) : view === "wiki" ? (
					<div className="admin-wiki"><h2>Admin wiki</h2><p>Use the dedicated <Link href="/admin/wiki">Wiki page</Link> for the operating handbook, content rules, and troubleshooting guidance.</p></div>
				) : (
					<div className="admin-grid">
						<form className="product-form" action={saveProductAction}>
							<h2>
								<PackagePlus size={20} /> {selectedProduct ? "Edit product" : "Add product"}
							</h2>
							<label>
								Product name
								<input className="field" name="name" defaultValue={selectedProduct?.name} required />
							</label>
							<div className="form-row">
								<label>
									Short display name
									<input className="field" name="shortName" defaultValue={selectedProduct?.shortName} required />
								</label>
								<label>
									Slug
									<input className="field" name="slug" defaultValue={selectedProduct?.slug} />
								</label>
							</div>
							<div className="form-row">
								<label>
									Price
									<input
										className="field"
										name="price"
										type="number"
										min="0"
										step="0.01"
										defaultValue={selectedProduct?.price}
										required
									/>
								</label>
								<label>
									Category
									<input
										className="field"
										name="category"
										list="product-categories"
										defaultValue={selectedProduct?.category || "Merchandise"}
										required
									/>
								</label>
							</div>
							<datalist id="product-categories">
								{categories.map((category) => (
									<option key={category} value={category} />
								))}
							</datalist>
							<label>
								Description
								<textarea className="field" name="description" rows={5} defaultValue={selectedProduct?.description} required />
							</label>
							<label>
								Existing image URL
								<input className="field" name="image" defaultValue={selectedProduct?.image} />
							</label>
							<input type="hidden" name="existingImage" value={selectedProduct?.image || ""} />
							<label>
								Or upload a new image
								<input className="field" name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" />
							</label>
							<div className="form-row">
								<label>
									Sizes, comma separated
									<input className="field" name="sizes" defaultValue={selectedProduct?.sizes?.join(", ")} />
								</label>
								<label>
									Stock
									<input className="field" name="stock" type="number" min="0" defaultValue={selectedProduct?.stock} />
								</label>
							</div>
							<label className="consent">
								<input name="featured" type="checkbox" defaultChecked={selectedProduct?.featured} /> Feature on home page
							</label>
							<button className="button orange" type="submit">
								Save product
							</button>
						</form>
						<div className="admin-list">
							<h2>Catalog · {products.length}</h2>
							{products.map((product) => (
								<article key={product.slug}>
									<div>
										<strong>{product.shortName}</strong>
										<span>{product.category} · ${product.price.toLocaleString()}</span>
									</div>
									<a className="icon-button" href={`/admin?edit=${product.slug}`} aria-label={`Edit ${product.name}`}>
										<Pencil size={17} />
									</a>
									<form action={duplicateProductAction}>
										<input type="hidden" name="slug" value={product.slug} />
										<button className="icon-button" aria-label={`Duplicate ${product.name}`} type="submit">
											<Copy size={16} />
										</button>
									</form>
									<form action={deleteProductAction}>
										<input type="hidden" name="slug" value={product.slug} />
										<button className="icon-button danger" aria-label={`Delete ${product.name}`} type="submit">
											×
										</button>
									</form>
								</article>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

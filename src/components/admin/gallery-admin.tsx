import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { GalleryImage } from "@/lib/data";
import { deleteGalleryImageAction, saveGalleryMetadataAction, uploadGalleryImagesAction } from "@/app/admin/actions";

export function GalleryAdmin({ images }: { images: GalleryImage[] }) {
	return <div className="admin-gallery">
		<form className="product-form" action={uploadGalleryImagesAction}>
			<h2>Upload gallery images</h2>
			<p className="prose">Upload one or many approved photos. New uploads are published immediately with editable metadata.</p>
			<label>Images<input className="field" name="imageFiles" type="file" accept="image/png,image/jpeg,image/webp" multiple required /></label>
			<button className="button orange" type="submit">Upload images</button>
		</form>
		<div className="admin-gallery-list"><h2>Gallery · {images.length}</h2>
			{images.map((image) => <article className="admin-gallery-card" key={image.id}>
				<div className="admin-gallery-thumb"><Image src={image.src} alt={image.alt} fill sizes="180px" /></div>
				<form className="gallery-meta-form" action={saveGalleryMetadataAction}>
					<input type="hidden" name="id" value={image.id} />
					<label>Alt text<input className="field" name="alt" defaultValue={image.alt} required /></label>
					<label>Caption<input className="field" name="caption" defaultValue={image.caption} /></label>
					<div className="form-row"><label>Tags<input className="field" name="tags" defaultValue={image.tags.join(", ")} /></label><label>Year<input className="field" name="year" defaultValue={image.year} /></label></div>
					<div className="button-row"><label className="consent"><input name="published" type="checkbox" defaultChecked={image.published} /> Published</label><button className="button secondary" type="submit">Save metadata</button></div>
				</form>
				<form action={deleteGalleryImageAction}><input type="hidden" name="id" value={image.id} /><button className="icon-button danger" type="submit" aria-label={`Delete ${image.alt}`}><Trash2 size={17} /></button></form>
			</article>)}
		</div>
	</div>;
}

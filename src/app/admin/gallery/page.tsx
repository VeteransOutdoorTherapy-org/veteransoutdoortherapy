import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getGalleryImages } from "@/lib/db";
import { GalleryAdmin } from "@/components/admin/gallery-admin";

export default async function AdminGalleryPage() {
	if (!(await isAdmin())) redirect("/admin");
	return <section className="admin-page"><div className="container"><p className="eyebrow">Content operations</p><h1 className="display">Gallery manager</h1><p className="prose">Manage published images, descriptions, captions, tags, and review status.</p><GalleryAdmin images={await getGalleryImages()} /></div></section>;
}

import { ApplicationFormPage } from "@/components/application-form-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
export const metadata = pageMetadata({
	title: "Gold Star Family Member Outdoor Program Application",
	description: "Gold Star family members can apply for thoughtfully hosted outdoor experiences with Veteran's Outdoor Therapy.",
	path: "/gold-star-family-application",
	noIndex: true,
});
export default function GoldStarApplicationPage() {
	return (
		<><JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gold Star families", path: "/gold-star-families" }, { name: "Application", path: "/gold-star-family-application" }])} /><ApplicationFormPage
			eyebrow="For Gold Star families"
			title="Connection, remembrance, and open air."
			copy="Share how an outdoor experience could support you, your family, or a Gold Star child."
			type="gold-star-family-application"
		/></>
	);
}

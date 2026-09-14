import { imageFocusStyle, type Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
	return (
		<Link className="product-card" href={`/product/${product.slug}`} style={imageFocusStyle(product)}>
			<Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 33vw" />
			<span className="product-price-chip">${product.price.toLocaleString()}</span>
			<div className="product-copy-overlay">
				<span>{product.category}</span>
				<h3 className="display">{product.shortName}</h3>
			</div>
		</Link>
	);
}

"use client";
import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Product, sizeInStock } from "@/lib/data";
import { useCart } from "./cart-provider";
export function AddToCart({ product }: { product: Product }) {
	const sizes = product.sizes ?? [];
	const firstAvailable = sizes.find((entry) => sizeInStock(entry));
	const [size, setSize] = useState(firstAvailable?.size);
	const [added, setAdded] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { add } = useCart();

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const soldOut = sizes.length ? !firstAvailable : product.stock != null && product.stock < 1;

	function handleAdd() {
		add({ slug: product.slug, name: product.shortName, price: product.price, image: product.image, size });
		setAdded(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setAdded(false), 1800);
	}

	return (
		<div className="add-to-cart-wrap">
			<div className="buy-box">
				{sizes.length > 0 && (
					<label>
						Size
						<select className="field" value={size ?? ""} onChange={(event) => setSize(event.target.value)} disabled={soldOut}>
							{sizes.map((option) => (
								<option key={option.size} value={option.size} disabled={!sizeInStock(option)}>
									{sizeInStock(option) ? option.size : `${option.size} — Sold out`}
								</option>
							))}
						</select>
					</label>
				)}
				<div className="add-to-cart-actions">
					<button
						className={added ? "button orange add-button added" : "button orange add-button"}
						onClick={handleAdd}
						disabled={soldOut}
					>
						{added ? <Check size={18} /> : <ShoppingBag size={18} />}
						{soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
					</button>
				</div>
			</div>
			<p className="cart-feedback" role="status" aria-live="polite">
				{soldOut ? `${product.shortName} is sold out.` : added ? `${product.shortName} added to your cart.` : " "}
			</p>
		</div>
	);
}

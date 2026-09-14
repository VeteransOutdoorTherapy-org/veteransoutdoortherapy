import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";
export function ProductCard({ product }: { product: Product }) { return <Link className="product-card" href={`/product/${product.slug}`}><div className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><div className="product-info"><span>{product.category}</span><h3>{product.shortName}</h3><div><strong>${product.price.toLocaleString()}</strong><ArrowUpRight size={20} /></div></div></Link>; }
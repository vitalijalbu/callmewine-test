export interface Money {
	amount: string;
	currencyCode: string;
}

export interface ShopifyImage {
	url: string;
	altText: string | null;
	width: number | null;
	height: number | null;
}

export interface SelectedOption {
	name: string;
	value: string;
}

export interface ProductVariant {
	id: string;
	title: string;
	availableForSale: boolean;
	quantityAvailable: number | null;
	currentlyNotInStock: boolean;
	selectedOptions: SelectedOption[];
	price: Money;
	compareAtPrice: Money | null;
	image: ShopifyImage | null;
}

export interface ProductOption {
	id: string;
	name: string;
	optionValues: { id: string; name: string }[];
}

export interface Product {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	vendor: string;
	productType: string;
	tags: string[];
	availableForSale: boolean;
	totalInventory: number | null;
	seo: { title: string | null; description: string | null };
	featuredImage: ShopifyImage | null;
	images: { nodes: ShopifyImage[] };
	options: ProductOption[];
	priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
	compareAtPriceRange: { minVariantPrice: Money };
	variants: { nodes: ProductVariant[] };
}

export interface GetProductByHandleResult {
	product: Product | null;
}

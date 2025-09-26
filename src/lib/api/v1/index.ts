import {
	Article,
	Audio,
	Category,
	Content,
	Image,
	Page,
	Project,
	Video,
} from "@/types";
import { websiteConfig } from "../../../../website.config";

export async function fetchCategories() {
	try {
		const res = await fetch(`${websiteConfig.cmsRootURL}/api/v1/categories`);

		if (!res.ok) {
			throw new Error(
				`Failed to fetch categories: ${res.status} ${res.statusText}`
			);
		}

		return (await res.json()) as Content["categories"];
	} catch (error) {
		console.error("Error fetching categories:", error);
		return undefined;
	}
}

export async function fetchCategory(slug: string) {
	try {
		const res = await fetch(
			`${websiteConfig.cmsRootURL}/api/v1/categories/${slug}`
		);

		if (!res.ok) {
			throw new Error(
				`Failed to fetch category: ${slug} ${res.status} ${res.statusText}`
			);
		}

		return (await res.json()) as Category;
	} catch (error) {
		console.error("Error fetching category:", slug, error);
		return undefined;
	}
}

export async function fetchPages() {
	try {
		const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/pages");

		if (!res.ok) {
			throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
		}

		return (await res.json()) as Content["pages"];
	} catch (error) {
		console.error("Error fetching pages:", error);
		return undefined;
	}
}

export async function fetchPageData(slug: string) {
	try {
		const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/pages/" + slug);
		if (!res.ok) {
			throw new Error(
				`Failed to fetch pageData: ${slug} ${res.status} ${res.statusText}`
			);
		}

		return (await res.json()) as Page;
	} catch (error) {
		console.error("Error fetching pageData:", slug, error);
		return undefined;
	}
}

export async function fetchPage(pageData: Page, slug: string) {
	try {
		const res = await fetch(
			websiteConfig.cmsRootURL +
				`/api/v1/${
					pageData.pageType === "category"
						? "categories"
						: pageData.props.itemsType
				}/` +
				slug
		);

		if (!res.ok) {
			throw new Error(
				`Failed to fetch page: ${slug} ${res.status} ${res.statusText}`
			);
		}

		return (await res.json()) as
			| Category
			| Article
			| Audio
			| Image
			| Project
			| Video;
	} catch (error) {
		console.error("Error fetching page:", slug, error);
		return undefined;
	}
}

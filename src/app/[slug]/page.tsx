import { notFound } from "next/navigation";
import FieldOfInterests from "@/components/organisms/Category";
import Article from "@/components/organisms/Article";
import Project from "@/components/organisms/Project";
import { Metadata } from "next";
import {
	Article as IArticle,
	Category,
	DevProject,
	Project as IProject,
} from "@/types";
import { fetchPublicDevProjectData } from "@/lib/github/fetchPublicDevProjectData";
import { fetchPage, fetchPageData, fetchPages } from "@/lib/api/v1";

type SlugPageParams = { slug: string };

export async function generateMetadata({
	params,
}: {
	params: Promise<SlugPageParams>;
}): Promise<Metadata> {
	const slug = (await params).slug;

	const pageData = await fetchPageData(slug);

	if (!pageData) return {};

	const page = await fetchPage(pageData, slug);

	if (!page) return {};

	const { metadata: pageMetadata } = page;

	if (!pageMetadata) return {};

	return {
		title: `${pageMetadata.title} | Vadim Gierko`,
		description: `${pageMetadata.description}`,
		openGraph: {
			title: `${pageMetadata.ogTitle || pageMetadata.title} | Vadim Gierko`,
			description: `${pageMetadata.ogDescription || pageMetadata.description}`,
			images: pageMetadata.ogImage
				? pageMetadata.ogImage
				: pageMetadata.img
				? pageMetadata.img.src
				: "https://www.vadimgierko.com/vadim-gerko-zdjecie-cv.jpg",
			type:
				pageData.pageType === "item" && pageData.props.itemType === "article"
					? "article"
					: "website",
			url: "https://www.vadimgierko.com" + pageMetadata.link,
		},
	};
}

export async function generateStaticParams() {
	const pages = await fetchPages();

	if (!pages) return [];

	const slugs = Object.keys(pages);

	const params: SlugPageParams[] = slugs.map((slug) => ({
		slug,
	}));

	return params;
}

export default async function Page({
	params,
}: {
	params: Promise<SlugPageParams>;
}) {
	const slug = (await params).slug; // ❗❗❗

	const pageData = await fetchPageData(slug);

	if (!pageData) return notFound();

	const page = await fetchPage(pageData, slug);

	if (!page) return notFound();

	if (pageData.pageType === "category")
		return <FieldOfInterests field={page as Category} />;

	switch (pageData.props.itemType) {
		case "article":
			return <Article article={page as IArticle} />;
		case "project":
			return <Project project={page as IProject} />;
		case "devProject":
			return (
				<Project
					project={await fetchPublicDevProjectData(page as DevProject)}
				/>
			);
	}
}

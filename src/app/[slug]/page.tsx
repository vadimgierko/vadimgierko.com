import { notFound } from "next/navigation";

// custom components:
import FieldOfInterests from "@/components/organisms/Category";
import Article from "@/components/organisms/Article";
import Project from "@/components/organisms/Project";
// lib:
import { Metadata } from "next";
import {
	Article as IArticle,
	Audio,
	Category,
	Content,
	DevProject,
	Page as IPage,
	Image,
	Project as IProject,
	Video,
} from "@/types";
import getRepoDataFromGitHub from "@/lib/github/getRepoDataFromGitHub";
import getRepoReadmeFileContentFromGitHub from "@/lib/github/getRepoReadmeFileContentFromGitHub";
import checkGithubApiTokenRateLimits from "@/lib/github/checkGithubApiTokenRateLimits";
import { websiteConfig } from "../../../website.config";

type SlugPageParams = { slug: string };

export async function fetchPage(pageData: IPage, slug: string) {
	const res = await fetch(
		websiteConfig.cmsRootURL +
			`/api/v1/${
				pageData.pageType === "category"
					? "categories"
					: pageData.props.itemsType
			}/` +
			slug
	);

	const page = (await res.json()) as
		| Category
		| IArticle
		| Audio
		| Image
		| IProject
		| Video;

	return page;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<SlugPageParams>;
}): Promise<Metadata> {
	const slug = (await params).slug;

	const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/pages/" + slug);
	const pageData = (await res.json()) as IPage;

	if (!pageData) return {};

	const page = await fetchPage(pageData, slug);
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
	const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/pages");
	const pages = (await res.json()) as Content["pages"];

	//=== ❗❗❗ 👇TODO: EXTRACT AS getAllPagesSlugs👇 ===❗❗❗
	const slugs = Object.keys(pages);
	//=== ❗❗❗ 👆TODO: EXTRACT AS getAllPagesSlugs👆 ===❗❗❗

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

	const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/pages/" + slug);
	const pageData = (await res.json()) as IPage;

	if (!pageData) return notFound();

	const page = await fetchPage(pageData, slug);

	//================= FOR DEV PROJECTS ==================:
	// const isDevProject: boolean = pageContent.pageType === "devProject";
	// console.log("isDevProject:", isDevProject);

	async function getDevProjectData(
		devProject: DevProject
	): Promise<DevProject> {
		// FETCH REPO DATA FROM GITHUB ONLY IF PROJECT IS PUBLIC:
		const repoData = await getRepoDataFromGitHub(devProject.props.repoName);
		const readmeMarkdown = await getRepoReadmeFileContentFromGitHub(
			repoData.name
		);
		await checkGithubApiTokenRateLimits();

		// replace readme's h1 with h2:
		const fixedMarkdown = readmeMarkdown.replace("#", "##");

		const updatedDevProject: DevProject = {
			category: "web-development",
			itemType: "devProject",
			metadata: {
				...devProject.metadata,
				description: repoData.description,
			},
			props: {
				...devProject.props,
				content: fixedMarkdown,
				externalLinks: [
					{
						icon: "github",
						link: "https://github.com/vadimgierko/" + repoData.name,
						description: "Zobacz kod na GitHub",
					},
					{
						icon: "global",
						link: repoData.homepage,
						description: "Strona www projektu",
					},
				],
			},
		};

		return updatedDevProject;
	}

	if (pageData.pageType === "category")
		return <FieldOfInterests field={page as Category} />;

	switch (pageData.props.itemType) {
		case "article":
			return <Article article={page as IArticle} />;
		case "project":
			return <Project project={page as IProject} />;
		case "devProject":
			return <Project project={await getDevProjectData(page as DevProject)} />;
	}
}

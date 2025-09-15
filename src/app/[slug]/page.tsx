import { notFound } from "next/navigation";

// custom components:
import FieldOfInterests from "@/components/organisms/Category";
import Article from "@/components/organisms/Article";
import Project from "@/components/organisms/Project";
// lib:
import { Metadata } from "next";
import { DevProject } from "@/types";
import { fetchContent } from "@/lib/fetchContent";
import getRepoDataFromGitHub from "@/lib/github/getRepoDataFromGitHub";
import getRepoReadmeFileContentFromGitHub from "@/lib/github/getRepoReadmeFileContentFromGitHub";
import checkGithubApiTokenRateLimits from "@/lib/github/checkGithubApiTokenRateLimits";

type SlugPageParams = { slug: string };

export async function generateMetadata({
	params,
}: {
	params: Promise<SlugPageParams>;
}): Promise<Metadata> {
	const slug = (await params).slug;

	const content = await fetchContent();
	if (!content) return {};

	//=== ❗❗❗ 👇TODO: EXTRACT AS getPageMetadata(slug)👇 ===❗❗❗
	const pageData = content.pages[slug];

	if (!pageData) return {};

	const pageMetadata =
		pageData.pageType === "category"
			? content.categories[slug].metadata
			: content.items[pageData.props.itemsType][slug].metadata;
	//=== ❗❗❗ 👆TODO: EXTRACT AS getPageMetadata(slug)👆 ===❗❗❗

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
	const content = await fetchContent();
	if (!content) return [];

	//=== ❗❗❗ 👇TODO: EXTRACT AS getAllPagesSlugs👇 ===❗❗❗
	const slugs = Object.keys(content.pages);
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

	const content = await fetchContent();
	if (!content)
		return (
			<p className="text-danger text-danger">No content fetched from CMS...</p>
		);
	//=== ❗❗❗ 👇TODO: EXTRACT AS getPageMetadata(slug)👇 ===❗❗❗
	const pageData = content.pages[slug];

	if (!pageData) return notFound();

	const page =
		pageData.pageType === "category"
			? content.categories[slug]
			: content.items[pageData.props.itemsType][slug];
	//=== ❗❗❗ 👆TODO: EXTRACT AS getPageMetadata(slug)👆 ===❗❗❗

	const {} = page;

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
		return <FieldOfInterests field={content.categories[pageData.slug]} />;

	switch (pageData.props.itemType) {
		case "article":
			return <Article article={content.items["articles"][pageData.slug]} />;
		case "project":
			return <Project project={content.items["projects"][pageData.slug]} />;
		case "devProject":
			return (
				<Project
					project={await getDevProjectData(
						content.items["projects"][pageData.slug] as DevProject
					)}
				/>
			);
	}
}

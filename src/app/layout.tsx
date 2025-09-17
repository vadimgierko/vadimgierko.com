import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Layout from "@/layout/index";
import { GoogleAnalytics } from "@next/third-parties/google";
import { websiteConfig } from "../../website.config";
import { fetchDomainMetadata } from "@/lib/fetchDomainMetadata";
import { fetchContent } from "@/lib/fetchContent";

export async function generateMetadata(): Promise<Metadata> {
	const domainMetadata = await fetchDomainMetadata();
	if (!domainMetadata) return {};

	const { title, description, authorName, favicon, openGraph } = domainMetadata;
	const metadata: Metadata = {
		title,
		description,
		authors: { name: authorName },
		icons: favicon,
		openGraph,
	};
	return metadata;
}

const TEMPORARY_DOMAIN_LAYOUT = {
	footer: {
		beforeCopyText: "development, content & images",
		initYear: 2022,
		links: {
			internal: [],
			external: [
				{
					href: "https://github.com/vadimgierko",
					value: "Vadim Gierko",
				},
			],
		},
	},
	navbar: {
		links: {
			about: {
				href: "/o-mnie",
				value: "o mnie",
			},
			categories: {
				"web-development": "programowanie",
				"creative-process-management": "proces twórczy",
				"visual-thinking": "myślenie wizualne",
				music: "muzyka",
			},
			items: {
				articles: "artykuły",
				audios: "nagrania",
				images: "galeria",
				projects: "projekty",
				videos: "wideo",
			},
			social: {
				github: "https://github.com/vadimgierko",
				linkedin: "https://pl.linkedin.com/in/vadimgierko",
				instagram: "https://www.instagram.com/vadim.gierko/",
			},
		},
		brand: {
			image: {
				src: `${websiteConfig.cmsRootURL}/vadim-gierko-avatar.jpg`,
				alt: "vadim gierko profile picture",
			},
			value: "Vadim Gierko",
		},
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const content = await fetchContent();

	return (
		<html lang="pl" data-bs-theme="dark" data-scroll-behavior="smooth">
			<body>
				<Layout
					localStorageThemeKey={`${websiteConfig.domain.name}-theme`}
					layout={TEMPORARY_DOMAIN_LAYOUT}
					content={content}
				>
					{children}
				</Layout>
			</body>
			<GoogleAnalytics gaId={websiteConfig.domain.gaId} />
		</html>
	);
}

import MarkdownRenderer from "@/components/atoms/MarkdownRenderer";

// icons bank:
import { icons } from "@/content/icons";
// custom components:
// layout:
import Section from "@/layout/Section";
// atoms:
import Icon from "@/components/atoms/Icon";
// next.js:
import Link from "next/link";
import BioContainer from "./BioContainer";
import { websiteConfig } from "../../website.config";
import { Content } from "@/types";

export default async function Home() {
	const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/categories");
	const categories = (await res.json()) as Content["categories"];

	return (
		<>
			<BioContainer />
			{Object.values(categories).map((category) => (
				<Section key={category.metadata.link}>
					{category.props.icon && (
						<Icon IconType={icons[category.props.icon].Icon} size={80} />
					)}
					{category.metadata.title && (
						<h2 className="text-center my-3">{category.metadata.title}</h2>
					)}
					{category.metadata.description && (
						<MarkdownRenderer markdown={category.metadata.description} />
					)}
					<Link href={category.metadata.link}>Więcej info</Link>
				</Section>
			))}
		</>
	);
}

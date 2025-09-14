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
import { fetchContent } from "@/lib/fetchContent";

export default async function Home() {
	const content = await fetchContent();
	if (!content)
		return (
			<p className="text-danger text-danger">No content fetched from CMS...</p>
		);

	const categories = Object.keys(content.categories).map(
		(categoryName) => content.categories[categoryName]
	);

	return (
		<>
			<BioContainer />
			{categories.map((category) => (
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

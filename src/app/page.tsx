import MarkdownRenderer from "@/components/atoms/MarkdownRenderer";
import { icons } from "@/content/icons";
import Section from "@/layout/Section";
import Icon from "@/components/atoms/Icon";
import Link from "next/link";
import BioContainer from "./BioContainer";
import { fetchCategories } from "@/lib/api/v1";

export default async function Home() {
	const categories = await fetchCategories();

	return (
		<>
			<BioContainer />
			{categories &&
				Object.values(categories).map((category) => (
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

import Icon from "@/components/Icon";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { icons } from "@/content/icons";
import { SectionWrapper } from "@/layout/Section";
import { Category } from "@/types";
import Link from "next/link";

export function CategorySection({ category }: { category: Category }) {
	const { props, metadata } = category;

	return (
		<SectionWrapper>
			<Icon IconType={icons[props.icon].Icon} size={80} />
			<h2 className="text-center my-3">{metadata.title}</h2>
			<MarkdownRenderer markdown={metadata.description} />
			<Link href={metadata.link}>Więcej info</Link>
		</SectionWrapper>
	);
}

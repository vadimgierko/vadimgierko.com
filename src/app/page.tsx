import BioContainer from "./(homePageComponents)/BioContainer";
import { fetchCategories } from "@/lib/api/v1";
import { CategorySection } from "./(homePageComponents)/CategorySection";

export default async function Home() {
	const categories = await fetchCategories();

	if (!categories) return <BioContainer />;

	return (
		<>
			<BioContainer />
			{Object.values(categories).map((category) => (
				<CategorySection key={category.metadata.link} category={category} />
			))}
		</>
	);
}

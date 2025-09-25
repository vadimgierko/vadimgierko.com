// react bootstrap:
import Container from "react-bootstrap/Container";
// custom components:
// atoms:
import Icon from "@/components/atoms/Icon";
import Card from "@/components/atoms/Card";
import YouTubeVideo from "@/components/atoms/YouTubeVideo";
import SoundCloudAudio from "@/components/atoms/SoundCloudAudio";
// molecules:
import Gallery from "@/components/molecules/Gallery";
// content:
import { icons } from "@/content/icons";
import { notFound } from "next/navigation";
import { allowedItemsTypes, Category, Content, ItemsType, Page } from "@/types";
import { getFieldItemBySlug } from "@/components/organisms/Category";
import { websiteConfig } from "../../../../website.config";
import { fetchPage } from "../page";

type ItemsPageParams = { slug: string; items: ItemsType };

export async function generateMetadata({
	params,
}: {
	params: Promise<ItemsPageParams>;
}) {
	const slug = (await params).slug;
	const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/pages/" + slug);
	const slugPageData = (await res.json()) as Page;

	if (!slugPageData || slugPageData.pageType !== "category") return {};

	const slugPage = await fetchPage(slugPageData, slug);
	const { metadata: slugPageMetadata } = slugPage;

	const itemsType = (await params).items;

	return {
		title: `Vadim Gierko | ${slugPageMetadata.title} |
          ${
						itemsType === "projects"
							? "Projekty (Projects)"
							: itemsType === "articles"
							? "Artykuły (Articles)"
							: itemsType === "videos"
							? "Filmy (Videos)"
							: itemsType === "images"
							? "Galeria (Gallery)"
							: "Nagrania (Audios)"
					}`,
	};
}

export async function generateStaticParams() {
	const params: ItemsPageParams[] = [];

	const res = await fetch(websiteConfig.cmsRootURL + "/api/v1/categories");
	const categories = (await res.json()) as Content["categories"];
	if (!categories) return [];

	Object.keys(categories).forEach((categoryName) =>
		allowedItemsTypes.forEach((itemsType) =>
			params.push({ slug: categoryName, items: itemsType })
		)
	);

	return params;
}

export default async function ItemsPage({
	params,
}: {
	params: Promise<ItemsPageParams>;
}) {
	//====================== FIELD DATA ====================//
	const slug = (await params).slug; // ❗❗❗

	const res = await fetch(
		websiteConfig.cmsRootURL + "/api/v1/categories/" + slug
	);

	const category = (await res.json()) as Category;

	//====================== ITEMS DATA ====================//
	const itemsType = (await params).items;

	const items = category.items[itemsType];

	if (!items || (items && !items.length)) return notFound();

	return (
		<Container className="py-3 text-center" style={{ maxWidth: 900 }}>
			{category.props.icon && (
				<Icon IconType={icons[category.props.icon].Icon} size={100} />
			)}
			<h1>{category.metadata.title}</h1>
			<hr />
			<h2 className="mb-3">
				{itemsType === "projects"
					? "Projekty (Projects)"
					: itemsType === "articles"
					? "Artykuły (Articles)"
					: itemsType === "videos"
					? "Filmy (Videos)"
					: itemsType === "images"
					? "Galeria (Gallery)"
					: "Nagrania (Audios)"}
			</h2>
			<main>
				{category.items[itemsType] &&
					(await Promise.all(
						category.items[itemsType].map(async (itemSlug, i) => {
							const item = await getFieldItemBySlug({
								slug: itemSlug,
								itemsType,
							});

							if (!item) return null;

							/** ==================== ARTICLES / PROJECTS ================= */
							if (itemsType === "articles" || itemsType === "projects")
								return (
									<Card
										key={item.metadata.title}
										item={item}
										left={i % 2 !== 0}
										linkText={
											itemsType === "articles" ? "Czytaj dalej" : "Więcej info"
										}
									/>
								);
							/** ==================== VIDEOS ================= */
							if (itemsType === "videos" && item.itemType === "video")
								return (
									<YouTubeVideo
										key={item.metadata.title}
										className="mb-3"
										width={item.props.width}
										height={item.props.height}
										id={item.props.id}
										title={item.metadata.title}
										description={item.metadata.description}
									/>
								);

							/** ==================== AUDIOS ================= */
							if (itemsType === "audios" && item.itemType === "audio")
								return (
									<SoundCloudAudio
										key={item.props.src}
										src={item.props.src}
										className="mb-3"
									/>
								);
						})
					))}

				{/** ==================== IMAGES ================= */}
				{itemsType === "images" && category.items.images.length > 0 && (
					<Gallery images={category.items.images} />
				)}
			</main>
		</Container>
	);
}

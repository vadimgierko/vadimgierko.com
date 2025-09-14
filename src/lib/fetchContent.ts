import { Content } from "@/types";
import { websiteConfig } from "../../website.config";

export async function fetchContent() {
	try {
		const res = await fetch(`${websiteConfig.cmsURL}/content.json`);
		const content = await res.json();
		return content as Content;
	} catch (error: unknown) {
		console.log(error);
		return undefined;
	}
}

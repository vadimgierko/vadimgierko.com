import { Domain } from "@/types";
import { websiteConfig } from "../../website.config";

export async function fetchDomainMetadata() {
	try {
		const res = await fetch(
			`${websiteConfig.cmsURL}/domains/${websiteConfig.domainName}/metadata/index.json`
		);
		const domainMetadata = await res.json();
		return domainMetadata as Domain["metadata"];
	} catch (error: unknown) {
		console.log(error);
		return undefined;
	}
}

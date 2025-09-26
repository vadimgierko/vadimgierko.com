import { DevProject } from "@/types";
import { fetchRepoDataFromGitHub } from "./fetchRepoDataFromGitHub";
import checkGithubApiTokenRateLimits from "./checkGithubApiTokenRateLimits";
import { fetchRepoReadmeFileContentFromGitHub } from "./fetchRepoReadmeFileContentFromGitHub";

export async function fetchPublicDevProjectData(devProject: DevProject) {
	const repoData = await fetchRepoDataFromGitHub(devProject.props.repoName);
	const readmeMarkdown = await fetchRepoReadmeFileContentFromGitHub(
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

"use client";

import { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { websiteConfig } from "../../../website.config";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const bio = {
	img: `${websiteConfig.cmsRootURL}/vadim-gierko-avatar.jpg`,
	title: "Cześć 👋",
	description: `
Nazywam się Vadim Gierko.

Programuję, komponuję, tworzę notatki wizualne i mapy myśli, zgłębiam tajniki Zarządzania Procesem Twórczym, przygotowuję się egzaminu na tłumacza przysięgłego oraz uczę się czegoś nowego każdego dnia.
		
Jednak to programowanie webowe jest moim głównym zainteresowaniem od końca 2020 r. Uwielbiam programowanie za to, że pozwala urzeczywistnić każdy szalony pomysł oraz rozwiązać każdy praktyczny problem.		
			`,
};

export default function BioContainer() {
	const [windowHeight, setWindowHeight] = useState<number | undefined>(
		undefined
	);

	useEffect(() => {
		setWindowHeight(globalThis.window.innerHeight - 70);
	}, []);

	return (
		<header>
			<Container
				className="d-flex flex-column justify-content-center align-items-center text-center"
				style={{
					minHeight: windowHeight,
				}}
			>
				<Image
					src={bio.img}
					roundedCircle
					style={{ width: 200 }}
					className="shadow"
					alt="Vadim Gierko's avatar"
				/>
				<div style={{ maxWidth: 500 }}>
					<h1 className="my-3">{bio.title}</h1>
					<MarkdownRenderer markdown={bio.description} />
				</div>
			</Container>
		</header>
	);
}

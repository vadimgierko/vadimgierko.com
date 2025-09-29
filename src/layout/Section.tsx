import { ReactNode } from "react";
import { Container } from "react-bootstrap";

export function SectionWrapper({ children }: { children: ReactNode }) {
	if (!children) return null;

	return (
		<section>
			<Container className="py-3" style={{ maxWidth: 900 }}>
				{children}
			</Container>
		</section>
	);
}

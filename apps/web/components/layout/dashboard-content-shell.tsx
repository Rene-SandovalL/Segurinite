import { type ReactNode } from "react";
import { GrupoDetailHeader } from "../grupos/grupo-detail-header";

interface DashboardContentShellProps {
	titulo: string;
	tabs?: ReactNode;
	children: ReactNode;
	unirConTabs?: boolean;
}

export function DashboardContentShell({
	titulo,
	tabs,
	children,
	unirConTabs = true,
}: DashboardContentShellProps) {
	const hayTabs = tabs !== undefined && tabs !== null;
	const panelRadius = hayTabs && unirConTabs ? "0 22px 22px 22px" : "22px";

	return (
		<div className="h-full flex flex-col bg-transparent">
			<GrupoDetailHeader titulo={titulo} />

			<div className="flex-1 min-h-0" style={{ padding: "30px 25px 24px" }}>
				<div className="h-full flex flex-col">
					{hayTabs ? <div>{tabs}</div> : null}

					<section
						className="flex-1 min-h-0 overflow-y-auto"
						style={{
							background: "#f2f2f4",
							border: "1px solid rgba(156, 163, 175, 0.6)",
							borderRadius: panelRadius,
							boxShadow: "0 14px 28px rgba(0, 0, 0, 0.22)",
							padding: "clamp(16px, 2.1vw, 30px) clamp(16px, 2.3vw, 36px) clamp(14px, 1.8vw, 26px)",
						}}
					>
						{children}
					</section>
				</div>
			</div>
		</div>
	);
}

import { type ReactNode } from "react";

interface DashboardContentShellProps {
	titulo: string;
	tabs: ReactNode;
	children: ReactNode;
	unirConTabs?: boolean;
}

export function DashboardContentShell({
	titulo,
	tabs,
	children,
	unirConTabs = true,
}: DashboardContentShellProps) {
	const panelRadius = unirConTabs ? "0 22px 22px 22px" : "22px";

	return (
		<div className="h-full flex flex-col bg-transparent">
			<header className="px-8 pt-4 pb-3 shrink-0">
				<h1 className="text-[clamp(2.3rem,3.6vw,3.7rem)] font-medium text-white tracking-[0.03em] uppercase leading-none">
					{titulo}
				</h1>
			</header>

			<div className="flex-1 min-h-0" style={{ padding: "0 28px 24px" }}>
				<div className="h-full flex flex-col">
					<div style={{ marginLeft: "8px" }}>{tabs}</div>

					<section
						className="flex-1 min-h-0 overflow-y-auto"
						style={{
							background: "#f2f2f3",
							border: "1px solid rgba(156, 163, 175, 0.6)",
							borderRadius: panelRadius,
							boxShadow: "0 14px 28px rgba(0, 0, 0, 0.22)",
							padding: "42px 56px 34px",
						}}
					>
						{children}
					</section>
				</div>
			</div>
		</div>
	);
}

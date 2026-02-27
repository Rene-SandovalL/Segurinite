export function SidebarHeader() {
  return (
    <div className="px-7 pt-8 pb-6">
      <div className="flex items-center gap-4">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-300 text-gray-500 hover:text-gray-700 transition-all"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-[clamp(1.9rem,2.3vw,2.7rem)] leading-none font-light tracking-wide text-gray-700 uppercase">
          Segurinite
        </span>
      </div>
    </div>
  );
}

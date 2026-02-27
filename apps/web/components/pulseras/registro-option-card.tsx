import Image from "next/image";
import Link from "next/link";

interface RegistroOptionCardProps {
  href: string;
  title: string;
  iconSrc: string;
  iconAlt: string;
  headerColor: string; 
  /** Optional: custom classes for the icon container (width/height) */
  iconContainerClassName?: string;
  /** Optional: custom padding class for the Image inside the container */
  iconPaddingClassName?: string;
}

export function RegistroOptionCard({ href, title, iconSrc, iconAlt, headerColor, iconContainerClassName = "w-72 h-88", iconPaddingClassName = "p-10" }: RegistroOptionCardProps) {
  return (
    <Link href={href} className="block">
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
        <div
          className="py-14 px-14 text-center rounded-t-2xl"
          style={{ backgroundColor: headerColor }}
        >
          <span className="text-white text-2xl font-bold uppercase tracking-wider">
            {title}
          </span>
        </div>

        <div className="flex items-center justify-center px-14 py-24 flex-1">
          <div className="relative w-72 h-88">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`relative ${iconContainerClassName}`}>
                <Image
                  src={iconSrc}
                  alt={iconAlt}
                  fill
                  className={`object-contain ${iconPaddingClassName}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

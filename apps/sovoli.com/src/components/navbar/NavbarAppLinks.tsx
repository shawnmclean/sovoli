import Link from "next/link";

export interface NavbarAppLinksProps {
  items: { href: string; name: string }[];
}

export const NavbarAppLinks = ({ items }: NavbarAppLinksProps) => {
  return (
    <nav>
      <ol className="flex list-none flex-wrap rounded-small">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex min-w-0 items-center text-foreground/50 last:font-bold last:text-foreground"
          >
            <Link
              href={item.href}
              className="min-w-0 p-1 hover:bg-foreground/10"
            >
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                {item.name}
              </span>
            </Link>
            {index < items.length - 1 && (
              <span
                data-slot="separator"
                aria-hidden="true"
                className="px-1 text-foreground/50 rtl:rotate-180"
              >
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

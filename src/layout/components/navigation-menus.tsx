import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "@/common/ui/layout/utils";
import { rootPathnames } from "@/pathnames";

import { MAIN_NAVIGATION_LINKS } from "../constants";

export const NavigationMenuDesktop: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="flex flex-row items-center justify-center max-md:hidden">
      {MAIN_NAVIGATION_LINKS.map(({ url, label, disabled }) => {
        const isActive = url === router.pathname;

        return (
          <Link
            key={url + label}
            href={disabled ? rootPathnames.CURRENT : url}
            className={cn(
              "decoration-none hover:decoration-none relative mr-8 text-sm",

              {
                "cursor-not-allowed opacity-20": disabled,
                "font-medium": isActive,
                "font-normal text-neutral-500": !isActive,
              },
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export type NavigationMenuMobileProps = {
  open: boolean;
};

export const NavigationMenuMobile: React.FC<NavigationMenuMobileProps> = ({ open }) => {
  const router = useRouter();

  return (
    <div className="md:hidden">
      {open && (
        <nav className="flex flex-col gap-4 p-6">
          {MAIN_NAVIGATION_LINKS.map(({ url, label, disabled }) => {
            const isActive = url === router.pathname;

            return (
              <Link
                key={url + label}
                href={disabled ? rootPathnames.CURRENT : url}
                className={cn(
                  "decoration-none not-last-child hover:decoration-none relative mr-8 text-sm",

                  {
                    "cursor-not-allowed opacity-20": disabled,
                    "font-medium": isActive,
                    "font-normal text-neutral-500": !isActive,
                  },
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

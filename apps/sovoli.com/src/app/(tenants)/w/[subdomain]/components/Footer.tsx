import React from "react";
import { Link } from "@sovoli/ui/components/link";
import {
  BookIcon,
  FacebookIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

import { programsData } from "../programsData";

export const Footer = () => {
  return (
    <footer className="bg-content2 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center">
              <BookIcon className="mr-2 text-2xl text-primary" />
              <span className="text-lg font-bold">Modern Academy</span>
            </div>
            <p className="mb-4 text-sm text-foreground-500">
              Empowering students to reach their full potential through
              innovative education.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=100063128446623"
                aria-label="Facebook"
              >
                <FacebookIcon className="text-foreground-500 hover:text-primary" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Programs</h3>
            <ul className="space-y-2">
              {programsData.slice(0, 5).map((program) => (
                <li key={program.id}>
                  <Link
                    className="text-sm text-foreground-500 hover:text-primary"
                    href={`/academics/programs/${program.slug}`}
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="/academics/programs"
                >
                  More...
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="#"
                >
                  Account Portal
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="#"
                >
                  Academic Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <address className="not-italic">
              <div className="mb-2 flex items-start gap-2">
                <MapPinIcon className="mt-1 text-foreground-500" />
                <span className="text-sm text-foreground-500">
                  Lot 11, Public Road
                  <br />
                  Mon Repos, ECD, 4, Guyana
                </span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <PhoneIcon className="text-foreground-500" />
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="tel:+5926271915"
                >
                  +592 627-1915
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="text-foreground-500" />
                <Link
                  className="text-sm text-foreground-500 hover:text-primary"
                  href="mailto:info@ma.edu.gy"
                >
                  info@ma.edu.gy
                </Link>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-divider pt-8 text-center text-sm text-foreground-500">
          <p>
            &copy; {new Date().getFullYear()} Modern Academy. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

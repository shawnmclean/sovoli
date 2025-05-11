"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { ChevronDownIcon, Link, LogInIcon } from "lucide-react";

export function TenantNavbar() {
  return (
    <Navbar maxWidth="xl" className="border-b border-divider bg-background">
      <NavbarBrand>
        <p>Modern Academy</p>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#about">
            About
          </Link>
        </NavbarItem>

        {/* Admissions Dropdown */}
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                endContent={<ChevronDownIcon width={16} />}
                radius="sm"
                variant="light"
              >
                Admissions
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Admissions links" className="w-[200px]">
            <DropdownItem key="requirements">
              Admission Requirements
            </DropdownItem>
            <DropdownItem key="tuition">Tuition and Fees</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Academics Dropdown */}
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                endContent={<ChevronDownIcon width={16} />}
                radius="sm"
                variant="light"
              >
                Academics
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Academics links" className="w-[200px]">
            <DropdownItem key="programs">Programs</DropdownItem>
            <DropdownItem key="faculty">Faculty</DropdownItem>
            <DropdownItem key="curriculum">Curriculum</DropdownItem>
            <DropdownItem key="calendar">Calendar</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NavbarItem>
          <Link color="foreground" href="#contact">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Section - Login/Profile */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="#login"
            variant="flat"
            startContent={<LogInIcon width={16} />}
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

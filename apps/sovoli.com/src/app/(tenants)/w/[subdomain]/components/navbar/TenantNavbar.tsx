"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Link } from "@sovoli/ui/components/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@sovoli/ui/components/navbar";
import { ChevronDownIcon, LogInIcon, UserIcon } from "lucide-react";

export function TenantNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Navbar maxWidth="xl" className="border-b border-divider bg-background">
      {/* Left Section - School Brand */}
      <NavbarBrand>
        <p className="text-lg font-semibold">Modern Academy</p>
      </NavbarBrand>

      {/* Center Section - Main Navigation */}
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem>
          <Link aria-current="page" href="#" color="foreground">
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
            <DropdownItem key="requirements" href="#requirements">
              Admission Requirements
            </DropdownItem>
            <DropdownItem key="tuition" href="#tuition">
              Tuition and Fees
            </DropdownItem>
            <DropdownItem key="apply" href="#apply">
              How to Apply
            </DropdownItem>
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
            <DropdownItem key="programs" href="#programs">
              Programs
            </DropdownItem>
            <DropdownItem key="faculty" href="#faculty">
              Faculty List
            </DropdownItem>
            <DropdownItem key="curriculum" href="#curriculum">
              Curriculum
            </DropdownItem>
            <DropdownItem key="calendar" href="#calendar">
              Academic Calendar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NavbarItem>
          <Link color="foreground" href="#contact">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Section - Apply and Login/Profile */}
      <NavbarContent justify="end" className="gap-4">
        {/* Login/Profile */}
        {isLoggedIn ? (
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                  endContent={<ChevronDownIcon width={16} />}
                  radius="full"
                  variant="light"
                >
                  <UserIcon width={24} />
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label="User Menu" className="w-[200px]">
              <DropdownItem key="profile" href="#profile">
                My Profile
              </DropdownItem>
              <DropdownItem key="settings" href="#settings">
                Account Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                href="#logout"
                onPress={() => setIsLoggedIn(false)}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              color="secondary"
              href="#login"
              variant="light"
              startContent={<LogInIcon width={16} />}
              onPress={() => setIsLoggedIn(true)}
            >
              Sign In
            </Button>
          </NavbarItem>
        )}
        {/* Apply Now Button (Primary CTA) */}
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="#apply"
            variant="solid"
            className="font-semibold"
          >
            Apply Now
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

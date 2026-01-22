"use client";

import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import type { Key } from "react";
import { useState } from "react";
import type { Event } from "~/modules/events/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { EventCard } from "./EventCard";
import { SubscribeAllEventsButton } from "./SubscribeAllEventsButton";

export interface EventsTabsProps {
  orgInstance: OrgInstance;
}

export function EventsTabs({ orgInstance }: EventsTabsProps) {
  const [selectedTab, setSelectedTab] = useState<Key>("all");

  const events = orgInstance.eventModule?.events ?? [];

  // Helper function to check if an event is upcoming
  const isEventUpcoming = (event: Event) => {
    const now = new Date();
    const eventEndDate = event.endDate
      ? new Date(event.endDate)
      : new Date(event.startDate);

    // If event has endTime, use it; otherwise use startTime or default to end of day
    if (event.endTime) {
      const [hours, minutes] = event.endTime.split(":");
      eventEndDate.setHours(
        parseInt(hours ?? "0", 10),
        parseInt(minutes ?? "0", 10),
        0,
        0,
      );
    } else if (event.startTime) {
      const [hours, minutes] = event.startTime.split(":");
      eventEndDate.setHours(
        parseInt(hours ?? "0", 10),
        parseInt(minutes ?? "0", 10),
        0,
        0,
      );
    } else {
      // Default to end of day if no time specified
      eventEndDate.setHours(23, 59, 59, 999);
    }

    return eventEndDate > now;
  };

  // Filter events based on actual dates
  const allEvents = events;
  const upcomingEventsFiltered = events.filter(isEventUpcoming);
  const pastEvents = events.filter((event) => !isEventUpcoming(event));

  const handleTabChange = (key: Key | null) => {
    if (key) {
      setSelectedTab(key);
    }
  };

  const getEventsForTab = () => {
    switch (selectedTab) {
      case "upcoming":
        return upcomingEventsFiltered;
      case "past":
        return pastEvents;
      default:
        return allEvents;
    }
  };

  const getTabTitle = () => {
    switch (selectedTab) {
      case "upcoming":
        return "Upcoming Events";
      case "past":
        return "Past Events";
      default:
        return "All Events";
    }
  };

  const getTabDescription = () => {
    switch (selectedTab) {
      case "upcoming":
        return "Join us for exciting events and activities throughout the school year";
      case "past":
        return "Take a look back at our recent events and activities";
      default:
        return "Browse all our events, both upcoming and past";
    }
  };

  const currentEvents = getEventsForTab();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getTabDescription()}
          </p>
        </div>
        <div className="flex justify-center">
          <SubscribeAllEventsButton orgInstance={orgInstance} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        aria-label="Event categories"
        variant="bordered"
        selectedKey={selectedTab as string}
        onSelectionChange={handleTabChange}
        size="lg"
        className="w-full"
        classNames={{
          tabList: "grid w-full grid-cols-3",
          tab: "px-4 py-3 text-sm font-medium",
          tabContent: "gap-2",
        }}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <span>All Events</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({allEvents.length})
              </span>
            </div>
          }
        />
        <Tab
          key="upcoming"
          title={
            <div className="flex items-center gap-2">
              <span>Upcoming</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({upcomingEventsFiltered.length})
              </span>
            </div>
          }
        />
        <Tab
          key="past"
          title={
            <div className="flex items-center gap-2">
              <span>Past Events</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({pastEvents.length})
              </span>
            </div>
          }
        />
      </Tabs>

      {/* Events Content */}
      {currentEvents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{getTabTitle()}</h2>
          <p className="text-muted-foreground">
            {selectedTab === "upcoming"
              ? "No upcoming events scheduled at this time. Check back soon!"
              : selectedTab === "past"
                ? "No past events to display at this time."
                : "No events available at this time."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentEvents.map((event) => (
            <EventCard key={event.id} event={event} orgInstance={orgInstance} />
          ))}
        </div>
      )}
    </div>
  );
}

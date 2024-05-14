/**
 * Show all events created by the user
 */

"use client";
import { getBlogs } from "@/handlers/blog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FilePlus } from "lucide-react";
import Link from "next/link";
import BlogCard from "../../_components/blog-card";
import Loading from "../../_components/loading";
import SomethingWentWrong from "../../_components/something-went-wrong";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import search from "@/utils/search";
import { getEvents } from "@/handlers/events";
import { IEvent } from "@/types/event.types";
import EventCard from "../../_components/event-card";

const EventsPage = () => {
  const [filteredData, setFilteredData] = useState<IEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all events
  const { data, isLoading, isError } = useQuery<IEvent[]>({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: Infinity,
  });

  // Filter events based on search query
  useEffect(() => {
    if (data) {
      setFilteredData(search<IEvent>(data, searchQuery, ["title"]));
    }
  }, [data, searchQuery]);

  //Show loading or error message accordingly
  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg">
      <div className="flex justify-between">
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search events..."
          className="max-w-80"
        />
        <Link href="/admin/events/new">
          <Button>
            <span>Add Event</span>
            <CalendarDays className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
      <hr />
      <h2 className="text-2xl font-semibold text-primary">All Events</h2>
      <div className="flex gap-4 flex-wrap">
        {filteredData && filteredData?.length > 0 ? (
          filteredData?.map((event) => <EventCard {...event} key={event.id} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-96 w-full">
            <p className="text-muted-foreground">No events found!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default EventsPage;

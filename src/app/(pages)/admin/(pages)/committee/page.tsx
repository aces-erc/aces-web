"use client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import Loading from "../../_components/loading";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import search from "@/utils/search";
import { getAllCommitteeMembers } from "@/handlers/committee";
import { Committee } from "@/schema/committee.zod";
import MemberCard from "../../_components/member-card";
import SomethingWentWrong from "../../_components/something-went-wrong";

/**
 * Show all committee members
 */
const CommitteePage = () => {
  const [filteredData, setFilteredData] = useState<Committee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Fetch all committee members
  const { data, isLoading, isError } = useQuery<Committee[]>({
    queryKey: ["committee"],
    queryFn: getAllCommitteeMembers,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setFilteredData(
        search<Committee>(data, searchQuery, ["name", "position"])
      );
    }
  }, [data, searchQuery]);

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg">
      <div className="flex justify-between">
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder="Search Members"
          className="max-w-80"
        />
        <Link href="/admin/committee/new">
          <Button>
            <span>Add Member</span>
            <UserRoundPlus className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
      <hr />
      <h2 className="text-2xl font-semibold text-primary">All Members</h2>
      <div className="flex gap-4 flex-wrap">
        {filteredData && filteredData?.length > 0 ? (
          filteredData?.map((c, i) => <MemberCard committee={c} key={i} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-96 w-full">
            <p className="text-muted-foreground">No members found!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CommitteePage;

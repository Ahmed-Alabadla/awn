"use client";

import { useState } from "react";
// import { organizationService } from "@/services/organization.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizations } from "@/hooks/useOrganization";

const PAGE_SIZE = 6;

export default function OrganizationSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterVerified, setFilterVerified] = useState<
    "all" | "verified" | "pending"
  >("all");

  const { organizations = [], isLoadingOrganizations } = useOrganizations();

  // Filtering
  const filtered = organizations.filter((org) => {
    const matchesSearch =
      org.organization_name.toLowerCase().includes(search.toLowerCase()) ||
      org.description.toLowerCase().includes(search.toLowerCase());

    const matchesVerification =
      filterVerified === "all" ||
      (filterVerified === "verified" && org.verified) ||
      (filterVerified === "pending" && !org.verified);

    return matchesSearch && matchesVerification;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFilterChange(value: "all" | "verified" | "pending") {
    setFilterVerified(value);
    setPage(1);
  }

  if (isLoadingOrganizations) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-muted-foreground">
          Loading organizations...
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-1">Organizations Directory</h2>
      <p className="text-muted-foreground mb-4">
        Discover verified organizations providing aid and support services
      </p>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search organizations by name or description..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 px-3 py-2"
          />

          <Select value={filterVerified} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="verified">Verified Organizations</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filtered.length} organization
          {filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {filterVerified !== "all" && ` (${filterVerified})`}
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.length > 0 ? (
          paginated.map((organization) => (
            <Card
              key={organization.id}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          organization.verified ? "default" : "secondary"
                        }
                      >
                        {organization.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {organization.organization_name}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {organization.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>{organization.email}</span>
                  </div>
                  {organization.phone && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span>
                      <span>{organization.phone}</span>
                    </div>
                  )}
                  {organization.website && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Website:</span>
                      <Link
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </Link>
                    </div>
                  )}
                  {organization.location && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium">Location:</span>
                      <span className="flex-1">{organization.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="font-medium">Member since:</span>
                    <span>
                      {new Date(organization.created_at).getFullYear()}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/organizations/${organization.id}`}>
                    <Button className="w-full" variant="hero">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center text-muted-foreground py-12">
            No organizations found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}

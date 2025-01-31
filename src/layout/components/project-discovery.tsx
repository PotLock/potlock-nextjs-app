import { useMemo } from "react";

import { CHRONOLOGICAL_SORT_OPTIONS } from "@/common/constants";
import { type ByListId, ChronologicalSortOrderVariant } from "@/common/types";
import {
  Filter,
  Group,
  GroupType,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  SearchBar,
  SortSelect,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import {
  ACCOUNT_CATEGORY_OPTIONS,
  ACCOUNT_LIST_REGISTRATION_STATUS_OPTIONS,
  AccountCard,
  AccountCardSkeleton,
} from "@/entities/_shared/account";
import { useListRegistrationLookup } from "@/entities/list";
import { DonateToAccountButton } from "@/features/donation";

const ListRegistrationLookupPlaceholder = () =>
  Array.from({ length: 6 }, (_, index) => <AccountCardSkeleton key={index} />);

export type ProjectDiscoveryProps = ByListId & {
  noResultsPlaceholder?: React.ReactNode;
};

export const ProjectDiscovery: React.FC<ProjectDiscoveryProps> = ({
  listId,
  noResultsPlaceholder,
}) => {
  const {
    isPending,
    categoryFilter,
    currentPageNumber,
    results: listRegistrations,
    searchTerm,
    statusFilter,
    totalCount,
    setCategoryFilter,
    setCurrentPageNumber,
    setSearchTerm,
    setSortingOrder,
    setStatusFilter,
  } = useListRegistrationLookup({ listId });

  const tagList = useMemo(
    () => [
      {
        label: "Category",
        options: ACCOUNT_CATEGORY_OPTIONS,
        type: GroupType.multiple,

        props: {
          value: categoryFilter,
          onValueChange: setCategoryFilter,
        },
      } as Group<GroupType.multiple>,

      {
        label: "Status",
        options: ACCOUNT_LIST_REGISTRATION_STATUS_OPTIONS,
        type: GroupType.single,

        props: {
          value: statusFilter,
          onValueChange: setStatusFilter,
        },
      } as Group<GroupType.single>,
    ],

    [categoryFilter, statusFilter, setCategoryFilter, setStatusFilter],
  );

  const pageNumberButtons = useMemo(() => {
    const totalPages = Math.ceil(totalCount / 30);
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      // Always show first page
      pages.push(1);

      if (currentPageNumber <= 4) {
        // Near start
        pages.push(2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPageNumber >= totalPages - 3) {
        // Near end
        pages.push(
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // Middle
        pages.push(
          "ellipsis",
          currentPageNumber - 1,
          currentPageNumber,
          currentPageNumber + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pages.map((page, i) => (
      <PaginationItem key={i}>
        {page === "ellipsis" ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            onClick={() => setCurrentPageNumber(page)}
            className={cn({
              "border-black font-bold": currentPageNumber === page,
            })}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  }, [currentPageNumber, setCurrentPageNumber, totalCount]);

  const numberOfPages = useMemo(() => Math.ceil(totalCount / 30), [totalCount]);

  return (
    <div className="flex w-full flex-col px-2 py-10 md:px-10 md:py-12">
      <div className="flex w-full flex-col gap-5">
        <div className="text-sm font-medium uppercase leading-6 tracking-[1.12px] text-[#292929]">
          <span>{"All projects"}</span>
          <span className="text-primary-600 font-600 ml-2">{totalCount}</span>
        </div>

        <div className="flex w-full items-center gap-4">
          <SearchBar
            placeholder="Search projects"
            defaultValue={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />

          <Filter groups={tagList} />

          <SortSelect
            options={CHRONOLOGICAL_SORT_OPTIONS}
            onValueChange={(value) => {
              setSortingOrder(value as ChronologicalSortOrderVariant);
            }}
          />
        </div>
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {listRegistrations.length === 0 ? (
          <>{isPending ? <ListRegistrationLookupPlaceholder /> : (noResultsPlaceholder ?? null)}</>
        ) : (
          listRegistrations.map(({ id, registrant: registrantAccount }) => (
            <AccountCard
              key={id}
              accountId={registrantAccount.id}
              snapshot={registrantAccount}
              actions={<DonateToAccountButton accountId={registrantAccount.id} />}
            />
          ))
        )}
      </div>

      {numberOfPages > 1 && (
        <Pagination className="mt-[24px]">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPageNumber((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {pageNumberButtons}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPageNumber((prev) => Math.min(prev + 1, Math.ceil(totalCount / 30)))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

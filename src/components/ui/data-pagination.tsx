import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPaginationProps {
    /**
     * Total number of items to paginate
     */
    totalItems: number;

    /**
     * Number of items to display per page
     */
    itemsPerPage: number;

    /**
     * Current active page (1-indexed)
     */
    currentPage: number;

    /**
     * Callback when page changes
     */
    onPageChange: (page: number) => void;

    /**
     * Callback when items per page changes
     */
    onItemsPerPageChange?: (value: number) => void;

    /**
     * Available options for items per page
     */
    itemsPerPageOptions?: number[];

    /**
     * Show first/last page buttons
     */
    showFirstLastButtons?: boolean;

    /**
     * Show page size selector
     */
    showPageSizeSelector?: boolean;

    /**
     * Show items information text
     */
    showItemsInfo?: boolean;

    /**
     * Custom CSS class for the container
     */
    className?: string;

    /**
     * Number of page buttons to show
     */
    maxPageButtons?: number;
}

export function DataPagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [5, 10, 15, 25],
    showFirstLastButtons = true,
    showPageSizeSelector = true,
    showItemsInfo = true,
    className = '',
    maxPageButtons = 5
}: DataPaginationProps) {
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Don't render pagination if there's only one page
    if (totalPages <= 1 && !showPageSizeSelector) return null;

    // Calculate visible pages with smart window behavior
    const getVisiblePages = () => {
        let pages: number[] = [];

        if (totalPages <= maxPageButtons) {
            // Show all pages if there are fewer than maxPageButtons
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Compute window based on current page position
            let startPage: number;

            if (currentPage <= Math.ceil(maxPageButtons / 2)) {
                // Near beginning
                startPage = 1;
            } else if (currentPage >= totalPages - Math.floor(maxPageButtons / 2)) {
                // Near end
                startPage = totalPages - maxPageButtons + 1;
            } else {
                // In the middle
                startPage = currentPage - Math.floor(maxPageButtons / 2);
            }

            pages = Array.from({ length: maxPageButtons }, (_, i) => startPage + i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    // First and last visible item
    const firstItem = (currentPage - 1) * itemsPerPage + 1;
    const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {showItemsInfo && (
                <div className="text-sm text-muted-foreground">
                    Showing {firstItem} to {lastItem} of {totalItems} items
                </div>
            )}

            <div className="flex items-center gap-2">
                {showFirstLastButtons && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        aria-label="First Page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronLeft className="h-4 w-4 -ml-2" />
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {visiblePages.map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onPageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {showFirstLastButtons && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Last Page"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4 -ml-2" />
                    </Button>
                )}

                {showPageSizeSelector && onItemsPerPageChange && (
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
                    >
                        <SelectTrigger className="w-[110px] h-7">
                            <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    );
} 
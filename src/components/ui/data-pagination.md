# DataPagination Component

A flexible and reusable pagination component for data tables and lists in the Hope application.

## Features

- Smart pagination with configurable number of visible buttons
- Shows first/last page buttons (optional)
- Provides page size selector (optional)
- Shows items information text (optional)
- Fully accessible with proper ARIA attributes
- Responsive design that adapts to different screen sizes

## Usage

```tsx
import { DataPagination } from '@/components/ui/data-pagination'

// Basic usage
<DataPagination
  totalItems={items.length}
  itemsPerPage={10}
  currentPage={currentPage}
  onPageChange={handlePageChange}
/>

// With all options
<DataPagination
  totalItems={items.length}
  itemsPerPage={itemsPerPage}
  currentPage={currentPage}
  onPageChange={handlePageChange}
  onItemsPerPageChange={handleItemsPerPageChange}
  itemsPerPageOptions={[5, 10, 25, 50]}
  showFirstLastButtons={true}
  showPageSizeSelector={true}
  showItemsInfo={true}
  className="my-4"
  maxPageButtons={5}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalItems` | `number` | Required | Total number of items to paginate |
| `itemsPerPage` | `number` | Required | Number of items to display per page |
| `currentPage` | `number` | Required | Current active page (1-indexed) |
| `onPageChange` | `(page: number) => void` | Required | Callback when page changes |
| `onItemsPerPageChange` | `(value: number) => void` | Optional | Callback when items per page changes |
| `itemsPerPageOptions` | `number[]` | `[5, 10, 15, 25]` | Available options for items per page |
| `showFirstLastButtons` | `boolean` | `true` | Show first/last page buttons |
| `showPageSizeSelector` | `boolean` | `true` | Show page size selector |
| `showItemsInfo` | `boolean` | `true` | Show items information text |
| `className` | `string` | `''` | Custom CSS class for the container |
| `maxPageButtons` | `number` | `5` | Number of page buttons to show |

## Examples

### Basic Table Pagination

```tsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalItems = data.length;

// Compute the current page items
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentPageItems = data.slice(startIndex, endIndex);

return (
  <>
    <Table data={currentPageItems} />
    
    <DataPagination
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  </>
);
```

### With Page Size Selection

```tsx
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const totalItems = data.length;

// Compute the current page items
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentPageItems = data.slice(startIndex, endIndex);

// Reset to first page when changing items per page
const handleItemsPerPageChange = (newValue: number) => {
  setItemsPerPage(newValue);
  setCurrentPage(1);
};

return (
  <>
    <Table data={currentPageItems} />
    
    <DataPagination
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={handleItemsPerPageChange}
      showPageSizeSelector={true}
    />
  </>
);
``` 
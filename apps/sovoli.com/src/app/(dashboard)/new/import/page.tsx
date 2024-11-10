import { ShelfImport } from "./components/ShelfImport";

export default function ImportPage() {
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <ShelfImport
        userCollections={[
          {
            id: "1",
            name: "My Collection",
            type: "collection",
            itemCount: 10,
          },
          {
            id: "2",
            name: "My Shelf",
            type: "shelf",
            itemCount: 5,
          },
        ]}
      />
    </div>
  );
}

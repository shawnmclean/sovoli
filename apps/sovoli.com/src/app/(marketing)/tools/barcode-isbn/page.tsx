import { BookScanner } from "./_components/BookScanner";

export const dynamic = "force-dynamic";

export default function BarcodeISBNPage() {
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Scan Book By ISBN</h1>
      <BookScanner />
    </div>
  );
}

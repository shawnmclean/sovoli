import { MyBooksScreen } from "@sovoli/ui/screens/mybooks";

export default function MyBooks({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>My books: {params.username}</h1>
      <MyBooksScreen />
    </div>
  );
}

import { MyBooksScreen } from "@sovoli/ui/screens/mybooks";

interface Props {
  params: { username: string };
}

export default function MyBooks({ params }: Props) {
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>My books: {params.username}</h1>
      <MyBooksScreen />
    </div>
  );
}

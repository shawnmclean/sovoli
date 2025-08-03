import type { Item } from "~/modules/core/items/types";

export const BOOKS: Item[] = [
  {
    id: "book-coloring-letters-numbers",
    name: "Coloring Book (Letters & Numbers)",
    category: "book",
    tags: ["exercise", "coloring", "letters", "numbers"],
  },
  {
    id: "book-animal-friends-level-a-reader",
    name: "Animal Friends Level A Reader",
    category: "book",
    tags: ["reader", "level-a", "animal-friends"],
    attributes: {
      series: "Animal Friends",
      level: "Level A",
      kind: "reader",
    },
  },
  {
    id: "book-animal-friends-level-a-workbook",
    name: "Animal Friends Level A Workbook",
    category: "book",
    tags: ["workbook", "level-a", "animal-friends"],
    attributes: {
      series: "Animal Friends",
      level: "Level A",
      kind: "workbook",
    },
  },
  {
    id: "book-big-easy-coloring",
    name: "Big and Easy Coloring Book",
    category: "book",
    tags: ["exercise", "coloring"],
  },
  {
    id: "book-roraima-nursery-year-1-literacy",
    name: "Roraima Readers Nursery Year 1 Literacy",
    category: "book",
    tags: ["textbook", "roraima-readers", "nursery-year-1"],
    attributes: {
      series: "Roraima Readers",
      kind: "textbook",
    },
  },
  {
    id: "book-roraima-nursery-year-1-numeracy",
    name: "Roraima Readers Nursery Year 1 Numeracy",
    category: "book",
    tags: ["textbook", "roraima-readers", "nursery-year-1"],
    attributes: {
      series: "Roraima Readers",
      kind: "textbook",
    },
  },
  {
    id: "book-roraima-workbook-1-writing",
    name: "Roraima Reader Workbook 1 (Writing Skills)",
    category: "book",
    tags: ["workbook", "roraima-readers", "writing-skills"],
    attributes: {
      series: "Roraima Readers",
      kind: "workbook",
    },
  },
  {
    id: "book-animal-readers",
    name: "Animal Readers",
    category: "book",
    tags: ["reader"],
  },
  {
    id: "book-roraima-numeracy-workbook-book-2",
    name: "Roraima Reader Numeracy Workbook (Book 2)",
    category: "book",
    tags: ["workbook", "roraima-readers", "book-2"],
    attributes: {
      series: "Roraima Readers",
      level: "Book 2",
      kind: "workbook",
    },
  },
  {
    id: "book-roraima-literacy-nursery-year-2",
    name: "Roraima Reader Literacy Nursery Year 2",
    category: "book",
    tags: ["textbook", "roraima-readers", "nursery-year-2"],
    attributes: {
      series: "Roraima Readers",
      level: "Nursery Year 2",
      kind: "textbook",
    },
  },
  {
    id: "book-coloring-book",
    name: "Coloring Book",
    category: "book",
    tags: ["exercise", "coloring"],
  },
];

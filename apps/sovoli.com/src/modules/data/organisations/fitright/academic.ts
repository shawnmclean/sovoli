import type { AcademicModule } from "~/modules/academics/types";

export const FITRIGHT_ACADEMIC: AcademicModule = {
  programs: [
    {
      id: 1,
      name: "Elementary Sewing",
      title: "Elementary Sewing (Beginner Level)",
      slug: "elementary-sewing",
      description:
        "Learn the fundamentals of sewing, including how to use a sewing machine, basic stitching techniques, and pattern cutting. By the end of the course, you'll be able to cut and sew a basic skirt.",
      image: "/images/programs/sewing-beginner.jpg",
      requirements: [],
    },
    {
      id: 2,
      name: "Intermediate Sewing",
      title: "Intermediate Sewing (Custom Fit & Fabric Handling)",
      slug: "intermediate-sewing",
      description:
        "Enhance your skills with body measurements, pattern modification, sleeve construction, and working with various fabric types. You'll begin creating personalized garments with improved fit and finish.",
      image: "/images/programs/sewing-intermediate.jpg",
      requirements: [],
    },
    {
      id: 3,
      name: "Advanced Sewing",
      title: "Advanced Sewing (Outfit Design & Construction)",
      slug: "advanced-sewing",
      description:
        "Master full outfit creation including skirts, tops, and dresses. Focus on advanced techniques, finishing, and garment design suitable for personal use or small business. Ideal for those looking to create a portfolio or launch a fashion brand.",
      image: "/images/programs/sewing-advanced.jpg",
      requirements: [],
    },
    {
      id: 4,
      name: "Wedding Dress Masterclass",
      title: "Masterclass: Wedding Dress Design & Tailoring",
      slug: "wedding-dress-masterclass",
      description:
        "An advanced, hands-on masterclass focused on the full lifecycle of wedding dress creation. Learn about luxury fabrics, corsetry, structured silhouettes, embellishments, and client consultations. By the end, you’ll craft a fully customized bridal gown.",
      image: "/images/programs/wedding-dress.jpg",
      requirements: [],
    },
  ],
};

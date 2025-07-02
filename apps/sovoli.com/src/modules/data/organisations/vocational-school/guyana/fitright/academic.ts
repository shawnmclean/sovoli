import type { AcademicModule } from "~/modules/academics/types";

export const FITRIGHT_ACADEMIC: AcademicModule = {
  programs: [
    {
      name: "Elementary Sewing",

      slug: "elementary-sewing",
      description:
        "Learn the fundamentals of sewing, including how to use a sewing machine, basic stitching techniques, and pattern cutting. By the end of the course, you'll be able to cut and sew a basic skirt.",
      image: `/orgs/vocational-training/guyana/fitright/academic/programs/sewing-beginner.jpg`,
    },
    {
      name: "Intermediate Sewing",

      slug: "intermediate-sewing",
      description:
        "Enhance your skills with body measurements, pattern modification, sleeve construction, and working with various fabric types. You'll begin creating personalized garments with improved fit and finish.",
      image: `/orgs/vocational-training/guyana/fitright/academic/programs/sewing-intermediate.jpg`,
    },
    {
      name: "Advanced Sewing",

      slug: "advanced-sewing",
      description:
        "Master full outfit creation including skirts, tops, and dresses. Focus on advanced techniques, finishing, and garment design suitable for personal use or small business. Ideal for those looking to create a portfolio or launch a fashion brand.",
      image: `/orgs/vocational-training/guyana/fitright/academic/programs/sewing-advanced.jpg`,
    },
    {
      name: "Wedding Dress Masterclass",

      slug: "wedding-dress-masterclass",
      description:
        "An advanced, hands-on masterclass focused on the full lifecycle of wedding dress creation. Learn about luxury fabrics, corsetry, structured silhouettes, embellishments, and client consultations. By the end, you’ll craft a fully customized bridal gown.",
      image: `/orgs/vocational-training/guyana/fitright/academic/programs/wedding-dress.jpg`,
    },
  ],
};

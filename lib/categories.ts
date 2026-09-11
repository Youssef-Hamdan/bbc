import source from "@/lib/projects.json";
import { resolveProjectImages } from "@/lib/project-media";

const MODEL_CAMERA = {
  cameraPosition: [2.7, 2.25, -2.7] as [number, number, number],
  cameraTarget: [0, 0, 0] as [number, number, number],
  yaw: 30,
  pitchUp: 30,
};

const MODELS: Record<
  string,
  {
    src: string;
    mobileSrc?: string;
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    yaw: number;
    pitchUp: number;
  }
> = {
  "residence-r-plus-4": {
    src: "/residence-r-plus-4.glb",
    ...MODEL_CAMERA,
  },
  "river-tower": {
    src: "/river-tower.glb",
    cameraPosition: [0, 2.25, 4.5],
    cameraTarget: [0, 0, 0],
    yaw: 30,
    pitchUp: 30,
  },
  "hangar-ambassadeur": {
    src: "/hangar-ambassadeur.glb",
    cameraPosition: [3.7, 2.25, 1.7],
    cameraTarget: [0, 0, 0],
    yaw: 30,
    pitchUp: 30,
  },
  "fondation-ikolo-tower": {
    src: "/fondation-ikolo-tower.glb",
    cameraPosition: [3.7, 2.25, 1.7],
    cameraTarget: [0, 0, 0],
    yaw: 30,
    pitchUp: 30,
  },
};

const FEATURED_MODEL_IDS = [
  "river-tower",
  "residence-r-plus-4",
  "hangar-ambassadeur",
  "fondation-ikolo-tower",
] as const;

export type Project = {
  id: string;
  slug: string;
  name: string;
  subcategorySlug: string;
  parentSlug: string;
  summary?: string;
  client?: string;
  place?: string;
  year?: string;
  duration?: string;
  surface?: string;
  scope: string[];
  results: string[];
  overview: string;
  challenges: string;
  solution: string;
  cover?: string;
  images: string[];
  src?: string;
  mobileSrc?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  yaw?: number;
  pitchUp?: number;
};

export type Subcategory = {
  slug: string;
  name: string;
  parentSlug: string;
};

export type Category = {
  slug: string;
  category: string;
  sampleSlug: string;
  subcategories: Subcategory[];
  projects: Project[];
};

export type CategoryView = {
  slug: string;
  category: string;
  kind: "parent" | "sub";
  parent?: { slug: string; category: string };
  subcategories: Array<{ slug: string; name: string; count: number }>;
  projects: Project[];
};

const subcategoryDefs = [
  {
    slug: "batiments-administratifs",
    name: "Bâtiments administratifs",
    parentSlug: "batiments",
  },
  {
    slug: "batiments-residentiels",
    name: "Bâtiments résidentiels",
    parentSlug: "batiments",
  },
  {
    slug: "batiments-commerciaux",
    name: "Bâtiments commerciaux",
    parentSlug: "batiments",
  },
  {
    slug: "batiments-industriels",
    name: "Bâtiments industriels",
    parentSlug: "batiments",
  },
  {
    slug: "hangars",
    name: "Hangars",
    parentSlug: "construction-metallique",
  },
  {
    slug: "fondations-profondes",
    name: "Travaux de fondation profondes",
    parentSlug: "ouvrage-dart-et-travaux-speciaux",
  },
  {
    slug: "travaux-maritimes-quais",
    name: "Travaux maritimes : quais",
    parentSlug: "ouvrage-dart-et-travaux-speciaux",
  },
  {
    slug: "chaussee-rigide-et-souple",
    name: "Chaussée rigide et souple",
    parentSlug: "route-et-vrd",
  },
] as const satisfies ReadonlyArray<Subcategory>;

const parentDefs = [
  { slug: "batiments", category: "Bâtiments", sampleSlug: "river-tower" },
  {
    slug: "construction-metallique",
    category: "Construction métallique",
    sampleSlug: "projet-ambassadeur-hangars",
  },
  {
    slug: "ouvrage-dart-et-travaux-speciaux",
    category: "Ouvrage d’art et travaux spéciaux",
    sampleSlug: "projet-ikolo-tower",
  },
  {
    slug: "route-et-vrd",
    category: "Route et VRD",
    sampleSlug: "amenagement-route-marche-zigida",
  },
] as const;

function text(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const allProjects: Project[] = source.projects.map((entry) => {
  const subcategory = subcategoryDefs.find(
    (item) => item.slug === entry.categorySlug,
  );
  if (!subcategory) {
    throw new Error(`Unknown subcategory: ${entry.categorySlug}`);
  }

  const images = resolveProjectImages([
    entry.images.thumbnail,
    entry.images.heroImage,
    ...entry.images.gallery,
  ]);

  return {
    id: entry.id,
    slug: entry.slug,
    name: entry.title,
    subcategorySlug: subcategory.slug,
    parentSlug: subcategory.parentSlug,
    summary: text(entry.summary),
    client: text(entry.details.client),
    place: text(entry.details.location),
    year: text(entry.details.year),
    duration: text(entry.details.duration),
    surface: text(entry.details.surface),
    scope: entry.content.scope,
    results: entry.content.results,
    overview: entry.content.overview,
    challenges: entry.content.challenges,
    solution: entry.content.solution,
    cover: images[0],
    images,
    ...MODELS[entry.id],
  };
});

export const subcategories: ReadonlyArray<Subcategory> = subcategoryDefs;

export const categories: Category[] = parentDefs.map((parent) => {
  const parentSubs = subcategoryDefs.filter(
    (item) => item.parentSlug === parent.slug,
  );
  return {
    slug: parent.slug,
    category: parent.category,
    sampleSlug: parent.sampleSlug,
    subcategories: [...parentSubs],
    projects: allProjects.filter((item) => item.parentSlug === parent.slug),
  };
});

export function getSubcategory(slug: string) {
  return subcategories.find((item) => item.slug === slug);
}

export function getCategory(slug: string): CategoryView | undefined {
  const parent = categories.find((item) => item.slug === slug);
  if (parent) {
    return {
      slug: parent.slug,
      category: parent.category,
      kind: "parent",
      subcategories: parent.subcategories.map((sub) => ({
        slug: sub.slug,
        name: sub.name,
        count: parent.projects.filter((item) => item.subcategorySlug === sub.slug)
          .length,
      })),
      projects: parent.projects,
    };
  }

  const sub = getSubcategory(slug);
  if (!sub) return undefined;
  const parentCategory = categories.find((item) => item.slug === sub.parentSlug);
  if (!parentCategory) return undefined;
  const projects = parentCategory.projects.filter(
    (item) => item.subcategorySlug === sub.slug,
  );
  return {
    slug: sub.slug,
    category: sub.name,
    kind: "sub",
    parent: { slug: parentCategory.slug, category: parentCategory.category },
    subcategories: [],
    projects,
  };
}

export function getSampleProject(category: Category) {
  return (
    category.projects.find((item) => item.slug === category.sampleSlug) ??
    category.projects[0]
  );
}

export function getFeaturedModelProjects() {
  return FEATURED_MODEL_IDS.map((id) => {
    const project = allProjects.find((item) => item.id === id);
    if (!project) {
      throw new Error(`Missing featured model project: ${id}`);
    }
    return project;
  });
}

export function getSubcategoryName(slug: string) {
  return getSubcategory(slug)?.name;
}

export function projectHref(project: Project) {
  return `/categories/${project.parentSlug}/${project.slug}`;
}

export function getProject(categorySlug: string, projectSlug: string) {
  const view = getCategory(categorySlug);
  if (!view) return undefined;
  const found = view.projects.find((item) => item.slug === projectSlug);
  if (!found) return undefined;
  const parent = categories.find((item) => item.slug === found.parentSlug);
  if (!parent) return undefined;
  return {
    category: parent,
    subcategory: getSubcategory(found.subcategorySlug),
    project: found,
  };
}

export function categoryParams() {
  return [
    ...categories.map((item) => ({ slug: item.slug })),
    ...subcategories.map((item) => ({ slug: item.slug })),
  ];
}

export function projectParams() {
  return allProjects.map((item) => ({
    slug: item.parentSlug,
    project: item.slug,
  }));
}

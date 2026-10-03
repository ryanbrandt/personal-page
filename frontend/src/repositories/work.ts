import type { IWorkEntry } from "@app/types/work";
import { toSlug } from "@app/common/utils/slug";

const IMAGES_URL = "https://resume-work-images.s3.amazonaws.com";

const ENTRIES: ReadonlyArray<Omit<IWorkEntry, "slug">> = [
  {
    id: 1,
    title: "Open FEC GraphQL Server",
    start: "August 2021",
    end: null,
    image: {
      src: `${IMAGES_URL}/graphql_image.png`,
      width: 1316,
      height: 829,
    },
    description:
      "A GraphQL wrapper around the Open Federal Election Commission's REST API for simplifying the retrieval of complex and deeply nested data structures.",
    tags: ["GraphQL", "Python"],
    githubUrl: "https://github.com/ryanbrandt/open-fec-graphql",
  },
  {
    id: 2,
    title: "React UseSignalR",
    start: "November 2021",
    end: null,
    image: null,
    description:
      "A React hooks interface for interacting with SignalR websockets.",
    tags: ["React", "SignalR"],
    githubUrl: "https://github.com/ryanbrandt/react-use-signalr",
  },
  {
    id: 3,
    title: "Informed Voter",
    start: "October 2019",
    end: null,
    image: {
      src: `${IMAGES_URL}/Screen+Shot+2021-01-11+at+11.30.39+PM.png`,
      width: 2430,
      height: 1374,
    },
    description:
      "A dashboard for analyzing data furnished by the Open Federal Election Commission API.",
    tags: ["React", "D3"],
    githubUrl: "https://github.com/ryanbrandt/informed-voter",
  },
  {
    id: 4,
    title: "React Drag Selection",
    start: "February 2022",
    end: null,
    image: null,
    description:
      "A React library to simplify the building of drag-to-select elements.",
    tags: ["React", "Library"],
    githubUrl: "https://github.com/ryanbrandt/react-drag-selection",
  },
  {
    id: 5,
    title: "React Testing Utils",
    start: "May 2022",
    end: null,
    image: null,
    description:
      "Wrappers and common utilities for unit testing React applications with Jest and React Testing Library.",
    tags: ["React", "Testing"],
    githubUrl: "https://github.com/ryanbrandt/react-testing-utils",
  },
];

/** The projects, each with a slug from its title (so titles must be unique). */
export const WORK_ENTRIES: ReadonlyArray<IWorkEntry> = Object.freeze(
  ENTRIES.map((entry) => ({ ...entry, slug: toSlug(entry.title) }))
);

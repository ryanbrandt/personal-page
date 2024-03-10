import { IWorkEntry } from "@app/types/work";

export const WORK_ENTRIES: Readonly<Array<IWorkEntry>> = Object.freeze([
  {
    id: 1,
    title: "Open FEC GraphQL Server",
    start: "August 2021",
    end: null,
    primaryMediaLink:
      "https://resume-work-images.s3.amazonaws.com/graphql_image.png",
    secondaryMediaLink:
      "https://resume-work-images.s3.amazonaws.com/graphql_image.png",
    description:
      "A GraphQL wrapper around the Open Federal Election Comittee's REST API for simplifying the retrieval of complex and deeply nested data structures.",
    url: "https://github.com/ryanbrandt/open-fec-graphql",
  },
  {
    id: 2,
    title: "React UseSignalR",
    start: "November 2021",
    end: null,
    primaryMediaLink: null,
    secondaryMediaLink: null,
    description:
      "A React hooks interface for interacting with SignalR websockets.",
    url: "https://github.com/ryanbrandt/react-use-signalr",
  },
  {
    id: 3,
    title: "Informed Voter",
    start: "October 2019",
    end: null,
    primaryMediaLink:
      "https://resume-work-images.s3.amazonaws.com/Screen+Shot+2021-01-11+at+11.30.39+PM.png",
    secondaryMediaLink:
      "https://resume-work-images.s3.amazonaws.com/Screen+Shot+2021-01-11+at+11.30.39+PM.png",
    description:
      "A dashboard for analyzing data furnished by the Open Federal Election Comittee API.",
    url: "https://github.com/ryanbrandt/informed-voter",
  },
  {
    id: 4,
    title: "React Drag Selection",
    start: "February 2022",
    end: null,
    primaryMediaLink: null,
    secondaryMediaLink: null,
    description:
      "A React library to simplify the building of drag-to-select elements.",
    url: "https://github.com/ryanbrandt/react-drag-selection",
  },
  {
    id: 5,
    title: "React Testing Utils",
    start: "May 2022",
    end: null,
    primaryMediaLink: null,
    secondaryMediaLink: null,
    description:
      "Wrappers and common utilities for unit testing React applications with Jest and React Testing Library.",
    url: "https://github.com/ryanbrandt/react-testing-utils",
  },
]);

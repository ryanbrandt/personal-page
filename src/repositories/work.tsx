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
      "While working on Informed Voter, a web-client to display and aggregate data provided by the Open FEC project, I found the available REST API to be difficult to work with. Pulling the pertinent information from the API required constructing complex queries and subsequently a ton of client-side parsing. To work around this and expose an easier-to-use API, I built a GraphQL wrapper around the Open FEC API.",
  },
  {
    id: 2,
    title: "React UseSignalR",
    start: "November 2021",
    end: null,
    primaryMediaLink: null,
    secondaryMediaLink: null,
    description:
      "A React hooks interface for interacting with SignalR websockets",
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
      "InformedVoter is a dashboard for analyzing data furnished by the Federal Election Comittee API. Offers graphics and summary statistics regarding political candidates sources of funding so users can gauge where their true interests may lie.",
  },
]);

import type { IResumeEntry, IResumeSkillGroup } from "@app/types/resume";

export const WORK_ENTRIES: Readonly<Array<IResumeEntry>> = [
  {
    id: 1,
    title: "Senior Software Engineer",
    organization: "Biomeme Inc.",
    description:
      "Biomeme is a biotechnology upstart developing accessible, real-time molecular diagnostic platforms for applications in human health, defense, industrial processes and more. As a Senior Software Engineer, I lead the development, design and architecture of software spanning from full-stack web applications to mobile and desktop applications and infrastructure.",
    startDate: "September 2021",
    endDate: null,
    highlights: [
      "Played a key role in the architecture of Biomeme's first point of care human health platform, which consists of a regulatory compliant ASP.NET API and React Native mobile application that interfaces with proprietary laboratory hardware.",
      "Led the design and development of a patient and provider facing patient portal consisting of multiple React micro-frontends and ASP.NET and Serverless microservices.",
      "Piloted several core React, C# and Node.JS libraries which are used organization wide.",
      "Led devops efforts across multiple projects as a lead on all things AWS infrastructure and CI/CD pipelines.",
    ],
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
  {
    id: 2,
    title: "Software Engineer II",
    organization: "AbleTo Inc.",
    description:
      "AbleTo is a leading provider in virtual behavior healthcare, offering several web and mobile-based platforms for therapy and counseling. As a Software Engineer II on the Care Delivery team, I contributed to the full-stack development of multiple therapist and counselor facing full-stack web applications oriented around the administration of patient care services.",
    startDate: "April 2021",
    endDate: "September 2021",
    highlights: [
      "Piloted a new content delivery microservice which integrated with a Contentful CMS, enabling the clinical psychology team to take full ownership over the management of complex patient care plan data, drastically improving program iteration rates.",
    ],
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
  {
    id: 3,
    title: "Software Engineer",
    organization: "Biomeme Inc.",
    description:
      "Biomeme is a biotechnology upstart developing accessible, real-time molecular diagnostic platforms for applications in human health, defense, industrial processes and much more. As a Software Engineer, I contributed to the development of multiple internal and customer facing full-stack web applications, mobile applications and desktop applications.",
    startDate: "August 2019",
    endDate: "April 2021",
    highlights: [
      "Developed a suite of regulatory compliant desktop applications to automate a complex clinical laboratory workflow which allowed Biomeme's subsidiary laboratory to scale from a single Philadelphia location to dozens nationwide and increased sample processing capabilities by over 1000%.",
      "Designed and developed an organization wide intranet and central authentication system for managing access to internal software applications.",
      "Led the development of a customer administrative panel which has enabled the Customer Success team to take total ownership over complex customer administration tasks without the need for engineering intervention.",
    ],
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
];

export const EDUCATION_ENTRIES: Readonly<Array<IResumeEntry>> = [
  {
    id: 4,
    title: "BS Computer Science",
    organization: "Rutgers University",
    description: "Minors in Statistics, Mathematics and Sociology",
    startDate: "August 2015",
    highlights: [],
    endDate: "December 2019",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
  {
    id: 5,
    title: "Certificate",
    organization: "Rutgers Data Science Bootcamp",
    description:
      "While finishing up my undergraduate degree at Rutgers I simultaneously completed a 12 week intensive data science bootcamp focused on exploratory data analysis and machine learning.",
    startDate: "August 2019",
    highlights: [],
    endDate: "December 2019",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
];

export const SKILL_GROUPS: ReadonlyArray<IResumeSkillGroup> = [
  {
    name: "Languages",
    skills: [
      "TypeScript",
      "JavaScript",
      "C#",
      "Python",
      "Java",
      "SQL",
      "NoSQL",
      "C",
      "HTML",
      "CSS",
      "SCSS",
    ],
  },
  {
    name: "Frameworks & libraries",
    skills: [
      "React",
      "React Native",
      "Serverless",
      "Express",
      "ASP.NET",
      "Flask",
      "GraphQL",
      "Blazor",
      "Maui",
    ],
  },
  {
    name: "Cloud & infra",
    skills: [
      "AWS",
      "GCP",
      "Docker",
      "CircleCI",
      "AWS CDK",
      "CloudFormation",
      "Terraform",
    ],
  },
  {
    name: "Testing & tooling",
    skills: ["Vite", "Webpack", "Jest", "Cypress", "XUnit", "PyTest", "Git"],
  },
];

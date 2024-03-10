import { IResumeEntry, IResumeSkill } from "@app/types/resume";

export const WORK_ENTRIES: Readonly<Array<IResumeEntry>> = [
  {
    id: 1,
    name: "Senior Software Engineer, Biomeme Inc.",
    description:
      "Biomeme is a biotechnology organization developing accessible, real-time molecular diagnostic platforms for applications in human health, defense, industrial processes and much more. As a Senior Software Engineer, I lead the development, design and architecture of software spanning from full-stack web applications to mobile and desktop applications and infrastructure.",
    startDate: "Setepmber 2021",
    endDate: null,
    accomplishments:
      "Played a key role in the architecture of Biomeme's first point of care human health platform, which consists of a regulatory compliant ASP.NET API and React Native mobile application that interfaces with proprietary laboratory hardware. Lead the design and development of a patient and provider facing patient portal consisting of multiple React micro-frontends and ASP.NET and Serverless microservices. Piloted several core React, C# and Node.JS libraries which are used organization wide. Lead devops efforts across multiple projects as a lead on all things AWS infrastructure and CI/CD pipelines.",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
  {
    id: 2,
    name: "Software Engineer, Biomeme Inc.",
    description:
      "Biomeme is a biotechnology organization developing accessible, real-time molecular diagnostic platforms for applications in human health, defense, industrial processes and much more. As a Software Engineer, I contributed to the development of multiple internal and customer facing full-stack web applications, mobile applications and desktop applications.",
    startDate: "August 2019",
    endDate: "April 2021",
    accomplishments:
      "Developed a suite of regulatory compliant desktop application to automate a complex clinical laboratory workflow which allowed Biomeme's subsidiary laboratory to scale from a single Philadelphia location to dozens nationwide and increased sample processing capabailities by over 1000%. Architected and designed an organization wide intranet, administrative panel and central authentication system.",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
  {
    id: 3,
    name: "Software Engineer II, AbleTo Inc.",
    description:
      "AbleTo is a leading provider in virtual behavior healthcare, offering several web and mobile-based platforms for therapy and counseling. As a Software Engineer II on the Care Delivery team, I contributed to the full-stack development of multiple therapist and counselor facing full-stack web applications oriented around the administration of patient care services.",
    startDate: "April 2021",
    endDate: "September 2021",
    accomplishments:
      "Piloted a new content delivery microservice which integrated with a Contentful CMS, enabling the clinical psychology team to take full ownership over the management of complex patient care plan data, drastically improving program iteration rates.",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
];

export const EDUCATION_ENTRIES: Readonly<Array<IResumeEntry>> = [
  {
    id: 4,
    name: "BS Computer Science, Rutgers University",
    description: "Minors in Statistics, Mathematics and Sociology",
    startDate: "August 2015",
    accomplishments: null,
    endDate: "December 2019",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
  {
    id: 5,
    name: "Certificate, Rutgers Data Science Bootcamp",
    description:
      "While finishing up my undergraduate degree at Rutgers I simaltaneously completed a 12 week intensive data science bootcamp focused on exploratory data analysis and machine learning.",
    startDate: "August 2019",
    accomplishments: null,
    endDate: "December 2019",
    created: "01/01/1970",
    modified: "01/01/1970",
    type: "Work",
  },
];

export const SKILL_ENTRIES: Readonly<Array<IResumeSkill>> = [
  {
    id: 1,
    name: "TypeScript",
  },
  {
    id: 2,
    name: "JavaScript",
  },
  {
    id: 3,
    name: "C#",
  },
  {
    id: 4,
    name: "Python",
  },
  {
    id: 5,
    name: "Java",
  },
  {
    id: 6,
    name: "SQL",
  },
  {
    id: 7,
    name: "NoSQL",
  },
  {
    id: 8,
    name: "C",
  },
  {
    id: 9,
    name: "HTML",
  },
  {
    id: 10,
    name: "CSS",
  },
  {
    id: 11,
    name: "SCSS",
  },
  {
    id: 12,
    name: "React",
  },
  {
    id: 13,
    name: "React Native",
  },
  {
    id: 14,
    name: "Serverless",
  },
  {
    id: 15,
    name: "Express",
  },
  {
    id: 16,
    name: "ASP.NET",
  },
  {
    id: 17,
    name: "Flask",
  },
  {
    id: 18,
    name: "GraphQL",
  },
  {
    id: 19,
    name: "Vite",
  },
  {
    id: 20,
    name: "Webpack",
  },
  {
    id: 21,
    name: "Jest",
  },
  {
    id: 22,
    name: "Cypress",
  },
  {
    id: 23,
    name: "XUnit",
  },
  {
    id: 24,
    name: "PyTest",
  },
  {
    id: 25,
    name: "Git",
  },
  {
    id: 26,
    name: "AWS",
  },
  {
    id: 27,
    name: "GCP",
  },
  {
    id: 28,
    name: "Docker",
  },
  {
    id: 29,
    name: "CircleCI",
  },
  {
    id: 30,
    name: "AWS CDK",
  },
  {
    id: 31,
    name: "CloudFormation",
  },
  {
    id: 32,
    name: "Terraform",
  },
  {
    id: 33,
    name: "Blazor",
  },
  {
    id: 34,
    name: "Maui",
  },
];

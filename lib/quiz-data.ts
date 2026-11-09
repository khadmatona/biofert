/**
 * Branching logic only — locale-agnostic. Question/option display text and
 * recommendation copy live in `content/quiz/{locale}.json` and are resolved
 * by `QuizForm` via `useLocale()`, so the answers this file stores and
 * compares (`answers.who === "woman"`) stay stable across locales instead
 * of breaking when option labels get translated.
 */
export interface QuizQuestion {
  id: string;
  options: string[];
  /** Only shown when this returns true for the answers collected so far. */
  showIf?: (answers: Record<string, string>) => boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "age",
    options: ["under25", "25to29", "30to34", "35to39", "40plus"],
  },
  {
    id: "who",
    options: ["woman", "man", "both", "unsure"],
  },
  {
    id: "duration",
    options: ["lessThan1y", "1to2y", "2to4y", "moreThan4y"],
  },
  {
    id: "pregnancy",
    options: ["fullTerm", "oneMiscarriage", "multipleMiscarriages", "none"],
  },
  {
    id: "womanCause",
    options: [
      "pcos",
      "ovulationIssues",
      "lowOvarianReserve",
      "blockedTubes",
      "endometriosis",
      "hormonalIssues",
      "irregularCycles",
      "noDiagnosis",
      "other",
    ],
    showIf: (answers) => answers.who === "woman" || answers.who === "both",
  },
  {
    id: "manCause",
    options: [
      "lowSpermCount",
      "lowMotility",
      "morphologyIssues",
      "azoospermia",
      "varicocele",
      "hormonalIssues",
      "erectionEjaculationIssues",
      "noDiagnosis",
      "other",
    ],
    showIf: (answers) => answers.who === "man" || answers.who === "both",
  },
  {
    id: "exams",
    options: ["fullDiagnosis", "someExams", "priorTreatment", "notYet"],
  },
  {
    id: "goal",
    options: [
      "naturalPregnancy",
      "improveOvulation",
      "ovarianHealth",
      "spermCountMotility",
      "coupleFertility",
      "identifyBestSupport",
    ],
  },
];

export type QuizRecommendationKey = "bellafert" | "fertimen" | "packCouple";

export function getQuizRecommendationKey(answers: Record<string, string>): QuizRecommendationKey {
  switch (answers.who) {
    case "woman":
      return "bellafert";
    case "man":
      return "fertimen";
    default:
      return "packCouple";
  }
}

export const recommendationHrefs: Record<QuizRecommendationKey, string> = {
  bellafert: "/products/bellafert",
  fertimen: "/products/fertimen",
  packCouple: "/products/pack-couple",
};

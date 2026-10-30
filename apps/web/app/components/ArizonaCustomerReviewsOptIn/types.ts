export type SurveyOptIn = { render: (options: Record<string, unknown>) => void };
export type Gapi = { load: (name: string, callback: () => void) => void; surveyoptin: SurveyOptIn };

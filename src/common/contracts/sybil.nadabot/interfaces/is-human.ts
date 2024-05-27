export interface GetHumanScoreInput {
  account_id: string;
}

export interface HumanScoreResponse {
  is_human: boolean;
  score: number;
}

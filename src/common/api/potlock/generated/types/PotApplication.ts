import { PotApplicationStatusEnum } from "./PotApplicationStatusEnum";

 export type PotApplication = {
    /**
     * @description Application id.
     * @type integer
    */
    readonly id: number;
    /**
     * @description Application message.
     * @type string
    */
    message?: string | null;
    /**
     * @description Application status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `InReview` - InReview
    */
    status: PotApplicationStatusEnum;
    /**
     * @description Application submission date.
     * @type string, date-time
    */
    submitted_at: string;
    /**
     * @description Application last update date.
     * @type string, date-time
    */
    updated_at: string;
    /**
     * @description Transaction hash.
     * @type string
    */
    tx_hash: string;
    /**
     * @description Pot applied to.
     * @type string
    */
    pot: string;
    /**
     * @description Account that applied to the pot.
     * @type string
    */
    applicant: string;
};
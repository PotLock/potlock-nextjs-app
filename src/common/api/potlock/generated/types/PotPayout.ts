export type PotPayout = {
    /**
     * @description Payout id.
     * @type integer
    */
    readonly id: number;
    /**
     * @description Payout amount.
     * @type string
    */
    amount: string;
    /**
     * @description Payout amount in USD.
     * @type string, decimal
    */
    amount_paid_usd?: string | null;
    /**
     * @description Payout date.
     * @type string, date-time
    */
    paid_at: string;
    /**
     * @description Transaction hash.
     * @type string
    */
    tx_hash: string;
    /**
     * @description Pot that this payout is for.
     * @type string
    */
    pot: string;
    /**
     * @description Payout recipient.
     * @type string
    */
    recipient: string;
    /**
     * @description Payout FT.
     * @type string
    */
    ft: string;
};
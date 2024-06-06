export type StatsResponse = {
    /**
     * @type number, double
    */
    total_donations_usd: number;
    /**
     * @type number, double
    */
    total_payouts_usd: number;
    /**
     * @type integer
    */
    total_donations_count: number;
    /**
     * @type integer
    */
    total_donors_count: number;
    /**
     * @type integer
    */
    total_recipients_count: number;
};
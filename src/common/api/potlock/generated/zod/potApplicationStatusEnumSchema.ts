import { z } from "zod";

 /**
 * @description * `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `InReview` - InReview
 */
export const potApplicationStatusEnumSchema = z.enum(["Pending", "Approved", "Rejected", "InReview"]).describe("* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `InReview` - InReview");
import { z } from "zod";

 /**
 * @description * `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `Graylisted` - Graylisted\n* `Blacklisted` - Blacklisted
 */
export const defaultRegistrationStatusEnumSchema = z.enum(["Pending", "Approved", "Rejected", "Graylisted", "Blacklisted"]).describe("* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `Graylisted` - Graylisted\n* `Blacklisted` - Blacklisted");
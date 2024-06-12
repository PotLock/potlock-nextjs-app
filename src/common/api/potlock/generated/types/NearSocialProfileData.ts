import { Image } from "./Image";
import { Linktree } from "./Linktree";

export type NearSocialProfileData = {
  /**
   * @type string | undefined
   */
  name?: string;
  image?: Image;
  backgroundImage?: Image;
  /**
   * @type string | undefined
   */
  description?: string;
  linktree?: Linktree;
  /**
   * @type string | undefined
   */
  plPublicGoodReason?: string;
  /**
   * @description JSON-stringified array of category strings
   * @type string | undefined
   */
  plCategories?: string;
  /**
   * @description JSON-stringified array of URLs
   * @type string | undefined
   */
  plGithubRepos?: string;
  /**
   * @description JSON-stringified object with chain names as keys that map to nested objects of contract addresses
   * @type string | undefined
   */
  plSmartContracts?: string;
  /**
   * @description JSON-stringified array of funding source objects
   * @type string | undefined
   */
  plFundingSources?: string;
  /**
   * @description JSON-stringified array of team member account ID strings
   * @type string | undefined
   */
  plTeam?: string;
};

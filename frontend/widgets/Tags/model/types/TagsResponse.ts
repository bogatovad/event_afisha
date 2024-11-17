import {Tag} from "@/entities/Tag";

/**
 * Type of GET tags response
 */
export type TagsResponse = {
  status: number;
  data: Tag[];
};

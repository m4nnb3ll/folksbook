// CONSTANTS
import { userCircle } from "../constants/links";

// checks if there is a imgUrl or not
export default function imgBgURL (imgURL, user="true") {
  return  imgURL
            ? `linear-gradient(#0000, #0007), url(${imgURL})`
            : `linear-gradient(${ user ? "#0000, #0007" : "#0007, #0000" }), url(${ user ? userCircle : "" })`};
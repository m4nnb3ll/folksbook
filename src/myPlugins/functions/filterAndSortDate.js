import { isEmpty } from "react-redux-firebase";

export default function filterAndSortDate(arr, params={}) {
  const { asc } = params;
  return (
    arr
    .filter(arrElement => !isEmpty(arrElement)) // filter falsy out
    // REPLACED ">" & "<" with "-", to make it work on chrome
    .sort((a, b) => asc ? b.createdAt.seconds - a.createdAt.seconds : b.createdAt.seconds - a.createdAt.seconds )
  );
}
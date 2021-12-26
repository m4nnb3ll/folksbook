// FUNCTIONS
import spreadObj from "./spreadObj";

export default function findUser(users, str) {
  if(str) {
    users = spreadObj(users, { withId: true });
    const usersToShow = users.filter(({ firstname, lastname }) => {
      const fullname = `${firstname}${lastname}`;
      return new RegExp(str.replace(" ",""), "i").test(fullname)
    })

    return usersToShow;
  } else {
    return [];
  }
}
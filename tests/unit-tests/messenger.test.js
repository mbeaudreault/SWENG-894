import 'jest';
import  { addToData, getData } from "../../src/messenger";


it ("addToData Test", () => {
  const numLikesBefore =  getData("is_liked");
  addToData("is_liked");
  const numLikesAfter =  getData("is_liked");
  //expect(numLikesBefore).toBe(numLikesAfter - 1);
});

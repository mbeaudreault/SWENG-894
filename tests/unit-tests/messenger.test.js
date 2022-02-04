import 'jest';
import  { addToData, getData } from "../../src/messenger";


it ("addToData Test", () => {
  const numLikesBefore =  getData("numLikes");
  addToData("numLikes");
  const numLikesAfter =  getData("numLikes");
  expect(numLikesBefore).toBe(numLikesAfter - 1);
});

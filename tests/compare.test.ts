import expect from "expect";
import {areSimilar} from "../lib";

it('areSimilar: compare with Date objects', () => {
  expect(areSimilar(new Date(), new Date())).toBe(true);
  expect(areSimilar(new Date('10/10/10'), new Date())).toBe(false);
});

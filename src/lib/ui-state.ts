import { scrollTo } from "./smooth-scroll";

/** Run a product card's call-to-action. */
export function runAction(a: { target: string }) {
  scrollTo(a.target, -80);
}

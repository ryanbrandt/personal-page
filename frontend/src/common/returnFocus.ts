/**
 * Where focus returns when a detail view closes by going back to a page
 * that remounts: a project's dialog opened from the home page closes with
 * history back, and the home page's grid then focuses that project's card
 * again (useFocusReturnTarget) instead of its heading taking focus.
 *
 * The target is the path of the link to focus. Taking it clears it.
 */
let returnTarget: string | undefined;

/** Remembers the link (its path) to focus on the page being returned to. */
export const rememberReturnTarget = (path: string): void => {
  returnTarget = path;
};

/** Whether a return target is waiting for the page being returned to. */
export const hasReturnTarget = (): boolean => returnTarget !== undefined;

/** The return target, if any, which is then cleared. */
export const takeReturnTarget = (): string | undefined => {
  const target = returnTarget;
  returnTarget = undefined;
  return target;
};

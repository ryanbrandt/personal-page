/**
 * The page a path shows: its first segment, so "/work" and a project's
 * "/work/:slug" are the same page ("work") and "/" is "".
 */
export const pageOf = (pathname: string): string => pathname.split("/")[1];

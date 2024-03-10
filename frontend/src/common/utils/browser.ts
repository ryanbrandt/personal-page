/**
 * Utility to safely open a new window without target=_blank vulnerability
 *
 * @param url The url for the new window
 */
export function safeOpenWindow(url: string | null): void {
  if (url) {
    const newWindow = window.open(url);

    if (newWindow) {
      newWindow.opener = null;
    }
  }
}

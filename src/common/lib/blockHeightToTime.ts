export const fetchTimeByBlockHeight = async (
  blockHeight: number,
): Promise<string> => {
  if (!blockHeight) {
    return "unknown";
  }

  try {
    const res = await fetch(
      `https://api.near.social/time?blockHeight=${blockHeight}`,
    );
    if (!res.ok || res.status !== 200) {
      return "unknown";
    }

    const timeMs = parseFloat(await res.text());
    const date = new Date(timeMs);
    const dateNow = new Date();

    const timeAgo = (diffSec: number) =>
      diffSec < 60000
        ? `${(diffSec / 1000) | 0}s`
        : diffSec < 3600000
          ? `${(diffSec / 60000) | 0}m`
          : diffSec < 86400000
            ? `${(diffSec / 3600000) | 0}h`
            : date.getFullYear() === dateNow.getFullYear()
              ? date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

    return timeAgo(dateNow.getTime() - timeMs);
  } catch (error) {
    console.error("Error fetching time:", error);
    return "unknown";
  }
};

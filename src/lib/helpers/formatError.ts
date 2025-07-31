export function parseErrorToString(error: unknown): string {
  const messages: string[] = [];

  function formatCamelCaseToReadable(text: string): string {
    return text
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  function extractMessages(err: unknown, parentKey?: string): void {
    if (!err) return;

    if (typeof err === "string") {
      const readable = formatCamelCaseToReadable(err);
      if (parentKey) {
        messages.push(`${formatCamelCaseToReadable(parentKey)}: ${readable}`);
      } else {
        messages.push(readable);
      }
    } else if (Array.isArray(err)) {
      err.forEach((item) => extractMessages(item, parentKey));
    } else if (typeof err === "object") {
      for (const key in err as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(err, key)) {
          const value = (err as Record<string, unknown>)[key];
          extractMessages(value, key);
        }
      }
    } else {
      messages.push(String(err));
    }
  }

  extractMessages(error);

  return messages.join(", ");
}

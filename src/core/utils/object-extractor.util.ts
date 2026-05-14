export class ObjectExtractor {
  /**
   * Wyciąga wartość z obiektu na podstawie ścieżki kropkowej (dot notation)
   * Przykład: extract({ a: { b: 5 } }, "a.b") -> 5
   */
  static extractValueByPath(obj: unknown, path: string | undefined): unknown {
    if (!path || obj === null || obj === undefined) return obj;

    // Przekształca ścieżki typu "data[0].value" na "data.0.value"
    const cleanPath = path.replace(/\[(\d+)\]/g, '.$1');
    const parts = cleanPath.split('.');

    let current: unknown = obj;

    for (const part of parts) {
      if (
        current === null ||
        current === undefined ||
        typeof current !== 'object'
      ) {
        return undefined;
      }

      // Bezpieczne rzutowanie na obiekt z kluczami, aby ESLint nie zgłaszał błędu
      const currentObject = current as Record<string, unknown>;
      current = currentObject[part];
    }

    return current;
  }
}

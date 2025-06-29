export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US');
}

export function parseDate(dateString: string): Date {
    const parts = dateString.split('/');
    return new Date(+parts[2], +parts[0] - 1, +parts[1]);
}

export function isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
}
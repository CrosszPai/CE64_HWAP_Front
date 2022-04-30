export function shortenFileName(n: string, len = 8): string {
	const ext = n.substring(n.lastIndexOf('.') + 1, n.length).toLowerCase();
	let filename = n.replace('.' + ext, '');
	if (filename.length <= len) {
		return n;
	}
	filename = filename.substr(0, len) + (n.length > len ? '[...]' : '');
	return filename + '.' + ext;
}

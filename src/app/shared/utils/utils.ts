export const getInitials = (name: string = ''): string  =>{
    const words = name.trim().split(' ');

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}

export const getAvatarText = (text: string | undefined): string => {
    if (!text) return '';
    const words = text.split(' ');
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');

    return initials;
};

const MAX_LENGTH = 5;

export const generateCustomId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length: MAX_LENGTH }, 
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  };

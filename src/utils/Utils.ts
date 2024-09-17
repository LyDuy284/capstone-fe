export const truncatedText = (text: string) => {
  return text.length > 50 ? `${text.slice(0, 30)}...` : text;
};

export const getFilterPrice = (value: number) => {
  switch (value) {
    case 1:
      return [0, 5000000];
    case 2:
      return [5000000, 10000000];
    case 3:
      return [10000000, 15000000];
    case 4:
      return [15000000, 20000000];
    case 5:
      return [20000000, 0];
    default:
      return [0, 5000000];
  }
};

export const getLabel = (value: number): string => {
  if (value >= 0 && value < 1) {
    return 'Kém';
  } else if (value >= 1 && value < 2) {
    return 'Trung bình';
  } else if (value >= 2 && value < 3) {
    return 'Ok';
  } else if (value >= 3 && value < 4) {
    return 'Tốt';
  } else if (value >= 4 && value <= 5) {
    return 'Tuyệt vời';
  } else {
    return '';
  }
};

export const formatFileSize = (
  sizeInKiloBytes: number,
  fractionDigit: number = 2,
  shortDescription: boolean = true,
) => {
  if (sizeInKiloBytes < 1000) {
    return `${sizeInKiloBytes.toFixed(fractionDigit)} ${
      shortDescription ? 'KB' : 'Kilobytes'
    }`;
  }
  if (sizeInKiloBytes < 1000000) {
    return `${Math.round(sizeInKiloBytes / 1000)} ${
      shortDescription ? 'MB' : 'Megabytes'
    }`;
  }
  return `${Math.round(sizeInKiloBytes / 1000000)} ${
    shortDescription ? 'GB' : 'Gigabytes'
  }`;
};

export const formatFileDate = (date: Date) => {
  return `${date.toLocaleDateString()} ${date
    .toLocaleTimeString()
    .slice(0, -3)}`;
};

export const getUrlExtension = (url: string) =>
  url.split(/[#?]/)[0].split('.').pop().trim();

import { Maybe } from '@/gql/graphql';

interface MediaSizesProps {
  [key: string]: {
    sourceUrl: string;
    width: number;
    height: number;
  };
}

export const getMediaSize = (
  sizeSlug: Maybe<string> | undefined,
  sizes: MediaSizesProps | undefined
) => {
  if (!sizeSlug || !sizes) return undefined;
  return sizes[sizeSlug];
}

export const getSizesAttribute = (
  sizeSlug: Maybe<string> | undefined,
  sizes: MediaSizesProps | undefined
) => {
  if (!sizeSlug || !sizes) return undefined;
  const size = sizes[sizeSlug];
  return size ? { ...size } : undefined;
}

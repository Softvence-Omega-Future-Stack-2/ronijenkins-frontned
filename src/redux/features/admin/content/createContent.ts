import { gql } from '@apollo/client';

export const CREATE_CONTENT = gql`
  mutation createContent(
    $input: CreateContentInput!
    $thumbnail: Upload
    $video: Upload
  ) {
    createContent(input: $input, thumbnail: $thumbnail, video: $video) {
      id
      name
      slug
      thumbnail
      videoUrl
    }
  }
`;
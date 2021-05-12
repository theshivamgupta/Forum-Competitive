import { gql } from "@apollo/client";
import { userFields, gridPostFields } from "./fragments";

export const CHECK_IF_USERNAME_TAKEN = gql`
  query checkIfUsernameTaken($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;

export const GET_USER_EMAIL = gql`
  query getUserEmail($input: String!) {
    users(
      where: {
        _or: [{ username: { _eq: $input } }, { phone_number: { _eq: $input } }]
      }
    ) {
      email
    }
  }
`;

export const GET_EDIT_USER_PROFILE = gql`
  query getEditUserProfile($id: uuid!) {
    users_by_pk(id: $id) {
      id
      username
      name
      email
      bio
      profile_image
      website
      phone_number
      codeforces_handle
      codeforces_rating
    }
  }
`;

export const SEARCH_USERS = gql`
  query searchUsers($query: String) {
    users(
      where: {
        _or: [{ username: { _ilike: $query } }, { name: { _ilike: $query } }]
      }
    ) {
      ...userFields
    }
  }
  ${userFields}
`;

export const GET_USER_PROFILE = gql`
  query getUserProfile($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      name
      username
      website
      bio
      codeforces_handle
      codeforces_rating
      profile_image
      banner
      followers {
        user {
          id
          user_id
          profile_image
          name
          username
          banner
        }
      }
      followings {
        user {
          id
          user_id
          profile_image
          name
          username
          banner
        }
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
      followers_aggregate {
        aggregate {
          count
        }
      }
      followings_aggregate {
        aggregate {
          count
        }
      }
      saved_posts(order_by: { created_at: desc }) {
        post {
          ...gridPostFields
        }
      }
      posts(order_by: { created_at: desc }) {
        ...gridPostFields
        created_at
      }
    }
  }
  ${gridPostFields}
`;

// suggest users from followers and also users created around the same time
export const SUGGEST_USERS = gql`
  query suggestUsers(
    $limit: Int!
    $followerIds: [uuid!]!
    $createdAt: timestamptz!
  ) {
    users(
      limit: $limit
      where: {
        _or: [
          { id: { _in: $followerIds } }
          { created_at: { _gt: $createdAt } }
        ]
      }
    ) {
      ...userFields
    }
  }
  ${userFields}
`;

// posts with the most likes and comments at the top, newest to oldest where the posts are not from users we are following
export const EXPLORE_POSTS = gql`
  query explorePosts($feedIds: [uuid!]!) {
    posts(
      order_by: {
        created_at: desc
        likes_aggregate: { count: desc }
        comments_aggregate: { count: desc }
      }
      where: { user_id: { _nin: $feedIds } }
    ) {
      ...gridPostFields
    }
  }
  ${gridPostFields}
`;

export const GET_MORE_POSTS_FROM_USER = gql`
  query getMorePostsFromUser($userId: uuid!, $postId: uuid!) {
    posts(
      limit: 6
      where: { user_id: { _eq: $userId }, _not: { id: { _eq: $postId } } }
    ) {
      ...gridPostFields
    }
  }
  ${gridPostFields}
`;

export const GET_POST = gql`
  query getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
      id
      user {
        id
        username
        profile_image
      }
    }
  }
`;

export const GET_FEED = gql`
  query getFeed($limit: Int!, $feedIds: [uuid!]!, $lastTimestamp: timestamptz) {
    posts(
      limit: $limit
      where: { user_id: { _in: $feedIds }, created_at: { _lt: $lastTimestamp } }
      order_by: { created_at: desc }
    ) {
      id
      caption
      created_at
      media
      location
      user {
        id
        username
        name
        profile_image
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
      likes {
        id
        user_id
      }
      saved_posts {
        id
        user_id
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(order_by: { created_at: desc }, limit: 2) {
        id
        content
        created_at
        user {
          username
        }
      }
    }
  }
`;

export const GET_FEED_ALL = gql`
  query getFeedAll($type: String!) {
    posts(order_by: { created_at: desc }, where: { type: { _eq: $type } }) {
      id
      caption
      created_at
      media
      location
      type
      user {
        id
        username
        name
        profile_image
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
      likes {
        id
        user_id
      }
      saved_posts {
        id
        user_id
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(order_by: { created_at: desc }, limit: 2) {
        id
        content
        created_at
        user {
          username
        }
      }
    }
  }
`;

export const GET_LAST_LOGIN = gql`
  query getLastLogin($input: String!) {
    users(where: { username: { _eq: $input } }) {
      username
      last_login
    }
  }
`;

export const GET_HANDLES = gql`
  query fetchHandles {
    users {
      id
      profile_image
      codeforces_handle
      codeforces_rating
      username
    }
  }
`;

export const GET_FRIENDS_HANDLE = gql`
  query fetchFriendsHandle($userId: uuid!) {
    followings(where: { user_id: { _eq: $userId } }) {
      id
      user {
        id
        codeforces_rating
        codeforces_handle
        profile_image
        username
      }
    }
  }
`;

export const FETCH_POST = gql`
  query getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
      caption
      media
    }
  }
`;

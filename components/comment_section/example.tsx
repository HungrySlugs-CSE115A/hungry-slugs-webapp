import { CommentData } from './comment';

export const getComments = async (): Promise<CommentData[]> => {
  return [
    {
      id: "1",
      body: "First comment",
      username: "Jack",
      user_id: "1",
      parent_id: null,
      time_posted: "2021-08-16T23:00:33.010+02:00",
    },
    {
      id: "2",
      body: "Second comment",
      username: "John",
      user_id: "2",
      parent_id: null,
      time_posted: "2021-08-16T23:00:33.010+02:00",
    },
    {
      id: "3",
      body: "First comment first child",
      username: "John",
      user_id: "2",
      parent_id: "1",
      time_posted: "2021-08-16T23:00:33.010+02:00",
    },
    {
      id: "4",
      body: "Second comment second child",
      username: "John",
      user_id: "2",
      parent_id: "2",
      time_posted: "2021-08-16T23:00:33.010+02:00",
    },
  ];
};

export const createComment = async (text: string, parentId: string | null = null): Promise<CommentData> => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    body: text,
    parent_id: parentId,
    user_id: "1",
    username: "John",
    time_posted: new Date().toISOString(),
  };
};

export const updateComment = async (text: string): Promise<{ text: string }> => {
  return { text };
};

export const deleteComment = async (comment_id: string): Promise<{}> => {
  return {};
};
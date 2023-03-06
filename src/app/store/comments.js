import { createAction, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsResceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        createComments: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
            // state.isLoading = false;
        },
        createCommentsFailed: (state, action) => {
            state.error = action.payload;
        },

        removeComments: (state, action) => {
            state.entities = state.entities.filter(
                (c) => c._id !== action.payload
            );
        },
        removeCommentsFailed: (state, action) => {
            state.error = action.payload;
        }
    }
});
const createCommentRequested = createAction("comments/createCommentRequested");
const removeCommentRequested = createAction("comments/removeCommentRequested");
const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsResceived,
    createComments,
    createCommentsFailed,
    removeCommentsFailed,
    removeComments,
    commentsRequestFailed
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsResceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};
export const createComment = (data) => async (dispatch) => {
    dispatch(createCommentRequested());
    const comment = {
        ...data,
        _id: nanoid(),

        created_at: Date.now()
    };
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(createComments(content));
    } catch (error) {
        dispatch(createCommentsFailed(error.message));
    }
};
export const removedComment = (id) => async (dispatch) => {
    dispatch(removeCommentRequested());
    try {
        const { content } = await commentService.removeComment(id);
        if (content === null) {
            dispatch(removeComments(id));
        }
    } catch (error) {
        dispatch(removeCommentsFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;

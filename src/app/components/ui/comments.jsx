import { orderBy } from "lodash";
import React, { useEffect } from "react";
import CommentsList, { AddCommentForm } from "../common/comments";
import {
    createComment,
    getComments,
    getCommentsLoadingStatus,
    loadCommentsList,
    removedComment
} from "../../store/comments";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCurrentUserId } from "../../store/users";

const Comments = () => {
    const { userId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());
    const dispatch = useDispatch();
    const isLoading = useSelector(getCommentsLoadingStatus());
    useEffect(() => {
        dispatch(loadCommentsList(userId));
    }, [userId]);

    const comments = useSelector(getComments());
    const handleSubmit = (data) => {
        dispatch(
            createComment({ ...data, pageId: userId, userId: currentUserId })
        );
    };

    const handleRemoveComment = (id) => {
        dispatch(removedComment(id));
        console.log(id);
    };
    const sortedComments = orderBy(comments, ["created_at"], ["desc"]);
    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {!isLoading ? (
                            <CommentsList
                                comments={sortedComments}
                                onRemove={handleRemoveComment}
                            />
                        ) : (
                            "loading..."
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Comments;

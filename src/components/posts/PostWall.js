import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import Post from "../posts/Post";
import CommentPannel from '../pannels/CommentPannel';
import Comment from "../pannels/Comment";
import NotFound from "../special/NotFound";
// ACTIONS
import { toggleLike, deletePost, createComment, deleteComment } from "../../store/actions/postActions";
import { showModal } from "../../store/actions/modalActions";
// FUNCTIONS
import filterAndSortDate from "../../myPlugins/functions/filterAndSortDate";
// CONSTANTS
import deletedUser from '../../myPlugins/constants/deletedUser';

const PostWall = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;
  
  const {
    deletePost
    , createComment
    , deleteComment
    , firebaseAuth
    , firebaseProfile
    , history
    , post
    , toggleLike
    , users
    , showModal
  } = props;

  // made a variable to not call "isLoaded" multiple times
  const postIsLoaded = isLoaded(post);

  if(postIsLoaded && isEmpty(post)) {
    // if a post was not found
    return <NotFound/>
  }

  const myUid = firebaseAuth.uid;

  const {
    firstname
    , lastname
    , profileImgURL
  }= postIsLoaded && (users[post.ownerId] || deletedUser );

  const {
    comments
    , createdAt
    , imgs
    , likes
    , ownerId
    , id
    , text
  } = postIsLoaded && post;

  return postIsLoaded
    ? (
        <div className="container med owl-stacker-3">
          <Post
            commentsCount={ comments ? comments.length : 0 }
            createdAt={ createdAt }
            deletePost={ 
              myUid === post.ownerId
                ? showModal.bind(
                    this
                    , "You are about to delete your post!"
                    , {
                        sideFunction: deletePost.bind(this, post.id)
                        , choice: true, danger: true
                      }
                  )
                : false
            }
            history={ history }
            imgs={ imgs }
            likes={ likes ? likes : [] }
            myUid = { myUid }
            notListItem = { true }
            ownerFirstname={ firstname }
            ownerId={ ownerId }
            ownerLastname={ lastname }
            ownerLink={ `/profile/${ ownerId }` }
            postId={ id }
            profileImgURL={ profileImgURL }
            text={ text }
            toggleLike = { toggleLike }
          />
          <CommentPannel
            postOwnerId={ ownerId }
            postId={ id }
            showModal={ showModal }
            createComment={ createComment }
            myUid={ myUid }
            firebaseProfile={ firebaseProfile }
          />
          <ul className="comments owl-stacker-2">
            {
              isLoaded(users)
                ? isEmpty(post.comments)
                  ? <div>No comments yet...</div>
                  : filterAndSortDate(post.comments)
                    .map((comment) => {
                      return (
                        <Comment
                          key={comment.id}
                          comment={comment}
                          user={ users[comment.ownerId] }
                          deleteComment={ 
                            myUid === comment.ownerId
                              ? showModal.bind(
                                  this
                                  , "You are about to delete your comment!"
                                  , {
                                      sideFunction: deleteComment.bind(this, comment)
                                      , choice: true, danger: true
                                    }
                                )
                              : false
                          }
                        />
                      );
                    })
                : <div className="loading-circle"></div>
            }
          </ul>
        </div>
      )
    : <div className="loading-circle"></div>
}


const mapStateToProps = (state) => {

  const { auth , profile } = state.firebase;
  const { users, post } = state.firestore.data;

  return {
    firebaseAuth: auth
    , firebaseProfile: profile
    , users
    , post
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleLike: (likeObj) => dispatch(toggleLike(likeObj))
  , deletePost: (postId) => dispatch(deletePost(postId))
  , deleteComment: (comment) => dispatch(deleteComment(comment))
  , showModal: (content, params) => dispatch(showModal(content, params))
  , createComment: (comment) => dispatch(createComment(comment))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect((props) => {

    const { postOwnerId, postId } = props.match.params;

    return (
      [
        { collection: "users" }
        , { 
            collection: "posts"
            , doc: postOwnerId
            , subcollections: [
              { collection: "docs", doc: postId }
            ]
            , storeAs: "post"
          }
      ]
    );
  })
)(PostWall);
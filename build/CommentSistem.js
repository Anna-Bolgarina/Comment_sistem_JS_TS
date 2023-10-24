"use strict";
class CommentSystem {
  constructor() {
    if (!localStorage.getItem("DATA")) {
      this.DATA = '{"user": {}, "history": []}';
      localStorage.setItem("DATA", this.DATA);
    } else {
      this.DATA = localStorage.getItem("DATA");
    }
    this.userNewComment = new NewComment();
    this.numberComments = 0;
  }
  getUser(nickName, ava) {
    const userAvatar = document.querySelector(".user__avatar");
    if (userAvatar !== null) userAvatar.setAttribute("src", ava);
    const userName = document.querySelector(".user__name");
    if (userName !== null) userName.innerHTML = nickName;
    const data = this.getDATA();
    data.user = {
      userName: nickName,
      userAvatar: ava,
      favorites:
        data.user.favorites === undefined ||
        Object.keys(data.user.favorites).length === 0
          ? {}
          : data.user.favorites,
    };
    localStorage.setItem("DATA", JSON.stringify(data));
    const comment = new CommentFlow(this.userNewComment);
  }
  getUserName() {
    const userNameElement = document.querySelector(".user__name");
    if (userNameElement) {
      const userName = userNameElement.innerHTML;
      return userName;
    }
  }
  getUserAvatar() {
    const userAvatarElement = document.querySelector(".user__avatar");
    if (userAvatarElement !== null) {
      const userAvatar = userAvatarElement.getAttribute("src");
      return userAvatar;
    }
  }
  newCommentHidden(bool) {
    const newComment = document.querySelector(".comment__new");
    if (bool) {
      if (newComment) newComment.style.display = "none";
    } else {
      if (newComment) newComment.style.display = "flex";
    }
  }
  getDATA() {
    const currentData = localStorage.getItem("DATA");
    if (currentData) {
      const parseData = JSON.parse(currentData);
      if (Object.keys(parseData).includes("history")) {
        return parseData;
      }
    }
  }
  getCurrentDate() {
    const date = new Date();
    const fullDate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
    const displayDate = `${date.getDate()}.${date.getMonth()}  ${date.getHours()}:${date.getMinutes()}`;
    return {
      fullDate: fullDate,
      displayDate: displayDate,
    };
  }
  addHistoryComments(commentBlock) {
    const currentData = this.getDATA();
    currentData.history.push(commentBlock);
    localStorage.setItem("DATA", JSON.stringify(currentData));
  }
  updateHistoryReply(commentNamb, replyNamb, replyBlock) {
    const currentData = this.getDATA();
    currentData.history.forEach((commentBlock) => {
      if (+commentBlock.commentNamb === commentNamb) {
        commentBlock.replyes[`reply_${replyNamb}`] = replyBlock;
      }
    });
    localStorage.setItem("DATA", JSON.stringify(currentData));
  }
  updateNumberComments() {
    const numberCommentsElement = document.querySelector(".comment-all__count");
    this.numberComments = this.getNumberComments();
    if (numberCommentsElement)
      numberCommentsElement.innerHTML = `(${this.numberComments})`;
  }
  getNumberComments() {
    return Object.keys(this.getDATA().history).length;
  }
}
